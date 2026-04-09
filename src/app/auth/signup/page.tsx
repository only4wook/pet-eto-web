"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";

export default function SignupPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameMsg, setNicknameMsg] = useState("");
  const [success, setSuccess] = useState(false);

  // 닉네임 중복확인
  const checkNickname = async () => {
    if (nickname.length < 2 || nickname.length > 12) {
      setNicknameMsg("닉네임은 2~12자로 입력해주세요.");
      setNicknameChecked(false);
      return;
    }
    const { data } = await supabase
      .from("users")
      .select("id")
      .eq("nickname", nickname)
      .maybeSingle();

    if (data) {
      setNicknameMsg("이미 사용 중인 닉네임입니다.");
      setNicknameChecked(false);
    } else {
      setNicknameMsg("사용 가능한 닉네임입니다!");
      setNicknameChecked(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password || !nickname) { setError("모든 항목을 입력해주세요."); return; }
    if (!nicknameChecked) { setError("닉네임 중복확인을 해주세요."); return; }
    if (password !== passwordConfirm) { setError("비밀번호가 일치하지 않습니다."); return; }
    if (password.length < 6) { setError("비밀번호는 6자 이상이어야 합니다."); return; }

    setLoading(true);
    const { data, error: authError } = await supabase.auth.signUp({ email: email.trim(), password });

    if (authError) { setError(authError.message); setLoading(false); return; }

    if (data.user) {
      const profile = { id: data.user.id, email: email.trim(), nickname, points: 100, avatar_url: null, created_at: new Date().toISOString() };
      await supabase.from("users").insert(profile);

      // 세션이 있으면 (Confirm email OFF) 바로 로그인 처리
      if (data.session) {
        setUser(profile);
        setLoading(false);
        alert(`환영합니다, ${nickname}님! 가입 보너스 100P 지급!`);
        router.push("/");
        return;
      }
    }

    // 세션이 없으면 (Confirm email ON) 이메일 인증 안내
    setLoading(false);
    setSuccess(true);
  };

  // 가입 완료 → 이메일 인증 안내 화면
  if (success) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 440, margin: "0 auto", padding: "60px 16px", flex: 1, width: "100%", textAlign: "center" }}>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>이메일 인증을 완료해주세요!</h2>
            <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>
              <b style={{ color: "#FF6B35" }}>{email}</b> 으로<br />
              인증 메일을 발송했습니다.<br /><br />
              메일함에서 인증 링크를 클릭하면<br />
              회원가입이 완료됩니다.
            </p>
            <div style={{
              background: "#FFF8F0", border: "1px solid #FFE0CC", borderRadius: 4,
              padding: "12px 16px", marginTop: 20, fontSize: 12, color: "#886",
            }}>
              메일이 안 보이면 스팸함을 확인해주세요.
            </div>
            <Link href="/auth/login" style={{
              display: "inline-block", marginTop: 24, padding: "10px 32px",
              background: "#FF6B35", color: "#fff", borderRadius: 4,
              textDecoration: "none", fontWeight: 600, fontSize: 14,
            }}>
              로그인 페이지로 이동
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 440, margin: "0 auto", padding: "40px 16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4, padding: 32 }}>
          <h2 style={{ textAlign: "center", fontSize: 22, fontWeight: 700, marginBottom: 24 }}>회원가입</h2>

          {error && (
            <div style={{ background: "#FEE", border: "1px solid #FCC", borderRadius: 4, padding: "8px 12px", marginBottom: 16, color: "#C00", fontSize: 13 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* 닉네임 + 중복확인 */}
            <label style={labelStyle}>닉네임</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="text" value={nickname}
                onChange={(e) => { setNickname(e.target.value); setNicknameChecked(false); setNicknameMsg(""); }}
                placeholder="2~12자" maxLength={12}
                style={{ ...inputStyle, flex: 1 }} />
              <button type="button" onClick={checkNickname} style={{
                padding: "0 14px", background: "#555", color: "#fff", border: "none",
                borderRadius: 4, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap",
              }}>
                중복확인
              </button>
            </div>
            {nicknameMsg && (
              <div style={{ fontSize: 12, marginTop: 4, color: nicknameChecked ? "#22C55E" : "#EF4444" }}>
                {nicknameMsg}
              </div>
            )}

            <label style={labelStyle}>이메일</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com" style={inputStyle} />
            <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>실제 사용하는 이메일을 입력하세요. 인증 메일이 발송됩니다.</div>

            <label style={labelStyle}>비밀번호</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="6자 이상" style={inputStyle} />

            <label style={labelStyle}>비밀번호 확인</label>
            <input type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="비밀번호 다시 입력" style={inputStyle} />

            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "12px", background: loading ? "#ccc" : "#FF6B35",
              color: "#fff", border: "none", borderRadius: 4, fontSize: 15,
              fontWeight: 700, cursor: "pointer", marginTop: 16,
            }}>
              {loading ? "가입 중..." : "회원가입"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: 16, fontSize: 13, color: "#888" }}>
            이미 계정이 있으신가요? <Link href="/auth/login" style={{ color: "#FF6B35", fontWeight: 600 }}>로그인</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, outline: "none" };
