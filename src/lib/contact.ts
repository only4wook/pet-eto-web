export const KAKAO_CHANNEL_BASE_URL = "https://pf.kakao.com/_giedX/chat";

export function buildKakaoConsultUrl(source: string): string {
  const safeSource = source.trim() || "unknown";
  const text =
    `[${safeSource}] 상담 요청\n` +
    `- 반려동물: \n` +
    `- 주요 증상/상황: \n` +
    `- 지역: \n` +
    `- 희망 시간: `;

  return `${KAKAO_CHANNEL_BASE_URL}?text=${encodeURIComponent(text)}`;
}
