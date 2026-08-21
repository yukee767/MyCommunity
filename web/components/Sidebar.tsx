"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "../lib/i18n";
import LanguageToggle from "./LanguageToggle";

const Item = ({ href, icon, label, badge, active }: any) => (
  <Link href={href}
    className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition ${active ? "bg-[#16202c] text-[#e6edf5]" : "text-[#8a96a8] hover:bg-[#16202c] hover:text-[#d6e1ef]"}`}>
    <span className="w-4 h-4 grid place-items-center text-[13px]">{icon}</span>
    {label}
    {badge && <span className="ml-auto bg-[#c23a3a] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
  </Link>
);

export default function Sidebar() {
  const p = usePathname();
  const { t } = useLang();
  return (
    <aside className="w-[250px] shrink-0 bg-[#111820] border-r border-[#1c252f] sticky top-0 h-screen overflow-y-auto p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-2.5 px-1 py-1 mb-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 grid place-items-center font-bold text-sm">MC</div>
        <span className="font-semibold text-sm">MyCommunity</span>
        <LanguageToggle />
      </div>
      <div className="flex items-center gap-2">
        <Link href="/" className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[13px] font-medium border ${p==="/" ? "bg-[#1a2532] border-[#2a3d52] text-[#eaf2ff]" : "bg-[#1c2530] border-[#223041] text-[#cbd5e1]"}`}>⌂ Home</Link>
        <button onClick={()=>location.reload()} className="w-8 h-8 grid place-items-center rounded-full bg-[#1c2530] border border-[#223041] text-[#8a96a8]">↻</button>
      </div>
      <nav className="flex flex-col gap-0.5 mt-3">
        <Item href="/" icon="⚙" label={t.sidebar.general} badge="35" />
        <Item href="/commands" icon="▭" label={t.sidebar.commands} active={p==="/commands"} />
        <Item href="/commands" icon="💬" label={t.sidebar.messages} />
        <Item href="/" icon="✦" label={t.sidebar.branding} />
        <div className="mt-3 mb-1 px-2 text-[10px] tracking-widest font-semibold text-[#5b6b7f]">MODULES</div>
        <Item href="/commands" icon="🛡" label={t.sidebar.autoMod} />
        <Item href="/" icon="🛡" label={t.sidebar.moderation} />
        <Item href="/giveaways" icon="🔔" label={t.sidebar.social} />
        <Item href="/commands" icon="👤+" label={t.sidebar.joinRoles} />
        <Item href="/commands" icon="😊" label={t.sidebar.reaction} />
        <Item href="/" icon="👋" label={t.sidebar.welcomeMsg} />
        <Item href="/commands" icon="🔗" label={t.sidebar.connections} />
        <Item href="/commands" icon="📋" label={t.sidebar.logging} />
        <Item href="/giveaways" icon="🎉" label={t.sidebar.giveaways} active={p==="/giveaways"} />
        <Item href="/marriages" icon="💍" label={t.sidebar.marriages} active={p==="/marriages"} />
      </nav>
    </aside>
  );
}
