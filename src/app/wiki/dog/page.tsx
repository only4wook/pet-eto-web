"use client";
import Link from "next/link";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { DOG_DATA, DOG_OVERVIEW_EN } from "../../../lib/wikiData";
import { ORIGIN_EN, PERSONALITY_EN } from "../../../lib/wikiDataEn";
import { useBreedImages } from "../../../lib/useBreedImages";
import { useI18n } from "../../../components/I18nProvider";

export const dynamic = "force-dynamic";

export default function DogWikiPage() {
  const data = DOG_DATA;
  const { getImage, loaded } = useBreedImages();
  const { t, locale } = useI18n();
  const isEn = locale === "en";
  const overview = isEn ? DOG_OVERVIEW_EN : {
    title: data.title,
    description: data.description,
    history: data.history,
    characteristics: data.characteristics,
    healthTips: data.healthTips,
  };
  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <Link href="/wiki" style={{ fontSize: 12, color: "#888" }}>{t("wiki.backToWiki")}</Link>

        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e0e0e0", marginTop: 12 }}>
          <div style={{ background: "linear-gradient(135deg, #2EC4B6, #5EDDD1)", padding: "28px 24px", color: "#fff", borderRadius: "8px 8px 0 0" }}>
            <div style={{ fontSize: 14, opacity: 0.8 }}>{data.scientificName}</div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: "4px 0 0" }}>🐶 {locale === "en" ? "Dog" : data.title}</h1>
          </div>

          <div style={{ padding: "24px" }}>
            {isEn && (
              <div style={{
                background: "#ECFDF5", border: "1px solid #10B981", borderRadius: 8,
                padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#065F46", lineHeight: 1.7,
              }}>
                🌐 Full English support — category overview and individual breed details are both available.
              </div>
            )}
            {[
              { title: t("wiki.sectionOverview"), content: overview.description },
              { title: t("wiki.sectionHistory"), content: overview.history },
              { title: t("wiki.sectionFeatures"), content: overview.characteristics },
              { title: t("wiki.sectionHealth"), content: overview.healthTips },
            ].map((section, i) => (
              <div key={i} style={{ marginBottom: isEn ? 28 : 24 }}>
                <h3 style={{ fontSize: isEn ? 17 : 16, fontWeight: 700, borderBottom: "2px solid #2EC4B6", paddingBottom: 6, marginBottom: 10 }}>
                  {section.title}
                </h3>
                <p style={{
                  fontSize: isEn ? 15 : 14,
                  lineHeight: isEn ? 1.85 : 1.8,
                  color: "#374151",
                  margin: 0,
                  letterSpacing: isEn ? "-0.003em" : "-0.01em",
                  wordBreak: isEn ? "normal" : "keep-all",
                }}>{section.content}</p>
              </div>
            ))}

            <h3 style={{ fontSize: 16, fontWeight: 700, borderBottom: "2px solid #2EC4B6", paddingBottom: 6, marginBottom: 16 }}>
              {t("wiki.sectionBreedDetail")}
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
              {data.breeds.map((breed) => (
                <Link key={breed.id} href={`/wiki/dog/${breed.id}`} style={{ textDecoration: "none" }}>
                  <div style={{ border: "1px solid #e0e0e0", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                    <img src={getImage(breed.id, breed.image)} alt={breed.name} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                    <div style={{ padding: 12 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "#333", lineHeight: 1.35 }}>
                        {isEn ? breed.nameEn : breed.name}
                      </div>
                      <div style={{ fontSize: 11, color: "#888", marginTop: 2, lineHeight: 1.45 }}>
                        {isEn ? (ORIGIN_EN[breed.origin] || breed.origin) : breed.origin}
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                        {breed.personality.slice(0, 3).map((p, i) => (
                          <span key={i} style={{ background: "#F0FFFE", color: "#2EC4B6", fontSize: 10, padding: "2px 8px", borderRadius: 8, fontWeight: 600 }}>
                            {isEn ? (PERSONALITY_EN[p] || p) : p}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 견종 추가 요청 */}
            <div style={{
              marginTop: 24, background: "#F0FFFE", border: "1px dashed #2EC4B6",
              borderRadius: 8, padding: 20, textAlign: "center",
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🐶</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#333" }}>{t("wiki.breedRequestTitle")}</div>
              <p style={{ fontSize: 13, color: "#888", margin: "6px 0 12px" }}>
                {t("wiki.breedRequestDesc")}
              </p>
              <a href="https://forms.gle/ekF9CxYZkoEbAvgC9" target="_blank" rel="noopener noreferrer" style={{
                display: "inline-block", background: "#2EC4B6", color: "#fff",
                padding: "8px 20px", borderRadius: 6, fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>
                {t("wiki.breedRequestCta")}
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
