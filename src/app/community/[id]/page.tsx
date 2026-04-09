"use client";
import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { useAppStore } from "../../../lib/store";
import { supabase } from "../../../lib/supabase";
import { formatDate, getCategoryColor } from "../../../lib/utils";

const DEMO_COMMENTS = [
  { id: "c1", nickname: "수의사김", content: "식욕부진이 2일 이상 지속되면 병원 방문을 권합니다. 구토나 설사 증상이 동반되면 더 빨리 가셔야 해요.", is_expert: true, time: "10:45" },
  { id: "c2", nickname: "냥이집사", content: "저도 예전에 같은 경험 했었어요. 사료 바꿔보니까 잘 먹더라구요!", is_expert: false, time: "11:02" },
  { id: "c3", nickname: "고양이사랑", content: "혹시 최근에 환경 변화가 있었나요? 스트레스로 안 먹는 경우도 많아요", is_expert: false, time: "11:30" },
  { id: "c4", nickname: "반려인", content: "공감합니다 ㅠㅠ 우리 고양이도 가끔 그래요", is_expert: false, time: "12:15" },
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
    router.push("/");
  };

  if (!post) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 16px", textAlign: "center" }}>
          <p style={{ color: "#888" }}>게시글을 찾을 수 없습니다.</p>
          <Link href="/" style={{ color: "#FF6B35" }}>목록으로 돌아가기</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4 }}>
          {/* 글 헤더 */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{
                color: getCategoryColor(post.category), fontWeight: 700, fontSize: 13,
              }}>
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
              <span><b style={{ color: "#333" }}>{post.author?.nickname}</b></span>
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

          {/* 추천/비추 */}
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

          {/* 댓글 */}
          <div style={{ padding: "16px 20px" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
              댓글 {DEMO_COMMENTS.length}개
            </h3>
            {DEMO_COMMENTS.map((c) => (
              <div key={c.id} style={{
                padding: "12px 0", borderBottom: "1px solid #f0f0f0",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, fontSize: 13, color: "#333" }}>{c.nickname}</span>
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
          <Link href="/" style={{
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
