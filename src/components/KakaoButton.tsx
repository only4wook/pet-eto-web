"use client";

// 카카오톡 채널 연동 플로팅 버튼
// 채널 URL을 변경하려면 KAKAO_CHANNEL_URL만 수정하세요
const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_peteto";
// ↑ 카카오톡 채널 개설 후 실제 URL로 교체 필요
// 개설 방법: https://business.kakao.com → 카카오톡 채널 → 채널 만들기

export default function KakaoButton() {
  return (
    <>
      {/* 플로팅 카카오톡 버튼 (화면 우측 하단 고정) */}
      <a
        href={KAKAO_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed",
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "#FEE500",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          zIndex: 9999,
          textDecoration: "none",
          transition: "transform 0.2s",
        }}
        title="카카오톡으로 문의하기"
      >
        {/* 카카오톡 아이콘 (SVG) */}
        <svg width="28" height="28" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
          <path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-2.1 7.9-7.7 28.5-8.8 33-.5 2 .7 2 1.5 1.4 1-.7 39.4-26.8 43.2-29.5 6.3.9 12.8 1.3 19.3 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#3C1E1E"/>
        </svg>
      </a>
    </>
  );
}

// 인라인 카카오톡 연락 버튼 (페이지 내 삽입용)
export function KakaoInlineButton({ text = "카카오톡으로 문의하기" }: { text?: string }) {
  return (
    <a
      href={KAKAO_CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: "#FEE500",
        color: "#3C1E1E",
        padding: "10px 20px",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 700,
        textDecoration: "none",
      }}
    >
      <svg width="20" height="20" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
        <path d="M128 36C70.6 36 24 72.2 24 116.8c0 29 19.5 54.4 48.8 68.8-2.1 7.9-7.7 28.5-8.8 33-.5 2 .7 2 1.5 1.4 1-.7 39.4-26.8 43.2-29.5 6.3.9 12.8 1.3 19.3 1.3 57.4 0 104-36.2 104-80.8S185.4 36 128 36z" fill="#3C1E1E"/>
      </svg>
      {text}
    </a>
  );
}

export { KAKAO_CHANNEL_URL };
