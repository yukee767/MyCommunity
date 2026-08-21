"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "../lib/i18n";
import LanguageToggle from "./LanguageToggle";

function NavItem({ href, icon, label, badge, active, warn }: any) {
  return (
    <Link href={href} className={`flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-[13px] font-medium transition ${active ? "bg-[#1c252f] text-white border border-[#232f3e]" : "text-[#8a96a8] hover:bg-[#16202c] hover:text-[#d6e1ef]"}`}>
      <span className="w-4 h-4 grid place-items-center text-[13px] opacity-90">{icon}</span>
      <span className="flex-1">{label}</span>
      {badge && <span className="bg-[#c23a3a] text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>}
      {warn && <span className="text-amber-400 text-sm">⚠</span>}
    </Link>
  );
}

export default function Sidebar() {
  const p = usePathname();
  const { t } = useLang();
  return (
    <aside className="w-[250px] shrink-0 bg-[#111820] border-r border-[#1c252f] sticky top-[56px] h-[calc(100vh-56px)] overflow-y-auto p-3 flex flex-col gap-1">
      <Link href="/" className="flex items-center gap-2 px-2 py-1 text-sm text-[#8a96a8] hover:text-white">
        <span>←</span> Applications
      </Link>

      <div className="mt-2 flex items-center gap-2 bg-[#1a212b] border border-[#232f3e] rounded-lg px-2.5 py-2">
        <span className="w-7 h-7 rounded bg-gradient-to-br from-sky-500 to-indigo-500 grid place-items-center text-xs font-bold">M</span>
        <span className="text-sm font-medium flex-1">MyCommunity</span>
        <span className="text-[#5b6b7f]">▾</span>
      </div>

      <nav className="flex flex-col gap-0.5 mt-3">
        <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold text-white">
          <span className="flex items-center gap-1.5">⌂ Overview</span>
          <span className="text-[#5b6b7f]">∧</span>
        </div>
        <div className="ml-3 flex flex-col gap-0.5 border-l border-[#1c252f] pl-3">
          <NavItem href="/" icon="▭" label="General Information" />
          <NavItem href="/" icon="⬇" label="Installation" badge="NEW" />
          <NavItem href="/" icon="🔗" label="OAuth2" />
        </div>

        <NavItem href="/" icon="🤖" label="Bot" active={p === "/"} />
        <NavItem href="/commands" icon="😊" label="Emojis" badge="NEW" />
        <NavItem href="/commands" icon="🔗" label="Webhooks" badge="NEW" />
        <NavItem href="/" icon="✨" label="Rich Presence" />
        <NavItem href="/" icon="🧪" label="App Testers" />
        <NavItem href="/" icon="✓" label="App Verification" warn />

        <div className="h-px bg-[#1c252f] my-2" />

        <div className="px-2 py-1 text-[10px] tracking-widest font-semibold text-[#5b6b7f]">MODULES</div>
        <NavItem href="/commands" icon="🛡" label={t.sidebar.autoMod} />
        <NavItem href="/" icon="🛡" label={t.sidebar.moderation} />
        <NavItem href="/giveaways" icon="🎉" label={t.sidebar.giveaways} active={p === "/giveaways"} />
        <NavItem href="/marriages" icon="💍" label={t.sidebar.marriages} active={p === "/marriages"} />
        <NavItem href="/commands" icon="👤+" label={t.sidebar.joinRoles} />
        <NavItem href="/commands" icon="😊" label={t.sidebar.reaction} />
        <NavItem href="/commands" icon="📋" label={t.sidebar.logging} active={p === "/commands"} />

        <div className="h-px bg-[#1c252f] my-2" />
        <NavItem href="/" icon="🎮" label="Games" badge="NEW" />
        <NavItem href="/" icon="🎯" label="Activities" />

        <div className="mt-4 p-2.5 bg-[#0e1217] border border-[#1c252f] rounded-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8a96a8]">Language</span>
            <LanguageToggle />
          </div>
        </div>
      </nav>
    </aside>
  );
}
