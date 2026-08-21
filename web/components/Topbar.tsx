"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageToggle from "./LanguageToggle";

const links = [
  { href: "/", label: "Overview" },
  { href: "/commands", label: "Commands" },
  { href: "/giveaways", label: "Giveaways" },
  { href: "/marriages", label: "Marriages" },
];

export default function Topbar() {
  const p = usePathname();
  return (
    <header className="sticky top-0 z-50 bg-[#fcfcf9] border-b border-black">
      <div className="max-w-[1160px] mx-auto px-6 h-[64px] flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-black text-white grid place-items-center font-black text-sm leading-none">MC</span>
            <span className="font-black text-[15px] tracking-tight">MyCommunity</span>
            <span className="text-xs border border-black px-1.5 py-0.5 font-bold">BOT</span>
          </Link>
          <nav className="hidden md:flex gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href}
                className={`px-3 py-1.5 text-sm border ${p===l.href ? "bg-black text-white border-black" : "bg-white text-black border-white hover:border-black"}`}>
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-xs">● Online</span>
          <LanguageToggle />
          <a href="https://github.com/yukee767/MyCommunity" target="_blank" className="bg-black text-white px-4 py-2 text-xs font-bold">GitHub</a>
        </div>
      </div>
    </header>
  );
}
