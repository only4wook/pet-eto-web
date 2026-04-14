"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Post } from "../types";

export default function EmergencyBanner({ posts }: { posts: Post[] }) {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (posts.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % posts.length);
    }, 3000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [posts.length]);

  if (posts.length === 0) return null;

  return (
    <div style={{
      background: "#DC2626", color: "#fff", borderRadius: 10,
      marginBottom: 16, overflow: "hidden",
    }}>
      <div className="container-pet" style={{
        padding: "10px 16px",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        {/* 긴급 레이블 */}
        <span style={{
          flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 4,
          background: "rgba(255,255,255,0.2)", borderRadius: 20,
          padding: "4px 12px", fontSize: 13, fontWeight: 800,
        }}>
          🚨 긴급
        </span>

        {/* 슬라이딩 텍스트 */}
        <Link
          href={`/community/${posts[current].id}`}
          style={{
            flex: 1, minWidth: 0, fontSize: 13, color: "#fff",
            textDecoration: "none", overflow: "hidden", textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {posts[current].title}
          {posts[current].is_expert_answered && (
            <span style={{
              marginLeft: 8, background: "rgba(255,255,255,0.2)", borderRadius: 4,
              padding: "2px 6px", fontSize: 11, fontWeight: 600,
            }}>전문가답변</span>
          )}
        </Link>

        {/* 인디케이터 */}
        {posts.length > 1 && (
          <div style={{ flexShrink: 0, display: "flex", gap: 4 }}>
            {posts.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                style={{
                  width: 6, height: 6, borderRadius: "50%", border: "none",
                  background: i === current ? "#fff" : "rgba(255,255,255,0.4)",
                  cursor: "pointer", padding: 0,
                }}
              />
            ))}
          </div>
        )}

        {/* 긴급 글쓰기 */}
        <Link
          href="/community/write"
          style={{
            flexShrink: 0, background: "#fff", color: "#DC2626",
            fontSize: 12, fontWeight: 800, padding: "5px 14px",
            borderRadius: 20, textDecoration: "none",
          }}
        >
          + 긴급 등록
        </Link>
      </div>
    </div>
  );
}
