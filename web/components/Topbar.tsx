"use client";
import { useLang } from "../lib/i18n";

export default function Topbar() {
  return (
    <header className="h-[56px] bg-[#111820] border-b border-[#1c252f] flex items-center justify-between px-4 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-white grid place-items-center">
            <span className="text-[14px]">◈</span>
          </div>
          <span className="font-black text-sm tracking-widest">DEVELOPER PORTAL</span>
        </div>
        <span className="text-[#2a3340]">|</span>
        <div className="hidden md:flex items-center gap-1.5 bg-[#1a212b] border border-[#232f3e] px-2.5 py-1.5 rounded-lg">
          <span className="w-6 h-6 rounded bg-gradient-to-br from-sky-500 to-indigo-500 grid place-items-center text-xs font-bold">M</span>
          <span className="text-sm font-medium">MyCommunity</span>
          <span className="text-[#5b6b7f]">▾</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <a href="https://github.com/yukee767/MyCommunity" target="_blank" className="hidden md:inline-flex items-center gap-1.5 bg-[#1e2a36] hover:bg-[#223041] border border-[#2a3d52] text-sm font-medium px-3.5 py-1.5 rounded-full transition">+ Create</a>
        <a href="#" className="text-sm text-[#8a96a8] hover:text-white hidden md:inline">Docs ↗</a>
        <a href="#" className="text-sm text-[#8a96a8] hover:text-white hidden md:inline-flex items-center gap-1">👥 Teams</a>
        <img src="https://i.pravatar.cc/32?u=yu" alt="avatar" className="w-8 h-8 rounded-full border border-[#223041]" />
      </div>
    </header>
  );
}
