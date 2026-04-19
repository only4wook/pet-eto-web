"use client";
import PartnerServiceLanding, { type PartnerServiceMeta } from "../../../components/PartnerServiceLanding";

const META: PartnerServiceMeta = {
  kind: "transport",
  title: "펫 이동 서비스",
  heroTitle: "병원·미용실까지 안전하게",
  heroSubtitle: "전용 차량·전문 기사가 반려동물 이동을 대신합니다. 보호자는 일만 하세요.",
  emoji: "🚕",
  benefits: [
    { icon: "🚐", title: "반려동물 전용 차량", desc: "켄넬·쿠션·청결 유지가 표준. 체취 없는 공기정화 시스템." },
    { icon: "🧑‍✈️", title: "전문 기사만", desc: "반려동물 응급 CPR 교육 이수자만 배정됩니다." },
    { icon: "📍 GPS", title: "실시간 위치 공유", desc: "출발부터 도착까지 카카오맵 공유 링크로 확인." },
  ],
  priceGuide: [
    { label: "서울·수도권 단거리 (10km 내)", range: "3~5만원" },
    { label: "수도권 중거리 (10~30km)", range: "5~8만원" },
    { label: "장거리·지방", range: "8~20만원", note: "km당 추가" },
    { label: "심야·긴급 (22시~6시)", range: "+30% 할증" },
  ],
  verificationChecklist: [
    "기사 운전경력·무사고 증명",
    "범죄경력회보서 (동물학대 이력 필터)",
    "반려동물 응급처치 교육 이수",
    "차량 소독·위생 월 1회 점검",
    "이동 중 사고 시 배상책임보험 최대 1억 자동 적용",
  ],
  fieldLabels: {
    pickupAddress: "출발지 (집 주소)",
    dropoffAddress: "도착지 (병원·미용실 등)",
    notes: "특이사항 (예: 멀미·공격성·긴장 시 반응)",
  },
};

export default function TransportPage() {
  return <PartnerServiceLanding meta={META} />;
}
