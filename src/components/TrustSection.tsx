export default function TrustSection() {
  const stats = [
    { value: "3단계", label: "파트너 신원검증", icon: "🛡️" },
    { value: "1급", label: "반려동물관리사 대표", icon: "🎓" },
    { value: "한양대", label: "창업동아리 출신", icon: "🏫" },
    { value: "카톡", label: "실시간 1:1 매칭", icon: "💬" },
  ];

  const steps = [
    { step: "01", title: "카톡 상담", desc: "반려동물 정보와 상황을 알려주세요", icon: "💬" },
    { step: "02", title: "맞춤 매칭", desc: "검증된 파트너를 직접 연결해드려요", icon: "🔗" },
    { step: "03", title: "케어 진행", desc: "실시간 사진·영상으로 상황 공유", icon: "📸" },
    { step: "04", title: "안심 정산", desc: "케어 완료 확인 후 결제", icon: "✅" },
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
