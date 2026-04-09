"use client";
import { use } from "react";
import Link from "next/link";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";
import { DOG_DATA } from "../../../../lib/wikiData";
import { useBreedImages } from "../../../../lib/useBreedImages";
import { BREED_DISEASE_DATA } from "../../../../lib/wikiDiseaseData";
import { DOG_FIRST_TIME_GUIDE } from "../../../../lib/wikiGuideData";
import { PET_VALUE_PROPS, PET_CTA_TEXT } from "../../../../lib/wikiPetValueProp";

const ACCENT = "#2EC4B6";
const ACCENT_BG = "#F0FFFE";

function formatCost(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(0)}만원`;
  return `${n.toLocaleString()}원`;
}

const FREQ_STYLE: Record<string, { bg: string; color: string }> = {
  "높음": { bg: "#FEE2E2", color: "#DC2626" },
  "보통": { bg: "#FEF3C7", color: "#D97706" },
  "낮음": { bg: "#DBEAFE", color: "#2563EB" },
};

export default function DogBreedPage({ params }: { params: Promise<{ breed: string }> }) {
  const { breed: breedId } = use(params);
  const breed = DOG_DATA.breeds.find((b) => b.id === breedId);
  const { getImage } = useBreedImages();
  const diseaseInfo = BREED_DISEASE_DATA[breedId];
  const guide = DOG_FIRST_TIME_GUIDE;

  if (!breed) {
    return (<><Header /><main style={{ maxWidth: 900, margin: "0 auto", padding: 40, textAlign: "center" }}>
      <p style={{ color: "#888" }}>품종 정보를 찾을 수 없습니다.</p>
      <Link href="/wiki/dog" style={{ color: ACCENT }}>← 강아지 위키로</Link>
    </main><Footer /></>);
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <Link href="/wiki/dog" style={{ fontSize: 12, color: "#888" }}>← 강아지 위키</Link>

        <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e0e0e0", marginTop: 12, overflow: "hidden" }}>
          <img src={getImage(breed.id, breed.image)} alt={breed.name} style={{ width: "100%", maxHeight: 350, objectFit: "cover" }} />

          <div style={{ padding: 24 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>🐶 {breed.name}</h1>
            <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{breed.nameEn}</div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8, marginTop: 16, marginBottom: 24 }}>
              {[
                { label: "원산지", value: breed.origin },
                { label: "체중", value: breed.weight },
                { label: "수명", value: breed.lifespan },
              ].map((item, i) => (
                <div key={i} style={{ background: ACCENT_BG, borderRadius: 8, padding: "10px 14px" }}>
                  <div style={{ fontSize: 11, color: "#888" }}>{item.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginTop: 2 }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
              {breed.personality.map((p, i) => (
                <span key={i} style={{ background: ACCENT, color: "#fff", padding: "4px 12px", borderRadius: 16, fontSize: 12, fontWeight: 600 }}>{p}</span>
              ))}
            </div>

            {/* 기존 섹션: 개요, 특징, 건강 */}
            {[
              { title: "개요", content: breed.description },
              { title: "특징", content: breed.characteristics },
              { title: "건강", content: breed.health },
            ].map((section, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 8 }}>{section.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", margin: 0 }}>{section.content}</p>
              </div>
            ))}

            {/* 🆕 주요 질병 & 예상 비용 */}
            {diseaseInfo && (
              <div style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 12 }}>
                  💊 주요 질병 & 예상 비용
                </h3>
                <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 12px", lineHeight: 1.6 }}>
                  {breed.name}에서 자주 발생하는 질병과 한국 동물병원 기준 예상 치료 비용입니다.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {diseaseInfo.diseases.map((d, i) => (
                    <div key={i} style={{ background: "#FAFAFA", borderRadius: 12, padding: "16px 18px", border: "1px solid #F0F0F0" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                          <span style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>{d.name}</span>
                          <span style={{
                            fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 10,
                            background: FREQ_STYLE[d.frequency]?.bg, color: FREQ_STYLE[d.frequency]?.color,
                          }}>발생률 {d.frequency}</span>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <div style={{ fontSize: 16, fontWeight: 800, color: ACCENT }}>{formatCost(d.costRange.min)}~{formatCost(d.costRange.max)}</div>
                          {d.costNote && <div style={{ fontSize: 11, color: "#9CA3AF" }}>{d.costNote}</div>}
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#6B7280", margin: "8px 0 0", lineHeight: 1.6 }}>{d.description}</p>
                    </div>
                  ))}
                </div>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  background: ACCENT_BG, borderRadius: 10, padding: "12px 18px", marginTop: 12, flexWrap: "wrap", gap: 8,
                }}>
                  <span style={{ fontSize: 13, color: "#6B7280" }}>
                    📋 연간 건강검진 비용: <strong style={{ color: "#1F2937" }}>{diseaseInfo.annualCheckupCost}</strong>
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 16,
                    background: diseaseInfo.insuranceRecommended ? "#FEE2E2" : "#DBEAFE",
                    color: diseaseInfo.insuranceRecommended ? "#DC2626" : "#2563EB",
                  }}>
                    {diseaseInfo.insuranceRecommended ? "🔴 펫보험 권장" : "🟢 펫보험 선택"}
                  </span>
                </div>
              </div>
            )}

            {/* 기존 섹션: 관리법 */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 8 }}>관리법</h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", margin: 0 }}>{breed.care}</p>
            </div>

            {/* 🆕 처음 키우시나요? */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 12 }}>
                🐾 처음 키우시나요? — 입양 후 체크리스트
              </h3>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 16px", lineHeight: 1.6 }}>
                강아지를 처음 키울 때 꼭 해야 할 일을 순서대로 정리했어요. 예상 월 관리비: <strong style={{ color: ACCENT }}>{guide.monthlyMinCost}~{guide.monthlyMaxCost}</strong>
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {guide.steps.map((step, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, paddingBottom: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12, background: ACCENT,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, color: "#fff", fontWeight: 800, boxShadow: `0 2px 6px rgba(46,196,182,0.3)`,
                      }}>{step.icon}</div>
                      {i < guide.steps.length - 1 && <div style={{ width: 2, flex: 1, background: "#F3F4F6", marginTop: 4 }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: "#1F2937" }}>{step.title}</span>
                        {step.estimatedCost && <span style={{ fontSize: 13, fontWeight: 700, color: ACCENT }}>{step.estimatedCost}</span>}
                      </div>
                      <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>{step.timing}</div>
                      <p style={{ fontSize: 13, color: "#6B7280", margin: "4px 0 0", lineHeight: 1.6 }}>{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "8px 0 8px" }}>🛒 필수 용품 체크리스트</h4>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 6 }}>
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
                      }}>{s.priority}</span>
                      {s.item}
                    </span>
                    <span style={{ color: "#9CA3AF", fontSize: 12, flexShrink: 0 }}>{s.estimatedCost}</span>
                  </div>
                ))}
              </div>
              <h4 style={{ fontSize: 14, fontWeight: 700, color: "#1F2937", margin: "16px 0 8px" }}>💉 예방접종 스케줄</h4>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: ACCENT_BG }}>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, fontSize: 12, color: "#6B7280" }}>시기</th>
                      <th style={{ padding: "8px 12px", textAlign: "left", fontWeight: 700, fontSize: 12, color: "#6B7280" }}>접종 내용</th>
                      <th style={{ padding: "8px 12px", textAlign: "right", fontWeight: 700, fontSize: 12, color: "#6B7280" }}>예상 비용</th>
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

            {/* 기존 섹션: 역사 */}
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, borderBottom: `2px solid ${ACCENT}`, paddingBottom: 6, marginBottom: 8 }}>역사</h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: "#444", margin: 0 }}>{breed.history}</p>
            </div>

            {/* 🆕 P.E.T와 함께라면 */}
            <div style={{
              background: "linear-gradient(135deg, #F0FFFE, #E0F7FA)",
              borderRadius: 16, padding: "28px 24px", marginTop: 8,
            }}>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: "#1F2937", margin: "0 0 4px", textAlign: "center" }}>{PET_CTA_TEXT.title}</h3>
              <p style={{ fontSize: 13, color: "#6B7280", margin: "0 0 20px", textAlign: "center" }}>{PET_CTA_TEXT.subtitle}</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12, marginBottom: 20 }}>
                {PET_VALUE_PROPS.map((vp, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.8)", borderRadius: 12, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 28, marginBottom: 6 }}>{vp.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#1F2937" }}>{vp.title}</div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: ACCENT, margin: "4px 0" }}>{vp.highlight}</div>
                    <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>{vp.description}</div>
                  </div>
                ))}
              </div>
              <div style={{ textAlign: "center" }}>
                <Link href={PET_CTA_TEXT.buttonLink} style={{
                  display: "inline-block", background: ACCENT, color: "#fff",
                  padding: "12px 32px", borderRadius: 12, fontWeight: 700, fontSize: 15, textDecoration: "none",
                }}>{PET_CTA_TEXT.buttonText} →</Link>
              </div>
            </div>

            <div style={{ background: "#f8f8f8", borderRadius: 8, padding: 12, fontSize: 11, color: "#aaa", marginTop: 20 }}>
              ※ 본 정보는 참고용이며, 정확한 진단과 상담은 수의사에게 문의하세요. 치료 비용은 병원, 지역, 증상 정도에 따라 크게 달라질 수 있습니다.
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
