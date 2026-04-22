"use client";
import { use } from "react";
import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { CAT_DATA } from "../../../../lib/wikiData";
import { BREED_EN, ORIGIN_EN, PERSONALITY_EN } from "../../../../lib/wikiDataEn";
import { useBreedImages } from "../../../../lib/useBreedImages";
import { BREED_DISEASE_DATA } from "../../../../lib/wikiDiseaseData";
import { CAT_FIRST_TIME_GUIDE } from "../../../../lib/wikiGuideData";
import { CAT_FIRST_TIME_GUIDE_EN } from "../../../../lib/wikiGuideDataEn";
import { PET_VALUE_PROPS, PET_CTA_TEXT } from "../../../../lib/wikiPetValueProp";
import { useI18n } from "../../../../components/I18nProvider";

const ACCENT = "#FF6B35";
const ACCENT_BG = "#FFF5F0";

function formatCost(n: number, locale: "ko" | "en"): string {
  if (locale === "en") {
    if (n >= 10000) return `₩${(n / 10000).toFixed(0)}0K`;
    return `₩${n.toLocaleString()}`;
  }
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

export default function CatBreedPage({ params }: { params: Promise<{ breed: string }> }) {
  const { breed: breedId } = use(params);
  const breed = CAT_DATA.breeds.find((b) => b.id === breedId);
  const { getImage } = useBreedImages();
  const diseaseInfo = BREED_DISEASE_DATA[breedId];
  const { t, locale } = useI18n();
  const isEn = locale === "en";
  const guide = isEn ? CAT_FIRST_TIME_GUIDE_EN : CAT_FIRST_TIME_GUIDE;
  const breedEn = breed ? BREED_EN[breed.id] : null;

  // EN 모드 가독성 보조값
  const textLineHeight = isEn ? 1.85 : 1.8;
  const paraGap = isEn ? 14 : 0;

  const FREQ_STYLE: Record<string, { bg: string; color: string; label: string }> = {
    "높음": { bg: "#FEE2E2", color: "#DC2626", label: isEn ? "High" : "높음" },
    "보통": { bg: "#FEF3C7", color: "#D97706", label: isEn ? "Medium" : "보통" },
    "낮음": { bg: "#DBEAFE", color: "#2563EB", label: isEn ? "Low" : "낮음" },
  };

  if (!breed) {
    return (<><Header /><main style={{ maxWidth: 900, margin: "0 auto", padding: 40, textAlign: "center" }}>
      <p style={{ color: "#888" }}>{isEn ? "Breed not found." : "품종 정보를 찾을 수 없습니다."}</p>
      <Link href="/wiki/cat" style={{ color: ACCENT }}>{isEn ? "← Cat Wiki" : "← 고양이 위키로"}</Link>
    </main><Footer /></>);
  }

  // 표시용 데이터 (EN 모드는 번역본, KO 모드는 원본)
  const displayName = isEn ? breed.nameEn : breed.name;
  const displaySub = isEn ? breed.name : breed.nameEn;
  const displayDesc = isEn && breedEn ? breedEn.description : breed.description;
  const displayChar = isEn && breedEn ? breedEn.characteristics : breed.characteristics;
  const displayHealth = isEn && breedEn ? breedEn.health : breed.health;
  const displayCare = isEn && breedEn ? breedEn.care : breed.care;
  const displayHistory = isEn && breedEn ? breedEn.history : breed.history;
  const displayOrigin = isEn ? (ORIGIN_EN[breed.origin] || breed.origin) : breed.origin;

  // 섹션 제목
  const L = isEn ? {
    backToWiki: "← Cat Wiki",
    origin: "Origin",
    weight: "Weight",
    lifespan: "Lifespan",
    sectionOverview: "Overview",
    sectionFeatures: "Characteristics",
    sectionHealth: "Health",
    sectionCare: "Care",
    sectionHistory: "History",
    sectionDiseases: "💊 Common Diseases & Estimated Costs",
    diseaseIntro: (name: string) => `Common health issues in ${name} and estimated treatment costs based on Korean vet clinics.`,
    incidencePrefix: "Incidence: ",
    annualCheckup: "Annual checkup cost",
    insuranceRec: "🔴 Insurance Recommended",
    insuranceOpt: "🟢 Insurance Optional",
    checkListTitle: "🐾 First time? — Post-Adoption Checklist",
    checkListIntro: (min: string, max: string) => `Everything you should do, in order. Expected monthly cost: ${min}–${max}`,
    essentialTitle: "🛒 Essential Supplies",
    vaccineTitle: "💉 Vaccination Schedule",
    vaccineCol1: "Age",
    vaccineCol2: "Vaccine",
    vaccineCol3: "Est. Cost",
    priorityRequired: "Required",
    priorityRecommended: "Recommended",
    disclaimer: "※ This information is for reference only. Consult a licensed veterinarian for diagnosis and advice. Treatment costs vary significantly by clinic, region, and severity.",
  } : {
    backToWiki: "← 고양이 위키",
    origin: "원산지",
    weight: "체중",
    lifespan: "수명",
    sectionOverview: "개요",
    sectionFeatures: "특징",
    sectionHealth: "건강",
    sectionCare: "관리법",
    sectionHistory: "역사",
    sectionDiseases: "💊 주요 질병 & 예상 비용",
    diseaseIntro: (name: string) => `${name}에서 자주 발생하는 질병과 한국 동물병원 기준 예상 치료 비용입니다.`,
    incidencePrefix: "발생률 ",
    annualCheckup: "연간 건강검진 비용",
    insuranceRec: "🔴 펫보험 권장",
    insuranceOpt: "🟢 펫보험 선택",
    checkListTitle: "🐾 처음 키우시나요? — 입양 후 체크리스트",
    checkListIntro: (min: string, max: string) => `고양이를 처음 키울 때 꼭 해야 할 일을 순서대로 정리했어요. 예상 월 관리비: ${min}~${max}`,
    essentialTitle: "🛒 필수 용품 체크리스트",
    vaccineTitle: "💉 예방접종 스케줄",
    vaccineCol1: "시기",
    vaccineCol2: "접종 내용",
    vaccineCol3: "예상 비용",
    priorityRequired: "필수",
    priorityRecommended: "권장",
    disclaimer: "※ 본 정보는 참고용이며, 정확한 진단과 상담은 수의사에게 문의하세요. 치료 비용은 병원, 지역, 증상 정도에 따라 크게 달라질 수 있습니다.",
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <Link href="/wiki/cat" style={{ fontSize: 12, color: "#888" }}>{L.backToWiki}</Link>

        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e0e0e0", marginTop: 12, overflow: "hidden" }}>
          <img src={getImage(breed.id, breed.image)} alt={displayName} style={{ width: "100%", maxHeight: 350, objectFit: "cover" }} />

          <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: isEn ? 26 : 24, fontWeight: 800, margin: 0, lineHeight: 1.25 }}>🐱 {displayName}</h1>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{displaySub}</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginTop: 16, marginBottom: 24 }}>
              {[
                { label: L.origin, value: displayOrigin },
                { label: L.weight, value: breed.weight },
                { label: L.lifespan, value: breed.lifespan.replace("년", isEn ? " yrs" : "년") },
              ].map((item, i) => (
                <div key={i} style={{ background: ACCENT_BG, borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#888" }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              {breed.personality.map((p, i) => (
                <span key={i} style={{ background: ACCENT, color: "#fff", padding: "4px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600 }}>
                  {isEn ? (PERSONALITY_EN[p] || p) : p}
                </span>
              ))}
            </div>

            {/* Overview / Characteristics / Health */}
            {[
              { title: L.sectionOverview, content: displayDesc },
              { title: L.sectionFeatures, content: displayChar },
              { title: L.sectionHealth, content: displayHealth },
            ].map((section, i) => (
              <div key={i} style={{ marginBottom: isEn ? 28 : 20 }}>
                <h3 style={{ fontSize: isEn ? 17 : 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 10 }}>{section.title}</h3>
                <p style={{
                  fontSize: isEn ? 15 : 14,
                  lineHeight: textLineHeight,
                  color: "#374151",
                  margin: 0,
                  letterSpacing: isEn ? "-0.003em" : "-0.01em",
                  wordBreak: isEn ? "normal" : "keep-all",
                }}>
                  {section.content}
                </p>
              </div>
            ))}

            {/* Disease info */}
            {diseaseInfo && (
              <div style={{ marginBottom: 28 }}>
                <h3 style={{ fontSize: isEn ? 17 : 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 12 }}>
                  {L.sectionDiseases}
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 12px", lineHeight: 1.6 }}>
                  {L.diseaseIntro(displayName)}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {diseaseInfo.diseases.map((d, i) => (
                    <div key={i} style={{ background: "#FAFAFA", borderRadius: 12, padding: "16px 18px", border: "1px solid #F0F0F0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>{d.name}</span>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                            background: FREQ_STYLE[d.frequency]?.bg, color: FREQ_STYLE[d.frequency]?.color,
                          }}>{L.incidencePrefix}{FREQ_STYLE[d.frequency]?.label || d.frequency}</span>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: ACCENT }}>{formatCost(d.costRange.min, locale)}~{formatCost(d.costRange.max, locale)}</div>
                          {d.costNote && <div style={{ fontSize: 11, color: "#9CA3AF" }}>{d.costNote}</div>}
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 0", lineHeight: 1.7, wordBreak: isEn ? "normal" : "keep-all" }}>{d.description}</p>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: ACCENT_BG, borderRadius: 10, padding: "12px 18px", marginTop: 12, flexWrap: "wrap", gap: 8,
                }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>
                    📋 {L.annualCheckup}: <strong style={{ color: "#1F2937" }}>{diseaseInfo.annualCheckupCost}</strong>
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 16,
                    background: diseaseInfo.insuranceRecommended ? "#FEE2E2" : "#DBEAFE",
                    color: diseaseInfo.insuranceRecommended ? "#DC2626" : "#2563EB",
                  }}>
                    {diseaseInfo.insuranceRecommended ? L.insuranceRec : L.insuranceOpt}
                  </span>
                </div>
              </div>
            )}

            {/* Care */}
            <div style={{ marginBottom: isEn ? 28 : 20 }}>
              <h3 style={{ fontSize: isEn ? 17 : 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 10 }}>{L.sectionCare}</h3>
              <p style={{
                fontSize: isEn ? 15 : 14,
                lineHeight: textLineHeight,
                color: "#374151",
                margin: 0,
                letterSpacing: isEn ? "-0.003em" : "-0.01em",
                wordBreak: isEn ? "normal" : "keep-all",
              }}>
                {displayCare}
              </p>
            </div>

            {/* First-time guide */}
            <div style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: isEn ? 17 : 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 12 }}>
                {L.checkListTitle}
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 18px", lineHeight: 1.7 }}>
                {L.checkListIntro(guide.monthlyMinCost, guide.monthlyMaxCost)}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {guide.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12, background: ACCENT,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, color: "#fff", fontWeight: 800, boxShadow: "0 2px 6px rgba(255,107,53,0.3)",
                      }}>{step.icon}</div>
                      {i < guide.steps.length - 1 && <div style={{ width: 2, flex: 1, background: "#F3F4F6", marginTop: 4 }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>{step.title}</span>
                        {step.estimatedCost && <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>{step.estimatedCost}</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{step.timing}</div>
                      <p style={{ fontSize: 13, color: "#6B7280", margin: "6px 0 0", lineHeight: 1.7, wordBreak: isEn ? "normal" : "keep-all" }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "8px 0 8px" }}>{L.essentialTitle}</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 6 }}>
                {guide.essentialSupplies.map((s, i) => (
                  <div key={i} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    background: "#FAFAFA", borderRadius: 8, padding: "8px 12px", border: "1px solid #F0F0F0", fontSize: 13,
                  }}>
                    <span style={{ color: "#374151" }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, marginRight: 6,
                        background: s.priority === "필수" ? "#FEE2E2" : "#EDE9FE",
                        color: s.priority === "필수" ? "#DC2626" : "#7C3AED",
                      }}>{s.priority === "필수" ? L.priorityRequired : L.priorityRecommended}</span>
                      {s.item}
                    </span>
                    <span style={{ color: "#9CA3AF", fontSize: 12, flexShrink: 0 }}>{s.estimatedCost}</span>
                  </div>
                ))}
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "16px 0 8px" }}>{L.vaccineTitle}</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: ACCENT_BG }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, fontSize: 12, color: "#6B7280" }}>{L.vaccineCol1}</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, fontSize: 12, color: "#6B7280" }}>{L.vaccineCol2}</th>
                      <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, fontSize: 12, color: "#6B7280" }}>{L.vaccineCol3}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {guide.vaccinationSchedule.map((v, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "8px 12px", fontWeight: 600, color: "#374151" }}>{v.age}</td>
                        <td style={{ padding: "8px 12px", color: "#6B7280" }}>{v.vaccine}</td>
                        <td style={{ padding: "8px 12px", textAlign: "right", color: ACCENT, fontWeight: 600 }}>{v.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* History */}
            <div style={{ marginBottom: isEn ? 28 : 20 }}>
              <h3 style={{ fontSize: isEn ? 17 : 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 10 }}>{L.sectionHistory}</h3>
              <p style={{
                fontSize: isEn ? 15 : 14,
                lineHeight: textLineHeight,
                color: "#374151",
                margin: 0,
                letterSpacing: isEn ? "-0.003em" : "-0.01em",
                wordBreak: isEn ? "normal" : "keep-all",
              }}>
                {displayHistory}
              </p>
            </div>

            {/* P.E.T CTA */}
            <div style={{
              background: "linear-gradient(135deg, #FFF7ED, #FEF3C7)",
              borderRadius: 16, padding: "28px 24px", marginTop: 8,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 4px", textAlign: "center" }}>
                {isEn ? "Your Companion with P.E.T" : PET_CTA_TEXT.title}
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px", textAlign: "center" }}>
                {isEn ? "AI health check · Expert vet answers · Verified care partners — all in one" : PET_CTA_TEXT.subtitle}
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
                {PET_VALUE_PROPS.map((vp, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.8)", borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{vp.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>
                      {isEn ? (
                        i === 0 ? "3-Step Verified" :
                        i === 1 ? "AI Health Analysis" :
                        i === 2 ? "Real-time Reports" :
                        i === 3 ? "Up to ₩100M Coverage" : vp.title
                      ) : vp.title}
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: ACCENT, margin: "4px 0" }}>{vp.highlight}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
                      {isEn ? (
                        i === 0 ? "ID · interview · trial care passed" :
                        i === 1 ? "Symptoms analyzed in 30 seconds" :
                        i === 2 ? "Photo/video shared every 20 min" :
                        i === 3 ? "Full medical-bill coverage on incidents" : vp.description
                      ) : vp.description}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center" }}>
                <Link href={PET_CTA_TEXT.buttonLink} style={{
                  display: "inline-block", background: ACCENT, color: "#fff",
                  padding: "12px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none",
                }}>{isEn ? "Request Matching →" : `${PET_CTA_TEXT.buttonText} →`}</Link>
              </div>
            </div>

            <div style={{ background: "#f8f8f8", borderRadius: 8, padding: 12, fontSize: 11, color: "#aaa", marginTop: 20, lineHeight: 1.6 }}>
              {L.disclaimer}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
