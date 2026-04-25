"use client";
import Link from "next/link";
import GradeBadge from "./GradeBadge";
import { formatDate, safeNickname, stripInlineAiAnalysis } from "../lib/utils";
import { getSeverityColor, getSeverityLabel } from "../lib/symptomAnalyzer";
import { useI18n } from "./I18nProvider";
import type { FeedPost } from "../types";

// severity → i18n 레이블 매핑 (EN 모드일 때)
const SEVERITY_EN: Record<string, string> = {
  normal: "Normal",
  mild: "Mild",
  moderate: "Caution",
  urgent: "Urgent",
};

export default function FeedCard({ post }: { post: FeedPost }) {
  const analysis = post.analysis_result;
  const sevColor = analysis ? getSeverityColor(analysis.severity) : null;
  const displayNickname = safeNickname(post.author?.nickname, (post.author as any)?.id);
  const { t, locale } = useI18n();
  const userDescription = stripInlineAiAnalysis(post.description);

  return (
    <div style={{
      background: "#fff", borderRadius: 8, overflow: "hidden",
      border: "1px solid #e0e0e0", marginBottom: 16,
    }}>
      {/* 작성자 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", background: "#FF6B35",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontSize: 14, fontWeight: 700, flexShrink: 0,
        }}>
          {displayNickname.charAt(0)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{displayNickname}</span>
            <GradeBadge points={post.author?.points ?? 0} role={(post.author as any)?.role} showLabel={false} />
          </div>
          <div style={{ fontSize: 11, color: "#aaa" }}>
            {post.pet_name && <span>{post.pet_name} · </span>}
            {formatDate(post.created_at)}
          </div>
        </div>
        {/* AI 분석 배지 — 정상도 표시 */}
        {analysis && (
          <div style={{
            background: analysis.severity === "normal" ? "#ECFDF5" : (sevColor?.bg || "#F3F4F6"),
            color: analysis.severity === "normal" ? "#059669" : (sevColor?.color || "#666"),
            padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
          }}>
            {analysis.severity === "normal"
              ? (locale === "en" ? "✅ Normal" : "✅ 정상")
              : `AI ${locale === "en" ? (SEVERITY_EN[analysis.severity] || analysis.severity) : getSeverityLabel(analysis.severity)}`}
          </div>
        )}
      </div>

      {/* 이미지 / 동영상 */}
      <Link href={`/feed/${post.id}`}>
        {post.image_url?.endsWith(".mp4") ? (
          <video src={post.image_url} muted playsInline preload="metadata"
            style={{ width: "100%", maxHeight: 500, objectFit: "cover", display: "block", cursor: "pointer" }} />
        ) : post.image_url ? (
          <img src={post.image_url} alt=""
            onError={(e) => {
              const el = e.target as HTMLImageElement;
              el.style.display = "none";
              el.parentElement?.querySelector(".feed-img-fallback")?.setAttribute("style", "display:flex");
            }}
            style={{ width: "100%", maxHeight: 500, objectFit: "cover", display: "block", cursor: "pointer" }} />
        ) : null}
        <div className="feed-img-fallback" style={{
          display: "none", width: "100%", height: 200, background: "#F9FAFB",
          alignItems: "center", justifyContent: "center", color: "#9CA3AF", fontSize: 13,
        }}>
          {t("feed.imgError")}
        </div>
      </Link>

      {/* 좋아요 / 댓글 */}
      <div style={{ padding: "10px 16px", display: "flex", gap: 16, borderBottom: "1px solid #f0f0f0" }}>
        <span style={{ fontSize: 13, color: "#333" }}>
          ❤️ <b>{post.like_count}</b>
        </span>
        <Link href={`/feed/${post.id}`} style={{ fontSize: 13, color: "#333", textDecoration: "none" }}>
          💬 <b>{post.comment_count}</b>
        </Link>
      </div>

      {/* 설명: 피드 목록에서는 사용자가 쓴 글만 표시하고, AI 전문은 상세 페이지에서만 표시 */}
      <Link href={`/feed/${post.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ padding: "8px 16px 12px" }}>
          {/* 사용자 설명 */}
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#333" }}>
            <b style={{ marginRight: 6 }}>{displayNickname}</b>
            {userDescription.slice(0, 120)}
            {userDescription.length > 120 ? "..." : ""}
          </p>
        </div>
      </Link>
    </div>
  );
}
