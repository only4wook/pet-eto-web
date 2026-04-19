"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PremiumHero from "../components/PremiumHero";
import ServiceSummary from "../components/ServiceSummary";
import TargetAudienceSection from "../components/TargetAudienceSection";
import PremiumTrustGrid from "../components/PremiumTrustGrid";
import HowItWorks from "../components/HowItWorks";
import FeedPreviewStream from "../components/FeedPreviewStream";

// P.E.T 홈 — 기승전결 순서 (AI 섹션은 /ai 전용 페이지로 분리)
//
// 起: 1) PremiumHero             — 문제 제기 + 약속
// 承: 2) ServiceSummary          — 우리가 정확히 뭘 하나요 (3가지 시나리오)
//     3) TargetAudienceSection   — 누구를 위한 서비스인가 (타겟 명확화)
// 轉: 4) PremiumTrustGrid        — 왜 믿을 수 있나 (신뢰 근거)
//     5) HowItWorks              — 실제 이용 방법 (매칭 플로우)
// 結: 6) FeedPreviewStream       — 실제 사례 증거 (실시간 피드)
//
// AI 챗은 하단 탭바 "건강체크" → /ai 에서 전용으로 경험

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <PremiumHero />
        <ServiceSummary />
        <TargetAudienceSection />
        <PremiumTrustGrid />
        <HowItWorks />
        <FeedPreviewStream />
      </main>
      <Footer />
    </>
  );
}
