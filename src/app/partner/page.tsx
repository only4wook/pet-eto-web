"use client";
import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";
import { useAppStore } from "../../lib/store";

const SERVICE_TYPES = [
  { value: "petsitter", label: "🐾 펫시터 (방문 돌봄)", desc: "고객 집에 방문하여 반려동물 돌봄" },
  { value: "dogwalker", label: "🚶 도그워커 (산책 대행)", desc: "반려견 산책 대행 서비스" },
  { value: "grooming", label: "✂️ 미용사 (방문 미용)", desc: "반려동물 미용 서비스 제공" },
  { value: "trainer", label: "🎓 훈련사", desc: "반려동물 행동 교정/훈련" },
  { value: "taxi", label: "🚗 펫택시 (이동 서비스)", desc: "반려동물 병원/미용실 이동 지원" },
  { value: "hotel", label: "🏨 펫호텔", desc: "반려동물 위탁/호텔 운영" },
];

const REGIONS = [
  "서울 강남/서초", "서울 마포/서대문", "서울 성동/광진", "서울 송파/강동",
  "서울 영등포/동작", "서울 노원/도봉", "서울 강서/양천", "서울 기타",
  "고양시/일산", "파주시", "수원/용인", "성남/분당", "인천", "경기 기타",
];

export default function PartnerPage() {
  const user = useAppStore((s) => s.user);
  const [form, setForm] = useState({
    name: "", phone: "", email: "", region: "", serviceType: [] as string[],
    experience: "", qualification: "", introduction: "", hasPet: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleService = (v: string) => {
    setForm((f) => ({
      ...f,
      serviceType: f.serviceType.includes(v) ? f.serviceType.filter((s) => s !== v) : [...f.serviceType, v],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.region || form.serviceType.length === 0) {
      alert("필수 항목을 모두 입력해주세요."); return;
    }
    setLoading(true);

    // Supabase에 파트너 신청 저장 (posts 테이블 활용)
    await supabase.from("posts").insert({
      author_id: user?.id || null,
      category: "문의",
      title: `[파트너 신청] ${form.name} - ${form.serviceType.join(", ")}`,
      content: `이름: ${form.name}\n연락처: ${form.phone}\n이메일: ${form.email}\n지역: ${form.region}\n서비스: ${form.serviceType.join(", ")}\n경력: ${form.experience}\n자격증: ${form.qualification}\n반려동물 양육: ${form.hasPet}\n\n자기소개:\n${form.introduction}`,
      tags: ["파트너신청", ...form.serviceType],
    });

    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 600, margin: "0 auto", padding: "60px 16px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1F2937", marginBottom: 8 }}>파트너 신청이 완료되었습니다!</h2>
          <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7, marginBottom: 24 }}>
            대표가 직접 검토 후 3일 이내 연락드리겠습니다.<br />
            궁금한 점은 카카오톡 채널로 문의해주세요!
          </p>
          <a href="https://pf.kakao.com/_giedX/chat" target="_blank" rel="noopener noreferrer" style={{
            display: "inline-flex", alignItems: "center", gap: 8, background: "#FEE500",
            color: "#3C1E1E", padding: "12px 24px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none",
          }}>💬 카카오톡 문의하기</a>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px", flex: 1 }}>
        {/* 히어로 */}
        <section style={{
          background: "linear-gradient(135deg, #FF6B35, #FB923C)", borderRadius: 16,
          padding: "36px 28px", color: "#fff", textAlign: "center", marginBottom: 28,
        }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 8px" }}>P.E.T 파트너 모집</h1>
          <p style={{ fontSize: 15, opacity: 0.9, margin: "0 0 20px" }}>
            반려동물을 사랑하는 당신의 재능으로 수입을 만드세요
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            {[
              { icon: "💰", label: "건당 2~8만원 수익" },
              { icon: "⏰", label: "자유로운 시간 선택" },
              { icon: "🛡️", label: "보험 가입 지원" },
            ].map((b) => (
              <span key={b.label} style={{
                display: "flex", alignItems: "center", gap: 6, fontSize: 14,
                background: "rgba(255,255,255,0.2)", padding: "6px 14px", borderRadius: 20,
              }}>{b.icon} {b.label}</span>
            ))}
          </div>
        </section>

        {/* 3단계 검증 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "24px", marginBottom: 24, border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 16px", color: "#1F2937" }}>파트너 선정 프로세스</h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { step: "1", title: "신청서 제출", desc: "아래 양식 작성 (3분)", icon: "📝" },
              { step: "2", title: "서류 검토", desc: "신원·자격·경력 확인", icon: "🔍" },
              { step: "3", title: "면접", desc: "대면 또는 화상 면접", icon: "🤝" },
              { step: "4", title: "시범 케어", desc: "테스트 1회 후 승인", icon: "✅" },
            ].map((s) => (
              <div key={s.step} style={{ flex: 1, minWidth: 130, textAlign: "center" }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "#FF6B35",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 20, margin: "0 auto 8px",
                }}>{s.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{s.title}</div>
                <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 신청 폼 */}
        <section style={{ background: "#fff", borderRadius: 16, padding: "28px", border: "1px solid #F3F4F6" }}>
          <h2 style={{ fontSize: 17, fontWeight: 800, margin: "0 0 20px", color: "#1F2937" }}>파트너 신청서</h2>
          <form onSubmit={handleSubmit}>
            {/* 기본 정보 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>이름 *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="홍길동" required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>연락처 *</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="010-0000-0000" required style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>이메일</label>
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com" style={inputStyle} />
            </div>

            {/* 활동 지역 */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>활동 가능 지역 *</label>
              <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}
                required style={inputStyle}>
                <option value="">지역 선택</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            {/* 서비스 유형 (복수 선택) */}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>제공 가능 서비스 * (복수 선택)</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {SERVICE_TYPES.map((s) => (
                  <button key={s.value} type="button" onClick={() => toggleService(s.value)} style={{
                    padding: "12px", borderRadius: 10, textAlign: "left", cursor: "pointer",
                    border: form.serviceType.includes(s.value) ? "2px solid #FF6B35" : "1px solid #E5E7EB",
                    background: form.serviceType.includes(s.value) ? "#FFF7ED" : "#fff",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1F2937" }}>{s.label}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 경력/자격 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>반려동물 관련 경력</label>
                <input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })}
                  placeholder="예: 반려견 양육 5년" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>관련 자격증</label>
                <input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })}
                  placeholder="예: 반려동물관리사 1급" style={inputStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>현재 반려동물 양육 여부</label>
              <select value={form.hasPet} onChange={(e) => setForm({ ...form, hasPet: e.target.value })} style={inputStyle}>
                <option value="">선택</option>
                <option value="yes_dog">네, 강아지 키우고 있어요</option>
                <option value="yes_cat">네, 고양이 키우고 있어요</option>
                <option value="yes_both">네, 둘 다 키우고 있어요</option>
                <option value="past">과거에 키웠어요</option>
                <option value="no">아니요</option>
              </select>
            </div>

            {/* 자기소개 */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>자기소개 / 지원 동기</label>
              <textarea value={form.introduction} onChange={(e) => setForm({ ...form, introduction: e.target.value })}
                placeholder="반려동물을 좋아하게 된 계기, 관련 경험, 지원 동기 등을 자유롭게 적어주세요."
                style={{ ...inputStyle, minHeight: 120, resize: "vertical", fontFamily: "inherit" }} />
            </div>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "14px", background: loading ? "#9CA3AF" : "#FF6B35",
              color: "#fff", border: "none", borderRadius: 12, fontSize: 16, fontWeight: 700, cursor: "pointer",
            }}>
              {loading ? "제출 중..." : "파트너 신청하기"}
            </button>

            <p style={{ fontSize: 11, color: "#9CA3AF", textAlign: "center", marginTop: 8 }}>
              신청 정보는 파트너 선정 목적으로만 사용되며, 개인정보처리방침에 따라 관리됩니다.
            </p>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, color: "#374151" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 14, outline: "none" };
