import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// 댓글/전문가 답변 등이 달리면 글 작성자에게 이메일 알림 발송.
// Resend API 사용 (RESEND_API_KEY 필요). 없으면 silently skip.
//
// POST body:
//  { type: "feed_comment" | "expert_answer", post_id: string, actor_nickname?: string }

export const maxDuration = 30;

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

type NotifyType = "feed_comment" | "expert_answer";

export async function POST(req: NextRequest) {
  try {
    const { type, post_id, actor_nickname }: {
      type: NotifyType;
      post_id: string;
      actor_nickname?: string;
    } = await req.json();
    if (!type || !post_id) {
      return NextResponse.json({ error: "type/post_id 필요" }, { status: 400 });
    }

    // 게시물 → 작성자 → 이메일 조회
    const { data: post } = await sb
      .from("feed_posts")
      .select("id, author_id, description")
      .eq("id", post_id)
      .single();
    if (!post) {
      return NextResponse.json({ error: "post not found" }, { status: 404 });
    }

    const { data: author } = await sb
      .from("users")
      .select("id, email, nickname, email_notifications_enabled")
      .eq("id", post.author_id)
      .single();
    if (!author?.email) {
      return NextResponse.json({ ok: true, skipped: "no email" });
    }
    // 사용자가 알림 끔 (기본은 켜짐)
    if (author.email_notifications_enabled === false) {
      return NextResponse.json({ ok: true, skipped: "user disabled" });
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      // 키 미설정 시 in-app notification만 등록되고 이메일은 스킵
      return NextResponse.json({ ok: true, skipped: "no RESEND_API_KEY" });
    }

    // 이메일 본문
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.peteto.kr";
    const postUrl = `${baseUrl}/feed/${post_id}`;
    const subject = type === "expert_answer"
      ? "🩺 전문가가 답변을 남겼어요 — 펫에토"
      : "💬 새 댓글이 달렸어요 — 펫에토";

    const actor = actor_nickname || (type === "expert_answer" ? "전문가" : "회원");
    const action = type === "expert_answer" ? "전문가 답변" : "댓글";
    const preview = (post.description || "").slice(0, 80);

    const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #FAFAFA; padding: 20px;">
  <div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 12px; overflow: hidden; border: 1px solid #E5E7EB;">
    <div style="background: #FF6B35; padding: 18px 24px; color: #fff;">
      <h1 style="margin: 0; font-size: 18px; font-weight: 700;">P.E.T 펫에토</h1>
    </div>
    <div style="padding: 24px;">
      <p style="margin: 0 0 12px; font-size: 15px; color: #1D1D1F; font-weight: 600;">
        ${author.nickname || "회원"}님, 새 ${action}이 도착했어요
      </p>
      <p style="margin: 0 0 18px; font-size: 13px; color: #6B7280; line-height: 1.6;">
        <b>${actor}</b>님이 회원님의 게시글에 ${action}을 남겼습니다.
      </p>
      <div style="background: #F9FAFB; border-left: 3px solid #FF6B35; padding: 12px 14px; margin-bottom: 20px; font-size: 13px; color: #4B5563;">
        ${preview}${(post.description || "").length > 80 ? "..." : ""}
      </div>
      <a href="${postUrl}" style="display: inline-block; background: #FF6B35; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 14px;">
        지금 확인하기 →
      </a>
      <p style="margin: 24px 0 0; font-size: 11px; color: #9CA3AF; line-height: 1.6;">
        이 알림이 불필요하시면 마이페이지에서 이메일 알림을 끌 수 있습니다.<br>
        © 2026 P.E.T 펫에토
      </p>
    </div>
  </div>
</body>
</html>`.trim();

    const sendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "P.E.T 펫에토 <noreply@peteto.kr>",
        to: [author.email],
        subject,
        html,
      }),
    });

    if (!sendRes.ok) {
      const errText = await sendRes.text().catch(() => "");
      return NextResponse.json({
        error: `Resend 발송 실패: ${sendRes.status}`,
        detail: errText.slice(0, 200),
      }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "server error" }, { status: 500 });
  }
}
