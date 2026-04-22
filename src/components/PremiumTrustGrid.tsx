"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { useI18n } from "./I18nProvider";

// P.E.T Trust Grid — 신뢰 시그널 6개를 Glassmorphism 카드로 표시
// 레퍼런스: Linear.app Features, Apple 기능 카드, Stripe 섹션

type TrustItem = {
  icon: ReactNode;
  titleKey: string;
  descKey: string;
  badgeKey?: "badgeNew" | "badgeSoon";
};

const ITEMS: TrustItem[] = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-12V5l-8-3-8 3v5c0 8 8 12 8 12z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    titleKey: "card1Title",
    descKey: "card1Desc",
    badgeKey: "badgeNew",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="12" cy="5" r="2" />
        <path d="M12 7v4M8 16h.01M16 16h.01" />
      </svg>
    ),
    titleKey: "card2Title",
    descKey: "card2Desc",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="8.5" cy="10" r="1.5" />
        <path d="M21 16l-5-5-9 9" />
      </svg>
    ),
    titleKey: "card3Title",
    descKey: "card3Desc",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    titleKey: "card4Title",
    descKey: "card4Desc",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    titleKey: "card5Title",
    descKey: "card5Desc",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    titleKey: "card6Title",
    descKey: "card6Desc",
    badgeKey: "badgeSoon",
  },
];

export default function PremiumTrustGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

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
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        padding: "clamp(64px, 10vw, 120px) 0",
        background: "#FAFAFA",
      }}
      aria-labelledby="trust-headline"
    >
      <div className="container-pet">
        {/* Section Header */}
        <div
          className="reveal"
          style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 72px)", maxWidth: 720, margin: "0 auto clamp(40px, 6vw, 72px)" }}
        >
          <span className="eyebrow" style={{ marginBottom: 20 }}>
            {t("home.trust.eyebrow")}
          </span>
          <h2 id="trust-headline" className="text-display-lg" style={{ margin: "16px 0 16px" }}>
            {t("home.trust.gridTitle1")}
            <br />
            {t("home.trust.gridTitle2")}
          </h2>
          <p style={{
            fontSize: "clamp(15px, 1.3vw, 17px)",
            color: "#6B7280",
            lineHeight: 1.65,
            maxWidth: 580,
            margin: "0 auto",
            letterSpacing: "-0.01em",
          }}>
            {t("home.trust.gridQuestion")}
          </p>
        </div>

        {/* 카드 그리드 */}
        <div
          className="trust-cards-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(16px, 2vw, 24px)",
          }}
        >
          {ITEMS.map((item, idx) => (
            <article
              key={item.titleKey}
              className={`glass lift reveal delay-${(idx % 5) + 1}`}
              style={{
                padding: "clamp(22px, 2.4vw, 32px)",
                borderRadius: 20,
                position: "relative",
                minHeight: 220,
              }}
            >
              {item.badgeKey && (
                <span
                  style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: "0.06em",
                    background: item.badgeKey === "badgeNew" ? "#FEF3C7" : "#E0E7FF",
                    color: item.badgeKey === "badgeNew" ? "#92400E" : "#3730A3",
                    padding: "3px 8px",
                    borderRadius: 6,
                  }}
                >
                  {t(`home.trust.${item.badgeKey}`)}
                </span>
              )}
              {/* 아이콘 */}
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: "linear-gradient(135deg, #FFF7ED 0%, #FFEBD6 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FF6B35",
                  marginBottom: 20,
                  border: "1px solid rgba(255,107,53,0.12)",
                }}
              >
                {item.icon}
              </div>
              <h3
                style={{
                  fontSize: "clamp(17px, 1.5vw, 20px)",
                  fontWeight: 800,
                  color: "#1D1D1F",
                  margin: "0 0 10px",
                  letterSpacing: "-0.02em",
                }}
              >
                {t(`home.trust.${item.titleKey}`)}
              </h3>
              <p
                style={{
                  fontSize: 14,
                  color: "#6B7280",
                  lineHeight: 1.65,
                  margin: 0,
                  letterSpacing: "-0.005em",
                }}
              >
                {t(`home.trust.${item.descKey}`)}
              </p>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .trust-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 560px) {
          .trust-cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
