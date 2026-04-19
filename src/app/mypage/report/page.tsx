"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";

// 월간 건강 리포트 페이지
// 반려동물 선택 → 이달 업로드 집계 → Gemini가 리포트 작성 → 저장·공유 가능

type FeedRow = {
  id: string;
  pet_name: string | null;
  pet_species: string | null;
  description: string | null;
  analysis_result: any;
  created_at: string;
};

export default function MonthlyReportPage() {
  const user = useAppStore((s) => s.user);
  const [rows, setRows] = useState<FeedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPet, setSelectedPet] = useState<string>("");
  const [report, setReport] = useState<string>("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  // 이번 달 범위
  const { monthStart, monthEnd, monthLabel } = useMemo(() => {
    const now = new Date();
    const s = new Date(now.getFullYear(), now.getMonth(), 1);
    const e = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    return {
      monthStart: s.toISOString(),
      monthEnd: e.toISOString(),
      monthLabel: `${now.getFullYear()}년 ${now.getMonth() + 1}월`,
    };
  }, []);

  useEffect(() => {
    if (!user || user.id === "demo-user") { setLoading(false); return; }
    supabase
      .from("feed_posts")
      .select("id, pet_name, pet_species, description, analysis_result, created_at")
      .eq("author_id", user.id)
      .gte("created_at", monthStart)
      .lte("created_at", monthEnd)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setLoading(false);
        if (!data) return;
        setRows(data as FeedRow[]);
        // 가장 기록 많은 반려동물 기본 선택
        const counts: Record<string, number> = {};
        data.forEach((r: any) => {
          const key = r.pet_name || "이름 없음";
          counts[key] = (counts[key] ?? 0) + 1;
        });
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
        if (top) setSelectedPet(top);
      });
  }, [user, monthStart, monthEnd]);

  const pets = Array.from(new Set(rows.map((r) => r.pet_name || "이름 없음")));
  const petRows = rows.filter((r) => (r.pet_name || "이름 없음") === selectedPet);

  const summary = useMemo(() => {
    if (petRows.length === 0) return null;
    const sev = { normal: 0, mild: 0, moderate: 0, urgent: 0 };
    const fgsVals: number[] = [];
    const symptoms: Record<string, number> = {};
    petRows.forEach((r) => {
      const a = r.analysis_result || {};
      if (a.severity && sev[a.severity as keyof typeof sev] !== undefined) {
        sev[a.severity as keyof typeof sev]++;
      }
      if (typeof a.fgs_total === "number") fgsVals.push(a.fgs_total);
      (a.symptoms || []).forEach((s: string) => {
        symptoms[s] = (symptoms[s] ?? 0) + 1;
      });
    });
    const fgsAvg = fgsVals.length > 0 ? parseFloat((fgsVals.reduce((a, b) => a + b, 0) / fgsVals.length).toFixed(1)) : null;
    const sevScore = (s: string) => s === "urgent" ? 3 : s === "moderate" ? 2 : s === "mild" ? 1 : 0;
    const half = Math.floor(petRows.length / 2);
    const earlyAvg = petRows.slice(0, half).reduce((a, r) => a + sevScore(r.analysis_result?.severity || "normal"), 0) / Math.max(1, half);
    const lateAvg = petRows.slice(half).reduce((a, r) => a + sevScore(r.analysis_result?.severity || "normal"), 0) / Math.max(1, petRows.length - half);
    const trend: "improve" | "worsen" | "stable" | "unknown" =
      petRows.length < 4 ? "unknown" :
      lateAvg < earlyAvg - 0.3 ? "improve" :
      lateAvg > earlyAvg + 0.3 ? "worsen" : "stable";

    return {
      total: petRows.length,
      severity_counts: sev,
      fgs_avg: fgsAvg,
      fgs_trend: trend,
      top_symptoms: Object.entries(symptoms).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k),
      recent_summaries: petRows.slice(-3).map((r) => (r.analysis_result?.summary || r.description || "").slice(0, 120)).filter(Boolean),
      pet_species: petRows[0]?.pet_species || "cat",
    };
  }, [petRows]);

  const generateReport = async () => {
    if (!summary) return;
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/monthly-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pet_name: selectedPet,
          pet_species: summary.pet_species,
          month_label: monthLabel,
          total_uploads: summary.total,
          severity_counts: summary.severity_counts,
          fgs_avg: summary.fgs_avg,
          fgs_trend: summary.fgs_trend,
          top_symptoms: summary.top_symptoms,
          recent_summaries: summary.recent_summaries,
        }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setReport(data.report);
      } else {
        setError(data.error || "리포트 생성 실패");
      }
    } catch (e: any) {
      setError(e.message || "네트워크 오류");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return <><Header /><main style={{ padding: 40, textAlign: "center", color: "#9CA3AF" }}>불러오는 중...</main><Footer /></>;
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "28px 20px", flex: 1, width: "100%" }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/mypage" style={{ fontSize: 13, color: "#6B7280", textDecoration: "none" }}>← 마이페이지</Link>
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 900, letterSpacing: "-0.03em", marginBottom: 6 }}>
          📋 월간 건강 리포트
        </h1>
        <p style={{ fontSize: 13, color: "#6B7280", marginBottom: 24 }}>
          {monthLabel} 동안 업로드한 피드 기록을 AI가 요약해드려요.
        </p>

        {rows.length === 0 ? (
          <div style={{
            background: "#fff", border: "1px dashed #D1D5DB", borderRadius: 12,
            padding: "40px 20px", textAlign: "center",
          }}>
            <div style={{ fontSize: 44, marginBottom: 10 }}>📸</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>이번 달 기록이 없어요</div>
            <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.6, marginBottom: 16 }}>
              피드에 사진을 올리면 AI가 자동으로 건강 데이터를 기록합니다.
              <br />다음 달 리포트를 위해 지금 첫 업로드를 시작해보세요.
            </p>
            <Link href="/feed/upload" className="btn-primary-xl">피드 업로드 →</Link>
          </div>
        ) : (
          <>
            {/* 반려동물 선택 */}
            {pets.length > 1 && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 18 }}>
                {pets.map((p) => (
                  <button key={p} onClick={() => { setSelectedPet(p); setReport(""); }}
                    style={{
                      padding: "8px 14px", borderRadius: 999,
                      border: `1.5px solid ${selectedPet === p ? "#FF6B35" : "#E5E7EB"}`,
                      background: selectedPet === p ? "#FFF7ED" : "#fff",
                      color: selectedPet === p ? "#C2410C" : "#6B7280",
                      fontSize: 13, fontWeight: selectedPet === p ? 700 : 500,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>
                    🐾 {p}
                  </button>
                ))}
              </div>
            )}

            {/* 요약 통계 */}
            {summary && (
              <div style={{
                background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14,
                padding: 18, marginBottom: 18,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F", marginBottom: 10 }}>
                  📊 {selectedPet} — {monthLabel} 기록
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: 10 }}>
                  <StatBox label="총 업로드" value={summary.total + "건"} />
                  <StatBox label="정상" value={summary.severity_counts.normal + "건"} color="#059669" />
                  <StatBox label="주의 이상" value={(summary.severity_counts.moderate + summary.severity_counts.urgent) + "건"} color="#DC2626" />
                  <StatBox label="평균 FGS" value={summary.fgs_avg !== null ? `${summary.fgs_avg}/10` : "—"} />
                </div>
                {summary.top_symptoms.length > 0 && (
                  <div style={{ marginTop: 10, fontSize: 12, color: "#6B7280" }}>
                    주요 증상: {summary.top_symptoms.join(", ")}
                  </div>
                )}
              </div>
            )}

            {/* 리포트 생성 버튼 */}
            {!report && (
              <button onClick={generateReport} disabled={generating || !summary} className="btn-primary-xl"
                style={{ width: "100%", justifyContent: "center", marginBottom: 20 }}>
                {generating ? "AI가 리포트 작성 중..." : "✨ AI에게 월간 리포트 작성 요청"}
              </button>
            )}

            {error && (
              <div style={{
                background: "#FEE", border: "1px solid #FCC", borderRadius: 8,
                padding: 12, fontSize: 13, color: "#C00", marginBottom: 16,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* 리포트 본문 */}
            {report && (
              <article style={{
                background: "linear-gradient(180deg, #FFF7ED 0%, #fff 10%)",
                border: "1px solid #FDBA74", borderRadius: 16,
                padding: "28px 24px",
                fontSize: 14, lineHeight: 1.85, color: "#1D1D1F",
                whiteSpace: "pre-wrap",
              }}>
                {report}
                <div style={{ display: "flex", gap: 8, marginTop: 24, flexWrap: "wrap" }}>
                  <button onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: `${selectedPet} ${monthLabel} 건강 리포트`, text: report.slice(0, 500) });
                    } else {
                      navigator.clipboard.writeText(report);
                      alert("리포트가 복사되었어요!");
                    }
                  }} style={actionBtn}>📤 공유</button>
                  <button onClick={() => { setReport(""); setTimeout(generateReport, 100); }} style={actionBtn}>🔄 다시 작성</button>
                  <button onClick={() => window.print()} style={actionBtn}>🖨️ 인쇄</button>
                </div>
              </article>
            )}
          </>
        )}
      </main>
      <Footer />
    </>
  );
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ background: "#F9FAFB", borderRadius: 10, padding: "12px 14px" }}>
      <div style={{ fontSize: 11, color: "#9CA3AF", fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: color || "#1D1D1F", marginTop: 2 }}>{value}</div>
    </div>
  );
}

const actionBtn: React.CSSProperties = {
  padding: "7px 14px", background: "#fff",
  border: "1px solid #FDBA74", color: "#9A3412",
  borderRadius: 999, fontSize: 12, fontWeight: 700,
  cursor: "pointer", fontFamily: "inherit",
};
