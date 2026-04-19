import Link from "next/link";
import type { Post } from "../types";
import { formatDate, safeNickname } from "../lib/utils";
import GradeBadge from "./GradeBadge";

const CATEGORY_STYLE: Record<string, { bg: string; text: string; border: string }> = {
  질문: { bg: "#EFF6FF", text: "#1D4ED8", border: "#BFDBFE" },
  정보: { bg: "#F0FDF4", text: "#15803D", border: "#BBF7D0" },
  일상: { bg: "#F5F3FF", text: "#7C3AED", border: "#DDD6FE" },
  긴급: { bg: "#FEF2F2", text: "#DC2626", border: "#FECACA" },
  후기: { bg: "#FFF7ED", text: "#C2410C", border: "#FDBA74" },
  문의: { bg: "#F0F9FF", text: "#0369A1", border: "#BAE6FD" },
  논문: { bg: "#FDF4FF", text: "#A21CAF", border: "#E9D5FF" },
  행사: { bg: "#ECFDF5", text: "#047857", border: "#A7F3D0" },
  가이드: { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
};

export default function PostCard({ post, index }: { post: Post; index: number }) {
  const cat = CATEGORY_STYLE[post.category] || CATEGORY_STYLE["일상"];

  return (
    <Link href={`/community/${post.id}`} style={{ textDecoration: "none", display: "block" }}>
      <article style={{
        background: "#fff", borderRadius: 12,
        border: "1px solid #F3F4F6", padding: "14px 16px",
        cursor: "pointer", transition: "all 0.15s",
        marginBottom: 8,
      }}
      className="post-card"
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {/* 카테고리 배지 */}
          <span style={{
            flexShrink: 0, fontSize: 12, fontWeight: 700,
            padding: "3px 10px", borderRadius: 8,
            background: cat.bg, color: cat.text,
            border: `1px solid ${cat.border}`,
          }}>
            {post.category === "긴급" ? "🚨 " : ""}{post.category}
          </span>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* 제목 */}
            <p style={{
              fontWeight: post.category === "긴급" ? 700 : 500,
              color: "#1F2937", fontSize: 14, margin: 0, lineHeight: 1.5,
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {post.title}
              {post.comment_count > 0 && (
                <span style={{ color: "#FF6B35", fontSize: 12, marginLeft: 6, fontWeight: 700 }}>
                  [{post.comment_count}]
                </span>
              )}
              {post.is_expert_answered && (
                <span style={{
                  marginLeft: 8, background: "#ECFDF5", color: "#059669",
                  fontSize: 11, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 10, verticalAlign: "middle",
                }}>
                  전문가답변
                </span>
              )}
            </p>

            {/* 메타 정보 */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              marginTop: 6, fontSize: 12, color: "#9CA3AF",
            }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                {safeNickname(post.author?.nickname, (post.author as any)?.id)}
                <GradeBadge points={post.author?.points ?? 0} role={(post.author as any)?.role} showLabel={false} />
              </span>
              <span>·</span>
              <span>{formatDate(post.created_at)}</span>
              <span>·</span>
              <span>👁 {post.view_count}</span>
              {post.like_count > 0 && (
                <>
                  <span>·</span>
                  <span style={{ color: post.like_count >= 10 ? "#FF6B35" : undefined }}>
                    ❤️ {post.like_count}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
