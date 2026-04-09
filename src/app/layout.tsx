import type { Metadata, Viewport } from "next";
import "./globals.css";
import AuthProvider from "../components/AuthProvider";

export const metadata: Metadata = {
  title: "P.E.T 펫에토 - 반려동물 커뮤니티",
  description: "반려동물과 함께하는 모든 순간. 질문, 정보 공유, 전문가 Q&A까지.",
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
      </body>
    </html>
  );
}
