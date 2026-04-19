"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// 3단계 검증 프로세스 상세 페이지 (COO 피드백 반영)
// - 1단계: 신원 확인 (신분증·자격증)
// - 2단계: 역량 검증 (비대면 면접·테스트)
// - 3단계: 현장 검증 (시범 케어 + 평점 4.5+)
// + 사용자 보험 (최대 1억 보장) + 액션캠 SOP

const STEPS = [
  {
    no: "01",
    title: "신원 확인",
    subtitle: "Identity Verification",
    color: "#FF6B35",
    items: [
      "주민등록증 + 얼굴 셀카 대조 (KYC 표준)",
      "계좌 실명 확인 (1원 인증)",
      "범죄경력회보서 제출 (동물학대 이력 필터링)",
      "반려동물 관련 자격증 (있을 시): 반려동물관리사 · 펫시터 자격 등",
    ],
    duration: "2~3일",
    pass: "신분증 일치 + 계좌 확인 + 범죄경력 클린",
  },
  {
    no: "02",
    title: "역량 검증",
    subtitle: "Competency Test",
    color: "#F59E0B",
    items: [
      "화상 면접 30분 (운영팀 1명 + 수의사 자문 1명)",
      "실전 상황 시나리오 5문항 (응급·돌발 상황 대응)",
      "반려동물 기본 지식 테스트 (영양·행동·건강)",
      "본인 경력/경험 포트폴리오 제출",
    ],
    duration: "1회, 1주일 내 완료",
    pass: "면접 종합 점수 80점 이상 + 수의사 자문 승인",
  },
  {
    no: "03",
    title: "현장 검증",
    subtitle: "Field Trial",
    color: "#10B981",
    items: [
      "운영팀 감독 하에 1시간 시범 케어 수행",
      "실제 반려동물과의 교감 관찰",
      "위생·안전 절차 준수 여부 평가",
      "시범 케어 종료 후 보호자 평점 4.5/5.0 이상",
    ],
    duration: "활동 개시 전 1회",
    pass: "평점 4.5+ + 운영팀 체크리스트 전 항목 통과",
  },
];

const BOND_ITEMS = [
  { icon: "💰", title: "배상책임보험 최대 1억원", desc: "케어 중 물건 파손·상해 발생 시 보험사가 보상" },
  { icon: "🏥", title: "반려동물 의료비 보장", desc: "시터 과실로 인한 의료비 최대 500만원까지 보장" },
  { icon: "📹", title: "액션캠 실시간 보고", desc: "샤오미 Action Cam 지급·착용 의무 · 사진/영상 자동 공유" },
  { icon: "🚨", title: "24시간 긴급 대응팀", desc: "사고 발생 시 운영팀 + 제휴 24시 동물병원 즉시 출동" },
];

const FAQ = [
  {
    q: "시터가 갑자기 못 오게 되면?",
    a: "운영팀이 같은 지역 예비 시터(대체 인력 풀)에서 30분 내 매칭합니다. 보호자에게도 즉시 통보.",
  },
  {
    q: "아이가 케어 중 다치면?",
    a: "배상책임보험이 최대 1억원까지 자동 적용됩니다. 시터는 즉시 제휴 24시 동물병원으로 이동, 보호자에게 실시간 통보.",
  },
  {
    q: "액션캠은 꼭 써야 하나요?",
    a: "네, 의무 착용입니다. 샤오미 Action 5 (약 15만원)을 시터가 구매 또는 대여. 첫 3회 매칭 수수료에서 차감 가능.",
  },
  {
    q: "평점 4.5 아래로 떨어지면?",
    a: "재교육 의무 이수. 2회 연속 4.5 미만이면 자격 정지 후 재심사.",
  },
];

export default function VerificationPage() {
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
        <section className="bg-hero-glow" style={{ padding: "clamp(56px, 10vw, 120px) 0 clamp(48px, 8vw, 96px)", position: "relative", overflow: "hidden" }}>
          <div aria-hidden="true" style={{
            position: "absolute", top: "-120px", right: "-80px",
            width: 460, height: 460,
            background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
            filter: "blur(60px)", pointerEvents: "none",
          }} />
          <div className="container-pet" style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 820, marginLeft: "auto", marginRight: "auto" }}>
            <span className="eyebrow reveal">P.E.T 안심 시스템</span>
            <h1 className="text-display-xl reveal delay-1" style={{ margin: "16px 0 18px" }}>
              <span className="text-accent-grad">3단계 검증</span>을 통과한
              <br />시터만 우리 아이를 만납니다
            </h1>
            <p className="reveal delay-2" style={{
              fontSize: "clamp(15px, 1.4vw, 18px)", color: "#4B5563",
              lineHeight: 1.65, maxWidth: 620, margin: "0 auto 28px",
            }}>
              신원 → 역량 → 현장까지 3단계 모두 통과한 사람만 시터가 됩니다.
              <br />케어 중 사고는 <b>배상책임보험 최대 1억원</b>이 보호합니다.
            </p>
            <div className="reveal delay-3" style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
              <a href="https://pf.kakao.com/_giedX/chat" target="_blank" rel="noopener noreferrer" className="btn-primary-xl">
                매칭 요청하기
              </a>
              <Link href="/partner" className="btn-secondary-xl">파트너 지원</Link>
            </div>
          </div>
        </section>

        {/* 3 STEPS */}
        <section style={{ padding: "clamp(64px, 10vw, 120px) 0", background: "#FAFAFA" }}>
          <div className="container-pet">
            <div className="reveal" style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 72px)" }}>
              <span className="eyebrow">검증 프로세스</span>
              <h2 className="text-display-lg" style={{ margin: "16px 0 12px" }}>
                신원 → 역량 → 현장
              </h2>
              <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
                세 단계 모두 통과한 사람만 P.E.T 파트너로 활동할 수 있어요.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px, 2vw, 24px)" }}>
              {STEPS.map((s, idx) => (
                <article
                  key={s.no}
                  className={`glass lift reveal delay-${idx + 1}`}
                  style={{
                    padding: "clamp(24px, 3vw, 40px)",
                    borderRadius: 20,
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    gap: "clamp(16px, 3vw, 40px)",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: "clamp(42px, 5vw, 64px)",
                      fontWeight: 900, letterSpacing: "-0.04em",
                      color: s.color, lineHeight: 1, marginBottom: 8,
                    }}>{s.no}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em" }}>
                      {s.subtitle}
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{
                      fontSize: "clamp(22px, 2vw, 28px)", fontWeight: 800,
                      color: "#1D1D1F", margin: "0 0 14px", letterSpacing: "-0.02em",
                    }}>{s.title}</h3>
                    <ul style={{ margin: "0 0 18px", paddingLeft: 18, color: "#4B5563", fontSize: 14, lineHeight: 1.85 }}>
                      {s.items.map((it) => <li key={it}>{it}</li>)}
                    </ul>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        background: `${s.color}15`, color: s.color,
                        padding: "5px 12px", borderRadius: 999,
                      }}>
                        ⏱ {s.duration}
                      </span>
                      <span style={{
                        fontSize: 12, fontWeight: 600,
                        background: "#F3F4F6", color: "#4B5563",
                        padding: "5px 12px", borderRadius: 999,
                      }}>
                        ✓ {s.pass}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 640px) {
              section article { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

        {/* 보험 + 보장 */}
        <section style={{
          padding: "clamp(64px, 10vw, 120px) 0",
          background: "#1D1D1F", color: "#fff", position: "relative", overflow: "hidden",
        }}>
          <div aria-hidden="true" style={{
            position: "absolute", bottom: "-200px", left: "-100px",
            width: 500, height: 500,
            background: "radial-gradient(circle, rgba(16,185,129,0.18) 0%, transparent 70%)",
            filter: "blur(80px)", pointerEvents: "none",
          }} />

          <div className="container-pet" style={{ position: "relative", zIndex: 1 }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: "clamp(40px, 6vw, 72px)" }}>
              <span className="eyebrow" style={{
                background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", color: "#34D399",
              }}>
                사고 제로 보장
              </span>
              <h2 className="text-display-lg" style={{ margin: "18px 0 14px", color: "#fff" }}>
                만약의 사고도 <span className="text-accent-grad">안전망</span>으로
              </h2>
              <p style={{
                fontSize: "clamp(14px, 1.3vw, 17px)", color: "rgba(255,255,255,0.65)",
                lineHeight: 1.65, maxWidth: 560, margin: "0 auto",
              }}>
                시터·보호자·반려동물 모두를 위한 4중 보호망
              </p>
            </div>

            <div className="bond-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(2, 1fr)",
              gap: "clamp(16px, 2vw, 24px)",
            }}>
              {BOND_ITEMS.map((b, idx) => (
                <div key={b.title} className={`glass-dark reveal delay-${idx + 1}`} style={{
                  padding: "clamp(22px, 2.6vw, 32px)", borderRadius: 20,
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>{b.icon}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
                    {b.title}
                  </h3>
                  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", lineHeight: 1.65, margin: 0 }}>
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 640px) {
              .bond-grid { grid-template-columns: 1fr !important; }
            }
          `}</style>
        </section>

        {/* FAQ */}
        <section style={{ padding: "clamp(56px, 8vw, 96px) 0", background: "#fff" }}>
          <div className="container-pet" style={{ maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
            <div className="reveal" style={{ textAlign: "center", marginBottom: 36 }}>
              <span className="eyebrow">자주 묻는 질문</span>
              <h2 className="text-display-md" style={{ margin: "14px 0 8px" }}>
                사고는 이렇게 <span className="text-accent-grad">예방·대응</span>합니다
              </h2>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {FAQ.map((f, idx) => (
                <details
                  key={f.q}
                  className={`reveal delay-${(idx % 5) + 1}`}
                  style={{
                    background: "#F9FAFB", border: "1px solid #E5E7EB",
                    borderRadius: 12, padding: "14px 18px",
                    cursor: "pointer",
                  }}
                >
                  <summary style={{
                    fontSize: 14, fontWeight: 700, color: "#1D1D1F",
                    listStyle: "none", cursor: "pointer",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <span>Q. {f.q}</span>
                    <span style={{ color: "#9CA3AF", fontSize: 18 }}>+</span>
                  </summary>
                  <p style={{ margin: "12px 0 0", fontSize: 13, color: "#4B5563", lineHeight: 1.7 }}>
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ⚖️ Legal 고지 */}
        <section style={{ padding: "40px 0 60px", background: "#FAFAFA" }}>
          <div className="container-pet" style={{ maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{
              background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
              padding: "18px 20px", fontSize: 12, color: "#6B7280", lineHeight: 1.75,
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", marginBottom: 8 }}>⚖️ 법적 고지</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>P.E.T는 반려동물 돌봄 <b>중개 플랫폼</b>이며, 시터는 독립 계약자입니다.</li>
                <li>AI 건강 분석은 <b>진료 전 참고 가이드</b>이며 의료적 진단·처방이 아닙니다.</li>
                <li>정확한 진단과 치료는 수의사법에 따라 <b>동물병원 방문</b>을 통해서만 가능합니다.</li>
                <li>배상책임보험은 제휴 보험사(출시 예정)의 약관에 따라 적용됩니다.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
