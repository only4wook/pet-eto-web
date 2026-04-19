"use client";
import Link from "next/link";
import { useState } from "react";
import type { AnalysisResult, BBox } from "../types";
import { useAppStore } from "../lib/store";

// 피드 상세 페이지 전용 AI 분석 결과 카드
// 구성:
// 1) 신호등 심각도 + severity_score 바
// 2) FGS 통증 지수 (고양이·값 있을 때만)
// 3) 부위 마킹 이미지 오버레이 (bbox 있을 때)
// 4) O2O 원스톱 CTA 3개 (펫택시·단골병원·24시병원)
//    → 경쟁사가 못하는 결정적 차별점

export default function AIResultCard({
  imageUrl,
  analysis,
  compact = false,
}: {
  imageUrl?: string;
  analysis: AnalysisResult;
  compact?: boolean;
}) {
  const user = useAppStore((s) => s.user);
  const favVet: { name?: string; phone?: string } | null = (user as any)?.favorite_vet ?? null;
  const [showBoxes, setShowBoxes] = useState(true);

  const bboxes: BBox[] = analysis.bboxes ?? [];
  const severity = analysis.severity;
  const fgsTotal = analysis.fgs_total;
  const score = analysis.severity_score;

  const sev = getSeverityConfig(severity);

  return (
    <div
      style={{
        background: "#fff",
        border: `2px solid ${sev.border}`,
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: `0 8px 24px ${sev.shadow}`,
      }}
    >
      {/* ── 신호등 헤더 ── */}
      <div style={{
        padding: "14px 18px",
        background: `linear-gradient(135deg, ${sev.bg} 0%, ${sev.bgEnd} 100%)`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        gap: 14,
      }}>
        {/* 신호등 점 */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 4,
          padding: 6, background: "rgba(0,0,0,0.15)", borderRadius: 8,
        }}>
          <Dot active={severity === "urgent"} color="#EF4444" />
          <Dot active={severity === "moderate"} color="#F59E0B" />
          <Dot active={severity === "mild"} color="#0EA5E9" />
          <Dot active={severity === "normal"} color="#10B981" />
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.9, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            AI 건강 분석 결과
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: "-0.02em", marginTop: 2 }}>
            {sev.label}
          </div>
          <div style={{ fontSize: 12, opacity: 0.85, marginTop: 2 }}>{sev.desc}</div>
        </div>

        {typeof score === "number" && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85 }}>심각도</div>
            <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1 }}>
              {score}<span style={{ fontSize: 14, opacity: 0.7 }}>/10</span>
            </div>
          </div>
        )}
      </div>

      {/* ── Severity 바 ── */}
      {typeof score === "number" && (
        <div style={{ padding: "10px 18px 0" }}>
          <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
            <div style={{
              height: "100%", width: `${Math.min(100, score * 10)}%`,
              background: `linear-gradient(90deg, #10B981 0%, #F59E0B 50%, #EF4444 100%)`,
              borderRadius: 999,
              transition: "width 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)",
            }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#9CA3AF", marginTop: 4 }}>
            <span>0 안전</span><span>5 관찰</span><span>10 긴급</span>
          </div>
        </div>
      )}

      {/* ── FGS 통증 지수 (고양이) ── */}
      {typeof fgsTotal === "number" && (
        <div style={{
          margin: "14px 18px 0",
          padding: "12px 14px",
          background: "#FEF3C7",
          border: "1px solid #FCD34D",
          borderRadius: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#78350F", letterSpacing: "0.02em" }}>
                🩻 FGS 고양이 통증 지수
              </div>
              <div style={{ fontSize: 10, color: "#92400E", marginTop: 1 }}>
                Feline Grimace Scale · University of Montreal
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "#78350F", lineHeight: 1 }}>
                {fgsTotal}<span style={{ fontSize: 12, opacity: 0.7 }}>/10</span>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: fgsTotal >= 7 ? "#DC2626" : fgsTotal >= 4 ? "#D97706" : "#059669" }}>
                {fgsTotal >= 7 ? "심한 통증" : fgsTotal >= 4 ? "중등도 통증" : "통증 낮음"}
              </div>
            </div>
          </div>
          {analysis.fgs_breakdown && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 4, fontSize: 10 }}>
              {[
                { k: "ear", label: "귀" },
                { k: "orbital", label: "눈" },
                { k: "muzzle", label: "주둥이" },
                { k: "whiskers", label: "수염" },
                { k: "head", label: "머리" },
              ].map((item) => {
                const v = (analysis.fgs_breakdown as any)?.[item.k];
                return (
                  <div key={item.k} style={{
                    textAlign: "center", padding: "6px 4px",
                    background: "rgba(255,255,255,0.7)", borderRadius: 6,
                  }}>
                    <div style={{ fontSize: 9, color: "#78350F", fontWeight: 600 }}>{item.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "#78350F" }}>
                      {typeof v === "number" ? `${v}/2` : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── 이미지 + bbox 오버레이 ── */}
      {imageUrl && bboxes.length > 0 && (
        <div style={{ margin: "14px 18px 0" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#1D1D1F" }}>
              📍 AI가 표시한 문제 부위 ({bboxes.length}개)
            </div>
            <button onClick={() => setShowBoxes((s) => !s)} style={{
              fontSize: 11, fontWeight: 600, color: "#6B7280",
              background: "transparent", border: "1px solid #E5E7EB",
              padding: "3px 10px", borderRadius: 999, cursor: "pointer",
            }}>
              {showBoxes ? "숨기기" : "보기"}
            </button>
          </div>
          <div style={{ position: "relative", borderRadius: 10, overflow: "hidden" }}>
            <img src={imageUrl} alt="" style={{ width: "100%", display: "block" }} />
            {showBoxes && bboxes.map((b, i) => (
              <div key={i}
                style={{
                  position: "absolute",
                  left: `${b.x * 100}%`,
                  top: `${b.y * 100}%`,
                  width: `${b.w * 100}%`,
                  height: `${b.h * 100}%`,
                  border: "2.5px solid #FF6B35",
                  borderRadius: 6,
                  boxShadow: "0 0 0 2px rgba(255,107,53,0.2)",
                  animation: "fadeIn 0.4s ease",
                }}
              >
                <span style={{
                  position: "absolute", top: -22, left: -2,
                  background: "#FF6B35", color: "#fff",
                  padding: "2px 8px", fontSize: 10, fontWeight: 700,
                  borderRadius: 4, whiteSpace: "nowrap",
                }}>
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── 본문 분석 ── */}
      {!compact && analysis.summary && (
        <div style={{ padding: "14px 18px 4px", fontSize: 13, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
          {analysis.summary}
        </div>
      )}

      {/* ── O2O 원스톱 CTA (핵심 차별점) ── */}
      {(severity === "urgent" || severity === "moderate") && (
        <div style={{ padding: "14px 18px 18px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#1D1D1F", marginBottom: 10 }}>
            👉 지금 바로 행동하세요
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {/* 1. 단골 병원 전화 (있을 때) */}
            {favVet?.phone && (
              <a href={`tel:${favVet.phone}`} style={ctaPrimary}>
                <span style={{ fontSize: 18 }}>📞</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>단골 병원 바로 전화</div>
                  <div style={{ fontSize: 11, opacity: 0.85 }}>{favVet.name} · {favVet.phone}</div>
                </div>
                <span style={{ fontSize: 18 }}>→</span>
              </a>
            )}

            {/* 2. 펫택시 + 대행 진료 */}
            <Link href="/partner/transport" style={ctaSecondary}>
              <span style={{ fontSize: 18 }}>🚕</span>
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontSize: 13, fontWeight: 800 }}>펫택시 + 대행 진료 예약</div>
                <div style={{ fontSize: 11, color: "#6B7280" }}>
                  출근 중이라도 OK · 영상으로 실시간 보고
                </div>
              </div>
              <span style={{ fontSize: 16, color: "#FF6B35" }}>→</span>
            </Link>

            {/* 3. 24시 병원 찾기 (긴급만) */}
            {severity === "urgent" && (
              <Link href="/#ai-chat" style={ctaSecondary}>
                <span style={{ fontSize: 18 }}>🏥</span>
                <div style={{ flex: 1, textAlign: "left" }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>근처 24시 동물병원 찾기</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>
                    AI에게 "○○동 24시 병원" 물어보기
                  </div>
                </div>
                <span style={{ fontSize: 16, color: "#FF6B35" }}>→</span>
              </Link>
            )}

            {/* 단골 병원 없으면 등록 유도 */}
            {!favVet?.phone && (
              <Link href="/mypage" style={ctaDashed}>
                <span style={{ fontSize: 14 }}>🏥</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
                  단골 병원 미등록 — 마이페이지에서 등록하면 응급 시 1초 전화
                </span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 정상 등급이면 가벼운 메시지 */}
      {severity === "normal" && !compact && (
        <div style={{ padding: "14px 18px 18px", fontSize: 12, color: "#059669", fontWeight: 600 }}>
          ✅ 오늘도 건강한 하루 되세요! 정기 검진은 연 1~2회 권장이에요.
        </div>
      )}

      {/* 법적 고지 */}
      <div style={{
        padding: "10px 18px",
        background: "#F9FAFB",
        fontSize: 10, color: "#9CA3AF", lineHeight: 1.6,
        borderTop: "1px solid #F3F4F6",
      }}>
        ⚖️ 이 분석은 수의사법상 '진료 전 참고 가이드'입니다. 정확한 진단·처방은 동물병원에서만 가능합니다.
      </div>
    </div>
  );
}

function Dot({ active, color }: { active: boolean; color: string }) {
  return (
    <div style={{
      width: 10, height: 10, borderRadius: "50%",
      background: active ? color : "rgba(255,255,255,0.25)",
      boxShadow: active ? `0 0 8px ${color}` : "none",
      transition: "all 0.3s",
    }} />
  );
}

function getSeverityConfig(s: "normal" | "mild" | "moderate" | "urgent") {
  switch (s) {
    case "urgent":
      return { label: "🚨 긴급 — 즉시 병원!", desc: "24시간 내 반드시 내원", bg: "#DC2626", bgEnd: "#EF4444", border: "#FCA5A5", shadow: "rgba(220,38,38,0.18)" };
    case "moderate":
      return { label: "⚠️ 주의 — 2~3일 내 병원", desc: "가능한 빨리 수의사 진료", bg: "#D97706", bgEnd: "#F59E0B", border: "#FCD34D", shadow: "rgba(217,119,6,0.18)" };
    case "mild":
      return { label: "💡 관찰 — 며칠 지켜보기", desc: "증상 악화 시 병원", bg: "#0284C7", bgEnd: "#0EA5E9", border: "#BAE6FD", shadow: "rgba(2,132,199,0.15)" };
    case "normal":
      return { label: "✅ 건강 — 이상 없음", desc: "오늘도 건강한 모습이에요", bg: "#059669", bgEnd: "#10B981", border: "#A7F3D0", shadow: "rgba(5,150,105,0.15)" };
  }
}

const ctaPrimary: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12,
  padding: "12px 14px",
  background: "linear-gradient(135deg, #DC2626 0%, #F97316 100%)",
  color: "#fff", borderRadius: 12,
  textDecoration: "none", fontFamily: "inherit",
  boxShadow: "0 4px 14px rgba(220,38,38,0.25)",
};
const ctaSecondary: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 12,
  padding: "12px 14px",
  background: "#fff", color: "#1D1D1F",
  border: "1.5px solid #FDBA74",
  borderRadius: 12,
  textDecoration: "none", fontFamily: "inherit",
};
const ctaDashed: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: 10,
  padding: "10px 14px",
  background: "#FAFAFA",
  border: "1.5px dashed #D1D5DB",
  borderRadius: 12,
  textDecoration: "none", fontFamily: "inherit",
};
