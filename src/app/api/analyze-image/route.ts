import { NextRequest, NextResponse } from "next/server";

// Gemini 2.0 Flash로 반려동물 이미지 AI 분석
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

    // 파일을 base64로 변환
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const animalName = species === "cat" ? "고양이" : species === "dog" ? "강아지" : "반려동물";

    // Gemini API 호출
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64,
                },
              },
              {
                text: `당신은 수의학 지식을 가진 반려동물 건강 AI 어시스턴트 "P.E.T AI"입니다.
보호자가 ${animalName} 사진을 올렸습니다.
${description ? `보호자의 설명: "${description}"` : "보호자가 별도 설명을 하지 않았습니다."}

사진을 꼼꼼하게 분석하고, 보호자의 마음에 공감하면서 전문적으로 답변해주세요.

반드시 아래 형식으로 한국어로 답변해주세요:

🔍 **관찰 소견**
사진에서 보이는 ${animalName}의 전반적인 상태, 피모 상태, 눈/코/귀/피부/자세 등을 구체적으로 설명 (3~4문장)

🩺 **의심해볼 수 있는 증상/질환**
사진에서 이상이 보이면 가능한 질환을 번호로 나열하고 각각 특징을 설명. 정상이면 "특별한 이상 소견이 관찰되지 않습니다."
예시:
1. **곰팡이성 피부염 (링웜)** - 특징: ... 주의점: ...
2. **알레르기 반응** - 특징: ...

⚡ **심각도 판정**
normal(정상) / mild(관찰 필요) / moderate(주의 — 며칠 내 병원 방문 권장) / urgent(긴급 — 즉시 병원!) 중 하나를 명시

🏠 **당장 집에서 해야 할 것**
구체적이고 실용적인 대처법 3~4가지 (넥카라 씌우기, 만지지 않기, 사진 기록 등)

🏥 **동물병원 방문 필요 여부**
예/아니오 + 구체적 이유 + 어떤 검사를 받아야 하는지

⚠️ 이 분석은 AI의 참고 의견이며, 정확한 수의학적 진단은 수의사만 가능합니다. 증상이 걱정된다면 반드시 동물병원을 방문해주세요.`,
              },
            ],
          }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({ error: `Gemini API 오류: ${geminiRes.status}`, detail: errText.slice(0, 200) }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const analysisText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "분석 결과를 가져올 수 없습니다.";

    // 심각도 추출
    let severity: "normal" | "mild" | "moderate" | "urgent" = "normal";
    if (analysisText.includes("urgent") || analysisText.includes("긴급")) severity = "urgent";
    else if (analysisText.includes("moderate") || analysisText.includes("주의")) severity = "moderate";
    else if (analysisText.includes("mild") || analysisText.includes("관찰")) severity = "mild";

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      severity,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 });
  }
}
