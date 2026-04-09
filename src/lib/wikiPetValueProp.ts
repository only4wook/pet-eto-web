// P.E.T 차별점 — 왜 펫에토를 사용해야 하는지

export interface PetValuePoint {
  icon: string;
  title: string;
  description: string;
  highlight: string;
}

export const PET_VALUE_PROPS: PetValuePoint[] = [
  {
    icon: "🚑",
    title: "긴급 돌봄 매칭",
    description: "갑자기 아프거나, 급한 출장이 생겼을 때 검증된 펫시터를 빠르게 연결해드립니다.",
    highlight: "15분 내 매칭",
  },
  {
    icon: "💰",
    title: "투명한 비용 안내",
    description: "품종별 예상 의료비, 관리비를 미리 확인하고 현명하게 준비할 수 있습니다.",
    highlight: "비용 걱정 해소",
  },
  {
    icon: "👨‍⚕️",
    title: "수의사 자문 연계",
    description: "궁금한 증상이 있을 때 커뮤니티에서 수의사 자문단의 전문 답변을 받아보세요.",
    highlight: "전문가 상담",
  },
  {
    icon: "🛡️",
    title: "에스크로 안전결제",
    description: "케어 완료 후 자동 결제되는 에스크로 시스템으로 안심하고 이용하세요.",
    highlight: "100% 안전보장",
  },
];

export const PET_CTA_TEXT = {
  title: "P.E.T와 함께라면",
  subtitle: "반려동물과의 모든 순간, 더 이상 혼자 고민하지 마세요",
  buttonText: "P.E.T 시작하기",
  buttonLink: "/",
};
