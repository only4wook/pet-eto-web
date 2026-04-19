"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useAppStore } from "../../../lib/store";
import { supabase } from "../../../lib/supabase";
import { formatDate, getCategoryColor, safeNickname } from "../../../lib/utils";
import { COMMENTS_MAP, AI_OPINIONS } from "../../../lib/demoComments";
import type { DemoComment } from "../../../lib/demoComments";

const DEFAULT_COMMENTS: DemoComment[] = [
  { id: "c1", nickname: "수의사김", content: "좋은 글이네요! 궁금한 점이 있으시면 편하게 질문해주세요.", is_expert: true, time: "10:45" },
  { id: "c2", nickname: "반려인", content: "유용한 정보 감사합니다 :)", is_expert: false, time: "11:20" },
  { id: "c3", nickname: "집사초보", content: "저도 비슷한 경험이 있어서 공감이 많이 됩니다!", is_expert: false, time: "12:05" },
];

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const posts = useAppStore((s) => s.posts);
  const user = useAppStore((s) => s.user);
  const post = posts.find((p) => p.id === id);
  const [comment, setComment] = useState("");
  const [liked, setLiked] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const isDbPost = id.length > 10 && !id.startsWith("p");
  const isOwner = user && post?.author_id === user.id;

  // Get post-specific comments and AI opinion
  const postComments = COMMENTS_MAP[id] || DEFAULT_COMMENTS;
  const aiOpinion = AI_OPINIONS[id];

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setDeleting(true);
    if (isDbPost) {
      await supabase.from("comments").delete().eq("post_id", id);
      await supabase.from("likes").delete().eq("target_id", id);
      const { error } = await supabase.from("posts").delete().eq("id", id);
      if (error) { alert("삭제 실패: " + error.message); setDeleting(false); return; }
    }
    alert("삭제되었습니다.");
    router.push("/community");
  };

  if (!post) {
    return (
      <>
        <Header />
        <main className="container-pet" style={{ padding: "60px 16px", textAlign: "center", flex: 1 }}>
          <p style={{ color: "#888" }}>게시글을 찾을 수 없습니다.</p>
          <Link href="/community" style={{ color: "#FF6B35" }}>목록으로 돌아가기</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container-pet" style={{ padding: "20px 0", flex: 1 }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8 }}>
          {/* 글 헤더 */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ color: getCategoryColor(post.category), fontWeight: 700, fontSize: 13 }}>
                [{post.category}]
              </span>
              {post.is_expert_answered && (
                <span style={{
                  background: "#2EC4B6", color: "#fff", fontSize: 10,
                  padding: "2px 6px", borderRadius: 2, fontWeight: 600,
                }}>
                  전문가 답변 완료
                </span>
              )}
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, lineHeight: 1.4 }}>
              {post.title}
            </h1>
            <div style={{
              display: "flex", gap: 16, marginTop: 10, fontSize: 12, color: "#888",
              flexWrap: "wrap", alignItems: "center",
            }}>
              <span><b style={{ color: "#333" }}>{safeNickname(post.author?.nickname, (post.author as any)?.id)}</b></span>
              <span>{formatDate(post.created_at)}</span>
              <span>조회 {post.view_count}</span>
              <span>추천 {post.like_count}</span>
              {isOwner && (
                <button onClick={handleDelete} disabled={deleting} style={{
                  marginLeft: "auto", background: "none", border: "1px solid #E5E7EB",
                  borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "#9CA3AF", cursor: "pointer",
                }}>
                  {deleting ? "삭제 중..." : "🗑 삭제"}
                </button>
              )}
            </div>
          </div>

          {/* 본문 */}
          <div style={{
            padding: "24px 20px", minHeight: 200, fontSize: 14, lineHeight: 1.8,
            borderBottom: "1px solid #e0e0e0", whiteSpace: "pre-wrap",
          }}>
            {post.content}
          </div>

          {/* 태그 */}
          {post.tags.length > 0 && (
            <div style={{ padding: "12px 20px", display: "flex", gap: 6, flexWrap: "wrap", borderBottom: "1px solid #e0e0e0" }}>
              {post.tags.map((tag) => (
                <span key={tag} style={{
                  background: "#f4f4f4", padding: "3px 10px", borderRadius: 12,
                  fontSize: 12, color: "#666",
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 추천 */}
          <div style={{
            display: "flex", justifyContent: "center", gap: 16, padding: "20px",
            borderBottom: "1px solid #e0e0e0",
          }}>
            <button
              onClick={() => setLiked(!liked)}
              style={{
                border: liked ? "2px solid #FF6B35" : "1px solid #ddd",
                background: liked ? "#FFF5F0" : "#fff",
                padding: "10px 32px", borderRadius: 4, cursor: "pointer",
                fontSize: 14, fontWeight: 700, color: liked ? "#FF6B35" : "#333",
              }}
            >
              👍 추천 {post.like_count + (liked ? 1 : 0)}
            </button>
          </div>

          {/* AI 의견 */}
          {aiOpinion && (
            <div style={{
              margin: "16px 20px", padding: "16px 18px",
              background: "linear-gradient(135deg, #FFF7ED 0%, #FFF1E6 100%)",
              borderRadius: 12, border: "1px solid #FFD6B0",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  background: "linear-gradient(135deg, #FF6B35, #FF8F5E)",
                  color: "#fff", fontSize: 11, padding: "3px 10px", borderRadius: 20,
                  fontWeight: 700, letterSpacing: "0.02em",
                }}>
                  🤖 AI 분석
                </span>
                <span style={{ fontWeight: 800, fontSize: 14, color: "#FF6B35" }}>P.E.T AI</span>
                <span style={{ fontSize: 11, color: "#B0B0B0", marginLeft: "auto" }}>자동 분석</span>
              </div>
              <p style={{
                margin: 0, fontSize: 13, lineHeight: 1.7, color: "#5A3E28",
                wordBreak: "keep-all",
              }}>
                {aiOpinion.content}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: 11, color: "#C08050" }}>
                ※ AI 의견은 참고용이며, 정확한 진단은 수의사 상담을 권장합니다.
              </p>
            </div>
          )}

          {/* 댓글 */}
          <div style={{ padding: "16px 20px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
              댓글 {postComments.length}개
            </h3>
            {postComments.map((c) => (
              <div key={c.id} style={{
                padding: "12px 0", borderBottom: "1px solid #f0f0f0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#333" }}>{safeNickname(c.nickname, c.id)}</span>
                  {c.is_expert && (
                    <span style={{
                      background: "#2EC4B6", color: "#fff", fontSize: 10,
                      padding: "1px 5px", borderRadius: 2, fontWeight: 600,
                    }}>
                      전문가
                    </span>
                  )}
                  <span style={{ fontSize: 11, color: "#aaa" }}>{c.time}</span>
                </div>
                <p style={{
                  margin: 0, fontSize: 13, lineHeight: 1.6, color: "#444",
                  background: c.is_expert ? "#F0FFFE" : "transparent",
                  padding: c.is_expert ? "8px 10px" : "0",
                  borderRadius: 4, borderLeft: c.is_expert ? "3px solid #2EC4B6" : "none",
                }}>
                  {c.content}
                </p>
              </div>
            ))}

            {/* 댓글 입력 */}
            <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="댓글을 입력하세요... (댓글 작성 시 +5P)"
                style={{
                  flex: 1, border: "1px solid #ddd", borderRadius: 4, padding: "10px 12px",
                  fontSize: 13, resize: "vertical", minHeight: 60, outline: "none",
                  fontFamily: "inherit",
                }}
              />
              <button style={{
                background: "#FF6B35", color: "#fff", border: "none", borderRadius: 4,
                padding: "0 20px", cursor: "pointer", fontWeight: 600, fontSize: 13,
                alignSelf: "flex-end", height: 36,
              }}>
                등록
              </button>
            </div>
          </div>
        </div>

        {/* 목록 버튼 */}
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
          <Link href="/community" style={{
            border: "1px solid #ddd", padding: "8px 24px", borderRadius: 4,
            fontSize: 13, color: "#333", textDecoration: "none", background: "#fff",
          }}>
            목록으로
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
