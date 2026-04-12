import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function AboutPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1 }}>
        {/* 히어로 */}
        <section style={{
          background: "linear-gradient(135deg, #FF6B35, #FB923C)", borderRadius: 16,
          padding: "40px 28px", color: "#fff", textAlign: "center", marginBottom: 32,
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 8px" }}>P.E.T 펫에토 팀</h1>
          <p style={{ fontSize: 15, opacity: 0.9, margin: 0 }}>Pet Ever Total — 반려동물 생애주기 맞춤형 O2O 플랫폼</p>
        </section>

        {/* 미션 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 24, border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", margin: "0 0 12px" }}>우리가 만드는 이유</h2>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.8, margin: 0 }}>
            반려동물 인구 1,500만 시대. 하지만 갑자기 야근이 잡히거나, 출장을 가야 할 때, 반려동물을 안전하게 맡길 곳을 찾는 건 여전히 어렵습니다.
            특히 1~2인 가구 반려인은 긴급 상황에서 믿을 수 있는 돌봄 서비스를 찾기 위해 불안한 시간을 보냅니다.
            <br /><br />
            P.E.T는 이 돌봄 공백을 해결하기 위해 만들어졌습니다. 검증된 파트너와의 빠른 매칭, 투명한 비용 안내, 수의사 자문 연계까지
            반려인이 안심하고 맡길 수 있는 환경을 만들어갑니다.
          </p>
        </section>

        {/* 팀 소개 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 24, border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", margin: "0 0 20px" }}>대표 소개</h2>
          <div style={{
            background: "#FAFAFA", borderRadius: 16, padding: "28px",
            border: "1px solid #F0F0F0", display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap",
          }}>
            <div style={{
              width: 80, height: 80, borderRadius: "50%", background: "#FF6B35",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, color: "#fff", fontWeight: 800, flexShrink: 0,
            }}>권</div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#1F2937" }}>권대욱</div>
              <div style={{ fontSize: 14, color: "#FF6B35", fontWeight: 600, marginTop: 2 }}>대표 · 기획 · 운영</div>
              <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>한양대학교 대학원 창업학과 재학</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 10 }}>
                {["반려동물관리사 1급 (취득 중)", "NEOs 1기 지원", "펫에토 창업"].map((badge, j) => (
                  <span key={j} style={{
                    fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 10,
                    background: "#FEF3C7", color: "#D97706",
                  }}>{badge}</span>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "12px 0 0", lineHeight: 1.7 }}>
                반려동물을 키우면서 느낀 긴급 돌봄의 불편함을 직접 해결하기 위해 P.E.T를 시작했습니다.
                파트너 검증부터 고객 상담, 서비스 기획까지 모든 것을 직접 담당하고 있습니다.
                반려동물관리사 자격을 취득하며 전문성도 갖춰가고 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* 파트너 검증 프로세스 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 24, border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", margin: "0 0 20px" }}>P.E.T 파트너 3단계 검증</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px", lineHeight: 1.6 }}>
            우리 아이를 맡기는 서비스인 만큼, 파트너 선정에 가장 엄격한 기준을 적용합니다.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
            {[
              { step: "1단계", title: "신원 조회", desc: "신분증 확인, 범죄이력 조회, 반려동물 관련 자격증 확인", icon: "🔍" },
              { step: "2단계", title: "대면 면접", desc: "대표가 직접 만나 반려동물 케어 역량과 인성을 평가", icon: "🤝" },
              { step: "3단계", title: "시범 케어", desc: "실제 케어 환경에서 시범 돌봄 진행 후 최종 승인", icon: "✅" },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: "#FF6B35",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 24, margin: "0 auto 10px", boxShadow: "0 4px 12px rgba(255,107,53,0.2)",
                }}>{item.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#FB923C", marginBottom: 4 }}>{item.step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", marginBottom: 4 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 소속 / 연혁 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 24, border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", margin: "0 0 16px" }}>소속 및 연혁</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { date: "2026.04", event: "P.E.T 웹 서비스 MVP 개발 완료 (pet-eto.vercel.app)" },
              { date: "2026.04", event: "NEOs 1기 지원" },
              { date: "2026", event: "한양대학교 창업동아리 '펫에토' 결성 (4인)" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{
                  flexShrink: 0, fontSize: 13, fontWeight: 700, color: "#FF6B35",
                  minWidth: 70,
                }}>{item.date}</span>
                <span style={{ fontSize: 14, color: "#374151" }}>{item.event}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 자문위원 / 전문가 네트워크 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "32px 28px", marginBottom: 24, border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", margin: "0 0 8px" }}>전문가 자문단 & 파트너 네트워크</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px", lineHeight: 1.6 }}>
            P.E.T는 수의학·행동학 전문가의 감수를 받아 서비스 품질을 보장합니다.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
            {[
              { icon: "🩺", title: "수의학 자문", status: "모집 중", desc: "AI 건강 분석 감수, 응급 사례 자문", color: "#059669" },
              { icon: "🐾", title: "행동학 자문", status: "모집 중", desc: "행동 교정 콘텐츠, 훈련 가이드 감수", color: "#2563EB" },
              { icon: "🏥", title: "제휴 동물병원", status: "제휴 준비 중", desc: "24시 응급 이송, 할인 진료 연계", color: "#DC2626" },
              { icon: "🎓", title: "대학 산학협력", status: "협의 중", desc: "수의학과·동물보건학과 인턴십 연계", color: "#7C3AED" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "#FAFAFA", borderRadius: 12, padding: "18px",
                border: "1px solid #F0F0F0", textAlign: "center",
              }}>
                <div style={{ fontSize: 32, marginBottom: 6 }}>{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>{item.title}</div>
                <span style={{
                  display: "inline-block", fontSize: 11, fontWeight: 600, padding: "2px 10px",
                  borderRadius: 10, marginTop: 4, marginBottom: 6,
                  background: "#FEF3C7", color: "#D97706",
                }}>{item.status}</span>
                <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{item.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#6B7280", textAlign: "center", margin: 0 }}>
            전문가 자문·제휴에 관심 있으시다면 📧 peteto2026@gmail.com 또는{" "}
            <a href="https://pf.kakao.com/_giedX/chat" target="_blank" rel="noopener noreferrer" style={{ color: "#FF6B35", fontWeight: 600 }}>
              카카오톡 채널
            </a>로 연락주세요.
          </p>
        </section>

        {/* 연락처 */}
        <section style={{
          background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)",
          borderRadius: 16, padding: "28px", textAlign: "center",
        }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 8px" }}>문의하기</h2>
          <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px" }}>
            파트너 제휴, 투자, 언론 문의 등 무엇이든 편하게 연락주세요.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", fontSize: 14 }}>
            <span style={{ color: "#374151" }}>📧 peteto2026@gmail.com</span>
            <span style={{ color: "#374151" }}>📍 경기도 고양시</span>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
