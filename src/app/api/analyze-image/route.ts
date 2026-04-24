import { NextRequest, NextResponse } from "next/server";
import { PET_AI_PERSONA, IMAGE_ANALYSIS_CONFIG, SAFETY_SETTINGS } from "../../../lib/aiPrompts";
import { PET_AI_PERSONA_EN, IMAGE_ANALYSIS_CONFIG_EN } from "../../../lib/aiPromptsEn";
import { buildSymptomChecklistKo, buildSymptomChecklistEn, TOTAL_SYMPTOMS } from "../../../lib/symptomTaxonomy";

// Gemini 2.0 Flash 기반 반려동물 이미지 분석
// 2026-04-23: 31개 부위별 증상 체크리스트 주입 (TTcare 동등 이상 경쟁력)

const IMAGE_TASK_KO = `
## 지금 주어진 과제: 이미지 기반 건강 분석 (P.E.T 31개 증상 체크)

보호자가 사진을 올렸습니다. 사진을 보고 아래 **정확히 이 포맷**으로 답변하세요.

🔍 **부위별 스캔 (Body-Part Scan)**
사진에서 보이는 부위를 먼저 명시하고, 각 부위의 체크리스트를 스캔한 결과를 요약:
- 보이는 부위: [예: 얼굴·눈·귀]
- 각 부위에서 이상 소견: [예: 왼쪽 눈 분비물 / 귀 안쪽 홍반]
- 교차 분석 결론: [예: 두 부위 모두 이상 → severity 한 단계 상승]

🩺 **의심 증상/질환** (이상이 보일 때만, 번호 목록)
1. **질환명 (의학 용어 + 보호자용 설명)** — 특징, 감별 포인트
2. …
이상 소견 전혀 없으면: "특별한 이상 소견 없음 — 건강한 모습입니다."

⚡ **심각도** (반드시 한 단어)
normal / mild / moderate / urgent

🏠 **지금 집에서 할 것** (구체적 3~5개)

🏥 **병원 방문 기준**
"예/아니오 + 언제(당일/3일 내/1주 내) + 어떤 검사"

💰 **예상 비용** (병원 필요 시)
초진·검사·치료 각각 한국 시세 범위

💡 **후속 질문 유도**
"혹시 ~ 알려주시면 더 정밀하게 조언드릴게요"

⚠️ 마지막 줄에 반드시: "이 분석은 AI 참고 의견입니다. 확진은 수의사만 가능해요."
`;

const IMAGE_TASK_EN = `
## Task: Image-based Health Analysis (P.E.T ${TOTAL_SYMPTOMS}-Symptom Body-Part Check)

The pet parent uploaded a photo. Analyze it and respond in **exactly this format**.

🔍 **Body-Part Scan**
- Visible parts: [e.g., face, eyes, ears]
- Abnormalities per part: [e.g., left-eye discharge / redness in inner ear]
- Cross-analysis conclusion: [e.g., 2+ parts affected → severity raised one level]

🩺 **Suspected conditions** (numbered list, only if abnormalities exist)
1. **Condition name (medical term + owner-friendly explanation)** — features, differentials
2. …
If nothing abnormal: "No abnormal findings — appears healthy."

⚡ **Severity** (single word)
normal / mild / moderate / urgent

🏠 **Do at home right now** (3–5 specific actions)

🏥 **Vet visit criteria**
"Yes/No + when (today / within 3 days / within 1 week) + which tests (X-ray, bloodwork, etc.)"

💰 **Expected cost** (only if vet needed)
Initial exam, diagnostics, treatment — Korean price ranges in KRW

💡 **Follow-up invitation**
"If you share ___, I can refine the analysis further"

⚠️ Final line must read: "This analysis is an AI reference opinion. Only a licensed vet can make a definitive diagnosis."
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
    const locale = (formData.get("locale") as string) || "ko";
    const isEn = locale === "en";

    if (!file) {
      return NextResponse.json({ error: isEn ? "No file provided." : "파일이 없습니다." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    // 31개 증상 체크리스트 주입 (종별 분기)
    const speciesKey: "dog" | "cat" = species === "dog" ? "dog" : "cat";
    const symptomChecklist = isEn
      ? buildSymptomChecklistEn(speciesKey)
      : buildSymptomChecklistKo(speciesKey);

    const systemText = (isEn ? PET_AI_PERSONA_EN : PET_AI_PERSONA)
      + "\n\n" + (isEn ? IMAGE_TASK_EN : IMAGE_TASK_KO)
      + "\n\n" + symptomChecklist;

    const animalName = isEn
      ? (species === "cat" ? "cat" : species === "dog" ? "dog" : "pet")
      : (species === "cat" ? "고양이" : species === "dog" ? "강아지" : "반려동물");
    const userContext = isEn
      ? `The pet parent uploaded a photo of their ${animalName}.\n${description ? `Owner's note: "${description}"` : "No additional note."}`
      : `보호자가 ${animalName} 사진을 올렸습니다.\n${description ? `보호자 설명: "${description}"` : "별도 설명 없음."}`;

    // 모델은 GEMINI_MODEL 환경변수로 교체 가능 (geminiClient.ts와 동일 기본값)
    const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemText }] },
          contents: [{
            role: "user",
            parts: [
              { inlineData: { mimeType, data: base64 } },
              { text: userContext },
            ],
          }],
          generationConfig: isEn ? IMAGE_ANALYSIS_CONFIG_EN : IMAGE_ANALYSIS_CONFIG,
          safetySettings: SAFETY_SETTINGS,
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error(`[analyze-image ${model}] ${geminiRes.status}:`, errText.slice(0, 500));
      return NextResponse.json({
        error: `Gemini API 오류: ${geminiRes.status}`,
        detail: errText.slice(0, 500),
        model,
      }, { status: 500 });
    }

    const geminiData = await geminiRes.json();
    const analysisText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text
      || (isEn ? "Analysis result unavailable." : "분석 결과를 가져올 수 없습니다.");

    // 심각도 추출 (4단계)
    let severity: "normal" | "mild" | "moderate" | "urgent" = "normal";
    const lower = analysisText.toLowerCase();
    if (lower.includes("urgent") || analysisText.includes("긴급")) severity = "urgent";
    else if (lower.includes("moderate") || analysisText.includes("주의")) severity = "moderate";
    else if (lower.includes("mild") || analysisText.includes("관찰")) severity = "mild";

    return NextResponse.json({
      success: true,
      analysis: analysisText,
      severity,
      symptomsCount: TOTAL_SYMPTOMS,
      locale,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "server error" }, { status: 500 });
  }
}
