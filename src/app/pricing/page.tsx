"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// 수익 구조 공개 페이지 (투명 가격)
// 레퍼런스: Toss 수수료 공개, Airbnb 호스트 수수료 페이지

const TIERS = [
  {
    tag: "USER",
    badge: "무료",
    badgeColor: "#10B981",
    title: "보호자",
    desc: "피드 업로드·AI 분석·커뮤니티·위키 모두 무료",
    features: [
      { label: "AI 건강 분석 (Gemini + GPT)", included: true },
      { label: "피드 업로드 무제한", included: true },
      { label: "전문가 답변 요청", included: true },
      { label: "단골 병원 등록 · 응급 원클릭", included: true },
      { label: "커뮤니티 · 위키 · 포인트 적립", included: true },
      { label: "파트너 서비스 예약 (수수료 0%)", included: true, note: "업체가 10%를 부담" },
    ],
    cta: "회원가입",
    ctaHref: "/auth/signup",
  },
  {
    tag: "EXPERT",
    badge: "무료",
    badgeColor: "#0369A1",
    title: "수의사 / 전문가",
    desc: "답변 달면서 병원 홍보 + 환자 유입 + 리워드",
    features: [
      { label: "전문가 답변 등록 (실명·면허 검증)", included: true },
      { label: "답변 1건 당 500P 적립", included: true },
      { label: "병원 홍보 (답변에 병원명 노출)", included: true },
      { label: "/for-vets 영업 랜딩 무료 게재", included: true },
      { label: "월 20건 답변 시 상단 프리미엄 노출", included: true },
      { label: "진료 예약 연계 (결제 시 수수료 5%)", included: false, note: "베타 진행 중" },
    ],
    cta: "전문가 등록",
    ctaHref: "/expert/apply",
    highlight: true,
  },
  {
    tag: "PARTNER",
    badge: "성과 과금",
    badgeColor: "#FF6B35",
    title: "이동 · 호텔링 · 돌봄 업체",
    desc: "마케팅 비용 0원 · 예약 발생 시에만 수수료",
    features: [
      { label: "업체 프로필 등록 (검증 후 노출)", included: true },
      { label: "예약 수수료: 결제액의 **10%**", included: true, note: "업계 최저 수준" },
      { label: "고정비·월정액 **없음**", included: true },
      { label: "지역 기반 우선 매칭", included: true },
      { label: "후기·평점 시스템 자동 관리", included: true },
      { label: "에스크로 결제로 안심 정산", included: true },
    ],
    cta: "업체 등록",
    ctaHref: "/partner",
  },
];

const FEES_DETAIL = [
  {
    scenario: "보호자가 펫시터 10만원 예약",
    pay: "10만원 결제",
    partner: "9만원 수령 (다음주 정산)",
    peteto: "1만원 (10% 중개 수수료)",
  },
  {
    scenario: "보호자가 이동 서비스 5만원 이용",
    pay: "5만원 결제",
    partner: "45,000원 수령",
    peteto: "5,000원",
  },
  {
    scenario: "보호자가 전문가 답변만 받음",
    pay: "0원",
    partner: "답변 시 500P 적립",
    peteto: "0원 (유입 확대 목적)",
  },
];

export default function PricingPage() {
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
    <>
      <Header />
      <main ref={ref} style={{ flex: 1 }}>
        {/* Hero */}
        <section className="bg-hero-glow" style={{ padding: "clamp(56px, 9vw, 100px) 0 clamp(40px, 6vw, 72px)" }}>
          <div className="container-pet" style={{ textAlign: "center", maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
            <span className="eyebrow reveal">수수료 투명 공개</span>
            <h1 className="text-display-xl reveal delay-1" style={{ margin: "16px 0 18px" }}>
              숨은 비용 없습니다.
              <br />
              <span className="text-accent-grad">보호자는 무료,</span> 업체는 성과 과금.
            </h1>
            <p className="reveal delay-2" style={{
              fontSize: "clamp(14px, 1.3vw, 17px)",
              color: "#4B5563", lineHeight: 1.7,
            }}>
              AI 분석·피드·커뮤니티·전문가 답변은 <b>전부 무료</b>입니다.
              <br />파트너 업체는 <b>실제 예약이 발생했을 때만 10% 중개 수수료</b>를 부담합니다.
            </p>
          </div>
        </section>

        {/* Tiers */}
        <section style={{ padding: "clamp(40px, 6vw, 72px) 0", background: "#FAFAFA" }}>
          <div className="container-pet">
            <div className="pricing-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(14px, 2vw, 24px)",
            }}>
              {TIERS.map((tier, idx) => (
                <article
                  key={tier.tag}
                  className={`reveal delay-${idx + 1} lift`}
                  style={{
                    position: "relative",
                    background: tier.highlight ? "linear-gradient(135deg, #fff 0%, #FFF7ED 100%)" : "#fff",
                    border: tier.highlight ? "2px solid #FF6B35" : "1px solid #E5E7EB",
                    borderRadius: 20, padding: "28px 24px",
                    boxShadow: tier.highlight ? "0 20px 40px rgba(255,107,53,0.12)" : "0 2px 8px rgba(0,0,0,0.04)",
                  }}
                >
                  {tier.highlight && (
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      background: "#FF6B35", color: "#fff",
                      padding: "4px 14px", borderRadius: 999,
                      fontSize: 11, fontWeight: 800, letterSpacing: "0.02em",
                    }}>
                      가장 인기
                    </div>
                  )}

                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.08em" }}>{tier.tag}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 999,
                      background: tier.badgeColor + "15", color: tier.badgeColor,
                    }}>{tier.badge}</span>
                  </div>

                  <h3 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 800, color: "#1D1D1F" }}>{tier.title}</h3>
                  <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{tier.desc}</p>

                  <ul style={{ margin: "0 0 22px", padding: 0, listStyle: "none" }}>
                    {tier.features.map((f) => (
                      <li key={f.label} style={{
                        display: "flex", alignItems: "flex-start", gap: 8,
                        padding: "6px 0", fontSize: 13,
                        color: f.included ? "#1D1D1F" : "#9CA3AF",
                      }}>
                        <span style={{ flexShrink: 0, fontSize: 14 }}>{f.included ? "✅" : "⏳"}</span>
                        <div>
                          <span>{f.label}</span>
                          {f.note && <span style={{ display: "block", fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{f.note}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={tier.ctaHref}
                    style={{
                      display: "block", textAlign: "center", padding: "12px 16px",
                      background: tier.highlight ? "#FF6B35" : "#1D1D1F",
                      color: "#fff", borderRadius: 10,
                      fontSize: 14, fontWeight: 700, textDecoration: "none",
                    }}
                  >
                    {tier.cta} →
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 900px) {
              .pricing-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

        {/* Detail 시뮬레이션 */}
        <section style={{ padding: "clamp(56px, 8vw, 96px) 0", background: "#fff" }}>
          <div className="container-pet">
            <div className="reveal" style={{ textAlign: "center", marginBottom: 36 }}>
              <span className="eyebrow">수수료 시뮬레이션</span>
              <h2 className="text-display-md" style={{ margin: "14px 0 8px" }}>
                실제로 <span className="text-accent-grad">얼마</span>가 오가나요?
              </h2>
              <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65 }}>
                이런 구조로 보호자 · 업체 · 펫에토가 함께 성장합니다.
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 12, maxWidth: 960, margin: "0 auto" }}>
              {FEES_DETAIL.map((f, idx) => (
                <div key={f.scenario} className={`reveal delay-${idx + 1}`} style={{
                  background: "#FAFAFA", border: "1px solid #E5E7EB",
                  borderRadius: 14, padding: 18,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", marginBottom: 10 }}>
                    📋 {f.scenario}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#4B5563" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>💳 보호자 결제</span>
                      <b style={{ color: "#1D1D1F" }}>{f.pay}</b>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>🏢 업체 수령</span>
                      <b style={{ color: "#059669" }}>{f.partner}</b>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span>🐾 펫에토</span>
                      <b style={{ color: "#FF6B35" }}>{f.peteto}</b>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 비교 */}
        <section style={{ padding: "clamp(40px, 6vw, 72px) 0", background: "#F9FAFB" }}>
          <div className="container-pet" style={{ maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
            <h3 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#1D1D1F", textAlign: "center" }}>
              업계 수수료 비교
            </h3>
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead style={{ background: "#F9FAFB" }}>
                  <tr>
                    <th style={tdHead}>플랫폼</th>
                    <th style={tdHead}>보호자</th>
                    <th style={tdHead}>업체</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: "#FFF7ED" }}>
                    <td style={{ ...tdCell, fontWeight: 800, color: "#C2410C" }}>🐾 펫에토</td>
                    <td style={tdCell}>무료</td>
                    <td style={{ ...tdCell, fontWeight: 700, color: "#FF6B35" }}>10%</td>
                  </tr>
                  <tr>
                    <td style={tdCell}>해외 펫시터 플랫폼 A</td>
                    <td style={tdCell}>+15% 서비스 수수료</td>
                    <td style={tdCell}>20%</td>
                  </tr>
                  <tr>
                    <td style={tdCell}>국내 플랫폼 B</td>
                    <td style={tdCell}>무료</td>
                    <td style={tdCell}>15~20%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ margin: "12px 0 0", fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
              ※ 업계 수치는 공개 자료 기준 추정치
            </p>
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: "clamp(56px, 8vw, 96px) 0", background: "#fff", textAlign: "center" }}>
          <div className="container-pet" style={{ maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
            <h2 className="text-display-md reveal" style={{ margin: "0 0 12px" }}>
              시작에 비용은 <span className="text-accent-grad">0원</span>
            </h2>
            <p className="reveal delay-1" style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 24 }}>
              성공하면 함께 성장, 성과 없으면 아무 비용도 없어요.
            </p>
            <div className="reveal delay-2" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/auth/signup" className="btn-primary-xl">보호자 가입</Link>
              <Link href="/expert/apply" className="btn-secondary-xl">전문가 등록</Link>
              <Link href="/partner" className="btn-secondary-xl">업체 등록</Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

const tdHead: React.CSSProperties = { padding: "12px 14px", fontSize: 12, fontWeight: 700, color: "#6B7280", textAlign: "left", letterSpacing: "0.02em", borderBottom: "1px solid #E5E7EB" };
const tdCell: React.CSSProperties = { padding: "12px 14px", fontSize: 13, color: "#374151", textAlign: "left", borderBottom: "1px solid #F3F4F6" };
