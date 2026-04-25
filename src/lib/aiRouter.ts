// P.E.T AI Hybrid Router
// 질문 난이도·긴급도를 분류해서 최적 모델 선택
// 비용 최적화: 일반 질문 단일 모델, 중요 질문만 앙상블

export type QueryUrgency = "critical" | "complex" | "normal";
export type RouteDecision = "gemini-single" | "gpt-single" | "ensemble" | "knowledge-first";

export interface ClassificationResult {
  urgency: QueryUrgency;
  route: RouteDecision;
  reasons: string[];
  detectedKeywords: string[];
  locale: "ko" | "en";
}

// ─────────────────────────────────────────────
// 생명 위험 키워드 (앙상블 필수 — 두 모델 교차검증)
// ─────────────────────────────────────────────
const CRITICAL_KEYWORDS_KO = [
  // 독성
  "초콜릿", "포도", "양파", "마늘", "건포도", "자일리톨", "카페인", "알코올", "약 먹",
  "농약", "쥐약", "살충제", "세제", "표백제", "부동액", "유독",
  // 응급 증상
  "피 토", "피 나", "출혈", "경련", "발작", "기절", "의식 없", "쇼크", "안 움직",
  "숨을 안 쉬", "숨 안 쉬", "호흡 곤란", "청색증", "보라색", "뻣뻣",
  "차에 치", "교통사고", "높은 곳에서 떨어", "심하게 다",
  // 응급 상태
  "긴급", "응급", "당장", "지금 죽", "위험", "심각",
];

const CRITICAL_KEYWORDS_EN = [
  "chocolate", "grape", "raisin", "onion", "garlic", "xylitol", "caffeine", "alcohol",
  "pesticide", "poison", "antifreeze", "bleach", "toxic",
  "bleeding", "seizure", "collapse", "unconscious", "not breathing", "can't breathe",
  "hit by car", "fell from", "emergency", "urgent", "dying", "critical",
  "cyanosis", "blue tongue", "limp", "rigid",
];

// ─────────────────────────────────────────────
// 복잡/애매 키워드 (GPT-4o가 더 잘 다루는 맥락 복잡 질문)
// ─────────────────────────────────────────────
const COMPLEX_KEYWORDS_KO = [
  "만성", "장기간", "오래 전부터", "계속", "반복", "자꾸",
  "행동 교정", "훈련", "분리불안", "공격성", "우울",
  "여러 가지", "복합", "원인 모르겠", "왜 그런지",
];

const COMPLEX_KEYWORDS_EN = [
  "chronic", "long-term", "ongoing", "recurring", "behavior", "behavioral",
  "training", "separation anxiety", "aggression", "depression",
  "multiple", "complex", "unsure why", "can't figure out",
];

function detectLocale(query: string): "ko" | "en" {
  // 한글 글자가 포함되어 있으면 한국어
  if (/[가-힣]/.test(query)) return "ko";
  return "en";
}

function countMatches(text: string, keywords: string[]): string[] {
  const lower = text.toLowerCase();
  const matched: string[] = [];
  for (const k of keywords) {
    if (lower.includes(k.toLowerCase())) matched.push(k);
  }
  return matched;
}

/**
 * 쿼리를 분류해서 최적 라우팅 결정
 * @param query 사용자 질문
 * @param explicitLocale 앱 레벨에서 온 locale (KO|EN 토글)
 */
export function classifyQuery(
  query: string,
  explicitLocale?: "ko" | "en"
): ClassificationResult {
  const locale = explicitLocale || detectLocale(query);
  const reasons: string[] = [];

  const criticalKeywords = locale === "en" ? CRITICAL_KEYWORDS_EN : CRITICAL_KEYWORDS_KO;
  const complexKeywords = locale === "en" ? COMPLEX_KEYWORDS_EN : COMPLEX_KEYWORDS_KO;

  const criticalMatches = countMatches(query, criticalKeywords);
  const complexMatches = countMatches(query, complexKeywords);

  // 1. 생명 위험 키워드 감지 → 앙상블
  if (criticalMatches.length > 0) {
    reasons.push(`critical keywords detected: ${criticalMatches.slice(0, 3).join(", ")}`);
    return {
      urgency: "critical",
      route: "ensemble",
      reasons,
      detectedKeywords: criticalMatches,
      locale,
    };
  }

  // 2. 복잡한 문맥 / 만성 문제 → GPT-4o 단일 (추론력 필요)
  if (complexMatches.length >= 2 || query.length > 200) {
    reasons.push(`complex query: ${complexMatches.length} complex keywords, ${query.length} chars`);
    return {
      urgency: "complex",
      route: "gpt-single",
      reasons,
      detectedKeywords: complexMatches,
      locale,
    };
  }

  // 3. 일반 질문 → Gemini 단일 (빠르고 저렴)
  reasons.push("normal query → single model (cost optimized)");
  return {
    urgency: "normal",
    route: "gemini-single",
    reasons,
    detectedKeywords: [],
    locale,
  };
}

// ─────────────────────────────────────────────
// 두 모델 답변 합의 확인
// ─────────────────────────────────────────────
export interface EnsembleResult {
  final: string;
  confidence: "high" | "medium" | "low";
  agreement: boolean;
  sources: string[];
}

/**
 * 두 AI 답변의 "severity 일치 여부"를 확인해 신뢰도를 산정
 * 불일치 시 양쪽 답변을 사용자에게 투명하게 보여줌
 */
export function mergeEnsemble(
  geminiReply: string,
  gptReply: string,
  locale: "ko" | "en"
): EnsembleResult {
  const extractSeverity = (text: string): string => {
    const t = text.toLowerCase();
    if (t.includes("urgent") || text.includes("긴급") || t.includes("emergency")) return "urgent";
    if (t.includes("moderate") || text.includes("주의") || t.includes("caution")) return "moderate";
    if (t.includes("mild") || text.includes("관찰") || t.includes("observe")) return "mild";
    if (t.includes("normal") || text.includes("정상")) return "normal";
    return "unknown";
  };

  const gS = extractSeverity(geminiReply);
  const cS = extractSeverity(gptReply);
  const agreement = gS === cS && gS !== "unknown";

  if (agreement) {
    // 합의 시 더 긴 답변을 기본 + 다른 모델 추가 포인트 참고
    const longer = geminiReply.length >= gptReply.length ? geminiReply : gptReply;
    return {
      final: longer,
      confidence: "high",
      agreement: true,
      sources: ["Gemini 2.0 Flash", "GPT-4o"],
    };
  }

  // 불일치 → 둘 다 투명하게 표시, 보호자가 더 심각한 쪽을 선택하게
  const banner = locale === "en"
    ? "\n\n⚠️ **AI Ensemble Note**: Our two AI models gave slightly different severity assessments. Please review both and err on the cautious side.\n\n---\n\n"
    : "\n\n⚠️ **AI 앙상블 참고**: 두 AI 모델이 심각도를 약간 다르게 판단했습니다. 두 의견을 모두 검토하시고, 더 신중한 쪽을 따르는 것을 권장합니다.\n\n---\n\n";

  const divider = locale === "en" ? "\n\n### 🧠 Gemini analysis\n" : "\n\n### 🧠 Gemini 분석\n";
  const divider2 = locale === "en" ? "\n\n### 🤖 GPT-4o analysis\n" : "\n\n### 🤖 GPT-4o 분석\n";

  return {
    final: banner + divider + geminiReply + divider2 + gptReply,
    confidence: "medium",
    agreement: false,
    sources: ["Gemini 2.0 Flash", "GPT-4o"],
  };
}
