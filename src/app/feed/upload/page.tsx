"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import SymptomAlert from "../../../components/SymptomAlert";
import { supabase, storageClient } from "../../../lib/supabase";
import { useAppStore } from "../../../lib/store";
import { analyzeSymptoms } from "../../../lib/symptomAnalyzer";
import type { AnalysisResult } from "../../../types";
import { trackEvent } from "../../../lib/analytics";

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
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
  const [requestExpert, setRequestExpert] = useState(false);
  const [expertTarget, setExpertTarget] = useState<"vet" | "vet_clinic" | "behaviorist">("vet");

  useEffect(() => {
    let mounted = true;

    // 1) AuthProvider가 이미 setUser(...)로 채워놨으면 즉시 통과
    //    → 로그인된 사용자에게 '접근 확인 중' 화면이 뜨지 않음
    if (user && user.id && user.id !== "demo-user") {
      setIsLoggedIn(true);
      setAuthChecked(true);
      return;
    }

    // 2) user 없으면 세션 재확인 (AuthProvider가 아직 로드 중인 경우 대비)
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const hasSession = Boolean(data.session?.user);
      setIsLoggedIn(hasSession);
      setAuthChecked(true);
      if (!hasSession) {
        trackEvent("feed_upload_blocked_not_logged_in", { source: "feed_upload_page" });
        // 바로 리다이렉트하지 않고 안내 화면을 먼저 보여줌 (깜빡임 방지)
      }
    });
    return () => { mounted = false; };
  }, [user, router]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = file.type.startsWith("video/");
    setMediaFile(file);
    setMediaType(isVideo ? "video" : "image");

    if (isVideo) {
      setPreview(URL.createObjectURL(file));
    } else {
      // 미리보기: 먼저 URL.createObjectURL 시도
      const objUrl = URL.createObjectURL(file);

      // HEIC 감지: type이 heic이거나 이름이 .heic
      const isHeic = file.type.includes("heic") || file.type.includes("heif") || file.name.toLowerCase().endsWith(".heic");

      if (isHeic) {
        // HEIC는 브라우저 미리보기 불가 → 서버에 미리 업로드 후 URL로 표시
        setPreview(null); // 로딩 표시
        setLoadingMsg("미리보기 생성 중...");
        try {
          const fd = new FormData();
          fd.append("file", file);
          const res = await fetch("/api/upload-image", { method: "POST", body: fd });
          const data = await res.json();
          if (res.ok && data.url) {
            setPreview(data.url);
          } else {
            setPreview(objUrl); // fallback
          }
        } catch {
          setPreview(objUrl);
        }
        setLoadingMsg("");
      } else {
        setPreview(objUrl);
      }
    }
  };

  const handleSubmit = async () => {
    if (!mediaFile) { alert("사진 또는 동영상을 선택해주세요."); return; }
    if (!description.trim()) { alert("설명을 입력해주세요."); return; }
    if (!user || user.id === "demo-user") { alert("로그인 후 이용 가능합니다."); router.push("/auth/login"); return; }
    trackEvent("feed_upload_submit_attempt", { media_type: mediaType, request_expert: requestExpert });

    setLoading(true);

    try {
      const ts = Date.now();
      const rand = Math.random().toString(36).slice(2, 8);
      let imageUrl = "";
      let analysisImageFile: File | null = null;

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
          analysisImageFile = new File([thumb], thumbName, { type: "image/jpeg" });
        } catch {
          // 썸네일 실패 시 비디오 URL 사용
          const { data: vUrl } = storageClient.storage.from("feed-images").getPublicUrl(videoName);
          imageUrl = vUrl.publicUrl;
        }
      } else {
        // 이미지: 서버 API로 업로드 (HEIC 자동 처리)
        setLoadingMsg("이미지 업로드 중...");
        const fd = new FormData();
        fd.append("file", mediaFile);

        try {
          const uploadRes = await fetch("/api/upload-image", { method: "POST", body: fd });
          const uploadData = await uploadRes.json();
          if (uploadRes.ok && uploadData.url) {
            imageUrl = uploadData.url;
            analysisImageFile = mediaFile;
          } else {
            throw new Error(uploadData.error || "업로드 실패");
          }
        } catch (uploadErr: any) {
          alert("이미지 업로드 실패: " + (uploadErr?.message || "알 수 없는 오류") + "\n\n카메라로 직접 촬영해서 다시 시도해주세요.");
          setLoading(false); return;
        }
        // imageUrl은 위에서 이미 설정됨
      }

      // AI 분석: 이미지/영상(썸네일)이 있으면 Gemini Vision, 없으면 텍스트 분석
      setLoadingMsg("AI 분석 중...");
      let analysis: any = analyzeSymptoms(description, species); // 텍스트 기본 분석
      let aiImageAnalysis = "";

      if (analysisImageFile) {
        try {
          const aiFd = new FormData();
          aiFd.append("file", analysisImageFile);
          aiFd.append("description", description);
          aiFd.append("species", species);
          const aiRes = await fetch("/api/analyze-image", { method: "POST", body: aiFd });
          const aiData = await aiRes.json();
          if (aiRes.ok && aiData.analysis) {
            aiImageAnalysis = aiData.analysis;
            // Gemini 분석 결과로 심각도 + 구조화 필드 업데이트
            analysis = {
              severity: aiData.severity,
              symptoms: [aiData.severity === "urgent" ? "긴급" : aiData.severity === "moderate" ? "주의" : aiData.severity === "mild" ? "관찰" : "정상"],
              summary: aiImageAnalysis.slice(0, 300),
              recommendation: "자세한 내용은 피드 상세 페이지에서 확인하세요.",
              fgs_total: aiData.fgs_total ?? null,
              fgs_breakdown: aiData.fgs_breakdown ?? null,
              severity_score: aiData.severity_score ?? null,
              bboxes: aiData.bboxes ?? [],
            };
          }
        } catch { /* Gemini 실패 시 텍스트 분석 유지 */ }
      }

      // DB 저장 (전문가 요청 시 request_expert 및 expert_status 'pending')
      setLoadingMsg("저장 중...");
      const baseInsert: Record<string, any> = {
        author_id: user.id,
        image_url: imageUrl,
        description: description.trim() + (aiImageAnalysis ? "\n\n---\n🤖 AI 이미지 분석:\n" + aiImageAnalysis : ""),
        pet_name: petName.trim(),
        pet_species: species,
        analysis_result: analysis,
      };
      if (requestExpert) {
        baseInsert.request_expert = true;
        baseInsert.expert_target = expertTarget;
        baseInsert.expert_status = "pending";
      }
      let { error: insertError } = await supabase.from("feed_posts").insert(baseInsert);
      // DB에 request_expert 컬럼이 아직 없을 경우(마이그레이션 전) → 메타 제거하고 재시도
      if (insertError && requestExpert && /column.*request_expert|expert_target|expert_status/i.test(insertError.message)) {
        const fallback = { ...baseInsert };
        delete fallback.request_expert;
        delete fallback.expert_target;
        delete fallback.expert_status;
        const retry = await supabase.from("feed_posts").insert(fallback);
        insertError = retry.error;
      }

      if (insertError) { alert("저장 실패: " + insertError.message); setLoading(false); return; }
      trackEvent("feed_upload_success", { media_type: mediaType, request_expert: requestExpert });

      // 포인트 +10P (첫 피드 +100P 보너스)
      let feedPts = 10;
      let feedBonus = "";
      const { count: feedCount } = await supabase.from("feed_posts").select("id", { count: "exact", head: true })
        .eq("author_id", user.id);
      if (feedCount === 1) { // 방금 올린 게 첫 번째
        feedPts += 100;
        feedBonus = "\n🎉 첫 피드 보너스 +100P!";
      }
      await supabase.from("point_logs").insert({ user_id: user.id, amount: feedPts, reason: feedBonus ? "피드 작성 (첫 피드 보너스)" : "피드 작성" });
      await supabase.rpc("add_points", { uid: user.id, pts: feedPts });

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
      {!authChecked ? (
        // 극히 짧은 순간(<200ms)만 깜빡임 — 화면을 덜 어색하게 얇은 스피너로 표시
        <main style={{ maxWidth: 500, margin: "0 auto", padding: "60px 16px", flex: 1, width: "100%", textAlign: "center" }}>
          <div style={{
            display: "inline-block", width: 28, height: 28,
            border: "3px solid #FFE0CC", borderTopColor: "#FF6B35",
            borderRadius: "50%", animation: "spin 0.7s linear infinite",
          }} />
          <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </main>
      ) : !isLoggedIn ? (
        <main style={{ maxWidth: 500, margin: "0 auto", padding: "48px 16px", flex: 1, width: "100%" }}>
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: 28, textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔐</div>
            <h2 style={{ margin: "0 0 10px", fontSize: 19, fontWeight: 800, color: "#1D1D1F", letterSpacing: "-0.02em" }}>
              로그인이 필요해요
            </h2>
            <p style={{ margin: "0 0 20px", color: "#6B7280", fontSize: 13, lineHeight: 1.7, wordBreak: "keep-all" }}>
              피드의 신뢰도를 위해<br />
              사진·영상 업로드는 회원 전용입니다.
            </p>
            <div style={{ display: "flex", gap: 8, flexDirection: "column" }}>
              <button
                onClick={() => router.push("/auth/login?next=/feed/upload")}
                style={{
                  border: "none", background: "#FF6B35", color: "#fff",
                  padding: "12px 18px", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                  fontSize: 14, fontFamily: "inherit",
                  boxShadow: "0 4px 12px rgba(255,107,53,0.25)",
                }}
              >
                로그인하고 업로드하기
              </button>
              <button
                onClick={() => router.push("/auth/signup?next=/feed/upload")}
                style={{
                  border: "1.5px solid #E5E7EB", background: "#fff", color: "#1D1D1F",
                  padding: "11px 18px", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                  fontSize: 13, fontFamily: "inherit",
                }}
              >
                회원가입 (30초)
              </button>
            </div>
            <p style={{ margin: "14px 0 0", fontSize: 11, color: "#9CA3AF" }}>
              첫 피드 업로드 시 +100P 보너스
            </p>
          </div>
        </main>
      ) : (
      <main style={{ maxWidth: 500, margin: "0 auto", padding: "20px 16px", flex: 1, width: "100%" }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", borderRadius: 12 }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid #e0e0e0", fontSize: 16, fontWeight: 700 }}>
            📸 사진 / 동영상 올리기
          </div>
          <div style={{ padding: 20 }}>
            {/* 3가지 선택 버튼 */}
            <input ref={albumRef} type="file" accept="image/*,video/*" onChange={handleFileSelect} style={{ display: "none" }} />
            {/* TODO: 다중 사진 지원은 추후 별도 구현 */}
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
              padding: "12px 14px", marginBottom: 12, fontSize: 12, color: "#0369A1", lineHeight: 1.6,
            }}>
              🤖 <b>AI 자동 건강 분석</b><br />
              작성하신 설명을 AI가 분석하여 건강 상태를 체크합니다.
              {mediaType === "video" && " 동영상은 썸네일을 자동 생성하여 피드에 표시합니다."}
              {" "}증상이 감지되면 주변 동물병원 정보도 함께 안내해드립니다.
            </div>

            {/* 전문가 답변 요청 체크박스 — 핵심 차별점 */}
            <div style={{
              background: requestExpert ? "#FFF7ED" : "#FAFAFA",
              border: `1px solid ${requestExpert ? "#FDBA74" : "#E5E7EB"}`,
              borderRadius: 10,
              padding: "14px 16px",
              marginBottom: 16,
              transition: "all 0.15s",
            }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={requestExpert}
                  onChange={(e) => setRequestExpert(e.target.checked)}
                  style={{ marginTop: 2, width: 18, height: 18, accentColor: "#FF6B35", cursor: "pointer" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1D1D1F", lineHeight: 1.4 }}>
                    👨‍⚕️ 전문가(수의사·동물병원·행동 전문가) 답변 요청
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", marginTop: 4, lineHeight: 1.5 }}>
                    체크하면 펫에토에 등록된 검증된 전문가가 <b>진료·약 처방·예상 비용</b>까지 직접 답변해드립니다.
                    답변은 "○○ 동물병원 ○○ 수의사" 형식으로 신원이 공개됩니다.
                  </div>
                </div>
              </label>

              {requestExpert && (
                <div style={{ marginTop: 14, paddingLeft: 28 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#1D1D1F", marginBottom: 6 }}>
                    답변 받고 싶은 전문가 유형
                  </div>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {[
                      { v: "vet", label: "🩺 수의사 (진료·처방)" },
                      { v: "vet_clinic", label: "🏥 동물병원 (내원 상담)" },
                      { v: "behaviorist", label: "🐾 행동 전문가 (훈련·심리)" },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        type="button"
                        onClick={() => setExpertTarget(opt.v as any)}
                        style={{
                          padding: "7px 12px",
                          borderRadius: 999,
                          border: `1.5px solid ${expertTarget === opt.v ? "#FF6B35" : "#E5E7EB"}`,
                          background: expertTarget === opt.v ? "#FFF7ED" : "#fff",
                          color: expertTarget === opt.v ? "#C2410C" : "#4B5563",
                          fontSize: 12,
                          fontWeight: expertTarget === opt.v ? 700 : 500,
                          cursor: "pointer",
                          fontFamily: "inherit",
                        }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 8, lineHeight: 1.5 }}>
                    ℹ️ 전문가 답변 평균 대기시간: 2~24시간 · 업체 제휴 추가 중
                  </div>
                </div>
              )}
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
      )}
      <Footer />

      {alertData && (
        <SymptomAlert analysis={alertData} onClose={() => { setAlertData(null); router.push("/feed"); }} />
      )}
    </>
  );
}
