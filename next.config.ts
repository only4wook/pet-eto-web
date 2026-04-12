import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
