export function Card({ icon, title, desc, action, href }: { icon: string; title: string; desc: string; action: string; href: string }) {
  return (
    <div className="bg-[#1a212b] border border-[#232f3e] rounded-2xl p-[22px] flex flex-col gap-3 hover:bg-[#1e2732] hover:border-[#2a3d52] hover:-translate-y-[1px] transition">
      <div className="w-8 h-8 rounded-lg bg-[#111820] border border-[#223041] grid place-items-center text-[15px]">{icon}</div>
      <h3 className="font-bold text-[17px]">{title}</h3>
      <p className="text-[#8a96a8] text-[13.5px] leading-relaxed flex-1">{desc}</p>
      <a href={href} className="self-start mt-1 bg-[#232f3e] hover:bg-[#2a3a4d] border border-[#2a3a4d] text-[#d6e1ef] px-3.5 py-2 rounded-[9px] text-[13px] font-semibold transition">{action}</a>
    </div>
  );
}
