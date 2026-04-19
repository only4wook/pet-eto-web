import { NextRequest, NextResponse } from "next/server";
import { PET_AI_PERSONA, GENERATION_CONFIG, SAFETY_SETTINGS } from "../../../lib/aiPrompts";

// P.E.T AI 채팅 - Gemini 2.0 Flash 기반 수의학 대화 엔진
// 공통 프롬프트 모듈(aiPrompts.ts)에서 페르소나·Few-shot·파라미터를 주입.

type ChatMessage = { role: "user" | "ai"; text: string };
type PetInfo = { name: string; species: string; breed: string };

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

    // 최근 대화 8턴까지 유지 (맥락 유지 + 토큰 절약)
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
            parts: [{ text: PET_AI_PERSONA + petContext }],
          },
          contents,
          generationConfig: GENERATION_CONFIG,
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

    // 안전 필터 등으로 응답이 비었을 때
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
