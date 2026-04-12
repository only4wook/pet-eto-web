// 보안 유틸리티

// 간단한 Rate Limiter (메모리 기반 — Vercel Serverless 한계 있음)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export function checkRateLimit(
  identifier: string,
  maxRequests: number = 30,
  windowMs: number = 60000 // 1분
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return true; // 허용
  }

  if (entry.count >= maxRequests) {
    return false; // 차단
  }

  entry.count++;
  return true; // 허용
}

// IP 추출 (Vercel 환경)
export function getClientIP(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const real = req.headers.get("x-real-ip");
  return forwarded?.split(",")[0]?.trim() || real || "unknown";
}

// 입력 값 살균 (XSS 방지)
export function sanitize(input: string): string {
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// 관리자 비밀번호 확인
export function isAdmin(password: string): boolean {
  const adminPw = process.env.ADMIN_PASSWORD || "peteto2026";
  return password === adminPw;
}
