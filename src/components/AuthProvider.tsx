"use client";
import { useEffect, useRef, useState } from "react";
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
  const checkedRef = useRef(false);
  const [attendancePopup, setAttendancePopup] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      let { data } = await supabase
        .from("users").select("*").eq("id", session.user.id).single();

      // 소셜 로그인 시 users 테이블에 프로필이 없으면 자동 생성
      if (!data) {
        const u = session.user;
        const newProfile = {
          id: u.id,
          email: u.email || "",
          nickname: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "유저",
          avatar_url: u.user_metadata?.avatar_url || null,
          points: 100,
          created_at: new Date().toISOString(),
        };
        await supabase.from("users").insert(newProfile);
        data = newProfile as any;
      }

      setUser(data);

      // 출석 체크 (1회만)
      if (!checkedRef.current) {
        checkedRef.current = true;
        const attended = await checkDailyAttendance(data.id);
        if (attended) {
          const { data: updated } = await supabase
            .from("users").select("*").eq("id", data.id).single();
          if (updated) setUser(updated);
          setAttendancePopup(true);
          setTimeout(() => setAttendancePopup(false), 4000);
        }
      }
    }

    loadUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          let { data } = await supabase
            .from("users").select("*").eq("id", session.user.id).single();
          // 소셜 로그인 시 자동 프로필 생성
          if (!data) {
            const u = session.user;
            const newProfile = {
              id: u.id,
              email: u.email || "",
              nickname: u.user_metadata?.full_name || u.user_metadata?.name || u.email?.split("@")[0] || "유저",
              avatar_url: u.user_metadata?.avatar_url || null,
              points: 100,
              created_at: new Date().toISOString(),
            };
            await supabase.from("users").insert(newProfile);
            data = newProfile as any;
          }
          if (data) setUser(data);
        } else {
          setUser(null);
          checkedRef.current = false; // 로그아웃 시 리셋
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <>
      {children}
      {attendancePopup && (
        <div style={{
          position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)",
          background: "#059669", color: "#fff", padding: "14px 28px", borderRadius: 14,
          fontSize: 15, fontWeight: 700, zIndex: 99999,
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)", display: "flex", alignItems: "center", gap: 10,
          animation: "slideDown 0.3s ease",
        }}>
          🎉 일일 출석 완료! +3P 적립되었습니다
          <button onClick={() => setAttendancePopup(false)} style={{
            background: "rgba(255,255,255,0.2)", border: "none", color: "#fff",
            borderRadius: 8, padding: "2px 8px", cursor: "pointer", fontSize: 13,
          }}>✕</button>
        </div>
      )}
    </>
  );
}
