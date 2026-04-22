"use client";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { CAT_DATA, DOG_DATA } from "../../lib/wikiData";
import { useI18n } from "../../components/I18nProvider";

// EN 모드 전용 간단 요약 (전체 wiki 본문은 별도 번역 작업 필요)
const EN_OVERVIEW = {
  cat: "Cats are domesticated carnivorous mammals. They have lived alongside humans for about 10,000 years and make warm, independent family companions.",
  dog: "Dogs are the first domesticated animal by humans, descended from wolves about 15,000 years ago. They are loyal, social, and deeply bonded with their owners.",
};

export default function WikiPage() {
  const { t, locale } = useI18n();
  const catDesc = locale === "en" ? EN_OVERVIEW.cat : CAT_DATA.description.slice(0, 80) + "...";
  const dogDesc = locale === "en" ? EN_OVERVIEW.dog : DOG_DATA.description.slice(0, 80) + "...";
  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{t("wiki.title")}</h2>
        <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>{t("wiki.subtitle")}</p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          {/* 고양이 카드 */}
          <Link href="/wiki/cat" style={{ flex: 1, minWidth: 280, textDecoration: "none" }}>
            <div style={{
              background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e0e0e0",
              transition: "box-shadow 0.2s",
            }}>
              <div style={{ background: "linear-gradient(135deg, #FF6B35, #FF8F65)", padding: "28px 24px", color: "#fff" }}>
                <div style={{ fontSize: 48, marginBottom: 8 }}>🐱</div>
                <div style={{ fontSize: 22, fontWeight: 800 }}>{t("wiki.cat")}</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Felis catus</div>
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>
                  {catDesc}
                </p>
                <div style={{ fontSize: 12, color: "#FF6B35", fontWeight: 600, marginTop: 12 }}>
                  {CAT_DATA.breeds.length} {t("wiki.breedsCount")} →
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
                <div style={{ fontSize: 22, fontWeight: 800 }}>{t("wiki.dog")}</div>
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 4 }}>Canis lupus familiaris</div>
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ fontSize: 13, color: "#666", lineHeight: 1.6, margin: 0 }}>
                  {dogDesc}
                </p>
                <div style={{ fontSize: 12, color: "#2EC4B6", fontWeight: 600, marginTop: 12 }}>
                  {DOG_DATA.breeds.length} {t("wiki.breedsCount")} →
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
