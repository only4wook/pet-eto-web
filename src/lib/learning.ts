/**
 * P.E.T AI 자가강화 학습 루프 — 공유 헬퍼
 *
 * 책임:
 *  - 다양한 한국 반려인 질문 자동 생성 (Gemini)
 *  - 현재 AI 페르소나로 답변 생성 (Gemini, /api/ai-chat 우회 — HTTP 루프 방지)
 *  - 답변 7개 기준 자동 채점 (Gemini grader 페르소나)
 *  - active exemplar 주입용 few-shot 빌더
 */

import { PET_AI_PERSONA, GENERATION_CONFIG, SAFETY_SETTINGS } from "./aiPrompts";

export type CaseCategory =
  | "emergency"
  | "chronic"
  | "behavioral"
  | "nutrition"
  | "cost"
  | "misc";

export interface GeneratedCase {
  category: CaseCategory;
  question: string;
}

export interface ScoreBreakdown {
  empathy: number;        // 0-1
  severity: number;       // 0-2
  causes: number;         // 0-2
  homecare: number;       // 0-2
  vet_timing: number;     // 0-1
  cost: number;           // 0-1
  followup: number;       // 0-1
}

export interface GradingResult {
  score: number;            // 0-10 (sum of breakdown)
  breakdown: ScoreBreakdown;
  weakness: string;         // 한 줄 약점 노트
}

export interface ExemplarRow {
  category: string;
  question: string;
  exemplar_response: string;
  score: number;
}

const GEMINI_ENDPOINT = (model: string, key: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

const DEFAULT_MODEL = "gemini-2.5-flash";

// ────────────────────────────────────────────────────────────────────
// 1. 테스트 케이스 생성 (Gemini)
// ────────────────────────────────────────────────────────────────────

export async function generateTestCases(
  count: number,
  apiKey: string,
  model: string = DEFAULT_MODEL,
): Promise<GeneratedCase[]> {
  const prompt = `당신은 한국 반려인 커뮤니티에 올라올법한 자연스러운 질문을 생성하는 AI입니다.

다음 6개 카테고리에 골고루 분포하여 정확히 ${count}개의 질문을 만드세요:
- emergency: 긴급 증상 (구토·경련·중독·외상 등 즉시 응급 처치 필요)
- chronic: 만성 문제 (장기간 식이·노령·만성 질환·재발성 증상)
- behavioral: 행동 (분리불안·공격성·합사·훈련·이상행동)
- nutrition: 영양 (사료·간식·체중·식단 변화)
- cost: 비용 (수술비·치료비·예방 접종·보험)
- misc: 일상 (그루밍·놀이·습관·새 환경 적응)

작성 규칙:
- 자연스러운 구어체 한국어 (반려인 톤)
- 50~200자 길이
- 종(고양이/강아지) 명시 + 가능하면 나이·체중·증상 포함
- "우리 ○○가...", "○○ 키우는데..." 같은 일상 톤
- 너무 일반적이지 않고 구체적 (예: "건강 상담" X, "5살 고양이 어제부터 토" O)

응답은 반드시 **JSON ARRAY** 만 출력. 다른 설명·마크다운 X.
[{"category":"emergency","question":"..."}, ...]`;

  const res = await fetch(GEMINI_ENDPOINT(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9, // 다양성 위해 높임
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 4000,
        responseMimeType: "application/json",
      },
      safetySettings: SAFETY_SETTINGS,
    }),
  });

  if (!res.ok) {
    throw new Error(`generate ${res.status}: ${(await res.text()).slice(0, 300)}`);
  }
  const data = await res.json();
  const raw = data?.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // JSON 마크다운 코드블록으로 감싸진 경우 추출
    const jsonMatch = raw.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error(`generate JSON parse failed: ${raw.slice(0, 200)}`);
    parsed = JSON.parse(jsonMatch[0]);
  }
  if (!Array.isArray(parsed)) throw new Error("generate returned non-array");

  // 안전 필터링: category enum 검증 + 길이 체크
  const validCats: CaseCategory[] = ["emergency", "chronic", "behavioral", "nutrition", "cost", "misc"];
  return parsed
    .filter((c) => validCats.includes(c?.category) && typeof c?.question === "string" && c.question.length >= 20)
    .map((c) => ({ category: c.category as CaseCategory, question: c.question.trim() }))
    .slice(0, count);
}

// ────────────────────────────────────────────────────────────────────
// 2. 현재 AI 페르소나로 답변 생성 (HTTP 루프 회피, Gemini 직접 호출)
// ────────────────────────────────────────────────────────────────────

export async function generateAIResponse(
  question: string,
  apiKey: string,
  model: string = DEFAULT_MODEL,
  exemplarFewShot: string = "", // 선택: 활성 exemplar 주입
): Promise<string> {
  const systemText = PET_AI_PERSONA + (exemplarFewShot ? "\n\n" + exemplarFewShot : "");

  const res = await fetch(GEMINI_ENDPOINT(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemText }] },
      contents: [{ role: "user", parts: [{ text: question }] }],
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
    }),
  });

  if (!res.ok) {
    throw new Error(`ai-response ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
}

// ────────────────────────────────────────────────────────────────────
// 3. 자동 채점 (Gemini grader 페르소나)
// ────────────────────────────────────────────────────────────────────

const GRADER_PROMPT = `당신은 펫에토 AI 답변 품질을 엄격히 검수하는 시니어 수의사입니다.
다음 [질문]에 대한 [답변]을 7개 기준으로 채점하세요.

채점 기준 (JSON 키 = 평가 항목, 값 = 점수):
- empathy: 공감 한 줄로 시작했는지 (0 또는 1)
- severity: 심각도를 정확히 판정했는지 — 라벨(긴급/주의/관찰/정상) + 근거 구체성 (0~2)
- causes: 가능한 원인을 3-5가지 구체적으로 제시했는지 (모호한 "~수도 있어요" 표현 감점) (0~2)
- homecare: 지금 집에서 할 것을 번호 목록으로 명확히 제시했는지 (0~2)
- vet_timing: 병원 방문 시점을 명시했는지 (지금/24h/3일 내 등) (0 또는 1)
- cost: 한국 시세(만원 단위)로 구체적 비용을 제시했는지 (0 또는 1)
- followup: 자연스러운 후속 질문 유도가 있는지 (0 또는 1)

만점 합계: 1+2+2+2+1+1+1 = 10점

추가:
- weakness: 한 줄로 가장 부족한 부분 (예: "비용 정보 누락", "원인이 추상적")

응답은 반드시 JSON 만:
{"score": 8, "breakdown": {"empathy": 1, "severity": 2, "causes": 1, "homecare": 2, "vet_timing": 1, "cost": 0, "followup": 1}, "weakness": "..."}`;

export async function gradeResponse(
  question: string,
  response: string,
  apiKey: string,
  model: string = DEFAULT_MODEL,
): Promise<GradingResult> {
  const userMsg = `[질문]\n${question}\n\n[답변]\n${response}\n\n위 답변을 7개 기준으로 채점하고 JSON으로만 응답하세요.`;

  const res = await fetch(GEMINI_ENDPOINT(model, apiKey), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: GRADER_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: userMsg }] }],
      generationConfig: {
        temperature: 0.2, // 일관된 채점
        maxOutputTokens: 2000, // truncation 방지 (1000→2000)
        responseMimeType: "application/json",
      },
      safetySettings: SAFETY_SETTINGS,
    }),
  });

  if (!res.ok) {
    throw new Error(`grade ${res.status}: ${(await res.text()).slice(0, 200)}`);
  }
  const data = await res.json();
  const raw = (data?.candidates?.[0]?.content?.parts?.[0]?.text || "{}").trim();

  // JSON 파싱 — 모든 fallback 실패 시에도 정규식으로 점수만이라도 건짐
  let parsed: any = null;

  // 1) 그대로
  try { parsed = JSON.parse(raw); } catch {}

  // 2) 코드블록 마커 제거
  if (!parsed) {
    const stripped = raw
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();
    try { parsed = JSON.parse(stripped); } catch {}

    // 3) { ~ } 슬라이스 (}있을 때만)
    if (!parsed) {
      const firstBrace = stripped.indexOf("{");
      const lastBrace = stripped.lastIndexOf("}");
      if (firstBrace >= 0 && lastBrace > firstBrace) {
        const sliced = stripped.slice(firstBrace, lastBrace + 1);
        try { parsed = JSON.parse(sliced); } catch {}
      }
    }
  }

  // 4) 모든 파싱 실패 — raw 전체에서 정규식으로 score + breakdown 추출
  //    이전 버그: }가 없으면 (truncation) 이 단계까지 못 갔음. 이제 항상 도달.
  if (!parsed) {
    const scoreMatch = raw.match(/"score"\s*:\s*(\d+)/);
    if (scoreMatch) {
      const breakdown: any = {};
      const fields = ["empathy", "severity", "causes", "homecare", "vet_timing", "cost", "followup"];
      for (const f of fields) {
        const m = raw.match(new RegExp(`"${f}"\\s*:\\s*(\\d+)`));
        if (m) breakdown[f] = parseInt(m[1], 10);
      }
      const weaknessMatch = raw.match(/"weakness"\s*:\s*"([^"]*)"/);
      parsed = {
        score: parseInt(scoreMatch[1], 10),
        breakdown,
        weakness: weaknessMatch ? weaknessMatch[1] : "정규식 부분 파싱",
      };
    }
  }

  if (!parsed) throw new Error(`grade parse failed: ${raw.slice(0, 300)}`);

  // 검증·기본값
  const breakdown: ScoreBreakdown = {
    empathy: clamp(parsed?.breakdown?.empathy, 0, 1),
    severity: clamp(parsed?.breakdown?.severity, 0, 2),
    causes: clamp(parsed?.breakdown?.causes, 0, 2),
    homecare: clamp(parsed?.breakdown?.homecare, 0, 2),
    vet_timing: clamp(parsed?.breakdown?.vet_timing, 0, 1),
    cost: clamp(parsed?.breakdown?.cost, 0, 1),
    followup: clamp(parsed?.breakdown?.followup, 0, 1),
  };
  const score =
    breakdown.empathy +
    breakdown.severity +
    breakdown.causes +
    breakdown.homecare +
    breakdown.vet_timing +
    breakdown.cost +
    breakdown.followup;

  return {
    score,
    breakdown,
    weakness: typeof parsed?.weakness === "string" ? parsed.weakness.slice(0, 200) : "",
  };
}

function clamp(v: any, min: number, max: number): number {
  const n = typeof v === "number" ? v : parseInt(String(v ?? 0), 10);
  if (isNaN(n)) return min;
  return Math.max(min, Math.min(max, n));
}

// ────────────────────────────────────────────────────────────────────
// 4. Active exemplar → few-shot 텍스트 빌더 (런타임 주입용)
// ────────────────────────────────────────────────────────────────────

export function buildExemplarFewShot(rows: ExemplarRow[]): string {
  if (rows.length === 0) return "";
  const blocks = rows.map((r, i) => `### 학습 예시 ${i + 1} — 카테고리: ${r.category} (점수 ${r.score}/10)\n\n**질문**: ${r.question}\n\n**모범 답변**:\n${r.exemplar_response}`);
  return `## 추가 학습 예시 (자가강화 루프 — 최근 우수 답변)\n\n${blocks.join("\n\n---\n\n")}`;
}
