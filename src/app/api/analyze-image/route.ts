import { NextRequest, NextResponse } from "next/server";
import { PET_AI_PERSONA, IMAGE_ANALYSIS_CONFIG, SAFETY_SETTINGS } from "../../../lib/aiPrompts";

// Gemini 2.0 Flash 기반 반려동물 이미지 분석
// 공통 페르소나(PET_AI_PERSONA)를 공유해서 채팅/피드/위키 등 모든 AI 답변 품질을 통일.

const IMAGE_ANALYSIS_TASK = `
## 지금 주어진 과제: 이미지 기반 건강 분석

보호자가 사진을 올렸습니다. 사진을 보고 아래 **정확히 이 포맷**으로 답변하세요.

🔍 **관찰 소견**
사진에서 보이는 전반적인 상태, 피모·눈·코·귀·피부·자세를 3~4문장으로 구체적으로 기술. 무엇이 정상이고 무엇이 신경쓰이는지.

🩺 **의심 증상/질환** (이상이 보일 때만)
번호로 나열하고 각각 특징·전형적 진행·감별점 설명.
1. **질환명 (의학 용어 + 한국 보호자용 설명)** — 특징, 주의점, 감별 포인트
2. …
이상 소견이 전혀 없으면 "특별한 이상 소견 없음 — 건강한 모습입니다."

⚡ **심각도**
반드시 한 단어만: normal / mild / moderate / urgent
- normal: 이상 없음
- mild: 며칠 관찰
- moderate: 2~3일 내 병원 권장
- urgent: 24시간 내 병원 필수

🏠 **지금 집에서 할 것**
구체적 행동 3~5개. "지켜보세요" 같은 무의미한 지시 금지.

🏥 **병원 방문 필요 여부**
"예/아니오 + 언제(당일/3일 내/1주 내) + 어떤 검사(X-ray, 혈액검사 등)" 형식

💰 **예상 비용** (병원 필요 시에만)
초진·검사·치료 각각 한국 시세 범위

💡 **후속 질문 유도**
"혹시 ~ 알려주시면 더 정밀하게 조언드릴게요" 형식으로 대화 계속 유도

⚠️ 꼭 마지막 줄에 추가: "이 분석은 AI 참고 의견입니다. 확진은 수의사만 가능해요."
`;

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY 미설정" }, { status: 500 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const description = (formData.get("description") as string) || "";
    const species = (formData.get("species") as string) || "cat";

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const animalName = species === "cat" ? "고양이" : species === "dog" ? "강아지" : "반려동물";
    const userContext = `보호자가 ${animalName} 사진을 올렸습니다.\n${description ? `보호자 설명: "${description}"` : "별도 설명 없음."}`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: PET_AI_PERSONA + "\n\n" + IMAGE_ANALYSIS_TASK }],
          },
          contents: [{
            role: "user",
            parts: [
              { inlineData: { mimeType, data: base64 } },
              { text: userContext },
            ],
          }],
          generationConfig: IMAGE_ANALYSIS_CONFIG,
          safetySettings: SAFETY_SETTINGS,
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({ error: `Gemini API 오류: ${geminiRes.status}`, detail: errText.slice(0, 200) }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const analysisText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "분석 결과를 가져올 수 없습니다.";

    // 심각도 추출 (프롬프트에서 명시한 4단계 중 하나를 반드시 포함)
    let severity: "normal" | "mild" | "moderate" | "urgent" = "normal";
    const lower = analysisText.toLowerCase();
    if (lower.includes("urgent") || analysisText.includes("긴급")) severity = "urgent";
    else if (lower.includes("moderate") || analysisText.includes("주의")) severity = "moderate";
    else if (lower.includes("mild") || analysisText.includes("관찰")) severity = "mild";

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      severity,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 });
  }
}
