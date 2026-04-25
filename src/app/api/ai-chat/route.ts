import { NextRequest, NextResponse } from "next/server";
import { PET_AI_PERSONA, GENERATION_CONFIG, SAFETY_SETTINGS, detectSymptomGuides } from "../../../lib/aiPrompts";

// Vercel: Gemini 응답이 느려도 잘리지 않도록 60초로 확장
export const maxDuration = 60;

// P.E.T AI 채팅 - Gemini 2.0 Flash 기반 수의학 대화 엔진
// 공통 프롬프트 모듈(aiPrompts.ts)에서 페르소나·Few-shot·파라미터를 주입.

type ChatMessage = { role: "user" | "ai"; text: string };
type PetInfo = { name: string; species: string; breed: string };

// 모델 풀백 체인 — 최신 우선, 실패 시 단계 하향
// 2.5-flash가 가장 빠르고 똑똑. 안 되면 2.0/1.5 순으로 폴백.
const MODEL_FALLBACKS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
];

// OpenAI gpt-4o-mini 폴백 — Gemini 전부 실패 시 마지막 방어선
async function callOpenAIChat(opts: {
  apiKey: string;
  systemText: string;
  userMessages: { role: "user" | "assistant"; content: string }[];
}): Promise<{ ok: true; reply: string } | { ok: false; status: number; error: string }> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: opts.systemText },
        ...opts.userMessages,
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return { ok: false, status: res.status, error: errText.slice(0, 200) };
  }
  const data = await res.json();
  const reply = data?.choices?.[0]?.message?.content;
  if (!reply) return { ok: false, status: 0, error: "empty" };
  return { ok: true, reply: reply.trim() };
}

async function callGeminiChat(opts: {
  apiKey: string;
  model: string;
  systemText: string;
  contents: any[];
}): Promise<{ ok: true; reply: string } | { ok: false; status: number; error: string }> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${opts.model}:generateContent?key=${opts.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: opts.systemText }] },
        contents: opts.contents,
        generationConfig: GENERATION_CONFIG,
        safetySettings: SAFETY_SETTINGS,
      }),
    }
  );
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    return { ok: false, status: res.status, error: errText.slice(0, 200) };
  }
  const data = await res.json();
  const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) {
    const blockReason = data?.promptFeedback?.blockReason;
    return { ok: false, status: 0, error: blockReason ? `blocked:${blockReason}` : "empty" };
  }
  return { ok: true, reply: reply.trim() };
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY 미설정", fallback: true }, { status: 200 });
    }

    const { message, history, pets }: { message: string; history: ChatMessage[]; pets: PetInfo[] } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "메시지가 비어있습니다." }, { status: 400 });
    }

    // 등록 반려동물 컨텍스트 — 품종별 호발 질환까지 자연스럽게 반영
    const petContext = pets && pets.length > 0
      ? `\n\n## 이 보호자의 반려동물\n${pets.map((p) => `- ${p.name} (${p.species === "cat" ? "고양이" : p.species === "dog" ? "강아지" : p.species}, ${p.breed})`).join("\n")}\n답변 시 이 아이들의 품종 특성·호발 질환을 자연스럽게 반영하세요. 이름을 불러주면 보호자 친밀도가 올라갑니다.`
      : "";

    // 타겟 증상(구토·피부발진·다리절뚝) 감지 → 전문 가이드 주입
    const historyText = (history || []).map((m) => m.text).join(" ");
    const guides = detectSymptomGuides(message + " " + historyText);
    const symptomContext = guides.length > 0
      ? `\n\n## 🎯 타겟 증상 감지 — 아래 전문 가이드에 따라 정밀하게 답변\n${guides.join("\n")}`
      : "";

    // 최근 대화 8턴까지 유지 (맥락 유지 + 토큰 절약)
    const recentHistory = (history || []).slice(-8);
    const contents = [
      ...recentHistory.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    // 모델 풀백 체인: 2.0 Flash → 1.5 Flash → 1.5 Flash-8B
    // 429(쿼터)·5xx(일시 장애)면 다음 모델로 자동 폴백 → 룰 베이스로 떨어지기 전 마지막 방어선
    const systemText = PET_AI_PERSONA + petContext + symptomContext;
    let lastError = "";
    let lastStatus = 0;
    for (const model of MODEL_FALLBACKS) {
      const result = await callGeminiChat({ apiKey, model, systemText, contents });
      if (result.ok) {
        return NextResponse.json({ success: true, reply: result.reply, model });
      }
      lastError = result.error;
      lastStatus = result.status;
      // 429/5xx는 다음 모델 시도. 4xx 기타는 의미 없으니 즉시 실패.
      if (result.status !== 429 && result.status < 500 && result.status !== 0) break;
    }

    // Gemini 전부 실패 → OpenAI 폴백
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      const userMessages = contents.map((c: any) => ({
        role: (c.role === "model" ? "assistant" : "user") as "user" | "assistant",
        content: c.parts?.[0]?.text || "",
      }));
      const oaResult = await callOpenAIChat({
        apiKey: openaiKey,
        systemText,
        userMessages,
      });
      if (oaResult.ok) {
        return NextResponse.json({ success: true, reply: oaResult.reply, model: "gpt-4o-mini" });
      }
      lastError = `gemini=${lastError} | openai=${oaResult.error}`;
      lastStatus = oaResult.status;
    }

    return NextResponse.json({
      error: `AI 호출 실패: ${lastStatus} ${lastError}`,
      fallback: true,
    }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message || "서버 오류",
      fallback: true,
    }, { status: 200 });
  }
}
