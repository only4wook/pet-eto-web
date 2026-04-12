"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("이메일과 비밀번호를 입력해주세요."); return; }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(), password,
    });

    if (authError) { setError("이메일 또는 비밀번호가 올바르지 않습니다."); setLoading(false); return; }

    if (data.user) {
      let { data: profile } = await supabase
        .from("users").select("*").eq("id", data.user.id).single();

      // 프로필이 없으면 자동 생성
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
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, padding: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: "#FF6B35" }}>P.E.T</div>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>반려동물과 함께하는 모든 순간</div>
          </div>

          {error && (
            <div style={{ background: "#FEE", border: "1px solid #FCC", borderRadius: 4, padding: "8px 12px", marginBottom: 16, color: "#C00", fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" style={inputStyle} />

            <label style={labelStyle}>비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호 입력" style={inputStyle} />

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "12px", background: loading ? "#ccc" : "#FF6B35",
              color: "#fff", border: "none", borderRadius: 4, fontSize: 15,
              fontWeight: 700, cursor: "pointer", marginTop: 16,
            }}>
              {loading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          {/* 소셜 로그인 */}
          <div style={{ margin: "24px 0 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ fontSize: 12, color: "#9CA3AF" }}>간편 로그인</span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={async () => {
              await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: "https://pet-eto.vercel.app" } });
            }} style={{
              width: "100%", padding: "11px", border: "1px solid #E5E7EB", borderRadius: 8,
              background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#374151",
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google로 로그인
            </button>
            <button onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({ provider: "kakao", options: { redirectTo: "https://pet-eto.vercel.app", scopes: "profile_nickname profile_image" } });
              if (error) alert("카카오 로그인 설정 중입니다. 구글 또는 이메일로 로그인해주세요.");
            }} style={{
              width: "100%", padding: "11px", border: "none", borderRadius: 8,
              background: "#FEE500", cursor: "pointer", fontSize: 14, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#3C1E1E",
            }}>
              <svg width="18" height="18" viewBox="0 0 256 256"><path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-2.1 7.9-7.7 28.5-8.8 33-.5 2 .7 2 1.5 1.4 1-.7 39.4-26.8 43.2-29.5 6.3.9 12.8 1.3 19.3 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#3C1E1E"/></svg>
              카카오로 로그인
            </button>
            <button onClick={() => {
              // 네이버는 Supabase 미지원 → 직접 OAuth URL로 이동
              // Supabase Custom OIDC 또는 네이버 개발자센터 설정 필요
              alert("네이버 로그인은 준비 중이에요!\n네이버 개발자센터에서 앱 등록 후 활성화됩니다.\n\n현재는 이메일 가입 또는 구글/카카오를 이용해주세요.");
            }} style={{
              width: "100%", padding: "11px", border: "none", borderRadius: 8,
              background: "#03C75A", cursor: "pointer", fontSize: 14, fontWeight: 600,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 10, color: "#fff",
            }}>
              <span style={{ fontWeight: 900, fontSize: 16 }}>N</span>
              네이버로 로그인
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#888" }}>
            아직 계정이 없으신가요? <Link href="/auth/signup" style={{ color: "#FF6B35", fontWeight: 600 }}>회원가입</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, outline: "none" };
