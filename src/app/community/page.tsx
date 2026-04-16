"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import GradeBadge from "../../components/GradeBadge";
import { useAppStore } from "../../lib/store";
import { supabase } from "../../lib/supabase";
import { formatDate, getCategoryColor } from "../../lib/utils";
import type { Post } from "../../types";

function CommunityContent() {
  const searchParams = useSearchParams();
  const cat = searchParams.get("cat") || "전체";
  const { posts: demoPosts } = useAppStore();
  const [dbPosts, setDbPosts] = useState<Post[]>([]);

  useEffect(() => {
    supabase
      .from("posts")
      .select("*, author:users(id, nickname, avatar_url, points, role)")
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }) => {
        if (data && data.length > 0) setDbPosts(data);
      });
  }, []);

  const allPosts = [...dbPosts, ...demoPosts];
  const filtered = cat === "전체" ? allPosts : allPosts.filter((p) => p.category === cat);

  return (
    <>
      <Header />
      <main className="container-pet" style={{ padding: "20px 0", flex: 1 }}>
        {/* 헤더 + 글쓰기 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#1D1D1F", letterSpacing: "-0.02em" }}>커뮤니티</h2>
          <Link href="/community/write" style={{
            padding: "8px 18px", background: "#1D1D1F", color: "#fff", borderRadius: 10,
            fontSize: 13, fontWeight: 600, textDecoration: "none",
          }}>글쓰기</Link>
        </div>

        {/* 카테고리 탭 */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {["전체", "질문", "일상", "후기", "가이드", "행사", "논문"].map((c) => (
            <Link key={c} href={c === "전체" ? "/community" : `/community?cat=${c}`} style={{
              padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
              background: cat === c ? "#1D1D1F" : "#F3F4F6",
              color: cat === c ? "#fff" : "#6B7280",
              textDecoration: "none", whiteSpace: "nowrap",
              transition: "all 0.15s",
            }}>
              {c}
            </Link>
          ))}
          <Link href="/guide" style={{
            padding: "7px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
            background: "#F3F4F6", color: "#6B7280", textDecoration: "none", whiteSpace: "nowrap",
          }}>
            가이드
          </Link>
        </div>

        {/* 게시판 테이블 */}
        <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff" }}>
          <thead>
            <tr style={{ background: "#f8f8f8", borderBottom: "1px solid #e0e0e0" }}>
              <th style={{ ...th, width: 60 }}>번호</th>
              <th style={{ ...th, width: 64 }}>말머리</th>
              <th style={th}>제목</th>
              <th style={{ ...th, width: 90 }}>글쓴이</th>
              <th style={{ ...th, width: 80 }}>날짜</th>
              <th style={{ ...th, width: 50 }}>조회</th>
              <th style={{ ...th, width: 50 }}>추천</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={7} style={{ padding: 40, textAlign: "center", color: "#aaa" }}>게시글이 없습니다.</td></tr>
            ) : filtered.map((post, i) => (
              <tr key={post.id} style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <td style={td}>{filtered.length - i}</td>
                <td style={td}>
                  <span style={{ color: getCategoryColor(post.category), fontWeight: 600, fontSize: 12 }}>
                    [{post.category}]
                  </span>
                </td>
                <td style={{ ...td, textAlign: "left" }}>
                  <Link href={`/community/${post.id}`} style={{ color: "#333", textDecoration: "none" }}>
                    <span style={{ fontWeight: post.category === "긴급" ? 700 : 400 }}>{post.title}</span>
                    {post.comment_count > 0 && <span style={{ color: "#FF6B35", fontSize: 11, marginLeft: 4, fontWeight: 700 }}>[{post.comment_count}]</span>}
                    {post.is_expert_answered && <span style={{ background: "#2EC4B6", color: "#fff", fontSize: 10, padding: "1px 4px", borderRadius: 2, marginLeft: 6, fontWeight: 600 }}>전문가답변</span>}
                  </Link>
                </td>
                <td style={td}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                    <span>{post.author?.nickname ?? "익명"}</span>
                    <GradeBadge points={post.author?.points ?? 0} role={(post.author as any)?.role} showLabel={false} />
                  </div>
                </td>
                <td style={{ ...td, color: "#aaa" }}>{formatDate(post.created_at)}</td>
                <td style={td}>{post.view_count}</td>
                <td style={{ ...td, color: post.like_count >= 10 ? "#FF6B35" : "#888" }}>{post.like_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      <Footer />

      {/* 모바일 반응형은 globals.css에서 처리 */}
    </>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>로딩 중...</div>}>
      <CommunityContent />
    </Suspense>
  );
}

const th: React.CSSProperties = { padding: "8px 6px", fontSize: 12, fontWeight: 600, color: "#666", textAlign: "center" };
const td: React.CSSProperties = { padding: "9px 6px", fontSize: 13, textAlign: "center" };
