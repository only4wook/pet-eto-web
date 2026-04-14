import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import KakaoButton from "../components/KakaoButton";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: {
    default: "P.E.T 펫에토 - 반려동물 긴급케어 플랫폼",
    template: "%s | P.E.T 펫에토",
  },
  description: "반려동물 긴급 돌봄 매칭, AI 건강 분석, 품종별 위키, 커뮤니티까지. 갑자기 아플 때, 급하게 출장갈 때, 10분 안에 검증된 펫시터를 연결해드립니다.",
  keywords: ["반려동물", "펫시터", "강아지", "고양이", "긴급돌봄", "동물병원", "펫에토", "PET", "반려동물케어", "펫위키", "AI건강분석", "슬개골", "중성화", "예방접종"],
  authors: [{ name: "펫에토 (P.E.T)" }],
  creator: "펫에토",
  publisher: "펫에토",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://pet-eto.vercel.app",
    siteName: "P.E.T 펫에토",
    title: "P.E.T 펫에토 - 반려동물 긴급케어 플랫폼",
    description: "반려동물 긴급 돌봄 매칭, AI 건강 분석, 품종별 위키. 10분 안에 검증된 펫시터를 연결해드립니다.",
    images: [{
      url: "https://pet-eto.vercel.app/og-image.svg",
      width: 1200,
      height: 630,
      alt: "P.E.T 펫에토 - 반려동물 긴급케어 플랫폼",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "P.E.T 펫에토 - 반려동물 긴급케어 플랫폼",
    description: "반려동물 긴급 돌봄, AI 건강 분석, 품종별 위키",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "", // Google Search Console 등록 후 추가
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="canonical" href="https://pet-eto.vercel.app" />
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AuthProvider>{children}</AuthProvider>
        {/* KakaoButton 플로팅 제거 — 헤더에 카톡 아이콘으로 이동 */}
        <Analytics />
      </body>
    </html>
  );
}
