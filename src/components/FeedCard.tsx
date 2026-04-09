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
        {/* AI 분석 배지 */}
        {analysis && analysis.severity !== "normal" && sevColor && (
          <div style={{
            background: sevColor.bg, color: sevColor.color,
            padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
          }}>
            AI {getSeverityLabel(analysis.severity)}
          </div>
        )}
      </div>

      {/* 이미지 */}
      <Link href={`/feed/${post.id}`}>
        <img
          src={post.image_url}
          alt={post.description}
          style={{ width: "100%", maxHeight: 500, objectFit: "cover", display: "block", cursor: "pointer" }}
        />
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

      {/* 설명 */}
      <div style={{ padding: "8px 16px 12px" }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "#333" }}>
          <b style={{ marginRight: 6 }}>{post.author?.nickname}</b>
          {post.description.length > 100
            ? post.description.slice(0, 100) + "..."
            : post.description}
        </p>
      </div>

      {/* AI 분석 결과 미리보기 (주의/긴급만) */}
      {analysis && (analysis.severity === "moderate" || analysis.severity === "urgent") && sevColor && (
        <Link href={`/feed/${post.id}`} style={{ textDecoration: "none" }}>
          <div style={{
            margin: "0 16px 12px", padding: "10px 12px", borderRadius: 6,
            background: analysis.severity === "urgent" ? "#FEF2F2" : "#FFFBEB",
            border: `1px solid ${analysis.severity === "urgent" ? "#FECACA" : "#FDE68A"}`,
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: sevColor.bg, marginBottom: 4 }}>
              {analysis.severity === "urgent" ? "🚨 긴급 증상 감지" : "⚠️ 주의 증상 감지"}
            </div>
            <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>
              {analysis.summary.slice(0, 80)}...
            </div>
            <div style={{ fontSize: 11, color: sevColor.bg, marginTop: 4, fontWeight: 600 }}>
              자세히 보기 →
            </div>
          </div>
        </Link>
      )}
    </div>
  );
}
