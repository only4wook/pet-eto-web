"use client";

const TARGETS = [
  {
    title: "출장·야근이 잦은 보호자",
    pain: "갑자기 집을 비워야 할 때 맡길 곳이 없어 불안해요.",
    solution: "10분 내 매칭 시작, 실시간 보고로 케어 진행을 바로 확인합니다.",
  },
  {
    title: "응급/이상 증상 초보 보호자",
    pain: "이게 병원 갈 정도인지 몰라서 시간을 놓치기 쉬워요.",
    solution: "AI가 긴급도(긴급·주의·관찰·정상)를 먼저 분류하고, 필요 시 전문가 연결까지 이어줍니다.",
  },
  {
    title: "신뢰 근거가 필요한 보호자",
    pain: "누가 답변하는지, 누가 돌보는지 불명확하면 이용하기 어려워요.",
    solution: "실명 기반 전문가 답변, 3단계 검증 시터, 사고 보장(최대 1억) 안내로 신뢰를 보강합니다.",
  },
];

export default function TargetAudienceSection() {
  return (
    <section style={{ padding: "clamp(44px, 6vw, 72px) 0", background: "#FFFDF9" }}>
      <div className="container-pet">
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <span className="eyebrow">우리가 집중하는 보호자</span>
          <h2 className="text-display-md" style={{ margin: "12px 0 8px" }}>
            모두를 위한 서비스가 아니라,
            <br />
            <span className="text-accent-grad">지금 당장 도움이 필요한 보호자</span>를 위한 서비스
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }} className="target-grid">
          {TARGETS.map((t) => (
            <article key={t.title} style={{ background: "#fff", border: "1px solid #F3F4F6", borderRadius: 14, padding: 16 }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 800, color: "#1D1D1F" }}>{t.title}</h3>
              <p style={{ margin: "0 0 8px", fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>문제: {t.pain}</p>
              <p style={{ margin: 0, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>해결: {t.solution}</p>
            </article>
          ))}
        </div>
      </div>
      <style jsx>{`
        @media (max-width: 900px) {
          .target-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}
