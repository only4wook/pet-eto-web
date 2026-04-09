"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FeedCard from "../../components/FeedCard";
import { supabase } from "../../lib/supabase";
import type { FeedPost } from "../../types";

const DEMO_FEED: FeedPost[] = [
  {
    id: "demo-f1", author_id: "u1", image_url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&h=600&fit=crop",
    description: "우리 나비 오늘 컨디션이 안 좋은 것 같아요 ㅠㅠ 밥을 안 먹고 구석에 숨어있어요. 구토도 한번 했는데 걱정됩니다...",
    pet_name: "나비", pet_species: "cat",
    analysis_result: { severity: "moderate", symptoms: ["구토", "식욕 부진", "은둔 행동"], summary: "주의가 필요한 증상이 감지되었습니다. 고양이에게서 구토, 식욕 부진, 은둔 행동 증상이 관찰됩니다.", recommendation: "빠른 시일 내 동물병원 내원을 권장합니다." },
    like_count: 24, comment_count: 18, created_at: "2026-04-09T10:00:00Z",
    author: { id: "u1", email: "", nickname: "나비맘", avatar_url: null, points: 350, created_at: "" },
  },
  {
    id: "demo-f2", author_id: "u2", image_url: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&h=600&fit=crop",
    description: "산책 다녀왔어요! 날씨 좋아서 뽀삐가 신났네요 ㅋㅋ 오늘도 건강하게 뛰어놀았습니다 🐕",
    pet_name: "뽀삐", pet_species: "dog",
    analysis_result: { severity: "normal", symptoms: [], summary: "강아지의 특별한 건강 이상 징후는 감지되지 않았습니다.", recommendation: "건강한 상태로 보입니다!" },
    like_count: 89, comment_count: 12, created_at: "2026-04-09T09:00:00Z",
    author: { id: "u2", email: "", nickname: "뽀삐아빠", avatar_url: null, points: 1200, created_at: "" },
  },
  {
    id: "demo-f3", author_id: "u3", image_url: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&h=600&fit=crop",
    description: "고양이가 갑자기 경련을 일으키고 피를 토했어요!! 지금 새벽인데 어떻게 해야 하나요?? 숨도 가쁜 것 같아요",
    pet_name: "모찌", pet_species: "cat",
    analysis_result: { severity: "urgent", symptoms: ["경련/발작", "혈액 구토", "호흡 이상"], summary: "긴급 증상이 감지되었습니다! 고양이에게서 경련/발작, 혈액 구토, 호흡 이상 증상이 의심됩니다.", recommendation: "즉시 가까운 동물병원에 방문하시길 강력히 권장합니다." },
    like_count: 5, comment_count: 42, created_at: "2026-04-09T02:00:00Z",
    author: { id: "u3", email: "", nickname: "걱정집사", avatar_url: null, points: 80, created_at: "" },
  },
  {
    id: "demo-f4", author_id: "u4", image_url: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=600&fit=crop",
    description: "오늘 미용 다녀왔어요! 여름맞이 썸머컷 완료 ✂️ 너무 귀엽지 않나요??",
    pet_name: "콩이", pet_species: "dog",
    analysis_result: null,
    like_count: 156, comment_count: 23, created_at: "2026-04-08T15:00:00Z",
    author: { id: "u4", email: "", nickname: "콩이엄마", avatar_url: null, points: 2100, created_at: "" },
  },
];

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>([]);

  useEffect(() => {
    supabase
      .from("feed_posts")
      .select("*, author:users(id, nickname, avatar_url, points, role)")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) setPosts(data);
        else setPosts(DEMO_FEED);
      });
  }, []);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "16px", flex: 1, width: "100%" }}>
        {/* 상단 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#333" }}>📸 펫 피드</h2>
          <Link href="/feed/upload" style={{
            background: "#FF6B35", color: "#fff", padding: "8px 16px", borderRadius: 20,
            fontSize: 13, fontWeight: 700, textDecoration: "none",
          }}>
            + 사진 올리기
          </Link>
        </div>

        {/* 피드 카드 목록 */}
        {posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}

        {posts.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
            <div style={{ fontSize: 48 }}>📷</div>
            <p>아직 피드가 없습니다. 첫 번째 사진을 올려보세요!</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
