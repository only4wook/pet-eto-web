import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  parseIcs,
  filterEventsByRange,
  getKstDayRange,
  formatEventForTelegram,
  type CalendarEvent,
} from "../../../../lib/calendarIcs";

// Vercel Cron: 매일 KST 08:00 = UTC 23:00
// vercel.json에 스케줄 "0 23 * * *" 등록

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function fetchCalendarEvents(): Promise<{ today: CalendarEvent[]; tomorrow: CalendarEvent[] }> {
  const icsUrl = process.env.GCAL_ICS_URL;
  if (!icsUrl) return { today: [], tomorrow: [] };

  try {
    const res = await fetch(icsUrl, { cache: "no-store" });
    if (!res.ok) return { today: [], tomorrow: [] };
    const text = await res.text();
    const events = parseIcs(text);

    const { today: todayStart, tomorrowEnd } = getKstDayRange();
    const tomorrowStart = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

    const todayEvents = filterEventsByRange(events, todayStart, tomorrowStart);
    const tomorrowEvents = filterEventsByRange(events, tomorrowStart, tomorrowEnd);

    return { today: todayEvents, tomorrow: tomorrowEvents };
  } catch (e) {
    console.error("ICS fetch error:", e);
    return { today: [], tomorrow: [] };
  }
}

async function fetchPetEtoStats(): Promise<{
  newUsers24h: number;
  newFeeds24h: number;
  expertPending: number;
  queueReady: number;
  queueDeferred: number;
}> {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const nowIso = new Date().toISOString();

  const [usersRes, feedsRes, expertRes, queueReadyRes, queueDefRes] = await Promise.all([
    sb.from("users").select("id", { count: "exact", head: true }).gte("created_at", oneDayAgo),
    sb.from("feed_posts").select("id", { count: "exact", head: true }).gte("created_at", oneDayAgo),
    sb.from("feed_posts").select("id", { count: "exact", head: true })
      .eq("request_expert", true).eq("expert_status", "pending"),
    sb.from("feed_reanalysis_queue").select("id", { count: "exact", head: true })
      .eq("status", "pending").lte("queued_at", nowIso),
    sb.from("feed_reanalysis_queue").select("id", { count: "exact", head: true })
      .eq("status", "pending").gt("queued_at", nowIso),
  ]);

  return {
    newUsers24h: usersRes.count || 0,
    newFeeds24h: feedsRes.count || 0,
    expertPending: expertRes.count || 0,
    queueReady: queueReadyRes.count || 0,
    queueDeferred: queueDefRes.count || 0,
  };
}

async function sendTelegram(text: string): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN || "8689419324:AAGIqPsRE0z_YcKAk11KPNdLihl7rwdUQMU";
  const chatId = process.env.DAILY_DIGEST_TELEGRAM_CHAT || "1151452616";
  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

function buildDigest(
  calendar: { today: CalendarEvent[]; tomorrow: CalendarEvent[] },
  stats: Awaited<ReturnType<typeof fetchPetEtoStats>>,
  dateStr: string,
  dayOfWeek: string
): string {
  const lines: string[] = [];
  lines.push(`🐾 펫에토 데일리 브리핑`);
  lines.push(`📅 ${dateStr} (${dayOfWeek})`);
  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push("");

  // 캘린더
  lines.push(`📆 오늘 일정`);
  if (calendar.today.length === 0) {
    lines.push(`  · 일정 없음 — 제품에 집중하세요`);
  } else {
    calendar.today.forEach((e) => lines.push(formatEventForTelegram(e)));
  }
  lines.push("");

  if (calendar.tomorrow.length > 0) {
    lines.push(`📆 내일 일정`);
    calendar.tomorrow.slice(0, 5).forEach((e) => lines.push(formatEventForTelegram(e)));
    lines.push("");
  }

  // 펫에토 현황
  lines.push(`📊 펫에토 현황 (24h)`);
  lines.push(`  · 신규 가입: ${stats.newUsers24h}명`);
  lines.push(`  · 신규 피드: ${stats.newFeeds24h}건`);
  lines.push(`  · 전문가 답변 대기: ${stats.expertPending}건`);
  if (stats.queueReady > 0) {
    lines.push(`  ⚠️ AI 재분석 대기: ${stats.queueReady}건 (즉시 실행 가능)`);
  }
  if (stats.queueDeferred > 0) {
    lines.push(`  ⏰ 쿼터 대기 중: ${stats.queueDeferred}건`);
  }
  lines.push("");

  // 오늘의 행동
  lines.push(`🎯 오늘의 포커스`);
  if (stats.expertPending >= 3) {
    lines.push(`  · 전문가 답변 대기가 쌓이고 있어요. 수의사 영입 진행 확인.`);
  }
  if (stats.newFeeds24h === 0 && stats.newUsers24h === 0) {
    lines.push(`  · 유입이 없는 하루였습니다. 바이럴 한 장·콘텐츠 1개 고민하기.`);
  } else if (stats.newFeeds24h >= 5) {
    lines.push(`  · 활발한 하루! 상위 피드 퀄리티 체크 → 전문가 답변 유도.`);
  } else {
    lines.push(`  · 꾸준히 성장 중. 한 명의 보호자라도 더 감동시키기.`);
  }
  lines.push("");
  lines.push(`━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`좋은 하루 되세요 🙏 대욱님`);

  return lines.join("\n");
}

async function handleDigest(req: NextRequest): Promise<NextResponse> {
  // Vercel Cron은 자체적으로 CRON_SECRET or x-vercel-cron 헤더를 붙임
  // 수동 호출 시 token 체크
  const authHeader = req.headers.get("authorization") || "";
  const vercelCron = req.headers.get("x-vercel-cron");
  const token = authHeader.replace("Bearer ", "");
  const expected = process.env.DAILY_DIGEST_TOKEN || process.env.CRON_SECRET;

  const isAuthorized = Boolean(vercelCron) || (expected && token === expected);
  if (!isAuthorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const [calendar, stats] = await Promise.all([fetchCalendarEvents(), fetchPetEtoStats()]);

    // KST 날짜 계산
    const kstNow = new Date(Date.now() + 9 * 60 * 60 * 1000);
    const dateStr = `${kstNow.getUTCFullYear()}-${String(kstNow.getUTCMonth() + 1).padStart(2, "0")}-${String(kstNow.getUTCDate()).padStart(2, "0")}`;
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];
    const dayOfWeek = dayNames[kstNow.getUTCDay()];

    const text = buildDigest(calendar, stats, dateStr, dayOfWeek);
    const sent = await sendTelegram(text);

    return NextResponse.json({
      ok: true,
      sent,
      calendar_today_count: calendar.today.length,
      calendar_tomorrow_count: calendar.tomorrow.length,
      stats,
      preview: text.slice(0, 500),
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "digest failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  return handleDigest(req);
}

export async function POST(req: NextRequest) {
  return handleDigest(req);
}
