import type { MetadataRoute } from "next";

// PWA Manifest — 홈 화면 설치 가능한 Progressive Web App
// Next.js 15가 이 파일을 읽어 /manifest.webmanifest를 자동 생성합니다.

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "P.E.T 펫에토 — 반려동물 긴급케어",
    short_name: "펫에토",
    description: "검증된 펫시터 매칭 · AI 건강 분석 · 안심 케어. 10분 내 전문가 연결.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FAFAFA",
    theme_color: "#FF6B35",
    lang: "ko-KR",
    dir: "ltr",
    categories: ["lifestyle", "social", "health", "utilities"],
    icons: [
      // SVG (모든 크기 대응, 선명도 유지)
      {
        src: "/logo-pet.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon-pet.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      // Maskable (안드로이드 어댑티브 아이콘 safe area 지원)
      {
        src: "/logo-pet.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "AI 건강 상담",
        short_name: "AI 상담",
        description: "증상·품종·비용을 AI에게 즉시 묻기",
        url: "/#ai-chat",
        icons: [{ src: "/favicon-pet.svg", sizes: "64x64" }],
      },
      {
        name: "매칭 요청",
        short_name: "매칭",
        description: "펫시터 매칭 요청하기",
        url: "/partner",
        icons: [{ src: "/favicon-pet.svg", sizes: "64x64" }],
      },
      {
        name: "피드",
        short_name: "피드",
        description: "보호자 커뮤니티 피드",
        url: "/feed",
        icons: [{ src: "/favicon-pet.svg", sizes: "64x64" }],
      },
    ],
  };
}
