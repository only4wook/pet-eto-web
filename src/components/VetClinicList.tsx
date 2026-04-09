"use client";
import { useEffect, useState } from "react";
import { getNearbyVetClinics, getUserLocation } from "../lib/vetSearch";
import type { VetClinic } from "../types";

export default function VetClinicList({ is24hOnly }: { is24hOnly?: boolean }) {
  const [clinics, setClinics] = useState<VetClinic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserLocation().then(({ lat, lng }) => {
      setClinics(getNearbyVetClinics(lat, lng, is24hOnly));
      setLoading(false);
    });
  }, [is24hOnly]);

  if (loading) {
    return <div style={{ padding: 20, textAlign: "center", color: "#888", fontSize: 13 }}>위치 확인 중...</div>;
  }

  return (
    <div>
      <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>
        {is24hOnly ? "🚨 24시 응급 동물병원" : "🏥 주변 동물병원"}
      </div>
      {clinics.slice(0, 5).map((clinic, i) => (
        <div key={i} style={{
          padding: "12px 0", borderBottom: "1px solid #f0f0f0",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{clinic.name}</span>
              {clinic.is24h && (
                <span style={{
                  background: "#EF4444", color: "#fff", fontSize: 10,
                  padding: "1px 5px", borderRadius: 3, fontWeight: 700,
                }}>24시</span>
              )}
            </div>
            <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{clinic.address}</div>
            <div style={{ fontSize: 12, color: "#aaa", marginTop: 1 }}>{clinic.distance}km</div>
          </div>
          <a href={`tel:${clinic.phone}`} style={{
            background: "#FF6B35", color: "#fff", padding: "8px 14px",
            borderRadius: 6, fontSize: 12, fontWeight: 700, textDecoration: "none",
            whiteSpace: "nowrap",
          }}>
            📞 전화
          </a>
        </div>
      ))}
    </div>
  );
}
