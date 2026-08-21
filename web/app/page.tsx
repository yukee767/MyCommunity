"use client";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { useLang } from "../lib/i18n";

export default function Home(){
  const {t}=useLang();
  const [s,setS]=useState<any>({online:false,guilds:0,uptime:"—",commands_total:0,marriages:0,giveaways_active:0});
  const [guilds,setGuilds]=useState<any[]>([]);
  const [cmds,setCmds]=useState<any[]>([]);
  useEffect(()=>{api.stats().then(setS).catch(()=>{}); api.guilds().then(setGuilds).catch(()=>{}); api.commandsList().then(setCmds).catch(()=>{});},[]);
  return (
    <>
      <div className="grid grid-cols-12 gap-4 mb-8">
        <div className="col-span-12 lg:col-span-7 border border-[var(--fg)] p-8 bg-[var(--bg)]">
          <div className="text-xs font-bold tracking-widest">MYCOMMUNITY / BOT</div>
          <h1 className="text-5xl font-black leading-none mt-3">{t.welcome} <span className="underline decoration-4 underline-offset-4">Yu</span>,</h1>
          <p className="text-base mt-3 max-w-xl">{t.welcomeSub} — {s.online ? t.online : t.offline} · {s.guilds} servers · {s.uptime}</p>
          <div className="mt-6 flex gap-2">
            <a href="/commands" className="bg-[var(--fg)] text-[var(--bg)] px-5 py-2.5 text-sm font-bold">Open commands</a>
            <a href="https://discord.com/api/oauth2/authorize?client_id=1540095512307433654&permissions=8&scope=bot%20applications.commands" target="_blank" className="border border-[var(--fg)] px-5 py-2.5 text-sm font-bold hover:opacity-80 transition">Invite bot</a>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-[var(--fg)] text-[var(--bg)] p-6 border border-[var(--fg)]">
            <div className="text-xs tracking-widest font-bold">SERVERS</div>
            <div className="text-5xl font-black mt-2">{s.guilds}</div>
            <div className="text-xs mt-2 opacity-70">Connected guilds</div>
          </div>
          <div className="bg-[var(--bg)] border border-[var(--fg)] p-6">
            <div className="text-xs tracking-widest font-bold">COMMANDS</div>
            <div className="text-5xl font-black mt-2">{s.commands_total}</div>
            <div className="text-xs mt-2">Total executions</div>
          </div>
          <div className="bg-[var(--bg)] border border-[var(--fg)] p-6">
            <div className="text-xs tracking-widest font-bold">MARRIAGES</div>
            <div className="text-5xl font-black mt-2">{s.marriages}</div>
            <div className="text-xs mt-2">Active couples</div>
          </div>
          <div className="bg-[var(--bg)] border border-[var(--fg)] p-6">
            <div className="text-xs tracking-widest font-bold">GIVEAWAYS</div>
            <div className="text-5xl font-black mt-2">{s.giveaways_active}</div>
            <div className="text-xs mt-2">Active</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card kicker="01 — MESSAGES" title={t.cards.custom.title} desc={t.cards.custom.desc} count={`${s.commands_total}`} action={t.cards.custom.action} href="/commands" />
        <Card kicker="02 — MODERATION" title={t.cards.mod.title} desc={`${t.cards.mod.desc}`} count={`${s.commands_total}`} action={t.cards.mod.action} href="/commands" />
        <Card kicker="03 — ROLES" title={t.cards.greetings.title} desc={t.cards.greetings.desc} action={t.cards.greetings.action} href="/commands" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <div className="bg-[var(--bg)] border border-[var(--fg)] p-6">
          <h3 className="font-black text-sm">{t.pages.serversTitle} — {guilds.length}</h3>
          <p className="text-xs mt-1 opacity-70">{t.pages.serversSub}</p>
          <div className="mt-4 flex flex-col gap-2">
            {guilds.length ? guilds.map((g:any)=>(
              <div key={g.id} className="flex justify-between border border-[var(--fg)] px-3 py-2 text-sm">
                <span className="font-bold truncate">{g.name}</span>
                <span className="text-xs shrink-0 ml-2">{g.member_count} {t.pages.members}</span>
              </div>
            )) : <p className="text-sm">{t.pages.noServers}</p>}
          </div>
        </div>
        <div className="bg-[var(--bg)] border border-[var(--fg)] p-6">
          <h3 className="font-black text-sm">{t.pages.allCommandsTitle} — {cmds.length}</h3>
          <p className="text-xs mt-1 opacity-70">{t.pages.allCommandsSub}</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {cmds.map((c:any)=><div key={c.name} className="border border-[var(--fg)] px-2.5 py-2 text-xs font-bold">/{c.name}</div>)}
          </div>
        </div>
      </div>

      <div className="mt-4 border border-[var(--fg)] p-6 bg-[var(--bg)]">
        <h3 className="font-black text-xs tracking-widest">{t.pages.stackTitle}</h3>
        <p className="text-xs mt-2 leading-relaxed">{t.pages.stackDesc}</p>
      </div>
    </>
  );
}

