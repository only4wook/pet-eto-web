import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY";

const sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { headers: { Authorization: `Bearer ${SUPABASE_ANON_KEY}` } },
});

async function main() {
  const limit = Number(process.argv[2] || "200");
  const reason = process.argv[3] || "manual_batch";
  const priority = Number(process.argv[4] || "100");

  const { data, error } = await sb.rpc("enqueue_recent_feed_reanalysis", {
    p_limit: limit,
    p_reason: reason,
    p_priority: priority,
  });
  if (error) throw new Error(error.message);
  console.log("enqueue result:", data);
}

main().catch((e) => {
  console.error(e.message || e);
  process.exit(1);
});
