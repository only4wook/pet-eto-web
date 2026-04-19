"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { buildKakaoConsultUrl } from "../lib/contact";
import { trackEvent } from "../lib/analytics";

// P.E.T Awwwards-grade Hero
// 레퍼런스: Airbnb(따뜻한 신뢰) + Linear(대범한 타이포) + Apple(여백·스토리텔링)
// 컨셉: "Warm Trust × Premium Motion"

export default function PremiumHero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // 스크롤 진입 시 .reveal → .in-view 전환 (IntersectionObserver)
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    const nodes = sectionRef.current?.querySelectorAll(".reveal");
    nodes?.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-hero-glow"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "clamp(48px, 8vw, 120px) 0 clamp(56px, 8vw, 100px)",
      }}
      aria-labelledby="hero-headline"
    >
      {/* 장식 blob (뒷배경 컬러 블러 — Linear/Stripe 스타일) */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-120px",
          left: "-80px",
          width: "480px",
          height: "480px",
          background: "radial-gradient(circle, rgba(255,107,53,0.35) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "-160px",
          right: "-100px",
          width: "520px",
          height: "520px",
          background: "radial-gradient(circle, rgba(46,196,182,0.25) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      <div
        className="container-pet premium-hero-grid"
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1.05fr) minmax(0, 0.95fr)",
          gap: "clamp(24px, 4vw, 56px)",
          alignItems: "center",
        }}
      >
        {/* ── 좌측: 카피 + CTA ── */}
        <div>
          {/* Eyebrow */}
          <div className="reveal" style={{ marginBottom: 20 }}>
            <span className="eyebrow">
              <span className="live-dot" aria-hidden="true" />
              지금 이 시각 <strong style={{ fontWeight: 800 }}>8명</strong>의 보호자가 매칭 중
            </span>
          </div>

          {/* 헤드라인 — 대범한 타이포 */}
          <h1
            id="hero-headline"
            className="text-display-xl reveal delay-1"
            style={{ margin: "0 0 18px" }}
          >
            혼자 둘 수 없는 순간,
            <br />
            곁에 둘 <span className="text-accent-grad">전문가</span>가 있습니다.
          </h1>

          {/* 서브카피 */}
          <p
            className="reveal delay-2"
            style={{
              fontSize: "clamp(15px, 1.4vw, 18px)",
              color: "#4B5563",
              lineHeight: 1.65,
              maxWidth: 560,
              margin: "0 0 32px",
              letterSpacing: "-0.01em",
            }}
          >
            접수 후 전담 매니저가 아이 상태·시간·위치를 확인하고,
            <br />
            조건이 맞는 3단계 검증 펫시터를 우선순위로 매칭해드립니다.
            <br />
            AI 건강 분석 · 실시간 사진 보고 · 안전 결제 · 사고 시 최대 1억 보장까지.
          </p>

          {/* CTA 2개 */}
          <div
            className="reveal delay-3"
            style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 32 }}
          >
            <a
              href={buildKakaoConsultUrl("hero_cta")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEvent("kakao_click", { source: "hero_cta" })}
              className="btn-primary-xl"
            >
              매칭 요청하기
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </a>
            <Link href="/ai" className="btn-secondary-xl">
              AI 건강체크
            </Link>
          </div>

          {/* 신뢰 지표 3개 — 인라인 */}
          <div
            className="reveal delay-4"
            style={{
              display: "flex",
              gap: "clamp(20px, 3vw, 40px)",
              flexWrap: "wrap",
            }}
          >
            {[
              { num: "10분", label: "평균 매칭 시간" },
              { num: "3단계", label: "파트너 검증" },
              { num: "최대 1억", label: "사고 보장" },
            ].map((s) => (
              <div key={s.label}>
                <div style={{ fontSize: "clamp(20px, 2vw, 26px)", fontWeight: 900, color: "#1D1D1F", letterSpacing: "-0.03em" }}>
                  {s.num}
                </div>
                <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2, fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 우측: 플로팅 미리보기 카드 스택 ── */}
        <div
          className="reveal delay-2 pc-only"
          style={{
            position: "relative",
            height: "100%",
            minHeight: 480,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 배경 이미지 영역 */}
          <div
            style={{
              position: "absolute",
              inset: "10% 12% 10% 8%",
              borderRadius: 32,
              background:
                "url('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&q=80&auto=format&fit=crop') center/cover",
              boxShadow: "0 30px 80px rgba(31,41,55,0.20)",
            }}
            aria-hidden="true"
          />

          {/* 상단 좌: AI 분석 카드 */}
          <div
            className="glass bob"
            style={{
              position: "absolute",
              top: "8%",
              left: "-2%",
              width: 260,
              padding: 18,
              borderRadius: 20,
              animationDelay: "0.3s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div
                style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: "linear-gradient(135deg, #FF6B35, #F59E0B)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16,
                }}
              >
                🤖
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1D1D1F" }}>P.E.T AI 분석</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>방금 전</div>
              </div>
            </div>
            <div style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.6 }}>
              <strong style={{ color: "#059669" }}>✅ 정상</strong> — 피모·눈·자세 모두 양호.
              오늘은 활동량 조금 늘려주시면 좋겠어요.
            </div>
          </div>

          {/* 하단 우: 시터 매칭 카드 */}
          <div
            className="glass bob"
            style={{
              position: "absolute",
              bottom: "8%",
              right: "-2%",
              width: 280,
              padding: 18,
              borderRadius: 20,
              animationDelay: "1s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div
                style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: "linear-gradient(135deg, #FDBA74, #FB923C)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", fontWeight: 800, fontSize: 15,
                }}
              >
                김
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#1D1D1F" }}>김수현 펫시터</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>경력 3년 · ★ 4.9 (142)</div>
              </div>
              <span
                style={{
                  fontSize: 10, fontWeight: 700,
                  background: "#ECFDF5", color: "#059669",
                  padding: "3px 8px", borderRadius: 8,
                }}
              >
                검증됨
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["고양이 전문", "주사 가능", "야간 케어"].map((t) => (
                <span key={t} style={{
                  fontSize: 11, color: "#6B7280",
                  background: "#F9FAFB", padding: "3px 8px",
                  borderRadius: 6, border: "1px solid #E5E7EB",
                }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
