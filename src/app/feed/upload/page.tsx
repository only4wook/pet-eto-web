"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import SymptomAlert from "../../../components/SymptomAlert";
import { supabase } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";
import { analyzeSymptoms } from "../../../lib/symptomAnalyzer";
import type { AnalysisResult } from "../../../types";

const SPECIES = [
  { value: "cat", label: "🐱 고양이" },
  { value: "dog", label: "🐶 강아지" },
  { value: "other", label: "🐾 기타" },
];

function compressImage(file: File, maxWidth = 1200): Promise<Blob> {
  return new Promise((resolve) => {
    // createImageBitmap은 HEIC를 포함한 대부분의 모바일 포맷 지원
    const useCreateImageBitmap = typeof createImageBitmap === "function";

    const drawToCanvas = (source: HTMLImageElement | ImageBitmap) => {
      try {
        const sw = "width" in source ? source.width : (source as any).naturalWidth || 1200;
        const sh = "height" in source ? source.height : (source as any).naturalHeight || 1200;
        const ratio = Math.min(maxWidth / sw, 1);
        const w = Math.round(sw * ratio);
        const h = Math.round(sh * ratio);
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d")!.drawImage(source as any, 0, 0, w, h);
        canvas.toBlob(
          (blob) => resolve(blob && blob.size > 0 ? blob : file),
          "image/jpeg",
          0.75,
        );
      } catch { resolve(file); }
    };

    if (useCreateImageBitmap) {
      // createImageBitmap: HEIC/HEIF 등 모바일 포맷 처리 가능
      createImageBitmap(file)
        .then(drawToCanvas)
        .catch(() => {
          // fallback: Image 엘리먼트 시도
          loadWithImage(file).then(drawToCanvas).catch(() => resolve(file));
        });
    } else {
      loadWithImage(file).then(drawToCanvas).catch(() => resolve(file));
    }

    // 15초 타임아웃
    setTimeout(() => resolve(file), 15000);
  });
}

function loadWithImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = URL.createObjectURL(file);
  });
}

export default function FeedUploadPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const fileRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("cat");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertData, setAlertData] = useState<AnalysisResult | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    // FileReader 방식 (모바일 호환성 향상)
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!imageFile) { alert("사진을 선택해주세요."); return; }
    if (!description.trim()) { alert("설명을 입력해주세요."); return; }
    if (!user || user.id === "demo-user") { alert("로그인 후 이용 가능합니다."); router.push("/auth/login"); return; }

    setLoading(true);

    try {
      // 1. 이미지 압축 (1MB 이상이면 리사이즈, 실패 시 원본 사용)
      // 1. 이미지를 항상 JPEG로 변환 (HEIC/HEIF 등 브라우저 미지원 포맷 해결)
      const compressed = await compressImage(imageFile);
      const isConverted = compressed !== imageFile;
      const fileToUpload = compressed;
      const contentType = isConverted ? "image/jpeg" : (imageFile.type || "image/jpeg");

      // 2. Supabase Storage 업로드 (30초 타임아웃)
      // 항상 .jpg 확장자 (브라우저 호환성)
      const fileName = `feed-${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;

      const uploadPromise = supabase.storage
        .from("feed-images")
        .upload(fileName, fileToUpload, { contentType, upsert: true });

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("업로드 시간 초과 (30초). 네트워크를 확인해주세요.")), 30000)
      );

      const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any;

      if (uploadError) {
        alert("이미지 업로드 실패: " + uploadError.message + "\n\n💡 Supabase Storage 권한을 확인해주세요.");
        setLoading(false);
        return;
      }

      const { data: urlData } = supabase.storage.from("feed-images").getPublicUrl(fileName);

      // 3. AI 증상 분석
      const analysis = analyzeSymptoms(description, species);

      // 4. DB 저장
      const { error: insertError } = await supabase.from("feed_posts").insert({
        author_id: user.id,
        image_url: urlData.publicUrl,
        description: description.trim(),
        pet_name: petName.trim(),
        pet_species: species,
        analysis_result: analysis,
      });

      if (insertError) {
        alert("저장 실패: " + insertError.message);
        setLoading(false);
        return;
      }

      // 5. 포인트 +10P
      await supabase.from("point_logs").insert({ user_id: user.id, amount: 10, reason: "피드 작성" });
      await supabase.rpc("add_points", { uid: user.id, pts: 10 });

      setLoading(false);

      // 6. 증상 심각하면 알림 표시
      if (analysis.severity === "moderate" || analysis.severity === "urgent") {
        setAlertData(analysis);
      } else {
        alert("피드가 등록되었습니다! (+10P)");
        router.push("/feed");
      }
    } catch (err: any) {
      alert("오류: " + (err?.message || "알 수 없는 오류") + "\n\n네트워크 연결을 확인해주세요.");
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 8 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e0e0e0", fontSize: 16, fontWeight: 700 }}>
            📸 사진 올리기
          </div>
          <div style={{ padding: 20 }}>
            {/* 이미지 선택 */}
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic,image/heif,image/*" capture="environment" onChange={handleImageSelect} style={{ display: "none" }} />
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: "2px dashed #ddd", borderRadius: 8, padding: preview ? 0 : 40,
                textAlign: "center", cursor: "pointer", marginBottom: 16, overflow: "hidden",
                background: "#FAFAFA",
              }}
            >
              {preview ? (
                <img src={preview} alt="미리보기" style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }} />
              ) : (
                <>
                  <div style={{ fontSize: 40 }}>📷</div>
                  <div style={{ color: "#888", fontSize: 14, marginTop: 8 }}>클릭하여 사진 선택</div>
                </>
              )}
            </div>

            {/* 반려동물 정보 */}
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>반려동물 이름</label>
                <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)}
                  placeholder="예: 나비" style={{
                    width: "100%", padding: "8px 12px", border: "1px solid #ddd",
                    borderRadius: 4, fontSize: 13, outline: "none",
                  }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>종류</label>
                <select value={species} onChange={(e) => setSpecies(e.target.value)} style={{
                  width: "100%", padding: "8px 12px", border: "1px solid #ddd",
                  borderRadius: 4, fontSize: 13, outline: "none",
                }}>
                  {SPECIES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            {/* 설명 / 증상 */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, fontWeight: 600, display: "block", marginBottom: 4 }}>
                설명 <span style={{ color: "#888", fontWeight: 400 }}>(증상이 있다면 자세히 적어주세요)</span>
              </label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="예: 오늘 산책 다녀왔어요! / 구토를 해서 걱정이에요..."
                style={{
                  width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: 4,
                  fontSize: 13, minHeight: 120, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6,
                }} />
            </div>

            {/* AI 분석 안내 */}
            <div style={{
              background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 6,
              padding: "10px 14px", marginBottom: 16, fontSize: 12, color: "#0369A1",
            }}>
              🤖 AI가 설명 내용을 분석하여 반려동물의 건강 상태를 자동으로 체크합니다.
              증상이 감지되면 주변 동물병원 정보도 함께 안내해드립니다.
            </div>

            {/* 버튼 */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => router.back()} style={{
                flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: 6,
                background: "#fff", cursor: "pointer", fontSize: 14,
              }}>취소</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                flex: 2, padding: "12px", border: "none", borderRadius: 6,
                background: loading ? "#ccc" : "#FF6B35", color: "#fff",
                cursor: "pointer", fontSize: 14, fontWeight: 700,
              }}>
                {loading ? "업로드 중..." : "올리기 (+10P)"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* 긴급/주의 증상 알림 모달 */}
      {alertData && (
        <SymptomAlert analysis={alertData} onClose={() => { setAlertData(null); router.push("/feed"); }} />
      )}
    </>
  );
}
