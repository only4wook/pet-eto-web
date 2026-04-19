"use client";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../lib/store";

// 마이페이지용 "단골 동물병원" 카드
// - 없을 때: 등록 폼
// - 있을 때: 정보 + "지금 전화" + "응급 방문" 원클릭

type FavoriteVet = {
  name: string;
  phone: string;
  address?: string;
};

export default function FavoriteVetCard() {
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const favorite: FavoriteVet | null = (user as any)?.favorite_vet ?? null;

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(favorite?.name || "");
  const [phone, setPhone] = useState(favorite?.phone || "");
  const [address, setAddress] = useState(favorite?.address || "");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const save = async () => {
    if (!user) return;
    if (!name.trim() || !phone.trim()) { setMsg("병원명과 전화번호는 필수예요."); return; }
    setSaving(true);
    const newVet: FavoriteVet = { name: name.trim(), phone: phone.trim(), address: address.trim() || undefined };
    const { error } = await supabase.from("users")
      .update({ favorite_vet: newVet })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      // favorite_vet 컬럼이 없는 경우
      if (error.message.includes("favorite_vet") || error.code === "42703") {
        setMsg("DB 마이그레이션이 필요합니다. 관리자에게 문의해주세요.");
      } else {
        setMsg("저장 실패: " + error.message);
      }
      return;
    }
    setUser({ ...user, favorite_vet: newVet } as any);
    setEditing(false);
    setMsg("저장되었습니다!");
    setTimeout(() => setMsg(""), 2500);
  };

  const clear = async () => {
    if (!user) return;
    if (!confirm("단골 병원 정보를 삭제할까요?")) return;
    await supabase.from("users").update({ favorite_vet: null }).eq("id", user.id);
    setUser({ ...user, favorite_vet: null } as any);
    setName(""); setPhone(""); setAddress("");
    setEditing(false);
  };

  // 등록 없음 / 편집 모드 — 폼 노출
  if (!favorite || editing) {
    return (
      <section style={{
        background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12,
        padding: 18, marginBottom: 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🏥</span>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>단골 동물병원 등록</h3>
        </div>
        <p style={{ fontSize: 12, color: "#6B7280", margin: "0 0 14px", lineHeight: 1.6 }}>
          등록하면 <b>응급 시 원클릭 전화</b>가 가능해요. 피드에 증상 올리면 우선 안내됩니다.
        </p>

        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="병원명 (예: 고양시24시동물병원)" style={inputStyle} />
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="전화번호 (예: 031-123-4567)" style={inputStyle} />
        <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="주소 (선택)" style={inputStyle} />

        {msg && (
          <div style={{ fontSize: 12, color: msg.includes("실패") || msg.includes("필수") || msg.includes("마이그레이션") ? "#DC2626" : "#059669", marginBottom: 8 }}>
            {msg}
          </div>
        )}

        <div style={{ display: "flex", gap: 6 }}>
          <button onClick={save} disabled={saving} style={{
            flex: 1, padding: "9px 14px", background: "#FF6B35", color: "#fff",
            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 700,
            cursor: "pointer", fontFamily: "inherit",
          }}>{saving ? "저장 중..." : "저장"}</button>
          {editing && (
            <button onClick={() => setEditing(false)} style={{
              padding: "9px 14px", background: "#fff", color: "#6B7280",
              border: "1px solid #E5E7EB", borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>취소</button>
          )}
        </div>
      </section>
    );
  }

  // 등록됨 — 카드 + 원클릭 버튼
  return (
    <section style={{
      background: "linear-gradient(135deg, #FFF7ED 0%, #FFEBD6 100%)",
      border: "1px solid #FDBA74", borderRadius: 14, padding: 18, marginBottom: 16,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 22 }}>🏥</span>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "#9A3412" }}>내 단골 동물병원</h3>
        </div>
        <button onClick={() => setEditing(true)} style={{
          background: "rgba(255,255,255,0.8)", border: "1px solid rgba(154,52,18,0.2)",
          padding: "4px 10px", fontSize: 11, color: "#9A3412", fontWeight: 700,
          borderRadius: 999, cursor: "pointer", fontFamily: "inherit",
        }}>✏️ 수정</button>
      </div>

      <div style={{ fontSize: 16, fontWeight: 800, color: "#1D1D1F", marginBottom: 4 }}>
        {favorite.name}
      </div>
      {favorite.address && (
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
          📍 {favorite.address}
        </div>
      )}

      <div style={{ display: "flex", gap: 8 }}>
        <a href={`tel:${favorite.phone}`} style={{
          flex: 1, padding: "11px 14px",
          background: "#DC2626", color: "#fff",
          borderRadius: 10, fontSize: 14, fontWeight: 800,
          textAlign: "center", textDecoration: "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          boxShadow: "0 4px 12px rgba(220,38,38,0.25)",
        }}>
          📞 지금 전화 ({favorite.phone})
        </a>
      </div>

      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 8, textAlign: "center" }}>
        응급 상황 시 이 버튼 한 번으로 바로 전화 연결됩니다.
      </div>

      <button onClick={clear} style={{
        marginTop: 8, width: "100%", padding: "6px", background: "none",
        border: "none", color: "#9CA3AF", fontSize: 11, cursor: "pointer", fontFamily: "inherit",
      }}>삭제</button>
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "9px 12px", marginBottom: 8,
  border: "1px solid #E5E7EB", borderRadius: 8,
  fontSize: 13, outline: "none", fontFamily: "inherit",
};
