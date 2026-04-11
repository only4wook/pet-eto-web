"use client";
import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../lib/store";

// 한국 시간(KST) 기준 오늘 날짜 (YYYY-MM-DD)
function getKSTDate(): string {
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  return kst.toISOString().split("T")[0];
}

async function checkDailyAttendance(userId: string) {
  const today = getKSTDate();

  // 오늘(KST 기준) 이미 출석했는지 확인
  // KST 00:00 = UTC 15:00 (전날), KST 23:59 = UTC 14:59 (당일)
  const kstStart = today + "T00:00:00+09:00";
  const kstEnd = today + "T23:59:59+09:00";

  const { data: existing } = await supabase
    .from("point_logs")
    .select("id")
    .eq("user_id", userId)
    .eq("reason", "일일 출석")
    .gte("created_at", new Date(kstStart).toISOString())
    .lte("created_at", new Date(kstEnd).toISOString())
    .maybeSingle();

  if (existing) return false; // 이미 출석함

  // 출석 포인트 +3P 지급
  await supabase.from("point_logs").insert({
    user_id: userId,
    amount: 3,
    reason: "일일 출석",
  });
  await supabase.rpc("add_points", { uid: userId, pts: 3 });
  return true; // 출석 성공
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAppStore((s) => s.setUser);
  const checkedRef = useRef(false); // 중복 호출 방지

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      const { data } = await supabase
        .from("users").select("*").eq("id", session.user.id).single();
      if (!data) return;

      setUser(data);

      // 출석 체크 (1회만)
      if (!checkedRef.current) {
        checkedRef.current = true;
        const attended = await checkDailyAttendance(data.id);
        if (attended) {
          // 포인트 업데이트된 유저 다시 가져오기
          const { data: updated } = await supabase
            .from("users").select("*").eq("id", data.id).single();
          if (updated) setUser(updated);
        }
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from("users").select("*").eq("id", session.user.id).single();
          if (data) setUser(data);
        } else {
          setUser(null);
          checkedRef.current = false; // 로그아웃 시 리셋
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser]);

  return <>{children}</>;
}
