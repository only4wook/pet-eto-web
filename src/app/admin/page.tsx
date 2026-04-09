"use client";
import { useState, useRef } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";
import { CAT_DATA, DOG_DATA } from "../../lib/wikiData";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState("");
  const [selectedBreed, setSelectedBreed] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const allBreeds = [
    ...CAT_DATA.breeds.map((b) => ({ ...b, species: "cat" as const, speciesLabel: "고양이" })),
    ...DOG_DATA.breeds.map((b) => ({ ...b, species: "dog" as const, speciesLabel: "강아지" })),
  ];

  const handleLogin = () => {
    if (password === "peteto2026") { setAuthed(true); }
    else { alert("비밀번호가 올바르지 않습니다."); }
  };

  const handleUpload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!file) { alert("파일을 선택해주세요."); return; }
    if (!selectedBreed) { alert("품종을 선택해주세요."); return; }

    setUploading(true);
    const fileName = `wiki/${selectedBreed}-${Date.now()}.${file.name.split(".").pop()}`;

    const { error } = await supabase.storage
      .from("feed-images")
      .upload(fileName, file, { contentType: file.type });

    if (error) {
      alert("업로드 실패: " + error.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("feed-images").getPublicUrl(fileName);
    setUploadedUrl(urlData.publicUrl);
    setUploading(false);
  };

  if (!authed) {
    return (
      <>
        <Header />
        <main style={{ maxWidth: 400, margin: "0 auto", padding: "60px 16px", textAlign: "center" }}>
          <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>관리자 페이지</h2>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="관리자 비밀번호" onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              style={{ width: "100%", padding: "10px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 14, marginBottom: 12 }} />
            <button onClick={handleLogin} style={{
              width: "100%", padding: "10px", background: "#FF6B35", color: "#fff",
              border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer",
            }}>로그인</button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ maxWidth: 700, margin: "0 auto", padding: "20px 16px", flex: 1 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>관리자 - 위키 이미지 관리</h2>

        {/* 이미지 업로드 */}
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20, marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>품종 이미지 업로드</h3>

          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>품종 선택</label>
          <select value={selectedBreed} onChange={(e) => setSelectedBreed(e.target.value)}
            style={{ width: "100%", padding: "8px 12px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13, marginBottom: 12 }}>
            <option value="">-- 품종 선택 --</option>
            <optgroup label="고양이">
              {CAT_DATA.breeds.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.nameEn})</option>)}
            </optgroup>
            <optgroup label="강아지">
              {DOG_DATA.breeds.map((b) => <option key={b.id} value={b.id}>{b.name} ({b.nameEn})</option>)}
            </optgroup>
          </select>

          <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>이미지 파일</label>
          <input ref={fileRef} type="file" accept="image/*"
            style={{ width: "100%", padding: "8px", border: "1px solid #ddd", borderRadius: 4, fontSize: 13, marginBottom: 12 }} />

          <button onClick={handleUpload} disabled={uploading} style={{
            width: "100%", padding: "10px", background: uploading ? "#ccc" : "#FF6B35", color: "#fff",
            border: "none", borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>
            {uploading ? "업로드 중..." : "이미지 업로드"}
          </button>

          {uploadedUrl && (
            <div style={{ marginTop: 12, padding: 12, background: "#F0FFF4", borderRadius: 6, border: "1px solid #BBF7D0" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#16A34A", marginBottom: 4 }}>업로드 완료!</div>
              <div style={{ fontSize: 11, color: "#666", wordBreak: "break-all", marginBottom: 8 }}>{uploadedUrl}</div>
              <img src={uploadedUrl} alt="미리보기" style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 4 }} />
              <button onClick={() => { navigator.clipboard.writeText(uploadedUrl); alert("URL이 복사되었습니다!"); }}
                style={{ marginTop: 8, padding: "6px 12px", background: "#333", color: "#fff", border: "none", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>
                URL 복사
              </button>
            </div>
          )}
        </div>

        {/* 현재 품종 이미지 목록 */}
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8, padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>현재 품종 이미지 현황</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8 }}>
            {allBreeds.map((breed) => (
              <div key={breed.id} style={{ border: "1px solid #f0f0f0", borderRadius: 6, overflow: "hidden", fontSize: 11 }}>
                <img src={breed.image} alt={breed.name}
                  style={{ width: "100%", height: 80, objectFit: "cover" }}
                  onError={(e) => { (e.target as HTMLImageElement).style.background = "#f0f0f0"; (e.target as HTMLImageElement).alt = "이미지 없음"; }} />
                <div style={{ padding: "4px 6px" }}>
                  <div style={{ fontWeight: 600 }}>{breed.speciesLabel} · {breed.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
