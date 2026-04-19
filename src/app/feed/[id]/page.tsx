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
import { formatDate, safeNickname } from "../../../lib/utils";
import { getSeverityColor, getSeverityLabel } from "../../../lib/symptomAnalyzer";
import AIResultCard from "../../../components/AIResultCard";
import { withSafeAnalysis } from "../../../lib/analysisSafety";
import type { FeedPost, FeedComment, ExpertAnswer, UserRole } from "../../../types";

const ROLE_LABEL: Record<string, string> = {
  vet: "🩺 수의사",
  vet_student: "🎓 수의학 전공",
  vet_clinic: "🏥 동물병원",
  behaviorist: "🐾 행동 전문가",
  petshop: "🏪 펫샵",
  admin: "⚙️ 운영자",
};

function canAnswerAsExpert(role?: UserRole | null) {
  return !!role && ["vet", "vet_student", "vet_clinic", "behaviorist", "admin"].includes(role);
}

export default function FeedDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [post, setPost] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [showVets, setShowVets] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [expertAnswers, setExpertAnswers] = useState<ExpertAnswer[]>([]);
  const [expertAnswer, setExpertAnswer] = useState("");
  const [expertSeverity, setExpertSeverity] = useState<"normal" | "mild" | "moderate" | "urgent">("mild");
  const [expertFollowUp, setExpertFollowUp] = useState(false);
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [acceptingAnswerId, setAcceptingAnswerId] = useState<string | null>(null);
  const ACCEPT_REWARD_POINTS = 50;

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

    // 전문가 답변 로드 (테이블 미존재 시 조용히 무시)
    supabase.from("expert_answers")
      .select("*, expert:users(id, nickname, role, clinic_name, license_no, school_name, specialty, points)")
      .eq("feed_post_id", id)
      .order("created_at", { ascending: true })
      .then(({ data, error }) => {
        if (!error && data) setExpertAnswers(data as ExpertAnswer[]);
      });

    // 페이지 접근 시 만료 건 자동 정산(7일 미채택)
    supabase.rpc("settle_expired_expert_rewards", { p_limit: 50, p_auto_points: 20 }).then(() => {
      // 정산 후 다시 전문가 답변 상태 동기화
      supabase.from("feed_posts")
        .select("*, author:users(id, nickname, avatar_url, points, role)")
        .eq("id", id).single()
        .then(({ data }) => { if (data) setPost(data); });
    });
  }, [id]);

  const handleExpertAnswer = async () => {
    if (!expertAnswer.trim() || !user) return;
    if (!canAnswerAsExpert(user.role)) { alert("전문가 계정만 답변할 수 있습니다."); return; }
    setSubmittingAnswer(true);
    const { data, error } = await supabase.from("expert_answers").insert({
      feed_post_id: id,
      expert_id: user.id,
      content: expertAnswer.trim(),
      expert_role: user.role,
      expert_name: user.nickname,
      expert_clinic: user.clinic_name ?? null,
      expert_license: user.license_no ?? null,
      severity_opinion: expertSeverity,
      follow_up_recommended: expertFollowUp,
    }).select("*, expert:users(id, nickname, role, clinic_name, license_no, school_name, specialty, points)").single();
    setSubmittingAnswer(false);
    if (error) {
      alert("답변 저장 실패: " + error.message + "\n(Supabase 마이그레이션이 실행됐는지 확인해주세요)");
      return;
    }
    if (data) {
      setExpertAnswers((prev) => [...prev, data as ExpertAnswer]);
      setExpertAnswer("");
      setExpertFollowUp(false);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || !user || user.id === "demo-user") return;
    await supabase.from("feed_comments").insert({ feed_post_id: id, author_id: user.id, content: newComment.trim() });
    await supabase.from("feed_posts").update({ comment_count: (post?.comment_count ?? 0) + 1 }).eq("id", id);
    await supabase.from("point_logs").insert({ user_id: user.id, amount: 5, reason: "피드 댓글" });
    await supabase.rpc("add_points", { uid: user.id, pts: 5 });

    // 글 작성자에게 댓글 알림
    if (post?.author_id && post.author_id !== user.id) {
      await supabase.rpc("create_notification", {
        p_user_id: post.author_id,
        p_type: "feed_comment",
        p_title: "새 댓글이 달렸습니다",
        p_body: "작성한 피드에 새로운 댓글이 등록되었습니다.",
        p_link: `/feed/${id}`,
        p_meta: { feed_post_id: id },
      });
    }

    setNewComment("");
    const { data } = await supabase.from("feed_comments")
      .select("*, author:users(id, nickname, avatar_url, points)")
      .eq("feed_post_id", id).order("created_at", { ascending: true });
    if (data) setComments(data);
    if (post) setPost({ ...post, comment_count: post.comment_count + 1 });
  };

  const handleAcceptAnswer = async (answerId: string) => {
    if (!user || !post) return;
    if (post.author_id !== user.id) {
      alert("작성자만 답변 채택이 가능합니다.");
      return;
    }
    if (!confirm(`답변을 채택하고 ${ACCEPT_REWARD_POINTS}P를 지급할까요?`)) return;

    setAcceptingAnswerId(answerId);
    const { error } = await supabase.rpc("accept_expert_answer", {
      p_answer_id: answerId,
      p_reward_points: ACCEPT_REWARD_POINTS,
    });
    setAcceptingAnswerId(null);

    if (error) {
      alert("채택 실패: " + error.message);
      return;
    }

    // 작성자 포인트 및 포스트 상태 동기화
    const [{ data: refreshedPost }, { data: refreshedUser }] = await Promise.all([
      supabase.from("feed_posts")
        .select("*, author:users(id, nickname, avatar_url, points, role)")
        .eq("id", id).single(),
      supabase.from("users").select("*").eq("id", user.id).single(),
    ]);
    if (refreshedPost) setPost(refreshedPost as FeedPost);
    if (refreshedUser) useAppStore.getState().setUser(refreshedUser as any);

    // 답변 목록 재조회
    const { data } = await supabase.from("expert_answers")
      .select("*, expert:users(id, nickname, role, clinic_name, license_no, school_name, specialty, points)")
      .eq("feed_post_id", id)
      .order("created_at", { ascending: true });
    if (data) setExpertAnswers(data as ExpertAnswer[]);

    alert(`채택 완료! 전문가에게 ${ACCEPT_REWARD_POINTS}P가 지급되었습니다.`);
  };

  if (!post) {
    return (<><Header /><main style={{ maxWidth: 500, margin: "0 auto", padding: 40, textAlign: "center" }}>
      <p style={{ color: "#888" }}>게시글을 찾을 수 없습니다.</p>
      <Link href="/feed" style={{ color: "#FF6B35" }}>피드로 돌아가기</Link>
    </main><Footer /></>);
  }

  const analysis = withSafeAnalysis(post.analysis_result, {
    request_expert: post.request_expert,
    expert_status: post.expert_status,
  });
  const sevColor = analysis ? getSeverityColor(analysis.severity) : null;
  const authorNick = safeNickname(post.author?.nickname, (post.author as any)?.id);

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
              {authorNick.charAt(0)}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <b style={{ fontSize: 14 }}>{authorNick}</b>
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

          {/* 이미지 / 동영상 */}
          {post.image_url?.endsWith(".mp4") ? (
            <video src={post.image_url} controls playsInline style={{ width: "100%", display: "block" }} />
          ) : (
            <img src={post.image_url} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              style={{ width: "100%", display: "block" }} />
          )}

          {/* 좋아요/댓글 */}
          <div style={{ padding: "10px 16px", display: "flex", gap: 16 }}>
            <span style={{ fontSize: 14 }}>❤️ <b>{post.like_count}</b></span>
            <span style={{ fontSize: 14 }}>💬 <b>{post.comment_count}</b></span>
          </div>

          {/* 설명 */}
          <div style={{ padding: "0 16px 12px", fontSize: 14, lineHeight: 1.7 }}>
            <b>{authorNick}</b> {post.description}
          </div>

          {/* ── 새 AI 결과 카드 (신호등 + FGS + bbox + O2O CTA) ── */}
          {analysis && (
            <div style={{ margin: "0 16px 16px" }}>
              <AIResultCard imageUrl={post.image_url} analysis={analysis} />
              {/* 주변 병원 리스트는 주의/긴급 때만 별도 노출 */}
              {(analysis.severity === "urgent" || analysis.severity === "moderate") && (
                <div style={{ marginTop: 14 }}>
                  <VetClinicList is24hOnly={analysis.severity === "urgent"} />
                </div>
              )}
              {(analysis.severity === "mild" || analysis.severity === "normal") && (
                <>
                  <button onClick={() => setShowVets(!showVets)} style={{
                    marginTop: 12, width: "100%", padding: "10px",
                    background: "#0369A1", color: "#fff", border: "none",
                    borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer",
                    fontFamily: "inherit",
                  }}>
                    {showVets ? "병원 목록 닫기" : "🏥 주변 동물병원 찾기"}
                  </button>
                  {showVets && <div style={{ marginTop: 12 }}><VetClinicList /></div>}
                </>
              )}
            </div>
          )}

          {/* ── 전문가 답변 섹션 ── */}
          <div style={{ margin: "0 16px 16px" }}>
            {/* 요청 상태 배지 */}
            {post.request_expert && (
              <div style={{
                background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 8,
                padding: "10px 12px", marginBottom: 12, fontSize: 12, color: "#9A3412",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>👨‍⚕️</span>
                <div style={{ flex: 1, lineHeight: 1.5 }}>
                  <b>전문가 답변 요청 중</b>
                  {post.expert_target && ` · 대상: ${post.expert_target === "vet" ? "수의사" : post.expert_target === "vet_clinic" ? "동물병원" : "행동 전문가"}`}
                </div>
                {post.expert_status === "answered" && (
                  <span style={{ background: "#059669", color: "#fff", padding: "2px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>
                    답변 완료
                  </span>
                )}
              </div>
            )}

            {/* 전문가 답변 목록 */}
            {expertAnswers.map((a) => {
              const sv = a.severity_opinion;
              const svColor = sv === "urgent" ? "#DC2626" : sv === "moderate" ? "#D97706" : sv === "mild" ? "#0369A1" : sv === "normal" ? "#059669" : "#6B7280";
              return (
                <div key={a.id} style={{
                  background: "#fff", border: "2px solid #FDBA74",
                  borderRadius: 12, padding: 16, marginBottom: 10,
                  boxShadow: "0 2px 8px rgba(255,107,53,0.08)",
                }}>
                  {/* 전문가 뱃지 헤더 */}
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12,
                      background: "linear-gradient(135deg, #FF6B35, #F59E0B)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 18, fontWeight: 800, flexShrink: 0,
                    }}>✓</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          background: "#1D1D1F", color: "#fff", padding: "2px 8px", borderRadius: 4,
                        }}>
                          {ROLE_LABEL[a.expert_role] || "전문가"}
                        </span>
                        <b style={{ fontSize: 14 }}>{a.expert_name || safeNickname(a.expert?.nickname, a.expert_id)}</b>
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>
                        {a.expert_clinic && <span>{a.expert_clinic} · </span>}
                        {a.expert_license && <span>면허 {a.expert_license.slice(0, 4)}••• · </span>}
                        <span>{formatDate(a.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* 심각도 의견 */}
                  {sv && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        background: svColor + "15", color: svColor,
                        padding: "3px 10px", borderRadius: 999,
                      }}>
                        {sv === "urgent" ? "🚨 긴급" : sv === "moderate" ? "⚠️ 주의" : sv === "mild" ? "💡 관찰" : "✅ 정상"}
                      </span>
                      {a.follow_up_recommended && (
                        <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 600 }}>
                          내원 권장
                        </span>
                      )}
                    </div>
                  )}

                  {/* 본문 */}
                  <div style={{ fontSize: 14, color: "#1D1D1F", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                    {a.content}
                  </div>

                  {/* 답변 채택 버튼: 글 작성자만 가능, 1회만 */}
                  {user && post.author_id === user.id && !post.accepted_expert_answer_id && (
                    <button
                      onClick={() => handleAcceptAnswer(a.id)}
                      disabled={acceptingAnswerId === a.id}
                      style={{
                        marginTop: 12,
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid #F59E0B",
                        background: "#FFF7ED",
                        color: "#9A3412",
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: acceptingAnswerId === a.id ? "default" : "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {acceptingAnswerId === a.id ? "채택 중..." : `답변 채택하기 (${ACCEPT_REWARD_POINTS}P 지급)`}
                    </button>
                  )}

                  {post.accepted_expert_answer_id === a.id && (
                    <div style={{
                      marginTop: 10,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#ECFDF5",
                      color: "#065F46",
                      border: "1px solid #A7F3D0",
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                    }}>
                      ✅ 채택된 답변
                    </div>
                  )}
                </div>
              );
            })}

            {/* 전문가 답변 삽입 폼 (전문가 계정만) */}
            {user && canAnswerAsExpert(user.role) && !id.startsWith("df") && (
              <div style={{
                background: "#F9FAFB", border: "1px dashed #D1D5DB",
                borderRadius: 10, padding: 14, marginBottom: 10,
              }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#1D1D1F", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    background: "#1D1D1F", color: "#fff", padding: "2px 6px", borderRadius: 4,
                  }}>
                    {ROLE_LABEL[user.role || "user"]}
                  </span>
                  <span>전문가로 답변하기</span>
                </div>
                <textarea
                  value={expertAnswer}
                  onChange={(e) => setExpertAnswer(e.target.value)}
                  placeholder="진료 소견·처방·예상 비용까지 상세히 답변해주세요. (200~600자 권장)"
                  style={{
                    width: "100%", minHeight: 100, padding: "10px 12px",
                    border: "1px solid #D1D5DB", borderRadius: 8, fontSize: 13, lineHeight: 1.6,
                    outline: "none", fontFamily: "inherit", resize: "vertical",
                  }}
                />
                <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                  {(["normal","mild","moderate","urgent"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setExpertSeverity(s)}
                      style={{
                        padding: "6px 12px", borderRadius: 999,
                        border: `1.5px solid ${expertSeverity === s ? "#FF6B35" : "#E5E7EB"}`,
                        background: expertSeverity === s ? "#FFF7ED" : "#fff",
                        color: expertSeverity === s ? "#C2410C" : "#4B5563",
                        fontSize: 11, fontWeight: expertSeverity === s ? 700 : 500,
                        cursor: "pointer", fontFamily: "inherit",
                      }}
                    >
                      {s === "urgent" ? "🚨 긴급" : s === "moderate" ? "⚠️ 주의" : s === "mild" ? "💡 관찰" : "✅ 정상"}
                    </button>
                  ))}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 10, fontSize: 12, color: "#4B5563", cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={expertFollowUp}
                    onChange={(e) => setExpertFollowUp(e.target.checked)}
                    style={{ width: 14, height: 14, accentColor: "#FF6B35" }}
                  />
                  내원(병원 방문) 권장
                </label>
                <button
                  onClick={handleExpertAnswer}
                  disabled={submittingAnswer || !expertAnswer.trim()}
                  style={{
                    marginTop: 10, padding: "10px 16px",
                    background: submittingAnswer || !expertAnswer.trim() ? "#D1D5DB" : "#FF6B35",
                    color: "#fff", border: "none", borderRadius: 8,
                    fontSize: 13, fontWeight: 700,
                    cursor: submittingAnswer || !expertAnswer.trim() ? "default" : "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  {submittingAnswer ? "등록 중..." : "전문가 답변 등록"}
                </button>
              </div>
            )}
          </div>

          {/* 댓글 */}
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#888" }}>댓글 {comments.length}개</div>
            {comments.map((c) => (
              <div key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #f8f8f8" }}>
                <span style={{ fontSize: 13, fontWeight: 700 }}>{safeNickname(c.author?.nickname, (c.author as any)?.id)}</span>
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
