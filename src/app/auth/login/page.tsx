"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";

const REMEMBER_EMAIL_KEY = "pet_remember_email";
const REMEMBER_EMAIL_ENABLED_KEY = "pet_remember_email_enabled";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 이메일 기억하기 로드
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem(REMEMBER_EMAIL_KEY) : null;
    const enabled = typeof window !== "undefined"
      ? localStorage.getItem(REMEMBER_EMAIL_ENABLED_KEY) === "1"
      : false;
    if (saved && enabled) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("이메일과 비밀번호를 입력해주세요."); return; }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(), password,
    });

    if (authError) { setError("이메일 또는 비밀번호가 올바르지 않습니다."); setLoading(false); return; }

    // 이메일 기억하기 저장/삭제
    if (typeof window !== "undefined") {
      if (remember) {
        localStorage.setItem(REMEMBER_EMAIL_KEY, email.trim());
        localStorage.setItem(REMEMBER_EMAIL_ENABLED_KEY, "1");
      } else {
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
        localStorage.removeItem(REMEMBER_EMAIL_ENABLED_KEY);
      }
    }

    if (data.user) {
      let { data: profile } = await supabase
        .from("users").select("*").eq("id", data.user.id).single();

      if (!profile) {
        const newProfile = {
          id: data.user.id,
          email: data.user.email || email.trim(),
          nickname: email.split("@")[0],
          points: 100,
          avatar_url: null,
          created_at: new Date().toISOString(),
        };
        await supabase.from("users").insert(newProfile);
        profile = newProfile;
      }

      setUser(profile);
    }

    setLoading(false);
    window.location.href = "/";
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 440, margin: "0 auto", padding: "40px 16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12, padding: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#FF6B35", letterSpacing: "-0.04em" }}>P.E.T</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>반려동물과 함께하는 모든 순간</div>
          </div>

          {error && (
            <div style={{ background: "#FEE", border: "1px solid #FCC", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#C00", fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>이메일</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              style={inputStyle}
            />

            <label style={labelStyle}>비밀번호</label>
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호 입력"
              style={inputStyle}
            />

            {/* 이메일 기억하기 */}
            <label style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: 14, cursor: "pointer",
              fontSize: 13, color: "#4B5563",
              userSelect: "none",
            }}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "#FF6B35", cursor: "pointer" }}
              />
              이메일 기억하기
            </label>

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "12px", background: loading ? "#ccc" : "#FF6B35",
              color: "#fff", border: "none", borderRadius: 8, fontSize: 15,
              fontWeight: 700, cursor: "pointer", marginTop: 18,
            }}>
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 소셜 로그인 — 구글만 */}
          <div style={{ margin: "24px 0 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>또는</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          <button onClick={async () => {
            await supabase.auth.signInWithOAuth({
              provider: "google",
              options: { redirectTo: typeof window !== "undefined" ? window.location.origin : "https://peteto.kr" },
            });
          }} style={{
            width: "100%", padding: "12px", border: "1.5px solid #E5E7EB", borderRadius: 8,
            background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#374151",
            transition: "border-color 0.15s, background 0.15s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1D1D1F"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E5E7EB"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google로 계속하기
          </button>

          <p style={{ textAlign: "center", marginTop: 18, fontSize: 13, color: "#888" }}>
            아직 계정이 없으신가요? <Link href="/auth/signup" style={{ color: "#FF6B35", fontWeight: 600 }}>회원가입</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "11px 14px", border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit" };
