"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";

const CATEGORIES = ["질문", "정보", "일상", "긴급", "후기", "문의", "논문", "행사"];

export default function WritePage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [category, setCategory] = useState("질문");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }
    if (!user || user.id === "demo-user") {
      alert("로그인 후 이용 가능합니다.");
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    const tagArr = tags.split(",").map((t) => t.trim().replace("#", "")).filter(Boolean);

    const { error } = await supabase.from("posts").insert({
      author_id: user.id,
      category,
      title: title.trim(),
      content: content.trim(),
      tags: tagArr,
    });

    if (error) {
      alert("게시글 작성에 실패했습니다: " + error.message);
      setLoading(false);
      return;
    }

    // 포인트 (후기 +20P, 일반 +10P)
    const pts = category === "후기" ? 20 : 10;
    await supabase.from("point_logs").insert({ user_id: user.id, amount: pts, reason: category === "후기" ? "후기 작성" : "게시글 작성" });
    await supabase.rpc("add_points", { uid: user.id, pts });

    alert(`게시글이 등록되었습니다! (+${pts}P)${category === "후기" ? "\n⭐ 후기 작성 보너스 포인트!" : ""}`);
    setLoading(false);
    router.push("/");
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 4 }}>
          <div style={{ padding: "12px 20px", borderBottom: "1px solid #e0e0e0", fontSize: 15, fontWeight: 700 }}>
            게시글 작성
          </div>
          <div style={{ padding: 20 }}>
            {/* 카테고리 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>말머리</label>
              <div style={{ display: "flex", gap: 8 }}>
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setCategory(cat)} style={{
                    padding: "6px 16px", border: "1px solid #ddd", borderRadius: 4,
                    background: category === cat ? "#FF6B35" : "#fff",
                    color: category === cat ? "#fff" : "#333", cursor: "pointer", fontSize: 13,
                  }}>{cat}</button>
                ))}
              </div>
            </div>

            {/* 제목 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>제목</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요" maxLength={100}
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, outline: "none" }} />
            </div>

            {/* 내용 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>내용</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요..."
                style={{ width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, minHeight: 300, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6 }} />
            </div>

            {/* 태그 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 6 }}>태그 (쉼표로 구분)</label>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                placeholder="예: 고양이, 건강, 질문"
                style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, outline: "none" }} />
            </div>

            {/* 버튼 */}
            <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
              <button onClick={() => router.back()} style={{
                padding: "10px 28px", border: "1px solid #ddd", borderRadius: 4, background: "#fff", cursor: "pointer", fontSize: 13,
              }}>취소</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                padding: "10px 28px", border: "none", borderRadius: 4,
                background: loading ? "#ccc" : "#FF6B35", color: "#fff", cursor: "pointer", fontSize: 13, fontWeight: 600,
              }}>{loading ? "등록 중..." : "등록하기 (+10P)"}</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
