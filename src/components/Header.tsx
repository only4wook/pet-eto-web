"use client";
import Link from "next/link";
import { useAppStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import GradeBadge from "./GradeBadge";

export default function Header() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header style={{ background: "#fff", borderBottom: "2px solid #FF6B35" }}>
      {/* PC 상단 바 */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 16px" }}>
        <div className="pc-only" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 40 }}>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#888" }}>
            <Link href="/mypage" style={{ color: "#888" }}>마이페이지</Link>
            <Link href="/pet/register" style={{ color: "#888" }}>반려동물 등록</Link>
            <Link href="/partner" style={{ color: "#FF6B35", fontWeight: 600 }}>파트너 신청</Link>
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 12, alignItems: "center" }}>
            {user ? (
              <>
                <span style={{ color: "#FF6B35", fontWeight: 700 }}>{user.nickname}</span>
                <GradeBadge points={user.points} role={(user as any).role} />
                <span style={{ color: "#2EC4B6", fontWeight: 600 }}>{user.points}P</span>
                <span style={{ color: "#ddd" }}>|</span>
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{
                  color: "#888", fontSize: 12, cursor: "pointer", textDecoration: "none",
                }}>로그아웃</a>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ color: "#FF6B35", fontWeight: 600 }}>로그인</Link>
                <Link href="/auth/signup" style={{ color: "#888" }}>회원가입</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 로고 + 검색 */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "8px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#FF6B35" }}>P.E.T</span>
          </Link>
          <form style={{ flex: 1, display: "flex", minWidth: 0 }} onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.querySelector("input") as HTMLInputElement)?.value?.trim();
            if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
          }}>
            <input type="text" name="q" placeholder="게시글, 위키, 증상 검색..." style={{
              flex: 1, border: "1px solid #ddd", borderRight: "none",
              padding: "7px 10px", fontSize: 13, borderRadius: "4px 0 0 4px", outline: "none", minWidth: 0,
            }} />
            <button type="submit" style={{
              background: "#FF6B35", color: "#fff", border: "none",
              padding: "7px 12px", fontSize: 13, cursor: "pointer", borderRadius: "0 4px 4px 0", flexShrink: 0,
            }}>검색</button>
          </form>
          {/* 모바일 로그인/프로필 버튼 */}
          <Link href={user ? "/mypage" : "/auth/login"} className="mobile-only" style={{
            width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
            background: user ? "#FF6B35" : "#ddd", display: "none", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 13, fontWeight: 700, textDecoration: "none",
          }}>
            {user ? user.nickname.charAt(0) : "?"}
          </Link>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav style={{ background: "#FF6B35", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div style={{
          maxWidth: 1100, margin: "0 auto", padding: "0 8px",
          display: "flex", gap: 0, whiteSpace: "nowrap",
        }}>
          {[
            { label: "전체글", href: "/" },
            { label: "📸피드", href: "/feed" },
            { label: "📖위키", href: "/wiki" },
            { label: "질문", href: "/community?cat=질문" },
            { label: "정보", href: "/community?cat=정보" },
            { label: "긴급", href: "/community?cat=긴급" },
            { label: "⭐후기", href: "/community?cat=후기" },
            { label: "💬문의", href: "/community?cat=문의" },
            { label: "마이", href: "/mypage" },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{
              color: "#fff", padding: "10px 14px", fontSize: 13,
              fontWeight: 600, textDecoration: "none", display: "block", flexShrink: 0,
            }}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
