import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// anon key 강제 (RLS 우회는 SECURITY DEFINER 함수로)
const sb = createClient(
  "https://akhtlrcmvftfacaroeiq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY",
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY" } },
  },
);

const ADMIN_PASSWORD = "peteto2026";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password, table, id, imageUrl } = body;

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
    }

    if (!table || !id) {
      return NextResponse.json({ error: "table과 id가 필요합니다." }, { status: 400 });
    }

    const errors: string[] = [];

    // Storage 이미지 삭제
    if (imageUrl) {
      const path = imageUrl.split("/feed-images/")[1];
      if (path) await sb.storage.from("feed-images").remove([path]);
    }

    if (table === "posts") {
      // 댓글 삭제 (post_id가 text일 수 있으므로 text로 비교)
      const r1 = await sb.from("comments").delete().eq("post_id", id);
      if (r1.error) errors.push("comments: " + r1.error.message);

      // 좋아요 삭제 (target_id가 text)
      const r2 = await sb.from("likes").delete().eq("target_id", id);
      if (r2.error) errors.push("likes: " + r2.error.message);

      // 글 삭제
      const r3 = await sb.from("posts").delete().eq("id", id);
      if (r3.error) errors.push("posts: " + r3.error.message);

    } else if (table === "feed_posts") {
      const r1 = await sb.from("feed_comments").delete().eq("feed_post_id", id);
      if (r1.error) errors.push("feed_comments: " + r1.error.message);

      const r2 = await sb.from("feed_likes").delete().eq("feed_post_id", id);
      if (r2.error) errors.push("feed_likes: " + r2.error.message);

      const r3 = await sb.from("feed_posts").delete().eq("id", id);
      if (r3.error) errors.push("feed_posts: " + r3.error.message);

    } else {
      return NextResponse.json({ error: "지원하지 않는 테이블" }, { status: 400 });
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 });
  }
}
