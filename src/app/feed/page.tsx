"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import FeedCard from "../../components/FeedCard";
import { supabase } from "../../lib/supabase";
import { DEMO_FEED } from "../../lib/demoFeed";
import type { FeedPost } from "../../types";

export default function FeedPage() {
  const [posts, setPosts] = useState<FeedPost[]>(DEMO_FEED);

  useEffect(() => {
    supabase
      .from("feed_posts")
      .select("*, author:users(id, nickname, avatar_url, points, role)")
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (data && data.length > 0) {
          setPosts([...data, ...DEMO_FEED]);
        }
      });
  }, []);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "16px", flex: 1, width: "100%" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0, color: "#333" }}>📸 펫 피드</h2>
          <Link href="/feed/upload" style={{
            background: "#FF6B35", color: "#fff", padding: "8px 16px", borderRadius: 20,
            fontSize: 13, fontWeight: 700, textDecoration: "none",
          }}>
            + 사진 올리기
          </Link>
        </div>

        {posts.map((post) => (
          <FeedCard key={post.id} post={post} />
        ))}
      </main>
      <Footer />
    </>
  );
}
