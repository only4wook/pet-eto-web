"use client";
import Link from "next/link";
import { useAppStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import GradeBadge from "./GradeBadge";
import { safeNickname } from "../lib/utils";
import { buildKakaoConsultUrl } from "../lib/contact";
import { trackEvent } from "../lib/analytics";
import { useI18n } from "./I18nProvider";
import LanguageToggle from "./LanguageToggle";

export default function Header() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const { t } = useI18n();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    // 세션 완전 삭제 후 리다이렉트
    setTimeout(() => { window.location.href = "/"; }, 300);
  };

  return (
    <header style={{
      background: "#fff",
      borderBottom: "1px solid #E5E7EB",
      paddingTop: "env(safe-area-inset-top, 0)",
      position: "sticky",
      top: 0,
      zIndex: 30,
    }}>
      {/* PC 상단 바 */}
      <div className="container-pet" style={{ padding: "0 16px" }}>
        <div className="pc-only" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 40 }}>
          <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#888" }}>
            <Link href="/mypage" style={{ color: "#888" }}>{t("header.mypage")}</Link>
            <Link href="/pet/register" style={{ color: "#888" }}>{t("header.registerPet")}</Link>
            <Link href="/partner" style={{ color: "#FF6B35", fontWeight: 600 }}>{t("header.partnerApply")}</Link>
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
                }}>{t("header.logout")}</a>
              </>
            ) : (
              <>
                <Link href="/auth/login" style={{ color: "#FF6B35", fontWeight: 600 }}>{t("header.login")}</Link>
                <Link href="/auth/signup" style={{ color: "#888" }}>{t("header.signup")}</Link>
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
          <LanguageToggle compact />
          <form style={{ flex: 1, display: "flex", minWidth: 0 }} onSubmit={(e) => {
            e.preventDefault();
            const q = (e.currentTarget.querySelector("input") as HTMLInputElement)?.value?.trim();
            if (q) window.location.href = `/search?q=${encodeURIComponent(q)}`;
          }}>
            <input type="search" name="q" placeholder={t("header.searchPlaceholder")}
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
            }}>{t("header.search")}</button>
          </form>
          {/* 모바일 프로필 — 마이페이지로 이동, 로그아웃은 마이페이지에서 처리 */}
          <div className="mobile-only" style={{ display: "none", alignItems: "center", flexShrink: 0, gap: 8 }}>
            <Link href={user ? "/mypage" : "/auth/login"} aria-label={user ? t("header.mypage") : t("header.login")} style={{
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
            { label: t("header.nav.home"), href: "/", highlight: false },
            { label: t("header.nav.feed"), href: "/feed", highlight: false },
            { label: t("header.nav.healthCheck"), href: "/ai", highlight: true },
            { label: t("header.nav.wiki"), href: "/wiki", highlight: false },
            { label: t("header.nav.community"), href: "/community", highlight: false },
            { label: t("header.nav.my"), href: "/mypage", highlight: false },
          ].map((item) => (
            <Link key={item.label} href={item.href} style={{
              color: item.highlight ? "#FF6B35" : "rgba(255,255,255,0.85)",
              padding: "12px 16px", fontSize: 14,
              fontWeight: item.highlight ? 700 : 500,
              textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
              flexShrink: 0, letterSpacing: "-0.01em",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = item.highlight ? "#FF8A5B" : "#fff")}
            onMouseLeave={(e) => (e.currentTarget.style.color = item.highlight ? "#FF6B35" : "rgba(255,255,255,0.85)")}
            >
              {item.highlight && (
                <span aria-hidden="true" style={{
                  width: 6, height: 6, borderRadius: "50%", background: "#FF6B35",
                  boxShadow: "0 0 0 3px rgba(255,107,53,0.25)",
                }} />
              )}
              {item.label}
              {item.highlight && (
                <span style={{
                  fontSize: 10, fontWeight: 800, padding: "1px 6px",
                  borderRadius: 8, background: "rgba(255,107,53,0.18)",
                  color: "#FFB38A", letterSpacing: "0.02em",
                }}>{t("common.ai")}</span>
              )}
            </Link>
          ))}
          {/* 카톡 상담 */}
          <a href={buildKakaoConsultUrl("header_nav")} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("kakao_click", { source: "header_nav" })} style={{
            marginLeft: "auto", flexShrink: 0, display: "flex", alignItems: "center", gap: 6,
            background: "#FEE500", color: "#1D1D1F", padding: "6px 14px",
            borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: "none",
          }}>
            {t("header.kakaoConsult")}
          </a>
        </div>
      </nav>

      {/* 모바일 플로팅 버튼은 제거 — 사용자 피드백: '계속 따라다녀서 거슬림'
          · 피드 업로드는 /feed 페이지에서만 자체 FAB로 노출
          · 카톡 상담은 PC 네비/Hero CTA/Footer에 이미 녹아있음 */}
    </header>
  );
}
