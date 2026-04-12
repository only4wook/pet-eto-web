"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import SymptomAlert from "../../../components/SymptomAlert";
import { supabase, storageClient } from "../../../lib/supabase";
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
          "image/jpeg", 0.75,
        );
      } catch { resolve(file); }
    };
    if (useCreateImageBitmap) {
      createImageBitmap(file).then(drawToCanvas).catch(() => {
        loadWithImage(file).then(drawToCanvas).catch(() => resolve(file));
      });
    } else {
      loadWithImage(file).then(drawToCanvas).catch(() => resolve(file));
    }
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

// 동영상 첫 프레임 추출 → 썸네일 생성
function extractVideoThumbnail(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.onloadeddata = () => {
      video.currentTime = 0.5; // 0.5초 지점
    };
    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = Math.min(video.videoWidth, 1200);
        canvas.height = Math.round(canvas.width * (video.videoHeight / video.videoWidth));
        canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => { blob ? resolve(blob) : reject(); },
          "image/jpeg", 0.8,
        );
      } catch { reject(); }
    };
    video.onerror = () => reject();
    video.src = URL.createObjectURL(file);
    setTimeout(() => reject(), 10000);
  });
}

type MediaType = "image" | "video";

export default function FeedUploadPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const albumRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [preview, setPreview] = useState<string | null>(null);
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("cat");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [alertData, setAlertData] = useState<AnalysisResult | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    setMediaFile(file);
    setMediaType(isVideo ? "video" : "image");
    if (isVideo) {
      setPreview(URL.createObjectURL(file));
    } else {
      // HEIC 감지 시 안내
      const isHeic = file.type === "image/heic" || file.type === "image/heif" || file.name.toLowerCase().endsWith(".heic");
      if (isHeic) {
        alert("HEIC 형식 사진이 감지되었어요.\n갤러리에서 JPEG/PNG로 변환 후 올려주시거나,\n카메라로 직접 촬영해주세요.\n\n📱 설정 → 카메라 → 포맷 → '호환성 우선'으로 변경하면 JPEG로 촬영됩니다.");
      }
      // canvas로 변환 시도
      try {
        const blob = await compressImage(file);
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target?.result as string);
        reader.readAsDataURL(blob);
      } catch {
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSubmit = async () => {
    if (!mediaFile) { alert("사진 또는 동영상을 선택해주세요."); return; }
    if (!description.trim()) { alert("설명을 입력해주세요."); return; }
    if (!user || user.id === "demo-user") { alert("로그인 후 이용 가능합니다."); router.push("/auth/login"); return; }

    setLoading(true);

    try {
      const ts = Date.now();
      const rand = Math.random().toString(36).slice(2, 8);
      let imageUrl = "";

      if (mediaType === "video") {
        // 동영상: 원본 업로드 + 썸네일 추출
        setLoadingMsg("동영상 업로드 중...");
        const videoName = `feed-${ts}-${rand}.mp4`;
        const { error: vErr } = await storageClient.storage
          .from("feed-images").upload(videoName, mediaFile, { contentType: mediaFile.type, upsert: true });
        if (vErr) { alert("동영상 업로드 실패: " + vErr.message); setLoading(false); return; }

        // 썸네일 추출 & 업로드
        setLoadingMsg("썸네일 생성 중...");
        try {
          const thumb = await extractVideoThumbnail(mediaFile);
          const thumbName = `thumb-${ts}-${rand}.jpg`;
          await storageClient.storage.from("feed-images").upload(thumbName, thumb, { contentType: "image/jpeg", upsert: true });
          const { data: thumbUrl } = storageClient.storage.from("feed-images").getPublicUrl(thumbName);
          imageUrl = thumbUrl.publicUrl;
        } catch {
          // 썸네일 실패 시 비디오 URL 사용
          const { data: vUrl } = storageClient.storage.from("feed-images").getPublicUrl(videoName);
          imageUrl = vUrl.publicUrl;
        }
      } else {
        // 이미지: JPEG 변환 후 업로드
        setLoadingMsg("이미지 처리 중...");
        let fileToUpload: Blob = mediaFile;
        let finalContentType = "image/jpeg";

        try {
          const compressed = await compressImage(mediaFile);
          // 변환 성공 여부 확인: blob 크기가 다르면 변환된 것
          if (compressed.size > 0 && compressed.size !== mediaFile.size) {
            fileToUpload = compressed;
          } else if (compressed.size > 0) {
            fileToUpload = compressed;
          }
        } catch {
          // 압축 완전 실패 → 원본 사용하되 경고
          fileToUpload = mediaFile;
          finalContentType = mediaFile.type || "image/jpeg";
        }

        const fileName = `feed-${ts}-${rand}.jpg`;

        setLoadingMsg("업로드 중...");
        const uploadPromise = storageClient.storage
          .from("feed-images").upload(fileName, fileToUpload, { contentType: finalContentType, upsert: true });
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("업로드 시간 초과 (30초)")), 30000));
        const { error: uploadError } = await Promise.race([uploadPromise, timeoutPromise]) as any;

        if (uploadError) {
          alert("이미지 업로드 실패: " + uploadError.message + "\n\n카메라로 직접 촬영해서 올려보세요.");
          setLoading(false); return;
        }
        const { data: urlData } = storageClient.storage.from("feed-images").getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;

        // 업로드 검증: 실제 접근 가능한지 확인
        setLoadingMsg("검증 중...");
        try {
          const check = await fetch(imageUrl, { method: "HEAD" });
          if (!check.ok) {
            alert("이미지 업로드는 됐지만 접근이 안 됩니다. 카메라로 직접 촬영해서 다시 시도해주세요.");
            setLoading(false); return;
          }
        } catch { /* 검증 실패해도 진행 */ }
      }

      // AI 증상 분석 (텍스트 기반)
      setLoadingMsg("AI 분석 중...");
      const analysis = analyzeSymptoms(description, species);

      // DB 저장
      setLoadingMsg("저장 중...");
      const { error: insertError } = await supabase.from("feed_posts").insert({
        author_id: user.id,
        image_url: imageUrl,
        description: description.trim(),
        pet_name: petName.trim(),
        pet_species: species,
        analysis_result: analysis,
      });

      if (insertError) { alert("저장 실패: " + insertError.message); setLoading(false); return; }

      // 포인트 +10P
      await supabase.from("point_logs").insert({ user_id: user.id, amount: 10, reason: "피드 작성" });
      await supabase.rpc("add_points", { uid: user.id, pts: 10 });

      setLoading(false);
      setLoadingMsg("");

      if (analysis.severity === "moderate" || analysis.severity === "urgent") {
        setAlertData(analysis);
      } else {
        alert("피드가 등록되었습니다! (+10P)");
        router.push("/feed");
      }
    } catch (err: any) {
      alert("오류: " + (err?.message || "알 수 없는 오류"));
      setLoading(false);
      setLoadingMsg("");
    }
  };

  return (
    <>
      <Header />
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e0e0e0", fontSize: 16, fontWeight: 700 }}>
            📸 사진 / 동영상 올리기
          </div>
          <div style={{ padding: 20 }}>
            {/* 3가지 선택 버튼 */}
            <input ref={albumRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} style={{ display: "none" }} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />
            <input ref={videoRef} type="file" accept="video/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />

            {!preview ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                <button onClick={() => albumRef.current?.click()} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
                  border: "2px dashed #FDBA74", borderRadius: 12, background: "#FFF7ED",
                  cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#92400E",
                }}>
                  <span style={{ fontSize: 28 }}>🖼️</span>
                  <div style={{ textAlign: "left" }}>
                    <div>앨범에서 찾기</div>
                    <div style={{ fontSize: 11, fontWeight: 400, color: "#B45309", marginTop: 2 }}>사진 또는 동영상 선택</div>
                  </div>
                </button>
                <button onClick={() => cameraRef.current?.click()} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
                  border: "2px dashed #86EFAC", borderRadius: 12, background: "#F0FDF4",
                  cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#166534",
                }}>
                  <span style={{ fontSize: 28 }}>📷</span>
                  <div style={{ textAlign: "left" }}>
                    <div>사진 찍어 바로 올리기</div>
                    <div style={{ fontSize: 11, fontWeight: 400, color: "#15803D", marginTop: 2 }}>카메라로 실시간 촬영</div>
                  </div>
                </button>
                <button onClick={() => videoRef.current?.click()} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
                  border: "2px dashed #93C5FD", borderRadius: 12, background: "#EFF6FF",
                  cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#1E40AF",
                }}>
                  <span style={{ fontSize: 28 }}>🎥</span>
                  <div style={{ textAlign: "left" }}>
                    <div>동영상 찍어 바로 올리기</div>
                    <div style={{ fontSize: 11, fontWeight: 400, color: "#1D4ED8", marginTop: 2 }}>증상을 동영상으로 기록</div>
                  </div>
                </button>
              </div>
            ) : (
              <div style={{
                border: "1px solid #e0e0e0", borderRadius: 12, overflow: "hidden",
                marginBottom: 16, position: "relative",
              }}>
                {mediaType === "video" ? (
                  <video src={preview} controls playsInline style={{ width: "100%", maxHeight: 400, display: "block" }} />
                ) : (
                  <img src={preview} alt="미리보기" style={{ width: "100%", maxHeight: 400, objectFit: "cover", display: "block" }} />
                )}
                {/* 미디어 타입 배지 */}
                <span style={{
                  position: "absolute", top: 8, left: 8,
                  background: mediaType === "video" ? "#2563EB" : "#FF6B35",
                  color: "#fff", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                }}>
                  {mediaType === "video" ? "🎥 동영상" : "📷 사진"}
                </span>
                {/* 다시 선택 버튼 */}
                <button onClick={() => { setPreview(null); setMediaFile(null); }} style={{
                  position: "absolute", top: 8, right: 8,
                  background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
                  borderRadius: 12, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                }}>
                  다시 선택
                </button>
              </div>
            )}

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
                placeholder={"예: 오늘 산책 다녀왔어요!\n예: 구토를 해서 걱정이에요...\n예: 뒷다리를 절뚝거려요"}
                style={{
                  width: "100%", padding: "12px", border: "1px solid #ddd", borderRadius: 4,
                  fontSize: 13, minHeight: 120, resize: "vertical", outline: "none", fontFamily: "inherit", lineHeight: 1.6,
                }} />
            </div>

            {/* AI 분석 안내 */}
            <div style={{
              background: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: 8,
              padding: "12px 14px", marginBottom: 16, fontSize: 12, color: "#0369A1", lineHeight: 1.6,
            }}>
              🤖 <b>AI 자동 건강 분석</b><br />
              작성하신 설명을 AI가 분석하여 건강 상태를 체크합니다.
              {mediaType === "video" && " 동영상은 썸네일을 자동 생성하여 피드에 표시합니다."}
              {" "}증상이 감지되면 주변 동물병원 정보도 함께 안내해드립니다.
            </div>

            {/* 버튼 */}
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => router.back()} style={{
                flex: 1, padding: "12px", border: "1px solid #ddd", borderRadius: 8,
                background: "#fff", cursor: "pointer", fontSize: 14,
              }}>취소</button>
              <button onClick={handleSubmit} disabled={loading} style={{
                flex: 2, padding: "12px", border: "none", borderRadius: 8,
                background: loading ? "#9CA3AF" : "#FF6B35", color: "#fff",
                cursor: loading ? "default" : "pointer", fontSize: 14, fontWeight: 700,
              }}>
                {loading ? (loadingMsg || "업로드 중...") : "올리기 (+10P)"}
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {alertData && (
        <SymptomAlert analysis={alertData} onClose={() => { setAlertData(null); router.push("/feed"); }} />
      )}
    </>
  );
}
