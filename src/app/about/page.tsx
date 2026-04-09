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
          <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1F2937", margin: "0 0 20px" }}>팀 소개</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {[
              {
                name: "권대욱",
                role: "대표 / 기획",
                detail: "한양대학교 대학원 재학",
                badges: ["반려동물관리사 1급 (취득 중)", "NEOs 1기"],
                desc: "펫에토의 비전을 설계하고, 파트너 검증과 고객 상담을 직접 담당합니다.",
              },
              {
                name: "팀원 A",
                role: "마케팅 / 운영",
                detail: "한양대학교",
                badges: [],
                desc: "SNS 마케팅과 커뮤니티 운영을 담당합니다.",
              },
              {
                name: "팀원 B",
                role: "디자인 / UX",
                detail: "한양대학교",
                badges: [],
                desc: "사용자 경험 설계와 브랜드 디자인을 담당합니다.",
              },
              {
                name: "팀원 C",
                role: "사업개발",
                detail: "한양대학교",
                badges: [],
                desc: "파트너십과 사업 전략을 담당합니다.",
              },
            ].map((member, i) => (
              <div key={i} style={{
                background: "#FAFAFA", borderRadius: 12, padding: "20px",
                border: "1px solid #F0F0F0",
              }}>
                <div style={{
                  width: 56, height: 56, borderRadius: "50%",
                  background: i === 0 ? "#FF6B35" : "#E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, color: "#fff", fontWeight: 800, marginBottom: 12,
                }}>
                  {member.name.charAt(0)}
                </div>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#1F2937" }}>{member.name}</div>
                <div style={{ fontSize: 13, color: "#FF6B35", fontWeight: 600, marginTop: 2 }}>{member.role}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{member.detail}</div>
                {member.badges.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                    {member.badges.map((badge, j) => (
                      <span key={j} style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 8,
                        background: "#FEF3C7", color: "#D97706",
                      }}>{badge}</span>
                    ))}
                  </div>
                )}
                <p style={{ fontSize: 12, color: "#6B7280", margin: "8px 0 0", lineHeight: 1.5 }}>{member.desc}</p>
              </div>
            ))}
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
