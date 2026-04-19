"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// 모바일 전용 하단 탭바
// iOS·안드로이드 네이티브 앱처럼 5개 탭 고정 + 현재 페이지 하이라이트

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
      className="mobile-only"
      style={{
        display: "none",
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid #E5E7EB",
        paddingBottom: "env(safe-area-inset-bottom, 0)",
      }}
      aria-label="주요 메뉴"
    >
      <div style={{ display: "flex", justifyContent: "space-around", alignItems: "stretch", height: 58 }}>
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          const color = active ? "#FF6B35" : "#9CA3AF";
          return (
            <Link
              key={tab.label}
              href={tab.href}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 3,
                color,
                textDecoration: "none",
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                padding: "6px 0 4px",
                transition: "color 0.15s",
              }}
              aria-current={active ? "page" : undefined}
            >
              <Icon color={color} active={active} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Icon Components (SVG, 24x24, 1.8 stroke) ────────
function HomeIcon({ color, active }: { color: string; active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5L12 3l9 7.5V20a2 2 0 0 1-2 2h-4v-7h-6v7H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}
function FeedIcon({ color, active }: { color: string; active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8.5" cy="10" r="1.5" fill={active ? "#fff" : color} stroke="none" />
      <path d="M21 16l-5-5-9 9" />
    </svg>
  );
}
function WikiIcon({ color, active }: { color: string; active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5z" />
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" stroke={active ? "#fff" : color} />
    </svg>
  );
}
function CommunityIcon({ color, active }: { color: string; active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
function MyIcon({ color, active }: { color: string; active: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? color : "none"} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a7 7 0 0 1 14 0v1" />
    </svg>
  );
}
