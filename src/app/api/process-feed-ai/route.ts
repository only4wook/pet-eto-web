import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 피드 상세 페이지가 열렸을 때 호출. cron 의존성 없이 즉시 AI 분석 → DB 업데이트.
// pending_ai === true인 게시물만 처리. 짧은 시간 내 중복 호출 방지(처리 중 락).
export const maxDuration = 60;

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY,
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY}`,
      },
    },
  }
);

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id가 필요합니다." }, { status: 400 });

    // 게시물 조회
    const { data: post, error: postErr } = await sb
      .from("feed_posts")
      .select("id, image_url, pet_species, description, analysis_result")
      .eq("id", id)
      .single();
    if (postErr || !post) {
      return NextResponse.json({ error: postErr?.message || "post not found" }, { status: 404 });
    }

    // 이미 AI 분석이 완료된 글이면 스킵
    // pending_ai 플래그가 없는 기존 게시물도 fallback 메시지면 재처리
    const summary = (post.analysis_result?.summary as string) || "";
    const isPendingByFlag = post.analysis_result?.pending_ai === true;
    const isPendingByText = summary.includes("분석 중") || summary.includes("AI 분석이 지연");
    if (!isPendingByFlag && !isPendingByText) {
      return NextResponse.json({ ok: true, skipped: "already_analyzed" });
    }

    // 다른 호출이 처리 중인지 확인 (5분 내 락)
    const lockTs = post.analysis_result?.processing_started_at;
    if (lockTs && Date.now() - new Date(lockTs).getTime() < 5 * 60 * 1000) {
      return NextResponse.json({ ok: true, skipped: "in_progress" });
    }

    // 락 설정
    await sb
      .from("feed_posts")
      .update({
        analysis_result: {
          ...post.analysis_result,
          processing_started_at: new Date().toISOString(),
        },
      })
      .eq("id", id);

    // 이미지 다운로드 → analyze-image API 호출
    const imgRes = await fetch(post.image_url);
    if (!imgRes.ok) {
      return NextResponse.json({ error: `image fetch failed (${imgRes.status})` }, { status: 500 });
    }
    const blob = await imgRes.blob();
    const fd = new FormData();
    fd.append("file", blob, `feed-${post.id}.jpg`);
    fd.append("species", post.pet_species || "cat");
    fd.append("description", post.description || "");

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.get("host")}`;
    const analyzeRes = await fetch(`${baseUrl}/api/analyze-image`, {
      method: "POST",
      body: fd,
    });
    const analyze = await analyzeRes.json();

    if (!analyzeRes.ok || !analyze?.analysis || !analyze?.severity) {
      // 분석 실패: 락 풀고 fallback 유지
      await sb
        .from("feed_posts")
        .update({
          analysis_result: {
            ...post.analysis_result,
            processing_started_at: null,
          },
        })
        .eq("id", id);
      return NextResponse.json({
        error: analyze?.error || "analyze failed",
        detail: analyze?.detail,
      }, { status: 500 });
    }

    // 성공: AI 결과로 업데이트
    const newSeverity = analyze.severity as "normal" | "mild" | "moderate" | "urgent";
    const newAnalysis = {
      severity: newSeverity,
      symptoms: [
        newSeverity === "urgent" ? "긴급" :
        newSeverity === "moderate" ? "주의" :
        newSeverity === "mild" ? "관찰" : "정상"
      ],
      summary: (analyze.analysis || "").slice(0, 300),
      recommendation: "자세한 내용은 피드 상세 페이지에서 확인하세요.",
      fgs_total: analyze.fgs_total ?? null,
      fgs_breakdown: analyze.fgs_breakdown ?? null,
      severity_score: analyze.severity_score ?? null,
      bboxes: analyze.bboxes ?? [],
      // 다중 사진 정보 보존
      image_urls: post.analysis_result?.image_urls,
      photo_count: post.analysis_result?.photo_count,
      // pending_ai 제거됨
    };

    const requireExpert = newSeverity === "moderate" || newSeverity === "urgent";
    const updatePayload: Record<string, any> = {
      analysis_result: newAnalysis,
      description: (post.description || "").replace(/\n\n---\n🤖 AI 이미지 분석:[\s\S]*$/, "") +
        "\n\n---\n🤖 AI 이미지 분석:\n" + (analyze.analysis || ""),
    };
    if (requireExpert) {
      updatePayload.request_expert = true;
      updatePayload.expert_status = "pending";
    }

    await sb.from("feed_posts").update(updatePayload).eq("id", id);

    return NextResponse.json({ ok: true, severity: newSeverity });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "server error" }, { status: 500 });
  }
}
