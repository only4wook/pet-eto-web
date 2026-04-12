import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function GuidePage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px", flex: 1 }}>
        {/* 히어로 */}
        <section style={{
          background: "linear-gradient(135deg, #FF6B35, #FB923C)", borderRadius: 16,
          padding: "32px 28px", color: "#fff", textAlign: "center", marginBottom: 28,
        }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px" }}>P.E.T 이용 가이드</h1>
          <p style={{ fontSize: 14, opacity: 0.9, margin: 0 }}>서비스 안내 · 요금표 · 파트너 정산 · 포인트 정책</p>
        </section>

        {/* 사업 개요 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "28px", marginBottom: 20, border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 12px" }}>🐾 P.E.T란?</h2>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8, margin: 0 }}>
            P.E.T(Pet Ever Total)는 반려동물 보호자의 <strong style={{ color: "#FF6B35" }}>&apos;돌봄 공백&apos;</strong>을 해결하는 긴급 컨시어지 O2O 플랫폼입니다.
            갑자기 야근이 잡히거나, 출장을 가야 할 때, 검증된 펫시터를 <strong>10분 안에</strong> 연결해드립니다.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginTop: 16 }}>
            {[
              { icon: "🛡️", title: "3단계 파트너 검증", desc: "신원조회 → 면접 → 시범케어" },
              { icon: "🤖", title: "AI 건강 분석", desc: "증상 입력 → 즉시 분석 → 병원 안내" },
              { icon: "📖", title: "펫-위키", desc: "28종 품종 정보, 질병 비용, 관리법" },
              { icon: "💬", title: "커뮤니티", desc: "질문, 정보 공유, 전문가 답변" },
            ].map((item, i) => (
              <div key={i} style={{ background: "#FAFAFA", borderRadius: 12, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 요금표 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "28px", marginBottom: 20, border: "1px solid #F3F4F6" }}>
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
                  ["🏠 기본 돌봄", "3시간", "30,000원", "방문 급식, 놀이, 배변 관리"],
                  ["🌙 야간 돌봄", "3시간", "40,000원", "20시 이후 방문"],
                  ["☀️ 1일 돌봄", "8시간", "80,000원", "장시간 외출/출장"],
                  ["🛏️ 1박 돌봄", "24시간", "120,000원", "출장/여행 시"],
                  ["🚶 산책 대행", "1시간", "15,000원", "산책만 필요할 때"],
                  ["✂️ 방문 미용", "1~2시간", "40,000원~", "품종/크기별 상이"],
                  ["🚗 펫택시", "5km 기본", "20,000원", "+5km당 5,000원 추가"],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{
                        padding: "10px 14px", color: j === 2 ? "#FF6B35" : "#374151",
                        fontWeight: j === 2 ? 700 : 400,
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10 }}>
            * 요금은 지역, 반려동물 크기/종류에 따라 달라질 수 있습니다.
            포인트로 최대 10% 할인 가능!
          </p>
        </section>

        {/* 파트너 정산 안내 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "28px", marginBottom: 20, border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 12px" }}>💼 파트너 정산 안내</h2>
          <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1F2937", margin: "0 0 12px" }}>수익 배분 구조</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                { label: "파트너 수익", value: "75%", color: "#059669", desc: "케어 서비스 대가" },
                { label: "P.E.T 수수료", value: "21.5%", color: "#FF6B35", desc: "플랫폼 중개 수수료" },
                { label: "PG 수수료", value: "3.5%", color: "#6B7280", desc: "결제 시스템 비용" },
              ].map((item, i) => (
                <div key={i} style={{ flex: 1, minWidth: 140, textAlign: "center", padding: "12px", background: "#fff", borderRadius: 10 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: item.color }}>{item.value}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#374151" }}>{item.label}</div>
                  <div style={{ fontSize: 11, color: "#9CA3AF" }}>{item.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 정산 예시 */}
          <div style={{ background: "#FFF7ED", borderRadius: 12, padding: 20, marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#92400E", margin: "0 0 10px" }}>💡 정산 예시 (기본 돌봄 30,000원)</h3>
            <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 2 }}>
              고객 결제: <strong style={{ color: "#1F2937" }}>30,000원</strong><br />
              → PG 수수료 (3.5%): -1,050원<br />
              → P.E.T 수수료 (21.5%): -6,450원<br />
              → 파트너 지급 대상: 22,500원<br />
              → 원천징수 (3.3%): -743원<br />
              → <strong style={{ color: "#059669", fontSize: 15 }}>파트너 실수령: 21,757원</strong>
            </div>
          </div>

          {/* 세금 안내 */}
          <div style={{ background: "#F0F9FF", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#0369A1", margin: "0 0 10px" }}>📋 파트너 세금 안내</h3>
            <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.8 }}>
              <p style={{ margin: "0 0 8px" }}>1. 파트너 수익은 <strong>사업소득(프리랜서)</strong>으로 분류됩니다.</p>
              <p style={{ margin: "0 0 8px" }}>2. P.E.T에서 정산 시 <strong>3.3% 원천징수</strong> 후 지급합니다.</p>
              <p style={{ margin: "0 0 8px" }}>3. 연간 수입이 2,400만원 이하면 단순경비율로 종합소득세 신고합니다.</p>
              <p style={{ margin: "0 0 8px" }}>4. <strong>5월 종합소득세 신고</strong> 시 원천징수된 세금을 정산(환급)받을 수 있습니다.</p>
              <p style={{ margin: "0 0 0", background: "#DBEAFE", padding: "8px 12px", borderRadius: 8 }}>
                예) 월 100만원 수입 시 → 원천징수 33,000원/월 → 실수령 967,000원/월
              </p>
            </div>
          </div>
        </section>

        {/* 포인트 정책 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "28px", marginBottom: 20, border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 16px" }}>⭐ 포인트 정책</h2>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", margin: "0 0 10px" }}>적립</h3>
          <div style={{ overflowX: "auto", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#FFF7ED" }}>
                  {["행동", "적립 포인트", "비고"].map((h) => (
                    <th key={h} style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, color: "#92400E" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["서비스 이용", "결제액의 3%", "1만원 이용 → 300P"],
                  ["회원가입", "+100P", "최초 1회"],
                  ["게시글 작성", "+10P", ""],
                  ["후기 작성 (텍스트)", "+500P", "서비스 이용 후"],
                  ["후기 작성 (사진 포함)", "+1,000P", "서비스 이용 후"],
                  ["친구 초대", "+3,000P", "추천인/피추천인 모두"],
                  ["일일 출석", "+3P", "하루 1회"],
                ].map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                    {row.map((cell, j) => (
                      <td key={j} style={{ padding: "8px 12px", color: j === 1 ? "#FF6B35" : "#374151", fontWeight: j === 1 ? 700 : 400 }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#374151", margin: "0 0 10px" }}>사용</h3>
          <div style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.8 }}>
            <p style={{ margin: "0 0 6px" }}>• 서비스 결제 시 <strong>결제액의 최대 10%</strong>까지 포인트 할인 가능</p>
            <p style={{ margin: "0 0 6px" }}>• 1P = 1원 (최소 1,000P 이상부터 사용)</p>
            <p style={{ margin: "0 0 6px" }}>• 유효기간: 적립일로부터 1년</p>
            <p style={{ margin: 0 }}>• 현금 전환 불가 (서비스 할인 전용)</p>
          </div>
        </section>

        {/* CTA */}
        <section style={{
          background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)",
          borderRadius: 16, padding: "28px", textAlign: "center",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 12px" }}>궁금한 점이 있으신가요?</h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <a href="https://pf.kakao.com/_giedX/chat" target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: "#FEE500",
              color: "#3C1E1E", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}>💬 카카오톡 문의</a>
            <Link href="/partner" style={{
              display: "inline-flex", alignItems: "center", gap: 8, background: "#FF6B35",
              color: "#fff", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: "none",
            }}>🤝 파트너 신청하기</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
