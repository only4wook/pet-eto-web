"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAppStore } from "../lib/store";
import { supabase } from "../lib/supabase";
import { formatDate, getCategoryColor } from "../lib/utils";
import type { Post } from "../types";
import GradeBadge from "../components/GradeBadge";

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

  // DB 글(새 글) + 데모 데이터 합치기. DB글이 위에 표시됨
  const posts = [...dbPosts, ...demoPosts];

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
          {/* 메인 콘텐츠 */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 히어로 배너 + CTA */}
            <div style={{
              background: "linear-gradient(135deg, #FF6B35, #E55A2B)",
              borderRadius: 12, padding: "28px 28px 24px", marginBottom: 20, color: "#fff",
            }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1.4 }}>
                갑자기 아플 때, 급하게 출장갈 때<br />
                우리 아이를 안전하게 맡기세요
              </h2>
              <p style={{ fontSize: 13, opacity: 0.9, marginTop: 8, lineHeight: 1.6 }}>
                P.E.T는 반려동물 긴급 돌봄부터 커뮤니티, 건강 체크까지<br />
                반려인의 모든 순간을 함께합니다.
              </p>
              <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
                <a href="https://forms.gle/e5cY46BRkambEjE19" target="_blank" rel="noopener noreferrer" id="cta-btn" style={{
                  background: "#fff", color: "#FF6B35", padding: "10px 24px", borderRadius: 8,
                  fontSize: 14, fontWeight: 800, textDecoration: "none", display: "inline-block",
                }}>
                  🔔 출시 알림 받기
                </a>
                <span style={{ fontSize: 11, opacity: 0.8, alignSelf: "center" }}>
                  무료 · 가장 먼저 혜택을 받아보세요
                </span>
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12, opacity: 0.85 }}>
                <span>✅ 100% 에스크로 안전결제</span>
                <span>✅ 수의학 자문 연계</span>
                <span>✅ 신원인증 펫시터</span>
              </div>
            </div>

            {/* 게시판 헤더 */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", borderBottom: "2px solid #333",
            }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>전체 게시글</h3>
              <Link
                href="/community/write"
                style={{
                  background: "#FF6B35", color: "#fff", padding: "6px 16px",
                  borderRadius: 4, fontSize: 12, fontWeight: 600, textDecoration: "none",
                }}
              >
                글쓰기
              </Link>
            </div>

            {/* 게시판 테이블 */}
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8f8f8", borderBottom: "1px solid #e0e0e0" }}>
                  <th style={{ ...thStyle, width: 60 }}>번호</th>
                  <th style={{ ...thStyle, width: 64 }}>말머리</th>
                  <th style={thStyle}>제목</th>
                  <th style={{ ...thStyle, width: 80 }}>글쓴이</th>
                  <th style={{ ...thStyle, width: 80 }}>날짜</th>
                  <th style={{ ...thStyle, width: 50 }}>조회</th>
                  <th style={{ ...thStyle, width: 50 }}>추천</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr
                    key={post.id}
                    style={{ borderBottom: "1px solid #f0f0f0", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td style={tdStyle}>{posts.length - i}</td>
                    <td style={tdStyle}>
                      <span style={{
                        color: getCategoryColor(post.category),
                        fontWeight: 600, fontSize: 12,
                      }}>
                        [{post.category}]
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: "left" }}>
                      <Link href={`/community/${post.id}`} style={{ color: "#333", textDecoration: "none" }}>
                        <span style={{ fontWeight: post.category === "긴급" ? 700 : 400 }}>
                          {post.title}
                        </span>
                        {post.comment_count > 0 && (
                          <span style={{ color: "#FF6B35", fontSize: 11, marginLeft: 4, fontWeight: 700 }}>
                            [{post.comment_count}]
                          </span>
                        )}
                        {post.is_expert_answered && (
                          <span style={{
                            background: "#2EC4B6", color: "#fff", fontSize: 10,
                            padding: "1px 4px", borderRadius: 2, marginLeft: 6, fontWeight: 600,
                          }}>
                            전문가답변
                          </span>
                        )}
                      </Link>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                        <span>{post.author?.nickname ?? "익명"}</span>
                        <GradeBadge points={post.author?.points ?? 0} role={(post.author as any)?.role} showLabel={false} />
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: "#aaa" }}>{formatDate(post.created_at)}</td>
                    <td style={tdStyle}>{post.view_count}</td>
                    <td style={{ ...tdStyle, color: post.like_count >= 10 ? "#FF6B35" : "#888" }}>
                      {post.like_count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* 페이지네이션 (더미) */}
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 20 }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  style={{
                    width: 28, height: 28, border: "1px solid #ddd", background: n === 1 ? "#FF6B35" : "#fff",
                    color: n === 1 ? "#fff" : "#333", fontSize: 12, cursor: "pointer", borderRadius: 2,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* 사이드바 (PC만) */}
          <aside style={{ width: 240, flexShrink: 0 }} className="sidebar-hide-mobile">
            {/* 유저 카드 */}
            {user && (
              <div style={{
                background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4,
                padding: 16, marginBottom: 16,
              }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>{user.nickname}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{user.email}</div>
                <div style={{
                  display: "flex", justifyContent: "space-between",
                  marginTop: 12, padding: "10px 0", borderTop: "1px solid #f0f0f0",
                }}>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#FF6B35" }}>{user.points}</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>포인트</div>
                  </div>
                  <div style={{ textAlign: "center", flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 700, color: "#2EC4B6" }}>3</div>
                    <div style={{ fontSize: 11, color: "#aaa" }}>게시글</div>
                  </div>
                </div>
                <Link
                  href="/community/write"
                  style={{
                    display: "block", textAlign: "center", background: "#FF6B35",
                    color: "#fff", padding: "8px", borderRadius: 4, fontSize: 13,
                    fontWeight: 600, marginTop: 8, textDecoration: "none",
                  }}
                >
                  글쓰기
                </Link>
              </div>
            )}

            {/* 인기글 */}
            <div style={{
              background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4,
              overflow: "hidden",
            }}>
              <div style={{
                background: "#FF6B35", color: "#fff", padding: "8px 12px",
                fontSize: 13, fontWeight: 700,
              }}>
                실시간 인기글
              </div>
              <div style={{ padding: 8 }}>
                {posts.slice(0, 5).map((post, i) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 4px", color: "#333", textDecoration: "none",
                      fontSize: 12, borderBottom: i < 4 ? "1px solid #f8f8f8" : "none",
                    }}
                  >
                    <span style={{
                      fontWeight: 700, color: i < 3 ? "#FF6B35" : "#aaa", minWidth: 16,
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

      {/* 모바일 반응형은 globals.css에서 처리 */}
    </>
  );
}

const thStyle: React.CSSProperties = {
  padding: "8px 6px", fontSize: 12, fontWeight: 600, color: "#666", textAlign: "center",
};
const tdStyle: React.CSSProperties = {
  padding: "9px 6px", fontSize: 13, textAlign: "center",
};
