// 28종 품종별 주요 질병 & 예상 치료 비용 (한국 동물병원 기준 2025~2026년)

export interface BreedDisease {
  name: string;
  description: string;
  frequency: "높음" | "보통" | "낮음";
  costRange: { min: number; max: number };
  costNote?: string;
}

export interface BreedDiseaseInfo {
  breedId: string;
  diseases: BreedDisease[];
  annualCheckupCost: string;
  insuranceRecommended: boolean;
}

export const BREED_DISEASE_DATA: Record<string, BreedDiseaseInfo> = {
  // ===== 고양이 12종 =====
  "korean-shorthair": {
    breedId: "korean-shorthair",
    annualCheckupCost: "10~20만원",
    insuranceRecommended: false,
    diseases: [
      { name: "하부요로계 질환 (FLUTD)", description: "방광염, 요로결석 등 비뇨기 질환. 수컷에서 더 흔하며, 수분 섭취 부족이 주원인입니다.", frequency: "높음", costRange: { min: 200000, max: 1500000 }, costNote: "경증 약물치료~수술 시" },
      { name: "비만 관련 질환", description: "중성화 후 체중 증가로 당뇨, 지방간, 관절염 유발 가능.", frequency: "높음", costRange: { min: 100000, max: 500000 }, costNote: "월 관리비 기준" },
      { name: "구내염 (치은염)", description: "잇몸 염증으로 식욕 부진, 침 흘림 유발. 심하면 발치 필요.", frequency: "보통", costRange: { min: 300000, max: 2000000 }, costNote: "전체 발치 수술 시" },
    ],
  },
  "british-shorthair": {
    breedId: "british-shorthair",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "비대성 심근병증 (HCM)", description: "심장 근육이 비정상적으로 두꺼워지는 유전 질환. 정기 심장 초음파 필수.", frequency: "높음", costRange: { min: 500000, max: 3000000 }, costNote: "진단 검사 + 평생 약물치료" },
      { name: "다낭성 신장병 (PKD)", description: "신장에 물혹이 생기는 유전 질환. 유전자 검사로 사전 확인 가능.", frequency: "보통", costRange: { min: 300000, max: 2000000 }, costNote: "지속적 관리 비용" },
      { name: "비만", description: "체형 특성상 비만 위험이 매우 높아 당뇨, 관절염 유발.", frequency: "높음", costRange: { min: 100000, max: 800000 }, costNote: "처방식 + 정기검진" },
    ],
  },
  "russian-blue": {
    breedId: "russian-blue",
    annualCheckupCost: "10~20만원",
    insuranceRecommended: false,
    diseases: [
      { name: "요로결석", description: "비뇨기계 결석으로 배뇨 곤란, 혈뇨 유발. 수분 섭취 관리가 핵심.", frequency: "보통", costRange: { min: 300000, max: 1500000 }, costNote: "수술 시" },
      { name: "비만", description: "식탐이 있어 비만이 되기 쉬움. 정량 급식 필수.", frequency: "보통", costRange: { min: 50000, max: 300000 }, costNote: "처방식 비용" },
      { name: "스트레스성 탈모", description: "환경 변화에 민감하여 과도한 그루밍으로 자해성 탈모 발생.", frequency: "낮음", costRange: { min: 100000, max: 500000 }, costNote: "진단 + 행동치료" },
    ],
  },
  "persian": {
    breedId: "persian",
    annualCheckupCost: "20~40만원",
    insuranceRecommended: true,
    diseases: [
      { name: "다낭성 신장병 (PKD)", description: "페르시안의 36~49%가 보유. 유전자 검사 필수.", frequency: "높음", costRange: { min: 500000, max: 3000000 }, costNote: "평생 관리 비용" },
      { name: "호흡기 질환 (단두증)", description: "납작한 얼굴 구조로 비강 협착, 호흡 곤란 발생.", frequency: "높음", costRange: { min: 300000, max: 2000000 }, costNote: "수술 교정 시" },
      { name: "눈물 흘림 (누루증)", description: "비루관 막힘으로 지속적 눈물, 눈 주변 피부염 유발.", frequency: "높음", costRange: { min: 100000, max: 800000 }, costNote: "비루관 수술 시" },
      { name: "모구증 (헤어볼)", description: "긴 털 삼킴으로 소화기 문제. 심하면 수술 필요.", frequency: "보통", costRange: { min: 50000, max: 1000000 }, costNote: "내시경/수술 시" },
    ],
  },
  "scottish-fold": {
    breedId: "scottish-fold",
    annualCheckupCost: "20~40만원",
    insuranceRecommended: true,
    diseases: [
      { name: "골연골이형성증 (OCD)", description: "접힌 귀 유전자가 전신 연골에 영향. 관절 통증, 꼬리 경직 유발. 폴드 개체 필수 검사.", frequency: "높음", costRange: { min: 500000, max: 5000000 }, costNote: "평생 통증 관리 + 관절 치료" },
      { name: "비대성 심근병증 (HCM)", description: "심장 근육 비대. 정기 심장 초음파 권장.", frequency: "보통", costRange: { min: 500000, max: 3000000 }, costNote: "진단 + 약물치료" },
      { name: "다낭성 신장병 (PKD)", description: "브리티시 숏헤어 교배 혈통에서 유래 가능.", frequency: "낮음", costRange: { min: 300000, max: 2000000 }, costNote: "지속 관리" },
    ],
  },
  "bengal": {
    breedId: "bengal",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "비대성 심근병증 (HCM)", description: "심장 질환. 정기 심장 초음파 필수.", frequency: "보통", costRange: { min: 500000, max: 3000000 }, costNote: "평생 관리" },
      { name: "진행성 망막위축증 (PRA-b)", description: "유전성 시력 저하. 유전자 검사로 사전 확인 가능.", frequency: "보통", costRange: { min: 200000, max: 500000 }, costNote: "진단 검사비" },
      { name: "피루베이트 키나아제 결핍증 (PK-Def)", description: "적혈구 파괴로 빈혈 유발. 유전자 검사 가능.", frequency: "낮음", costRange: { min: 300000, max: 1500000 }, costNote: "수혈 + 관리" },
    ],
  },
  "siamese": {
    breedId: "siamese",
    annualCheckupCost: "15~25만원",
    insuranceRecommended: false,
    diseases: [
      { name: "아밀로이드증", description: "간에 비정상 단백질 축적. 초기 발견이 중요.", frequency: "보통", costRange: { min: 500000, max: 3000000 }, costNote: "진단 + 관리" },
      { name: "천식", description: "샴에서 발생률이 높은 호흡기 질환. 지속적 약물 관리.", frequency: "보통", costRange: { min: 200000, max: 1000000 }, costNote: "연간 약물비" },
      { name: "구강 질환 (치주염)", description: "잇몸 질환이 흔하며, 정기 스케일링 필요.", frequency: "높음", costRange: { min: 200000, max: 1000000 }, costNote: "스케일링 + 발치" },
    ],
  },
  "munchkin": {
    breedId: "munchkin",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "척추 전만증 (Lordosis)", description: "척추가 안쪽으로 과도하게 휜 상태. 심각 시 내장 압박.", frequency: "보통", costRange: { min: 500000, max: 3000000 }, costNote: "수술 시" },
      { name: "골관절염", description: "짧은 다리로 인한 관절 부담. 노령기 통증 유발.", frequency: "보통", costRange: { min: 200000, max: 1500000 }, costNote: "평생 관절 관리" },
      { name: "요로결석", description: "비뇨기 결석. 수분 섭취 관리 중요.", frequency: "낮음", costRange: { min: 300000, max: 1500000 }, costNote: "수술 시" },
    ],
  },
  "ragdoll": {
    breedId: "ragdoll",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "비대성 심근병증 (HCM)", description: "MYBPC3 유전자 돌연변이. 유전자 검사 필수.", frequency: "높음", costRange: { min: 500000, max: 3000000 }, costNote: "평생 약물치료" },
      { name: "요로결석", description: "칼슘 옥살레이트 결석 발생률이 높음.", frequency: "보통", costRange: { min: 300000, max: 1500000 }, costNote: "수술 시" },
      { name: "고양이 전염성 복막염 (FIP)", description: "코로나바이러스 변이로 발생. 치사율 높았으나 최근 치료제 개발.", frequency: "낮음", costRange: { min: 3000000, max: 10000000 }, costNote: "84일 치료 기준" },
    ],
  },
  "norwegian-forest": {
    breedId: "norwegian-forest",
    annualCheckupCost: "15~25만원",
    insuranceRecommended: true,
    diseases: [
      { name: "글리코겐 저장 질환 IV형 (GSD IV)", description: "치명적 유전 질환. 부모묘 유전자 검사 필수.", frequency: "낮음", costRange: { min: 200000, max: 500000 }, costNote: "유전자 검사비" },
      { name: "비대성 심근병증 (HCM)", description: "대형묘에서 흔한 심장 질환.", frequency: "보통", costRange: { min: 500000, max: 3000000 }, costNote: "평생 관리" },
      { name: "고관절 이형성증", description: "대형묘 체중으로 인한 관절 문제.", frequency: "낮음", costRange: { min: 300000, max: 2000000 }, costNote: "수술 시" },
    ],
  },
  "selkirk-rex": {
    breedId: "selkirk-rex",
    annualCheckupCost: "10~25만원",
    insuranceRecommended: false,
    diseases: [
      { name: "다낭성 신장병 (PKD)", description: "페르시안 혈통에서 유래. 유전자 검사 권장.", frequency: "보통", costRange: { min: 300000, max: 2000000 }, costNote: "지속 관리" },
      { name: "비대성 심근병증 (HCM)", description: "브리티시 숏헤어 혈통에서 유래 가능.", frequency: "낮음", costRange: { min: 500000, max: 3000000 }, costNote: "평생 관리" },
      { name: "외이도염", description: "곱슬 털로 귀지 축적이 빠름. 주기적 귀 청소 필요.", frequency: "보통", costRange: { min: 50000, max: 300000 }, costNote: "치료 1회 기준" },
    ],
  },
  "sphynx": {
    breedId: "sphynx",
    annualCheckupCost: "20~40만원",
    insuranceRecommended: true,
    diseases: [
      { name: "비대성 심근병증 (HCM)", description: "스핑크스에서 발생률이 높음. 매년 심장 초음파 필수.", frequency: "높음", costRange: { min: 500000, max: 3000000 }, costNote: "연간 검사 + 약물" },
      { name: "피부 질환", description: "털이 없어 여드름, 곰팡이, 피부염이 빈번.", frequency: "높음", costRange: { min: 100000, max: 800000 }, costNote: "연간 관리비" },
      { name: "호흡기 감염", description: "면역력이 약해 상부호흡기 감염에 취약.", frequency: "보통", costRange: { min: 100000, max: 500000 }, costNote: "치료 1회 기준" },
    ],
  },

  // ===== 강아지 16종 =====
  "maltese": {
    breedId: "maltese",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "슬개골 탈구", description: "소형견 최다 발병 질환. 등급에 따라 수술 필요.", frequency: "높음", costRange: { min: 1000000, max: 3500000 }, costNote: "양쪽 수술 시" },
      { name: "치과 질환 (치석/치주염)", description: "소형견 특성상 치아 밀집. 정기 스케일링 필수.", frequency: "높음", costRange: { min: 200000, max: 800000 }, costNote: "스케일링+발치" },
      { name: "기관허탈", description: "기관 연골 약화로 기침, 호흡곤란. 목줄 대신 하네스.", frequency: "보통", costRange: { min: 300000, max: 3000000 }, costNote: "스텐트 수술 시" },
      { name: "눈물 자국 (누루증)", description: "흰 털에 눈물 자국이 두드러짐. 비루관 문제일 수 있음.", frequency: "높음", costRange: { min: 50000, max: 500000 }, costNote: "비루관 세척/수술" },
    ],
  },
  "poodle": {
    breedId: "poodle",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "슬개골 탈구", description: "토이 푸들에서 매우 흔함. 등급에 따라 수술.", frequency: "높음", costRange: { min: 1000000, max: 3500000 }, costNote: "양쪽 수술 시" },
      { name: "진행성 망막위축증 (PRA)", description: "유전성 시력 저하. 유전자 검사 가능.", frequency: "보통", costRange: { min: 200000, max: 500000 }, costNote: "진단 검사비" },
      { name: "애디슨병 (부신피질기능저하증)", description: "스탠다드 푸들에서 발생. 평생 호르몬 보충.", frequency: "낮음", costRange: { min: 500000, max: 2000000 }, costNote: "연간 약물비" },
      { name: "외이도염", description: "접힌 귀로 통풍 불량. 주기적 귀 청소 필수.", frequency: "높음", costRange: { min: 50000, max: 300000 }, costNote: "치료 1회" },
    ],
  },
  "golden-retriever": {
    breedId: "golden-retriever",
    annualCheckupCost: "20~40만원",
    insuranceRecommended: true,
    diseases: [
      { name: "암 (림프종/혈관육종)", description: "골든의 약 60%가 암으로 사망. 6세 이후 연 2회 검진.", frequency: "높음", costRange: { min: 2000000, max: 10000000 }, costNote: "항암 치료 기준" },
      { name: "고관절 이형성증", description: "대형견 공통 관절 질환. 부모묘 OFA 인증 확인.", frequency: "높음", costRange: { min: 2000000, max: 5000000 }, costNote: "인공관절 수술 시" },
      { name: "갑상선 기능 저하증", description: "체중 증가, 무기력, 피부 문제 유발.", frequency: "보통", costRange: { min: 200000, max: 600000 }, costNote: "연간 약물+검사" },
      { name: "알레르기성 피부염 (핫스팟)", description: "피부 감염으로 빨갛게 부어오름. 습한 환경에서 악화.", frequency: "높음", costRange: { min: 100000, max: 500000 }, costNote: "치료 1회" },
    ],
  },
  "pomeranian": {
    breedId: "pomeranian",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "슬개골 탈구", description: "소형견 최빈 질환. 3~4등급은 수술 권장.", frequency: "높음", costRange: { min: 1000000, max: 3500000 }, costNote: "양쪽 수술 시" },
      { name: "기관허탈", description: "기관 연골이 눌려 기침. 흥분 시 악화.", frequency: "보통", costRange: { min: 300000, max: 3000000 }, costNote: "스텐트 수술 시" },
      { name: "대머리병 (Alopecia X)", description: "포메라니안 특이 탈모. 원인 불명, 미용적 문제.", frequency: "보통", costRange: { min: 200000, max: 1000000 }, costNote: "호르몬 치료" },
      { name: "저혈당", description: "초소형 개체에서 식사 거르면 발작 위험.", frequency: "보통", costRange: { min: 100000, max: 500000 }, costNote: "응급 처치" },
    ],
  },
  "shih-tzu": {
    breedId: "shih-tzu",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "단두종 기도 증후군 (BOAS)", description: "납작한 얼굴 구조로 호흡 곤란. 코골이 심하면 수술.", frequency: "높음", costRange: { min: 500000, max: 3000000 }, costNote: "연구개 수술 시" },
      { name: "안구 질환", description: "눈이 크고 돌출되어 각막 궤양, 안구 건조증 빈번.", frequency: "높음", costRange: { min: 100000, max: 1500000 }, costNote: "안과 수술 시" },
      { name: "외이도염", description: "긴 귀로 통풍 불량. 만성 귀 감염 주의.", frequency: "높음", costRange: { min: 50000, max: 300000 }, costNote: "치료 1회" },
      { name: "신장결석", description: "시츄에서 발생률 높음. 수분 섭취 관리.", frequency: "보통", costRange: { min: 500000, max: 2000000 }, costNote: "수술 시" },
    ],
  },
  "welsh-corgi": {
    breedId: "welsh-corgi",
    annualCheckupCost: "20~35만원",
    insuranceRecommended: true,
    diseases: [
      { name: "추간판 질환 (디스크/IVDD)", description: "긴 허리 구조상 디스크 위험 최상. 비만이 최대 악화 요인.", frequency: "높음", costRange: { min: 2000000, max: 6000000 }, costNote: "디스크 수술 시" },
      { name: "퇴행성 골수증 (DM)", description: "노령기 뒷다리 마비. SOD1 유전자 검사 가능.", frequency: "보통", costRange: { min: 200000, max: 1000000 }, costNote: "재활치료 연간" },
      { name: "비만", description: "식탐이 매우 강해 비만 위험 높음. 디스크 악화 원인.", frequency: "높음", costRange: { min: 100000, max: 500000 }, costNote: "처방식+정기검진" },
      { name: "진행성 망막위축증 (PRA)", description: "유전성 시력 저하. 야간 시력부터 감소.", frequency: "낮음", costRange: { min: 200000, max: 500000 }, costNote: "진단 검사비" },
    ],
  },
  "bichon-frise": {
    breedId: "bichon-frise",
    annualCheckupCost: "15~25만원",
    insuranceRecommended: false,
    diseases: [
      { name: "슬개골 탈구", description: "소형견 공통 관절 질환.", frequency: "보통", costRange: { min: 1000000, max: 3500000 }, costNote: "양쪽 수술 시" },
      { name: "방광 결석", description: "비숑에서 발생률 높음. 충분한 수분 섭취가 핵심.", frequency: "보통", costRange: { min: 500000, max: 2000000 }, costNote: "수술 시" },
      { name: "알레르기성 피부염", description: "피부 알레르기 발생 가능. 붉어짐, 가려움.", frequency: "보통", costRange: { min: 100000, max: 500000 }, costNote: "치료+처방식" },
    ],
  },
  "chihuahua": {
    breedId: "chihuahua",
    annualCheckupCost: "15~25만원",
    insuranceRecommended: true,
    diseases: [
      { name: "슬개골 탈구", description: "초소형견 최다 발병 질환.", frequency: "높음", costRange: { min: 1000000, max: 3500000 }, costNote: "양쪽 수술 시" },
      { name: "수두증", description: "뇌에 수액 축적. 천문(몰레라) 미폐쇄 개체 주의.", frequency: "보통", costRange: { min: 1000000, max: 5000000 }, costNote: "수술 시" },
      { name: "치과 질환", description: "작은 입에 이빨 밀집. 유치 잔존, 치주염 빈번.", frequency: "높음", costRange: { min: 200000, max: 800000 }, costNote: "스케일링+발치" },
      { name: "골절", description: "뼈가 매우 가늘어 낙상 시 골절 위험 높음.", frequency: "보통", costRange: { min: 500000, max: 3000000 }, costNote: "골절 수술 시" },
    ],
  },
  "yorkshire-terrier": {
    breedId: "yorkshire-terrier",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "슬개골 탈구", description: "소형 테리어 공통 질환.", frequency: "높음", costRange: { min: 1000000, max: 3500000 }, costNote: "양쪽 수술 시" },
      { name: "기관허탈", description: "기관 연골 약화. 하네스 필수.", frequency: "보통", costRange: { min: 300000, max: 3000000 }, costNote: "스텐트 수술 시" },
      { name: "간문맥 단락 (PSS)", description: "선천적 간 혈관 기형. 간 기능 저하.", frequency: "낮음", costRange: { min: 3000000, max: 8000000 }, costNote: "수술 시" },
      { name: "치과 질환 (유치 잔존)", description: "유치가 빠지지 않아 영구치에 영향. 발치 필요.", frequency: "높음", costRange: { min: 200000, max: 800000 }, costNote: "발치 수술" },
    ],
  },
  "dachshund": {
    breedId: "dachshund",
    annualCheckupCost: "20~35만원",
    insuranceRecommended: true,
    diseases: [
      { name: "추간판 질환 (디스크/IVDD)", description: "닥스훈트 20~25%가 경험. 긴 척추 구조가 원인. 비만 시 악화.", frequency: "높음", costRange: { min: 2000000, max: 6000000 }, costNote: "디스크 수술 시" },
      { name: "비만", description: "디스크의 최대 위험요인. 체중 관리가 생명.", frequency: "높음", costRange: { min: 100000, max: 500000 }, costNote: "처방식+정기검진" },
      { name: "간질", description: "원인 불명의 발작. 약물로 관리.", frequency: "낮음", costRange: { min: 300000, max: 1000000 }, costNote: "연간 약물비" },
    ],
  },
  "french-bulldog": {
    breedId: "french-bulldog",
    annualCheckupCost: "25~50만원",
    insuranceRecommended: true,
    diseases: [
      { name: "단두종 기도 증후군 (BOAS)", description: "호흡 곤란, 코골이, 열사병 위험. 심하면 수술.", frequency: "높음", costRange: { min: 1000000, max: 4000000 }, costNote: "기도 확장 수술" },
      { name: "척추 질환 (나비 척추/IVDD)", description: "선천적 척추 기형이 흔함. 신경 증상 주의.", frequency: "높음", costRange: { min: 2000000, max: 6000000 }, costNote: "수술 시" },
      { name: "피부 알레르기 (아토피)", description: "주름 사이 피부염, 음식 알레르기 빈번.", frequency: "높음", costRange: { min: 200000, max: 1000000 }, costNote: "연간 관리비" },
      { name: "체리 아이 (제3안검 탈출)", description: "눈 안쪽 분홍색 돌출. 수술로 교정.", frequency: "보통", costRange: { min: 300000, max: 1000000 }, costNote: "수술 1회" },
    ],
  },
  "shiba-inu": {
    breedId: "shiba-inu",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: false,
    diseases: [
      { name: "알레르기성 피부염 (아토피)", description: "시바견 최다 질환. 환경+음식 알레르기 모두 가능.", frequency: "높음", costRange: { min: 200000, max: 1500000 }, costNote: "연간 관리비" },
      { name: "슬개골 탈구", description: "소형~중형견에서 발생 가능.", frequency: "보통", costRange: { min: 1000000, max: 3500000 }, costNote: "양쪽 수술 시" },
      { name: "녹내장", description: "일본 혈통에서 발생률 높음. 안압 상승으로 시력 상실.", frequency: "낮음", costRange: { min: 500000, max: 3000000 }, costNote: "수술+약물" },
    ],
  },
  "border-collie": {
    breedId: "border-collie",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: true,
    diseases: [
      { name: "고관절 이형성증", description: "중형견 관절 질환. 부모묘 OFA 인증 확인.", frequency: "보통", costRange: { min: 2000000, max: 5000000 }, costNote: "수술 시" },
      { name: "콜리 안구 이상 (CEA)", description: "유전성 안과 질환. 유전자 검사로 사전 확인.", frequency: "보통", costRange: { min: 200000, max: 500000 }, costNote: "진단 검사비" },
      { name: "간질", description: "특발성 발작. 약물로 평생 관리.", frequency: "보통", costRange: { min: 300000, max: 1000000 }, costNote: "연간 약물비" },
    ],
  },
  "labrador-retriever": {
    breedId: "labrador-retriever",
    annualCheckupCost: "20~40만원",
    insuranceRecommended: true,
    diseases: [
      { name: "고관절/팔꿈치 이형성증", description: "대형견 최다 관절 질환. 부모묘 OFA 인증 확인.", frequency: "높음", costRange: { min: 2000000, max: 5000000 }, costNote: "수술 시" },
      { name: "비만", description: "POMC 유전자 돌연변이로 만복감 부족. 전 견종 비만 1위.", frequency: "높음", costRange: { min: 100000, max: 800000 }, costNote: "처방식+정기검진" },
      { name: "진행성 망막위축증 (PRA)", description: "유전성 시력 저하. 유전자 검사 가능.", frequency: "보통", costRange: { min: 200000, max: 500000 }, costNote: "진단 검사비" },
      { name: "운동 유발 허탈 (EIC)", description: "격한 운동 후 갑자기 무력. 유전자 검사 가능.", frequency: "낮음", costRange: { min: 200000, max: 500000 }, costNote: "진단+관리" },
    ],
  },
  "siberian-husky": {
    breedId: "siberian-husky",
    annualCheckupCost: "15~30만원",
    insuranceRecommended: false,
    diseases: [
      { name: "안과 질환 (백내장/PRA)", description: "소년성 백내장, 진행성 망막위축증. CERF 검진 권장.", frequency: "높음", costRange: { min: 500000, max: 3000000 }, costNote: "백내장 수술 시" },
      { name: "아연 반응성 피부병", description: "허스키 특이 질환. 코·발바닥 각질화.", frequency: "보통", costRange: { min: 100000, max: 500000 }, costNote: "아연 보충+치료" },
      { name: "갑상선 기능 저하증", description: "체중 증가, 무기력, 피모 불량.", frequency: "보통", costRange: { min: 200000, max: 600000 }, costNote: "연간 약물+검사" },
    ],
  },
  "korean-jindo": {
    breedId: "korean-jindo",
    annualCheckupCost: "10~20만원",
    insuranceRecommended: false,
    diseases: [
      { name: "갑상선 기능 저하증", description: "체중 증가, 무기력, 탈모 유발.", frequency: "보통", costRange: { min: 200000, max: 600000 }, costNote: "연간 약물+검사" },
      { name: "알레르기성 피부염", description: "환경·음식 알레르기로 피부 가려움.", frequency: "보통", costRange: { min: 100000, max: 500000 }, costNote: "연간 관리비" },
      { name: "고관절 이형성증", description: "중형견에서 발생 가능하나 진돗개는 낮은 편.", frequency: "낮음", costRange: { min: 2000000, max: 5000000 }, costNote: "수술 시" },
    ],
  },
};
