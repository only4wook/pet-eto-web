"use client";
import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";
import { safeNickname } from "../../lib/utils";
import type { User, UserRole } from "../../types";

// 승인된 전문가 공개 디렉토리
// 역할·검색·지역 필터로 찾을 수 있고, 답변 건수·전공 등을 보여줍니다.
// 영업 시 '우리 병원·수의사가 여기 등록되면 이렇게 노출됩니다' 쇼룸으로 활용.

const ROLE_FILTERS: { value: UserRole | "all"; label: string; icon: string }[] = [
  { value: "all", label: "전체", icon: "🐾" },
  { value: "vet", label: "수의사", icon: "🩺" },
  { value: "vet_clinic", label: "동물병원", icon: "🏥" },
  { value: "behaviorist", label: "행동 전문가", icon: "🐾" },
  { value: "vet_student", label: "수의학 전공", icon: "🎓" },
];

const ROLE_LABEL: Record<string, string> = {
  vet: "🩺 수의사",
  vet_student: "🎓 수의학 전공",
  vet_clinic: "🏥 동물병원",
  behaviorist: "🐾 행동 전문가",
  petshop: "🏪 펫샵",
};

type ExpertUser = User & {
  answer_count?: number;
};

export default function ExpertsPage() {
  const [experts, setExperts] = useState<ExpertUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      // 승인된 전문가 = role이 vet/vet_student/vet_clinic/behaviorist 중 하나
      const { data } = await supabase
        .from("users")
        .select("id, nickname, role, clinic_name, license_no, school_name, specialty, points, avatar_url, created_at")
        .in("role", ["vet", "vet_student", "vet_clinic", "behaviorist"])
        .order("points", { ascending: false });

      if (!data || data.length === 0) {
        setExperts([]);
        setLoading(false);
        return;
      }

      // 각 전문가의 답변 수를 병렬로 가져오기
      const withCounts = await Promise.all(
        data.map(async (u: any) => {
          const { count } = await supabase.from("expert_answers")
            .select("id", { count: "exact", head: true })
            .eq("expert_id", u.id);
          return { ...u, answer_count: count ?? 0 };
        })
      );

      setExperts(withCounts as ExpertUser[]);
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return experts.filter((e) => {
      if (roleFilter !== "all" && e.role !== roleFilter) return false;
      if (search.trim()) {
        const s = search.toLowerCase();
        const searchIn = [e.nickname, e.clinic_name, e.school_name, e.specialty].filter(Boolean).join(" ").toLowerCase();
        if (!searchIn.includes(s)) return false;
      }
      return true;
    });
  }, [experts, roleFilter, search]);

  return (
    <>
      <Header />
      <main style={{ flex: 1 }}>
        {/* Hero */}
        <section className="bg-hero-glow" style={{ padding: "clamp(40px, 7vw, 72px) 0 clamp(28px, 4vw, 40px)" }}>
          <div className="container-pet" style={{ textAlign: "center", maxWidth: 720, marginLeft: "auto", marginRight: "auto" }}>
            <span className="eyebrow">실명·면허 검증 완료</span>
            <h1 className="text-display-md" style={{ margin: "14px 0 10px" }}>
              P.E.T <span className="text-accent-grad">전문가 네트워크</span>
            </h1>
            <p style={{ fontSize: 14, color: "#4B5563", lineHeight: 1.7, marginBottom: 20 }}>
              수의사·동물병원·행동 전문가가 보호자 질문에 직접 답변합니다.
              <br />모든 전문가는 3단계 검증을 통과했습니다.
            </p>
            <div style={{ display: "inline-flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
              <Link href="/expert/apply" className="btn-primary-xl">
                전문가로 등록하기
              </Link>
              <Link href="/for-vets" className="btn-secondary-xl">
                혜택 보기
              </Link>
            </div>
          </div>
        </section>

        {/* 필터·검색 */}
        <section style={{ padding: "20px 0", background: "#fff", borderBottom: "1px solid #F3F4F6", position: "sticky", top: 0, zIndex: 10 }}>
          <div className="container-pet">
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              {/* 검색 */}
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#F9FAFB", border: "1px solid #E5E7EB",
                borderRadius: 999, padding: "6px 14px", flex: 1, minWidth: 200,
              }}>
                <span style={{ fontSize: 14, color: "#9CA3AF" }}>🔍</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="병원명·이름·전공 검색"
                  style={{
                    flex: 1, border: "none", outline: "none",
                    background: "transparent", fontSize: 13,
                    fontFamily: "inherit",
                  }}
                />
              </div>

              {/* 역할 필터 */}
              <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                {ROLE_FILTERS.map((f) => (
                  <button key={f.value} onClick={() => setRoleFilter(f.value)} style={{
                    padding: "7px 12px", borderRadius: 999,
                    border: `1.5px solid ${roleFilter === f.value ? "#FF6B35" : "#E5E7EB"}`,
                    background: roleFilter === f.value ? "#FFF7ED" : "#fff",
                    color: roleFilter === f.value ? "#C2410C" : "#6B7280",
                    fontSize: 12, fontWeight: roleFilter === f.value ? 700 : 500,
                    cursor: "pointer", fontFamily: "inherit",
                  }}>
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 결과 */}
        <section style={{ padding: "24px 0 60px", background: "#FAFAFA" }}>
          <div className="container-pet">
            {loading ? (
              <div style={{ textAlign: "center", padding: 60, color: "#9CA3AF" }}>
                전문가 불러오는 중...
              </div>
            ) : filtered.length === 0 ? (
              <div style={{
                textAlign: "center", padding: 60, color: "#6B7280",
                background: "#fff", border: "1px dashed #E5E7EB", borderRadius: 14,
              }}>
                <div style={{ fontSize: 44, marginBottom: 12 }}>👨‍⚕️</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1D1D1F", marginBottom: 8 }}>
                  {experts.length === 0 ? "아직 등록된 전문가가 없어요" : "조건에 맞는 전문가가 없습니다"}
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
                  {experts.length === 0
                    ? "수의사·동물병원·행동 전문가로 첫 등록해보세요."
                    : "다른 조건으로 검색해주세요."}
                </p>
                <Link href="/expert/apply" className="btn-primary-xl">전문가로 등록하기</Link>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, color: "#6B7280", marginBottom: 14 }}>
                  총 <b style={{ color: "#1D1D1F" }}>{filtered.length}</b>명의 전문가
                </div>
                <div className="expert-grid" style={{
                  display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 14,
                }}>
                  {filtered.map((e) => (
                    <ExpertCard key={e.id} expert={e} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function ExpertCard({ expert }: { expert: ExpertUser }) {
  const displayName = safeNickname(expert.nickname, expert.id);
  const roleLabel = ROLE_LABEL[expert.role || "user"] || "전문가";
  const maskedLicense = expert.license_no ? `면허 ${String(expert.license_no).slice(0, 4)}•••` : null;

  return (
    <article className="lift" style={{
      background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14,
      padding: 18, display: "flex", flexDirection: "column", gap: 10,
    }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: "linear-gradient(135deg, #FF6B35, #F59E0B)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 18, fontWeight: 800,
        }}>
          {displayName.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            display: "inline-block",
            fontSize: 10, fontWeight: 800, padding: "2px 8px", borderRadius: 4,
            background: "#1D1D1F", color: "#fff", marginBottom: 2,
          }}>
            {roleLabel}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: "#1D1D1F", lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {displayName}
          </div>
        </div>
      </div>

      {/* 소속 */}
      {(expert.clinic_name || expert.school_name) && (
        <div style={{ fontSize: 12, color: "#4B5563", lineHeight: 1.5 }}>
          {expert.clinic_name && <div>🏥 {expert.clinic_name}</div>}
          {expert.school_name && <div>🎓 {expert.school_name}</div>}
        </div>
      )}

      {/* 전공·면허 */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {expert.specialty && (
          <span style={{
            fontSize: 10, fontWeight: 700,
            background: "#EFF6FF", color: "#1D4ED8",
            padding: "3px 8px", borderRadius: 999,
          }}>
            {expert.specialty}
          </span>
        )}
        {maskedLicense && (
          <span style={{
            fontSize: 10, fontWeight: 700,
            background: "#ECFDF5", color: "#065F46",
            padding: "3px 8px", borderRadius: 999,
          }}>
            ✓ {maskedLicense}
          </span>
        )}
      </div>

      {/* 답변 건수 */}
      <div style={{
        marginTop: 4, padding: "8px 10px",
        background: "#F9FAFB", borderRadius: 8,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        fontSize: 11, color: "#6B7280",
      }}>
        <span>🗨️ 답변 {expert.answer_count ?? 0}건</span>
        <span>✨ {expert.points ?? 0}P</span>
      </div>
    </article>
  );
}
