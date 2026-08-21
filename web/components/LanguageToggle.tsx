"use client";
import { useLang } from "../lib/i18n";
export default function LanguageToggle() {
  const { lang, setLang } = useLang();
  return (
    <button onClick={() => setLang(lang === "en" ? "pt" : "en")}
      className="w-full border border-black bg-white text-black hover:bg-black hover:text-white px-3 py-1.5 text-xs font-bold transition">
      {lang === "en" ? "EN → PT" : "PT → EN"}
    </button>
  );
}
