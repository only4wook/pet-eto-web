import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIP, isAdmin } from "../../../../lib/security";
import { PET_AI_PERSONA, IMAGE_ANALYSIS_CONFIG, SAFETY_SETTINGS } from "../../../../lib/aiPrompts";
import { buildSymptomChecklistKo, TOTAL_SYMPTOMS } from "../../../../lib/symptomTaxonomy";

/**
 * 피드 포스트 AI 재분석 엔드포인트 (관리자 전용)
 *
 * 배경: 과거에 Gemini API 키 무효 기간 동안 업로드된 포스트들은
 *   analyze-image 호출이 실패한 뒤 analyzeSymptoms() 키워드 매칭만 돌아서
 *   증상 키워드가 description 에 없으면 전부 "normal" 로 저장됐음.
 *   결과: 사진에 명백한 증상이 있어도 "건강합니다" 가짜 진단이 뜸 (false-negative).
 *
 * 이 엔드포인트는 기존 포스트의 image_url 을 Gemini 에 다시 태워서
 *   analysis_result 를 실제 진단으로 덮어쓴다.
 *
 * 호출:
 *   POST /api/admin/reanalyze-feed
 *   Body: { password, feedIds?: string[], mode?: "suspicious" | "all", limit?: number }
 *
 *   - feedIds 지정: 그 포스트만 재분석
 *   - mode="suspicious": 기존 severity=normal + symptoms 비어있는 것 우선 (오분류 의심)
 *   - mode="all": 시드 제외 전체
 *   - limit: 한 번 호출당 최대 처리 수 (Gemini 쿼터 보호, 기본 10)
 */

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";

interface ReanalyzeOptions {
  geminiKey: string;
  model: string;
}

/**
 * 응답 완전성 판정.
 *   - 너무 짧으면 (분석 부실)
 *   - 또는 비용/예상비/병원 섹션 미포함 (Gemini 가 중간에 끊긴 응답)
 *   → false → 호출부에서 재시도
 */
function isAnalysisComplete(text: string): boolean {
  if (text.length < 500) return false;
  // 비용 섹션 키워드 — 한·영 둘 다 허용
  const hasCost = /💰|예상\s*비용|예상\s*진료|예상\s*치료|expected\s*cost/i.test(text);
  // 병원 방문 기준 키워드
  const hasVet = /🏥|병원\s*방문|동물병원|vet\s*visit/i.test(text);
  return hasCost && hasVet;
}

async function callGeminiOnce(
  imageBase64: string,
  mimeType: string,
  systemText: string,
  userContext: string,
  opts: ReanalyzeOptions
): Promise<string> {
  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${opts.geminiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType, data: imageBase64 } },
              { text: userContext },
            ],
          },
        ],
        generationConfig: IMAGE_ANALYSIS_CONFIG,
        safetySettings: SAFETY_SETTINGS,
      }),
    }
  );

  if (!geminiRes.ok) {
    throw new Error(`gemini ${geminiRes.status}: ${(await geminiRes.text()).slice(0, 200)}`);
  }

  const data = await geminiRes.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const finishReason = data?.candidates?.[0]?.finishReason;
  if (finishReason && finishReason !== "STOP") {
    console.warn(`[reanalyze] finishReason=${finishReason}, len=${text.length}`);
  }
  return text;
}

async function reanalyzeOne(
  post: { id: string; image_url: string; pet_species: string; description: string },
  opts: ReanalyzeOptions
): Promise<{ analysis: string; severity: "normal" | "mild" | "moderate" | "urgent" }> {
  const species: "cat" | "dog" = post.pet_species === "dog" ? "dog" : "cat";
  const animalName = species === "cat" ? "고양이" : "강아지";

  // 저장된 이미지 다운로드
  const imgRes = await fetch(post.image_url);
  if (!imgRes.ok) throw new Error(`image fetch ${imgRes.status}`);
  const buf = Buffer.from(await imgRes.arrayBuffer());
  const base64 = buf.toString("base64");
  const mimeType = imgRes.headers.get("content-type") || "image/jpeg";

  const checklist = buildSymptomChecklistKo(species);
  const systemText =
    PET_AI_PERSONA +
    `\n\n## 지금 주어진 과제: 피드 이미지 재분석 (P.E.T ${TOTAL_SYMPTOMS}-증상 체크)\n` +
    `보호자가 올린 사진을 매우 꼼꼼히 분석하세요. ` +
    `눈 분비물·침 흘림·피부 이상·자세 이상·행동 이상 등 사소한 신호도 놓치지 말 것.\n` +
    `\n## 답변 필수 섹션 (모두 포함, 순서 유지, 중간에 끊지 말 것)\n` +
    `1) 🔍 **부위별 스캔**\n` +
    `2) 🩺 **종합 의심 증상** (3~5가지)\n` +
    `3) ⚡ **심각도**: normal/mild/moderate/urgent (반드시 enum 한 단어)\n` +
    `4) 🏠 **지금 집에서 할 것** (구체 4~5단계)\n` +
    `5) 🏥 **병원 방문 기준** (즉시/24h/3일 등 시점)\n` +
    `6) 💰 **예상 비용** (한국 시세 — 초진/검사/입원 각각, 마지막 섹션이지만 절대 생략·축약 금지)\n` +
    `\n위 6개 섹션 중 하나라도 빠지거나 중간에 끊기면 응답이 불완전하다고 간주됩니다. 반드시 마지막 비용 섹션까지 완성해서 출력하세요.\n\n` +
    checklist;

  const userContext = `보호자가 ${animalName} 사진을 올렸습니다.\n보호자 설명: "${post.description.slice(0, 500)}"\n\n사진을 꼼꼼히 보고 이상 소견을 빠뜨리지 말고 6개 섹션 모두 끝까지 진단해주세요. 특히 마지막 💰 예상 비용 섹션은 반드시 한국 시세(초진비, 검사비, 입원비 등)로 구체적으로 명시하세요.`;

  // 1차 시도
  let analysis = await callGeminiOnce(base64, mimeType, systemText, userContext, opts);

  // 응답 불완전 시 1회 재시도 (Gemini 응답 길이 변동성 대응)
  if (!isAnalysisComplete(analysis)) {
    console.warn(`[reanalyze] incomplete response (len=${analysis.length}), retrying once...`);
    const retryUserContext = userContext + `\n\n(이전 응답이 너무 짧거나 비용 섹션이 누락됐습니다. 이번엔 6개 섹션을 끝까지 빠짐없이 작성해주세요.)`;
    const retry = await callGeminiOnce(base64, mimeType, systemText, retryUserContext, opts);
    // 더 긴 쪽 채택 (재시도가 또 짧으면 1차 결과 유지)
    if (retry.length > analysis.length) {
      analysis = retry;
    }
  }

  if (!analysis) throw new Error("empty analysis");

  // severity 추출 (analyze-image/route.ts 와 동일 규칙)
  const labelMatch = analysis.match(
    /(?:심각도|severity)\s*[*:\-—\s]*\s*(normal|mild|moderate|urgent)\b/i
  );
  let severity: "normal" | "mild" | "moderate" | "urgent" = "normal";
  if (labelMatch) {
    severity = labelMatch[1].toLowerCase() as typeof severity;
  } else if (/🚨|긴급/.test(analysis)) severity = "urgent";
  else if (/⚠️/.test(analysis) && /주의/.test(analysis)) severity = "moderate";
  else if (/💡/.test(analysis) && /관찰 필요/.test(analysis)) severity = "mild";

  return { analysis, severity };
}

export async function POST(req: NextRequest) {
  try {
    // ── 1) 보안 ──
    const ip = getClientIP(req);
    if (!checkRateLimit(ip, 3, 60000)) {
      return NextResponse.json({ error: "재분석은 분당 3회 제한." }, { status: 429 });
    }

    const body = await req.json();
    const {
      password,
      feedIds,
      mode = "suspicious",
      limit = 10,
    } = body as {
      password?: string;
      feedIds?: string[];
      mode?: "suspicious" | "all";
      limit?: number;
    };

    if (!isAdmin(password || "")) {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 });
    }
    if (limit < 1 || limit > 30) {
      return NextResponse.json({ error: "limit 1~30" }, { status: 400 });
    }

    // ── 2) env ──
    const geminiKey = process.env.GEMINI_API_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    const missing: string[] = [];
    if (!geminiKey) missing.push("GEMINI_API_KEY");
    if (!serviceKey) missing.push("SUPABASE_SERVICE_ROLE_KEY");
    if (missing.length) {
      return NextResponse.json({ error: `env 누락: ${missing.join(", ")}` }, { status: 500 });
    }

    const sb = createClient(SUPABASE_URL, serviceKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // ── 3) 대상 포스트 선정 ──
    let targets: Array<{ id: string; image_url: string; pet_species: string; description: string; analysis_result: any }> = [];

    if (feedIds && feedIds.length > 0) {
      const { data, error } = await sb
        .from("feed_posts")
        .select("id, image_url, pet_species, description, analysis_result")
        .in("id", feedIds);
      if (error) throw new Error(`select ${error.message}`);
      targets = data || [];
    } else {
      // suspicious/all 자동 선정
      const { data, error } = await sb
        .from("feed_posts")
        .select("id, image_url, pet_species, description, analysis_result")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (error) throw new Error(`select ${error.message}`);

      targets = (data || []).filter((p: any) => {
        // 시드 포스트는 제외 (이미 Gemini 분석 완료)
        if (p.analysis_result?.isSeed) return false;

        if (mode === "all") return true;

        // suspicious 모드: severity=normal 이면서 analysis 텍스트 비어있는 것
        const ar = p.analysis_result || {};
        const hasAnalysisText = typeof ar.analysis === "string" && ar.analysis.trim().length > 50;
        const isSuspicious = ar.severity === "normal" && !hasAnalysisText;
        return isSuspicious;
      });
    }

    if (targets.length === 0) {
      return NextResponse.json({
        success: true,
        message: "재분석 대상 없음 (이미 유효한 분석 존재)",
        processed: 0,
      });
    }

    // ── 4) 순차 재분석 ──
    const results: Array<{
      id: string;
      ok: boolean;
      oldSeverity?: string;
      newSeverity?: string;
      analysisLength?: number;
      error?: string;
    }> = [];

    for (const post of targets.slice(0, limit)) {
      try {
        const { analysis, severity: newSev } = await reanalyzeOne(post, {
          geminiKey: geminiKey!,
          model,
        });

        // legacy summary/recommendation 도 새 분석 기반으로 갱신
        //   (이전에는 analysis 만 덮어써서 UI 가 옛 가짜 "정상입니다" 텍스트 계속 표시)
        const firstPara = analysis
          .split("\n")
          .find((l) => l.trim().length > 30 && !l.startsWith("⚡") && !l.startsWith("🔍") && !l.startsWith("🩺")) || "";
        const newSummary = firstPara.replace(/^[*\s🚨⚠️💡✅ℹ️]+/, "").slice(0, 280);

        const newRecommendation =
          newSev === "urgent" ? "🚨 즉시 24시간 동물병원 방문을 권장합니다."
          : newSev === "moderate" ? "⚠️ 24시간 내 동물병원 진료를 권장합니다."
          : newSev === "mild" ? "💡 며칠간 관찰하시고 증상 지속 시 수의사 상담."
          : "✅ 건강한 상태로 보입니다. 정기 검진을 잊지 마세요.";

        const newSymptoms: string[] =
          newSev === "urgent" ? ["긴급"]
          : newSev === "moderate" ? ["주의"]
          : newSev === "mild" ? ["관찰"]
          : [];

        // UPDATE — 기존 필드 보존하면서 analysis 전문 + severity + legacy 동기화
        const merged = {
          ...(post.analysis_result || {}),
          // 신규 풀 텍스트 + severity
          analysis,
          severity: newSev,
          symptomsCount: TOTAL_SYMPTOMS,
          locale: "ko",
          // legacy 필드 (UI 호환)
          summary: newSummary,
          recommendation: newRecommendation,
          symptoms: newSymptoms,
          // 메타
          reanalyzedAt: new Date().toISOString(),
          reanalysisModel: model,
          previousSeverity: post.analysis_result?.severity || "unknown",
          source: "gemini-vision-reanalyze",
        };

        const { error } = await sb
          .from("feed_posts")
          .update({ analysis_result: merged })
          .eq("id", post.id);

        if (error) {
          results.push({ id: post.id, ok: false, error: `update ${error.message}` });
        } else {
          results.push({
            id: post.id,
            ok: true,
            oldSeverity: post.analysis_result?.severity || "unknown",
            newSeverity: newSev,
            analysisLength: analysis.length,
          });
        }
      } catch (err: any) {
        results.push({ id: post.id, ok: false, error: err.message || "unknown" });
      }
    }

    const upgraded = results.filter(
      (r) => r.ok && r.newSeverity !== "normal" && r.oldSeverity === "normal"
    ).length;

    return NextResponse.json({
      success: true,
      candidates: targets.length,
      processed: results.length,
      succeeded: results.filter((r) => r.ok).length,
      failed: results.filter((r) => !r.ok).length,
      upgraded_from_normal: upgraded,
      results,
      note: "재분석 완료. upgraded_from_normal 이 0보다 크면 false-negative 가 실제로 수정된 것.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "server error" }, { status: 500 });
  }
}
