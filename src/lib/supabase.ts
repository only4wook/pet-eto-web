import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://akhtlrcmvftfacaroeiq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFraHRscmNtdmZ0ZmFjYXJvZWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzOTgzODUsImV4cCI6MjA5MDk3NDM4NX0.CuJhuuSZFwnqMgFd4nZe9QjJqWGyW6p78gGl9C4aHuY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
