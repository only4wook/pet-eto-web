"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import PremiumHero from "../components/PremiumHero";
import PremiumTrustGrid from "../components/PremiumTrustGrid";
import HowItWorks from "../components/HowItWorks";
import HeroSection from "../components/HeroSection";

// P.E.T 홈 — Awwwards급 리디자인 (Warm Trust × Premium Motion)
// 섹션 순서:
//   1. PremiumHero — 대범한 헤드라인 + 라이브 소셜 프루프 + CTA + 플로팅 카드
//   2. PremiumTrustGrid — 6가지 신뢰 시그널 (Glassmorphism)
//   3. HowItWorks — 3단계 이용 절차 (다크 섹션, 전환 감성)
//   4. HeroSection (AI 채팅) — 기존 AI 채팅 위젯은 유지 (앵커 #ai-chat)

export default function Home() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        <PremiumHero />
        <PremiumTrustGrid />
        <HowItWorks />

        {/* 기존 AI 채팅 — 앵커 #ai-chat. 섹션 라벨링 */}
        <section
          id="ai-chat-section"
          style={{
            padding: "clamp(56px, 8vw, 96px) 0",
            background: "#FAFAFA",
          }}
        >
          <div className="container-pet" style={{ marginBottom: 28, textAlign: "center" }}>
            <span className="eyebrow">지금 바로 써보기</span>
            <h2 className="text-display-md" style={{ margin: "14px 0 10px" }}>
              궁금한 거, <span className="text-accent-grad">AI에게 먼저 물어보세요</span>
            </h2>
            <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.65, maxWidth: 520, margin: "0 auto" }}>
              증상 · 품종 · 비용 · 행동 — 무엇이든 30초 내 전문 답변.
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
