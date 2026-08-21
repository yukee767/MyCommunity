"use client";
import { useEffect, useState } from "react";
import { Card } from "../components/Card";
import { api } from "../lib/api";
import { useLang } from "../lib/i18n";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function Home(){
  const {t}=useLang();
  const [s,setS]=useState<any>({online:false,guilds:0,uptime:"—",commands_total:0,marriages:0,giveaways_active:0});
  const [guilds,setGuilds]=useState<any[]>([]);
  const [cmds,setCmds]=useState<any[]>([]);
  const [logs,setLogs]=useState<any[]>([]);
  const [daily,setDaily]=useState<any[]>([]);
  const [topGuilds,setTopGuilds]=useState<any[]>([]);
  const [syncing,setSyncing]=useState(false);
  const [status,setStatus]=useState<any>(null);

  useEffect(()=>{
    api.stats().then(setS).catch(()=>{});
    api.guilds().then(setGuilds).catch(()=>{});
    api.commandsList().then(setCmds).catch(()=>{});
    api.daily().then(setDaily).catch(()=>{});
    api.topGuilds().then(setTopGuilds).catch(()=>{});
    api.botStatus().then(setStatus).catch(()=>{});
  },[]);
  // live logs polling
  useEffect(()=>{
    const id=setInterval(()=> api.logs(8).then(setLogs).catch(()=>{}), 2000);
    api.logs(8).then(setLogs).catch(()=>{});
    return ()=>clearInterval(id);
  },[]);

  const doSync=async()=>{
    setSyncing(true);
    try{ const r=await api.botSync(); alert(r.ok?`Synced ${r.synced} commands`:`Error: ${r.error}`);}catch(e:any){alert(String(e))}finally{setSyncing(false)}
  };

  return (
    <>
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-12 lg:col-span-7 border border-[var(--fg)] p-8 bg-[var(--bg)]">
          <div className="text-xs font-bold tracking-widest">MYCOMMUNITY / BOT</div>
          <h1 className="text-5xl font-black leading-none mt-3">{t.welcome} <span className="underline decoration-4 underline-offset-4">Yu</span>,</h1>
          <p className="text-base mt-3 max-w-xl">{t.welcomeSub} — {s.online ? t.online : t.offline} · {s.guilds} servers · {s.uptime}</p>
          <div className="mt-6 flex gap-2">
            <a href="/commands" className="bg-[var(--fg)] text-[var(--bg)] px-5 py-2.5 text-sm font-bold">Open commands</a>
            <a href="https://discord.com/api/oauth2/authorize?client_id=1540095512307433654&permissions=8&scope=bot%20applications.commands" target="_blank" className="border border-[var(--fg)] px-5 py-2.5 text-sm font-bold hover:opacity-80 transition">Invite bot</a>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card kicker="01 — MESSAGES" title={t.cards.custom.title} desc={t.cards.custom.desc} count={`${s.commands_total}`} action={t.cards.custom.action} href="/commands" />
        <Card kicker="02 — MODERATION" title={t.cards.mod.title} desc={`${t.cards.mod.desc}`} count={`${s.commands_total}`} action={t.cards.mod.action} href="/commands" />
        <Card kicker="03 — REPORTS" title={t.cards.reports.title} desc={t.cards.reports.desc} action={t.cards.reports.action} href="/marriages" />
        <Card kicker="04 — ROLES" title={t.cards.greetings.title} desc={t.cards.greetings.desc} action={t.cards.greetings.action} href="/commands" />
        <Card kicker="05 — UTILS" title={t.cards.prefix.title} desc={t.cards.prefix.desc} action={t.cards.prefix.action} href="/commands" />
        <Card kicker="06 — AI" title={t.cards.ai.title} desc={t.cards.ai.desc} action={t.cards.ai.action} href="/commands" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-[var(--bg)] border border-[var(--fg)] p-6">
          <div className="flex justify-between items-center">
            <h3 className="font-black text-sm">Logs ao vivo</h3>
            <span className="text-xs border border-[var(--fg)] px-2 py-1 animate-pulse">● LIVE</span>
          </div>
          <p className="text-xs mt-1 opacity-70">Últimos comandos (atualiza a cada 2s)</p>
          <div className="mt-4 flex flex-col gap-2 max-h-[220px] overflow-auto">
            {logs.length? logs.map((r:any)=>(
              <div key={r.id} className="flex justify-between border border-[var(--fg)]/20 px-3 py-2 text-xs">
                <span className="font-bold">/{r.command}</span>
                <span className="opacity-70">{r.user_id} · {r.used_at.slice(11,19)}</span>
              </div>
            )): <p className="text-sm">Aguardando comandos...</p>}
          </div>
        </div>
        <div className="bg-[var(--bg)] border border-[var(--fg)] p-6 flex flex-col">
          <h3 className="font-black text-sm">Controle do bot</h3>
          <p className="text-xs mt-1 opacity-70">Status: {status ? `${status.online ? "Online" : "Offline"} · ${status.latency}ms` : "—"} · {s.uptime}</p>
          <div className="mt-4 flex gap-2">
            <button onClick={doSync} disabled={syncing} className="bg-[var(--fg)] text-[var(--bg)] px-4 py-2 text-xs font-bold disabled:opacity-50">{syncing?"Syncing...":"Sync commands"}</button>
            <a href="http://127.0.0.1:8000/api/stats" target="_blank" className="border border-[var(--fg)] px-4 py-2 text-xs font-bold">API stats</a>
          </div>
          <div className="mt-4 text-xs leading-relaxed opacity-70">Reinicie o bot com <code>start.bat</code> para aplicar mudanças de cogs.</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <div className="bg-[var(--bg)] border border-[var(--fg)] p-6">
          <h3 className="font-black text-sm">Uso por dia (7d)</h3>
          <div className="h-[180px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daily.length? daily : [{day:"—", total:0}]}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--fg)" opacity={0.1} />
                <XAxis dataKey="day" tick={{fontSize:10}} stroke="var(--fg)" />
                <YAxis tick={{fontSize:10}} stroke="var(--fg)" />
                <Tooltip contentStyle={{background:"var(--bg)", border:"1px solid var(--fg)", fontSize:12}} />
                <Bar dataKey="total" fill="var(--fg)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-[var(--bg)] border border-[var(--fg)] p-6">
          <h3 className="font-black text-sm">Top servidores por uso</h3>
          <div className="mt-4 flex flex-col gap-2">
            {topGuilds.length? topGuilds.map((g:any)=>(
              <div key={g.guild_id} className="flex justify-between border border-[var(--fg)]/20 px-3 py-2 text-sm">
                <span>{g.guild_id}</span><span className="font-bold">{g.total}</span>
              </div>
            )): <p className="text-sm">Sem dados ainda.</p>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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

      <div className="mt-6 border border-[var(--fg)] p-6 bg-[var(--bg)]">
        <h3 className="font-black text-xs tracking-widest">{t.pages.stackTitle}</h3>
        <p className="text-xs mt-2 leading-relaxed">{t.pages.stackDesc}</p>
      </div>
    </>
  );
}
