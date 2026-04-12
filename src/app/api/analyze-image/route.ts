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
                text: `당신은 반려동물 건강 AI 어시스턴트입니다.
이 ${animalName} 사진을 분석해주세요.
${description ? `보호자가 설명한 내용: "${description}"` : ""}

다음 형식으로 한국어로 답변해주세요:

1. **관찰 소견**: 사진에서 보이는 ${animalName}의 상태를 설명 (2~3문장)
2. **의심 증상**: 이상이 보이면 의심되는 증상/질병 (없으면 "특별한 이상 없음")
3. **심각도**: normal(정상) / mild(관찰) / moderate(주의) / urgent(긴급) 중 하나
4. **집에서 할 수 있는 것**: 구체적 대처법 (2~3가지)
5. **병원 방문 필요 여부**: 예/아니오 + 이유

⚠️ 이 분석은 참고용이며, 정확한 진단은 수의사만 가능합니다.`,
              },
            ],
          }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
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
