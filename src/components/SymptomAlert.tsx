"use client";
import { useState } from "react";
import type { AnalysisResult } from "../types";
import { getSeverityColor, getSeverityLabel } from "../lib/symptomAnalyzer";
import VetClinicList from "./VetClinicList";

interface Props {
  analysis: AnalysisResult;
  onClose: () => void;
}

export default function SymptomAlert({ analysis, onClose }: Props) {
  const [showVets, setShowVets] = useState(false);
  const sev = getSeverityColor(analysis.severity);

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 9999, padding: 16,
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 12, maxWidth: 440, width: "100%",
        maxHeight: "90vh", overflow: "auto",
      }}>
        {/* 헤더 */}
        <div style={{
          background: sev.bg, color: sev.color, padding: "20px 24px",
          borderRadius: "12px 12px 0 0", textAlign: "center",
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>
            {analysis.severity === "urgent" ? "🚨" : analysis.severity === "moderate" ? "⚠️" : "ℹ️"}
          </div>
          <div style={{ fontSize: 20, fontWeight: 800 }}>
            {analysis.severity === "urgent" ? "긴급 증상 감지!" : "주의 증상 감지"}
          </div>
        </div>

        <div style={{ padding: "20px 24px" }}>
          {/* 감지된 증상 */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>감지된 증상</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {analysis.symptoms.map((s, i) => (
                <span key={i} style={{
                  background: sev.bg + "20", color: sev.bg, border: `1px solid ${sev.bg}40`,
                  padding: "3px 10px", borderRadius: 12, fontSize: 12, fontWeight: 600,
                }}>
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* 요약 */}
          <div style={{
            background: "#F8F8F8", borderRadius: 8, padding: 14, marginBottom: 16,
            fontSize: 13, lineHeight: 1.7, color: "#444",
          }}>
            {analysis.summary}
          </div>

          {/* 권장 사항 */}
          <div style={{
            background: analysis.severity === "urgent" ? "#FEF2F2" : "#FFFBEB",
            borderRadius: 8, padding: 14, marginBottom: 16,
            fontSize: 13, lineHeight: 1.7, color: "#333",
            borderLeft: `4px solid ${sev.bg}`,
          }}>
            <b>권장 사항:</b> {analysis.recommendation}
          </div>

          {/* 면책 조항 */}
          <div style={{ fontSize: 11, color: "#aaa", marginBottom: 16, lineHeight: 1.5 }}>
            ※ AI 자동 분석 결과이며, 의학적 진단이 아닙니다. 정확한 진단을 위해 수의사와 상담하세요.
          </div>

          {/* 버튼 */}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: 8,
              background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 600,
            }}>
              닫기
            </button>
            <button onClick={() => setShowVets(true)} style={{
              flex: 2, padding: "12px", border: "none", borderRadius: 8,
              background: sev.bg, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700,
            }}>
              🏥 주변 동물병원 찾기
            </button>
          </div>

          {/* 동물병원 리스트 */}
          {showVets && (
            <div style={{ marginTop: 16 }}>
              <VetClinicList is24hOnly={analysis.severity === "urgent"} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
