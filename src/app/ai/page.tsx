"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import HeroSection from "../../components/HeroSection";

// "건강체크" 전용 페이지 — 하단 탭바 "건강체크" 클릭 시 여기로
// 메인페이지 스크롤 없이 AI와 즉시 대화할 수 있게 풀페이지 경험 제공
// 카피는 '고객 입장'으로: "증상을 물어보세요"

export default function AIPage() {
  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        {/* 심플 인트로 */}
        <section style={{
          padding: "clamp(20px, 3vw, 36px) 0 clamp(12px, 2vw, 20px)",
          background: "linear-gradient(180deg, #FFF7ED 0%, #FAFAFA 100%)",
          borderBottom: "1px solid #F3F4F6",
        }}>
          <div className="container-pet" style={{ textAlign: "center", maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
            <span className="eyebrow">무엇이든 물어보세요</span>
            <h1 className="text-display-md" style={{ margin: "10px 0 6px" }}>
              우리 아이, 괜찮은 걸까? <span className="text-accent-grad">30초 안에 답해드려요</span>
            </h1>
            <p style={{
              fontSize: "clamp(13px, 1.1vw, 15px)",
              color: "#6B7280",
              lineHeight: 1.65,
              margin: 0,
            }}>
              증상·품종·비용·응급 대처까지 — 수의대 출신 전문가 수준의 AI가 답변합니다.
              <br />
              <span style={{ fontSize: 11, color: "#9CA3AF" }}>
                ⚖️ 이 기능은 '진료 전 참고 가이드'입니다. 확진은 동물병원에서.
              </span>
            </p>
          </div>
        </section>

        {/* AI 챗 위젯 (기존 HeroSection 재사용) */}
        <section
          id="ai-chat-section"
          style={{
            padding: "clamp(12px, 2vw, 20px) 0 clamp(32px, 5vw, 56px)",
          }}
        >
          <div className="container-pet">
            <HeroSection />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
