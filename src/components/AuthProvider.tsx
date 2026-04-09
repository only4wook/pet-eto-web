"use client";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../lib/store";

async function checkDailyAttendance(userId: string) {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  // 오늘 이미 출석했는지 확인
  const { data: existing } = await supabase
    .from("point_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("reason", "일일 출석")
    .gte("created_at", today + "T00:00:00Z")
    .lte("created_at", today + "T23:59:59Z")
    .maybeSingle();

  if (existing) return; // 이미 출석함

  // 출석 포인트 +3P 지급
  await supabase.from("point_logs").insert({
    user_id: userId,
    amount: 3,
    reason: "일일 출석",
  });
  await supabase.rpc("add_points", { uid: userId, pts: 3 });
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()
          .then(async ({ data }) => {
            if (data) {
              setUser(data);
              // 일일 출석 체크
              await checkDailyAttendance(data.id);
              // 포인트 업데이트된 유저 다시 가져오기
              const { data: updated } = await supabase
                .from("users").select("*").eq("id", data.id).single();
              if (updated) setUser(updated);
            }
          });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from("users").select("*").eq("id", session.user.id).single();
          if (data) {
            setUser(data);
            await checkDailyAttendance(data.id);
            const { data: updated } = await supabase
              .from("users").select("*").eq("id", data.id).single();
            if (updated) setUser(updated);
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
