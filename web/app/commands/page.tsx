"use client";
import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { useLang } from "../../lib/i18n";

export default function Commands() {
  const { t } = useLang();
  const [usage, setUsage] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  useEffect(() => { api.usage().then(setUsage).catch(()=>{}); api.logs(100).then(setLogs).catch(()=>{}); }, []);
  return (
    <>
      <div className="mb-6">
        <h1 className="text-[32px] font-extrabold">{t.pages.commandsTitle} <span className="text-sky-400">▭</span></h1>
        <p className="text-[#8a96a8] mt-1">{t.pages.commandsSub}</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-[#1a212b] border border-[#232f3e] rounded-2xl p-5">
          <h3 className="font-bold mb-3">{t.pages.usage}</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-[#8a96a8] text-xs uppercase"><th className="text-left py-2">{t.pages.command}</th><th className="text-left py-2">{t.pages.times}</th></tr></thead>
            <tbody>{usage.length? usage.map((r:any)=><tr key={r.command} className="border-t border-[#1e2a36]"><td className="py-2">/{r.command}</td><td className="py-2">{r.total}</td></tr>): <tr><td colSpan={2} className="py-4 text-[#8a96a8]">{t.pages.noUsage}</td></tr>}</tbody>
          </table>
        </div>
        <div className="bg-[#1a212b] border border-[#232f3e] rounded-2xl p-5 overflow-auto">
          <h3 className="font-bold mb-3">{t.pages.recent}</h3>
          <table className="w-full text-sm">
            <thead><tr className="text-[#8a96a8] text-xs uppercase"><th className="text-left py-2">{t.pages.command}</th><th className="text-left py-2">{t.pages.user}</th><th className="text-left py-2">{t.pages.date}</th></tr></thead>
            <tbody>{logs.length? logs.map((r:any)=><tr key={r.id} className="border-t border-[#1e2a36]"><td className="py-2">/{r.command}</td><td className="py-2">{r.user_id}</td><td className="py-2 text-[#8a96a8]">{r.used_at}</td></tr>): <tr><td colSpan={3} className="py-4 text-[#8a96a8]">{t.pages.noLogs}</td></tr>}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
