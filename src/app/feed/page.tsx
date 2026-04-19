"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FeedCard from "../../components/FeedCard";
import FeedSwipeView from "../../components/FeedSwipeView";
import { supabase } from "../../lib/supabase";
import { DEMO_FEED } from "../../lib/demoFeed";
import type { FeedPost } from "../../types";

type Mode = "classic" | "swipe";
const MODE_KEY = "pet_feed_mode";

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(DEMO_FEED);
  const [mode, setMode] = useState<Mode>("classic"); // 기본은 리스트
  const [mounted, setMounted] = useState(false);

  // 초기 모드 복원 — 사용자가 스와이프로 바꿔둔 경우만 유지
  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== "undefined" ? (localStorage.getItem(MODE_KEY) as Mode | null) : null;
    if (saved === "swipe") setMode("swipe");
    // 그 외는 모두 classic (기본)
  }, []);

  useEffect(() => {
    supabase
      .from("feed_posts")
      .select("*, author:users(id, nickname, avatar_url, points, role)")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPosts([...data, ...DEMO_FEED]);
        }
      });
  }, []);

  const changeMode = (m: Mode) => {
    setMode(m);
    if (typeof window !== "undefined") localStorage.setItem(MODE_KEY, m);
  };

  // ── Swipe 모드 (버튼으로 진입) ──
  if (mounted && mode === "swipe") {
    return (
      <>
        <Header />
        {/* 우상단에 리스트 전환 버튼만 */}
        <button
          onClick={() => changeMode("classic")}
          aria-label="리스트 보기로 전환"
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top, 0) + 70px)",
            right: 14,
            zIndex: 40,
            padding: "7px 14px",
            fontSize: 12, fontWeight: 700,
            background: "rgba(0,0,0,0.65)", color: "#fff",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          📋 리스트
        </button>
        <FeedSwipeView posts={posts} />
      </>
    );
  }

  // ── Classic 모드 (기본) ──
  return (
    <>
      <Header />
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "16px", flex: 1, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#1D1D1F" }}>📸 펫 피드</h2>
          <button
            onClick={() => changeMode("swipe")}
            aria-label="스와이프 보기로 전환"
            style={{
              padding: "7px 14px", fontSize: 12, fontWeight: 600,
              border: "1px solid #E5E7EB", borderRadius: 999,
              background: "#fff", color: "#4B5563",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            🎬 스와이프
          </button>
        </div>

        {/* 법적 고지 (작게) */}
        <div style={{
          background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8,
          padding: "8px 12px", marginBottom: 14,
          fontSize: 11, color: "#6B7280", lineHeight: 1.5,
        }}>
          ⚖️ AI 분석은 <b>진료 전 참고 가이드</b>입니다. 정확한 진단은 동물병원에서 받아주세요.
        </div>

        {posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </main>
      <Footer />

      {/* 피드 전용 업로드 FAB — 우하단 (다른 페이지에는 노출 안 됨) */}
      <Link
        href="/feed/upload"
        aria-label="사진·영상 올리기"
        style={{
          position: "fixed",
          right: 16,
          bottom: "calc(84px + env(safe-area-inset-bottom, 0))",
          zIndex: 45,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #FF6B35 0%, #F59E0B 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 24px rgba(255,107,53,0.4), inset 0 1px 0 rgba(255,255,255,0.25)",
          textDecoration: "none",
          fontSize: 30,
          fontWeight: 400,
          color: "#fff",
          lineHeight: 1,
          touchAction: "manipulation",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        ＋
      </Link>
    </>
  );
}
