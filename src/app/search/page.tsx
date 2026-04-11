"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";
import { useAppStore } from "../../lib/store";
import { CAT_DATA, DOG_DATA } from "../../lib/wikiData";
import { formatDate } from "../../lib/utils";
import type { Post, FeedPost } from "../../types";

export default function SearchPage() {
  return <Suspense fallback={<><Header /><main style={{ padding: 40, textAlign: "center" }}>검색 중...</main><Footer /></>}><SearchContent /></Suspense>;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const demoPosts = useAppStore((s) => s.posts);
  const [dbPosts, setDbPosts] = useState<Post[]>([]);
  const [feedPosts, setFeedPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  // 위키에서 검색
  const allBreeds = [...CAT_DATA.breeds, ...DOG_DATA.breeds];
  const wikiResults = q ? allBreeds.filter((b) =>
    b.name.includes(q) || b.nameEn.toLowerCase().includes(q.toLowerCase()) ||
    b.description.includes(q) || b.characteristics.includes(q) ||
    b.health.includes(q) || b.care.includes(q) || b.personality.some((p) => p.includes(q))
  ) : [];

  // 데모 게시글 검색
  const demoResults = q ? demoPosts.filter((p) =>
    p.title.includes(q) || p.content.includes(q) || p.category.includes(q)
  ) : [];

  useEffect(() => {
    if (!q) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      supabase.from("posts")
        .select("*, author:users(id, nickname, points)")
        .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
        .order("created_at", { ascending: false }).limit(20),
      supabase.from("feed_posts")
        .select("*, author:users(id, nickname)")
        .ilike("description", `%${q}%`)
        .order("created_at", { ascending: false }).limit(10),
    ]).then(([{ data: posts }, { data: feeds }]) => {
      if (posts) setDbPosts(posts);
      if (feeds) setFeedPosts(feeds);
      setLoading(false);
    });
  }, [q]);

  const totalResults = wikiResults.length + demoResults.length + dbPosts.length + feedPosts.length;

  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 4px" }}>
          🔍 &quot;{q}&quot; 검색 결과
        </h2>
        <p style={{ fontSize: 13, color: "#9CA3AF", margin: "0 0 20px" }}>
          {loading ? "검색 중..." : `총 ${totalResults}건`}
        </p>

        {/* 위키 결과 */}
        {wikiResults.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#FF6B35", margin: "0 0 10px" }}>📖 위키 ({wikiResults.length}건)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
              {wikiResults.map((b) => {
                const isCat = CAT_DATA.breeds.some((c) => c.id === b.id);
                return (
                  <Link key={b.id} href={`/wiki/${isCat ? "cat" : "dog"}/${b.id}`} style={{ textDecoration: "none" }}>
                    <div style={{
                      background: "#fff", border: "1px solid #F3F4F6", borderRadius: 12,
                      padding: 14, cursor: "pointer",
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1F2937" }}>
                        {isCat ? "🐱" : "🐶"} {b.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF" }}>{b.nameEn} · {b.origin}</div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 6, lineHeight: 1.5 }}>
                        {b.description.slice(0, 80)}...
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* 커뮤니티 결과 (DB + 데모) */}
        {(dbPosts.length + demoResults.length) > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2563EB", margin: "0 0 10px" }}>📝 커뮤니티 ({dbPosts.length + demoResults.length}건)</h3>
            {[...dbPosts, ...demoResults].map((p) => (
              <Link key={p.id} href={`/community/${p.id}`} style={{ textDecoration: "none", display: "block", marginBottom: 8 }}>
                <div style={{
                  background: "#fff", border: "1px solid #F3F4F6", borderRadius: 10,
                  padding: "12px 16px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 6,
                      background: p.category === "긴급" ? "#FEE2E2" : p.category === "후기" ? "#FFF7ED" : "#EFF6FF",
                      color: p.category === "긴급" ? "#DC2626" : p.category === "후기" ? "#C2410C" : "#2563EB",
                    }}>{p.category}</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#1F2937" }}>{p.title}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                    {p.author?.nickname || "익명"} · {formatDate(p.created_at)} · 👁 {p.view_count}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

        {/* 피드 결과 */}
        {feedPosts.length > 0 && (
          <section style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#D97706", margin: "0 0 10px" }}>📸 피드 ({feedPosts.length}건)</h3>
            {feedPosts.map((f) => (
              <Link key={f.id} href={`/feed/${f.id}`} style={{ textDecoration: "none", display: "block", marginBottom: 8 }}>
                <div style={{
                  background: "#fff", border: "1px solid #F3F4F6", borderRadius: 10,
                  padding: "12px 16px",
                }}>
                  <div style={{ fontSize: 13, color: "#374151" }}>
                    {f.description.slice(0, 100)}...
                  </div>
                  <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 4 }}>
                    {f.author?.nickname || "익명"} · {formatDate(f.created_at)}
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}

        {!loading && totalResults === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15 }}>&quot;{q}&quot;에 대한 검색 결과가 없습니다.</p>
            <p style={{ fontSize: 13 }}>다른 키워드로 검색해보세요.</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
