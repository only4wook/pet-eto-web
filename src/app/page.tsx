"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PremiumHero from "../components/PremiumHero";
import ServiceSummary from "../components/ServiceSummary";
import PremiumTrustGrid from "../components/PremiumTrustGrid";
import HowItWorks from "../components/HowItWorks";
import HeroSection from "../components/HeroSection";
import FeedPreviewStream from "../components/FeedPreviewStream";

// P.E.T 홈 — 기승전결 순서 (커서·사용자 피드백 반영)
//
// 起: 1) PremiumHero             — 문제 제기 + 약속 ("혼자 둘 수 없는 순간…")
// 承: 2) ServiceSummary          — 우리가 정확히 뭘 하나요 (3가지 시나리오)
// 轉: 3) PremiumTrustGrid        — 왜 믿을 수 있나 (신뢰 근거 6가지)
//     4) HowItWorks              — 실제 이용 방법 (3단계 매칭 플로우)
// 結: 5) FeedPreviewStream       — 실제 사례 증거 (실시간 피드)
//     6) HeroSection (AI 상담)   — 즉시 행동 CTA ("30초 안에 전문 답변")

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <PremiumHero />
        <ServiceSummary />
        <PremiumTrustGrid />
        <HowItWorks />
        <FeedPreviewStream />

        {/* ── 結: 즉시 상담 CTA ── */}
        <section
          id="ai-chat-section"
          style={{
            padding: "clamp(32px, 5vw, 64px) 0 clamp(56px, 8vw, 96px)",
            background: "#FAFAFA",
          }}
        >
          <div
            className="container-pet"
            style={{
              marginBottom: "clamp(18px, 2.5vw, 28px)",
              textAlign: "center",
            }}
          >
            <span className="eyebrow">지금 바로 물어보세요</span>
            <h2 className="text-display-md" style={{ margin: "14px 0 8px" }}>
              증상·품종·비용, <span className="text-accent-grad">30초 안에 전문 답변</span>
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 1.2vw, 16px)",
                color: "#6B7280",
                lineHeight: 1.7,
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              수의대 출신 전문가 수준의 AI가 기다리고 있어요.
              <br />
              자세한 진단은 피드에 올려 수의사 답변을 받아보세요.
            </p>
          </div>
          <div className="container-pet">
            <HeroSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
