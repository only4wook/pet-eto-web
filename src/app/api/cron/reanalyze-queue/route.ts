import { NextRequest, NextResponse } from "next/server";

// Vercel Cron이 호출하는 wrapper. /api/reanalyze-queue를 토큰과 함께 호출.
// Vercel cron은 Authorization: Bearer <CRON_SECRET>을 자동으로 붙임.
export const maxDuration = 60;

export async function GET(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  const authHeader = req.headers.get("authorization") || "";
  if (cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const queueToken = process.env.REANALYZE_QUEUE_TOKEN;
  if (!queueToken) {
    return NextResponse.json({ error: "REANALYZE_QUEUE_TOKEN 미설정" }, { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.get("host")}`;
  const res = await fetch(`${baseUrl}/api/reanalyze-queue`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${queueToken}`,
    },
    body: JSON.stringify({ batchSize: 10 }),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json({ ok: res.ok, status: res.status, result: data });
}
