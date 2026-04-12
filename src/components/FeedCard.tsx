"use client";
import Link from "next/link";
import GradeBadge from "./GradeBadge";
import { formatDate } from "../lib/utils";
import { getSeverityColor, getSeverityLabel } from "../lib/symptomAnalyzer";
import type { FeedPost } from "../types";

export default function FeedCard({ post }: { post: FeedPost }) {
  const analysis = post.analysis_result;
  const sevColor = analysis ? getSeverityColor(analysis.severity) : null;

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
          {post.author?.nickname?.charAt(0) ?? "?"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontWeight: 700, fontSize: 14 }}>{post.author?.nickname ?? "익명"}</span>
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
            {analysis.severity === "normal" ? "✅ 정상" : `AI ${getSeverityLabel(analysis.severity)}`}
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
          📷 이미지를 표시할 수 없습니다
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

      {/* 설명 + AI 분석 */}
      <Link href={`/feed/${post.id}`} style={{ textDecoration: "none", display: "block" }}>
        <div style={{ padding: "8px 16px 12px" }}>
          {/* 사용자 설명 */}
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#333" }}>
            <b style={{ marginRight: 6 }}>{post.author?.nickname}</b>
            {(post.description?.split("---")[0] || post.description || "").slice(0, 120)}
            {(post.description?.length || 0) > 120 ? "..." : ""}
          </p>
          {/* Gemini AI 이미지 분석 결과 (있으면 표시) */}
          {post.description?.includes("🤖 AI 이미지 분석:") && (
            <div style={{
              marginTop: 8, padding: "10px 12px", borderRadius: 8,
              background: "#F0F9FF", border: "1px solid #BAE6FD", fontSize: 12,
              color: "#0369A1", lineHeight: 1.7, whiteSpace: "pre-line",
            }}>
              🤖 <b>AI 이미지 분석</b>
              <div style={{ marginTop: 4, color: "#374151" }}>
                {post.description.split("🤖 AI 이미지 분석:")[1]?.slice(0, 200)}...
              </div>
              <span style={{ color: "#FF6B35", fontWeight: 600, fontSize: 11 }}>자세히 보기 →</span>
            </div>
          )}
        </div>
      </Link>

      {/* AI 분석 결과 미리보기 */}
      {analysis && (
        <Link href={`/feed/${post.id}`} style={{ textDecoration: "none" }}>
          <div style={{
            margin: "0 16px 12px", padding: "10px 12px", borderRadius: 6,
            background: analysis.severity === "normal" ? "#ECFDF5"
              : analysis.severity === "urgent" ? "#FEF2F2"
              : analysis.severity === "moderate" ? "#FFFBEB"
              : "#F0F9FF",
            border: `1px solid ${
              analysis.severity === "normal" ? "#A7F3D0"
              : analysis.severity === "urgent" ? "#FECACA"
              : analysis.severity === "moderate" ? "#FDE68A"
              : "#BAE6FD"
            }`,
          }}>
            <div style={{
              fontSize: 12, fontWeight: 700, marginBottom: 4,
              color: analysis.severity === "normal" ? "#059669"
                : analysis.severity === "urgent" ? "#DC2626"
                : analysis.severity === "moderate" ? "#D97706"
                : "#0369A1",
            }}>
              {analysis.severity === "normal" ? "✅ AI 분석: 정상입니다"
                : analysis.severity === "urgent" ? "🚨 긴급 증상 감지"
                : analysis.severity === "moderate" ? "⚠️ 주의 증상 감지"
                : "💡 관찰 필요 증상 감지"}
            </div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
              {analysis.severity === "normal"
                ? "특별한 이상 증상이 감지되지 않았습니다. 건강한 상태로 보입니다."
                : (analysis.summary?.slice(0, 80) || "") + "..."}
            </div>
            {analysis.severity !== "normal" && (
              <div style={{
                fontSize: 11, marginTop: 4, fontWeight: 600,
                color: analysis.severity === "urgent" ? "#DC2626" : "#D97706",
              }}>
                자세히 보기 →
              </div>
            )}
          </div>
        </Link>
      )}
    </div>
  );
}
