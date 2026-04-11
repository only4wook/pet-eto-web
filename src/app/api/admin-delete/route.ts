import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabaseAdmin = createClient(
  "https://akhtlrcmvftfacaroeiq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY",
  { auth: { persistSession: false, autoRefreshToken: false } },
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

    // Storage 이미지 삭제 (피드인 경우)
    if (imageUrl) {
      const path = imageUrl.split("/feed-images/")[1];
      if (path) {
        await supabaseAdmin.storage.from("feed-images").remove([path]);
      }
    }

    // RPC 함수로 삭제 (SECURITY DEFINER → RLS 우회)
    const { data, error } = await supabaseAdmin.rpc("admin_delete_post", {
      target_table: table,
      target_id: id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, result: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 });
  }
}
