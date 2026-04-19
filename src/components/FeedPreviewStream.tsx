"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { DEMO_FEED } from "../lib/demoFeed";
import { formatDate, safeNickname } from "../lib/utils";
import type { FeedPost } from "../types";

// 홈 페이지용 피드 미리보기 스트림
// 최근 6개 피드를 그리드로 노출 + "더 보기 → /feed" 링크
// AI 분석 배지·전문가 답변 상태 뱃지 표시

export default function FeedPreviewStream() {
  const ref = useRef<HTMLDivElement>(null);
  const [posts, setPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    let cancelled = false;
    supabase.from("feed_posts")
      .select("*, author:users(id, nickname, avatar_url, points, role)")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && data && data.length > 0) {
          setPosts(data as FeedPost[]);
        } else {
          // 데이터 없으면 데모로 채움
          setPosts(DEMO_FEED.slice(0, 6));
        }
      });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [posts.length]);

  return (
    <section
      ref={ref}
      style={{ padding: "clamp(56px, 8vw, 96px) 0", background: "#FAFAFA" }}
      aria-labelledby="feed-stream-headline"
    >
      <div className="container-pet">
        <div
          className="reveal"
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "flex-end",
            gap: 12, marginBottom: "clamp(24px, 3vw, 36px)", flexWrap: "wrap",
          }}
        >
          <div>
            <span className="eyebrow">실시간 피드</span>
            <h2
              id="feed-stream-headline"
              className="text-display-md"
              style={{ margin: "12px 0 6px" }}
            >
              다른 보호자는 <span className="text-accent-grad">무엇을 묻고 있을까요?</span>
            </h2>
            <p style={{ fontSize: 14, color: "#6B7280", lineHeight: 1.6 }}>
              AI 분석 + 전문가 답변이 실시간으로 달리는 공간이에요.
            </p>
          </div>
          <Link href="/feed" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: "#FF6B35", fontSize: 14, fontWeight: 700,
            textDecoration: "none", padding: "8px 14px",
            border: "1.5px solid #FDBA74", borderRadius: 999,
          }}>
            전체 피드 보기
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div
          className="feed-stream-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(14px, 2vw, 20px)",
          }}
        >
          {posts.map((p, idx) => (
            <FeedCardMini key={p.id} post={p} delayClass={`delay-${(idx % 5) + 1}`} />
          ))}
        </div>

        {/* 업로드 유도 CTA */}
        <div className="reveal delay-4" style={{
          marginTop: "clamp(28px, 4vw, 40px)", textAlign: "center",
        }}>
          <Link href="/feed/upload" className="btn-primary-xl">
            내 반려동물 사진·영상 올리기
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </Link>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 10 }}>
            업로드 시 +10P · 첫 글 +100P 보너스
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          .feed-stream-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .feed-stream-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function FeedCardMini({ post, delayClass }: { post: FeedPost; delayClass: string }) {
  const displayNickname = safeNickname(post.author?.nickname, (post.author as any)?.id);
  const sev = post.analysis_result?.severity;
  const sevBadge = sev === "urgent"
    ? { label: "🚨 긴급", bg: "#FEF2F2", color: "#DC2626" }
    : sev === "moderate"
    ? { label: "⚠️ 주의", bg: "#FFFBEB", color: "#D97706" }
    : sev === "mild"
    ? { label: "💡 관찰", bg: "#F0F9FF", color: "#0369A1" }
    : sev === "normal"
    ? { label: "✅ 정상", bg: "#ECFDF5", color: "#059669" }
    : null;

  const expertBadge = post.expert_status === "answered"
    ? { label: "👨‍⚕️ 전문가 답변", bg: "#FFF7ED", color: "#C2410C" }
    : post.request_expert && post.expert_status === "pending"
    ? { label: "⏳ 전문가 답변 대기", bg: "#FAFAFA", color: "#6B7280" }
    : null;

  const isVideo = post.image_url?.endsWith(".mp4");

  return (
    <Link
      href={`/feed/${post.id}`}
      className={`reveal ${delayClass} lift`}
      style={{
        display: "block", textDecoration: "none",
        background: "#fff", border: "1px solid #F3F4F6", borderRadius: 16,
        overflow: "hidden", color: "inherit",
      }}
    >
      <div style={{ position: "relative", paddingTop: "72%", background: "#F9FAFB", overflow: "hidden" }}>
        {isVideo ? (
          <video src={post.image_url} muted playsInline preload="metadata"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <img src={post.image_url} alt={post.pet_name || ""} loading="lazy"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        )}
        {/* 배지 */}
        <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {sevBadge && (
            <span style={{
              padding: "4px 10px", fontSize: 11, fontWeight: 700, borderRadius: 999,
              background: sevBadge.bg, color: sevBadge.color,
              border: `1px solid ${sevBadge.color}33`,
              backdropFilter: "blur(4px)",
            }}>{sevBadge.label}</span>
          )}
          {expertBadge && (
            <span style={{
              padding: "4px 10px", fontSize: 11, fontWeight: 700, borderRadius: 999,
              background: expertBadge.bg, color: expertBadge.color,
              border: `1px solid ${expertBadge.color}33`,
              backdropFilter: "blur(4px)",
            }}>{expertBadge.label}</span>
          )}
        </div>
      </div>
      <div style={{ padding: "14px 16px" }}>
        <div style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 6 }}>
          {displayNickname} · {post.pet_name && `${post.pet_name} · `}{formatDate(post.created_at)}
        </div>
        <div style={{
          fontSize: 14, color: "#1D1D1F", lineHeight: 1.55,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          overflow: "hidden", textOverflow: "ellipsis",
        }}>
          {(post.description?.split("---")[0] || post.description || "").trim()}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 10, fontSize: 12, color: "#6B7280" }}>
          <span>❤️ {post.like_count}</span>
          <span>💬 {post.comment_count}</span>
        </div>
      </div>
    </Link>
  );
}
