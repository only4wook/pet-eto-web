"use client";
import PartnerServiceLanding, { type PartnerServiceMeta } from "../../../components/PartnerServiceLanding";

const META: PartnerServiceMeta = {
  kind: "hotel",
  title: "펫 호텔링",
  heroTitle: "여행·출장 중에도 내 아이는 편안하게",
  heroSubtitle: "검증된 펫 호텔에서 CCTV로 언제든 확인. 수의사 제휴 호텔 우선 매칭.",
  emoji: "🏨",
  benefits: [
    { icon: "📹", title: "CCTV 24시간 라이브", desc: "지정 시간 스트리밍 + 하루 2회 사진 보고." },
    { icon: "🩺", title: "수의사 제휴 호텔", desc: "긴급 상황 시 제휴 동물병원과 즉시 연결." },
    { icon: "🏠", title: "케이지 프리 옵션", desc: "고양이 전용방·소형견 공용 공간 선택 가능." },
  ],
  priceGuide: [
    { label: "1박 (소형 강아지·고양이)", range: "5~8만원" },
    { label: "1박 (중·대형견)", range: "8~15만원" },
    { label: "장기 (7박+)", range: "-15% 할인" },
    { label: "프리미엄 룸 (CCTV·히터·놀이방)", range: "+20~50% 추가" },
  ],
  verificationChecklist: [
    "사업자등록증 + 동물보호시설 등록증 검증",
    "시설 위생·안전 현장 점검 (운영팀 방문)",
    "응급 동물병원 도보·차량 5분 내 제휴",
    "1박당 사고 발생 시 의료비 500만원까지 자동 보장",
    "CCTV 녹화본 48시간 보관 의무",
  ],
  fieldLabels: {
    pickupAddress: "선호 호텔 지역 (예: 고양시 일산)",
    notes: "식이 요구 · 복용 약 · 분리불안 유무",
  },
};

export default function HotelPage() {
  return <PartnerServiceLanding meta={META} />;
}
