"use client";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { useLang } from "../lib/i18n";

export default function Home() {
  const { t } = useLang();
  const [s, setS] = useState<any>({ online: false, guilds: 0, uptime: "—", commands_total: 0, marriages: 0, giveaways_active: 0 });
  useEffect(() => { api.stats().then(setS).catch(()=>{}); }, []);
  return (
    <>
      <div className="border border-black p-6 mb-6">
        <h1 className="text-3xl font-black tracking-tight">{t.welcome} — MyCommunity</h1>
        <p className="text-sm mt-2">{t.welcomeSub}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="border border-black px-3 py-1 text-xs font-bold">{t.stats.status}: {s.online ? t.online : t.offline}</span>
          <span className="border border-black px-3 py-1 text-xs font-bold">{t.stats.servers}: {s.guilds}</span>
          <span className="border border-black px-3 py-1 text-xs font-bold">{t.stats.uptime}: {s.uptime}</span>
          <span className="bg-black text-white px-3 py-1 text-xs font-bold">{t.stats.commands}: {s.commands_total}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title={t.cards.custom.title} desc={t.cards.custom.desc} action={t.cards.custom.action} href="/commands" />
        <Card title={t.cards.mod.title} desc={`${t.cards.mod.desc} ${s.commands_total} ${t.cards.mod.suffix}`} action={t.cards.mod.action} href="/commands" />
        <Card title={t.cards.greetings.title} desc={t.cards.greetings.desc} action={t.cards.greetings.action} href="/commands" />
        <Card title={t.cards.ai.title} desc={t.cards.ai.desc} action={t.cards.ai.action} href="/commands" />
      </div>
    </>
  );
}
