"use client";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { CAT_DATA } from "../../../lib/wikiData";

export default function CatWikiPage() {
  const data = CAT_DATA;
  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <Link href="/wiki" style={{ fontSize: 12, color: "#888" }}>← 펫-위키</Link>

        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e0e0e0", marginTop: 12 }}>
          <div style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F65)", padding: "28px 24px", color: "#fff", borderRadius: "8px 8px 0 0" }}>
            <div style={{ fontSize: 14, opacity: 0.8 }}>{data.scientificName}</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "4px 0 0" }}>🐱 {data.title}</h1>
          </div>

          <div style={{ padding: "24px" }}>
            {[
              { title: "개요", content: data.description },
              { title: "역사", content: data.history },
              { title: "특징", content: data.characteristics },
              { title: "건강 관리", content: data.healthTips },
            ].map((section, i) => (
              <div key={i} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, borderBottom: "2px solid #FF6B35", paddingBottom: 6, marginBottom: 10 }}>
                  {section.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", margin: 0 }}>{section.content}</p>
              </div>
            ))}

            {/* 품종 목록 */}
            <h3 style={{ fontSize: 16, fontWeight: 700, borderBottom: "2px solid #FF6B35", paddingBottom: 6, marginBottom: 16 }}>
              품종별 상세 정보
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {data.breeds.map((breed) => (
                <Link key={breed.id} href={`/wiki/cat/${breed.id}`} style={{ textDecoration: "none" }}>
                  <div style={{
                    border: "1px solid #e0e0e0", borderRadius: 8, overflow: "hidden",
                    background: "#fff", transition: "box-shadow 0.2s",
                  }}>
                    <img src={breed.image} alt={breed.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#333" }}>{breed.name}</div>
                      <div style={{ fontSize: 11, color: "#888" }}>{breed.nameEn} · {breed.origin}</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                        {breed.personality.slice(0, 3).map((p, i) => (
                          <span key={i} style={{ background: "#FFF5F0", color: "#FF6B35", fontSize: 10, padding: "2px 6px", borderRadius: 8 }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
