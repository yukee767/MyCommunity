"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useLang } from "../../lib/i18n";
export default function Marriages(){
  const {t}=useLang(); const [rows,setRows]=useState<any[]>([]);
  useEffect(()=>{api.marriages().then(setRows).catch(()=>{});},[]);
  return (<><h1 className="text-2xl font-black mb-1">{t.pages.marriagesTitle}</h1><p className="text-sm mb-6">{t.pages.marriagesSub}</p><div className="border border-black p-4">{!rows.length?<p className="text-sm">{t.pages.noMarriages}</p>:<table className="w-full text-sm"><thead><tr className="border-b border-black"><th className="text-left py-2 text-xs">{t.pages.spouse1}</th><th className="text-left py-2 text-xs">{t.pages.spouse2}</th><th className="text-left py-2 text-xs">{t.pages.date}</th></tr></thead><tbody>{rows.map((r:any)=><tr key={`${r.guild_id}-${r.user1_id}-${r.user2_id}`} className="border-b border-black/10"><td className="py-2">{r.user1_id}</td><td className="py-2">{r.user2_id}</td><td className="py-2">{r.married_at}</td></tr>)}</tbody></table>}</div></>);
}
