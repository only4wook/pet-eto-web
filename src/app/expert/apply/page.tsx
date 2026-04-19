"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { supabase, storageClient } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";
import type { UserRole } from "../../../types";

// 전문가(수의사·동물병원·행동 전문가·수의학 전공·펫샵) 계정 신청 페이지
// Supabase: expert_applications 테이블에 insert (관리자 승인 대기)

const ROLE_OPTIONS: { value: UserRole; label: string; desc: string }[] = [
  { value: "vet", label: "🩺 수의사", desc: "수의사 면허 소지자" },
  { value: "vet_clinic", label: "🏥 동물병원", desc: "병원 계정 (수의사 소속)" },
  { value: "behaviorist", label: "🐾 행동 전문가", desc: "반려동물 행동 상담가·훈련사" },
  { value: "vet_student", label: "🎓 수의학 전공자", desc: "수의과대학 재학·대학원" },
  { value: "petshop", label: "🏪 펫샵", desc: "반려동물 용품 판매" },
];

export default function ExpertApplyPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [role, setRole] = useState<UserRole>("vet");
  const [realName, setRealName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [intro, setIntro] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const needsLicense = role === "vet" || role === "vet_clinic";
  const needsSchool = role === "vet_student";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.id === "demo-user") {
      alert("로그인 후 신청 가능합니다.");
      router.push("/auth/login");
      return;
    }
    if (!realName.trim()) { alert("실명을 입력해주세요."); return; }
    if (needsLicense && !licenseNo.trim()) { alert("면허번호를 입력해주세요."); return; }
    if (needsSchool && !schoolName.trim()) { alert("학교명을 입력해주세요."); return; }
    if (!intro.trim()) { alert("자기소개/경력을 200자 이상 작성해주세요."); return; }

    setLoading(true);

    // 면허증/재학증명서 업로드 (선택)
    let docUrl: string | null = null;
    if (licenseFile) {
      const ts = Date.now();
      const safe = licenseFile.name.replace(/[^a-zA-Z0-9.]/g, "_");
      const path = `${user.id}/${ts}-${safe}`;
      // 저장소 버킷 미생성이면 expert-docs 없음 → try/catch로 graceful
      try {
        const { error } = await storageClient.storage
          .from("expert-docs").upload(path, licenseFile, { contentType: licenseFile.type });
        if (!error) {
          const { data } = storageClient.storage.from("expert-docs").getPublicUrl(path);
          docUrl = data.publicUrl;
        }
      } catch { /* 버킷 미존재 — 텍스트 정보만 저장 */ }
    }

    const { error } = await supabase.from("expert_applications").insert({
      user_id: user.id,
      requested_role: role,
      real_name: realName.trim(),
      clinic_name: clinicName.trim() || null,
      license_no: licenseNo.trim() || null,
      school_name: schoolName.trim() || null,
      specialty: specialty.trim() || null,
      experience_years: experienceYears ? parseInt(experienceYears, 10) : null,
      license_doc_url: docUrl,
      intro: intro.trim(),
      phone: phone.trim() || null,
    });

    setLoading(false);

    if (error) {
      alert("신청 실패: " + error.message + "\n\n(관리자에게 문의: peteto2026@gmail.com)");
      return;
    }

    setSuccess(true);
  };

  if (success) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 560, margin: "0 auto", padding: "60px 20px", flex: 1, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>신청이 접수되었습니다</h1>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.7, marginBottom: 28 }}>
            운영팀이 2~3 영업일 내 검토 후 승인 결과를 이메일로 안내드립니다.
            <br />승인되면 자동으로 전문가 답변 기능이 활성화됩니다.
          </p>
          <Link href="/" className="btn-primary-xl">홈으로</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 640, margin: "0 auto", padding: "28px 20px 60px", flex: 1, width: "100%" }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <span className="eyebrow">전문가 등록</span>
          <h1 className="text-display-md" style={{ margin: "14px 0 10px" }}>
            펫에토 <span className="text-accent-grad">전문가 네트워크</span> 합류
          </h1>
          <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.65 }}>
            수의사·동물병원·행동 전문가로 등록하시면 보호자의 AI 분석 글에 직접 답변하고,
            병원·서비스 홍보 기회를 받으실 수 있어요.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{
          background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16,
          padding: "24px 20px", display: "flex", flexDirection: "column", gap: 18,
        }}>
          {/* 역할 선택 */}
          <div>
            <Label>등록 유형 *</Label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 8 }}>
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRole(opt.value)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 10,
                    border: `1.5px solid ${role === opt.value ? "#FF6B35" : "#E5E7EB"}`,
                    background: role === opt.value ? "#FFF7ED" : "#fff",
                    cursor: "pointer", textAlign: "left",
                    fontFamily: "inherit",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 700, color: role === opt.value ? "#C2410C" : "#1D1D1F" }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 11, color: "#6B7280", marginTop: 3 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <Row>
            <Field>
              <Label>실명 *</Label>
              <Input value={realName} onChange={(e) => setRealName(e.target.value)} placeholder="홍길동" />
            </Field>
            <Field>
              <Label>연락처</Label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="010-0000-0000" />
            </Field>
          </Row>

          {(role === "vet" || role === "vet_clinic") && (
            <Row>
              <Field>
                <Label>병원/기관명 {role === "vet_clinic" ? "*" : ""}</Label>
                <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} placeholder="예: 고양시 24시 동물병원" />
              </Field>
              <Field>
                <Label>수의사 면허번호 {needsLicense ? "*" : ""}</Label>
                <Input value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} placeholder="예: 12345" />
              </Field>
            </Row>
          )}

          {role === "vet_student" && (
            <Row>
              <Field>
                <Label>학교명 *</Label>
                <Input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="예: 서울대학교 수의과대학" />
              </Field>
              <Field>
                <Label>전공/학년</Label>
                <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="본과 3학년" />
              </Field>
            </Row>
          )}

          {(role === "vet" || role === "behaviorist") && (
            <Row>
              <Field>
                <Label>전문 분야</Label>
                <Input value={specialty} onChange={(e) => setSpecialty(e.target.value)} placeholder="내과 / 외과 / 피부 / 행동 등" />
              </Field>
              <Field>
                <Label>경력(년)</Label>
                <Input type="number" value={experienceYears} onChange={(e) => setExperienceYears(e.target.value)} placeholder="5" />
              </Field>
            </Row>
          )}

          <div>
            <Label>자기소개/경력 *</Label>
            <textarea
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
              placeholder="진료·치료·상담 경험을 200자 이상 작성해주세요. 보호자에게 신뢰를 주는 내용일수록 좋습니다."
              rows={5}
              style={{
                width: "100%", padding: "10px 12px",
                border: "1px solid #E5E7EB", borderRadius: 8,
                fontSize: 14, fontFamily: "inherit", resize: "vertical",
                outline: "none", lineHeight: 1.6,
              }}
            />
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>{intro.length}자 / 200자 이상 권장</div>
          </div>

          <div>
            <Label>면허증/재학증명서 업로드 (선택)</Label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setLicenseFile(e.target.files?.[0] ?? null)}
              style={{
                display: "block", width: "100%", padding: "10px",
                border: "1px dashed #D1D5DB", borderRadius: 8,
                fontSize: 13, background: "#FAFAFA",
              }}
            />
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 4 }}>
              검증 확률이 크게 올라가요. 업로드 안 해도 신청은 가능합니다.
            </div>
          </div>

          {/* 동의 안내 */}
          <div style={{
            background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10,
            padding: "12px 14px", fontSize: 12, color: "#4B5563", lineHeight: 1.65,
          }}>
            <div style={{ fontWeight: 700, color: "#1D1D1F", marginBottom: 6 }}>신청 전 꼭 확인해주세요</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>승인 후 답변에는 소속·면허번호(앞 4자리)가 공개됩니다.</li>
              <li>허위 정보 시 계정 정지 및 법적 조치 대상입니다.</li>
              <li>답변 한 건당 포인트 지급 (추후 리워드 연동).</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary-xl"
            style={{ justifyContent: "center", width: "100%" }}
          >
            {loading ? "신청 중..." : "전문가 등록 신청"}
          </button>
        </form>
      </main>
      <Footer />
    </>
  );
}

// ── 작은 UI 유틸 ──
function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{children}</div>;
}
function Field({ children }: { children: React.ReactNode }) {
  return <div style={{ minWidth: 0 }}>{children}</div>;
}
function Label({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize: 12, fontWeight: 700, color: "#374151", display: "block", marginBottom: 6 }}>{children}</label>;
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width: "100%", padding: "9px 12px",
        border: "1px solid #E5E7EB", borderRadius: 8,
        fontSize: 14, outline: "none", fontFamily: "inherit",
      }}
    />
  );
}
