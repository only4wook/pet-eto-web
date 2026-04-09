"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";

const SPECIES = [
  { value: "cat", label: "고양이" },
  { value: "dog", label: "강아지" },
  { value: "bird", label: "새" },
  { value: "fish", label: "물고기" },
  { value: "reptile", label: "파충류" },
  { value: "other", label: "기타" },
];

export default function PetRegisterPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("cat");
  const [breed, setBreed] = useState("");
  const [gender, setGender] = useState("unknown");
  const [birthDate, setBirthDate] = useState("");
  const [weight, setWeight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) { alert("반려동물 이름을 입력해주세요."); return; }
    if (!breed.trim()) { alert("품종을 입력해주세요."); return; }
    if (!user || user.id === "demo-user") { alert("로그인 후 이용 가능합니다."); router.push("/auth/login"); return; }

    setLoading(true);
    const { error } = await supabase.from("pets").insert({
      owner_id: user.id,
      name: name.trim(),
      species,
      breed: breed.trim(),
      gender,
      birth_date: birthDate || null,
      weight: weight ? parseFloat(weight) : null,
    });

    if (error) { alert("등록 실패: " + error.message); setLoading(false); return; }

    alert(`${name}이(가) 등록되었습니다!`);
    setLoading(false);
    router.push("/mypage");
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e0e0e0", fontSize: 16, fontWeight: 700 }}>
            반려동물 등록
          </div>
          <div style={{ padding: 20 }}>
            <label style={labelStyle}>이름 <span style={{ color: "red" }}>*</span></label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="반려동물 이름" style={inputStyle} maxLength={20} />

            <label style={labelStyle}>종류 <span style={{ color: "red" }}>*</span></label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
              {SPECIES.map((s) => (
                <button key={s.value} onClick={() => setSpecies(s.value)} style={{
                  padding: "6px 14px", border: "1px solid #ddd", borderRadius: 4,
                  background: species === s.value ? "#FF6B35" : "#fff",
                  color: species === s.value ? "#fff" : "#333",
                  cursor: "pointer", fontSize: 13,
                }}>{s.label}</button>
              ))}
            </div>

            <label style={labelStyle}>품종 <span style={{ color: "red" }}>*</span></label>
            <input type="text" value={breed} onChange={(e) => setBreed(e.target.value)} placeholder="예: 코리안숏헤어, 말티즈" style={inputStyle} />

            <label style={labelStyle}>성별</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[{ v: "male", l: "수컷" }, { v: "female", l: "암컷" }, { v: "unknown", l: "모름" }].map((g) => (
                <button key={g.v} onClick={() => setGender(g.v)} style={{
                  padding: "6px 16px", border: "1px solid #ddd", borderRadius: 4,
                  background: gender === g.v ? "#FF6B35" : "#fff",
                  color: gender === g.v ? "#fff" : "#333",
                  cursor: "pointer", fontSize: 13,
                }}>{g.l}</button>
              ))}
            </div>

            <label style={labelStyle}>생년월일 (선택)</label>
            <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} style={inputStyle} />

            <label style={labelStyle}>몸무게 (선택)</label>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="예: 4.5" style={{ ...inputStyle, marginBottom: 0, flex: 1 }} step="0.1" />
              <span style={{ color: "#888", fontSize: 14 }}>kg</span>
            </div>

            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => router.back()} style={{
                flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: 6,
                background: "#fff", cursor: "pointer", fontSize: 14,
              }}>취소</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                flex: 2, padding: "12px", border: "none", borderRadius: 6,
                background: loading ? "#ccc" : "#FF6B35", color: "#fff",
                cursor: "pointer", fontSize: 14, fontWeight: 700,
              }}>{loading ? "등록 중..." : "등록하기"}</button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, marginBottom: 4, marginTop: 12 };
const inputStyle: React.CSSProperties = { width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, outline: "none", marginBottom: 16 };
