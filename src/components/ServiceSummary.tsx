"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";

// 히어로 다음 "서비스 요약" — 커서 피드백: '서비스가 실제로 뭘 하는지 1개 요약 섹션'
// 히어로와 신뢰 카드 사이에서 "정확히 어떤 걸 해준다"를 한 번에 전달
// 3가지 핵심 시나리오만 짚고, 자세한 근거는 다음 섹션(신뢰 그리드)에서 설명.

const ITEMS = [
  {
    num: "1",
    emoji: "🤖",
    title: "내 아이 상태가 걱정될 때",
    body: "사진 한 장 올리면 AI가 30초 안에 건강 상태를 분석해요. FGS 통증 지수·응급도까지 숫자로.",
    cta: { label: "지금 상담해보기", href: "/ai" },
    accent: "#0EA5E9",
  },
  {
    num: "2",
    emoji: "🩺",
    title: "전문가 진단이 필요할 때",
    body: "실명·면허 검증된 수의사·동물병원이 피드에 직접 답변합니다. '○○ 병원 ○○ 수의사'라고 공개해요.",
    cta: { label: "전문가 디렉토리", href: "/experts" },
    accent: "#FF6B35",
  },
  {
    num: "3",
    emoji: "🚕",
    title: "내가 움직일 수 없을 때",
    body: "펫택시·호텔링·방문 돌봄 3종 서비스가 연결됩니다. 액션캠·실시간 보고로 안심하세요.",
    cta: { label: "파트너 서비스", href: "/partner" },
    accent: "#F59E0B",
  },
];

export default function ServiceSummary() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
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
      style={{ padding: "clamp(56px, 8vw, 96px) 0", background: "#fff" }}
      aria-labelledby="summary-headline"
    >
      <div className="container-pet">
        <div className="reveal" style={{ textAlign: "center", maxWidth: 680, margin: "0 auto clamp(32px, 5vw, 56px)" }}>
          <span className="eyebrow">P.E.T는 정확히 무엇을 해드리나요?</span>
          <h2 id="summary-headline" className="text-display-md" style={{ margin: "14px 0 10px" }}>
            반려동물에게 생기는 <span className="text-accent-grad">모든 상황</span>을 한 번에
          </h2>
          <p style={{ fontSize: "clamp(14px, 1.2vw, 16px)", color: "#6B7280", lineHeight: 1.7 }}>
            AI 분석 → 전문가 답변 → 실제 돌봄까지.<br/>
            다른 서비스들이 따로 해주던 것을, 한 플랫폼에서 연결합니다.
          </p>
        </div>

        <div
          className="service-summary-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(14px, 2vw, 20px)",
          }}
        >
          {ITEMS.map((it, idx) => (
            <Link
              key={it.num}
              href={it.cta.href}
              className={`reveal delay-${idx + 1} lift`}
              style={{
                display: "flex", flexDirection: "column",
                padding: "clamp(22px, 2.4vw, 30px)",
                background: "#FAFAFA",
                border: "1px solid #F3F4F6",
                borderRadius: 18,
                textDecoration: "none", color: "inherit",
                gap: 12, position: "relative", overflow: "hidden",
              }}
            >
              {/* 숫자 배지 */}
              <div style={{
                position: "absolute", top: 18, right: 18,
                fontSize: 72, fontWeight: 900, letterSpacing: "-0.04em",
                color: it.accent, opacity: 0.12, lineHeight: 1, pointerEvents: "none",
              }}>
                {it.num}
              </div>

              {/* 이모지 */}
              <div style={{
                fontSize: 36, width: 60, height: 60, borderRadius: 16,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: `${it.accent}15`, marginBottom: 6,
              }}>{it.emoji}</div>

              <h3 style={{
                margin: 0, fontSize: "clamp(16px, 1.4vw, 19px)", fontWeight: 800,
                color: "#1D1D1F", letterSpacing: "-0.02em", lineHeight: 1.35,
              }}>
                {it.title}
              </h3>

              <p style={{
                margin: 0, fontSize: 14, color: "#4B5563", lineHeight: 1.65,
              }}>
                {it.body}
              </p>

              <div style={{
                marginTop: "auto", paddingTop: 12,
                fontSize: 13, fontWeight: 700, color: it.accent,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                {it.cta.label} →
              </div>
            </Link>
          ))}
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .service-summary-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
