"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PremiumHero from "../components/PremiumHero";
import PremiumTrustGrid from "../components/PremiumTrustGrid";
import HowItWorks from "../components/HowItWorks";
import HeroSection from "../components/HeroSection";

// P.E.T 홈 — Awwwards급 리디자인 (Warm Trust × Premium Motion)
// 섹션 순서 (핵심 서비스 = AI 챗을 히어로 바로 아래로 승격):
//   1. PremiumHero — 대범한 헤드라인 + 라이브 소셜 프루프 + CTA
//   2. AI Chat (HeroSection) — 핵심 서비스, 즉시 써볼 수 있게 상단 배치
//   3. PremiumTrustGrid — 6가지 신뢰 시그널
//   4. HowItWorks — 3단계 절차 (전환 CTA)

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <PremiumHero />

        {/* ── AI 채팅 섹션 — 메인 서비스, 히어로 바로 아래 ── */}
        <section
          id="ai-chat-section"
          style={{
            padding: "clamp(24px, 4vw, 48px) 0 clamp(48px, 7vw, 80px)",
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
            <span className="eyebrow">지금 바로 AI에게 물어보세요</span>
            <h2 className="text-display-md" style={{ margin: "14px 0 8px" }}>
              증상·품종·비용, <span className="text-accent-grad">30초 안에 전문 답변</span>
            </h2>
            <p
              style={{
                fontSize: "clamp(14px, 1.2vw, 16px)",
                color: "#6B7280",
                lineHeight: 1.6,
                maxWidth: 520,
                margin: "0 auto",
              }}
            >
              서울대 수의대 출신 전문가 수준의 AI가 기다리고 있어요.
            </p>
          </div>
          <div className="container-pet">
            <HeroSection />
          </div>
        </section>

        <PremiumTrustGrid />
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
