"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PremiumHero from "../components/PremiumHero";
import PremiumTrustGrid from "../components/PremiumTrustGrid";
import HowItWorks from "../components/HowItWorks";

// P.E.T 홈 — Awwwards급 리디자인 (Warm Trust × Premium Motion)
// 섹션 순서:
//   1. PremiumHero — 대범한 헤드라인 + 라이브 소셜 프루프 + CTA + 플로팅 카드
//   2. PremiumTrustGrid — 6가지 신뢰 시그널 (Glassmorphism)
//   3. HowItWorks — 3단계 이용 절차 (다크 섹션, 전환 감성)
// AI 챗 섹션은 /ai 전용 페이지(건강체크 탭)로 분리됨. 홈에는 노출하지 않음.

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <PremiumHero />
        <PremiumTrustGrid />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
