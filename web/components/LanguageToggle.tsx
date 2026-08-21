"use client";
import { useLang } from "../lib/i18n";
export default function LanguageToggle(){
  const {lang,setLang}=useLang();
  return <button onClick={()=>setLang(lang==="en"?"pt":"en")} className="border border-[var(--fg)] px-2.5 py-1.5 text-xs font-bold bg-[var(--bg)] hover:opacity-80 transition">{lang==="en"?"EN â†’ PT":"PT â†’ EN"}</button>
}

