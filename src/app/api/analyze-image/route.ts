import { NextRequest, NextResponse } from "next/server";
import { PET_AI_PERSONA, IMAGE_ANALYSIS_CONFIG, SAFETY_SETTINGS } from "../../../lib/aiPrompts";

// Gemini 2.0 Flash 기반 반려동물 이미지 분석
// 공통 페르소나(PET_AI_PERSONA)를 공유해서 채팅/피드/위키 등 모든 AI 답변 품질을 통일.

const IMAGE_ANALYSIS_TASK = `
## 지금 주어진 과제: 이미지 기반 건강 분석

보호자가 사진을 올렸습니다. 사진을 보고 아래 **정확히 이 포맷**으로 답변하세요.

🔍 **관찰 소견**
사진에서 보이는 전반적인 상태, 피모·눈·코·귀·피부·자세를 3~4문장으로 구체적으로 기술. 무엇이 정상이고 무엇이 신경쓰이는지.

---

## 🐱 고양이 사진인 경우 — FGS(Feline Grimace Scale) 통증 평가 필수

고양이 얼굴이 명확히 보일 때 아래 5가지 지표를 0~2점으로 평가하세요:
(Feline Grimace Scale, Évangelista et al. 2019, University of Montreal)

1. **귀 위치 (Ear position)**
   - 0: 앞쪽으로 곧게 선 정상 상태
   - 1: 약간 옆으로 벌어지거나 미세하게 뒤로
   - 2: 완전히 뒤로 눕거나 납작하게 붙음 (비행기 귀)

2. **눈 감음 (Orbital tightening)**
   - 0: 눈이 완전히 열려 있고 둥근 모양
   - 1: 반쯤 감거나 살짝 찡그림
   - 2: 꽉 감음·크게 찡그림

3. **주둥이 긴장 (Muzzle tension)**
   - 0: 이완된 둥근 주둥이
   - 1: 약간 타원형으로 긴장
   - 2: 레몬 모양으로 각지고 긴장

4. **수염 위치 (Whiskers position)**
   - 0: 이완되어 옆으로 자연스럽게 뻗음
   - 1: 약간 앞쪽으로 모임
   - 2: 뚜렷하게 앞쪽으로 빳빳하게 모임

5. **머리 위치 (Head position)**
   - 0: 어깨 위에 자연스럽게 들려 있음
   - 1: 어깨 높이와 같음
   - 2: 어깨 아래로 내려감(움츠림) 또는 땅에 닿음

### FGS 총점(0~10) 해석
- **0~3점**: 통증 낮음 (normal~mild) — 자연스러운 모습
- **4~6점**: 중등도 통증 (moderate) — 2~3일 내 병원 권장
- **7점 이상**: 심한 통증 (urgent) — 24시간 내 병원 필수

반드시 아래 형식으로 별도 섹션에 노출:
"🩻 **FGS 통증 평가** (고양이): 귀 X점 · 눈 X점 · 주둥이 X점 · 수염 X점 · 머리 X점 = **총 X/10점** → [통증 단계]"

얼굴이 흐리거나 옆모습·뒷모습이면 "FGS 평가 불가(얼굴 각도)" 표시.
출처: University of Montreal, Évangelista 2019.

---

## 🐶 강아지 사진인 경우 — GCMPS 간이 통증 지표

강아지는 FGS 상응 지표로 아래 평가:
- **자세**: 웅크림·움츠림·떨림 → 통증 의심
- **표정**: 눈 찡그림·입술 핥기·헥헥거림 → 통증
- **상호작용**: 쓰다듬을 때 피하기·경계 → 통증

간단히 정상/관찰/주의/긴급으로 분류.

---

🩺 **의심 증상/질환** (이상이 보일 때만)
번호로 나열하고 각각 특징·전형적 진행·감별점 설명.
1. **질환명 (의학 용어 + 한국 보호자용 설명)** — 특징, 주의점, 감별 포인트
2. …
이상 소견이 전혀 없으면 "특별한 이상 소견 없음 — 건강한 모습입니다."

⚡ **심각도**
반드시 한 단어만: normal / mild / moderate / urgent
- normal: 이상 없음 (FGS 0~2)
- mild: 며칠 관찰 (FGS 3)
- moderate: 2~3일 내 병원 권장 (FGS 4~6)
- urgent: 24시간 내 병원 필수 (FGS 7+)

🏠 **지금 집에서 할 것**
구체적 행동 3~5개. "지켜보세요" 같은 무의미한 지시 금지.

🏥 **병원 방문 필요 여부**
"예/아니오 + 언제(당일/3일 내/1주 내) + 어떤 검사(X-ray, 혈액검사 등)" 형식

💰 **예상 비용** (병원 필요 시에만)
초진·검사·치료 각각 한국 시세 범위

💡 **후속 질문 유도**
"혹시 ~ 알려주시면 더 정밀하게 조언드릴게요" 형식으로 대화 계속 유도

⚠️ 꼭 마지막 줄에 추가: "이 분석은 AI 참고 의견입니다. 확진은 수의사만 가능해요."

---

## 📐 구조화 데이터 — 답변 맨 끝에 반드시 추가 (JSON 블록)

사람이 읽는 답변 끝에, UI가 파싱할 수 있도록 아래 JSON을 \`\`\`json ... \`\`\` 코드블록으로 출력하세요:

\`\`\`json
{
  "fgs_total": 0~10 숫자 (고양이 얼굴 분석 가능할 때만, 아니면 null),
  "fgs_breakdown": {
    "ear": 0~2 or null,
    "orbital": 0~2 or null,
    "muzzle": 0~2 or null,
    "whiskers": 0~2 or null,
    "head": 0~2 or null
  },
  "severity": "normal" | "mild" | "moderate" | "urgent",
  "severity_score": 0~10 숫자 (전반적 심각도 수치),
  "bboxes": [
    {"label":"문제 부위 이름(예: 피부 발적)","x":0~1,"y":0~1,"w":0~1,"h":0~1}
  ]
}
\`\`\`

bbox 좌표는 이미지 기준 0~1 정규화 값. 문제 부위가 식별될 때만 채우고, 없으면 빈 배열 [].
정확한 위치 모를 때는 bbox 생략해도 됨(거짓 정보 금지).
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
    const rawText = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "분석 결과를 가져올 수 없습니다.";

    // ── 구조화 JSON 블록 파싱 (\`\`\`json ... \`\`\`) ──
    let structured: {
      fgs_total?: number | null;
      fgs_breakdown?: Record<string, number | null>;
      severity?: "normal" | "mild" | "moderate" | "urgent";
      severity_score?: number | null;
      bboxes?: { label: string; x: number; y: number; w: number; h: number }[];
    } = {};
    let displayAnalysis = rawText;

    const jsonMatch = rawText.match(/```json\s*([\s\S]*?)\s*```/i);
    if (jsonMatch) {
      try {
        structured = JSON.parse(jsonMatch[1].trim());
        // 사용자에게는 JSON 블록을 제거한 텍스트만 노출
        displayAnalysis = rawText.replace(jsonMatch[0], "").trim();
      } catch {
        // JSON 파싱 실패 시 원문 그대로
      }
    }

    // 심각도 결정 (구조화 JSON 우선, 없으면 텍스트 fallback)
    let severity: "normal" | "mild" | "moderate" | "urgent" = structured.severity ?? "normal";
    if (!structured.severity) {
      const lower = rawText.toLowerCase();
      if (lower.includes("urgent") || rawText.includes("긴급")) severity = "urgent";
      else if (lower.includes("moderate") || rawText.includes("주의")) severity = "moderate";
      else if (lower.includes("mild") || rawText.includes("관찰")) severity = "mild";
    }

    return NextResponse.json({
      success: true,
      analysis: displayAnalysis,
      severity,
      // 구조화 필드
      fgs_total: structured.fgs_total ?? null,
      fgs_breakdown: structured.fgs_breakdown ?? null,
      severity_score: structured.severity_score ?? null,
      bboxes: structured.bboxes ?? [],
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 });
  }
}
