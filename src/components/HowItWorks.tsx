"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "./I18nProvider";

// P.E.T How It Works — 3단계 이용 절차

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const STEPS = [
    { no: "01", titleKey: "home.how.step1Title", descKey: "home.how.step1Desc", tagKey: "home.how.step1Tag", color: "#FF6B35" },
    { no: "02", titleKey: "home.how.step2Title", descKey: "home.how.step2Desc", tagKey: "home.how.step2Tag", color: "#F59E0B" },
    { no: "03", titleKey: "home.how.step3Title", descKey: "home.how.step3Desc", tagKey: "home.how.step3Tag", color: "#10B981" },
  ];

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
    ref.current?.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(64px, 10vw, 120px) 0",
        background: "#1D1D1F",
        color: "#fff",
        position: "relative",
        overflow: "hidden",
      }}
      aria-labelledby="how-it-works-headline"
    >
      {/* 배경 글로우 */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "-200px",
          right: "-100px",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)",
          filter: "blur(80px)",
          pointerEvents: "none",
        }}
      />

      <div className="container-pet" style={{ position: "relative", zIndex: 1 }}>
        <div
          className="reveal"
          style={{ textAlign: "center", marginBottom: "clamp(48px, 7vw, 80px)" }}
        >
          <span
            className="eyebrow"
            style={{
              background: "rgba(255,107,53,0.15)",
              border: "1px solid rgba(255,107,53,0.25)",
              color: "#FBBF24",
            }}
          >
            {t("home.how.eyebrow")}
          </span>
          <h2
            id="how-it-works-headline"
            className="text-display-lg"
            style={{ margin: "18px 0 14px", color: "#fff" }}
          >
            {t("home.how.titleLine1")}
            <br />
            <span className="text-accent-grad">{t("home.how.titleAccent")}</span>
          </h2>
          <p
            style={{
              fontSize: "clamp(15px, 1.3vw, 17px)",
              color: "rgba(255,255,255,0.65)",
              lineHeight: 1.65,
              maxWidth: 540,
              margin: "0 auto",
              letterSpacing: "-0.01em",
            }}
          >
            {t("home.how.desc")}
          </p>
        </div>

        {/* 3단계 카드 */}
        <div
          className="how-steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(16px, 2vw, 24px)",
            marginBottom: "clamp(40px, 6vw, 64px)",
          }}
        >
          {STEPS.map((step, idx) => (
            <div
              key={step.no}
              className={`glass-dark reveal delay-${idx + 1}`}
              style={{
                padding: "clamp(24px, 2.6vw, 36px)",
                borderRadius: 20,
                position: "relative",
                minHeight: 280,
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* 큰 번호 */}
              <div
                style={{
                  fontSize: "clamp(48px, 5vw, 72px)",
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: step.color,
                  lineHeight: 1,
                  marginBottom: 20,
                  opacity: 0.95,
                }}
              >
                {step.no}
              </div>

              <h3
                style={{
                  fontSize: "clamp(20px, 1.7vw, 24px)",
                  fontWeight: 800,
                  color: "#fff",
                  margin: "0 0 12px",
                  letterSpacing: "-0.02em",
                }}
              >
                {t(step.titleKey)}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.7,
                  margin: "0 0 20px",
                  flex: 1,
                }}
              >
                {t(step.descKey)}
              </p>

              {/* 소요 시간 배지 */}
              <span
                style={{
                  alignSelf: "flex-start",
                  fontSize: 12,
                  fontWeight: 700,
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.85)",
                  padding: "6px 12px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                ⏱ {t(step.tagKey)}
              </span>

              {/* 연결선 (PC only, 마지막 제외) */}
              {idx < STEPS.length - 1 && (
                <div
                  className="step-connector pc-only"
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    right: "-14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    zIndex: 2,
                  }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="reveal delay-4" style={{ textAlign: "center" }}>
          <a
            href="https://pf.kakao.com/_giedX/chat"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-xl"
          >
            {t("home.how.ctaButton")}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .how-steps-grid {
            grid-template-columns: 1fr !important;
          }
          .step-connector {
            display: none !important;
          }
        }
      `}</style>
    </section>
  );
}
