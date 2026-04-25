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
    `답변 형식: 🔍 부위별 스캔 → 🩺 의심 증상 → ⚡ 심각도 (normal/mild/moderate/urgent) → 🏠 집에서 할 것 → 🏥 병원 기준 → 💰 예상 비용.` +
    `\n반드시 "⚡ **심각도**: <enum>" 형식으로 한 줄 명시.\n` +
    checklist;

  const userContext = `보호자가 ${animalName} 사진을 올렸습니다.\n보호자 설명: "${post.description.slice(0, 500)}"\n\n사진을 꼼꼼히 보고 이상 소견을 빠뜨리지 말고 진단해주세요.`;

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
              { inlineData: { mimeType, data: base64 } },
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
  const analysis =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
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

        // UPDATE — 기존 필드 보존하면서 analysis 전문 + severity 덮어쓰기
        const merged = {
          ...(post.analysis_result || {}),
          analysis,
          severity: newSev,
          symptomsCount: TOTAL_SYMPTOMS,
          locale: "ko",
          reanalyzedAt: new Date().toISOString(),
          reanalysisModel: model,
          previousSeverity: post.analysis_result?.severity || "unknown",
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
