"use client";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CAT_DATA, DOG_DATA } from "../../lib/wikiData";

export default function WikiPage() {
  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>📖 펫-위키</h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>반려동물에 대한 모든 정보를 한눈에</p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* 고양이 카드 */}
          <Link href="/wiki/cat" style={{ flex: 1, minWidth: 280, textDecoration: "none" }}>
            <div style={{
              background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e0e0e0",
              transition: "box-shadow 0.2s",
            }}>
              <div style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F65)", padding: "28px 24px", color: "#fff" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🐱</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>고양이</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Felis catus</div>
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>
                  {CAT_DATA.description.slice(0, 80)}...
                </p>
                <div style={{ fontSize: 12, color: "#FF6B35", fontWeight: 600, marginTop: 12 }}>
                  {CAT_DATA.breeds.length}개 품종 정보 보기 →
                </div>
              </div>
            </div>
          </Link>

          {/* 강아지 카드 */}
          <Link href="/wiki/dog" style={{ flex: 1, minWidth: 280, textDecoration: "none" }}>
            <div style={{
              background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e0e0e0",
            }}>
              <div style={{ background: "linear-gradient(135deg, #2EC4B6, #5EDDD1)", padding: "28px 24px", color: "#fff" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🐶</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>강아지</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Canis lupus familiaris</div>
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>
                  {DOG_DATA.description.slice(0, 80)}...
                </p>
                <div style={{ fontSize: 12, color: "#2EC4B6", fontWeight: 600, marginTop: 12 }}>
                  {DOG_DATA.breeds.length}개 품종 정보 보기 →
                </div>
              </div>
            </div>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
