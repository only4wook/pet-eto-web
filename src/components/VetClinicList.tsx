"use client";
import { useEffect, useState } from "react";
import { getNearbyVetClinics, getUserLocation } from "../lib/vetSearch";
import type { VetClinic } from "../types";
import { useI18n } from "./I18nProvider";

/**
 * 주변 동물병원 리스트.
 *   - is24hOnly:    24시간 응급 병원만 필터 (현재 영업 중 보장)
 *   - emergencyMode: 긴급 진단(severity=urgent) 시 빨강 헤더 + 큰 전화 CTA + 거리순 강조
 */
export default function VetClinicList({
  is24hOnly,
  emergencyMode,
}: {
  is24hOnly?: boolean;
  emergencyMode?: boolean;
}) {
  const [clinics, setClinics] = useState<VetClinic[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useI18n();

  useEffect(() => {
    getUserLocation().then(({ lat, lng }) => {
      setClinics(getNearbyVetClinics(lat, lng, is24hOnly));
      setLoading(false);
    });
  }, [is24hOnly]);

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center", color: "#888", fontSize: 13 }}>
        위치 확인 중...
      </div>
    );
  }

  // 결과 없을 때 (24시간 필터링 결과 0개 가능)
  if (clinics.length === 0) {
    return (
      <div
        style={{
          padding: 20,
          background: "#FEF3C7",
          border: "1px solid #FCD34D",
          borderRadius: 8,
          fontSize: 13,
          color: "#92400E",
          textAlign: "center",
        }}
      >
        주변에 등록된 24시간 응급 동물병원이 없습니다.
        <br />
        <a
          href="tel:1899-7375"
          style={{ color: "#92400E", fontWeight: 700, textDecoration: "underline" }}
        >
          📞 한국동물병원협회 24시 응급 안내 1899-7375
        </a>
      </div>
    );
  }

  const headerText = emergencyMode
    ? (t("feed.findEmergencyVets") || "🚨 24시간 응급 동물병원 (지금 영업 중)")
    : is24hOnly
    ? "🚨 24시 응급 동물병원"
    : "🏥 주변 동물병원";

  return (
    <div>
      {/* 헤더 — 긴급 모드는 빨강 배경 강조 */}
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          marginBottom: 12,
          padding: emergencyMode ? "8px 12px" : 0,
          background: emergencyMode ? "#FEE2E2" : "transparent",
          color: emergencyMode ? "#991B1B" : "#111827",
          borderRadius: emergencyMode ? 6 : 0,
          border: emergencyMode ? "1px solid #FCA5A5" : "none",
        }}
      >
        {headerText}
      </div>

      {clinics.slice(0, 5).map((clinic, i) => (
        <div
          key={i}
          style={{
            padding: "12px 0",
            borderBottom: "1px solid #F3F4F6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>{clinic.name}</span>
              {clinic.is24h && (
                <>
                  <span
                    style={{
                      background: "#DC2626",
                      color: "#fff",
                      fontSize: 10,
                      padding: "2px 6px",
                      borderRadius: 3,
                      fontWeight: 800,
                      letterSpacing: "0.02em",
                    }}
                  >
                    24시
                  </span>
                  {/* 영업중 점등 — 24h 는 항상 영업중 */}
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11,
                      color: "#059669",
                      fontWeight: 700,
                    }}
                  >
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#10B981",
                        boxShadow: "0 0 4px rgba(16, 185, 129, 0.6)",
                      }}
                    />
                    영업 중
                  </span>
                </>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3 }}>{clinic.address}</div>
            <div style={{ fontSize: 12, color: "#9CA3AF", marginTop: 1, fontWeight: 600 }}>
              📍 {clinic.distance}km
            </div>
          </div>

          {/* 전화 CTA — 긴급 모드는 더 크고 빨갛게 */}
          <a
            href={`tel:${clinic.phone}`}
            style={{
              background: emergencyMode ? "#DC2626" : "#FF6B35",
              color: "#fff",
              padding: emergencyMode ? "12px 18px" : "8px 14px",
              borderRadius: 8,
              fontSize: emergencyMode ? 13 : 12,
              fontWeight: 800,
              textDecoration: "none",
              whiteSpace: "nowrap",
              boxShadow: emergencyMode
                ? "0 2px 8px rgba(220, 38, 38, 0.4)"
                : "0 1px 2px rgba(0,0,0,0.05)",
              flexShrink: 0,
            }}
          >
            {emergencyMode ? (t("feed.callEmergency") || "📞 긴급 전화") : "📞 전화"}
          </a>
        </div>
      ))}
    </div>
  );
}
