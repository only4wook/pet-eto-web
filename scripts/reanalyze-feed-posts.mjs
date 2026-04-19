import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY";
const ANALYZE_URL = process.env.REANALYZE_API_URL || "https://www.peteto.kr/api/analyze-image";

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
});

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isSeverityHigher(next, prev) {
  const rank = { normal: 0, mild: 1, moderate: 2, urgent: 3 };
  return (rank[next] ?? 0) > (rank[prev] ?? 0);
}

async function fetchAsBlob(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`이미지 다운로드 실패(${res.status})`);
  return await res.blob();
}

async function analyzePost(post) {
  const blob = await fetchAsBlob(post.image_url);
  const fd = new FormData();
  const ext = blob.type.includes("png") ? "png" : "jpg";
  fd.append("file", blob, `post-${post.id}.${ext}`);
  fd.append("species", post.pet_species || "cat");
  fd.append("description", post.description || "");
  const res = await fetch(ANALYZE_URL, { method: "POST", body: fd });
  const json = await res.json();
  if (!res.ok || !json?.analysis) {
    throw new Error(json?.error || `분석 API 실패(${res.status})`);
  }
  return json;
}

function fallbackConservativeAnalysis(post) {
  const prev = post.analysis_result || {};
  const prevSeverity = prev.severity || "normal";
  const nextSeverity = prevSeverity === "normal" ? "mild" : prevSeverity;
  return {
    severity: nextSeverity,
    analysis:
      "AI 재평가 API 호출이 지연되어 보수 판정으로 전환했습니다. 증상이 의심되면 전문가 답변 요청 또는 재촬영 후 재분석을 권장합니다.",
    fgs_total: prev.fgs_total ?? null,
    fgs_breakdown: prev.fgs_breakdown ?? null,
    severity_score: prev.severity_score ?? null,
    bboxes: prev.bboxes ?? [],
    triage_flags: prev.triage_flags ?? null,
  };
}

async function main() {
  const limit = Number(process.argv[2] || "200");
  console.log(`Reanalyze start. limit=${limit}, url=${ANALYZE_URL}`);

  const { data: posts, error } = await sb
    .from("feed_posts")
    .select("id, image_url, pet_species, description, analysis_result, request_expert, expert_status")
    .not("image_url", "is", null)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw new Error(`피드 조회 실패: ${error.message}`);
  if (!posts?.length) {
    console.log("대상 피드가 없습니다.");
    return;
  }

  let updated = 0;
  let escalated = 0;
  let failed = 0;
  const report = [];

  for (const post of posts) {
    try {
      const oldSeverity = post.analysis_result?.severity || "normal";
      let ai;
      try {
        ai = await analyzePost(post);
      } catch (apiErr) {
        ai = fallbackConservativeAnalysis(post);
        console.log(`[FALLBACK] ${post.id}: ${apiErr.message}`);
      }
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
      if (updateErr) throw new Error(`업데이트 실패: ${updateErr.message}`);

      updated += 1;
      if (isSeverityHigher(newSeverity, oldSeverity)) escalated += 1;
      report.push({ id: post.id, oldSeverity, newSeverity, expert: updatePayload.request_expert });
      console.log(`[OK] ${post.id} ${oldSeverity} -> ${newSeverity} expert=${updatePayload.request_expert}`);
      await sleep(250);
    } catch (e) {
      failed += 1;
      console.log(`[FAIL] ${post.id}: ${e.message}`);
    }
  }

  console.log("");
  console.log("=== Reanalyze Summary ===");
  console.log(`total=${posts.length} updated=${updated} escalated=${escalated} failed=${failed}`);
  console.log("top changes:");
  report.slice(0, 20).forEach((r) => {
    console.log(`- ${r.id}: ${r.oldSeverity} -> ${r.newSeverity} (expert=${r.expert})`);
  });
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
