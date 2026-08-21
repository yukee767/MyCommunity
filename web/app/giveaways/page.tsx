"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useLang } from "../../lib/i18n";
export default function Giveaways(){
  const {t}=useLang(); const [rows,setRows]=useState<any[]>([]);
  useEffect(()=>{api.giveaways().then(setRows).catch(()=>{});},[]);
  return (<><h1 className="text-3xl font-black">{t.pages.giveawaysTitle}</h1><p className="text-sm mt-1 mb-6">{t.pages.giveawaysSub}</p><div className="bg-white border border-black p-6">{!rows.length?<p className="text-sm">{t.pages.noGiveaways}</p>:<table className="w-full text-sm"><thead><tr className="border-b-2 border-black"><th className="text-left py-2 text-xs">{t.pages.prize}</th><th className="text-left py-2 text-xs">{t.pages.winners}</th><th className="text-left py-2 text-xs">{t.pages.participants}</th><th className="text-left py-2 text-xs">{t.pages.ends}</th><th className="text-left py-2 text-xs">{t.pages.status}</th></tr></thead><tbody>{rows.map((r:any)=>{let p=0;try{p=JSON.parse(r.participants).length}catch{};return <tr key={r.message_id} className="border-b border-black/10"><td className="py-2">{r.prize}</td><td className="py-2">{r.winners}</td><td className="py-2">{p}</td><td className="py-2">{r.ends_at}</td><td className="py-2">{r.status}</td></tr>})}</tbody></table>}</div></>);
}
