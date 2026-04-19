import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function IRPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 920, margin: "0 auto", padding: "20px 16px", flex: 1 }}>
        <section style={{
          background: "linear-gradient(135deg, #1F2937, #111827)",
          color: "#fff",
          borderRadius: 16,
          padding: "34px 28px",
          marginBottom: 22,
        }}>
          <h1 style={{ margin: "0 0 8px", fontSize: 30, fontWeight: 900 }}>P.E.T 투자·IR 요약</h1>
          <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
            반려동물 긴급 상황에서 AI 분류부터 전문가 연결, 케어 매칭까지 한 번에 제공하는
            P.E.T의 핵심 전략을 요약한 페이지입니다.
          </p>
        </section>

        <section style={{ background: "#fff", border: "1px solid #F3F4F6", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#1F2937" }}>핵심 문제와 해결</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#4B5563", lineHeight: 1.8, fontSize: 14 }}>
            <li>보호자는 응급 여부를 즉시 판단하기 어렵고 정보가 파편화되어 있습니다.</li>
            <li>P.E.T는 AI 초기 분류(긴급/주의/관찰/정상) 후 전문가 답변과 케어 매칭까지 연결합니다.</li>
            <li>신뢰 장치(3단계 검증, 실시간 보고, 사고 보장 안내)로 결제/이용 장벽을 낮춥니다.</li>
          </ul>
        </section>

        <section style={{ background: "#fff", border: "1px solid #F3F4F6", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#1F2937" }}>타겟 고객</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#4B5563", lineHeight: 1.8, fontSize: 14 }}>
            <li>출장·야근으로 돌봄 공백이 발생하는 보호자</li>
            <li>응급 판단이 어려운 초보 보호자</li>
            <li>신뢰 근거가 없으면 결제하지 않는 신중형 보호자</li>
          </ul>
        </section>

        <section style={{ background: "#fff", border: "1px solid #F3F4F6", borderRadius: 16, padding: 24, marginBottom: 16 }}>
          <h2 style={{ margin: "0 0 10px", fontSize: 20, fontWeight: 800, color: "#1F2937" }}>비즈니스 모델</h2>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#4B5563", lineHeight: 1.8, fontSize: 14 }}>
            <li>케어 매칭 수수료</li>
            <li>전문가/병원 제휴 리드 수익</li>
            <li>프리미엄 멤버십 및 보험 연계 확장</li>
          </ul>
        </section>

        <section style={{ background: "#FFF7ED", border: "1px solid #FED7AA", borderRadius: 16, padding: 24 }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 800, color: "#9A3412" }}>자료 요청 및 문의</h2>
          <p style={{ margin: "0 0 12px", color: "#7C2D12", lineHeight: 1.7, fontSize: 14 }}>
            상세 IR Deck(수치 포함 버전)은 개별 요청 시 공유드립니다.
          </p>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", color: "#7C2D12", fontWeight: 700 }}>
            <span>dnlsdpa123@nate.com</span>
            <a href="https://pf.kakao.com/_giedX/chat" target="_blank" rel="noopener noreferrer" style={{ color: "#C2410C" }}>
              카카오톡 채널 문의
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
