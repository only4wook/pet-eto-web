"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import TrustSection from "../components/TrustSection";
import EmergencyBanner from "../components/EmergencyBanner";
import PostCard from "../components/PostCard";
import { useAppStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import GradeBadge from "../components/GradeBadge";
import type { Post } from "../types";

export default function Home() {
  const { posts: demoPosts, user } = useAppStore();
  const [dbPosts, setDbPosts] = useState<Post[]>([]);

  useEffect(() => {
    supabase
      .from("posts")
      .select("*, author:users(id, nickname, avatar_url, points, role)")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => { if (data && data.length > 0) setDbPosts(data); });
  }, []);

  const posts = [...dbPosts, ...demoPosts];
  const emergencyPosts = posts.filter((p) => p.category === "긴급").slice(0, 5);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>

        {/* 1. 히어로 섹션 */}
        <HeroSection />

        {/* 2. 신뢰 섹션 */}
        <TrustSection />

        {/* 3. 긴급 배너 */}
        {emergencyPosts.length > 0 && <EmergencyBanner posts={emergencyPosts} />}

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* 메인 콘텐츠 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 게시판 헤더 */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 0", marginBottom: 12,
            }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, margin: 0, color: "#1F2937" }}>전체 게시글</h3>
              <Link
                href="/community/write"
                style={{
                  background: "#FF6B35", color: "#fff", padding: "8px 20px",
                  borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none",
                }}
              >
                글쓰기
              </Link>
            </div>

            {/* 4. 카드형 게시글 목록 */}
            <div>
              {posts.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>

            {/* 페이지네이션 */}
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 20 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  style={{
                    width: 32, height: 32, border: "1px solid #E5E7EB",
                    background: n === 1 ? "#FF6B35" : "#fff",
                    color: n === 1 ? "#fff" : "#6B7280", fontSize: 13,
                    cursor: "pointer", borderRadius: 8, fontWeight: n === 1 ? 700 : 400,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* 사이드바 (PC만) */}
          <aside style={{ width: 260, flexShrink: 0 }} className="sidebar-hide-mobile">
            {/* 유저 카드 */}
            {user && (
              <div style={{
                background: "#fff", border: "1px solid #F3F4F6", borderRadius: 16,
                padding: 20, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#1F2937" }}>{user.nickname}</div>
                <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>{user.email}</div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginTop: 14, padding: "12px 0", borderTop: "1px solid #F3F4F6",
                }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#FF6B35" }}>{user.points}</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>포인트</div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#2EC4B6" }}>3</div>
                    <div style={{ fontSize: 11, color: "#9CA3AF" }}>게시글</div>
                  </div>
                </div>
                <Link
                  href="/community/write"
                  style={{
                    display: "block", textAlign: "center", background: "#FF6B35",
                    color: "#fff", padding: "10px", borderRadius: 10, fontSize: 14,
                    fontWeight: 700, marginTop: 8, textDecoration: "none",
                  }}
                >
                  글쓰기
                </Link>
              </div>
            )}

            {/* 인기글 */}
            <div style={{
              background: "#fff", border: "1px solid #F3F4F6", borderRadius: 16,
              overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
            }}>
              <div style={{
                background: "linear-gradient(135deg, #FF6B35, #FB923C)",
                color: "#fff", padding: "12px 16px",
                fontSize: 14, fontWeight: 800,
              }}>
                실시간 인기글
              </div>
              <div style={{ padding: 10 }}>
                {posts.slice(0, 5).map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "8px 6px", color: "#374151", textDecoration: "none",
                      fontSize: 13, borderBottom: i < 4 ? "1px solid #F9FAFB" : "none",
                    }}
                  >
                    <span style={{
                      fontWeight: 800, color: i < 3 ? "#FF6B35" : "#D1D5DB",
                      minWidth: 18, fontSize: 14,
                    }}>
                      {i + 1}
                    </span>
                    <span style={{
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {post.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
