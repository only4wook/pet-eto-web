import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 개발 모드에서 좌하단 Next.js DevTools "N" 배지 숨김
  // (대욱님 피드백: 스크린샷/QA 시 UI 가림)
  devIndicators: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // XSS 방지
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // HTTPS 강제
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // 외부 리소스 제한
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 권한 정책
          { key: "Permissions-Policy", value: "camera=(self), microphone=(), geolocation=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
