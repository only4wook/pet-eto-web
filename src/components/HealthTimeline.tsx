"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../lib/store";
import { formatDate } from "../lib/utils";
import type { FeedPost } from "../types";

// 내 반려동물 건강 타임라인 (마이페이지)
// 최근 30일 피드 업로드를 반려동물별로 묶어서 심각도 점그래프로 표시
// Petriage의 "증상 추적" 개념을 더 직관적으로

type TimelinePoint = {
  id: string;
  date: string;
  severity: "normal" | "mild" | "moderate" | "urgent";
  fgsTotal: number | null;
  pet_name: string | null;
  description: string;
};

const SEV_COLOR: Record<string, string> = {
  normal: "#10B981",
  mild: "#0EA5E9",
  moderate: "#F59E0B",
  urgent: "#EF4444",
};

const SEV_Y_POS: Record<string, number> = {
  normal: 85,
  mild: 60,
  moderate: 35,
  urgent: 12,
};

export default function HealthTimeline() {
  const user = useAppStore((s) => s.user);
  const [points, setPoints] = useState<TimelinePoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [groupByPet, setGroupByPet] = useState<Record<string, TimelinePoint[]>>({});

  useEffect(() => {
    if (!user || user.id === "demo-user") { setLoading(false); return; }
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

    supabase
      .from("feed_posts")
      .select("id, pet_name, pet_species, description, analysis_result, created_at")
      .eq("author_id", user.id)
      .gte("created_at", thirtyDaysAgo)
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        setLoading(false);
        if (!data) return;
        const pts: TimelinePoint[] = data.map((p: any) => ({
          id: p.id,
          date: p.created_at,
          severity: p.analysis_result?.severity ?? "normal",
          fgsTotal: p.analysis_result?.fgs_total ?? null,
          pet_name: p.pet_name,
          description: (p.description || "").split("---")[0].trim().slice(0, 80),
        }));
        setPoints(pts);

        // 반려동물별 그룹
        const g: Record<string, TimelinePoint[]> = {};
        pts.forEach((pt) => {
          const key = pt.pet_name || "이름 없음";
          if (!g[key]) g[key] = [];
          g[key].push(pt);
        });
        setGroupByPet(g);
      });
  }, [user]);

  if (loading) {
    return (
      <div style={{ padding: 20, color: "#9CA3AF", fontSize: 13 }}>건강 기록 불러오는 중...</div>
    );
  }

  if (points.length === 0) {
    return (
      <div style={{
        background: "#fff", border: "1px dashed #D1D5DB", borderRadius: 12,
        padding: "24px 20px", textAlign: "center", marginBottom: 16,
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F", marginBottom: 4 }}>
          건강 타임라인이 여기에 쌓입니다
        </div>
        <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.6, marginBottom: 14 }}>
          피드에 사진을 올릴 때마다 AI 분석 결과가 기록되어
          <br />반려동물의 장기 건강 추이를 한눈에 볼 수 있어요.
        </div>
        <Link href="/feed/upload" style={{
          display: "inline-block", padding: "9px 18px",
          background: "#FF6B35", color: "#fff", borderRadius: 8,
          fontSize: 13, fontWeight: 700, textDecoration: "none",
        }}>첫 피드 올리기 →</Link>
      </div>
    );
  }

  return (
    <section style={{
      background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14,
      padding: 18, marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#1D1D1F" }}>
          📊 내 반려동물 건강 타임라인 (최근 30일)
        </h3>
        <span style={{ fontSize: 11, color: "#9CA3AF" }}>총 {points.length}건</span>
      </div>

      {Object.entries(groupByPet).map(([petName, pts]) => (
        <PetChart key={petName} petName={petName} points={pts} />
      ))}

      {/* 범례 */}
      <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
        {[
          { label: "긴급", color: "#EF4444" },
          { label: "주의", color: "#F59E0B" },
          { label: "관찰", color: "#0EA5E9" },
          { label: "정상", color: "#10B981" },
        ].map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#6B7280" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function PetChart({ petName, points }: { petName: string; points: TimelinePoint[] }) {
  // 30일 시간 스케일
  const now = Date.now();
  const thirtyAgo = now - 30 * 24 * 60 * 60 * 1000;
  const span = now - thirtyAgo;

  // FGS 평균 (통증 추이)
  const fgsVals = points.map((p) => p.fgsTotal).filter((v): v is number => typeof v === "number");
  const avgFgs = fgsVals.length > 0 ? (fgsVals.reduce((a, b) => a + b, 0) / fgsVals.length).toFixed(1) : null;

  const urgentCount = points.filter((p) => p.severity === "urgent").length;
  const moderateCount = points.filter((p) => p.severity === "moderate").length;

  // 트렌드: 전반부 vs 후반부 심각도 비교 → 개선/악화
  const mid = points[Math.floor(points.length / 2)]?.date;
  const sevScore = (s: string) => s === "urgent" ? 3 : s === "moderate" ? 2 : s === "mild" ? 1 : 0;
  const earlyAvg = points.slice(0, Math.floor(points.length / 2)).reduce((a, p) => a + sevScore(p.severity), 0) / Math.max(1, Math.floor(points.length / 2));
  const lateAvg = points.slice(Math.floor(points.length / 2)).reduce((a, p) => a + sevScore(p.severity), 0) / Math.max(1, points.length - Math.floor(points.length / 2));
  const trend = lateAvg < earlyAvg - 0.2 ? "improve" : lateAvg > earlyAvg + 0.2 ? "worsen" : "stable";

  return (
    <div style={{
      background: "#F9FAFB", border: "1px solid #F3F4F6",
      borderRadius: 12, padding: "14px 14px 10px", marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#1D1D1F" }}>
          🐾 {petName} ({points.length}건)
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, display: "flex", gap: 8 }}>
          {avgFgs && (
            <span style={{ color: "#78350F" }}>평균 FGS {avgFgs}</span>
          )}
          {trend === "improve" && <span style={{ color: "#059669" }}>📉 호전 추세</span>}
          {trend === "worsen" && <span style={{ color: "#DC2626" }}>📈 악화 추세</span>}
          {trend === "stable" && <span style={{ color: "#6B7280" }}>➡️ 안정적</span>}
        </div>
      </div>

      {/* SVG 타임라인 차트 */}
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: 100, background: "#fff", borderRadius: 8 }}>
        {/* 그리드 라인 */}
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" y1={y} x2="100" y2={y}
            stroke="#F3F4F6" strokeWidth="0.2" />
        ))}

        {/* 점 + 연결선 */}
        {points.length > 1 && (
          <polyline
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="0.6"
            points={points.map((p) => {
              const x = ((new Date(p.date).getTime() - thirtyAgo) / span) * 100;
              const y = SEV_Y_POS[p.severity];
              return `${Math.max(0, Math.min(100, x))},${y}`;
            }).join(" ")}
          />
        )}

        {points.map((p) => {
          const x = ((new Date(p.date).getTime() - thirtyAgo) / span) * 100;
          const y = SEV_Y_POS[p.severity];
          return (
            <circle
              key={p.id}
              cx={Math.max(2, Math.min(98, x))}
              cy={y}
              r="2.4"
              fill={SEV_COLOR[p.severity]}
              stroke="#fff"
              strokeWidth="0.8"
            />
          );
        })}
      </svg>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#9CA3AF", padding: "0 2px", marginTop: 4 }}>
        <span>30일 전</span>
        <span>최근</span>
      </div>

      {/* 요약 카드 */}
      <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
        {urgentCount > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, background: "#FEF2F2", color: "#DC2626", padding: "3px 8px", borderRadius: 999 }}>
            🚨 긴급 {urgentCount}회
          </span>
        )}
        {moderateCount > 0 && (
          <span style={{ fontSize: 10, fontWeight: 700, background: "#FFFBEB", color: "#D97706", padding: "3px 8px", borderRadius: 999 }}>
            ⚠️ 주의 {moderateCount}회
          </span>
        )}
        <span style={{ fontSize: 10, fontWeight: 600, background: "#F3F4F6", color: "#6B7280", padding: "3px 8px", borderRadius: 999 }}>
          최근: {formatDate(points[points.length - 1].date)}
        </span>
      </div>
    </div>
  );
}
