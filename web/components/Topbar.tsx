"use client";
export default function Topbar() {
  return (
    <header className="h-12 bg-white border-b border-black flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-black text-white grid place-items-center font-bold text-xs">MC</div>
        <span className="font-bold text-sm tracking-tight">MyCommunity</span>
        <span className="text-black/30">/</span>
        <span className="text-sm">Dashboard</span>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <a href="https://github.com/yukee767/MyCommunity" target="_blank" className="border border-black px-3 py-1 text-sm font-medium hover:bg-black hover:text-white transition">GitHub</a>
        <span className="w-7 h-7 bg-black rounded-full grid place-items-center text-white text-xs">Yu</span>
      </div>
    </header>
  );
}
