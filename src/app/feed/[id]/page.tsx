"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import GradeBadge from "../../../components/GradeBadge";
import VetClinicList from "../../../components/VetClinicList";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";
import { DEMO_FEED } from "../../../lib/demoFeed";
import { formatDate } from "../../../lib/utils";
import { getSeverityColor, getSeverityLabel } from "../../../lib/symptomAnalyzer";
import type { FeedPost, FeedComment } from "../../../types";

export default function FeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showVets, setShowVets] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    setDeleting(true);
    // Storage 이미지 삭제 (실패해도 진행)
    if (post?.image_url) {
      const path = post.image_url.split("/feed-images/")[1];
      if (path) await supabase.storage.from("feed-images").remove([path]);
    }
    // DB 삭제 (댓글 먼저, 그 다음 글)
    await supabase.from("feed_comments").delete().eq("feed_post_id", id);
    await supabase.from("feed_likes").delete().eq("feed_post_id", id);
    const { error } = await supabase.from("feed_posts").delete().eq("id", id);
    setDeleting(false);
    if (error) { alert("삭제 실패: " + error.message); return; }
    alert("삭제되었습니다.");
    router.push("/feed");
  };

  useEffect(() => {
    // 데모 데이터에서 먼저 찾기
    const demo = DEMO_FEED.find((p) => p.id === id);
    if (demo) {
      setPost(demo);
      return;
    }

    // DB에서 찾기
    supabase.from("feed_posts")
      .select("*, author:users(id, nickname, avatar_url, points, role)")
      .eq("id", id).single()
      .then(({ data }) => { if (data) setPost(data); });

    supabase.from("feed_comments")
      .select("*, author:users(id, nickname, avatar_url, points)")
      .eq("feed_post_id", id)
      .order("created_at", { ascending: true })
      .then(({ data }) => { if (data) setComments(data); });
  }, [id]);

  const handleComment = async () => {
    if (!newComment.trim() || !user || user.id === "demo-user") return;
    await supabase.from("feed_comments").insert({ feed_post_id: id, author_id: user.id, content: newComment.trim() });
    await supabase.from("feed_posts").update({ comment_count: (post?.comment_count ?? 0) + 1 }).eq("id", id);
    await supabase.from("point_logs").insert({ user_id: user.id, amount: 5, reason: "피드 댓글" });
    await supabase.rpc("add_points", { uid: user.id, pts: 5 });
    setNewComment("");
    const { data } = await supabase.from("feed_comments")
      .select("*, author:users(id, nickname, avatar_url, points)")
      .eq("feed_post_id", id).order("created_at", { ascending: true });
    if (data) setComments(data);
    if (post) setPost({ ...post, comment_count: post.comment_count + 1 });
  };

  if (!post) {
    return (<><Header /><main style={{ maxWidth: 500, margin: "0 auto", padding: 40, textAlign: "center" }}>
      <p style={{ color: "#888" }}>게시글을 찾을 수 없습니다.</p>
      <Link href="/feed" style={{ color: "#FF6B35" }}>피드로 돌아가기</Link>
    </main><Footer /></>);
  }

  const analysis = post.analysis_result;
  const sevColor = analysis ? getSeverityColor(analysis.severity) : null;

  return (
    <>
      <Header />
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e0e0e0", overflow: "hidden" }}>
          {/* 작성자 */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%", background: "#FF6B35",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", fontSize: 16, fontWeight: 700,
            }}>
              {post.author?.nickname?.charAt(0) ?? "?"}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <b style={{ fontSize: 14 }}>{post.author?.nickname}</b>
                <GradeBadge points={post.author?.points ?? 0} role={(post.author as any)?.role} />
              </div>
              <div style={{ fontSize: 11, color: "#aaa" }}>
                {post.pet_name && `${post.pet_name} · `}{formatDate(post.created_at)}
              </div>
            </div>
            {/* 본인 글 삭제 버튼 */}
            {user && post.author_id === user.id && !id.startsWith("df") && (
              <button onClick={handleDelete} disabled={deleting} style={{
                background: "none", border: "1px solid #E5E7EB", borderRadius: 6,
                padding: "4px 10px", fontSize: 12, color: "#9CA3AF", cursor: "pointer",
              }}>
                {deleting ? "삭제 중..." : "삭제"}
              </button>
            )}
          </div>

          {/* 이미지 */}
          <img src={post.image_url} alt="" style={{ width: "100%", display: "block" }} />

          {/* 좋아요/댓글 */}
          <div style={{ padding: "10px 16px", display: "flex", gap: 16 }}>
            <span style={{ fontSize: 14 }}>❤️ <b>{post.like_count}</b></span>
            <span style={{ fontSize: 14 }}>💬 <b>{post.comment_count}</b></span>
          </div>

          {/* 설명 */}
          <div style={{ padding: "0 16px 12px", fontSize: 14, lineHeight: 1.7 }}>
            <b>{post.author?.nickname}</b> {post.description}
          </div>

          {/* AI 분석 결과 — 모든 등급 표시 */}
          {analysis && (
            <div style={{ margin: "0 16px 16px", borderRadius: 8, overflow: "hidden", border: `1px solid ${
              analysis.severity === "normal" ? "#A7F3D0" : (sevColor?.bg || "#ddd") + "30"
            }` }}>
              <div style={{
                background: analysis.severity === "normal" ? "#059669" : (sevColor?.bg || "#888"),
                color: "#fff", padding: "10px 14px", fontSize: 14, fontWeight: 700,
              }}>
                {analysis.severity === "normal" ? "✅ AI 분석: 정상입니다"
                  : analysis.severity === "urgent" ? "🚨 긴급 증상 분석 결과"
                  : analysis.severity === "moderate" ? "⚠️ 주의 증상 분석 결과"
                  : "💡 관찰 필요 증상 분석 결과"}
              </div>
              <div style={{ padding: 14 }}>
                {analysis.severity === "normal" ? (
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#059669" }}>
                    특별한 이상 증상이 감지되지 않았습니다. 건강한 상태로 보입니다. 정기적인 건강검진을 권장합니다.
                  </p>
                ) : (
                  <>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                      {analysis.symptoms.map((s, i) => (
                        <span key={i} style={{
                          background: (sevColor?.bg || "#888") + "15", color: sevColor?.bg || "#888",
                          padding: "2px 8px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                        }}>{s}</span>
                      ))}
                    </div>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#444" }}>{analysis.summary}</p>
                    <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: "#666", fontStyle: "italic" }}>{analysis.recommendation}</p>
                  </>
                )}
                {/* 주변 동물병원 — 주의/긴급은 자동 표시, 정상/관찰은 버튼 클릭 */}
                {(analysis.severity === "urgent" || analysis.severity === "moderate") ? (
                  <div style={{ marginTop: 12 }}>
                    <VetClinicList is24hOnly={analysis.severity === "urgent"} />
                  </div>
                ) : (
                  <>
                    <button onClick={() => setShowVets(!showVets)} style={{
                      marginTop: 12, width: "100%", padding: "10px",
                      background: analysis.severity === "normal" ? "#059669" : "#0369A1",
                      color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer",
                    }}>
                      {showVets ? "병원 목록 닫기" : "🏥 주변 동물병원 찾기"}
                    </button>
                    {showVets && <div style={{ marginTop: 12 }}><VetClinicList /></div>}
                  </>
                )}
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 10 }}>※ AI 자동 분석이며, 의학적 진단이 아닙니다.</div>
              </div>
            </div>
          )}

          {/* 댓글 */}
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#888" }}>댓글 {comments.length}개</div>
            {comments.map((c) => (
              <div key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #f8f8f8" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{c.author?.nickname}</span>
                <span style={{ fontSize: 13, color: "#333", marginLeft: 8 }}>{c.content}</span>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{formatDate(c.created_at)}</div>
              </div>
            ))}
            {id.startsWith("df") && comments.length === 0 && (
              <div style={{ color: "#aaa", fontSize: 12, padding: "8px 0" }}>데모 게시글에는 댓글이 표시되지 않습니다.</div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글 달기... (+5P)" onKeyDown={(e) => e.key === "Enter" && handleComment()}
                style={{ flex: 1, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 20, fontSize: 13, outline: "none" }} />
              <button onClick={handleComment} style={{
                background: "#FF6B35", color: "#fff", border: "none", borderRadius: 20,
                padding: "0 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>등록</button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/feed" style={{ color: "#888", fontSize: 13 }}>← 피드로 돌아가기</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
