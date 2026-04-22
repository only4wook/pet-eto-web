// Vercel Cron 수동 테스트 — 배포 후 즉시 브리핑 받아보기
// usage: node scripts/test-daily-digest.mjs
const TOKEN = process.env.DAILY_DIGEST_TOKEN;
const URL = process.env.DIGEST_API_URL || "https://www.peteto.kr/api/cron/daily-digest";

if (!TOKEN) {
  console.error("❌ DAILY_DIGEST_TOKEN 환경변수가 필요합니다.");
  console.error("   PowerShell: $env:DAILY_DIGEST_TOKEN=\"your-token\"");
  console.error("   Bash:       export DAILY_DIGEST_TOKEN=\"your-token\"");
  process.exit(1);
}

console.log(`📤 브리핑 요청 → ${URL}`);

try {
  const res = await fetch(URL, {
    method: "GET",
    headers: { Authorization: `Bearer ${TOKEN}` },
  });
  const json = await res.json();
  if (!res.ok) {
    console.error("❌ 실패:", json);
    process.exit(1);
  }
  console.log("✅ 성공!");
  console.log("");
  console.log(`📅 오늘 일정: ${json.calendar_today_count}건`);
  console.log(`📅 내일 일정: ${json.calendar_tomorrow_count}건`);
  console.log(`👥 24h 신규 가입: ${json.stats.newUsers24h}명`);
  console.log(`📷 24h 신규 피드: ${json.stats.newFeeds24h}건`);
  console.log(`🩺 전문가 답변 대기: ${json.stats.expertPending}건`);
  console.log("");
  console.log("💬 텔레그램을 확인하세요!");
  console.log("");
  console.log("─── 미리보기 ───");
  console.log(json.preview);
} catch (e) {
  console.error("ERROR:", e.message || e);
  process.exit(1);
}
