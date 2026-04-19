"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// 수의사·동물병원·동물학 전공자·펫샵 대상 영업용 랜딩
// 레퍼런스: Linear for Teams, Notion for Enterprise, Stripe Atlas

const SCHOOLS = [
  "서울대학교 수의과대학",
  "건국대학교 수의과대학",
  "충남대학교 수의과대학",
  "경상대학교 수의과대학",
  "전남대학교 수의과대학",
  "전북대학교 수의과대학",
  "제주대학교 수의과대학",
  "강원대학교 수의과대학",
  "충북대학교 수의과대학",
  "경북대학교 수의과대학",
];

const BENEFITS = [
  {
    icon: "📣",
    title: "병원·본인 브랜드 홍보",
    desc: "답변 한 건마다 병원명·수의사명이 '○○ 동물병원 ○○ 수의사' 형식으로 공개되어 자연스러운 홍보가 이루어집니다.",
  },
  {
    icon: "🎯",
    title: "실제 환자 유입",
    desc: "답변 말미 '내원 권장' 체크 시, 위치 기반으로 해당 보호자에게 본인 병원이 우선 추천됩니다.",
  },
  {
    icon: "💰",
    title: "답변 건당 리워드",
    desc: "답변 1건 = 500P 적립 (추후 현금 전환 가능). 월 20건 이상 시 전문가 등급 상향 + 광고 노출 증가.",
  },
  {
    icon: "🧠",
    title: "AI가 초안 제공",
    desc: "Gemini + GPT 기반 초기 분석을 AI가 제공하고, 전문가는 최종 검수·수정만 하면 돼요. 답변 시간 80% 단축.",
  },
  {
    icon: "🏥",
    title: "진료 예약 연계",
    desc: "답변에 예약 버튼 삽입 → 보호자가 클릭하면 본인 병원의 예약 시스템/카톡으로 자동 연결.",
  },
  {
    icon: "📊",
    title: "통계 대시보드",
    desc: "내 답변 조회수·좋아요·내원 전환률·월 수익을 한눈에. 병원 마케팅 데이터로 활용 가능.",
  },
];

const STEPS = [
  { no: "01", title: "신청", desc: "전문가 등록 페이지에서 면허번호·소속·경력 제출. 1~2분 소요." },
  { no: "02", title: "검증", desc: "운영팀이 수의사협회·학적 시스템을 통해 2~3 영업일 내 검증." },
  { no: "03", title: "활동 시작", desc: "승인되면 피드에 올라오는 질문에 답변 가능. 답변은 24시간 이내 권장." },
];

export default function ForVetsPage() {
  const rootRef = useRef<HTMLDivElement>(null);

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
    rootRef.current?.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Header />
      <main ref={rootRef} style={{ flex: 1 }}>
        {/* Hero */}
        <section className="bg-hero-glow" style={{ padding: "clamp(56px, 10vw, 120px) 0 clamp(48px, 8vw, 96px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{
            position: "absolute", top: "-120px", left: "-80px",
            width: 480, height: 480,
            background: "radial-gradient(circle, rgba(255,107,53,0.25) 0%, transparent 70%)",
            filter: "blur(60px)", pointerEvents: "none",
          }} />
          <div className="container-pet" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
            <span className="eyebrow reveal">수의사·동물병원·수의학 전공자 전용</span>
            <h1 className="text-display-xl reveal delay-1" style={{ margin: "16px 0 18px" }}>
              보호자는 <span className="text-accent-grad">정확한 답</span>을
              <br />
              당신은 <span className="text-accent-grad">자연스러운 홍보</span>를
            </h1>
            <p className="reveal delay-2" style={{
              fontSize: "clamp(15px, 1.4vw, 18px)", color: "#4B5563",
              lineHeight: 1.65, maxWidth: 620, margin: "0 auto 32px",
            }}>
              펫에토는 AI가 1차 분석한 피드 게시물에
              <br />
              <b>실명·면허가 검증된 수의사가 직접 답변하는</b> 국내 최초 플랫폼입니다.
            </p>
            <div className="reveal delay-3" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/expert/apply" className="btn-primary-xl">
                전문가 등록 신청
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
              <a href="mailto:peteto2026@gmail.com" className="btn-secondary-xl">제휴 문의 이메일</a>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section style={{ padding: "clamp(64px, 10vw, 120px) 0", background: "#FAFAFA" }}>
          <div className="container-pet">
            <div className="reveal" style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 72px)" }}>
              <span className="eyebrow">등록 시 6가지 혜택</span>
              <h2 className="text-display-lg" style={{ margin: "16px 0 12px" }}>
                답변 한 건이 <span className="text-accent-grad">환자·수익·신뢰</span>로
              </h2>
              <p style={{ fontSize: "clamp(15px, 1.3vw, 17px)", color: "#6B7280", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
                기존 네이버 지식인·블로그 마케팅과 차원이 다른, 의료 전문가용 플랫폼이에요.
              </p>
            </div>

            <div className="trust-cards-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(16px, 2vw, 24px)",
            }}>
              {BENEFITS.map((b, idx) => (
                <article key={b.title} className={`glass lift reveal delay-${(idx % 5) + 1}`} style={{
                  padding: "clamp(22px, 2.4vw, 32px)", borderRadius: 20, minHeight: 220,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: "linear-gradient(135deg, #FFF7ED 0%, #FFEBD6 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, marginBottom: 20, border: "1px solid rgba(255,107,53,0.12)",
                  }}>{b.icon}</div>
                  <h3 style={{
                    fontSize: "clamp(17px, 1.5vw, 20px)", fontWeight: 800,
                    color: "#1D1D1F", margin: "0 0 10px", letterSpacing: "-0.02em",
                  }}>{b.title}</h3>
                  <p style={{
                    fontSize: 14, color: "#6B7280", lineHeight: 1.65, margin: 0,
                  }}>{b.desc}</p>
                </article>
              ))}
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 900px) {
              .trust-cards-grid { grid-template-columns: repeat(2, 1fr) !important; }
            }
            @media (max-width: 560px) {
              .trust-cards-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

        {/* Onboarding */}
        <section style={{
          padding: "clamp(64px, 10vw, 120px) 0",
          background: "#1D1D1F", color: "#fff", position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden="true" style={{
            position: "absolute", top: "-200px", right: "-100px",
            width: 600, height: 600,
            background: "radial-gradient(circle, rgba(255,107,53,0.18) 0%, transparent 70%)",
            filter: "blur(80px)", pointerEvents: "none",
          }} />

          <div className="container-pet" style={{ position: "relative", zIndex: 1 }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: "clamp(48px, 7vw, 80px)" }}>
              <span className="eyebrow" style={{
                background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.25)", color: "#FBBF24",
              }}>등록 절차</span>
              <h2 className="text-display-lg" style={{ margin: "18px 0 14px", color: "#fff" }}>
                <span className="text-accent-grad">3단계</span>로 시작,
                <br />
                5분이면 끝
              </h2>
            </div>

            <div className="how-steps-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(16px, 2vw, 24px)", marginBottom: "clamp(40px, 6vw, 64px)",
            }}>
              {STEPS.map((s, idx) => (
                <div key={s.no} className={`glass-dark reveal delay-${idx + 1}`} style={{
                  padding: "clamp(24px, 2.6vw, 36px)", borderRadius: 20, minHeight: 220,
                }}>
                  <div style={{
                    fontSize: "clamp(48px, 5vw, 72px)", fontWeight: 900,
                    letterSpacing: "-0.04em", color: "#FF6B35", lineHeight: 1, marginBottom: 20,
                  }}>{s.no}</div>
                  <h3 style={{
                    fontSize: "clamp(20px, 1.7vw, 24px)", fontWeight: 800,
                    color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em",
                  }}>{s.title}</h3>
                  <p style={{
                    fontSize: 14, color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.7, margin: 0,
                  }}>{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="reveal delay-4" style={{ textAlign: "center" }}>
              <Link href="/expert/apply" className="btn-primary-xl">
                지금 등록하기
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 900px) {
              .how-steps-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

        {/* Schools */}
        <section style={{ padding: "clamp(56px, 8vw, 96px) 0", background: "#FAFAFA" }}>
          <div className="container-pet" style={{ textAlign: "center" }}>
            <span className="eyebrow reveal">수의과대학 파트너십</span>
            <h2 className="text-display-md reveal delay-1" style={{ margin: "14px 0 12px" }}>
              전국 10개 <span className="text-accent-grad">수의과대학</span>과 협업 진행 중
            </h2>
            <p className="reveal delay-2" style={{
              fontSize: 14, color: "#6B7280", lineHeight: 1.65, maxWidth: 560, margin: "0 auto 28px",
            }}>
              수의학 전공 학생도 임상 경험 축적 + 포트폴리오 구축 용도로 참여 가능합니다.
            </p>
            <div className="reveal delay-3" style={{
              display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 780, margin: "0 auto",
            }}>
              {SCHOOLS.map((s) => (
                <span key={s} style={{
                  padding: "8px 14px", background: "#fff",
                  border: "1px solid #E5E7EB", borderRadius: 999,
                  fontSize: 12, fontWeight: 600, color: "#374151",
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section style={{ padding: "clamp(64px, 9vw, 120px) 0", background: "#fff" }}>
          <div className="container-pet" style={{ textAlign: "center", maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            <h2 className="reveal text-display-lg" style={{ margin: "0 0 16px" }}>
              5분 투자로 <span className="text-accent-grad">평생 포트폴리오</span>
            </h2>
            <p className="reveal delay-1" style={{
              fontSize: 16, color: "#4B5563", lineHeight: 1.65, marginBottom: 32,
            }}>
              펫에토 전문가 답변 기록은 본인 프로필 페이지에 영구 저장되어,
              <br />병원 홈페이지·이력서·SNS 어디든 링크로 공유 가능해요.
            </p>
            <div className="reveal delay-2" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/expert/apply" className="btn-primary-xl">지금 등록하기</Link>
              <a href="mailto:peteto2026@gmail.com?subject=[펫에토] 전문가 제휴 문의" className="btn-secondary-xl">
                이메일 문의
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
