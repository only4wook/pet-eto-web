"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../lib/store";

// 마이페이지 "단골 동물병원" 카드
// - 등록 폼: 병원명 입력 시 카카오 로컬 API 자동 검색 → 선택하면 이름·전화·주소 자동 채움
// - 카드: 원클릭 전화 버튼

type FavoriteVet = {
  name: string;
  phone: string;
  address?: string;
  lat?: number;
  lng?: number;
};

type SearchResult = {
  id: string;
  name: string;
  phone: string;
  address: string;
  category: string;
  lat: number;
  lng: number;
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

  // 자동 검색 상태
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchHint, setSearchHint] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 병원명 입력 시 debounce 검색
  useEffect(() => {
    if (!editing) return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = name.trim();
    if (q.length < 2) { setResults([]); setShowResults(false); return; }

    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      setSearchHint(null);
      try {
        const res = await fetch(`/api/vet-search?q=${encodeURIComponent(q)}`);
        const data = await res.json();
        setResults(data.results || []);
        if (data.hint) setSearchHint(data.hint);
        setShowResults(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [name, editing]);

  const pickResult = (r: SearchResult) => {
    setName(r.name);
    setPhone(r.phone || "");
    setAddress(r.address || "");
    setShowResults(false);
    setResults([]);
  };

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
          병원명 2글자만 입력하면 <b>카카오 지도 기반으로 자동 검색</b>됩니다.
          응급 상황 시 <b>원클릭 전화</b>로 바로 연결돼요.
        </p>

        {/* 병원명 입력 + 자동완성 */}
        <div style={{ position: "relative", marginBottom: 8 }}>
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); if (!editing) setEditing(true); }}
            placeholder="병원명 (예: 고양시24시동물병원)"
            style={inputStyle}
            autoComplete="off"
          />
          {searching && (
            <div style={{ position: "absolute", right: 12, top: 11, fontSize: 11, color: "#9CA3AF" }}>
              검색중...
            </div>
          )}

          {showResults && results.length > 0 && (
            <ul style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0, right: 0,
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 10,
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              maxHeight: 280,
              overflowY: "auto",
              zIndex: 20,
              margin: 0, padding: 0, listStyle: "none",
            }}>
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    onClick={() => pickResult(r)}
                    style={{
                      width: "100%", textAlign: "left",
                      padding: "10px 12px",
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      borderBottom: "1px solid #F3F4F6",
                      fontFamily: "inherit",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1D1D1F" }}>
                      🏥 {r.name}
                    </div>
                    <div style={{ fontSize: 11, color: "#6B7280", marginTop: 2 }}>
                      📍 {r.address}
                    </div>
                    {r.phone && (
                      <div style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>
                        📞 {r.phone}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showResults && !searching && results.length === 0 && name.trim().length >= 2 && (
            <div style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0, right: 0,
              background: "#FAFAFA",
              border: "1px dashed #D1D5DB",
              borderRadius: 10,
              padding: "10px 12px",
              fontSize: 12, color: "#6B7280",
              zIndex: 20,
            }}>
              검색 결과 없음. 아래 필드에 직접 입력하셔도 돼요.
              {searchHint && <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3 }}>({searchHint})</div>}
            </div>
          )}
        </div>

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
          {editing && favorite && (
            <button onClick={() => { setEditing(false); setMsg(""); }} style={{
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
