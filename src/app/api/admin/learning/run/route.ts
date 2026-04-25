import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { checkRateLimit, getClientIP, isAdmin } from "../../../../../lib/security";
import {
  generateTestCases,
  generateAIResponse,
  gradeResponse,
  buildExemplarFewShot,
  type GeneratedCase,
  type ExemplarRow,
} from "../../../../../lib/learning";

/**
 * 자가강화 학습 사이클 한 번 실행.
 *
 * Flow:
 *   1. 케이스 N개 생성 (Gemini)
 *   2. 활성 exemplar 5개 가져와서 few-shot 으로 주입
 *   3. 각 케이스에 AI 답변 생성 + 자동 채점 (병렬)
 *   4. 결과 DB 저장
 *   5. 점수 ≥ 9 인 답변은 ai_exemplars 로 자동 승격
 *   6. 통계 반환
 *
 * 호출:
 *   POST /api/admin/learning/run
 *   Body: { password, count?: 10 }   (count 1~20, Vercel 함수 timeout 고려)
 *
 * 또는 Vercel cron 자동 트리거 (Authorization: Bearer ${CRON_SECRET})
 */

export const maxDuration = 300; // 최대 5분 — 케이스 처리에 충분

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";

function isCronInvocation(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || !auth) return false;
  return auth === `Bearer ${cronSecret}`;
}

export async function POST(req: NextRequest) {
  return handleRun(req, "manual");
}

// Vercel cron 은 GET 으로 호출됨
export async function GET(req: NextRequest) {
  if (!isCronInvocation(req)) {
    return NextResponse.json({ error: "GET 은 cron 전용 (POST 사용)" }, { status: 405 });
  }
  return handleRun(req, "cron");
}

async function handleRun(req: NextRequest, source: "manual" | "cron") {
  try {
    // ── 보안 ──
    if (source === "manual") {
      const ip = getClientIP(req);
      if (!checkRateLimit(ip, 2, 60000)) {
        return NextResponse.json({ error: "분당 2회 제한" }, { status: 429 });
      }
    }

    let count = 10;
    if (source === "manual") {
      const body = await req.json().catch(() => ({}));
      const { password, count: bodyCount = 10 } = body;
      if (!isAdmin(password || "")) {
        return NextResponse.json({ error: "권한 없음" }, { status: 403 });
      }
      if (bodyCount < 1 || bodyCount > 20) {
        return NextResponse.json({ error: "count 1~20" }, { status: 400 });
      }
      count = bodyCount;
    } else {
      // cron: 기본 10
      count = 10;
    }

    // ── env ──
    const geminiKey = process.env.GEMINI_API_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
    if (!geminiKey || !serviceKey) {
      return NextResponse.json(
        { error: `env 누락: ${!geminiKey ? "GEMINI_API_KEY " : ""}${!serviceKey ? "SUPABASE_SERVICE_ROLE_KEY" : ""}` },
        { status: 500 }
      );
    }

    const sb = createClient(SUPABASE_URL, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // ── 1) 학습 실행 row 생성 (status: running) ──
    const { data: runRow, error: runErr } = await sb
      .from("ai_learning_runs")
      .insert({ status: "running", triggered_by: source })
      .select("id")
      .single();
    if (runErr || !runRow) throw new Error(`run insert: ${runErr?.message}`);
    const runId: string = runRow.id;

    try {
      // ── 2) Active exemplar 가져오기 (다음 답변에 주입) ──
      const { data: exRows } = await sb
        .from("ai_exemplars")
        .select("category, question, exemplar_response, score")
        .eq("active", true)
        .order("promoted_at", { ascending: false })
        .limit(5);
      const fewShot = buildExemplarFewShot((exRows || []) as ExemplarRow[]);

      // ── 3) 케이스 생성 ──
      const cases: GeneratedCase[] = await generateTestCases(count, geminiKey, model);
      if (cases.length === 0) throw new Error("케이스 0개 생성됨");

      // ── 4) 답변 + 채점 (병렬, 5개씩 배치 — rate limit 보호) ──
      const results: Array<{
        case: GeneratedCase;
        response: string;
        score: number;
        breakdown: any;
        weakness: string;
        error?: string;
      }> = [];

      const BATCH = 5;
      for (let i = 0; i < cases.length; i += BATCH) {
        const batch = cases.slice(i, i + BATCH);
        const batchResults = await Promise.all(
          batch.map(async (c) => {
            try {
              const aiResp = await generateAIResponse(c.question, geminiKey, model, fewShot);
              if (!aiResp || aiResp.length < 50) {
                return { case: c, response: aiResp, score: 0, breakdown: {}, weakness: "응답 너무 짧음", error: "short-response" };
              }
              const grading = await gradeResponse(c.question, aiResp, geminiKey, model);
              return {
                case: c,
                response: aiResp,
                score: grading.score,
                breakdown: grading.breakdown,
                weakness: grading.weakness,
              };
            } catch (err: any) {
              return { case: c, response: "", score: 0, breakdown: {}, weakness: "", error: err.message || "unknown" };
            }
          })
        );
        results.push(...batchResults);
      }

      // ── 5) 케이스 일괄 INSERT ──
      const caseInsertRows = results.map((r) => ({
        run_id: runId,
        category: r.case.category,
        question: r.case.question,
        ai_response: r.response,
        score: r.score,
        scoring_breakdown: r.breakdown,
        weakness_notes: r.weakness + (r.error ? ` [error: ${r.error}]` : ""),
        promoted_to_exemplar: false,
      }));

      const { data: insertedCases, error: caseErr } = await sb
        .from("ai_learning_cases")
        .insert(caseInsertRows)
        .select("id, category, question, ai_response, score");

      if (caseErr) throw new Error(`case insert: ${caseErr.message}`);

      // ── 6) 점수 ≥ 9 → ai_exemplars 자동 승격 ──
      const promotable = (insertedCases || []).filter((c: any) => c.score >= 9 && c.ai_response && c.ai_response.length >= 200);
      if (promotable.length > 0) {
        const exemplarRows = promotable.map((c: any) => ({
          case_id: c.id,
          category: c.category,
          question: c.question,
          exemplar_response: c.ai_response,
          score: c.score,
          active: true,
        }));
        const { error: exErr } = await sb.from("ai_exemplars").insert(exemplarRows);
        if (exErr) console.warn("exemplar insert warn:", exErr.message);

        // case 의 promoted 플래그 업데이트
        await sb
          .from("ai_learning_cases")
          .update({ promoted_to_exemplar: true })
          .in("id", promotable.map((c: any) => c.id));
      }

      // ── 7) 학습 실행 row 마무리 ──
      const validScores = results.filter((r) => !r.error && r.score > 0).map((r) => r.score);
      const avgScore = validScores.length
        ? Math.round((validScores.reduce((a, b) => a + b, 0) / validScores.length) * 10) / 10
        : 0;

      await sb
        .from("ai_learning_runs")
        .update({
          finished_at: new Date().toISOString(),
          cases_generated: cases.length,
          cases_graded: validScores.length,
          avg_score: avgScore,
          exemplars_added: promotable.length,
          status: "done",
          notes: `[${source}] avg=${avgScore} promoted=${promotable.length}`,
        })
        .eq("id", runId);

      return NextResponse.json({
        success: true,
        run_id: runId,
        triggered_by: source,
        cases_generated: cases.length,
        cases_graded: validScores.length,
        avg_score: avgScore,
        exemplars_added: promotable.length,
        score_distribution: {
          excellent: results.filter((r) => r.score >= 9).length,
          good: results.filter((r) => r.score >= 7 && r.score < 9).length,
          fair: results.filter((r) => r.score >= 5 && r.score < 7).length,
          poor: results.filter((r) => r.score < 5 && !r.error).length,
          errors: results.filter((r) => r.error).length,
        },
        sample_results: results.slice(0, 3).map((r) => ({
          category: r.case.category,
          question: r.case.question.slice(0, 80),
          score: r.score,
          weakness: r.weakness.slice(0, 100),
        })),
      });
    } catch (innerErr: any) {
      // run row 를 failed 로 마킹
      await sb
        .from("ai_learning_runs")
        .update({
          finished_at: new Date().toISOString(),
          status: "failed",
          notes: `error: ${innerErr.message?.slice(0, 200) || "unknown"}`,
        })
        .eq("id", runId);
      throw innerErr;
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "server error" }, { status: 500 });
  }
}
