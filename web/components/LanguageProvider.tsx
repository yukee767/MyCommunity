"use client";
import { useState, useEffect } from "react";
import { LangContext, translations, Lang } from "../lib/i18n";

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  useEffect(() => {
    const saved = localStorage.getItem("mc_lang") as Lang | null;
    if (saved === "en" || saved === "pt") setLang(saved);
  }, []);
  const handle = (l: Lang) => {
    setLang(l);
    localStorage.setItem("mc_lang", l);
  };
  const t: any = translations[lang];
  return <LangContext.Provider value={{ lang, setLang: handle, t }}>{children}</LangContext.Provider>;
}
