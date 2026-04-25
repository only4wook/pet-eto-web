// P.E.T AI Self-Critique — 답변을 낸 모델이 자기 답변을 검수
// 비용 2배지만 긴급/독성 케이스만 선택 적용

import { callGemini } from "./geminiClient";

const CRITIQUE_PROMPT_KO = `당신은 이전에 수의사 AI로서 답변했습니다.
이제 당신의 답변을 엄격하게 검수하는 "감수자" 역할을 맡아주세요.

다음 3가지를 지적하세요:
1. **빠진 정보** — 보호자가 알아야 하는데 빠진 것 2~3가지
2. **과장/오류** — 근거가 약하거나 과장된 표현
3. **응급성 판단** — 심각도가 과소평가/과대평가된 부분

마지막에, 수정된 "최종 답변"을 새롭게 작성하세요.
형식: "✅ 수정된 최종 답변:\\n\\n[여기에 개선된 답변]"
`;

const CRITIQUE_PROMPT_EN = `You were just a veterinary AI. Now switch to "reviewer" mode and critique your own answer strictly.

Point out these 3 things:
1. **Missing information** — 2–3 things the pet parent should know but were omitted
2. **Overstatement or errors** — weak-evidence claims or exaggerations
3. **Urgency calibration** — severity over/underestimation

Then write a revised FINAL answer.
Format: "✅ Revised final answer:\\n\\n[your improved answer here]"
`;

export async function criticizeAndImprove(
  originalQuestion: string,
  originalAnswer: string,
  locale: "ko" | "en" = "ko"
): Promise<string> {
  const critiquePrompt = locale === "en" ? CRITIQUE_PROMPT_EN : CRITIQUE_PROMPT_KO;

  const userContent = locale === "en"
    ? `Original question:\n"${originalQuestion}"\n\nMy earlier answer:\n${originalAnswer}\n\nNow critique and rewrite.`
    : `원래 보호자 질문:\n"${originalQuestion}"\n\n내가 앞서 낸 답변:\n${originalAnswer}\n\n지금 검수 + 개선 답변을 작성하세요.`;

  const result = await callGemini(
    [{ role: "user", parts: [{ text: userContent }] }],
    {
      systemInstruction: critiquePrompt,
      locale,
      temperature: 0.3, // 검수는 더 엄격한 톤
      timeoutMs: 12000,
    }
  );

  if (!result.ok || !result.reply) {
    // 검수 실패 시 원본 답변 그대로 반환 (안전)
    return originalAnswer;
  }

  // "수정된 최종 답변:" / "Revised final answer:" 이후 부분만 추출
  const reply = result.reply;
  const markers = [
    "✅ 수정된 최종 답변:",
    "수정된 최종 답변:",
    "✅ Revised final answer:",
    "Revised final answer:",
  ];
  for (const marker of markers) {
    const idx = reply.indexOf(marker);
    if (idx >= 0) {
      const extracted = reply.slice(idx + marker.length).trim();
      if (extracted.length > 50) return extracted;
    }
  }

  // 마커 못 찾으면 원본 그대로
  return originalAnswer;
}
