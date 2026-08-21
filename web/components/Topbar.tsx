"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageToggle from "./LanguageToggle";
import { useTheme } from "./ThemeProvider";

const links = [
  { href: "/", label: "Overview" },
  { href: "/commands", label: "Commands" },
  { href: "/giveaways", label: "Giveaways" },
  { href: "/marriages", label: "Marriages" },
];

export default function Topbar() {
  const p = usePathname();
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-50 border-b bg-[var(--bg)]" style={{borderColor: "currentColor"}}>
      <div className="max-w-[1160px] mx-auto px-6 h-[56px] flex items-center justify-between" style={{background: "var(--bg)", color: "var(--fg)"}}>
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="w-7 h-7 bg-[var(--fg)] text-[var(--bg)] grid place-items-center font-black text-xs dark:bg-[var(--bg)] dark:text-[var(--fg)]" style={{background: theme==="dark"?"#fff":"#000", color: theme==="dark"?"#000":"#fff"}}>MC</span>
            <span className="font-black text-sm">MyCommunity</span>
            <span className="text-xs border px-1.5 py-0.5 font-bold">BOT</span>
          </Link>
          <nav className="hidden md:flex gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href} className={`px-3 py-1.5 text-sm border ${p===l.href ? "bg-[var(--fg)] text-[var(--bg)] dark:bg-[var(--bg)] dark:text-[var(--fg)]" : "bg-transparent hover:opacity-80 dark:hover:bg-[var(--bg)] dark:hover:text-[var(--fg)]"}`}>{l.label}</Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="border px-3 py-1.5 text-xs font-bold hover:opacity-80 dark:hover:bg-[var(--bg)] dark:hover:text-[var(--fg)]">{theme==="light" ? "â— Preto" : "â—‹ Branco"}</button>
          <LanguageToggle />
          <a href="https://github.com/yukee767/MyCommunity" target="_blank" className="bg-[var(--fg)] text-[var(--bg)] dark:bg-[var(--bg)] dark:text-[var(--fg)] px-4 py-2 text-xs font-bold">GitHub</a>
        </div>
      </div>
    </header>
  );
}

