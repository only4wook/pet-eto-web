import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY}` } },
});

function rankSeverity(s: string) {
  return s === "urgent" ? 3 : s === "moderate" ? 2 : s === "mild" ? 1 : 0;
}

function isRateLimitError(message: string) {
  const m = (message || "").toLowerCase();
  return m.includes("429") || m.includes("rate limit") || m.includes("quota");
}

// Gemini 무료 티어: 15 RPM / ~1500 RPD
// 짧은 백오프는 분당 제한(RPM) 회복용, 긴 백오프는 일별 쿼터(RPD) 회복용
// 수동 reset 없이 자연스럽게 다음 쿼터 리셋까지 대기하도록 스케줄 설계
const RATE_LIMIT_BACKOFF_SCHEDULE_SEC = [
  5 * 60,       // retry 1: 5분 (RPM 회복)
  30 * 60,      // retry 2: 30분
  2 * 60 * 60,  // retry 3: 2시간
  6 * 60 * 60,  // retry 4: 6시간
  12 * 60 * 60, // retry 5: 12시간
  24 * 60 * 60, // retry 6+: 24시간 (일별 쿼터 완전 리셋 대기)
];

function computeRateLimitBackoffSeconds(retryCount: number) {
  const idx = Math.min(Math.max(retryCount - 1, 0), RATE_LIMIT_BACKOFF_SCHEDULE_SEC.length - 1);
  return RATE_LIMIT_BACKOFF_SCHEDULE_SEC[idx];
}

async function analyzeViaInternalApi(post: {
  id: string;
  image_url: string;
  pet_species?: string;
  description?: string;
}) {
  const imgRes = await fetch(post.image_url);
  if (!imgRes.ok) throw new Error(`image fetch failed (${imgRes.status})`);
  const blob = await imgRes.blob();
  const fd = new FormData();
  fd.append("file", blob, `feed-${post.id}.jpg`);
  fd.append("species", post.pet_species || "cat");
  fd.append("description", post.description || "");
  const analyzeRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "https://www.peteto.kr"}/api/analyze-image`, {
    method: "POST",
    body: fd,
  });
  const analyze = await analyzeRes.json();
  if (!analyzeRes.ok || !analyze?.analysis) throw new Error(analyze?.error || "analyze failed");
  return analyze;
}

// GET /api/reanalyze-queue — 큐 상태 진단 (쿼터 대기 중인지 파악용)
export async function GET(req: NextRequest) {
  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY 미설정." }, { status: 500 });
    }
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const expected = process.env.REANALYZE_QUEUE_TOKEN;
    if (!expected || token !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const nowIso = new Date().toISOString();
    const { data: all, error } = await sb
      .from("feed_reanalysis_queue")
      .select("id, feed_post_id, status, retry_count, queued_at, last_error")
      .order("queued_at", { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const rows = all || [];
    const ready = rows.filter((r) => r.status === "pending" && r.queued_at <= nowIso);
    const deferred = rows.filter((r) => r.status === "pending" && r.queued_at > nowIso);
    const processing = rows.filter((r) => r.status === "processing");
    const failed = rows.filter((r) => r.status === "failed");
    const done = rows.filter((r) => r.status === "done");

    return NextResponse.json({
      ok: true,
      now: nowIso,
      summary: {
        ready_now: ready.length,
        deferred_future: deferred.length,
        processing: processing.length,
        failed: failed.length,
        done_total: done.length,
      },
      deferred: deferred.map((r) => ({
        queue_id: r.id,
        feed_post_id: r.feed_post_id,
        retry_count: r.retry_count,
        next_retry_at: r.queued_at,
        minutes_until_retry: Math.max(0, Math.round((new Date(r.queued_at).getTime() - Date.now()) / 60000)),
        last_error: r.last_error,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY 미설정 (queue processing requires service role)." },
        { status: 500 }
      );
    }

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const expected = process.env.REANALYZE_QUEUE_TOKEN;
    if (!expected || token !== expected) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const batchSize = Math.max(1, Math.min(50, Number(body?.batchSize || 20)));
    const nowIso = new Date().toISOString();

    const { data: jobs, error } = await sb
      .from("feed_reanalysis_queue")
      .select("id, feed_post_id, retry_count, queued_at")
      .eq("status", "pending")
      .lte("queued_at", nowIso)
      .order("priority", { ascending: true })
      .order("queued_at", { ascending: true })
      .limit(batchSize);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!jobs?.length) return NextResponse.json({ ok: true, processed: 0, updated: 0 });

    let processed = 0;
    let updated = 0;
    const failures: Array<{ queue_id: string; reason: string }> = [];

    for (const job of jobs) {
      processed += 1;
      await sb.from("feed_reanalysis_queue").update({ status: "processing", started_at: new Date().toISOString() }).eq("id", job.id);
      try {
        const { data: post, error: postErr } = await sb
          .from("feed_posts")
          .select("id, image_url, pet_species, description, analysis_result, request_expert, expert_status")
          .eq("id", job.feed_post_id)
          .single();
        if (postErr || !post) throw new Error(postErr?.message || "post not found");

        const oldSeverity = post.analysis_result?.severity || "normal";
        const ai = await analyzeViaInternalApi(post);
        const newSeverity = ai.severity || oldSeverity;

        const nextAnalysis = {
          ...(post.analysis_result || {}),
          severity: newSeverity,
          symptoms: [newSeverity === "urgent" ? "긴급" : newSeverity === "moderate" ? "주의" : newSeverity === "mild" ? "관찰" : "정상"],
          summary: (ai.analysis || "").slice(0, 300),
          recommendation: "자세한 내용은 피드 상세 페이지에서 확인하세요.",
          fgs_total: ai.fgs_total ?? post.analysis_result?.fgs_total ?? null,
          fgs_breakdown: ai.fgs_breakdown ?? post.analysis_result?.fgs_breakdown ?? null,
          severity_score: ai.severity_score ?? post.analysis_result?.severity_score ?? null,
          bboxes: ai.bboxes ?? post.analysis_result?.bboxes ?? [],
          triage_flags: ai.triage_flags ?? post.analysis_result?.triage_flags ?? null,
        };

        const requireExpert = newSeverity === "moderate" || newSeverity === "urgent";
        const updatePayload = {
          analysis_result: nextAnalysis,
          request_expert: Boolean(post.request_expert || requireExpert),
          expert_status: requireExpert && post.expert_status !== "answered" ? "pending" : post.expert_status || "none",
        };
        const { error: updateErr } = await sb.from("feed_posts").update(updatePayload).eq("id", post.id);
        if (updateErr) throw new Error(updateErr.message);

        await sb.from("feed_reanalysis_queue").update({
          status: "done",
          finished_at: new Date().toISOString(),
          last_error: null,
        }).eq("id", job.id);

        if (rankSeverity(newSeverity) > rankSeverity(oldSeverity)) updated += 1;
      } catch (e: any) {
        const errMessage = String(e?.message || "unknown");
        failures.push({ queue_id: job.id, reason: errMessage });

        if (isRateLimitError(errMessage)) {
          const nextRetryCount = Number(job.retry_count || 0) + 1;
          const waitSec = computeRateLimitBackoffSeconds(nextRetryCount);
          const nextQueuedAt = new Date(Date.now() + waitSec * 1000).toISOString();
          // 다음 재시도 시각을 명시적으로 표시 (운영자가 이해하기 쉽게)
          failures[failures.length - 1].reason =
            `${errMessage} → ${Math.round(waitSec / 60)}분 뒤 자동 재시도 (${nextQueuedAt})`;
          await sb.from("feed_reanalysis_queue").update({
            status: "pending",
            retry_count: nextRetryCount,
            last_error: `[rate_limit retry=${nextRetryCount}] ${errMessage}`,
            started_at: null,
            finished_at: null,
            queued_at: nextQueuedAt,
          }).eq("id", job.id);
        } else {
          await sb.from("feed_reanalysis_queue").update({
            status: "failed",
            retry_count: Number(job.retry_count || 0) + 1,
            last_error: errMessage,
            finished_at: new Date().toISOString(),
          }).eq("id", job.id);
        }
      }
    }

    return NextResponse.json({
      ok: true,
      processed,
      updated,
      failed: failures.length,
      failures,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "server error" }, { status: 500 });
  }
}
