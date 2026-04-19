"use client";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../lib/store";
import Header from "./Header";
import Footer from "./Footer";

// 파트너 서비스 공통 랜딩 컴포넌트 — 3종(이동/호텔링/돌봄)에서 재사용
// 기능:
// 1) 보호자용 "서비스 신청" 폼 (service_applications)
// 2) 업체용 "파트너 모집" 폼 (service_partners)

export type PartnerServiceMeta = {
  kind: "transport" | "hotel" | "sitter";
  title: string;         // "펫 이동 서비스"
  heroTitle: string;     // "병원·미용실까지 안전하게"
  heroSubtitle: string;  // "전문 기사가 반려동물 이동을 대신합니다"
  emoji: string;
  benefits: { icon: string; title: string; desc: string }[];
  priceGuide: { label: string; range: string; note?: string }[];
  verificationChecklist: string[];
  fieldLabels: {
    startAt?: string;
    endAt?: string;
    pickupAddress?: string;
    dropoffAddress?: string;
    notes?: string;
  };
};

export default function PartnerServiceLanding({ meta }: { meta: PartnerServiceMeta }) {
  const user = useAppStore((s) => s.user);
  const [tab, setTab] = useState<"request" | "recruit">("request");

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        {/* Hero */}
        <section className="bg-hero-glow" style={{ padding: "clamp(56px, 9vw, 100px) 0 clamp(32px, 5vw, 48px)" }}>
          <div className="container-pet" style={{ textAlign: "center", maxWidth: 760, marginLeft: "auto", marginRight: "auto" }}>
            <div style={{ fontSize: 52, marginBottom: 10 }}>{meta.emoji}</div>
            <span className="eyebrow">{meta.title}</span>
            <h1 className="text-display-lg" style={{ margin: "14px 0 14px" }}>
              {meta.heroTitle}
            </h1>
            <p style={{ fontSize: "clamp(14px, 1.3vw, 16px)", color: "#4B5563", lineHeight: 1.7, marginBottom: 24 }}>
              {meta.heroSubtitle}
            </p>

            {/* 탭 */}
            <div style={{ display: "inline-flex", gap: 4, background: "#fff", border: "1px solid #E5E7EB", borderRadius: 999, padding: 4 }}>
              <button
                onClick={() => setTab("request")}
                style={{
                  padding: "8px 18px", fontSize: 13, fontWeight: 700,
                  borderRadius: 999,
                  background: tab === "request" ? "#1D1D1F" : "transparent",
                  color: tab === "request" ? "#fff" : "#6B7280",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >보호자 신청</button>
              <button
                onClick={() => setTab("recruit")}
                style={{
                  padding: "8px 18px", fontSize: 13, fontWeight: 700,
                  borderRadius: 999,
                  background: tab === "recruit" ? "#FF6B35" : "transparent",
                  color: tab === "recruit" ? "#fff" : "#6B7280",
                  border: "none", cursor: "pointer", fontFamily: "inherit",
                }}
              >업체 등록</button>
            </div>
          </div>
        </section>

        {/* 혜택 / 가격 */}
        <section style={{ padding: "clamp(40px, 6vw, 72px) 0", background: "#FAFAFA" }}>
          <div className="container-pet">
            <div className="partner-benefits-grid" style={{
              display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
              gap: "clamp(14px, 2vw, 20px)", marginBottom: 32,
            }}>
              {meta.benefits.map((b) => (
                <div key={b.title} className="glass lift" style={{ padding: "22px 20px", borderRadius: 16 }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{b.icon}</div>
                  <h3 style={{ margin: "0 0 6px", fontSize: 16, fontWeight: 800, color: "#1D1D1F" }}>{b.title}</h3>
                  <p style={{ margin: 0, fontSize: 13, color: "#6B7280", lineHeight: 1.6 }}>{b.desc}</p>
                </div>
              ))}
            </div>

            {/* 가격 가이드 */}
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 20 }}>
              <h3 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 800, color: "#1D1D1F" }}>
                💰 예상 비용 가이드
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
                {meta.priceGuide.map((p) => (
                  <div key={p.label} style={{ padding: 12, background: "#F9FAFB", borderRadius: 10 }}>
                    <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>{p.label}</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: "#1D1D1F" }}>{p.range}</div>
                    {p.note && <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{p.note}</div>}
                  </div>
                ))}
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 11, color: "#9CA3AF", lineHeight: 1.6 }}>
                ※ 업체별·지역별·반려동물 크기별로 가격이 달라집니다. 신청 후 업체로부터 정확한 견적을 받으세요.
                <br />※ 펫에토는 결제액의 10%를 중개 수수료로 받습니다 (업체가 부담).
              </p>
            </div>
          </div>

          <style jsx>{`
            @media (max-width: 900px) { .partner-benefits-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </section>

        {/* 메인 폼 */}
        <section style={{ padding: "clamp(40px, 6vw, 80px) 0", background: "#fff" }}>
          <div className="container-pet" style={{ maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            {tab === "request" ? <RequestForm meta={meta} user={user} /> : <RecruitForm meta={meta} user={user} />}
          </div>
        </section>

        {/* 검증 체크리스트 */}
        <section style={{ padding: "clamp(40px, 6vw, 72px) 0", background: "#F9FAFB" }}>
          <div className="container-pet" style={{ maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 800, color: "#1D1D1F", textAlign: "center" }}>
              🛡️ 펫에토가 {meta.title}을(를) 안전하게 보장하는 방법
            </h3>
            <ul style={{ margin: 0, paddingLeft: 20, color: "#374151", fontSize: 14, lineHeight: 2 }}>
              {meta.verificationChecklist.map((c) => <li key={c}>{c}</li>)}
            </ul>
            <div style={{ marginTop: 20, textAlign: "center" }}>
              <Link href="/verification" style={{ color: "#FF6B35", fontSize: 13, fontWeight: 700, textDecoration: "none" }}>
                3단계 검증 상세 보기 →
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

// ─── 보호자 서비스 신청 폼 ───
function RequestForm({ meta, user }: { meta: PartnerServiceMeta; user: any }) {
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("cat");
  const [petWeight, setPetWeight] = useState("");
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [notes, setNotes] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.id === "demo-user") {
      if (confirm("로그인 후 신청 가능합니다. 로그인 페이지로 이동할까요?")) {
        window.location.href = "/auth/login";
      }
      return;
    }
    if (!phone.trim()) { alert("연락처를 입력해주세요."); return; }

    setLoading(true);
    const { error } = await supabase.from("service_applications").insert({
      user_id: user.id,
      service_type: meta.kind,
      pet_name: petName.trim() || null,
      pet_species: petSpecies,
      pet_weight: petWeight ? parseFloat(petWeight) : null,
      start_at: startAt ? new Date(startAt).toISOString() : null,
      end_at: endAt ? new Date(endAt).toISOString() : null,
      pickup_address: pickup.trim() || null,
      dropoff_address: dropoff.trim() || null,
      notes: notes.trim() || null,
      contact_phone: phone.trim(),
    });
    setLoading(false);
    if (error) {
      alert("신청 실패: " + error.message + "\n\n(DB 마이그레이션 필요할 수 있음)");
      return;
    }
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>✅</div>
        <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 800 }}>신청 완료!</h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 20 }}>
          펫에토 매니저가 2시간 내 카카오톡으로 연락드립니다.
          <br />검증된 {meta.title} 업체와 매칭해드릴게요.
        </p>
        <Link href="/" className="btn-primary-xl">홈으로</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <Label>📅 언제 필요하세요?</Label>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <Input type="datetime-local" value={startAt} onChange={(e) => setStartAt(e.target.value)} placeholder="시작" />
          {meta.kind !== "transport" && (
            <Input type="datetime-local" value={endAt} onChange={(e) => setEndAt(e.target.value)} placeholder="종료" />
          )}
        </div>
      </div>

      <div>
        <Label>🐾 반려동물 정보</Label>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
          <Input value={petName} onChange={(e) => setPetName(e.target.value)} placeholder="이름 (나비)" />
          <select value={petSpecies} onChange={(e) => setPetSpecies(e.target.value)} style={selectStyle}>
            <option value="cat">🐱 고양이</option>
            <option value="dog">🐶 강아지</option>
            <option value="other">🐾 기타</option>
          </select>
          <Input type="number" step="0.1" value={petWeight} onChange={(e) => setPetWeight(e.target.value)} placeholder="kg" />
        </div>
      </div>

      {meta.kind === "transport" && (
        <>
          <div>
            <Label>📍 {meta.fieldLabels.pickupAddress ?? "출발지"}</Label>
            <Input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="예: 경기도 고양시 일산동구…" />
          </div>
          <div>
            <Label>🎯 {meta.fieldLabels.dropoffAddress ?? "도착지"}</Label>
            <Input value={dropoff} onChange={(e) => setDropoff(e.target.value)} placeholder="예: ○○동물병원" />
          </div>
        </>
      )}
      {meta.kind !== "transport" && (
        <div>
          <Label>📍 {meta.fieldLabels.pickupAddress ?? "주소"}</Label>
          <Input value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="예: 경기도 고양시 일산동구…" />
        </div>
      )}

      <div>
        <Label>📝 요청 사항</Label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={meta.fieldLabels.notes ?? "특이사항·성격·복용 약 등"}
          rows={4}
          style={{ ...(inputStyle as any), minHeight: 90, resize: "vertical" }}
        />
      </div>

      <div>
        <Label>📞 연락처 *</Label>
        <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" required />
      </div>

      <button type="submit" disabled={loading} className="btn-primary-xl" style={{ justifyContent: "center", marginTop: 8 }}>
        {loading ? "신청 중..." : "펫에토에 매칭 요청하기"}
      </button>

      <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
        매니저가 카톡으로 연락 → 업체 매칭 → 결제 순으로 진행됩니다.
      </p>
    </form>
  );
}

// ─── 업체 파트너 등록 폼 ───
function RecruitForm({ meta, user }: { meta: PartnerServiceMeta; user: any }) {
  const [companyName, setCompanyName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [region, setRegion] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.id === "demo-user") {
      if (confirm("로그인 후 신청 가능합니다. 로그인 페이지로 이동할까요?")) {
        window.location.href = "/auth/login";
      }
      return;
    }
    if (!companyName.trim() || !region.trim()) { alert("업체명과 지역은 필수예요."); return; }

    setLoading(true);
    const { error } = await supabase.from("service_partners").insert({
      user_id: user.id,
      service_type: meta.kind,
      company_name: companyName.trim(),
      business_number: businessNumber.trim() || null,
      region: region.trim(),
      price_range: priceRange.trim() || null,
      description: description.trim() || null,
    });
    setLoading(false);
    if (error) { alert("등록 실패: " + error.message); return; }
    setSuccess(true);
  };

  if (success) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <div style={{ fontSize: 56, marginBottom: 14 }}>🎉</div>
        <h2 style={{ margin: "0 0 10px", fontSize: 22, fontWeight: 800 }}>업체 등록 신청 완료</h2>
        <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65, marginBottom: 20 }}>
          운영팀이 2~3 영업일 내 검증 후 전화드립니다.
          <br />승인되면 예약 고객이 매칭되기 시작합니다.
        </p>
        <Link href="/" className="btn-primary-xl">홈으로</Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{
        background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 10,
        padding: "12px 14px", fontSize: 12, color: "#9A3412", lineHeight: 1.6,
      }}>
        <b>📌 업체 등록 혜택</b><br />
        · 마케팅 비용 0원 · 확정된 예약 고객 자동 매칭 · 결제 중개 10%만 · 프로필 노출 무료
      </div>

      <div>
        <Label>🏢 업체명 *</Label>
        <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder={
          meta.kind === "transport" ? "예: 펫무브(주)" :
          meta.kind === "hotel" ? "예: 서울 펫호텔" :
          "예: 행복 펫시터"
        } required />
      </div>

      <div>
        <Label>📋 사업자등록번호</Label>
        <Input value={businessNumber} onChange={(e) => setBusinessNumber(e.target.value)} placeholder="예: 123-45-67890" />
      </div>

      <div>
        <Label>📍 활동 지역 *</Label>
        <Input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="예: 고양시·파주시" required />
      </div>

      <div>
        <Label>💰 가격대</Label>
        <Input value={priceRange} onChange={(e) => setPriceRange(e.target.value)} placeholder={
          meta.kind === "transport" ? "예: 3~8만원 (지역별)" :
          meta.kind === "hotel" ? "예: 1박 5~12만원" :
          "예: 1회 방문 4시간 6만원"
        } />
      </div>

      <div>
        <Label>📝 업체 소개</Label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="서비스 차별점, 경력, 자격증, 보유 차량·시설 등 자유 기술"
          rows={5}
          style={{ ...(inputStyle as any), minHeight: 110, resize: "vertical" }}
        />
      </div>

      <button type="submit" disabled={loading} className="btn-primary-xl" style={{ justifyContent: "center", marginTop: 8 }}>
        {loading ? "제출 중..." : "업체 등록 신청"}
      </button>

      <p style={{ margin: 0, fontSize: 11, color: "#9CA3AF", textAlign: "center" }}>
        검증 후 연락드립니다 · peteto2026@gmail.com
      </p>
    </form>
  );
}

// ─── UI 유틸 ───
function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#374151", marginBottom: 6 }}>{children}</label>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} style={inputStyle} />;
}
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "10px 12px",
  border: "1px solid #E5E7EB", borderRadius: 8,
  fontSize: 14, outline: "none", fontFamily: "inherit",
};
const selectStyle: React.CSSProperties = { ...inputStyle, background: "#fff" };
