"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 모바일 전용 하단 탭바 — 네이티브 앱 수준 UX
// 레퍼런스: iOS Tab Bar, 안드로이드 Material 3 Bottom Nav, 당근/토스/인스타
// 요소: 큰 아이콘(26px), Active Pill, 스프링 바운스, Haptic-like press

const TABS = [
  { label: "홈", href: "/", icon: HomeIcon, match: (p: string) => p === "/" },
  { label: "피드", href: "/feed", icon: FeedIcon, match: (p: string) => p.startsWith("/feed") },
  { label: "위키", href: "/wiki", icon: WikiIcon, match: (p: string) => p.startsWith("/wiki") },
  { label: "커뮤", href: "/community", icon: CommunityIcon, match: (p: string) => p.startsWith("/community") },
  { label: "마이", href: "/mypage", icon: MyIcon, match: (p: string) => p.startsWith("/mypage") || p.startsWith("/auth") },
];

export default function BottomTabBar() {
  const pathname = usePathname() || "/";

  return (
    <nav
      className="mobile-only bottom-tab-nav"
      aria-label="주요 메뉴"
      style={{
        display: "none",
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        width: "100%",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "saturate(180%) blur(24px)",
        WebkitBackdropFilter: "saturate(180%) blur(24px)",
        borderTop: "0.5px solid rgba(0,0,0,0.08)",
        // 상·하·좌·우 safe area 전부 반영 (iPhone 가로모드 노치 포함)
        paddingTop: 0,
        paddingBottom: "env(safe-area-inset-bottom, 0)",
        paddingLeft: "env(safe-area-inset-left, 0)",
        paddingRight: "env(safe-area-inset-right, 0)",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.04)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          height: 68,
          // 큰 폰(아이폰 Pro Max·갤럭시 Ultra·아이패드 미니)에서도 탭이 좌측으로 몰리지 않게
          // 화면 전체 너비를 100% 쓰되, 과도하게 퍼지지 않게 max-width로 제한 + 가운데 정렬
          width: "100%",
          maxWidth: 520,
          margin: "0 auto",
          padding: "0 6px",
          boxSizing: "border-box",
        }}
      >
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.label}
              href={tab.href}
              aria-label={tab.label}
              aria-current={active ? "page" : undefined}
              className="bottom-tab-item"
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                color: active ? "#FF6B35" : "#8E8E93",
                textDecoration: "none",
                height: "100%",
                position: "relative",
                WebkitTapHighlightColor: "transparent",
                touchAction: "manipulation",
                transition: "color 0.2s ease",
              }}
            >
              {/* Active Pill 배경 + 아이콘 */}
              <div
                className={active ? "tab-icon-wrap active" : "tab-icon-wrap"}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 56,
                  height: 32,
                  borderRadius: 16,
                  background: active ? "rgba(255,107,53,0.14)" : "transparent",
                  transform: active ? "translateY(-1px) scale(1)" : "scale(1)",
                  transition: "background 0.25s cubic-bezier(0.2,0.8,0.2,1), transform 0.25s cubic-bezier(0.2,0.8,0.2,1)",
                }}
              >
                <Icon active={active} />
              </div>

              {/* 라벨 */}
              <span
                style={{
                  fontSize: 11,
                  fontWeight: active ? 700 : 500,
                  letterSpacing: "-0.01em",
                  lineHeight: 1,
                  transition: "color 0.2s ease, font-weight 0.2s ease",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>

      <style jsx>{`
        .bottom-tab-item:active .tab-icon-wrap {
          transform: scale(0.88) !important;
        }
        .bottom-tab-item:active .tab-icon-wrap.active {
          transform: translateY(-1px) scale(0.92) !important;
        }
      `}</style>
    </nav>
  );
}

// ─── Icon Components — 네이티브 앱 수준 (26x26, 2.0 stroke, active 시 filled) ─────

function HomeIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#FF6B35" aria-hidden="true">
        <path d="M12 2.1 3 9.5V21a1 1 0 0 0 1 1h5v-7h6v7h5a1 1 0 0 0 1-1V9.5L12 2.1z" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5V20a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2V10.5z" />
    </svg>
  );
}

function FeedIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#FF6B35" aria-hidden="true">
        <path d="M5 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H5zm3.5 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-4.5 11 5-5 4 4 4-4 5 5v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v0z" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="10" r="1.8" fill="#8E8E93" stroke="none" />
      <path d="m3 17 5-5 4 4 4-4 5 5" />
    </svg>
  );
}

function WikiIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#FF6B35" aria-hidden="true">
        <path d="M6.5 2A2.5 2.5 0 0 0 4 4.5v15A2.5 2.5 0 0 0 6.5 22H20V2H6.5zm0 17H18v2H6.5a.5.5 0 0 1 0-1 .5.5 0 0 1 0-1zM9 7h7v1.5H9V7zm0 3h7v1.5H9V10zm0 3h5v1.5H9V13z" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5v-17z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M8 7h8M8 11h8M8 15h5" strokeWidth="1.6" />
    </svg>
  );
}

function CommunityIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#FF6B35" aria-hidden="true">
        <path d="M5 3a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h2v3.5a.5.5 0 0 0 .8.4L13 19h6a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H5zm3 6h8v2H8V9zm0 4h5v2H8v-2z" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" />
      <path d="M8 10h8M8 13.5h5" strokeWidth="1.6" />
    </svg>
  );
}

function MyIcon({ active }: { active: boolean }) {
  if (active) {
    return (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="#FF6B35" aria-hidden="true">
        <path d="M12 2a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 12c-4.97 0-9 3.13-9 7a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1c0-3.87-4.03-7-9-7z" />
      </svg>
    );
  }
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a7 7 0 0 1 14 0v1" />
    </svg>
  );
}
