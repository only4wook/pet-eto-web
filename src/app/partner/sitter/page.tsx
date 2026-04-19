"use client";
import PartnerServiceLanding, { type PartnerServiceMeta } from "../../../components/PartnerServiceLanding";

const META: PartnerServiceMeta = {
  kind: "sitter",
  title: "방문 돌봄 (펫시터)",
  heroTitle: "우리 집으로 와주는 검증된 전문가",
  heroSubtitle: "액션캠 실시간 보고 + 3단계 검증 완료한 펫시터만 연결합니다.",
  emoji: "🏠",
  benefits: [
    { icon: "📹", title: "액션캠 실시간 보고", desc: "샤오미 Action 5로 케어 전 과정을 기록·전송." },
    { icon: "🛡️", title: "3단계 검증 통과", desc: "신원 → 면접 → 시범 케어 4.5점 이상만 활동." },
    { icon: "💰", title: "사고 시 1억 보장", desc: "배상책임보험 자동 적용 (물건 파손·상해 포함)." },
  ],
  priceGuide: [
    { label: "방문 1회 (1시간, 기본)", range: "3~5만원" },
    { label: "방문 1회 (4시간)", range: "6~10만원" },
    { label: "종일 돌봄 (8시간)", range: "10~18만원" },
    { label: "숙박 돌봄 (1박)", range: "8~15만원" },
  ],
  verificationChecklist: [
    "본인 신분증 + 계좌 실명 확인 (KYC)",
    "범죄경력회보서 제출 (동물학대 이력 필터)",
    "반려동물 응급 CPR 교육 이수",
    "시범 케어 평점 4.5/5.0 이상만 활동",
    "액션캠 착용 의무 + 케어 로그 48시간 보관",
  ],
  fieldLabels: {
    pickupAddress: "방문 주소",
    notes: "성격·식이·복용 약·주의사항 등 상세히",
  },
};

export default function SitterPage() {
  return <PartnerServiceLanding meta={META} />;
}
