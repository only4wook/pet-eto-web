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
