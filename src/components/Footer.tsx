import Link from "next/link";

export default function Footer() {
  return (
    <footer style={{ background: "#1F2937", color: "#9CA3AF", padding: "36px 16px", marginTop: 40, fontSize: 12 }}>
      <div className="container-pet">
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 20 }}>
          <div>
            <p style={{ fontWeight: 800, color: "#F3F4F6", fontSize: 16, marginBottom: 6 }}>P.E.T 펫에토</p>
            <p style={{ lineHeight: 1.7 }}>
              Pet Ever Total — 반려동물 생애주기 맞춤형 O2O 플랫폼<br />
              한양대학교 창업동아리 펫에토 | 경기도 고양시
            </p>
          </div>
          <div style={{ display: "flex", gap: 24 }}>
            <div>
              <p style={{ fontWeight: 700, color: "#D1D5DB", marginBottom: 8 }}>서비스</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Link href="/wiki" style={{ color: "#9CA3AF" }}>펫-위키</Link>
                <Link href="/feed" style={{ color: "#9CA3AF" }}>피드</Link>
                <Link href="/community" style={{ color: "#9CA3AF" }}>커뮤니티</Link>
                <Link href="/guide" style={{ color: "#9CA3AF" }}>이용가이드</Link>
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "#D1D5DB", marginBottom: 8 }}>회사</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Link href="/about" style={{ color: "#9CA3AF" }}>팀 소개</Link>
                <Link href="/terms" style={{ color: "#9CA3AF" }}>이용약관</Link>
                <Link href="/privacy" style={{ color: "#9CA3AF" }}>개인정보처리방침</Link>
                <Link href="/partner" style={{ color: "#9CA3AF" }}>파트너 신청</Link>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #374151", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ margin: 0, color: "#6B7280" }}>&copy; 2026 P.E.T 펫에토. All rights reserved.</p>
          <p style={{ margin: 0, color: "#6B7280" }}>peteto2026@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}
