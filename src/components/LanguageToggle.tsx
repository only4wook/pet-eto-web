"use client";

import { useI18n } from "./I18nProvider";

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      {!compact && <span style={{ fontSize: 11, color: "#9CA3AF" }}>{t("common.language")}</span>}
      <div style={{ display: "inline-flex", border: "1px solid #E5E7EB", borderRadius: 999, overflow: "hidden" }}>
        <button
          type="button"
          onClick={() => setLocale("ko")}
          aria-pressed={locale === "ko"}
          style={{
            border: "none",
            background: locale === "ko" ? "#1D1D1F" : "#fff",
            color: locale === "ko" ? "#fff" : "#6B7280",
            fontSize: 11,
            fontWeight: 700,
            padding: compact ? "6px 8px" : "4px 8px",
            cursor: "pointer",
          }}
        >
          KO
        </button>
        <button
          type="button"
          onClick={() => setLocale("en")}
          aria-pressed={locale === "en"}
          style={{
            border: "none",
            background: locale === "en" ? "#1D1D1F" : "#fff",
            color: locale === "en" ? "#fff" : "#6B7280",
            fontSize: 11,
            fontWeight: 700,
            padding: compact ? "6px 8px" : "4px 8px",
            cursor: "pointer",
          }}
        >
          EN
        </button>
      </div>
    </div>
  );
}
