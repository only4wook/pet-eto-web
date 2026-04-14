"use client";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";

export default function Home() {
  return (
    <>
      <Header />
      <main className="container-pet" style={{ padding: "16px 0", flex: 1 }}>
        {/* AI 중심 히어로 (80%) + CTA (5%) + 신뢰 (5%) */}
        <HeroSection />
      </main>
      <Footer />
    </>
  );
}
