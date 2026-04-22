import { NextRequest, NextResponse } from "next/server";
import { PET_AI_PERSONA, GENERATION_CONFIG, SAFETY_SETTINGS } from "../../../lib/aiPrompts";
import { PET_AI_PERSONA_EN, GENERATION_CONFIG_EN } from "../../../lib/aiPromptsEn";

// P.E.T AI 채팅 - Gemini 2.0 Flash 기반 수의학 대화 엔진
// KO/EN 전용 페르소나를 완전히 분리해서 양쪽 모두 최고 품질 유지

type ChatMessage = { role: "user" | "ai"; text: string };
type PetInfo = { name: string; species: string; breed: string };

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY 미설정", fallback: true }, { status: 200 });
    }

    const { message, history, pets, locale }: {
      message: string;
      history: ChatMessage[];
      pets: PetInfo[];
      locale?: "ko" | "en";
    } = await req.json();
    if (!message?.trim()) {
      return NextResponse.json({ error: "메시지가 비어있습니다." }, { status: 400 });
    }

    const isEn = locale === "en";

    // 언어별로 완전히 분리된 시스템 프롬프트
    const systemPersona = isEn ? PET_AI_PERSONA_EN : PET_AI_PERSONA;

    // 등록 반려동물 컨텍스트
    const petContext = pets && pets.length > 0
      ? (isEn
          ? `\n\n## This owner's pets\n${pets.map((p) => `- ${p.name} (${p.species}, ${p.breed})`).join("\n")}\nNaturally weave in these pets' breed traits and common health conditions when relevant. Using their names increases rapport.`
          : `\n\n## 이 보호자의 반려동물\n${pets.map((p) => `- ${p.name} (${p.species === "cat" ? "고양이" : p.species === "dog" ? "강아지" : p.species}, ${p.breed})`).join("\n")}\n답변 시 이 아이들의 품종 특성·호발 질환을 자연스럽게 반영하세요. 이름을 불러주면 보호자 친밀도가 올라갑니다.`)
      : "";

    // 최근 대화 8턴까지 유지
    const recentHistory = (history || []).slice(-8);
    const contents = [
      ...recentHistory.map((m) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      })),
      { role: "user", parts: [{ text: message }] },
    ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPersona + petContext }],
          },
          contents,
          generationConfig: isEn ? GENERATION_CONFIG_EN : GENERATION_CONFIG,
          safetySettings: SAFETY_SETTINGS,
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({
        error: `Gemini API 오류: ${geminiRes.status}`,
        detail: errText.slice(0, 300),
        fallback: true,
      }, { status: 200 });
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      const blockReason = data?.promptFeedback?.blockReason;
      return NextResponse.json({
        error: blockReason ? `응답 차단: ${blockReason}` : "응답을 가져올 수 없습니다.",
        fallback: true,
      }, { status: 200 });
    }

    return NextResponse.json({ success: true, reply: reply.trim() });
  } catch (err: any) {
    return NextResponse.json({
      error: err.message || "서버 오류",
      fallback: true,
    }, { status: 200 });
  }
}
