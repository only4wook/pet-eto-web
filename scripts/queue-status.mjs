// 큐 상태 진단 스크립트
// usage: node scripts/queue-status.mjs
const BASE_URL = process.env.REANALYZE_QUEUE_API_URL || "https://www.peteto.kr/api/reanalyze-queue";
const TOKEN = process.env.REANALYZE_QUEUE_TOKEN;

async function main() {
  if (!TOKEN) throw new Error("REANALYZE_QUEUE_TOKEN is required");
  const res = await fetch(BASE_URL, {
    method: "GET",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || `status failed (${res.status})`);

  console.log("═══════════════════════════════════════════");
  console.log("🔍 펫에토 재분석 큐 상태");
  console.log("═══════════════════════════════════════════");
  console.log(`조회 시각: ${json.now}`);
  console.log("");
  console.log("📊 요약:");
  console.log(`  ✅ 지금 실행 가능 (ready)        : ${json.summary.ready_now}개`);
  console.log(`  ⏰ 쿼터 대기 중 (deferred)       : ${json.summary.deferred_future}개`);
  console.log(`  🔄 처리 중 (processing)          : ${json.summary.processing}개`);
  console.log(`  ❌ 실패 (failed)                 : ${json.summary.failed}개`);
  console.log(`  ✔️  완료 총계 (done)              : ${json.summary.done_total}개`);
  console.log("");

  if (json.deferred.length > 0) {
    console.log("⏰ 쿼터 대기 중인 작업 (자동 재시도 예정):");
    for (const d of json.deferred) {
      const hrs = Math.floor(d.minutes_until_retry / 60);
      const mins = d.minutes_until_retry % 60;
      const wait = hrs > 0 ? `${hrs}시간 ${mins}분 뒤` : `${mins}분 뒤`;
      console.log(`  • ${d.queue_id}`);
      console.log(`    feed_post: ${d.feed_post_id}`);
      console.log(`    재시도 #${d.retry_count} → ${wait} (${d.next_retry_at})`);
      if (d.last_error) console.log(`    last_error: ${d.last_error}`);
    }
    console.log("");
    console.log("💡 TIP: 이 작업들은 Gemini 쿼터 한도 초과로 자동 지연되었습니다.");
    console.log("   수동으로 queued_at을 now()로 재설정하지 마세요 — 또 429 납니다.");
    console.log("   내일 오전에 다시 실행하시면 자연스럽게 처리됩니다.");
  } else if (json.summary.ready_now === 0 && json.summary.processing === 0) {
    console.log("🎉 모든 큐가 비어있거나 완료되었습니다.");
  } else if (json.summary.ready_now > 0) {
    console.log(`▶️  실행 준비된 작업이 ${json.summary.ready_now}개 있습니다.`);
    console.log(`   node scripts/process-feed-reanalysis-queue.mjs 3 1`);
  }
  console.log("═══════════════════════════════════════════");
}

main().catch((e) => {
  console.error("ERROR:", e.message || e);
  process.exit(1);
});
