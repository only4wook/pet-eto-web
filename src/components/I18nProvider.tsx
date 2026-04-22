"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ko from "../i18n/ko";
import en from "../i18n/en";

export type Locale = "ko" | "en";

const STORAGE_KEY = "peteto_locale";

const messages = { ko, en } as const;

type MessageTree = { [key: string]: string | MessageTree };

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function detectClientLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === "ko" || saved === "en") return saved;
  const browserLanguage = (window.navigator.language || "").toLowerCase();
  return browserLanguage.startsWith("ko") ? "ko" : "en";
}

function readByPath(tree: MessageTree, key: string): string | undefined {
  const value = key.split(".").reduce<string | MessageTree | undefined>((acc, segment) => {
    if (!acc || typeof acc === "string") return undefined;
    return acc[segment];
  }, tree);
  return typeof value === "string" ? value : undefined;
}

export default function I18nProvider({ children }: { children: React.ReactNode }) {
  // Hydration 안전: 서버·초기 클라이언트 렌더는 항상 "ko"로 통일
  // 마운트 후에만 localStorage/브라우저 언어 반영
  const [locale, setLocaleState] = useState<Locale>("ko");

  useEffect(() => {
    const detected = detectClientLocale();
    if (detected !== "ko") setLocaleState(detected);
    // detected === 'ko'면 이미 초기값과 동일 → 상태 갱신 불필요
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<I18nContextValue>(() => ({
    locale,
    setLocale: setLocaleState,
    t: (key: string) => readByPath(messages[locale] as MessageTree, key) ?? key,
  }), [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
