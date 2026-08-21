"use client";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { useLang } from "../lib/i18n";

export default function Home() {
  const { t, lang } = useLang();
  const [stats, setStats] = useState<any>({ online: false, guilds: 0, uptime: "—", commands_total: 0, marriages: 0, giveaways_active: 0 });
  useEffect(() => { api.stats().then(setStats).catch(()=>{}); }, []);

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[42px] font-extrabold tracking-tight leading-none">{t.welcome} <span className="text-sky-400">Yu</span>,</h1>
        <p className="text-[#8a96a8] mt-2.5 text-[16px]">{t.welcomeSub}</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {[
          [t.stats.status, stats.online ? `● ${t.online}` : `● ${t.offline}`],
          [t.stats.servers, stats.guilds],
          [t.stats.uptime, stats.uptime],
          [t.stats.commands, stats.commands_total],
          [t.stats.marriages, stats.marriages],
          [t.stats.giveaways, stats.giveaways_active],
        ].map(([k,v])=>(
          <div key={k as string} className="bg-[#1a212b] border border-[#232f3e] px-3.5 py-2.5 rounded-full text-[13px] flex gap-2 items-center">
            <span className="text-[#8a96a8]">{k}</span><b className={String(v).includes(t.online) ? "text-emerald-400" : String(v).includes(t.offline) ? "text-red-400" : ""}>{v as any}</b>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
        <Card icon="💬" title={t.cards.custom.title} desc={t.cards.custom.desc} action={t.cards.custom.action} href="/commands" />
        <Card icon="🗂" title={t.cards.mod.title} desc={`${t.cards.mod.desc} ${stats.commands_total} ${t.cards.mod.suffix}`} action={t.cards.mod.action} href="/commands" />
        <Card icon="🏳" title={t.cards.reports.title} desc={t.cards.reports.desc} action={t.cards.reports.action} href="/marriages" />
        <Card icon="👋" title={t.cards.greetings.title} desc={t.cards.greetings.desc} action={t.cards.greetings.action} href="/commands" />
        <Card icon="✎" title={t.cards.prefix.title} desc={t.cards.prefix.desc} action={t.cards.prefix.action} href="/commands" />
        <Card icon="⚙" title={t.cards.ai.title} desc={t.cards.ai.desc} action={t.cards.ai.action} href="/commands" />
      </div>
    </>
  );
}
