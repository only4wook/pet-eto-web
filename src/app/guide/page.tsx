"use client";
import { useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function GuidePage() {
  const [tab, setTab] = useState<"customer" | "partner">("customer");

  return (
    <>
      <Header />
      <main style={{ maxWidth: 840, margin: "0 auto", padding: "24px 16px 44px", flex: 1, width: "100%" }}>
        {/* 히어로 */}
        <section style={{
          background: "linear-gradient(135deg, #FF6B35, #FB923C)", borderRadius: 20,
          padding: "36px 28px", color: "#fff", textAlign: "center", marginBottom: 22,
          boxShadow: "0 8px 24px rgba(255,107,53,0.22)",
        }}>
          <h1 className="headline-balance" style={{ fontSize: "clamp(22px, 3vw, 28px)", fontWeight: 900, margin: "0 0 8px", letterSpacing: "-0.03em" }}>
            P.E.T 이용 가이드
          </h1>
          <p className="readable-kor" style={{ fontSize: 14, opacity: 0.95, margin: 0 }}>
            안심하고 맡기세요.<br />모든 과정이 투명합니다.
          </p>
        </section>

        {/* 고객/파트너 탭 전환 */}
        <div style={{ display: "flex", gap: 0, marginBottom: 20, borderRadius: 14, overflow: "hidden", border: "1px solid #E5E7EB", background: "#fff" }}>
          <button onClick={() => setTab("customer")} style={{
            flex: 1, padding: "14px 12px", fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none",
            background: tab === "customer" ? "#FF6B35" : "#fff",
            color: tab === "customer" ? "#fff" : "#6B7280",
            fontFamily: "inherit",
          }}>🐾 고객 이용 안내</button>
          <button onClick={() => setTab("partner")} style={{
            flex: 1, padding: "14px 12px", fontSize: 15, fontWeight: 700, cursor: "pointer", border: "none",
            background: tab === "partner" ? "#FF6B35" : "#fff",
            color: tab === "partner" ? "#fff" : "#6B7280",
            fontFamily: "inherit",
          }}>🤝 파트너 안내</button>
        </div>

        {tab === "customer" ? <CustomerGuide /> : <PartnerGuide />}
      </main>
      <Footer />
    </>
  );
}

// ===== 고객용 가이드 =====
function CustomerGuide() {
  return (
    <>
      {/* 안전/안심 안내 (최상단 — 가장 중요) */}
      <section style={{ background: "#fff", borderRadius: 16, padding: "clamp(20px, 3vw, 28px)", marginBottom: 20, border: "2px solid #059669" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#059669", margin: "0 0 16px" }}>🛡️ 안심하고 맡기세요</h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 20 }}>
          {[
            { icon: "🔍", title: "3단계 파트너 검증", desc: <>신원조회 → 대면/화상 면접 →<br />시범 케어 통과한 분만 활동합니다.</> },
            { icon: "🔒", title: "현관문 출입 안심", desc: <>일회용 비밀번호 설정 안내,<br />케어 종료 후 비밀번호 변경 가이드를 제공합니다.</> },
            { icon: "📸", title: "실시간 사진 보고", desc: <>케어 중 사진·영상을<br />카카오톡으로 실시간 전송합니다.</> },
            { icon: "🛡️", title: "사고 발생 시 보상", desc: <>케어 중 발생한 사고는 P.E.T가 중재하며,<br />배상책임보험 가입을 추진 중입니다.</> },
          ].map((item, i) => (
            <div key={i} style={{ background: "#ECFDF5", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 26, marginBottom: 8 }}>{item.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#065F46", marginBottom: 6, letterSpacing: "-0.01em" }}>{item.title}</div>
              <div style={{
                fontSize: 12, color: "#047857", lineHeight: 1.75,
                wordBreak: "keep-all", overflowWrap: "break-word",
              }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* 도어락 출입 가이드 */}
        <div style={{ background: "#F0FDF4", borderRadius: 12, padding: 18 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#065F46", margin: "0 0 12px", letterSpacing: "-0.01em" }}>
            🏠 현관문 출입은 이렇게 진행됩니다
          </h3>
          <ol style={{
            margin: 0, paddingLeft: 20,
            fontSize: 13, color: "#047857", lineHeight: 2,
            wordBreak: "keep-all", overflowWrap: "break-word",
          }}>
            <li>매칭 확정 시 <strong>일회용 비밀번호</strong>를 설정해주세요<br />(도어락 설정 가이드 제공)</li>
            <li>파트너에게 일회용 비밀번호만 전달<br />(기존 비밀번호 노출 X)</li>
            <li>케어 완료 후 <strong>비밀번호 즉시 변경</strong><br />(가이드 안내)</li>
            <li>파트너는 P.E.T 규정에 따라 비밀번호 즉시 삭제 의무</li>
          </ol>
        </div>
      </section>

      {/* 이용 방법 */}
      <section style={{ background: "#fff", borderRadius: 16, padding: "clamp(20px, 3vw, 28px)", marginBottom: 20, border: "1px solid #F3F4F6" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 16px" }}>📱 이용 방법</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {[
            { step: "1", icon: "💬", title: "카톡 상담", desc: "카카오톡 채널로 상황을 알려주세요" },
            { step: "2", icon: "🔗", title: "파트너 매칭", desc: "검증된 파트너를 연결해드려요" },
            { step: "3", icon: "📸", title: "실시간 보고", desc: "사진·영상으로 상황을 공유해요" },
            { step: "4", icon: "✅", title: "완료·결제", desc: "케어 확인 후 안전하게 결제" },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: "center", padding: "4px" }}>
              <div style={{
                width: 52, height: 52, borderRadius: 16, background: "#FF6B35",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, margin: "0 auto 10px",
              }}>{s.icon}</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#FB923C", letterSpacing: "0.06em" }}>STEP {s.step}</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#1F2937", marginTop: 2 }}>{s.title}</div>
              <div style={{
                fontSize: 12, color: "#6B7280", marginTop: 4, lineHeight: 1.6,
                wordBreak: "keep-all",
              }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 요금표 */}
      <section style={{ background: "#fff", borderRadius: 16, padding: "clamp(20px, 3vw, 28px)", marginBottom: 20, border: "1px solid #F3F4F6" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 16px" }}>💰 서비스 요금표</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#FFF7ED" }}>
                {["서비스", "시간", "요금", "비고"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700, color: "#92400E", fontSize: 13 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["🚨 긴급 방문", "1시간", "30,000원", "급식, 산책, 배변 관리"],
                ["🚶 산책 대행", "1시간", "20,000원", "산책만 필요할 때"],
                ["🏠 반일 케어", "3시간", "60,000원", "반나절 외출/야근"],
                ["☀️ 1일 케어", "8시간", "120,000원", "장시간 외출/출장"],
                ["🛏️ 1박 케어", "24시간", "150,000원", "출장/여행 시"],
                ["✂️ 방문 미용", "1~2시간", "40,000원~", "품종/크기별 상이"],
                ["🚗 펫택시", "5km 기본", "20,000원", "+5km당 5,000원 추가"],
              ].map((row, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                  {row.map((cell, j) => (
                    <td key={j} style={{ padding: "10px 14px", color: j === 2 ? "#FF6B35" : "#374151", fontWeight: j === 2 ? 700 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10 }}>
          * 지역, 반려동물 크기/종류에 따라 달라질 수 있습니다. 포인트로 최대 10% 할인!
        </p>
      </section>

      {/* 포인트 */}
      <section style={{ background: "#fff", borderRadius: 16, padding: "clamp(20px, 3vw, 28px)", marginBottom: 20, border: "1px solid #F3F4F6" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 12px" }}>⭐ 포인트 혜택</h2>
        <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.95, wordBreak: "keep-all" }}>
          <p style={{ margin: "0 0 10px" }}>• 서비스 이용 시 <strong style={{ color: "#FF6B35" }}>결제액의 3%</strong> 자동 적립</p>
          <p style={{ margin: "0 0 10px" }}>• 후기 작성 시 <strong style={{ color: "#FF6B35" }}>+500~1,000P</strong><br/>&nbsp;&nbsp;(사진 포함 시 더 많이!)</p>
          <p style={{ margin: "0 0 10px" }}>• 친구 초대 시 <strong style={{ color: "#FF6B35" }}>+3,000P</strong><br/>&nbsp;&nbsp;(추천인·피추천인 모두)</p>
          <p style={{ margin: 0 }}>• 결제 시 최대 <strong>10% 포인트 할인</strong> 가능 (1P = 1원)</p>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)", borderRadius: 16, padding: "clamp(20px, 3vw, 28px)", textAlign: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 12px" }}>지금 바로 시작하세요!</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
          <a href="https://pf.kakao.com/_giedX/chat" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "#FEE500",
            color: "#3C1E1E", padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none",
          }}>💬 카카오톡으로 매칭 요청</a>
        </div>
        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 8 }}>선착순 10명 무료 체험 진행 중!</p>
      </section>
    </>
  );
}

// ===== 파트너용 가이드 =====
function PartnerGuide() {
  return (
    <>
      {/* 수익 안내 */}
      <section style={{ background: "#fff", borderRadius: 16, padding: "clamp(20px, 3vw, 28px)", marginBottom: 20, border: "1px solid #F3F4F6" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 16px" }}>💰 파트너 수익 안내</h2>
        <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { label: "파트너 수익", value: "75%", color: "#059669", desc: "케어 대가" },
              { label: "P.E.T 수수료", value: "21.5%", color: "#FF6B35", desc: "중개 수수료" },
              { label: "PG 수수료", value: "3.5%", color: "#6B7280", desc: "결제 비용" },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, minWidth: 140, textAlign: "center", padding: 12, background: "#fff", borderRadius: 10 }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.value}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 정산 예시 */}
        <div style={{ background: "#FFF7ED", borderRadius: 12, padding: 20, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: "#92400E", margin: "0 0 12px", letterSpacing: "-0.01em" }}>
            💡 정산 예시<br />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#B45309" }}>(긴급 방문 1시간 30,000원 기준)</span>
          </h3>
          <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 2, wordBreak: "keep-all" }}>
            고객 결제: <strong style={{ color: "#1F2937" }}>30,000원</strong><br />
            → PG 수수료 (3.5%): −1,050원<br />
            → P.E.T 수수료 (21.5%): −6,450원<br />
            → 파트너 지급 대상: 22,500원<br />
            → 원천징수 (3.3%): −743원<br />
            → <strong style={{ color: "#059669", fontSize: 15 }}>파트너 실수령: 21,757원</strong><br />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>(시급 약 21,700원)</span>
          </div>
        </div>
      </section>

      {/* 세금 안내 */}
      <section style={{ background: "#fff", borderRadius: 16, padding: "clamp(20px, 3vw, 28px)", marginBottom: 20, border: "1px solid #F3F4F6" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 12px" }}>📋 세금 안내</h2>
        <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.95, wordBreak: "keep-all" }}>
          <p style={{ margin: "0 0 10px" }}>1. 파트너 수익은 <strong>사업소득(프리랜서)</strong>으로 분류됩니다.</p>
          <p style={{ margin: "0 0 10px" }}>2. P.E.T에서 정산 시 <strong>3.3% 원천징수</strong> 후 지급합니다.</p>
          <p style={{ margin: "0 0 10px" }}>3. 연간 수입이 2,400만원 이하면<br />&nbsp;&nbsp;&nbsp;단순경비율로 종합소득세 신고합니다.</p>
          <p style={{ margin: "0 0 12px" }}>4. <strong>5월 종합소득세 신고</strong> 시<br />&nbsp;&nbsp;&nbsp;원천징수된 세금을 정산(환급)받을 수 있습니다.</p>
          <p style={{
            margin: 0, background: "#DBEAFE", padding: "10px 14px",
            borderRadius: 10, color: "#1E40AF", lineHeight: 1.7,
          }}>
            <strong>예시</strong>) 월 100만원 수입 시<br />
            → 원천징수 33,000원/월<br />
            → 실수령 967,000원/월
          </p>
        </div>
      </section>

      {/* 파트너 신청 CTA */}
      <section style={{ background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)", borderRadius: 16, padding: "clamp(20px, 3vw, 28px)", textAlign: "center" }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 12px" }}>파트너로 함께하세요!</h2>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 16 }}>시급 21,000원+, 자유로운 시간 선택, 보험 가입 지원</p>
        <Link href="/partner" style={{
          display: "inline-flex", alignItems: "center", gap: 8, background: "#FF6B35",
          color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none",
        }}>🤝 파트너 신청하기</Link>
      </section>
    </>
  );
}
