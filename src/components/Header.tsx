"use client";
import Link from "next/link";
import { useAppStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import GradeBadge from "./GradeBadge";
import { safeNickname } from "../lib/utils";

export default function Header() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // 세션 완전 삭제 후 리다이렉트
    setTimeout(() => { window.location.href = "/"; }, 300);
  };

  return (
    <header style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}>
      {/* PC 상단 바 */}
      <div className="container-pet" style={{ padding: "0 16px" }}>
        <div className="pc-only" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 40 }}>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#888" }}>
            <Link href="/mypage" style={{ color: "#888" }}>마이페이지</Link>
            <Link href="/pet/register" style={{ color: "#888" }}>반려동물 등록</Link>
            <Link href="/partner" style={{ color: "#FF6B35", fontWeight: 600 }}>파트너 신청</Link>
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 12, alignItems: "center" }}>
            {user ? (
              <>
                <span style={{ color: "#FF6B35", fontWeight: 700 }}>{safeNickname(user.nickname, user.id)}</span>
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
      <div className="container-pet" style={{ padding: "8px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Link href="/" style={{ textDecoration: "none", flexShrink: 0 }}>
            <span style={{ fontSize: 22, fontWeight: 900, color: "#1D1D1F", letterSpacing: "-0.03em" }}>P.E.T</span>
          </Link>
          <form style={{ flex: 1, display: "flex", minWidth: 0 }} onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.querySelector("input") as HTMLInputElement)?.value?.trim();
            if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
          }}>
            <input type="search" name="q" placeholder="게시글, 위키, 증상 검색..."
              inputMode="search" autoComplete="off" enterKeyHint="search"
              style={{
                flex: 1, border: "1px solid #ddd", borderRight: "none",
                padding: "0 10px", height: 44, fontSize: 14, borderRadius: "8px 0 0 8px",
                outline: "none", minWidth: 0,
              }} />
            <button type="submit" style={{
              background: "#1D1D1F", color: "#fff", border: "none",
              padding: "0 16px", height: 44, fontSize: 14, cursor: "pointer",
              borderRadius: "0 8px 8px 0", flexShrink: 0, fontWeight: 500,
              touchAction: "manipulation",
            }}>검색</button>
          </form>
          {/* 모바일 프로필 — 마이페이지로 이동, 로그아웃은 마이페이지에서 처리 */}
          <div className="mobile-only" style={{ display: "none", alignItems: "center", flexShrink: 0 }}>
            <Link href={user ? "/mypage" : "/auth/login"} aria-label={user ? "마이페이지" : "로그인"} style={{
              width: 44, height: 44, borderRadius: "50%",
              background: user ? "#FF6B35" : "#E5E7EB",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: user ? "#fff" : "#6B7280", fontSize: 16, fontWeight: 700, textDecoration: "none",
              flexShrink: 0,
            }}>
              {user ? safeNickname(user.nickname, user.id).charAt(0).toUpperCase() : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4" /><path d="M4 21v-1a7 7 0 0 1 14 0v1" />
                </svg>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* 네비게이션 — PC 전용. 모바일은 BottomTabBar로 대체 */}
      <nav className="pc-only" style={{ background: "#1D1D1F", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
        <div className="container-pet" style={{
          padding: "0",
          display: "flex", gap: 0, whiteSpace: "nowrap", alignItems: "center",
        }}>
          {[
            { label: "홈", href: "/" },
            { label: "피드", href: "/feed" },
            { label: "위키", href: "/wiki" },
            { label: "커뮤니티", href: "/community" },
            { label: "마이", href: "/mypage" },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{
              color: "rgba(255,255,255,0.85)", padding: "12px 16px", fontSize: 14,
              fontWeight: 500, textDecoration: "none", display: "block", flexShrink: 0,
              letterSpacing: "-0.01em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.85)")}
            >
              {item.label}
            </Link>
          ))}
          {/* 카톡 상담 */}
          <a href="https://pf.kakao.com/_giedX/chat" target="_blank" rel="noopener noreferrer" style={{
            marginLeft: "auto", flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
            background: "#FEE500", color: "#1D1D1F", padding: "6px 14px",
            borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: "none",
          }}>
            카톡 상담
          </a>
        </div>
      </nav>

      {/* 카톡 상담 — 모바일 플로팅 버튼 (하단 탭바 위에 노출) */}
      <a
        href="https://pf.kakao.com/_giedX/chat"
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-only kakao-fab"
        aria-label="카카오톡 상담"
        style={{
          display: "none",
          position: "fixed",
          right: 16,
          bottom: "calc(74px + env(safe-area-inset-bottom, 0))",
          zIndex: 45,
          width: 54,
          height: 54,
          borderRadius: "50%",
          background: "#FEE500",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
          textDecoration: "none",
          fontSize: 20,
          fontWeight: 800,
          color: "#3C1E1E",
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        💬
      </a>
    </header>
  );
}
