"use client";
import Link from "next/link";
import { useI18n } from "./I18nProvider";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer style={{ background: "#1F2937", color: "#9CA3AF", padding: "36px 16px", marginTop: 40, fontSize: 12 }}>
      <div className="container-pet">
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 20 }}>
          <div>
            <p style={{ fontWeight: 800, color: "#F3F4F6", fontSize: 16, marginBottom: 6 }}>P.E.T 펫에토</p>
            <p style={{ lineHeight: 1.7 }}>
              {t("footer.brandDesc")}<br />
              {t("footer.companyInfo")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
            <div>
              <p style={{ fontWeight: 700, color: "#D1D5DB", marginBottom: 8 }}>{t("footer.service")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Link href="/wiki" style={{ color: "#9CA3AF" }}>{t("footer.petWiki")}</Link>
                <Link href="/feed" style={{ color: "#9CA3AF" }}>{t("footer.feed")}</Link>
                <Link href="/community" style={{ color: "#9CA3AF" }}>{t("footer.community")}</Link>
                <Link href="/guide" style={{ color: "#9CA3AF" }}>{t("footer.guide")}</Link>
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "#D1D5DB", marginBottom: 8 }}>{t("footer.partner")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Link href="/partner/transport" style={{ color: "#9CA3AF" }}>{t("footer.transport")}</Link>
                <Link href="/partner/hotel" style={{ color: "#9CA3AF" }}>{t("footer.hotel")}</Link>
                <Link href="/partner/sitter" style={{ color: "#9CA3AF" }}>{t("footer.sitter")}</Link>
                <Link href="/for-vets" style={{ color: "#9CA3AF" }}>{t("footer.vets")}</Link>
                <Link href="/experts" style={{ color: "#9CA3AF" }}>{t("footer.experts")}</Link>
              </div>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: "#D1D5DB", marginBottom: 8 }}>{t("footer.company")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <Link href="/about" style={{ color: "#9CA3AF" }}>{t("footer.about")}</Link>
                <Link href="/ir" style={{ color: "#9CA3AF" }}>{t("footer.ir")}</Link>
                <Link href="/pricing" style={{ color: "#9CA3AF" }}>{t("footer.pricing")}</Link>
                <Link href="/verification" style={{ color: "#9CA3AF" }}>{t("footer.verification")}</Link>
                <Link href="/terms" style={{ color: "#9CA3AF" }}>{t("footer.terms")}</Link>
                <Link href="/privacy" style={{ color: "#9CA3AF" }}>{t("footer.privacy")}</Link>
              </div>
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #374151", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
          <p style={{ margin: 0, color: "#6B7280" }}>&copy; 2026 P.E.T 펫에토. {t("footer.rights")}</p>
          <p style={{ margin: 0, color: "#6B7280" }}>dnlsdpa123@nate.com</p>
        </div>
      </div>
    </footer>
  );
}
