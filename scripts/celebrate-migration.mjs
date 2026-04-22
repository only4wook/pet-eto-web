// 맥북 이전 완료 축하 텔레그램 전송
// usage: node scripts/celebrate-migration.mjs
import os from "os";

const TOKEN = process.env.TELEGRAM_BOT_TOKEN || "8689419324:AAGIqPsRE0z_YcKAk11KPNdLihl7rwdUQMU";
const CHAT = process.env.DAILY_DIGEST_TELEGRAM_CHAT || "1151452616";

const text = [
  "🎉 맥북 세팅 완료!",
  "",
  `💻 머신: ${os.hostname()}`,
  `🖥️ 플랫폼: ${os.platform()} ${os.arch()}`,
  `⏰ 완료: ${new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}`,
  "",
  "✅ 체크리스트 모두 통과",
  "✅ 펫에토 로컬 실행 확인",
  "✅ Claude Code · Cursor 복원 완료",
  "",
  "대욱님, 이제 맥에서 펫에토 빌드하세요 🐾",
  "매일 아침 8시에 브리핑이 도착합니다.",
].join("\n");

const body = new URLSearchParams({
  chat_id: CHAT,
  text,
  disable_web_page_preview: "true",
}).toString();

try {
  const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded; charset=utf-8" },
    body,
  });
  const json = await res.json();
  if (json.ok) {
    console.log("🎉 텔레그램 축하 메시지 전송 완료!");
    console.log("대욱님의 맥북 여정이 시작됐습니다 🐾");
  } else {
    console.error("전송 실패:", json);
    process.exit(1);
  }
} catch (e) {
  console.error("ERROR:", e.message || e);
  process.exit(1);
}
