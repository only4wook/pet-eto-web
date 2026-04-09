"use client";
import { use } from "react";
import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { CAT_DATA } from "../../../../lib/wikiData";
import { useBreedImages } from "../../../../lib/useBreedImages";

export default function CatBreedPage({ params }: { params: Promise<{ breed: string }> }) {
  const { breed: breedId } = use(params);
  const breed = CAT_DATA.breeds.find((b) => b.id === breedId);
  const { getImage } = useBreedImages();

  if (!breed) {
    return (<><Header /><main style={{ maxWidth: 900, margin: "0 auto", padding: 40, textAlign: "center" }}>
      <p style={{ color: "#888" }}>품종 정보를 찾을 수 없습니다.</p>
      <Link href="/wiki/cat" style={{ color: "#FF6B35" }}>← 고양이 위키로</Link>
    </main><Footer /></>);
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <Link href="/wiki/cat" style={{ fontSize: 12, color: "#888" }}>← 고양이 위키</Link>

        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e0e0e0", marginTop: 12, overflow: "hidden" }}>
          <img src={getImage(breed.id, breed.image)} alt={breed.name} style={{ width: "100%", maxHeight: 350, objectFit: "cover" }} />

          <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>🐱 {breed.name}</h1>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{breed.nameEn}</div>

            {/* 기본 정보 표 */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginTop: 16, marginBottom: 24 }}>
              {[
                { label: "원산지", value: breed.origin },
                { label: "체중", value: breed.weight },
                { label: "수명", value: breed.lifespan },
              ].map((item, i) => (
                <div key={i} style={{ background: "#FFF5F0", borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#888" }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>

            {/* 성격 태그 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              {breed.personality.map((p, i) => (
                <span key={i} style={{ background: "#FF6B35", color: "#fff", padding: "4px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600 }}>{p}</span>
              ))}
            </div>

            {[
              { title: "개요", content: breed.description },
              { title: "특징", content: breed.characteristics },
              { title: "건강", content: breed.health },
              { title: "관리법", content: breed.care },
              { title: "역사", content: breed.history },
            ].map((section, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: "2px solid #FF6B35", paddingBottom: 6, marginBottom: 8 }}>
                  {section.title}
                </h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", margin: 0 }}>{section.content}</p>
              </div>
            ))}

            <div style={{ background: "#f8f8f8", borderRadius: 8, padding: 12, fontSize: 11, color: "#aaa", marginTop: 16 }}>
              ※ 본 정보는 참고용이며, 정확한 진단과 상담은 수의사에게 문의하세요.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
