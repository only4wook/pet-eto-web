export default function TrustSection() {
  const stats = [
    { value: "3단계", label: "파트너 검증", icon: "🛡️" },
    { value: "AI", label: "건강 분석", icon: "🤖" },
    { value: "실시간", label: "사진 보고", icon: "📸" },
    { value: "안전", label: "결제 보호", icon: "🔒" },
  ];

  const steps = [
    { step: "01", title: "상담", desc: "카톡으로 상황을 알려주세요", icon: "💬" },
    { step: "02", title: "매칭", desc: "검증된 파트너를 연결해드려요", icon: "🔗" },
    { step: "03", title: "케어", desc: "실시간으로 상황을 공유해요", icon: "📸" },
    { step: "04", title: "완료", desc: "확인 후 안전하게 결제", icon: "✅" },
  ];

  return (
    <section style={{
      background: "#fff", borderRadius: 20, padding: "32px 28px",
      marginBottom: 24, border: "1px solid #E5E7EB",
    }}>
      {/* 통계 */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12, marginBottom: 32,
      }} className="trust-grid">
        {stats.map((s) => (
          <div key={s.label} style={{
            textAlign: "center", padding: "20px 12px",
            background: "#F9FAFB", borderRadius: 16,
          }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{s.icon}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#1D1D1F", letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* 프로세스 */}
      <h2 style={{
        fontSize: 18, fontWeight: 800, textAlign: "center",
        color: "#1D1D1F", margin: "0 0 20px", letterSpacing: "-0.02em",
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
              width: 52, height: 52, background: "#1D1D1F", borderRadius: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, marginBottom: 10,
            }}>
              {s.icon}
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", marginBottom: 4, letterSpacing: "0.05em" }}>
              STEP {s.step}
            </span>
            <h3 style={{ fontWeight: 700, color: "#1D1D1F", margin: "0 0 2px", fontSize: 15 }}>{s.title}</h3>
            <p style={{ fontSize: 12, color: "#6B7280", margin: 0, lineHeight: 1.5 }}>{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
