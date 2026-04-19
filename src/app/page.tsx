"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PremiumHero from "../components/PremiumHero";
import PremiumTrustGrid from "../components/PremiumTrustGrid";
import HowItWorks from "../components/HowItWorks";
import HeroSection from "../components/HeroSection";
import FeedPreviewStream from "../components/FeedPreviewStream";

// P.E.T 홈 — 신뢰/매칭 이해를 먼저 보여준 뒤 피드로 연결
// 섹션 순서:
//   1. PremiumHero — 대범한 헤드라인 + CTA
//   2. PremiumTrustGrid — 신뢰 시그널 6가지
//   3. HowItWorks — 3단계 케어 매칭 절차
//   4. FeedPreviewStream — 실시간 피드 스트림
//   5. AI Chat (HeroSection) — 즉시 써볼 수 있는 AI 상담

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <PremiumHero />

        {/* ── 기: 서비스가 무엇을 하는지 먼저 설명 ── */}
        <section
          style={{
            padding: "clamp(44px, 7vw, 80px) 0",
            background: "#fff",
            borderTop: "1px solid #F3F4F6",
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <div className="container-pet" style={{ display: "grid", gap: 20 }}>
            <div style={{ textAlign: "center" }}>
              <span className="eyebrow">P.E.T 케어 시스템</span>
              <h2 className="text-display-md" style={{ margin: "14px 0 10px" }}>
                위험도 분류부터 매칭·보고·보장까지,
                <br />
                <span className="text-accent-grad">한 번에 연결되는 케어 플로우</span>
              </h2>
              <p
                style={{
                  margin: "0 auto",
                  maxWidth: 760,
                  fontSize: 15,
                  color: "#6B7280",
                  lineHeight: 1.7,
                }}
              >
                업로드된 상담은 AI가 먼저 긴급/주의/관찰/정상 상태를 분류하고, 필요한 경우 전문가 답변과
                케어 매칭으로 이어집니다. 보호자는 진행 상황을 실시간으로 확인하고, 사고 보장(최대 1억)
                안내까지 받을 수 있어요.
              </p>
            </div>
          </div>
        </section>

        <PremiumTrustGrid />
        <HowItWorks />
        
        {/* ── 전: 신뢰/매칭 이해 뒤, 실제 사례 피드 ── */}
        <FeedPreviewStream />

        {/* ── 결: 즉시 실행 가능한 AI 상담 ── */}
        <section
          id="ai-chat-section"
          style={{
            padding: "clamp(24px, 4vw, 48px) 0 clamp(48px, 7vw, 80px)",
            background: "#fff",
          }}
        >
          <div
            className="container-pet"
            style={{
              marginBottom: "clamp(18px, 2.5vw, 28px)",
              textAlign: "center",
            }}
          >
            <span className="eyebrow">즉시 AI 상담</span>
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
              서울대 수의대 출신 전문가 수준의 AI가 기다리고 있어요. 자세한 진단은 피드에 올려
              수의사 답변을 받아보세요.
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
