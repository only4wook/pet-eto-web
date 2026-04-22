import type { AnalysisResult, ExpertStatus } from "../types";

const RISK_PATTERNS = [
  "침흘",
  "유연",
  "drool",
  "거품",
  "입벌",
  "mouth open",
  "호흡",
  "헥헥",
  "pant",
  "무기력",
  "축 처",
  "쓰러",
  "기절",
];

function includesRiskWord(text: string) {
  return RISK_PATTERNS.some((p) => text.includes(p));
}

export function getSafeSeverity(
  analysis: AnalysisResult | null | undefined,
  postMeta?: { request_expert?: boolean; expert_status?: ExpertStatus | string | null }
): AnalysisResult["severity"] | undefined {
  if (!analysis) return undefined;

  const base = analysis.severity;
  if (base !== "normal") return base;

  const hasStructuredEvidence =
    typeof analysis.fgs_total === "number" ||
    typeof analysis.severity_score === "number" ||
    !!analysis.fgs_breakdown ||
    ((analysis.bboxes?.length || 0) > 0);

  const riskText = `${analysis.summary || ""}\n${analysis.recommendation || ""}`.toLowerCase();
  const hasRisk = includesRiskWord(riskText);

  if (postMeta?.expert_status === "answered") return "moderate";
  if (postMeta?.request_expert) return "moderate";
  if (hasRisk) return "moderate";
  if (!hasStructuredEvidence) return "mild"; // 구버전/근거 부족 normal은 관찰로 상향
  return base;
}

export function withSafeAnalysis(
  analysis: AnalysisResult | null | undefined,
  postMeta?: { request_expert?: boolean; expert_status?: ExpertStatus | string | null }
): AnalysisResult | null {
  if (!analysis) return null;
  const safeSeverity = getSafeSeverity(analysis, postMeta);
  if (!safeSeverity || safeSeverity === analysis.severity) return analysis;
  return { ...analysis, severity: safeSeverity };
}
