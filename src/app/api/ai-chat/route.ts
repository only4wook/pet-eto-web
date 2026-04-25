import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { callGemini } from "../../../lib/geminiClient";
import { callOpenAI } from "../../../lib/openaiClient";
import { PET_AI_PERSONA } from "../../../lib/aiPrompts";
import { PET_AI_PERSONA_EN } from "../../../lib/aiPromptsEn";
import { classifyQuery, mergeEnsemble } from "../../../lib/aiRouter";
import { criticizeAndImprove } from "../../../lib/selfCritique";
import { buildExemplarFewShot, type ExemplarRow } from "../../../lib/learning";

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";

/**
 * 활성 exemplar 5개 가져와서 few-shot 텍스트로 변환.
 * service-role 키 없으면 스킵 (학습 루프 미설정 환경 호환).
 */
async function fetchActiveExemplars(): Promise<string> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return "";
  try {
    const sb = createClient(SUPABASE_URL, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await sb
      .from("ai_exemplars")
      .select("category, question, exemplar_response, score")
      .eq("active", true)
      .order("promoted_at", { ascending: false })
      .limit(5);
    if (error || !data || data.length === 0) return "";
    return buildExemplarFewShot(data as ExemplarRow[]);
  } catch {
    return ""; // 학습 테이블 미존재 등 — 조용히 스킵
  }
}

// P.E.T AI 채팅 - Hybrid Router 기반
// 2026-04-23 업그레이드:
//   - critical 쿼리 → Gemini + GPT 병렬 앙상블 + 합의 확인
//   - complex 쿼리 → GPT-4o (추론력 우위)
//   - normal 쿼리 → Gemini 2.0 Flash (빠르고 저렴)
//   - 응급 케이스는 self-critique 추가 → 품질 최상

type ChatMessage = { role: "user" | "ai"; text: string };
type PetInfo = { name: string; species: string; breed: string };

export async function POST(req: NextRequest) {
  try {
    const {
      message,
      history,
      pets,
      locale: localeInput,
    }: {
      message: string;
      history: ChatMessage[];
      pets: PetInfo[];
      locale?: "ko" | "en";
    } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: "메시지가 비어있습니다." }, { status: 400 });
    }

    // ── 1) 쿼리 분류 (라우팅 결정) ──
    const classification = classifyQuery(message, localeInput);
    const locale = classification.locale;
    const isEn = locale === "en";

    // 반려동물 컨텍스트
    const petContext = pets && pets.length > 0
      ? (isEn
          ? `\n\n## This owner's pets\n${pets.map((p) => `- ${p.name} (${p.species}, ${p.breed})`).join("\n")}\nNaturally weave in these pets' breed traits when relevant.`
          : `\n\n## 이 보호자의 반려동물\n${pets.map((p) => `- ${p.name} (${p.species === "cat" ? "고양이" : p.species === "dog" ? "강아지" : p.species}, ${p.breed})`).join("\n")}\n답변 시 품종 특성을 반영하세요.`)
      : "";

    // 자가강화 학습: 한국어 모드에서만 exemplar 주입 (영어 exemplar 별도 학습 필요)
    const exemplarFewShot = isEn ? "" : await fetchActiveExemplars();
    const systemPersona = (isEn ? PET_AI_PERSONA_EN : PET_AI_PERSONA) + petContext + (exemplarFewShot ? "\n\n" + exemplarFewShot : "");

    // 최근 대화 8턴 유지
    const recentHistory = (history || []).slice(-8);
    const contents = [
      ...recentHistory.map((m) => ({
        role: m.role === "user" ? "user" : "model" as "user" | "model",
        parts: [{ text: m.text }],
      })),
      { role: "user" as const, parts: [{ text: message }] },
    ];

    // OpenAI용 messages (형식 다름)
    const openaiMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPersona },
      ...recentHistory.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.text,
      })),
      { role: "user", content: message },
    ];

    // ── 2) 라우트별 처리 ──
    const route = classification.route;

    // ▶ 경로 1: ENSEMBLE (생명 위험 → Gemini + GPT 병렬)
    if (route === "ensemble") {
      const [geminiResult, gptResult] = await Promise.all([
        callGemini(contents, { locale, timeoutMs: 12000 }),
        callOpenAI(openaiMessages, { model: "gpt-4o-mini", timeoutMs: 12000 }),
      ]);

      // 둘 중 성공한 쪽만 쓰기
      if (geminiResult.ok && gptResult.ok) {
        const ensemble = mergeEnsemble(geminiResult.reply!, gptResult.reply!, locale);
        // 합의된 경우에만 self-critique 실행 (불일치는 원본 그대로 표시)
        let finalReply = ensemble.final;
        if (ensemble.agreement) {
          finalReply = await criticizeAndImprove(message, ensemble.final, locale);
        }
        return NextResponse.json({
          success: true,
          reply: finalReply,
          meta: {
            route,
            urgency: classification.urgency,
            confidence: ensemble.confidence,
            agreement: ensemble.agreement,
            sources: ensemble.sources,
            classificationReasons: classification.reasons,
          },
        });
      }

      // 한 쪽만 성공 → 그 답변 사용
      const okReply = geminiResult.ok ? geminiResult.reply : gptResult.ok ? gptResult.reply : null;
      if (okReply) {
        return NextResponse.json({
          success: true,
          reply: okReply,
          meta: {
            route,
            urgency: classification.urgency,
            confidence: "medium",
            agreement: false,
            sources: [geminiResult.ok ? "Gemini 2.0 Flash" : "GPT-4o (Gemini failed)"],
            classificationReasons: classification.reasons,
          },
        });
      }

      // 둘 다 실패 → 폴백
      return NextResponse.json({
        error: "앙상블 실패 — 두 AI 모두 응답 불가",
        geminiError: geminiResult.error,
        gptError: gptResult.error,
        fallback: true,
      }, { status: 200 });
    }

    // ▶ 경로 2: GPT-4o 단일 (복잡한 문맥)
    if (route === "gpt-single") {
      const result = await callOpenAI(openaiMessages, { model: "gpt-4o-mini", timeoutMs: 15000 });
      if (result.ok && result.reply) {
        return NextResponse.json({
          success: true,
          reply: result.reply,
          meta: {
            route,
            urgency: classification.urgency,
            sources: ["GPT-4o mini"],
            classificationReasons: classification.reasons,
          },
        });
      }

      // GPT 실패 → Gemini로 폴백
      const fallback = await callGemini(contents, { locale });
      if (fallback.ok && fallback.reply) {
        return NextResponse.json({
          success: true,
          reply: fallback.reply,
          meta: {
            route: "gpt-fallback-gemini",
            urgency: classification.urgency,
            sources: ["Gemini 2.0 Flash (GPT failed)"],
          },
        });
      }

      return NextResponse.json({
        error: result.error || "GPT 실패, Gemini도 실패",
        fallback: true,
      }, { status: 200 });
    }

    // ▶ 경로 3: Gemini 단일 (일반 질문, 기본 경로)
    const geminiResult = await callGemini(contents, { locale });
    if (geminiResult.ok && geminiResult.reply) {
      return NextResponse.json({
        success: true,
        reply: geminiResult.reply,
        meta: {
          route,
          urgency: classification.urgency,
          sources: ["Gemini 2.0 Flash"],
          classificationReasons: classification.reasons,
        },
      });
    }

    // Gemini 실패 → GPT로 폴백 (OPENAI_API_KEY 있을 때만)
    if (process.env.OPENAI_API_KEY) {
      const gptFallback = await callOpenAI(openaiMessages, { model: "gpt-4o-mini" });
      if (gptFallback.ok && gptFallback.reply) {
        return NextResponse.json({
          success: true,
          reply: gptFallback.reply,
          meta: {
            route: "gemini-fallback-gpt",
            urgency: classification.urgency,
            sources: ["GPT-4o mini (Gemini failed)"],
          },
        });
      }
    }

    // 둘 다 실패 → 룰 기반 폴백 신호
    return NextResponse.json({
      error: geminiResult.error || "Gemini 실패",
      fallback: true,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message || "서버 오류",
      fallback: true,
    }, { status: 200 });
  }
}
