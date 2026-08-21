"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "../lib/i18n";
import LanguageToggle from "./LanguageToggle";

function Item({ href, label, active }: { href: string; label: string; active?: boolean }) {
  return (
    <Link href={href} className={`block px-3 py-2 text-sm border ${active ? "bg-black text-white border-black" : "bg-white text-black border-white hover:border-black"}`}>
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const p = usePathname();
  const { t } = useLang();
  return (
    <aside className="w-[200px] shrink-0 bg-white border-r border-black sticky top-12 h-[calc(100vh-48px)] p-4 flex flex-col gap-4">
      <nav className="flex flex-col gap-1">
        <Item href="/" label="Home" active={p === "/"} />
        <Item href="/commands" label={t.sidebar.commands} active={p === "/commands"} />
        <Item href="/giveaways" label={t.sidebar.giveaways} active={p === "/giveaways"} />
        <Item href="/marriages" label={t.sidebar.marriages} active={p === "/marriages"} />
      </nav>
      <div className="h-px bg-black my-1" />
      <nav className="flex flex-col gap-1">
        <div className="px-3 py-1 text-xs font-bold tracking-widest">MODULES</div>
        <Item href="/commands" label={t.sidebar.moderation} />
        <Item href="/commands" label={t.sidebar.logging} />
      </nav>
      <div className="mt-auto border border-black p-3">
        <div className="text-xs font-bold mb-2">Language</div>
        <LanguageToggle />
      </div>
    </aside>
  );
}
