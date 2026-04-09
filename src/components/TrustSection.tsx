export default function TrustSection() {
  const stats = [
    { value: "100%", label: "에스크로 안전결제", icon: "🛡️" },
    { value: "4.9점", label: "평균 만족도", icon: "⭐" },
    { value: "자문단", label: "수의사 연계", icon: "👨‍⚕️" },
    { value: "15분", label: "평균 매칭 시간", icon: "⚡" },
  ];

  const steps = [
    { step: "01", title: "요청 등록", desc: "날짜·지역·반려동물 정보 입력", icon: "📝" },
    { step: "02", title: "케어러 매칭", desc: "신원인증 완료된 케어러 연결", icon: "🔗" },
    { step: "03", title: "케어 진행", desc: "실시간 사진 보고 + 수의사 대기", icon: "📸" },
    { step: "04", title: "안전 정산", desc: "에스크로로 케어 완료 후 결제", icon: "🛡️" },
  ];

  return (
    <section style={{
      background: "#fff", borderRadius: 16, padding: "36px 28px",
      marginBottom: 24, border: "1px solid #F3F4F6",
    }}>
      {/* 통계 */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16, marginBottom: 36,
      }} className="trust-grid">
        {stats.map((s) => (
          <div key={s.label} style={{
            textAlign: "center", padding: "20px 12px",
            background: "#FFF7ED", borderRadius: 16,
          }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FF6B35" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 프로세스 */}
      <h2 style={{
        fontSize: 20, fontWeight: 800, textAlign: "center",
        color: "#1F2937", margin: "0 0 24px",
      }}>
        이용 방법
      </h2>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16,
      }} className="trust-grid">
        {steps.map((s) => (
          <div key={s.step} style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            textAlign: "center",
          }}>
            <div style={{
              width: 56, height: 56, background: "#FF6B35", borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, marginBottom: 12, boxShadow: "0 4px 12px rgba(255,107,53,0.25)",
            }}>
              {s.icon}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#FB923C", marginBottom: 4 }}>
              STEP {s.step}
            </span>
            <h3 style={{ fontWeight: 700, color: "#1F2937", margin: "0 0 4px", fontSize: 14 }}>{s.title}</h3>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
