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
type PhotoItem = { id: string; file: File; previewUrl: string };
const MAX_PHOTOS = 5;

async function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error(`${label} 시간이 초과되었습니다.`)), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

async function fetchJsonWithTimeout(url: string, init: RequestInit, ms: number) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), ms);

  try {
    const res = await fetch(url, { ...init, signal: controller.signal });
    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : { error: (await res.text()).slice(0, 300) || `HTTP ${res.status}` };
    return { res, data };
  } finally {
    clearTimeout(timeoutId);
  }
}

export default function FeedUploadPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const albumRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("image");
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("cat");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [alertData, setAlertData] = useState<AnalysisResult | null>(null);

  const resetSelection = () => {
    photos.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    if (videoPreview) URL.revokeObjectURL(videoPreview);
    setPhotos([]);
    setVideoFile(null);
    setVideoPreview(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const first = files[0];
    if (first.type.startsWith("video/")) {
      resetSelection();
      setMediaType("video");
      setVideoFile(first);
      setVideoPreview(URL.createObjectURL(first));
      e.target.value = "";
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      alert("이미지 파일을 선택해주세요.");
      e.target.value = "";
      return;
    }

    if (mediaType !== "image") resetSelection();
    setMediaType("image");

    const slotsLeft = MAX_PHOTOS - (mediaType === "image" ? photos.length : 0);
    const selected = imageFiles.slice(0, Math.max(slotsLeft, 0));
    if (selected.length === 0) {
      alert(`사진은 최대 ${MAX_PHOTOS}장까지 선택할 수 있어요.`);
      e.target.value = "";
      return;
    }
    if (imageFiles.length > selected.length) {
      alert(`사진은 최대 ${MAX_PHOTOS}장까지 가능해서 ${selected.length}장만 추가할게요.`);
    }

    const newPhotos = selected.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
    e.target.value = "";
  };

  const removePhoto = (idx: number) => {
    const target = photos[idx];
    if (target) URL.revokeObjectURL(target.previewUrl);
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const hasMedia = mediaType === "video" ? !!videoFile : photos.length > 0;
    if (!hasMedia) { alert("사진 또는 동영상을 선택해주세요."); return; }
    if (!description.trim()) { alert("설명을 입력해주세요."); return; }
    if (!user || user.id === "demo-user") { alert("로그인 후 이용 가능합니다."); router.push("/auth/login"); return; }

    setLoading(true);

    try {
      const ts = Date.now();
      const rand = Math.random().toString(36).slice(2, 8);
      let imageUrl = "";
      const imageUrls: string[] = [];
      const imageFilesForAnalysis: Array<Blob | File> = [];

      if (mediaType === "video" && videoFile) {
        // 동영상: 원본 업로드 + 썸네일 추출
        setLoadingMsg("동영상 업로드 중...");
        const videoName = `feed-${ts}-${rand}.mp4`;
        const { error: vErr } = await withTimeout(
          storageClient.storage.from("feed-images").upload(videoName, videoFile, { contentType: videoFile.type, upsert: true }),
          30000,
          "동영상 업로드",
        );
        if (vErr) { alert("동영상 업로드 실패: " + vErr.message); setLoading(false); return; }

        // 썸네일 추출 & 업로드
        setLoadingMsg("썸네일 생성 중...");
        try {
          const thumb = await extractVideoThumbnail(videoFile);
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
        // 이미지: 여러 장을 압축 후 순차 업로드 (첫 장이 대표 사진)
        for (let i = 0; i < photos.length; i++) {
          setLoadingMsg(`이미지 업로드 중... (${i + 1}/${photos.length})`);
          const compressed = await compressImage(photos[i].file, 1600);
          imageFilesForAnalysis.push(compressed);
          const fd = new FormData();
          fd.append("file", compressed, `feed-${i + 1}.jpg`);

          try {
            const { res: uploadRes, data: uploadData } = await fetchJsonWithTimeout(
              "/api/upload-image",
              { method: "POST", body: fd },
              30000,
            );
            if (uploadRes.ok && uploadData.url) {
              imageUrls.push(uploadData.url);
              if (i === 0) imageUrl = uploadData.url;
            } else {
              throw new Error(uploadData.error || "업로드 실패");
            }
          } catch (uploadErr: any) {
            alert(`이미지 ${i + 1}장 업로드 실패: ` + (uploadErr?.message || "알 수 없는 오류") + "\n\n다시 시도해주세요.");
            setLoading(false); return;
          }
        }
      }

      // AI 분석: 이미지 있으면 Gemini Vision 우선, 없으면 텍스트 키워드 매칭
      // 주의: 과거 버그 — Gemini 실패를 조용히 삼키고 "normal" 가짜 판정 저장하던 것 수정
      setLoadingMsg("AI 분석 중...");
      const textFallback = analyzeSymptoms(description, species);
      let analysis: any = textFallback;
      let aiImageAnalysis = "";
      let aiImageSeverity: "normal" | "mild" | "moderate" | "urgent" | null = null;
      let aiImageError: string | null = null;

      if (mediaType === "image" && imageFilesForAnalysis.length > 0) {
        try {
          setLoadingMsg(imageFilesForAnalysis.length > 1 ? `AI ${imageFilesForAnalysis.length}장 분석 중...` : "AI 분석 중...");
          const results = await Promise.allSettled(imageFilesForAnalysis.map(async (file, idx) => {
            const aiFd = new FormData();
            aiFd.append("file", file, `analysis-${idx + 1}.jpg`);
            aiFd.append("description", description);
            aiFd.append("species", species);
            const { res: aiRes, data: aiData } = await fetchJsonWithTimeout(
              "/api/analyze-image",
              { method: "POST", body: aiFd },
              35000,
            );
            if (!aiRes.ok || !aiData.analysis) return null;
            return {
              text: String(aiData.analysis),
              severity: (aiData.severity || "normal") as "normal" | "mild" | "moderate" | "urgent",
              model: aiData.model,
              references: aiData.references || [],
            };
          }));
          const analyses = results
            .map((result) => result.status === "fulfilled" ? result.value : null)
            .filter((item): item is NonNullable<typeof item> => Boolean(item));

          if (analyses.length > 0) {
            const severityRank = { normal: 0, mild: 1, moderate: 2, urgent: 3 };
            const worst = analyses.reduce((acc, cur) => severityRank[cur.severity] > severityRank[acc.severity] ? cur : acc, analyses[0]);
            aiImageSeverity = worst.severity;
            aiImageAnalysis = analyses.length === 1
              ? analyses[0].text
              : `사진 ${analyses.length}장 분석 결과\n\n` + analyses.map((item, idx) => `[사진 ${idx + 1}] ${item.text}`).join("\n\n");
            // Gemini 결과가 있으면 '항상' 메인 analysis 객체로 채택 (normal 포함)
            //   false-negative 방지: 이전엔 severity==='normal' 이면 덮어쓰지 않아
            //   '분석 실제로 못 한 가짜 normal' 과 'AI가 판정한 normal' 이 구별 안 됐음.
            analysis = {
              severity: aiImageSeverity,
              symptoms: aiImageSeverity === "normal" ? [] : [
                aiImageSeverity === "urgent" ? "긴급" :
                aiImageSeverity === "moderate" ? "주의" : "관찰",
              ],
              summary: aiImageAnalysis.slice(0, 300),
              recommendation: "자세한 내용은 피드 상세 페이지에서 확인하세요.",
              analysis: aiImageAnalysis, // ← 전문을 JSONB 에 직접 저장 (description 에 섞지 않음)
              source: "gemini-vision",
              model: worst.model || "gemini-2.5-flash",
              references: worst.references || [],
              image_urls: imageUrls,
              photo_count: imageUrls.length,
              analyzedAt: new Date().toISOString(),
            };
          } else {
            aiImageError = "AI 분석 결과를 가져오지 못했습니다.";
          }
        } catch (e: any) {
          aiImageError = e?.message || "네트워크 오류";
        }
      }

      // AI 이미지 분석 실패 시 — 'normal' 로 위장하지 말고 '미분석' 상태로 명확히 저장
      if (mediaType === "image" && imageFilesForAnalysis.length > 0 && !aiImageAnalysis) {
        analysis = {
          ...textFallback,
          severity: "pending",      // 'normal' 대신 'pending' — UI 가 '분석 보류' 표시 가능
          analysis: "",
          source: "text-fallback",
          aiImageError,
          image_urls: imageUrls,
          photo_count: imageUrls.length,
          analyzedAt: new Date().toISOString(),
        };
      }

      // DB 저장
      // description 에는 유저 원본만 저장 (AI 분석 섞지 않음 — 재분석/표시 깔끔하게)
      setLoadingMsg("저장 중...");
      const { error: insertError } = await withTimeout<any>(
        Promise.resolve(supabase.from("feed_posts").insert({
          author_id: user.id,
          image_url: imageUrl,
          description: description.trim(),
          pet_name: petName.trim(),
          pet_species: species,
          analysis_result: analysis,
        })),
        20000,
        "피드 저장",
      );

      if (insertError) { alert("저장 실패: " + insertError.message); setLoading(false); return; }

      // 포인트 +10P (첫 피드 +100P 보너스)
      let feedPts = 10;
      let feedBonus = "";
      try {
        const { count: feedCount } = await withTimeout<any>(
          Promise.resolve(supabase.from("feed_posts").select("id", { count: "exact", head: true }).eq("author_id", user.id)),
          10000,
          "포인트 계산",
        );
        if (feedCount === 1) { // 방금 올린 게 첫 번째
          feedPts += 100;
          feedBonus = "\n🎉 첫 피드 보너스 +100P!";
        }
      } catch (pointErr) {
        console.warn("[feed-upload] first feed bonus check skipped", pointErr);
      }
      Promise.allSettled([
        supabase.from("point_logs").insert({ user_id: user.id, amount: feedPts, reason: feedBonus ? "피드 작성 (첫 피드 보너스)" : "피드 작성" }),
        supabase.rpc("add_points", { uid: user.id, pts: feedPts }),
      ]).catch((pointErr) => console.warn("[feed-upload] point update skipped", pointErr));

      setLoading(false);
      setLoadingMsg("");

      if (analysis.severity === "moderate" || analysis.severity === "urgent") {
        setAlertData(analysis);
      } else {
        alert(`피드가 등록되었습니다! (+${feedPts}P)${feedBonus}`);
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
            <input ref={albumRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} style={{ display: "none" }} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />
            <input ref={videoRef} type="file" accept="video/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />

            {photos.length === 0 && !videoPreview ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                <button onClick={() => albumRef.current?.click()} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
                  border: "2px dashed #FDBA74", borderRadius: 12, background: "#FFF7ED",
                  cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#92400E",
                }}>
                  <span style={{ fontSize: 28 }}>🖼️</span>
                  <div style={{ textAlign: "left" }}>
                    <div>앨범에서 찾기</div>
                    <div style={{ fontSize: 11, fontWeight: 400, color: "#B45309", marginTop: 2 }}>사진 최대 {MAX_PHOTOS}장 또는 동영상 선택</div>
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
              <div style={{ marginBottom: 16 }}>
                {mediaType === "video" && videoPreview ? (
                  <div style={{ border: "1px solid #e0e0e0", borderRadius: 12, overflow: "hidden", position: "relative" }}>
                    <video src={videoPreview} controls playsInline style={{ width: "100%", maxHeight: 400, display: "block" }} />
                    <span style={{
                      position: "absolute", top: 8, left: 8,
                      background: "#2563EB", color: "#fff", padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                    }}>🎥 동영상</span>
                    <button onClick={resetSelection} style={{
                      position: "absolute", top: 8, right: 8,
                      background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
                      borderRadius: 12, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                    }}>다시 선택</button>
                  </div>
                ) : (
                  <>
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: photos.length === 1 ? "1fr" : "repeat(auto-fill, minmax(110px, 1fr))",
                      gap: 6,
                    }}>
                      {photos.map((photo, idx) => (
                        <div key={photo.id} style={{
                          position: "relative", paddingBottom: photos.length === 1 ? "75%" : "100%",
                          borderRadius: 10, overflow: "hidden", border: "1px solid #e0e0e0", background: "#f9f9f9",
                        }}>
                          <img src={photo.previewUrl} alt={`미리보기 ${idx + 1}`}
                            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                          {idx === 0 && (
                            <span style={{
                              position: "absolute", top: 6, left: 6,
                              background: "#FF6B35", color: "#fff", padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700,
                            }}>대표</span>
                          )}
                          <button onClick={() => removePhoto(idx)} aria-label="사진 제거" style={{
                            position: "absolute", top: 4, right: 4,
                            width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.6)", color: "#fff",
                            border: "none", fontSize: 14, cursor: "pointer", fontWeight: 700,
                          }}>×</button>
                        </div>
                      ))}
                      {photos.length < MAX_PHOTOS && (
                        <button onClick={() => albumRef.current?.click()} style={{
                          paddingBottom: "100%", position: "relative", borderRadius: 10,
                          border: "2px dashed #FDBA74", background: "#FFF7ED", cursor: "pointer", fontFamily: "inherit",
                        }}>
                          <span style={{
                            position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                            alignItems: "center", justifyContent: "center", color: "#B45309", fontSize: 12, fontWeight: 600, gap: 4,
                          }}>
                            <span style={{ fontSize: 24 }}>＋</span>
                            <span>{photos.length}/{MAX_PHOTOS}</span>
                          </span>
                        </button>
                      )}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, fontSize: 12, color: "#6B7280" }}>
                      <span>📷 {photos.length}장 선택됨{photos.length > 1 ? " · AI가 모든 사진을 분석" : ""}</span>
                      <button onClick={resetSelection} style={{ background: "transparent", border: "none", color: "#FF6B35", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                        전체 다시 선택
                      </button>
                    </div>
                  </>
                )}
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
              {mediaType === "image" && photos.length > 1
                ? `${photos.length}장의 사진을 모두 AI가 분석해 가장 심각한 증상을 기준으로 등급을 결정합니다.`
                : "작성하신 설명을 AI가 분석하여 건강 상태를 체크합니다."}
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
