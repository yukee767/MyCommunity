"use client";
import { useLang } from "../lib/i18n";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <button
      onClick={() => setLang(lang === "en" ? "pt" : "en")}
      className="ml-auto flex items-center gap-1.5 bg-[#1c2530] hover:bg-[#223041] border border-[#223041] text-[#cbd5e1] px-3 py-1.5 rounded-full text-xs font-semibold transition"
      title={lang === "en" ? "Mudar para PT-BR" : "Switch to English"}>
      <span className="text-[13px]">{lang === "en" ? "🇺🇸" : "🇧🇷"}</span>
      {lang === "en" ? "EN" : "PT"}
    </button>
  );
}
