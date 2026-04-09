import type { AnalysisResult } from "../types";

// 증상 키워드 사전 (한국어)
const SYMPTOM_DB: { keyword: string; weight: number; label: string }[] = [
  // 긴급 (weight 3)
  { keyword: "경련", weight: 3, label: "경련/발작" },
  { keyword: "발작", weight: 3, label: "경련/발작" },
  { keyword: "의식", weight: 3, label: "의식 저하" },
  { keyword: "호흡곤란", weight: 3, label: "호흡 곤란" },
  { keyword: "숨을 못", weight: 3, label: "호흡 곤란" },
  { keyword: "헐떡", weight: 3, label: "호흡 이상" },
  { keyword: "출혈", weight: 3, label: "출혈" },
  { keyword: "피를 토", weight: 3, label: "혈액 구토" },
  { keyword: "피가 나", weight: 3, label: "출혈" },
  { keyword: "중독", weight: 3, label: "중독 의심" },
  { keyword: "초콜릿", weight: 3, label: "초콜릿 중독 의심" },
  { keyword: "포도", weight: 3, label: "포도 중독 의심" },
  { keyword: "양파", weight: 3, label: "양파 중독 의심" },
  { keyword: "마비", weight: 3, label: "마비 증상" },
  { keyword: "쓰러", weight: 3, label: "쓰러짐/기절" },
  { keyword: "못 일어나", weight: 3, label: "기력 저하" },
  { keyword: "뒷다리를 못", weight: 3, label: "하반신 마비 의심" },

  // 주의 (weight 2)
  { keyword: "구토", weight: 2, label: "구토" },
  { keyword: "토해", weight: 2, label: "구토" },
  { keyword: "토하", weight: 2, label: "구토" },
  { keyword: "설사", weight: 2, label: "설사" },
  { keyword: "밥을 안", weight: 2, label: "식욕 부진" },
  { keyword: "밥 안", weight: 2, label: "식욕 부진" },
  { keyword: "안 먹", weight: 2, label: "식욕 부진" },
  { keyword: "식욕", weight: 2, label: "식욕 변화" },
  { keyword: "절뚝", weight: 2, label: "절뚝거림" },
  { keyword: "다리를 절", weight: 2, label: "절뚝거림" },
  { keyword: "눈 충혈", weight: 2, label: "눈 충혈" },
  { keyword: "눈이 빨", weight: 2, label: "눈 충혈" },
  { keyword: "귀에서 냄새", weight: 2, label: "귀 감염 의심" },
  { keyword: "피부 발진", weight: 2, label: "피부 발진" },
  { keyword: "탈모", weight: 2, label: "탈모" },
  { keyword: "털이 빠", weight: 2, label: "탈모" },
  { keyword: "체중이 줄", weight: 2, label: "체중 감소" },
  { keyword: "물을 많이", weight: 2, label: "다음/다뇨 의심" },
  { keyword: "소변을 자주", weight: 2, label: "다뇨 의심" },
  { keyword: "혹", weight: 2, label: "종양/혹 발견" },
  { keyword: "덩어리", weight: 2, label: "종양/혹 발견" },
  { keyword: "부어", weight: 2, label: "부종" },
  { keyword: "부었", weight: 2, label: "부종" },
  { keyword: "열이", weight: 2, label: "발열 의심" },
  { keyword: "뜨거", weight: 2, label: "발열 의심" },

  // 경미 (weight 1)
  { keyword: "기침", weight: 1, label: "기침" },
  { keyword: "재채기", weight: 1, label: "재채기" },
  { keyword: "눈물", weight: 1, label: "눈물/눈곱" },
  { keyword: "눈곱", weight: 1, label: "눈물/눈곱" },
  { keyword: "긁", weight: 1, label: "가려움" },
  { keyword: "가려", weight: 1, label: "가려움" },
  { keyword: "냄새", weight: 1, label: "악취" },
  { keyword: "귀 긁", weight: 1, label: "귀 가려움" },
  { keyword: "발 핥", weight: 1, label: "발 핥기" },
  { keyword: "코 마름", weight: 1, label: "코 건조" },
  { keyword: "콧물", weight: 1, label: "콧물" },
  { keyword: "입냄새", weight: 1, label: "구취" },
  { keyword: "잇몸", weight: 1, label: "잇몸 이상" },
  { keyword: "변비", weight: 1, label: "변비" },
  { keyword: "무기력", weight: 1, label: "무기력" },
  { keyword: "잠만", weight: 1, label: "과도한 수면" },
  { keyword: "숨는", weight: 1, label: "은둔 행동" },
  { keyword: "숨어", weight: 1, label: "은둔 행동" },
];

export function analyzeSymptoms(description: string, petSpecies: string): AnalysisResult {
  const text = description.toLowerCase().replace(/\s+/g, " ");
  const matched = new Map<string, number>();

  for (const item of SYMPTOM_DB) {
    if (text.includes(item.keyword)) {
      const existing = matched.get(item.label) ?? 0;
      if (item.weight > existing) {
        matched.set(item.label, item.weight);
      }
    }
  }

  const symptoms = Array.from(matched.keys());
  const totalWeight = Array.from(matched.values()).reduce((a, b) => a + b, 0);

  let severity: AnalysisResult["severity"];
  let summary: string;
  let recommendation: string;

  const speciesName = petSpecies === "dog" ? "강아지" : petSpecies === "cat" ? "고양이" : "반려동물";

  if (totalWeight >= 6) {
    severity = "urgent";
    summary = `긴급 증상이 감지되었습니다! ${speciesName}에게서 ${symptoms.join(", ")} 증상이 의심됩니다.`;
    recommendation = "즉시 가까운 동물병원에 방문하시길 강력히 권장합니다. 24시 응급 동물병원을 확인하세요.";
  } else if (totalWeight >= 3) {
    severity = "moderate";
    summary = `주의가 필요한 증상이 감지되었습니다. ${speciesName}에게서 ${symptoms.join(", ")} 증상이 관찰됩니다.`;
    recommendation = "빠른 시일 내 동물병원 내원을 권장합니다. 해당 증상에 전문적인 수의사 상담을 받아보세요.";
  } else if (totalWeight >= 1) {
    severity = "mild";
    summary = `가벼운 증상이 관찰됩니다. ${symptoms.join(", ")} 증상이 있을 수 있습니다.`;
    recommendation = "증상이 지속되거나 악화되면 수의사 상담을 권장합니다.";
  } else {
    severity = "normal";
    summary = `${speciesName}의 특별한 건강 이상 징후는 감지되지 않았습니다.`;
    recommendation = "건강한 상태로 보입니다. 정기 검진을 잊지 마세요!";
  }

  return { severity, symptoms, summary, recommendation };
}

export function getSeverityColor(severity: AnalysisResult["severity"]) {
  switch (severity) {
    case "urgent": return { color: "#fff", bg: "#EF4444", border: "#DC2626" };
    case "moderate": return { color: "#fff", bg: "#F59E0B", border: "#D97706" };
    case "mild": return { color: "#fff", bg: "#3B82F6", border: "#2563EB" };
    case "normal": return { color: "#fff", bg: "#22C55E", border: "#16A34A" };
  }
}

export function getSeverityLabel(severity: AnalysisResult["severity"]) {
  switch (severity) {
    case "urgent": return "긴급";
    case "moderate": return "주의";
    case "mild": return "관찰";
    case "normal": return "정상";
  }
}
