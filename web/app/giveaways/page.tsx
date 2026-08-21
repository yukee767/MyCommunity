"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useLang } from "../../lib/i18n";
export default function Giveaways() {
  const { t } = useLang();
  const [rows, setRows] = useState<any[]>([]);
  useEffect(()=>{ api.giveaways().then(setRows).catch(()=>{}); },[]);
  return (
    <>
      <div className="mb-6">
        <h1 className="text-[32px] font-extrabold">{t.pages.giveawaysTitle} <span className="text-sky-400">🎉</span></h1>
        <p className="text-[#8a96a8] mt-1">{t.pages.giveawaysSub}</p>
      </div>
      <div className="bg-[#1a212b] border border-[#232f3e] rounded-2xl p-5">
        {!rows.length ? <p className="text-[#8a96a8]">{t.pages.noGiveaways}</p> :
          <table className="w-full text-sm">
            <thead><tr className="text-[#8a96a8] text-xs uppercase"><th className="text-left py-2">{t.pages.prize}</th><th className="text-left py-2">{t.pages.winners}</th><th className="text-left py-2">{t.pages.participants}</th><th className="text-left py-2">{t.pages.ends}</th><th className="text-left py-2">{t.pages.status}</th></tr></thead>
            <tbody>{rows.map((r:any)=> {
              let p=0; try{ p=JSON.parse(r.participants).length}catch{}
              return <tr key={r.message_id} className="border-t border-[#1e2a36]"><td className="py-2">{r.prize}</td><td className="py-2">{r.winners}</td><td className="py-2">{p}</td><td className="py-2 text-[#8a96a8]">{r.ends_at}</td><td className="py-2">{r.status}</td></tr>
            })}</tbody>
          </table>}
      </div>
    </>
  );
}
