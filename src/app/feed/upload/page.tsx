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

const MAX_PHOTOS = 5; // 다중 사진 최대 개수 (영상 5프레임 분석과 동일 레벨)

// 이미지 압축. 갤럭시 100MP 사진(12000x9000) 같은 대용량 대비 createImageBitmap의 native resize 옵션 우선 사용.
function compressImage(file: File, maxWidth = 1600): Promise<Blob> {
  return new Promise((resolve) => {
    let resolved = false;
    const done = (b: Blob) => { if (!resolved) { resolved = true; resolve(b); } };

    const drawToCanvas = (source: HTMLImageElement | ImageBitmap) => {
      try {
        const sw = "width" in source ? source.width : (source as any).naturalWidth || 1200;
        const sh = "height" in source ? source.height : (source as any).naturalHeight || 1200;
        const ratio = Math.min(maxWidth / sw, 1);
        const w = Math.max(1, Math.round(sw * ratio));
        const h = Math.max(1, Math.round(sh * ratio));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) { done(file); return; }
        ctx.drawImage(source as any, 0, 0, w, h);
        canvas.toBlob(
          (blob) => done(blob && blob.size > 0 ? blob : file),
          "image/jpeg", 0.82,
        );
      } catch { done(file); }
    };

    const useCreateImageBitmap = typeof createImageBitmap === "function";
    if (useCreateImageBitmap) {
      // 1순위: createImageBitmap의 native resize — 메모리 효율적, 대용량 대응
      (async () => {
        try {
          const bitmap = await createImageBitmap(file, {
            resizeWidth: maxWidth,
            resizeHeight: maxWidth,
            resizeQuality: "high",
          } as any);
          drawToCanvas(bitmap);
        } catch {
          try {
            const bitmap = await createImageBitmap(file);
            drawToCanvas(bitmap);
          } catch {
            try {
              const img = await loadWithImage(file);
              drawToCanvas(img);
            } catch { done(file); }
          }
        }
      })();
    } else {
      loadWithImage(file).then(drawToCanvas).catch(() => done(file));
    }

    // 6초 안에 못 끝내면 원본 반환 (UI 멈춤 방지 — Storage 한도 50MB라 원본도 OK)
    setTimeout(() => done(file), 6000);
  });
}

function isHeicLike(file: File): boolean {
  const t = (file.type || "").toLowerCase();
  const n = (file.name || "").toLowerCase();
  return t.includes("heic") || t.includes("heif") || n.endsWith(".heic") || n.endsWith(".heif");
}

// 항상 브라우저가 그릴 수 있는 JPEG 파일을 반환. 실패하면 명확한 에러.
// HEIC/HEIF는 Chrome Android에서 createImageBitmap·img 모두 못 그려 → 변환 실패 시 차단.
async function ensureJpegForUpload(
  file: File
): Promise<{ ok: true; file: File } | { ok: false; error: string }> {
  // 작은 JPEG는 그대로 통과
  if (file.type === "image/jpeg" && file.size < 1.5 * 1024 * 1024) {
    return { ok: true, file };
  }

  // 압축 시도 (createImageBitmap → img 순)
  let compressed: Blob | null = null;
  try {
    const blob = await compressImage(file, 1600);
    // compressImage가 원본을 그대로 돌려준 경우는 변환 실패로 간주
    if (blob !== file && blob.size > 0) {
      compressed = blob;
    }
  } catch { /* fall through */ }

  if (compressed) {
    const newName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
    return { ok: true, file: new File([compressed], newName, { type: "image/jpeg" }) };
  }

  // 압축 실패: 원본이 JPEG면 그대로라도 업로드 (브라우저가 그릴 수 있음)
  if (file.type === "image/jpeg") {
    return { ok: true, file };
  }

  // HEIC/HEIF + 변환 실패 → 차단
  if (isHeicLike(file)) {
    return {
      ok: false,
      error: "갤럭시 카메라 설정의 'HEIF' 옵션 때문에 브라우저가 사진을 못 읽어요.\n\n[설정 방법] 카메라 앱 → 설정 → '고효율 사진(HEIF)' 끄기 → JPEG로 다시 촬영\n\n또는 '사진 찍어 바로 올리기' 버튼으로 다시 시도해주세요.",
    };
  }

  // 기타(PNG/GIF/WebP 변환 실패 — 매우 드뭄): 원본 그대로 시도
  return { ok: true, file };
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

const SEVERITY_RANK: Record<"normal" | "mild" | "moderate" | "urgent", number> = {
  normal: 0,
  mild: 1,
  moderate: 2,
  urgent: 3,
};

function pickHigherSeverity(
  a: "normal" | "mild" | "moderate" | "urgent",
  b: "normal" | "mild" | "moderate" | "urgent"
) {
  return SEVERITY_RANK[a] >= SEVERITY_RANK[b] ? a : b;
}

// 영상 다중 프레임 추출(기본 5프레임) → Vision 분석 정확도 향상
function extractVideoFrames(file: File, frameCount = 5): Promise<File[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    video.src = objectUrl;

    const cleanup = () => {
      URL.revokeObjectURL(objectUrl);
      video.removeAttribute("src");
      video.load();
    };

    video.onloadedmetadata = async () => {
      try {
        const duration = Math.max(video.duration || 0, 0.1);
        const points = frameCount === 3 ? [0.2, 0.5, 0.8] : [0.15, 0.35, 0.55, 0.75, 0.9];
        const selected = points.slice(0, frameCount).map((p) => Math.min(Math.max(duration * p, 0.05), Math.max(duration - 0.05, 0.05)));
        const frames: File[] = [];

        for (let i = 0; i < selected.length; i++) {
          const sec = selected[i];
          await new Promise<void>((r, j) => {
            const onSeeked = async () => {
              try {
                const canvas = document.createElement("canvas");
                canvas.width = Math.min(video.videoWidth || 1200, 1200);
                canvas.height = Math.round(canvas.width * ((video.videoHeight || 1200) / Math.max(video.videoWidth || 1200, 1)));
                canvas.getContext("2d")!.drawImage(video, 0, 0, canvas.width, canvas.height);
                const blob = await new Promise<Blob | null>((blobResolve) => canvas.toBlob(blobResolve, "image/jpeg", 0.82));
                if (!blob) throw new Error("프레임 추출 실패");
                frames.push(new File([blob], `video-frame-${Date.now()}-${i + 1}.jpg`, { type: "image/jpeg" }));
                r();
              } catch {
                j(new Error("프레임 캡처 실패"));
              }
            };
            video.onseeked = onSeeked;
            video.onerror = () => j(new Error("비디오 탐색 실패"));
            video.currentTime = sec;
          });
        }

        cleanup();
        resolve(frames);
      } catch (e) {
        cleanup();
        reject(e);
      }
    };
    video.onerror = () => {
      cleanup();
      reject(new Error("비디오 로드 실패"));
    };
    setTimeout(() => {
      cleanup();
      reject(new Error("비디오 프레임 추출 타임아웃"));
    }, 16000);
  });
}

type MediaType = "image" | "video";
// 사진 1장당 보관할 최소 정보. 압축은 제출 시점에만 — 선택 즉시 메인 스레드 막힘 방지.
type PhotoItem = {
  id: string;
  original: File;
  previewUrl: string;
  previewFailed: boolean; // HEIC 등 브라우저가 못 그리는 경우
};

// 응답이 JSON이 아닐 수도 있는 fetch 래퍼 (Vercel 413 등 대비)
async function safeJsonFetch(url: string, init: RequestInit): Promise<{ ok: boolean; status: number; data: any; rawText?: string }> {
  const res = await fetch(url, init);
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      const data = await res.json();
      return { ok: res.ok, status: res.status, data };
    } catch (e: any) {
      return { ok: false, status: res.status, data: { error: "응답 파싱 실패" } };
    }
  }
  // JSON이 아니면 text로 읽고 의미있는 메시지로 변환
  const text = await res.text().catch(() => "");
  let friendly = text || `HTTP ${res.status}`;
  if (res.status === 413 || /request entity too large|payload too large/i.test(text)) {
    friendly = "사진 용량이 너무 큽니다 (서버 한도 초과). 자동 압축에 실패했어요.";
  } else if (res.status >= 500) {
    friendly = `서버 오류 (HTTP ${res.status})`;
  }
  return { ok: false, status: res.status, data: { error: friendly }, rawText: text };
}

export default function FeedUploadPage() {
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const albumRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<PhotoItem[]>([]); // 사진 (다중)
  const [videoFile, setVideoFile] = useState<File | null>(null); // 동영상 (단일)
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<MediaType>("image");
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
    if (user && user.id && user.id !== "demo-user") {
      setIsLoggedIn(true);
      setAuthChecked(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      const hasSession = Boolean(data.session?.user);
      setIsLoggedIn(hasSession);
      setAuthChecked(true);
      if (!hasSession) {
        trackEvent("feed_upload_blocked_not_logged_in", { source: "feed_upload_page" });
      }
    });
    return () => { mounted = false; };
  }, [user, router]);

  const resetSelection = () => {
    photos.forEach((p) => { if (p.previewUrl.startsWith("blob:")) URL.revokeObjectURL(p.previewUrl); });
    if (videoPreview?.startsWith("blob:")) URL.revokeObjectURL(videoPreview);
    setPhotos([]);
    setVideoFile(null);
    setVideoPreview(null);
  };

  // 사진 1장 → 즉시 표시할 PhotoItem. 압축 없음, 메인 스레드 안 막음.
  const buildPhotoItem = (file: File): PhotoItem => {
    const id = (typeof crypto !== "undefined" && (crypto as any).randomUUID)
      ? (crypto as any).randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    return {
      id,
      original: file,
      previewUrl: URL.createObjectURL(file),
      previewFailed: false,
    };
  };

  // 미리보기 로드 실패(HEIC 등) 시 표시 상태 업데이트
  const markPreviewFailed = (id: string) => {
    setPhotos((prev) => prev.map((p) => p.id === id ? { ...p, previewFailed: true } : p));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const first = fileList[0];
    const isVideo = first.type.startsWith("video/");

    if (isVideo) {
      resetSelection();
      setMediaType("video");
      setVideoFile(first);
      setVideoPreview(URL.createObjectURL(first));
    } else {
      const incoming = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
      if (incoming.length === 0) { alert("이미지 파일을 선택해주세요."); e.target.value = ""; return; }

      const slotsLeft = MAX_PHOTOS - (mediaType === "image" ? photos.length : 0);
      const usable = incoming.slice(0, Math.max(0, slotsLeft));
      if (slotsLeft <= 0) {
        alert(`이미 ${MAX_PHOTOS}장 선택되어 있습니다.`);
        e.target.value = ""; return;
      }
      if (incoming.length > slotsLeft) {
        alert(`최대 ${MAX_PHOTOS}장까지 선택할 수 있어 ${usable.length}장만 추가합니다.`);
      }

      if (mediaType !== "image") resetSelection();
      setMediaType("image");

      // HEIC/HEIF는 일부 안드로이드 브라우저에서 변환 불가 → 선택 직후 안내
      const heicCount = usable.filter(isHeicLike).length;
      if (heicCount > 0) {
        alert(
          `선택한 사진 중 ${heicCount}장이 HEIC/HEIF 형식이에요.\n` +
          `갤럭시 카메라 설정에서 '고효율 사진(HEIF)'을 끄거나 ` +
          `'사진 찍어 바로 올리기' 버튼으로 다시 시도하시는 게 좋아요.\n\n` +
          `(올리기 시도해서 실패하면 알려드립니다)`
        );
      }

      // 즉시 화면에 추가 — 압축은 제출 시에만
      const newItems = usable.map(buildPhotoItem);
      setPhotos((prev) => [...prev, ...newItems]);
    }
    e.target.value = "";
  };

  const removePhoto = (idx: number) => {
    const target = photos[idx];
    if (target?.previewUrl.startsWith("blob:")) URL.revokeObjectURL(target.previewUrl);
    setPhotos((arr) => arr.filter((_, i) => i !== idx));
  };

  const handleSubmit = async () => {
    const hasMedia = mediaType === "video" ? !!videoFile : photos.length > 0;
    if (!hasMedia) { alert("사진 또는 동영상을 선택해주세요."); return; }
    if (!description.trim()) { alert("설명을 입력해주세요."); return; }
    if (!user || user.id === "demo-user") { alert("로그인 후 이용 가능합니다."); router.push("/auth/login"); return; }
    trackEvent("feed_upload_submit_attempt", {
      media_type: mediaType,
      request_expert: requestExpert,
      photo_count: photos.length,
    });

    setLoading(true);

    try {
      const ts = Date.now();
      const rand = Math.random().toString(36).slice(2, 8);
      let primaryImageUrl = "";
      const imageUrls: string[] = [];
      let analysisImageFile: File | null = null;
      const additionalAnalysisFiles: File[] = [];

      if (mediaType === "video" && videoFile) {
        setLoadingMsg("동영상 업로드 중...");
        const videoName = `feed-${ts}-${rand}.mp4`;
        const { error: vErr } = await storageClient.storage
          .from("feed-images").upload(videoName, videoFile, { contentType: videoFile.type, upsert: true });
        if (vErr) { alert("동영상 업로드 실패: " + vErr.message); setLoading(false); return; }

        setLoadingMsg("썸네일 생성 중...");
        try {
          const thumb = await extractVideoThumbnail(videoFile);
          const thumbName = `thumb-${ts}-${rand}.jpg`;
          await storageClient.storage.from("feed-images").upload(thumbName, thumb, { contentType: "image/jpeg", upsert: true });
          const { data: thumbUrl } = storageClient.storage.from("feed-images").getPublicUrl(thumbName);
          primaryImageUrl = thumbUrl.publicUrl;
          analysisImageFile = new File([thumb], thumbName, { type: "image/jpeg" });
        } catch {
          const { data: vUrl } = storageClient.storage.from("feed-images").getPublicUrl(videoName);
          primaryImageUrl = vUrl.publicUrl;
        }
      } else {
        // 사진: 압축 → 업로드를 한 장씩 파이프라인. 압축은 순차(메인 스레드 보호), 업로드는 시작되는 대로 병렬.
        setLoadingMsg(`사진 ${photos.length}장 처리 중... (1/${photos.length})`);

        const uploadPromises: Promise<{ ok: true; url: string; file: File; idx: number } | { ok: false; error: string; idx: number }>[] = [];

        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];
          setLoadingMsg(`사진 ${i + 1}/${photos.length} 처리 중...`);
          const ensured = await ensureJpegForUpload(photo.original);
          if (!ensured.ok) {
            alert(`사진 ${i + 1}장: ${ensured.error}`);
            setLoading(false); return;
          }
          const compressedFile = ensured.file;
          const ext = compressedFile.type === "image/jpeg" ? "jpg"
            : compressedFile.type === "image/png" ? "png"
            : compressedFile.type === "image/webp" ? "webp"
            : "jpg";
          const fileName = `feed-${ts}-${rand}-${i + 1}.${ext}`;

          // 압축이 끝나는 즉시 업로드 시작 (await하지 않음 — 다음 사진 압축이 동시에 진행)
          const uploadPromise = storageClient.storage
            .from("feed-images")
            .upload(fileName, compressedFile, {
              contentType: compressedFile.type.startsWith("image/") ? compressedFile.type : "image/jpeg",
              upsert: true,
            })
            .then((res) => {
              if (res.error) return { ok: false as const, error: res.error.message, idx: i };
              const { data: pub } = storageClient.storage.from("feed-images").getPublicUrl(fileName);
              return { ok: true as const, url: pub.publicUrl, file: compressedFile, idx: i };
            });
          uploadPromises.push(uploadPromise);
        }

        setLoadingMsg("사진 업로드 마무리 중...");
        const uploadResults = await Promise.all(uploadPromises);

        const failed = uploadResults.find((r) => !r.ok);
        if (failed && !failed.ok) {
          alert(`이미지 ${failed.idx + 1}장 업로드 실패: ${failed.error}\n\n다시 시도하거나 카메라로 직접 촬영해주세요.`);
          setLoading(false); return;
        }

        for (const r of uploadResults) {
          if (!r.ok) continue;
          imageUrls.push(r.url);
          if (r.idx === 0) {
            primaryImageUrl = r.url;
            analysisImageFile = r.file;
          } else {
            additionalAnalysisFiles[r.idx - 1] = r.file;
          }
        }
      }

      // AI 분석 (사진/영상 모두 병렬). 모든 사진 호출이 동시에 나가서 5장 ≈ 1장 시간.
      setLoadingMsg("AI 분석 중...");
      let analysis: any = analyzeSymptoms(description, species);
      let aiImageAnalysis = "";
      let visionAnalyzed = false;
      let forceExpertRequest = false;

      const callAnalyze = async (file: File) => {
        const aiFd = new FormData();
        aiFd.append("file", file);
        aiFd.append("description", description);
        aiFd.append("species", species);
        const aiResult = await safeJsonFetch("/api/analyze-image", { method: "POST", body: aiFd });
        if (aiResult.ok && aiResult.data?.analysis && aiResult.data?.severity) {
          return { severity: aiResult.data.severity as "normal" | "mild" | "moderate" | "urgent", text: aiResult.data.analysis as string, data: aiResult.data };
        }
        return null;
      };

      if (mediaType === "image" && analysisImageFile) {
        const allImageFiles = [analysisImageFile, ...additionalAnalysisFiles].filter(Boolean) as File[];
        setLoadingMsg(allImageFiles.length === 1 ? "AI 분석 중..." : `AI ${allImageFiles.length}장 동시 분석 중...`);

        const settled = await Promise.allSettled(allImageFiles.map(callAnalyze));
        const frameAnalyses = settled
          .map((s) => s.status === "fulfilled" ? s.value : null)
          .filter((x): x is NonNullable<typeof x> => !!x);

        if (frameAnalyses.length > 0) {
          visionAnalyzed = true;
          const mergedSeverity = frameAnalyses.reduce(
            (acc, cur) => pickHigherSeverity(acc, cur.severity),
            "normal" as "normal" | "mild" | "moderate" | "urgent"
          );
          const worstFrame = frameAnalyses.reduce((acc, cur) =>
            SEVERITY_RANK[cur.severity] > SEVERITY_RANK[acc.severity] ? cur : acc
          , frameAnalyses[0]);

          aiImageAnalysis = frameAnalyses.length === 1
            ? frameAnalyses[0].text
            : `사진 ${frameAnalyses.length}장 분석 결과\n\n` +
              frameAnalyses.map((f, i) => `[사진 ${i + 1}] ${f.text.slice(0, 220)}`).join("\n\n");

          analysis = {
            severity: mergedSeverity,
            symptoms: [mergedSeverity === "urgent" ? "긴급" : mergedSeverity === "moderate" ? "주의" : mergedSeverity === "mild" ? "관찰" : "정상"],
            summary: aiImageAnalysis.slice(0, 300),
            recommendation: "자세한 내용은 피드 상세 페이지에서 확인하세요.",
            fgs_total: worstFrame.data.fgs_total ?? null,
            fgs_breakdown: worstFrame.data.fgs_breakdown ?? null,
            severity_score: worstFrame.data.severity_score ?? null,
            bboxes: worstFrame.data.bboxes ?? [],
            image_urls: imageUrls,
            photo_count: imageUrls.length,
          };
        }
      }

      if (mediaType === "video" && videoFile) {
        setLoadingMsg("AI 분석 중... (5프레임 정밀 분석)");
        try {
          const frames = await extractVideoFrames(videoFile, 5);
          // 5프레임 병렬 분석
          const settled = await Promise.allSettled(frames.map(callAnalyze));
          const frameAnalyses = settled
            .map((s) => s.status === "fulfilled" ? s.value : null)
            .filter((x): x is NonNullable<typeof x> => !!x);

          if (frameAnalyses.length > 0) {
            visionAnalyzed = true;
            const mergedSeverity = frameAnalyses.reduce(
              (acc, cur) => pickHigherSeverity(acc, cur.severity),
              "normal" as "normal" | "mild" | "moderate" | "urgent"
            );
            const mergedText = frameAnalyses
              .map((f, i) => `[프레임 ${i + 1}] ${f.text.slice(0, 220)}`)
              .join("\n\n");

            aiImageAnalysis = `동영상 ${frameAnalyses.length}프레임 분석 결과\n\n${mergedText}`;
            analysis = {
              severity: mergedSeverity,
              symptoms: [mergedSeverity === "urgent" ? "긴급" : mergedSeverity === "moderate" ? "주의" : mergedSeverity === "mild" ? "관찰" : "정상"],
              summary: aiImageAnalysis.slice(0, 300),
              recommendation: "자세한 내용은 피드 상세 페이지에서 확인하세요.",
            };
          }
        } catch { /* 멀티 프레임 실패 시 텍스트 분석 유지 */ }
      }

      // 이미지/영상이 있지만 비전 분석에 실패한 경우: 정상 오판 방지용 최소 보수 판정
      if (analysisImageFile && !visionAnalyzed && analysis.severity === "normal") {
        analysis = {
          ...analysis,
          severity: "mild",
          symptoms: ["관찰"],
          summary: "이미지/영상 AI 분석이 지연되어 보수적으로 관찰 등급으로 분류했습니다.",
          recommendation: "같은 증상이 지속되면 재촬영 후 다시 분석하거나 전문가 답변을 요청해주세요.",
        };
      }

      // 다중 사진 정보를 analysis_result에 병합 (DB 스키마 변경 없이 multi-image 지원)
      if (mediaType === "image" && imageUrls.length > 1) {
        analysis = { ...analysis, image_urls: imageUrls, photo_count: imageUrls.length };
      }

      if (analysis.severity === "moderate" || analysis.severity === "urgent") {
        forceExpertRequest = true;
      }

      // DB 저장
      setLoadingMsg("저장 중...");
      const baseInsert: Record<string, any> = {
        author_id: user.id,
        image_url: primaryImageUrl,
        description: description.trim() + (aiImageAnalysis ? "\n\n---\n🤖 AI 이미지 분석:\n" + aiImageAnalysis : ""),
        pet_name: petName.trim(),
        pet_species: species,
        analysis_result: analysis,
      };
      const effectiveRequestExpert = requestExpert || forceExpertRequest;
      if (effectiveRequestExpert) {
        baseInsert.request_expert = true;
        baseInsert.expert_target = expertTarget;
        baseInsert.expert_status = "pending";
      }
      let createdPostId: string | null = null;
      let { data: insertedRows, error: insertError } = await supabase.from("feed_posts").insert(baseInsert).select("id");
      if (!insertError && insertedRows?.[0]?.id) {
        createdPostId = insertedRows[0].id;
      }
      if (insertError && effectiveRequestExpert && /column.*request_expert|expert_target|expert_status/i.test(insertError.message)) {
        const fallback = { ...baseInsert };
        delete fallback.request_expert;
        delete fallback.expert_target;
        delete fallback.expert_status;
        const retry = await supabase.from("feed_posts").insert(fallback).select("id");
        insertError = retry.error;
        if (!insertError && retry.data?.[0]?.id) createdPostId = retry.data[0].id;
      }

      if (insertError) { alert("저장 실패: " + insertError.message); setLoading(false); return; }
      if (createdPostId) {
        try {
          await supabase.rpc("enqueue_feed_reanalysis", {
            p_feed_post_id: createdPostId,
            p_reason: "post_upload_auto",
            p_priority: 80,
          });
        } catch { /* 큐 미구성 환경에서는 무시 */ }
      }
      trackEvent("feed_upload_success", { media_type: mediaType, request_expert: effectiveRequestExpert, photo_count: imageUrls.length });

      // 포인트 +10P (첫 피드 +100P 보너스)
      let feedPts = 10;
      let feedBonus = "";
      const { count: feedCount } = await supabase.from("feed_posts").select("id", { count: "exact", head: true })
        .eq("author_id", user.id);
      if (feedCount === 1) {
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
            {/* 앨범: 사진 다중 선택 (image/* multiple). 동영상도 같이 고를 수 있게 video도 허용. */}
            <input ref={albumRef} type="file" accept="image/*,video/*" multiple onChange={handleFileSelect} style={{ display: "none" }} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />
            <input ref={videoRef} type="file" accept="video/*" capture="environment" onChange={handleFileSelect} style={{ display: "none" }} />

            {(photos.length === 0 && !videoPreview) ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                <button onClick={() => albumRef.current?.click()} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "16px 20px",
                  border: "2px dashed #FDBA74", borderRadius: 12, background: "#FFF7ED",
                  cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#92400E",
                }}>
                  <span style={{ fontSize: 28 }}>🖼️</span>
                  <div style={{ textAlign: "left" }}>
                    <div>앨범에서 찾기</div>
                    <div style={{ fontSize: 11, fontWeight: 400, color: "#B45309", marginTop: 2 }}>
                      사진 최대 {MAX_PHOTOS}장 또는 동영상 1개
                    </div>
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
                  <div style={{
                    border: "1px solid #e0e0e0", borderRadius: 12, overflow: "hidden", position: "relative",
                  }}>
                    <video src={videoPreview} controls playsInline style={{ width: "100%", maxHeight: 400, display: "block" }} />
                    <span style={{
                      position: "absolute", top: 8, left: 8,
                      background: "#2563EB", color: "#fff",
                      padding: "3px 10px", borderRadius: 12, fontSize: 11, fontWeight: 700,
                    }}>🎥 동영상</span>
                    <button onClick={resetSelection} style={{
                      position: "absolute", top: 8, right: 8,
                      background: "rgba(0,0,0,0.5)", color: "#fff", border: "none",
                      borderRadius: 12, padding: "4px 12px", fontSize: 12, cursor: "pointer", fontWeight: 600,
                    }}>다시 선택</button>
                  </div>
                ) : (
                  <div>
                    {/* 사진 다중 그리드 */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: photos.length === 1 ? "1fr" : "repeat(auto-fill, minmax(110px, 1fr))",
                      gap: 6,
                    }}>
                      {photos.map((p, idx) => (
                        <div key={p.id} style={{
                          position: "relative",
                          paddingBottom: photos.length === 1 ? "75%" : "100%",
                          borderRadius: 10, overflow: "hidden", border: "1px solid #e0e0e0",
                          background: "#f9f9f9",
                        }}>
                          {p.previewFailed ? (
                            <div style={{
                              position: "absolute", inset: 0,
                              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                              color: "#9CA3AF", fontSize: 11, gap: 4, padding: 6, textAlign: "center",
                            }}>
                              <span style={{ fontSize: 28 }}>📷</span>
                              <span>미리보기 불가<br />(올리기는 정상)</span>
                            </div>
                          ) : (
                            <img src={p.previewUrl} alt={`미리보기 ${idx + 1}`}
                              onError={() => markPreviewFailed(p.id)}
                              style={{
                                position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
                              }} />
                          )}
                          {idx === 0 && (
                            <span style={{
                              position: "absolute", top: 6, left: 6,
                              background: "#FF6B35", color: "#fff",
                              padding: "2px 8px", borderRadius: 10, fontSize: 10, fontWeight: 700,
                            }}>대표</span>
                          )}
                          <button onClick={() => removePhoto(idx)} aria-label="사진 제거" style={{
                            position: "absolute", top: 4, right: 4,
                            width: 22, height: 22, borderRadius: "50%",
                            background: "rgba(0,0,0,0.6)", color: "#fff", border: "none",
                            fontSize: 14, lineHeight: 1, cursor: "pointer", fontWeight: 700,
                            display: "flex", alignItems: "center", justifyContent: "center",
                          }}>×</button>
                        </div>
                      ))}
                      {photos.length < MAX_PHOTOS && (
                        <button onClick={() => albumRef.current?.click()} style={{
                          paddingBottom: "100%",
                          position: "relative",
                          borderRadius: 10, border: "2px dashed #FDBA74",
                          background: "#FFF7ED",
                          cursor: "pointer", fontFamily: "inherit",
                        }}>
                          <span style={{
                            position: "absolute", inset: 0,
                            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                            color: "#B45309", fontSize: 12, fontWeight: 600, gap: 4,
                          }}>
                            <span style={{ fontSize: 24 }}>＋</span>
                            <span>{photos.length}/{MAX_PHOTOS}</span>
                          </span>
                        </button>
                      )}
                    </div>
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                      marginTop: 8, fontSize: 12, color: "#6B7280",
                    }}>
                      <span>
                        📷 {photos.length}장 선택됨{photos.length > 1 ? " · AI가 모든 사진을 동시 분석" : ""}
                      </span>
                      <button onClick={resetSelection} style={{
                        background: "transparent", border: "none", color: "#FF6B35",
                        fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                      }}>전체 다시 선택</button>
                    </div>
                  </div>
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
              padding: "12px 14px", marginBottom: 12, fontSize: 12, color: "#0369A1", lineHeight: 1.6,
            }}>
              🤖 <b>AI 자동 건강 분석</b><br />
              {mediaType === "image" && photos.length > 1
                ? `${photos.length}장의 사진을 모두 AI가 동시 분석해 가장 심각한 증상을 기준으로 등급을 결정합니다.`
                : mediaType === "video"
                  ? "동영상은 5프레임을 추출해 정밀 분석하고 썸네일을 자동 생성합니다."
                  : "작성하신 설명과 사진을 AI가 함께 분석해 건강 상태를 체크합니다."}
              {" "}증상이 감지되면 주변 동물병원 정보도 함께 안내해드립니다.
            </div>

            {/* 전문가 답변 요청 체크박스 */}
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
