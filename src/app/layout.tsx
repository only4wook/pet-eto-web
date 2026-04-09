import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";
import KakaoButton from "../components/KakaoButton";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "P.E.T 펫에토 - 반려동물 커뮤니티",
  description: "갑자기 아플 때, 급하게 출장갈 때. 반려동물 긴급 돌봄부터 커뮤니티, 건강 체크까지.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <AuthProvider>{children}</AuthProvider>
        <KakaoButton />
        <Analytics />
      </body>
    </html>
  );
}
