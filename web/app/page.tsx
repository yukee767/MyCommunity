import { Card } from "../components/Card";
import { api } from "../lib/api";

export const dynamic = "force-dynamic";

export default async function Home() {
  let stats: any = { online: false, guilds: 0, uptime: "—", commands_total: 0, marriages: 0, giveaways_active: 0 };
  try { stats = await api.stats(); } catch {}
  return (
    <>
      <div className="mb-7">
        <h1 className="text-[42px] font-extrabold tracking-tight leading-none">Welcome <span className="text-sky-400">Yu</span>,</h1>
        <p className="text-[#8a96a8] mt-2.5 text-[16px]">find commonly used dashboard pages below.</p>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {[
          ["Status", stats.online ? "● Online" : "● Offline"],
          ["Servidores", stats.guilds],
          ["Uptime", stats.uptime],
          ["Comandos", stats.commands_total],
          ["Casamentos", stats.marriages],
          ["Sorteios", stats.giveaways_active],
        ].map(([k,v])=>(
          <div key={k as string} className="bg-[#1a212b] border border-[#232f3e] px-3.5 py-2.5 rounded-full text-[13px] flex gap-2 items-center">
            <span className="text-[#8a96a8]">{k}</span><b className={String(v).includes("Online") ? "text-emerald-400" : String(v).includes("Offline") ? "text-red-400" : ""}>{v as any}</b>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[18px]">
        <Card icon="💬" title="Custom messages" desc="Create fully customized messages called templates and pack them with your very own embeds, buttons and select menus. Use /embed e /say." action="Create template" href="/commands" />
        <Card icon="🗂" title="Moderation cases" desc={`View and edit all moderation cases using the dashboard. ${stats.commands_total} casos registrados.`} action="View cases" href="/commands" />
        <Card icon="🏳" title="User reports" desc="Allow users to report others and fully customize how to handle them. Integra com /kiss, /married." action="Configure reports" href="/marriages" />
        <Card icon="👋" title="Role greetings" desc="Welcome users to their new role by using MyCommunity's role assignment messages. /addrole e /addroleall." action="Show role messages" href="/commands" />
        <Card icon="✎" title="Prefix & calculator" desc="Quick actions and utilities. /calculator e /ping — tudo logado no SQLite local." action="Open utilities" href="/commands" />
        <Card icon="⚙" title="AI Moderation" desc="Use artificial intelligence to assist you in moderating your community. /gpt texto + /translation." action="Configure AI" href="/commands" />
      </div>
    </>
  );
}
