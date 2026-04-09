"use client";
import { useState } from "react";

export default function HeroSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    // 구글폼으로 연결 (기존 CTA 유지하되, 인라인 UX 제공)
    window.open(`https://forms.gle/e5cY46BRkambEjE19`, "_blank");
    setSubmitted(true);
  }

  return (
    <section style={{
      position: "relative", overflow: "hidden",
      background: "linear-gradient(135deg, #FFF7ED, #FEF3C7, #FFFBEB)",
      borderRadius: 16, marginBottom: 24,
    }}>
      {/* 배경 장식 */}
      <div style={{
        position: "absolute", top: -80, right: -80, width: 300, height: 300,
        background: "rgba(255,107,53,0.08)", borderRadius: "50%", filter: "blur(60px)",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60, width: 250, height: 250,
        background: "rgba(245,158,11,0.08)", borderRadius: "50%", filter: "blur(60px)",
      }} />

      <div style={{
        position: "relative", maxWidth: 1100, margin: "0 auto",
        padding: "40px 28px", display: "flex", alignItems: "center", gap: 40,
      }} className="hero-flex">
        {/* 텍스트 영역 */}
        <div style={{ flex: 1 }}>
          <span style={{
            display: "inline-block", background: "#FFF7ED", border: "1px solid #FDBA74",
            color: "#C2410C", fontSize: 13, fontWeight: 700, padding: "4px 14px",
            borderRadius: 20, marginBottom: 14,
          }}>
            반려동물 긴급케어 플랫폼
          </span>

          <h1 style={{
            fontSize: 28, fontWeight: 900, color: "#1F2937", lineHeight: 1.45,
            margin: "0 0 12px", letterSpacing: "-0.5px",
          }} className="hero-title">
            갑자기 못 돌볼 때,<br />
            <span style={{ color: "#FF6B35" }}>10분 안에</span> 믿을 수 있는<br />
            케어러를 연결해드려요
          </h1>

          <p style={{ color: "#6B7280", fontSize: 15, lineHeight: 1.7, margin: "0 0 20px" }}>
            신원 인증된 펫시터 · 수의사 자문 · 에스크로 안전결제<br />
            출시 전 등록하면 <strong style={{ color: "#FF6B35" }}>첫 이용 20% 할인</strong> 혜택을 드려요
          </p>

          {/* 인라인 이메일 폼 */}
          {submitted ? (
            <div style={{
              background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 12,
              padding: "14px 20px", color: "#15803D", fontWeight: 600, fontSize: 14,
            }}>
              감사합니다! 출시 시 가장 먼저 알려드릴게요
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, maxWidth: 420 }} className="hero-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일 주소 입력"
                required
                style={{
                  flex: 1, padding: "12px 16px", borderRadius: 12,
                  border: "1px solid #E5E7EB", fontSize: 14, outline: "none",
                  background: "#fff", minWidth: 0,
                }}
              />
              <button
                type="submit"
                style={{
                  background: "#FF6B35", color: "#fff", fontWeight: 700,
                  padding: "12px 22px", borderRadius: 12, border: "none",
                  fontSize: 14, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0,
                }}
              >
                출시 알림 받기
              </button>
            </form>
          )}
          <p style={{ color: "#9CA3AF", fontSize: 12, marginTop: 8 }}>무료 · 스팸 없음 · 언제든 취소 가능</p>

          {/* 신뢰 지표 */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
            {[
              { icon: "🛡️", label: "에스크로 안전결제" },
              { icon: "👨‍⚕️", label: "수의사 자문 연계" },
              { icon: "✅", label: "신원인증 펫시터" },
            ].map((item) => (
              <span key={item.label} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 13, color: "#4B5563", background: "rgba(255,255,255,0.8)",
                borderRadius: 20, padding: "6px 14px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>
            ))}
          </div>
        </div>

        {/* 이미지 영역 */}
        <div style={{ flexShrink: 0 }} className="hero-image-area">
          <div style={{ position: "relative", width: 280, height: 280 }}>
            <div style={{
              width: "100%", height: "100%",
              background: "linear-gradient(135deg, #FDBA74, #FB923C)",
              borderRadius: 24, boxShadow: "0 20px 40px rgba(251,146,60,0.2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 120,
            }}>
              🐶
            </div>
            {/* 플로팅 카드 - 케어러 연결 */}
            <div style={{
              position: "absolute", top: -12, left: -16,
              background: "#fff", borderRadius: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#374151",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ color: "#22C55E", fontSize: 16 }}>●</span> 케어러 연결 완료
            </div>
            {/* 플로팅 카드 - 평점 */}
            <div style={{
              position: "absolute", bottom: -12, right: -16,
              background: "#fff", borderRadius: 14, boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              padding: "10px 16px", fontSize: 13, fontWeight: 600, color: "#374151",
            }}>
              ⭐ 4.9 · 후기 1,240개
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
