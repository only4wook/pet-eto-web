// 처음 키우시나요? — 종별(고양이/강아지) 초보 가이드

export interface GuideStep {
  order: number;
  title: string;
  description: string;
  timing: string;
  estimatedCost?: string;
  icon: string;
}

export interface SupplyItem {
  item: string;
  estimatedCost: string;
  priority: "필수" | "권장";
}

export interface VaccinationItem {
  age: string;
  vaccine: string;
  cost: string;
}

export interface FirstTimeGuide {
  species: "cat" | "dog";
  steps: GuideStep[];
  essentialSupplies: SupplyItem[];
  vaccinationSchedule: VaccinationItem[];
  monthlyMinCost: string;
  monthlyMaxCost: string;
}

export const CAT_FIRST_TIME_GUIDE: FirstTimeGuide = {
  species: "cat",
  monthlyMinCost: "8만원",
  monthlyMaxCost: "20만원",
  steps: [
    { order: 1, title: "건강검진 받기", description: "입양 후 가장 먼저 동물병원에서 기본 건강검진을 받으세요. FeLV/FIV 검사, 구충, 기본 혈액검사를 포함합니다.", timing: "입양 후 1~3일 이내", estimatedCost: "5~15만원", icon: "🏥" },
    { order: 2, title: "동물등록 하기", description: "내장형 마이크로칩을 삽입하고 동물등록을 완료하세요. 분실 시 찾을 확률이 크게 높아집니다.", timing: "입양 후 30일 이내", estimatedCost: "1~3만원", icon: "📋" },
    { order: 3, title: "예방접종 시작", description: "수의사와 상담하여 접종 스케줄을 잡으세요. 기본 3종(범백, 칼리시, 허피스) + 광견병.", timing: "생후 6~8주부터", estimatedCost: "회당 3~5만원", icon: "💉" },
    { order: 4, title: "중성화 수술", description: "발정 스트레스 감소, 자궁축농증·유선종양 예방 등 건강상 이점이 큽니다.", timing: "생후 5~6개월", estimatedCost: "15~30만원", icon: "✂️" },
    { order: 5, title: "실내 환경 세팅", description: "화장실(고양이 수+1), 수직 공간(캣타워), 스크래처, 은신처를 마련하세요.", timing: "입양 전~직후", estimatedCost: "10~30만원", icon: "🏠" },
    { order: 6, title: "사료·급수 체계 잡기", description: "나이와 건강 상태에 맞는 사료를 선택하고, 정량 급식 습관을 잡으세요. 급수기로 수분 섭취를 유도합니다.", timing: "입양 직후", estimatedCost: "월 3~8만원", icon: "🍽️" },
  ],
  essentialSupplies: [
    { item: "화장실 + 모래", estimatedCost: "3~10만원", priority: "필수" },
    { item: "사료 + 간식", estimatedCost: "월 3~8만원", priority: "필수" },
    { item: "급수기 (자동/순환식)", estimatedCost: "2~5만원", priority: "필수" },
    { item: "캣타워", estimatedCost: "3~15만원", priority: "필수" },
    { item: "스크래처", estimatedCost: "1~3만원", priority: "필수" },
    { item: "이동장 (캐리어)", estimatedCost: "2~5만원", priority: "필수" },
    { item: "장난감 (낚싯대 등)", estimatedCost: "1~3만원", priority: "권장" },
    { item: "브러싱 도구", estimatedCost: "1~2만원", priority: "권장" },
  ],
  vaccinationSchedule: [
    { age: "6~8주", vaccine: "1차 종합백신 (FVRCP)", cost: "3~5만원" },
    { age: "10~12주", vaccine: "2차 종합백신 (FVRCP)", cost: "3~5만원" },
    { age: "14~16주", vaccine: "3차 종합백신 + 광견병", cost: "5~8만원" },
    { age: "1년 후", vaccine: "추가접종 (FVRCP + 광견병)", cost: "5~8만원" },
    { age: "매년", vaccine: "연간 추가접종", cost: "5~8만원" },
  ],
};

export const DOG_FIRST_TIME_GUIDE: FirstTimeGuide = {
  species: "dog",
  monthlyMinCost: "10만원",
  monthlyMaxCost: "30만원",
  steps: [
    { order: 1, title: "건강검진 받기", description: "입양 후 가장 먼저 동물병원에서 기본 건강검진을 받으세요. 슬개골 등급 확인, 구충, 기본 혈액검사를 포함합니다.", timing: "입양 후 1~3일 이내", estimatedCost: "5~15만원", icon: "🏥" },
    { order: 2, title: "동물등록 하기", description: "내장형 마이크로칩 삽입 + 동물등록(의무). 미등록 시 과태료 부과 대상입니다.", timing: "입양 후 30일 이내 (의무)", estimatedCost: "1~3만원", icon: "📋" },
    { order: 3, title: "예방접종 시작", description: "DHPPL 5종 + 코로나 + 켄넬코프 + 광견병. 수의사와 스케줄 상담.", timing: "생후 6~8주부터", estimatedCost: "회당 3~5만원", icon: "💉" },
    { order: 4, title: "심장사상충 예방 시작", description: "모기를 통해 감염되는 치명적 질환. 매월 예방약 투여 필수.", timing: "생후 8주 이후 매월", estimatedCost: "월 1~3만원", icon: "🛡️" },
    { order: 5, title: "중성화 수술", description: "전립선 질환, 자궁축농증 예방. 행동 교정에도 도움.", timing: "생후 5~8개월", estimatedCost: "20~40만원", icon: "✂️" },
    { order: 6, title: "기본 훈련 시작", description: "앉아, 기다려, 이리와 등 기본 명령어와 배변 훈련. 사회화 교육(3~12주 골든타임).", timing: "입양 직후", estimatedCost: "셀프 무료 / 훈련소 월 20~50만원", icon: "🎓" },
  ],
  essentialSupplies: [
    { item: "사료 + 간식", estimatedCost: "월 5~15만원", priority: "필수" },
    { item: "밥그릇 + 물그릇", estimatedCost: "1~3만원", priority: "필수" },
    { item: "하네스 + 리드줄", estimatedCost: "2~5만원", priority: "필수" },
    { item: "배변패드 (실내용)", estimatedCost: "월 1~3만원", priority: "필수" },
    { item: "이동장 (캐리어/크레이트)", estimatedCost: "3~10만원", priority: "필수" },
    { item: "방석/하우스", estimatedCost: "2~8만원", priority: "필수" },
    { item: "장난감 (노즈워크 등)", estimatedCost: "1~5만원", priority: "권장" },
    { item: "양치 세트", estimatedCost: "1~2만원", priority: "권장" },
    { item: "브러싱 도구", estimatedCost: "1~3만원", priority: "권장" },
  ],
  vaccinationSchedule: [
    { age: "6~8주", vaccine: "1차 DHPPL + 코로나", cost: "3~5만원" },
    { age: "10~12주", vaccine: "2차 DHPPL + 코로나", cost: "3~5만원" },
    { age: "14~16주", vaccine: "3차 DHPPL + 켄넬코프 + 광견병", cost: "6~10만원" },
    { age: "1년 후", vaccine: "추가접종 (DHPPL + 광견병)", cost: "5~8만원" },
    { age: "매년", vaccine: "연간 추가접종 + 심장사상충 검사", cost: "8~15만원" },
  ],
};
