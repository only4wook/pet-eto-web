import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// 서버 사이드에서 이미지를 Supabase Storage에 업로드
// 클라이언트에서 HEIC 변환 실패 시 서버에서 처리
const supabaseStorage = createClient(
  "https://akhtlrcmvftfacaroeiq.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY",
  { auth: { persistSession: false, autoRefreshToken: false } },
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "파일이 없습니다." }, { status: 400 });
    }

    // 파일을 ArrayBuffer로 읽기
    const buffer = Buffer.from(await file.arrayBuffer());
    const ts = Date.now();
    const rand = Math.random().toString(36).slice(2, 8);
    const fileName = `feed-${ts}-${rand}.jpg`;

    // Supabase Storage에 업로드 (항상 image/jpeg로)
    const { error } = await supabaseStorage.storage
      .from("feed-images")
      .upload(fileName, buffer, { contentType: "image/jpeg", upsert: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data } = supabaseStorage.storage.from("feed-images").getPublicUrl(fileName);

    return NextResponse.json({ url: data.publicUrl, fileName });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "서버 오류" }, { status: 500 });
  }
}
