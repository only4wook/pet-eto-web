"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { formatDate, safeNickname } from "../lib/utils";
import { getSeverityColor, getSeverityLabel } from "../lib/symptomAnalyzer";
import type { FeedPost } from "../types";

// 틱톡/릴스 스타일 풀스크린 세로 스와이프 피드
// 한 번에 카드 하나씩 뷰포트 꽉 채움 → 스와이프로 다음 카드
// 레퍼런스: TikTok · Instagram Reels · YouTube Shorts

export default function FeedSwipeView({ posts }: { posts: FeedPost[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // 스크롤 스냅 기반 현재 활성 카드 추적 (영상 자동 재생용)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && e.intersectionRatio > 0.6) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            if (!Number.isNaN(idx)) setActiveIdx(idx);
          }
        });
      },
      { root: el, threshold: [0.6, 0.9] }
    );
    el.querySelectorAll<HTMLElement>(".feed-swipe-card").forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [posts.length]);

  return (
    <div
      ref={containerRef}
      className="feed-swipe-container"
      style={{
        height: "calc(100dvh - 68px - env(safe-area-inset-bottom, 0px))",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
        background: "#000",
        WebkitOverflowScrolling: "touch",
        scrollbarWidth: "none",
      }}
    >
      {posts.map((p, idx) => (
        <SwipeCard key={p.id} post={p} idx={idx} active={idx === activeIdx} />
      ))}

      {/* 마지막 카드 이후 '더보기' */}
      <div
        className="feed-swipe-card"
        data-idx={posts.length}
        style={{
          scrollSnapAlign: "start",
          scrollSnapStop: "always",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #111 0%, #000 100%)",
          color: "#fff",
          padding: 24,
          textAlign: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 42, marginBottom: 12 }}>🎉</div>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: "0 0 10px" }}>
            여기까지 다 봤어요!
          </h3>
          <p style={{ fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, marginBottom: 20 }}>
            내 반려동물 사진·영상을 올리면 전문가 답변을 받을 수 있어요.
          </p>
          <Link href="/feed/upload" className="btn-primary-xl">사진·영상 올리기 →</Link>
        </div>
      </div>

      <style jsx>{`
        .feed-swipe-container::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function SwipeCard({ post, idx, active }: { post: FeedPost; idx: number; active: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const displayNickname = safeNickname(post.author?.nickname, (post.author as any)?.id);
  const mediaUrl = (post.image_url || "").split("?")[0].toLowerCase();
  const isVideo = mediaUrl.endsWith(".mp4") || mediaUrl.endsWith(".webm") || mediaUrl.endsWith(".mov");
  const analysis = post.analysis_result;
  const sev = analysis?.severity;
  const [showDetail, setShowDetail] = useState(false);

  // 현재 활성 카드만 영상 재생
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (active) {
      v.play().catch(() => { /* autoplay blocked — user gesture 대기 */ });
    } else {
      v.pause();
      v.currentTime = 0;
    }
  }, [active]);

  const sevBadge = sev === "urgent"
    ? { label: "🚨 긴급", bg: "#DC2626", color: "#fff" }
    : sev === "moderate"
    ? { label: "⚠️ 주의", bg: "#D97706", color: "#fff" }
    : sev === "mild"
    ? { label: "💡 관찰", bg: "#0369A1", color: "#fff" }
    : sev === "normal"
    ? { label: "✅ 건강", bg: "#059669", color: "#fff" }
    : null;

  const expertBadge = post.expert_status === "answered"
    ? { label: "👨‍⚕️ 전문가 답변 있음", bg: "#FF6B35", color: "#fff" }
    : post.request_expert && post.expert_status === "pending"
    ? { label: "⏳ 전문가 답변 대기중", bg: "rgba(255,255,255,0.2)", color: "#fff" }
    : null;

  const cleanDescription = (post.description?.split("---")[0] || post.description || "").trim();

  return (
    <div
      className="feed-swipe-card"
      data-idx={idx}
      style={{
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        height: "100%",
        position: "relative",
        background: "#000",
      }}
    >
      {/* 미디어 (풀블리드) */}
      <Link href={`/feed/${post.id}`} style={{ display: "block", width: "100%", height: "100%", position: "absolute", inset: 0 }}>
        {isVideo ? (
          <video
            ref={videoRef}
            src={post.image_url}
            muted
            playsInline
            loop
            preload={active ? "auto" : "metadata"}
            style={{ width: "100%", height: "100%", objectFit: "cover", background: "#000" }}
          />
        ) : (
          <img
            src={post.image_url}
            alt={post.pet_name || ""}
            loading={idx < 2 ? "eager" : "lazy"}
            style={{ width: "100%", height: "100%", objectFit: "cover", background: "#000" }}
            onError={(e) => { (e.target as HTMLImageElement).style.background = "#333"; }}
          />
        )}
      </Link>

      {/* 상단 배지 */}
      <div style={{
        position: "absolute",
        top: "calc(12px + env(safe-area-inset-top, 0))",
        left: 12,
        right: 12,
        display: "flex",
        gap: 6,
        flexWrap: "wrap",
        zIndex: 2,
      }}>
        {sevBadge && (
          <span style={{
            padding: "6px 12px", fontSize: 11, fontWeight: 800, borderRadius: 999,
            background: sevBadge.bg, color: sevBadge.color,
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
            {sevBadge.label}
          </span>
        )}
        {expertBadge && (
          <span style={{
            padding: "6px 12px", fontSize: 11, fontWeight: 800, borderRadius: 999,
            background: expertBadge.bg, color: expertBadge.color,
            backdropFilter: "blur(10px)",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}>
            {expertBadge.label}
          </span>
        )}
      </div>

      {/* 우측 액션 버튼 */}
      <div style={{
        position: "absolute",
        right: 14,
        bottom: 140,
        display: "flex",
        flexDirection: "column",
        gap: 18,
        zIndex: 2,
        alignItems: "center",
      }}>
        <ActionBtn icon="❤️" label={String(post.like_count)} ariaLabel="좋아요 수" />
        <ActionBtn icon="💬" label={String(post.comment_count)} href={`/feed/${post.id}`} ariaLabel="댓글 보기" />
        <ActionBtn icon="📤" label="공유" onClick={async () => {
          if (navigator.share) {
            try { await navigator.share({ title: "P.E.T 펫에토 피드", url: `${window.location.origin}/feed/${post.id}` }); } catch {}
          } else {
            try {
              await navigator.clipboard.writeText(`${window.location.origin}/feed/${post.id}`);
              alert("링크가 복사되었어요!");
            } catch {}
          }
        }} ariaLabel="피드 공유하기" />
        {/* 업로드 진입 — 공유 아래 */}
        <ActionBtn icon="＋" label="올리기" href="/feed/upload" ariaLabel="사진·영상 올리기" />
      </div>

      {/* 하단 정보 오버레이 (그라디언트 아래에) */}
      <div style={{
        position: "absolute",
        left: 0, right: 0, bottom: 0,
        padding: "60px 16px 24px",
        background: "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)",
        color: "#fff",
        zIndex: 1,
      }}>
        {/* 작성자 */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%",
            background: "linear-gradient(135deg, #FF6B35, #F59E0B)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 14, fontWeight: 700,
          }}>
            {displayNickname.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
              @{displayNickname}
              {post.pet_name && (
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  background: "rgba(255,255,255,0.15)", padding: "2px 8px", borderRadius: 999,
                }}>
                  {post.pet_species === "cat" ? "🐱" : "🐶"} {post.pet_name}
                </span>
              )}
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{formatDate(post.created_at)}</div>
          </div>
        </div>

        {/* 본문 */}
        <p style={{
          fontSize: 14,
          lineHeight: 1.55,
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: showDetail ? "unset" : 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          whiteSpace: "pre-wrap",
        }}>
          {cleanDescription}
        </p>
        {cleanDescription.length > 90 && !showDetail && (
          <button
            onClick={() => setShowDetail(true)}
            style={{
              background: "none", border: "none", color: "rgba(255,255,255,0.8)",
              fontSize: 12, cursor: "pointer", padding: "4px 0", fontFamily: "inherit",
            }}
          >더보기</button>
        )}

        {/* AI 짧은 요약 */}
        {analysis && analysis.severity !== "normal" && (
          <div style={{
            marginTop: 10,
            padding: "8px 12px",
            borderRadius: 10,
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            fontSize: 12,
            lineHeight: 1.5,
          }}>
            🤖 <b>AI:</b> {(analysis.summary || "").slice(0, 80)}
            {analysis.summary && analysis.summary.length > 80 ? "…" : ""}
          </div>
        )}

        {/* 상세보기 */}
        <Link
          href={`/feed/${post.id}`}
          style={{
            marginTop: 10,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            background: "rgba(255,255,255,0.95)",
            color: "#000",
            padding: "8px 16px",
            borderRadius: 999,
            fontSize: 13,
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          자세히 보기 →
        </Link>
      </div>

      {/* 스와이프 힌트 (첫 카드에만) */}
      {idx === 0 && (
        <div style={{
          position: "absolute",
          right: 14, top: "50%",
          color: "rgba(255,255,255,0.7)",
          fontSize: 11, fontWeight: 600,
          padding: "6px 10px",
          background: "rgba(0,0,0,0.4)",
          borderRadius: 999,
          zIndex: 2,
          animation: "bob 2s ease-in-out infinite",
        }}>
          ↑ 위로 스와이프
        </div>
      )}
    </div>
  );
}

function ActionBtn({ icon, label, href, onClick, ariaLabel }: { icon: string; label: string; href?: string; onClick?: () => void; ariaLabel?: string }) {
  const content = (
    <>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: "rgba(255,255,255,0.15)",
        backdropFilter: "blur(10px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22,
      }}>
        {icon}
      </div>
      <span style={{ fontSize: 11, color: "#fff", fontWeight: 700, textShadow: "0 1px 2px rgba(0,0,0,0.5)" }}>{label}</span>
    </>
  );
  if (href) {
    return (
      <Link href={href} aria-label={ariaLabel || label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none" }}>
        {content}
      </Link>
    );
  }
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel || label}
      style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
        background: "none", border: "none", cursor: "pointer", padding: 0,
        fontFamily: "inherit",
      }}
    >
      {content}
    </button>
  );
}
