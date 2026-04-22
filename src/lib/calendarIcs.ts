// Google Calendar ICS URL 파서 — 외부 의존성 없이 최소 기능만 구현
// (OAuth 복잡도 회피를 위해 Google 비공개 ICS 주소를 사용)

export interface CalendarEvent {
  summary: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  allDay: boolean;
}

// ICS datetime → JS Date. YYYYMMDD 또는 YYYYMMDDTHHMMSSZ 지원
function parseIcsDate(raw: string): { date: Date; allDay: boolean } {
  const clean = raw.trim();
  // 올데이 (YYYYMMDD, 8자리)
  if (/^\d{8}$/.test(clean)) {
    const y = Number(clean.slice(0, 4));
    const m = Number(clean.slice(4, 6)) - 1;
    const d = Number(clean.slice(6, 8));
    return { date: new Date(Date.UTC(y, m, d)), allDay: true };
  }
  // UTC (YYYYMMDDTHHMMSSZ)
  if (/^\d{8}T\d{6}Z$/.test(clean)) {
    const y = Number(clean.slice(0, 4));
    const m = Number(clean.slice(4, 6)) - 1;
    const d = Number(clean.slice(6, 8));
    const hh = Number(clean.slice(9, 11));
    const mm = Number(clean.slice(11, 13));
    const ss = Number(clean.slice(13, 15));
    return { date: new Date(Date.UTC(y, m, d, hh, mm, ss)), allDay: false };
  }
  // Floating (YYYYMMDDTHHMMSS) — KST로 간주
  if (/^\d{8}T\d{6}$/.test(clean)) {
    const y = Number(clean.slice(0, 4));
    const m = Number(clean.slice(4, 6)) - 1;
    const d = Number(clean.slice(6, 8));
    const hh = Number(clean.slice(9, 11));
    const mm = Number(clean.slice(11, 13));
    const ss = Number(clean.slice(13, 15));
    // KST = UTC + 9
    return { date: new Date(Date.UTC(y, m, d, hh - 9, mm, ss)), allDay: false };
  }
  return { date: new Date(NaN), allDay: false };
}

// ICS 줄 이음 처리: 다음 줄이 공백이나 탭으로 시작하면 이전 줄에 이어붙임
function unfoldLines(text: string): string[] {
  const raw = text.replace(/\r\n/g, "\n").split("\n");
  const out: string[] = [];
  for (const line of raw) {
    if (line.startsWith(" ") || line.startsWith("\t")) {
      if (out.length > 0) out[out.length - 1] += line.slice(1);
    } else {
      out.push(line);
    }
  }
  return out;
}

// VEVENT 블록 추출 → 이벤트 객체 변환
export function parseIcs(icsText: string): CalendarEvent[] {
  const lines = unfoldLines(icsText);
  const events: CalendarEvent[] = [];
  let current: Partial<CalendarEvent> & { _startRaw?: string; _endRaw?: string } | null = null;

  for (const line of lines) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current && current._startRaw && current.summary) {
        const { date: startDate, allDay } = parseIcsDate(current._startRaw);
        const endDate = current._endRaw ? parseIcsDate(current._endRaw).date : startDate;
        if (!isNaN(startDate.getTime())) {
          events.push({
            summary: current.summary,
            start: startDate,
            end: endDate,
            location: current.location,
            description: current.description,
            allDay,
          });
        }
      }
      current = null;
      continue;
    }
    if (!current) continue;

    // KEY[;PARAM]:VALUE
    const colonIdx = line.indexOf(":");
    if (colonIdx < 0) continue;
    const keyPart = line.slice(0, colonIdx);
    const value = line.slice(colonIdx + 1);
    const key = keyPart.split(";")[0].toUpperCase();

    switch (key) {
      case "SUMMARY":
        current.summary = unescapeIcs(value);
        break;
      case "LOCATION":
        current.location = unescapeIcs(value);
        break;
      case "DESCRIPTION":
        current.description = unescapeIcs(value);
        break;
      case "DTSTART":
        current._startRaw = value;
        break;
      case "DTEND":
        current._endRaw = value;
        break;
    }
  }
  return events;
}

function unescapeIcs(s: string): string {
  return s.replace(/\\n/g, "\n").replace(/\\,/g, ",").replace(/\\;/g, ";").replace(/\\\\/g, "\\");
}

// KST 기준 오늘·내일 범위 이벤트 필터
export function filterEventsByRange(events: CalendarEvent[], start: Date, end: Date): CalendarEvent[] {
  return events
    .filter((e) => e.start.getTime() < end.getTime() && e.end.getTime() >= start.getTime())
    .sort((a, b) => a.start.getTime() - b.start.getTime());
}

// KST 오늘 00:00 ~ 내일 24:00 범위
export function getKstDayRange(anchor = new Date()): { today: Date; tomorrowEnd: Date } {
  const kstOffset = 9 * 60 * 60 * 1000;
  const kstNow = new Date(anchor.getTime() + kstOffset);
  const todayKst = new Date(Date.UTC(
    kstNow.getUTCFullYear(), kstNow.getUTCMonth(), kstNow.getUTCDate(), 0, 0, 0
  ));
  const today = new Date(todayKst.getTime() - kstOffset);
  const tomorrowEnd = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);
  return { today, tomorrowEnd };
}

// 이벤트를 텔레그램 포맷으로
export function formatEventForTelegram(e: CalendarEvent): string {
  const kstOffset = 9 * 60 * 60 * 1000;
  const start = new Date(e.start.getTime() + kstOffset);
  const hh = String(start.getUTCHours()).padStart(2, "0");
  const mm = String(start.getUTCMinutes()).padStart(2, "0");
  const timeStr = e.allDay ? "종일" : `${hh}:${mm}`;
  const loc = e.location ? ` @${e.location.slice(0, 20)}` : "";
  return `  • [${timeStr}] ${e.summary}${loc}`;
}
