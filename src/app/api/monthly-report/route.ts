import { NextRequest, NextResponse } from "next/server";
import { PET_AI_PERSONA, GENERATION_CONFIG, SAFETY_SETTINGS } from "../../../lib/aiPrompts";

// 월간 건강 리포트 생성 API
// 클라이언트가 해당 유저의 이번 달 피드 업로드 요약 데이터를 보내면,
// Gemini가 자연스러운 "월간 건강 리포트"를 작성해 돌려줍니다.

type MonthlyInput = {
  pet_name: string;
  pet_species: string;
  month_label: string;      // "2026년 4월"
  total_uploads: number;
  severity_counts: { normal: number; mild: number; moderate: number; urgent: number };
  fgs_avg: number | null;
  fgs_trend: "improve" | "worsen" | "stable" | "unknown";
  top_symptoms: string[];
  recent_summaries: string[];
};

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY 미설정", fallback: true }, { status: 200 });
    }

    const input: MonthlyInput = await req.json();

    const prompt = `
아래 데이터는 한 보호자의 반려동물(${input.pet_name}·${input.pet_species === "cat" ? "고양이" : input.pet_species === "dog" ? "강아지" : "반려동물"})의 ${input.month_label} 건강 기록입니다.

━━━━━━━━━━
📋 데이터
━━━━━━━━━━
- 총 업로드: ${input.total_uploads}건
- 심각도 분포: 정상 ${input.severity_counts.normal} / 관찰 ${input.severity_counts.mild} / 주의 ${input.severity_counts.moderate} / 긴급 ${input.severity_counts.urgent}
- 평균 FGS 통증 지수: ${input.fgs_avg ?? "기록 없음"}
- 추세: ${input.fgs_trend === "improve" ? "호전" : input.fgs_trend === "worsen" ? "악화" : input.fgs_trend === "stable" ? "안정" : "데이터 부족"}
- 자주 등장한 증상: ${input.top_symptoms.length ? input.top_symptoms.join(", ") : "없음"}
- 최근 업로드 요약 3건:
${input.recent_summaries.map((s, i) => `  ${i + 1}. ${s}`).join("\n")}

━━━━━━━━━━
📝 출력 요청
━━━━━━━━━━

${input.pet_name}이(가) 가족 같은 존재임을 전제로, 따뜻하고 전문성 있는 월간 건강 리포트를 작성하세요.
출력은 반드시 아래 형식으로:

# 📅 ${input.month_label} ${input.pet_name} 건강 리포트

## 🎯 이달의 한 줄 요약
한 문장으로 핵심 (긍정/우려/안정 등 톤 선택).

## 📊 이달의 숫자
- 업로드 횟수와 빈도 해석 (일주일에 약 몇 번)
- 심각도 분포 해석 (정상이 대부분인지, 주의 이상이 있었는지)
- 평균 FGS 점수의 의미
- 추세 (호전·악화·안정) 짧은 설명

## 🩺 주요 소견
자주 등장한 증상·패턴을 2~3개 문단으로 풀이. 같은 증상이 반복되면 만성화 가능성 언급.

## 🏠 보호자에게 드리는 조언
이번 달 기록을 바탕으로 다음 달 3~5가지 실천 팁. 구체적으로 (예: "매일 아침 5분 피부 확인", "산책 후 발바닥 점검").

## 🏥 병원 방문 권장 사항
필요하면 어떤 검사를 언제까지 받으면 좋을지 추천. 불필요하면 "정기 검진 이외 특별 권장 없음".

## 💬 다음 달 목표
격려 메시지 + 다음 달에 우리 AI가 체크해드릴 포인트 1개.

⚠️ 이 리포트는 AI가 생성한 참고 자료이며, 수의사의 정식 진단을 대체하지 않습니다.
`;

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: PET_AI_PERSONA }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: { ...GENERATION_CONFIG, maxOutputTokens: 2000 },
          safetySettings: SAFETY_SETTINGS,
        }),
      }
    );

    if (!geminiRes.ok) {
      return NextResponse.json({ error: `Gemini 오류 ${geminiRes.status}`, fallback: true }, { status: 200 });
    }
    const data = await geminiRes.json();
    const report = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!report) {
      return NextResponse.json({ error: "응답 비어있음", fallback: true }, { status: 200 });
    }

    return NextResponse.json({ success: true, report: report.trim() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류", fallback: true }, { status: 200 });
  }
}
