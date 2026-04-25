"use client";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import GradeBadge from "../../../components/GradeBadge";
import VetClinicList from "../../../components/VetClinicList";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";
import { DEMO_FEED } from "../../../lib/demoFeed";
import { formatDate, safeNickname, stripInlineAiAnalysis } from "../../../lib/utils";
import { getSeverityColor, getSeverityLabel } from "../../../lib/symptomAnalyzer";
import { useI18n } from "../../../components/I18nProvider";
import type { FeedPost, FeedComment } from "../../../types";

// 증상 한글 → i18n 키 매핑 (EN 모드에서 영어로 표시)
const SYMPTOM_I18N: Record<string, string> = {
  "구토": "feed.symptomVomit",
  "식욕 부진": "feed.symptomAppetiteLoss",
  "은둔 행동": "feed.symptomHidden",
  "무기력": "feed.symptomLethargy",
  "가려움": "feed.symptomScratching",
  "설사": "feed.symptomDiarrhea",
};

function getExpertOpinionLabel(author: FeedComment["author"]): string | null {
  if (!author?.role) return null;
  if (author.role === "vet") return "수의사 의견";
  if (author.role === "vet_clinic") return "동물병원 의견";
  if (author.role === "vet_student") return "동물학과 의견";
  if (author.role === "behaviorist") return "행동전문가 의견";
  return null;
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
  const { t, locale } = useI18n();

  const handleDelete = async () => {
    if (!confirm(t("feed.deleteConfirm"))) return;
    setDeleting(true);
    if (post?.image_url) {
      const path = post.image_url.split("/feed-images/")[1];
      if (path) await supabase.storage.from("feed-images").remove([path]);
    }
    await supabase.from("feed_comments").delete().eq("feed_post_id", id);
    await supabase.from("feed_likes").delete().eq("feed_post_id", id);
    const { error } = await supabase.from("feed_posts").delete().eq("id", id);
    setDeleting(false);
    if (error) { alert(`${t("feed.deleteFailed")}: ${error.message}`); return; }
    alert(t("feed.deleted"));
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
      .select("*, author:users(id, nickname, avatar_url, points, role, clinic_name, school_name, specialty)")
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
      .select("*, author:users(id, nickname, avatar_url, points, role, clinic_name, school_name, specialty)")
      .eq("feed_post_id", id).order("created_at", { ascending: true });
    if (data) setComments(data);
    if (post) setPost({ ...post, comment_count: post.comment_count + 1 });
  };

  if (!post) {
    return (<><Header /><main style={{ maxWidth: 500, margin: "0 auto", padding: 40, textAlign: "center" }}>
      <p style={{ color: "#888" }}>{t("feed.notFound")}</p>
      <Link href="/feed" style={{ color: "#FF6B35" }}>{t("feed.backToFeed")}</Link>
    </main><Footer /></>);
  }

  const analysis = post.analysis_result;
  const sevColor = analysis ? getSeverityColor(analysis.severity) : null;
  const authorNick = safeNickname(post.author?.nickname, (post.author as any)?.id);
  const userDescription = stripInlineAiAnalysis(post.description);

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
                {deleting ? t("feed.deleting") : t("feed.delete")}
              </button>
            )}
          </div>

          {/* 이미지 / 동영상 */}
          {post.image_url?.endsWith(".mp4") ? (
            <video src={post.image_url} controls playsInline style={{ width: "100%", display: "block" }} />
          ) : (() => {
            const galleryUrls: string[] = Array.isArray((analysis as any)?.image_urls) && (analysis as any).image_urls.length > 1
              ? (analysis as any).image_urls
              : (post.image_url ? [post.image_url] : []);

            if (galleryUrls.length <= 1) {
              return (
                <img src={post.image_url} alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  style={{ width: "100%", display: "block" }} />
              );
            }

            return (
              <div style={{ position: "relative" }}>
                <div style={{
                  display: "flex",
                  overflowX: "auto",
                  scrollSnapType: "x mandatory",
                  WebkitOverflowScrolling: "touch",
                }}>
                  {galleryUrls.map((url, i) => (
                    <img key={url} src={url} alt={`사진 ${i + 1}`}
                      style={{ width: "100%", flex: "0 0 100%", scrollSnapAlign: "start", display: "block" }} />
                  ))}
                </div>
                <span style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.62)",
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 700,
                }}>
                  📷 {galleryUrls.length}장 · 좌우로 넘기기
                </span>
              </div>
            );
          })()}

          {/* 좋아요/댓글 */}
          <div style={{ padding: "10px 16px", display: "flex", gap: 16 }}>
            <span style={{ fontSize: 14 }}>❤️ <b>{post.like_count}</b></span>
            <span style={{ fontSize: 14 }}>💬 <b>{post.comment_count}</b></span>
          </div>

          {/* 설명 */}
          <div style={{ padding: "0 16px 12px", fontSize: 14, lineHeight: 1.7 }}>
            <b>{authorNick}</b> {userDescription}
          </div>

          {/* AI 분석 결과 — 새 analysis 필드 풀 렌더링 + 모든 severity 처리 */}
          {analysis && (() => {
            // Gemini 가 생성한 풀 분석 텍스트 (재분석 후 채워짐). 빈 문자열이면 legacy fallback.
            const fullAnalysisText: string = (analysis as any).analysis || "";
            const hasFullAnalysis = fullAnalysisText.trim().length > 50;
            const isPending = analysis.severity === "pending" as any;
            const references = (analysis as any).references || [];

            // 헤더 컬러: pending은 회색, urgent는 빨강, moderate는 주황, mild는 노랑, normal은 초록
            const headerBg =
              isPending ? "#6B7280" :
              analysis.severity === "normal" ? "#059669" :
              analysis.severity === "urgent" ? "#DC2626" :
              analysis.severity === "moderate" ? "#F97316" :
              analysis.severity === "mild" ? "#0369A1" : "#6B7280";

            const headerText =
              isPending ? t("feed.detailPendingTitle") :
              analysis.severity === "normal" ? t("feed.detailNormalTitle") :
              analysis.severity === "urgent" ? t("feed.detailUrgentTitle") :
              analysis.severity === "moderate" ? t("feed.detailCautionTitle") :
              t("feed.detailObserveTitle");

            // 마크다운 → JSX 간이 변환: **bold** + 줄바꿈 + * 리스트 + ### 헤더
            // (react-markdown 의존성 추가 회피, Gemini 출력 형식만 처리)
            const renderMarkdownLite = (text: string) => {
              const lines = text.split("\n");
              return lines.map((line, i) => {
                const trimmed = line.trim();
                if (!trimmed) return <div key={i} style={{ height: 6 }} />;
                // 구분선
                if (/^---+$/.test(trimmed)) {
                  return <hr key={i} style={{ border: "none", borderTop: "1px solid #E5E7EB", margin: "10px 0" }} />;
                }
                // ### 헤더 (사용 빈도 낮음)
                if (/^#{1,6}\s/.test(trimmed)) {
                  const stripped = trimmed.replace(/^#+\s/, "");
                  return <div key={i} style={{ fontWeight: 700, fontSize: 14, margin: "10px 0 4px", color: "#111" }}>{renderInline(stripped)}</div>;
                }
                // 리스트 항목 (* 또는 - 또는 숫자.)
                if (/^(\*|-|\d+\.)\s+/.test(trimmed)) {
                  const stripped = trimmed.replace(/^(\*|-|\d+\.)\s+/, "");
                  return (
                    <div key={i} style={{ display: "flex", gap: 8, margin: "3px 0", fontSize: 13.5, lineHeight: 1.7, color: "#1F2937" }}>
                      <span style={{ color: "#9CA3AF", flexShrink: 0 }}>•</span>
                      <span style={{ flex: 1 }}>{renderInline(stripped)}</span>
                    </div>
                  );
                }
                // 일반 단락 (이모지+굵게 헤더 포함)
                return (
                  <div key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: "#1F2937", margin: "3px 0" }}>
                    {renderInline(trimmed)}
                  </div>
                );
              });
            };
            // **bold** 인라인 처리
            const renderInline = (text: string): React.ReactNode => {
              const parts = text.split(/(\*\*[^*]+\*\*)/g);
              return parts.map((part, i) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                  return <strong key={i} style={{ fontWeight: 700, color: "#111" }}>{part.slice(2, -2)}</strong>;
                }
                return part;
              });
            };

            return (
            <div style={{ margin: "0 16px 16px", borderRadius: 8, overflow: "hidden", border: "1px solid #E5E7EB" }}>
              <div style={{
                background: headerBg,
                color: "#fff", padding: "10px 14px", fontSize: 14, fontWeight: 700,
              }}>
                {headerText}
              </div>
              <div style={{ padding: 14, background: "#fff" }}>
                {/* 1. Pending: 분석 미완료 안내 */}
                {isPending ? (
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#6B7280" }}>
                    {t("feed.detailPendingDesc")}
                  </p>
                ) : hasFullAnalysis ? (
                  /* 2. 새 분석: Gemini 풀 텍스트 마크다운 렌더링 */
                  <>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#6B7280", marginBottom: 8, letterSpacing: "-0.01em" }}>
                      {t("feed.aiDetailedAnalysisTitle")}
                    </div>
                    <div>{renderMarkdownLite(fullAnalysisText)}</div>
                    {(analysis as any).reanalyzedAt && (
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 12, paddingTop: 8, borderTop: "1px dashed #E5E7EB" }}>
                        {t("feed.aiReanalyzedAt")}: {new Date((analysis as any).reanalyzedAt).toLocaleString("ko-KR")}
                      </div>
                    )}
                  </>
                ) : analysis.severity === "normal" ? (
                  /* 3. Legacy normal: 기본 정상 안내 */
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#059669" }}>
                    {t("feed.detailNormalDesc")}
                  </p>
                ) : (
                  /* 4. Legacy non-normal: 기존 summary/recommendation */
                  <>
                    {analysis.symptoms && analysis.symptoms.length > 0 && (
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                        {analysis.symptoms.map((s: string, i: number) => {
                          const symKey = SYMPTOM_I18N[s];
                          return (
                            <span key={i} style={{
                              background: (sevColor?.bg || "#888") + "15", color: sevColor?.bg || "#888",
                              padding: "2px 8px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                            }}>{symKey ? t(symKey) : s}</span>
                          );
                        })}
                      </div>
                    )}
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.7, color: "#444" }}>{analysis.summary}</p>
                    {analysis.recommendation && (
                      <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.7, color: "#666", fontStyle: "italic" }}>{analysis.recommendation}</p>
                    )}
                  </>
                )}

                {/* 주변 동물병원 — 긴급/주의는 자동 노출, 그 외는 버튼 토글 */}
                {(analysis.severity === "urgent" || analysis.severity === "moderate") ? (
                  <div style={{ marginTop: 14 }}>
                    <VetClinicList is24hOnly={analysis.severity === "urgent"} emergencyMode={analysis.severity === "urgent"} />
                  </div>
                ) : !isPending && (
                  <>
                    <button onClick={() => setShowVets(!showVets)} style={{
                      marginTop: 12, width: "100%", padding: "10px",
                      background: analysis.severity === "normal" ? "#059669" : "#0369A1",
                      color: "#fff", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 700, cursor: "pointer",
                    }}>
                      {showVets ? t("feed.closeVets") : t("feed.findVets")}
                    </button>
                    {showVets && <div style={{ marginTop: 12 }}><VetClinicList /></div>}
                  </>
                )}
                {references.length > 0 && (
                  <div style={{ marginTop: 12, paddingTop: 10, borderTop: "1px dashed #E5E7EB" }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 5 }}>
                      {locale === "en" ? "References" : "참고 출처"}
                    </div>
                    {references.map((ref: any) => (
                      <a
                        key={ref.url}
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "block", fontSize: 11, lineHeight: 1.6, color: "#6B7280", textDecoration: "underline", textUnderlineOffset: 2 }}
                      >
                        {locale === "en" ? ref.titleEn : ref.title} — {locale === "en" ? ref.organizationEn : ref.organization}
                      </a>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 10 }}>{t("feed.aiDisclaimer")}</div>
              </div>
            </div>
            );
          })()}

          {/* 댓글 */}
          <div style={{ padding: "0 16px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#888" }}>{t("feed.commentsLabel")} {comments.length}{t("feed.commentsUnit")}</div>
            {comments.map((c) => {
              const expertLabel = getExpertOpinionLabel(c.author);
              const expertOrg = c.author?.clinic_name || c.author?.school_name || c.author?.specialty;
              return (
                <div key={c.id} style={{ padding: "8px 0", borderBottom: "1px solid #f8f8f8" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{safeNickname(c.author?.nickname, (c.author as any)?.id)}</span>
                    {expertLabel && (
                      <span style={{
                        fontSize: 10,
                        fontWeight: 800,
                        color: "#C2410C",
                        background: "#FFF7ED",
                        border: "1px solid #FDBA74",
                        borderRadius: 999,
                        padding: "2px 7px",
                      }}>
                        {expertLabel}
                      </span>
                    )}
                  </div>
                  {expertLabel && (
                    <div style={{ fontSize: 11, color: "#9A3412", marginTop: 4, lineHeight: 1.5 }}>
                      {expertOrg ? `${expertOrg} · ` : ""}전문가가 남긴 참고 의견입니다.
                    </div>
                  )}
                  <div style={{ fontSize: 13, color: "#333", marginTop: 4, lineHeight: 1.6 }}>{c.content}</div>
                  <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>{formatDate(c.created_at)}</div>
                </div>
              );
            })}
            {id.startsWith("df") && comments.length === 0 && (
              <div style={{ color: "#aaa", fontSize: 12, padding: "8px 0" }}>{t("feed.demoNoComments")}</div>
            )}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input value={newComment} onChange={(e) => setNewComment(e.target.value)}
                placeholder={t("feed.commentPlaceholder")} onKeyDown={(e) => e.key === "Enter" && handleComment()}
                style={{ flex: 1, padding: "8px 12px", border: "1px solid #ddd", borderRadius: 20, fontSize: 13, outline: "none" }} />
              <button onClick={handleComment} style={{
                background: "#FF6B35", color: "#fff", border: "none", borderRadius: 20,
                padding: "0 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>{t("feed.commentSubmit")}</button>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 16 }}>
          <Link href="/feed" style={{ color: "#888", fontSize: 13 }}>{t("feed.backToFeed")}</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
