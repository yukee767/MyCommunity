"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useLang } from "../../lib/i18n";
export default function Commands(){
  const {t}=useLang(); const [u,setU]=useState<any[]>([]); const [l,setL]=useState<any[]>([]);
  useEffect(()=>{api.usage().then(setU).catch(()=>{}); api.logs(100).then(setL).catch(()=>{});},[]);
  return (<>
    <h1 className="text-3xl font-black">{t.pages.commandsTitle}</h1><p className="text-sm mt-1 mb-6">{t.pages.commandsSub}</p>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="bg-white border border-black p-6"><h3 className="font-black text-sm mb-3">{t.pages.usage}</h3><table className="w-full text-sm"><thead><tr className="border-b-2 border-black"><th className="text-left py-2 text-xs">{t.pages.command}</th><th className="text-left py-2 text-xs">{t.pages.times}</th></tr></thead><tbody>{u.length? u.map((r:any)=><tr key={r.command} className="border-b border-black/10"><td className="py-2">/{r.command}</td><td className="py-2">{r.total}</td></tr>):<tr><td colSpan={2} className="py-6 text-sm">{t.pages.noUsage}</td></tr>}</tbody></table></div>
      <div className="bg-white border border-black p-6"><h3 className="font-black text-sm mb-3">{t.pages.recent}</h3><table className="w-full text-sm"><thead><tr className="border-b-2 border-black"><th className="text-left py-2 text-xs">{t.pages.command}</th><th className="text-left py-2 text-xs">{t.pages.user}</th><th className="text-left py-2 text-xs">{t.pages.date}</th></tr></thead><tbody>{l.length? l.map((r:any)=><tr key={r.id} className="border-b border-black/10"><td className="py-2">/{r.command}</td><td className="py-2">{r.user_id}</td><td className="py-2">{r.used_at}</td></tr>):<tr><td colSpan={3} className="py-6 text-sm">{t.pages.noLogs}</td></tr>}</tbody></table></div>
    </div>
  </>);
}
