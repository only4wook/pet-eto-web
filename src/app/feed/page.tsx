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

type Mode = "swipe" | "classic";
const MODE_KEY = "pet_feed_mode";

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(DEMO_FEED);
  const [mode, setMode] = useState<Mode>("swipe");
  const [mounted, setMounted] = useState(false);

  // 초기 모드 복원 (localStorage) — 모바일 기본 swipe, 데스크톱 기본 classic
  useEffect(() => {
    setMounted(true);
    const saved = typeof window !== "undefined" ? (localStorage.getItem(MODE_KEY) as Mode | null) : null;
    if (saved) setMode(saved);
    else if (typeof window !== "undefined" && window.innerWidth > 900) {
      setMode("classic"); // 데스크톱에선 카드 리스트가 더 편함
    }
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

  // Swipe 모드는 Header/Footer 없이 풀스크린
  if (mounted && mode === "swipe") {
    return (
      <>
        <Header />
        {/* 상단 우측 — 리스트 보기 전환 */}
        <button
          onClick={() => changeMode("classic")}
          aria-label="클래식 보기로 전환"
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top, 0) + 70px)",
            right: 14,
            zIndex: 40,
            padding: "7px 12px",
            fontSize: 12, fontWeight: 700,
            background: "rgba(0,0,0,0.6)", color: "#fff",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          📋 리스트
        </button>

        {/* 상단 좌측 — 업로드 버튼 (인스타 상단 + 처럼) */}
        <Link
          href="/feed/upload"
          aria-label="사진·영상 올리기"
          style={{
            position: "fixed",
            top: "calc(env(safe-area-inset-top, 0) + 70px)",
            left: 14,
            zIndex: 40,
            padding: "7px 14px",
            fontSize: 12, fontWeight: 800,
            background: "linear-gradient(135deg, #FF6B35, #F59E0B)",
            color: "#fff",
            border: "none",
            borderRadius: 999,
            textDecoration: "none",
            boxShadow: "0 4px 12px rgba(255,107,53,0.35)",
            display: "inline-flex", alignItems: "center", gap: 4,
          }}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>＋</span>
          올리기
        </Link>

        <FeedSwipeView posts={posts} />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "16px", flex: 1, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 8 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#1D1D1F" }}>📸 펫 피드</h2>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={() => changeMode("swipe")}
              aria-label="틱톡 스타일 스와이프 보기"
              style={{
                padding: "7px 12px", fontSize: 12, fontWeight: 600,
                border: "1px solid #E5E7EB", borderRadius: 999,
                background: "#fff", color: "#4B5563",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              🎬 스와이프
            </button>
            <Link href="/feed/upload" style={{
              background: "#FF6B35", color: "#fff", padding: "7px 14px", borderRadius: 999,
              fontSize: 12, fontWeight: 700, textDecoration: "none",
            }}>
              + 올리기
            </Link>
          </div>
        </div>

        {/* 법적 고지 (작게) */}
        <div style={{
          background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 8,
          padding: "8px 12px", marginBottom: 14,
          fontSize: 11, color: "#6B7280", lineHeight: 1.5,
        }}>
          ⚖️ AI 분석은 <b>진료 전 참고 가이드</b>입니다. 정확한 진단은 반드시 동물병원에서 받아주세요.
        </div>

        {posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </main>
      <Footer />
    </>
  );
}
