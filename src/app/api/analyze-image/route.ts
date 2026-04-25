import { NextRequest, NextResponse } from "next/server";
import { PET_AI_PERSONA, IMAGE_ANALYSIS_CONFIG, SAFETY_SETTINGS } from "../../../lib/aiPrompts";

// Vercel: 두 번의 Gemini 호출을 안전하게 끝낼 수 있도록 60초로 확장 (Pro 이상에서 적용)
export const maxDuration = 60;

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

중요한 판정 규칙:
- "normal"은 얼굴/자세/호흡/문제 부위가 충분히 선명하게 확인될 때만 사용.
- 사진이 흐리거나 가려져서 판단이 어렵다면 normal 금지. 최소 mild 또는 moderate로 분류하고 "평가 제한(각도/화질/가림)"을 명시.
- 침흘림·입벌림 호흡·눈/코 분비물·기립 이상·극심한 무기력 징후가 보이면 normal 금지.

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

const RED_FLAG_TRIAGE_TASK = `
당신은 반려동물 응급 분류기입니다.
이미지에서 아래 위험 신호를 "있음/없음"으로만 판단하고 반드시 JSON만 출력하세요.

위험 신호:
1) drooling_hypersalivation: 과다 침흘림
2) open_mouth_breathing: 입벌림 호흡/호흡곤란 징후
3) severe_ocular_nasal_discharge: 눈/코의 비정상 분비물
4) lethargic_or_collapse_posture: 무기력·축 처짐·기립 이상 자세
5) visible_trauma_or_bleeding: 외상·출혈·뚜렷한 상처
6) face_pain_expression: 고양이 얼굴 통증 표정(FGS 관점)

severity_rule:
- 위험 신호 2개 이상이면 urgent
- drooling_hypersalivation + lethargic_or_collapse_posture 조합이면 즉시 urgent
- 위험 신호 1개면 moderate
- 아무것도 없지만 이미지 불분명하면 mild
- 명확히 이상 소견 없고 품질 충분하면 normal

반드시 아래 JSON만 출력:
{
  "drooling_hypersalivation": true/false,
  "open_mouth_breathing": true/false,
  "severe_ocular_nasal_discharge": true/false,
  "lethargic_or_collapse_posture": true/false,
  "visible_trauma_or_bleeding": true/false,
  "face_pain_expression": true/false,
  "image_uncertain": true/false,
  "severity": "normal" | "mild" | "moderate" | "urgent",
  "reason": "한 줄 요약"
}
`;

const UNCERTAIN_PATTERNS = [
  "판단이 어렵",
  "평가 불가",
  "확인이 어렵",
  "화질",
  "흐리",
  "가려",
  "각도",
  "부분만",
  "명확하지",
  "제한적",
  "불충분",
];

const RED_FLAG_PATTERNS = [
  "침흘",
  "유연",
  "drool",
  "입벌",
  "mouth open",
  "호흡",
  "헥헥",
  "pant",
  "콧물",
  "눈물",
  "분비물",
  "무기력",
  "축 처",
  "웅크",
  "비정상 자세",
];

const HIGH_RISK_PATTERNS = [
  "침흘",
  "유연",
  "drool",
  "거품",
  "입벌",
  "mouth open",
  "호흡곤란",
  "청색증",
  "경련",
  "발작",
  "출혈",
];

const SPECIES_TRIAGE_WEIGHTS: Record<
  string,
  {
    droolingWeight: number;
    breathingWeight: number;
    lethargyWeight: number;
    traumaWeight: number;
    urgentFlagThreshold: number;
    moderateFlagThreshold: number;
  }
> = {
  cat: {
    droolingWeight: 3,
    breathingWeight: 3,
    lethargyWeight: 2,
    traumaWeight: 2,
    urgentFlagThreshold: 4,
    moderateFlagThreshold: 2,
  },
  dog: {
    droolingWeight: 1, // 강아지는 침흘림 자체만으로는 고양이보다 보수적
    breathingWeight: 3,
    lethargyWeight: 2,
    traumaWeight: 2,
    urgentFlagThreshold: 4,
    moderateFlagThreshold: 2,
  },
  other: {
    droolingWeight: 2,
    breathingWeight: 3,
    lethargyWeight: 2,
    traumaWeight: 2,
    urgentFlagThreshold: 4,
    moderateFlagThreshold: 2,
  },
};

function includesAny(text: string, patterns: string[]) {
  return patterns.some((p) => text.includes(p));
}

function computeSeverityScore(params: {
  baseSeverity: "normal" | "mild" | "moderate" | "urgent";
  fgsTotal?: number | null;
  redFlagCount: number;
  hasHighRiskText: boolean;
  imageUncertain?: boolean;
}) {
  const base = params.baseSeverity === "urgent" ? 8 : params.baseSeverity === "moderate" ? 6 : params.baseSeverity === "mild" ? 3 : 1;
  const fgsBoost = typeof params.fgsTotal === "number" ? Math.min(4, Math.round(params.fgsTotal / 2)) : 0;
  const flagBoost = Math.min(4, params.redFlagCount);
  const riskBoost = params.hasHighRiskText ? 2 : 0;
  const uncertainBoost = params.imageUncertain ? 1 : 0;
  return Math.max(0, Math.min(10, base + fgsBoost + flagBoost + riskBoost + uncertainBoost));
}

function computeSpeciesRiskPoints(
  species: string,
  redFlag: {
    drooling_hypersalivation?: boolean;
    open_mouth_breathing?: boolean;
    lethargic_or_collapse_posture?: boolean;
    visible_trauma_or_bleeding?: boolean;
    face_pain_expression?: boolean;
  }
) {
  const w = SPECIES_TRIAGE_WEIGHTS[species] || SPECIES_TRIAGE_WEIGHTS.other;
  let points = 0;
  if (redFlag.drooling_hypersalivation) points += w.droolingWeight;
  if (redFlag.open_mouth_breathing) points += w.breathingWeight;
  if (redFlag.lethargic_or_collapse_posture) points += w.lethargyWeight;
  if (redFlag.visible_trauma_or_bleeding) points += w.traumaWeight;
  if (redFlag.face_pain_expression) points += 1;
  return { points, weights: w };
}

function buildEmergencyGuidance(params: {
  species: string;
  severity: "normal" | "mild" | "moderate" | "urgent";
  redFlag: {
    drooling_hypersalivation?: boolean;
    open_mouth_breathing?: boolean;
    lethargic_or_collapse_posture?: boolean;
    visible_trauma_or_bleeding?: boolean;
  };
}) {
  const { species, severity, redFlag } = params;
  if (severity !== "urgent" && severity !== "moderate") return "";

  const lines: string[] = [];
  lines.push("🚨 [응급 분류 보강 가이드]");
  if (species === "cat" && redFlag.drooling_hypersalivation) {
    lines.push("- 고양이의 과다 침흘림은 중독·구강 통증·이물·신경계 이상 가능성이 있어 응급 우선 평가가 필요합니다.");
  }
  if (redFlag.open_mouth_breathing) {
    lines.push("- 입벌림 호흡이 보이면 호흡기/심혈관 응급 가능성이 있어 지체 없이 내원이 필요합니다.");
  }
  if (redFlag.lethargic_or_collapse_posture) {
    lines.push("- 무기력/기립 이상이 동반되면 전신 상태 악화 신호일 수 있습니다.");
  }
  if (redFlag.visible_trauma_or_bleeding) {
    lines.push("- 외상·출혈은 2차 쇼크 위험이 있어 즉시 처치가 필요합니다.");
  }

  lines.push("");
  lines.push("🏥 [지금 바로 할 행동]");
  lines.push("1) 물/간식/약 임의 투여를 멈추고, 호흡·의식 상태를 먼저 확인하세요.");
  lines.push("2) 이동이 가능하면 즉시 24시 동물병원으로 이동하세요.");
  lines.push("3) 이동이 어렵다면 펫택시/대행 진료를 즉시 요청하세요.");
  lines.push("");
  lines.push("📋 [병원에 전달할 체크리스트]");
  lines.push("- 증상 시작 시점(갑자기/점진적), 반복 횟수");
  lines.push("- 동반 증상(구토·설사·호흡 곤란·경련·무기력)");
  lines.push("- 독성 물질/약/세제/식물 접근 가능성");
  lines.push("- 최근 섭취 음식 및 기존 질환/복용약");
  lines.push("");
  lines.push("💰 [예상 비용 가이드]");
  lines.push("- 응급 초진 + 기본 검사(혈액/X-ray): 약 10만~40만원");
  lines.push("- 증상에 따라 입원/집중치료 시 추가 비용 발생 가능");

  return lines.join("\n");
}

// Gemini 모델 폴백 체인 — 최신부터 순서대로
const VISION_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

async function callGemini({
  apiKey,
  mimeType,
  base64,
  systemText,
  userText,
  model = "gemini-2.5-flash",
}: {
  apiKey: string;
  mimeType: string;
  base64: string;
  systemText: string;
  userText: string;
  model?: string;
}) {
  const res = await fetch(
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
            { text: userText },
          ],
        }],
        generationConfig: IMAGE_ANALYSIS_CONFIG,
        safetySettings: SAFETY_SETTINGS,
      }),
    }
  );
  return res;
}

// Gemini 모델 폴백 체인으로 호출 — 429/5xx면 다음 모델 시도
async function callGeminiWithFallback(opts: {
  apiKey: string;
  mimeType: string;
  base64: string;
  systemText: string;
  userText: string;
}): Promise<{ ok: true; rawText: string; model: string } | { ok: false; status: number; error: string }> {
  let lastStatus = 0;
  let lastError = "";
  for (const model of VISION_MODELS) {
    const res = await callGemini({ ...opts, model });
    if (res.ok) {
      const data = await res.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      if (rawText) return { ok: true, rawText, model };
      lastError = data?.promptFeedback?.blockReason || "empty";
      lastStatus = 0;
      continue;
    }
    lastStatus = res.status;
    lastError = (await res.text().catch(() => "")).slice(0, 200);
    if (res.status !== 429 && res.status < 500) break;
  }
  return { ok: false, status: lastStatus, error: lastError };
}

// OpenAI gpt-4o vision 폴백 — Gemini 전부 실패 시
async function callOpenAIVision(opts: {
  apiKey: string;
  mimeType: string;
  base64: string;
  systemText: string;
  userText: string;
}): Promise<{ ok: true; rawText: string } | { ok: false; status: number; error: string }> {
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
        {
          role: "user",
          content: [
            { type: "text", text: opts.userText },
            { type: "image_url", image_url: { url: `data:${opts.mimeType};base64,${opts.base64}` } },
          ],
        },
      ],
      temperature: 0.5,
      max_tokens: 1500,
    }),
  });
  if (!res.ok) {
    return { ok: false, status: res.status, error: (await res.text().catch(() => "")).slice(0, 200) };
  }
  const data = await res.json();
  const rawText = data?.choices?.[0]?.message?.content || "";
  if (!rawText) return { ok: false, status: 0, error: "empty" };
  return { ok: true, rawText };
}

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
    // quick=1 이면 트리아지 스킵 — 인라인 호출(피드 업로드)에서 응답 빠르게 받기 위함
    // (큐 처리 시에는 quick 없이 호출 → 풀 분석)
    const quick = (formData.get("quick") as string) === "1";

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";

    const animalName = species === "cat" ? "고양이" : species === "dog" ? "강아지" : "반려동물";
    const userContext = `보호자가 ${animalName} 사진을 올렸습니다.\n${description ? `보호자 설명: "${description}"` : "별도 설명 없음."}`;

    type RedFlagResult = {
      drooling_hypersalivation?: boolean;
      open_mouth_breathing?: boolean;
      severe_ocular_nasal_discharge?: boolean;
      lethargic_or_collapse_posture?: boolean;
      visible_trauma_or_bleeding?: boolean;
      face_pain_expression?: boolean;
      image_uncertain?: boolean;
      severity?: "normal" | "mild" | "moderate" | "urgent";
      reason?: string;
    };

    // 메인 분석 — Gemini 폴백 체인. 전부 실패 시 OpenAI gpt-4o-mini 폴백.
    const mainSystemText = PET_AI_PERSONA + "\n\n" + IMAGE_ANALYSIS_TASK;
    let rawText = "";
    let usedModel = "";
    const geminiResult = await callGeminiWithFallback({
      apiKey, mimeType, base64,
      systemText: mainSystemText,
      userText: userContext,
    });
    if (geminiResult.ok) {
      rawText = geminiResult.rawText;
      usedModel = geminiResult.model;
    } else {
      // Gemini 다 실패 → OpenAI 폴백
      const openaiKey = process.env.OPENAI_API_KEY;
      if (openaiKey) {
        const oaResult = await callOpenAIVision({
          apiKey: openaiKey, mimeType, base64,
          systemText: mainSystemText,
          userText: userContext,
        });
        if (oaResult.ok) {
          rawText = oaResult.rawText;
          usedModel = "gpt-4o-mini";
        } else {
          return NextResponse.json({
            error: `AI 호출 실패: gemini=${geminiResult.error} | openai=${oaResult.error}`,
          }, { status: 500 });
        }
      } else {
        return NextResponse.json({
          error: `Gemini API 오류: ${geminiResult.status} ${geminiResult.error}`,
        }, { status: 500 });
      }
    }

    // 트리아지는 quick 모드에서 스킵 (큐가 나중에 처리)
    let triageResSettled: Response | null = null;
    if (!quick) {
      triageResSettled = await callGemini({
        apiKey,
        mimeType,
        base64,
        systemText: RED_FLAG_TRIAGE_TASK,
        userText: userContext,
      }).catch(() => null);
    }

    let redFlag: RedFlagResult = {};
    if (triageResSettled && triageResSettled.ok) {
      try {
        const triageData = await triageResSettled.json();
        const triageText = triageData?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        const cleaned = triageText.replace(/```json|```/gi, "").trim();
        const parsed = JSON.parse(cleaned);
        if (parsed && typeof parsed === "object") redFlag = parsed;
      } catch {
        // 레드플래그 분류 파싱 실패 시 무시
      }
    }

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

    // FGS 점수 기반 강제 보정 (모델 텍스트 오판 방지)
    if (typeof structured.fgs_total === "number") {
      if (structured.fgs_total >= 7) severity = "urgent";
      else if (structured.fgs_total >= 4 && severity !== "urgent") severity = "moderate";
      else if (structured.fgs_total >= 3 && severity === "normal") severity = "mild";
    }

    // "정상 오판" 방지 가드레일: 불확실/레드플래그 단어가 있으면 정상 금지
    const guardText = `${displayAnalysis}\n${description}`.toLowerCase();
    const hasUncertain = includesAny(guardText, UNCERTAIN_PATTERNS);
    const hasRedFlag = includesAny(guardText, RED_FLAG_PATTERNS);
    const hasHighRiskText = includesAny(guardText, HIGH_RISK_PATTERNS);
    if (severity === "normal" && hasRedFlag) severity = "moderate";
    else if (severity === "normal" && hasUncertain) severity = "mild";
    else if (severity === "mild" && hasRedFlag) severity = "moderate";

    // 2차 분류기 결과로 상향 보정 (하향 보정은 금지)
    const redFlagSeverity = redFlag.severity;
    if (redFlagSeverity === "urgent") severity = "urgent";
    else if (redFlagSeverity === "moderate" && (severity === "normal" || severity === "mild")) severity = "moderate";
    else if (redFlagSeverity === "mild" && severity === "normal") severity = "mild";

    const hasCriticalCombo = Boolean(redFlag.drooling_hypersalivation) && Boolean(redFlag.lethargic_or_collapse_posture);
    const redFlagCount = [
      redFlag.drooling_hypersalivation,
      redFlag.open_mouth_breathing,
      redFlag.severe_ocular_nasal_discharge,
      redFlag.lethargic_or_collapse_posture,
      redFlag.visible_trauma_or_bleeding,
      redFlag.face_pain_expression,
    ].filter(Boolean).length;
    const speciesRisk = computeSpeciesRiskPoints(species, redFlag);

    if (hasCriticalCombo || redFlagCount >= 2) severity = "urgent";
    else if (redFlagCount === 1 && severity === "normal") severity = "moderate";
    else if (redFlag.image_uncertain && severity === "normal") severity = "mild";

    // 고양이 침흘림은 단독으로도 응급 가능성이 높아 urgent로 상향
    if (species === "cat" && redFlag.drooling_hypersalivation) {
      severity = "urgent";
    }

    // 텍스트/이미지 단서에 고위험 표현이 있으면 최소 moderate
    if (hasHighRiskText && (severity === "normal" || severity === "mild")) {
      severity = "moderate";
    }

    if (speciesRisk.points >= speciesRisk.weights.urgentFlagThreshold) {
      severity = "urgent";
    } else if (
      speciesRisk.points >= speciesRisk.weights.moderateFlagThreshold &&
      (severity === "normal" || severity === "mild")
    ) {
      severity = "moderate";
    }

    // 점수형 위험도 산출(구조화 점수 없을 때 보강)
    const severityScore =
      typeof structured.severity_score === "number"
        ? structured.severity_score
        : computeSeverityScore({
            baseSeverity: severity,
            fgsTotal: structured.fgs_total,
            redFlagCount,
            hasHighRiskText,
            imageUncertain: Boolean(redFlag.image_uncertain || hasUncertain),
          });

    const emergencyGuidance = buildEmergencyGuidance({
      species,
      severity,
      redFlag,
    });
    const finalAnalysis = emergencyGuidance ? `${displayAnalysis}\n\n${emergencyGuidance}` : displayAnalysis;

    return NextResponse.json({
      success: true,
      analysis: finalAnalysis,
      severity,
      model: usedModel,
      // 구조화 필드
      fgs_total: structured.fgs_total ?? null,
      fgs_breakdown: structured.fgs_breakdown ?? null,
      severity_score: severityScore,
      bboxes: structured.bboxes ?? [],
      triage_flags: redFlag,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 });
  }
}
