"use client";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { useLang } from "../lib/i18n";

export default function Home() {
  const { t } = useLang();
  const [stats, setStats] = useState<any>({ online: false, guilds: 0, uptime: "—", commands_total: 0, marriages: 0, giveaways_active: 0 });
  useEffect(() => { api.stats().then(setStats).catch(()=>{}); }, []);

  return (
    <>
      {/* Developer Portal - Bot header */}
      <div className="mb-6">
        <h1 className="text-[24px] font-bold">Bot</h1>
        <p className="text-[#8a96a8] mt-1.5 text-sm leading-relaxed">
          Bring your app to life on Discord with a Bot user. Be a part of chat in your users' servers and interact with them directly.
        </p>
        <a href="#" className="text-sky-400 text-sm hover:underline mt-2 inline-block">Learn more about bot users</a>
        <div className="mt-4 bg-[#0f1e14] border border-[#1e8a49] text-[#7ee0a0] text-sm px-4 py-3 rounded-lg">
          A new token was generated! Be sure to copy it as it will not be shown to you again.
        </div>
      </div>

      {/* Icon / Banner / Username - Dev Portal style */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 mb-6">
        <div className="bg-[#1a212b] border border-[#232f3e] rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-3">Icon</h3>
          <div className="flex gap-4">
            <div className="w-28 h-28 rounded-xl bg-[#1db954] grid place-items-center shrink-0">
              <span className="text-4xl">◈</span>
            </div>
            <div className="text-xs text-[#8a96a8] leading-relaxed">
              <div>Dimensions: 1024×1024</div>
              <div>Aspect Ratio: 1:1</div>
              <div>File Types: PNG, GIF, JPG, WEBP</div>
              <div>Max Size: 10MB</div>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-3">Username</h3>
            <div className="flex bg-[#111820] border border-[#232f3e] rounded-lg overflow-hidden">
              <span className="flex-1 px-3 py-2.5 text-sm">MyCommunity</span>
              <span className="px-3 py-2.5 text-sm text-[#8a96a8] border-l border-[#232f3e] bg-[#0e1217]">#9347</span>
            </div>
          </div>
        </div>

        <div className="bg-[#1a212b] border border-[#232f3e] rounded-xl p-5">
          <h3 className="font-semibold text-sm mb-3">Banner</h3>
          <div className="h-[168px] border border-dashed border-[#2a3a4d] rounded-xl bg-[#111820] grid place-items-center text-center">
            <div>
              <div className="text-xl">⤴</div>
              <div className="text-sm text-[#8a96a8] mt-1">Drag or click to upload</div>
            </div>
          </div>
          <div className="text-xs text-[#5b6b7f] mt-3 leading-relaxed">
            Dimensions: 680×240 · Aspect Ratio: 17:6 · File Types: PNG, GIF, JPG, WEBP · Max Size: 10MB
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              [t.stats.status, stats.online ? `● ${t.online}` : `● ${t.offline}`],
              [t.stats.servers, stats.guilds],
              [t.stats.uptime, stats.uptime],
            ].map(([k,v])=>(
              <span key={k as string} className="bg-[#0e1217] border border-[#232f3e] px-3 py-1.5 rounded-full text-xs flex gap-1.5 items-center">
                <span className="text-[#8a96a8]">{k}</span><b className={String(v).includes(t.online) ? "text-emerald-400" : ""}>{v as any}</b>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sapphire - Welcome + cards */}
      <div className="mb-5">
        <h2 className="text-[28px] font-extrabold tracking-tight">Welcome <span className="text-sky-400">Yu</span>,</h2>
        <p className="text-[#8a96a8] mt-1 text-sm">{t.welcomeSub}</p>
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
