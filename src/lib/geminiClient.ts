// Gemini 2.0 Flash 클라이언트 래퍼 (앙상블 / Self-Critique용)

import { PET_AI_PERSONA, GENERATION_CONFIG, SAFETY_SETTINGS } from "./aiPrompts";
import { PET_AI_PERSONA_EN, GENERATION_CONFIG_EN } from "./aiPromptsEn";

export interface GeminiChatContent {
  role: "user" | "model";
  parts: Array<{ text: string } | { inlineData: { mimeType: string; data: string } }>;
}

export interface GeminiChatOptions {
  systemInstruction?: string;
  locale?: "ko" | "en";
  timeoutMs?: number;
  temperature?: number;
}

export async function callGemini(
  contents: GeminiChatContent[],
  options: GeminiChatOptions = {}
): Promise<{ ok: boolean; reply?: string; error?: string; fallback?: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { ok: false, error: "GEMINI_API_KEY 미설정", fallback: true };
  }

  const {
    locale = "ko",
    timeoutMs = 15000,
    temperature,
  } = options;

  const systemText = options.systemInstruction
    || (locale === "en" ? PET_AI_PERSONA_EN : PET_AI_PERSONA);

  const genConfig = {
    ...(locale === "en" ? GENERATION_CONFIG_EN : GENERATION_CONFIG),
    ...(temperature !== undefined ? { temperature } : {}),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  // 모델은 GEMINI_MODEL 환경변수로 교체 가능 (기본: gemini-2.5-flash — v1beta 지원 최신)
  // 주의: gemini-1.5-flash 는 v1beta 에서 404 반환되므로 사용 금지
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemText }] },
          contents,
          generationConfig: genConfig,
          safetySettings: SAFETY_SETTINGS,
        }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text();
      // 서버 로그로 원본 에러 노출 (진단용) — 브라우저 콘솔엔 요약만
      console.error(`[Gemini ${model}] ${res.status}:`, errText.slice(0, 500));
      return {
        ok: false,
        error: `Gemini API 오류: ${res.status} — ${errText.slice(0, 300)}`,
        fallback: true,
      };
    }

    const data = await res.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) {
      const blockReason = data?.promptFeedback?.blockReason;
      return {
        ok: false,
        error: blockReason ? `응답 차단: ${blockReason}` : "응답 비어있음",
        fallback: true,
      };
    }

    return { ok: true, reply: reply.trim() };
  } catch (err: any) {
    clearTimeout(timeout);
    if (err.name === "AbortError") {
      return { ok: false, error: "Gemini 응답 시간 초과", fallback: true };
    }
    return { ok: false, error: err.message || "Gemini 호출 실패", fallback: true };
  }
}
