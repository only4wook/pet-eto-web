import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import KakaoButton from "../components/KakaoButton";
import BottomTabBar from "../components/BottomTabBar";
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
    url: "https://peteto.kr",
    siteName: "P.E.T 펫에토",
    title: "P.E.T 펫에토 - 반려동물 긴급케어 플랫폼",
    description: "반려동물 긴급 돌봄 매칭, AI 건강 분석, 품종별 위키. 10분 안에 검증된 펫시터를 연결해드립니다.",
    images: [{
      url: "https://peteto.kr/og-image.svg",
      width: 1200,
      height: 630,
      alt: "P.E.T 펫에토 - 반려동물 긴급케어 플랫폼",
    }],
  },
  manifest: "/manifest.webmanifest",
  applicationName: "P.E.T 펫에토",
  appleWebApp: {
    capable: true,
    title: "펫에토",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  icons: {
    icon: [
      { url: "/favicon-pet.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/favicon-pet.svg", type: "image/svg+xml" },
      { url: "/logo-pet.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
    shortcut: ["/favicon-pet.svg"],
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
  // iOS 노치/다이나믹 아일랜드·안드로이드 제스처 바까지 safe area 확보
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#1D1D1F" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="canonical" href="https://pet-eto.vercel.app" />
        <link rel="stylesheet" as="style" crossOrigin="anonymous" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css" />
      </head>
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        {/* Google Analytics — NEXT_PUBLIC_GA_ID 환경변수가 있을 때만 로드 (플레이스홀더 오염 방지) */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname,
                });`}
            </Script>
          </>
        )}
        <AuthProvider>{children}</AuthProvider>
        <BottomTabBar />
        <Analytics />
      </body>
    </html>
  );
}
