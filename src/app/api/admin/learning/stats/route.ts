import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "../../../../../lib/security";

/**
 * 학습 루프 통계 대시보드 데이터.
 *
 * GET /api/admin/learning/stats?password=peteto2026
 *
 * 반환:
 *   - 전체 실행 수, 케이스 수, exemplar 수
 *   - 최근 30일 일별 평균 점수 추이
 *   - 카테고리별 평균 점수 (약점 카테고리 식별)
 *   - 약점 노트 빈도 (가장 자주 지적된 부족함)
 */

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const password = url.searchParams.get("password") || "";
  if (!isAdmin(password)) {
    return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY 누락" }, { status: 500 });
  }

  const sb = createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    // 1) 전체 카운트
    const [{ count: runCount }, { count: caseCount }, { count: exemplarCount }] = await Promise.all([
      sb.from("ai_learning_runs").select("id", { count: "exact", head: true }),
      sb.from("ai_learning_cases").select("id", { count: "exact", head: true }),
      sb.from("ai_exemplars").select("id", { count: "exact", head: true }).eq("active", true),
    ]);

    // 2) 최근 7개 실행 + 평균 점수 추이
    const { data: recentRuns } = await sb
      .from("ai_learning_runs")
      .select("id, started_at, status, cases_graded, avg_score, exemplars_added, triggered_by")
      .order("started_at", { ascending: false })
      .limit(10);

    // 3) 카테고리별 평균 점수
    const { data: byCategory } = await sb
      .from("ai_learning_cases")
      .select("category, score")
      .not("score", "is", null);

    const catAgg: Record<string, { sum: number; count: number; min: number; max: number }> = {};
    for (const row of byCategory || []) {
      const c = row.category as string;
      if (!catAgg[c]) catAgg[c] = { sum: 0, count: 0, min: 10, max: 0 };
      catAgg[c].sum += row.score as number;
      catAgg[c].count += 1;
      catAgg[c].min = Math.min(catAgg[c].min, row.score as number);
      catAgg[c].max = Math.max(catAgg[c].max, row.score as number);
    }
    const categoryStats = Object.entries(catAgg).map(([cat, agg]) => ({
      category: cat,
      avg: Math.round((agg.sum / agg.count) * 10) / 10,
      min: agg.min,
      max: agg.max,
      n: agg.count,
    })).sort((a, b) => a.avg - b.avg); // 약한 카테고리부터

    // 4) 약점 노트 빈도 (최근 100건)
    const { data: weakNotes } = await sb
      .from("ai_learning_cases")
      .select("weakness_notes")
      .not("weakness_notes", "is", null)
      .order("created_at", { ascending: false })
      .limit(100);

    const weakFreq: Record<string, number> = {};
    for (const row of weakNotes || []) {
      const note = (row.weakness_notes as string)?.trim();
      if (!note || note.length < 3) continue;
      // 간단 정규화 (앞 50자 기준 카운트)
      const key = note.slice(0, 50);
      weakFreq[key] = (weakFreq[key] || 0) + 1;
    }
    const topWeaknesses = Object.entries(weakFreq)
      .filter(([, c]) => c >= 2) // 2회 이상 등장한 약점만
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([note, count]) => ({ note, count }));

    return NextResponse.json({
      success: true,
      totals: {
        runs: runCount || 0,
        cases: caseCount || 0,
        active_exemplars: exemplarCount || 0,
      },
      recent_runs: recentRuns || [],
      by_category: categoryStats,
      top_weaknesses: topWeaknesses,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "server error" }, { status: 500 });
  }
}
