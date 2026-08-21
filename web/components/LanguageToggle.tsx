"use client";
import { useLang } from "../lib/i18n";
export default function LanguageToggle(){
  const {lang,setLang}=useLang();
  return <button onClick={()=>setLang(lang==="en"?"pt":"en")} className="border border-black px-2.5 py-1.5 text-xs font-bold bg-white hover:bg-black hover:text-white transition">{lang==="en"?"EN → PT":"PT → EN"}</button>
}
