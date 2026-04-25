import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { isAdmin } from "../../../../../lib/security";

/**
 * Exemplar 관리 (목록 / 비활성화).
 *
 * GET  /api/admin/learning/exemplars?password=&category=&limit=20
 *      → 활성 exemplar 목록
 * POST /api/admin/learning/exemplars
 *      Body: { password, action: "deactivate" | "reactivate", id }
 *      → 특정 exemplar on/off (사람 검수용)
 */

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const password = url.searchParams.get("password") || "";
  if (!isAdmin(password)) return NextResponse.json({ error: "권한 없음" }, { status: 403 });

  const category = url.searchParams.get("category");
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "20", 10), 100);
  const includeInactive = url.searchParams.get("include_inactive") === "1";

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "service key 누락" }, { status: 500 });

  const sb = createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let query = sb
    .from("ai_exemplars")
    .select("id, category, question, exemplar_response, score, active, promoted_at, retired_at")
    .order("promoted_at", { ascending: false })
    .limit(limit);

  if (!includeInactive) query = query.eq("active", true);
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    success: true,
    count: data?.length || 0,
    exemplars: data || [],
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { password, action, id } = body;
  if (!isAdmin(password || "")) return NextResponse.json({ error: "권한 없음" }, { status: 403 });
  if (!["deactivate", "reactivate"].includes(action)) {
    return NextResponse.json({ error: "action 은 deactivate | reactivate" }, { status: 400 });
  }
  if (!id) return NextResponse.json({ error: "id 필요" }, { status: 400 });

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) return NextResponse.json({ error: "service key 누락" }, { status: 500 });

  const sb = createClient(SUPABASE_URL, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const update: any = action === "deactivate"
    ? { active: false, retired_at: new Date().toISOString() }
    : { active: true, retired_at: null };

  const { error } = await sb.from("ai_exemplars").update(update).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, id, action });
}
