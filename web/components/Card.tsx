export function Card({ title, desc, action, href }: { title: string; desc: string; action: string; href: string }) {
  return (
    <div className="bg-white border border-black p-5 flex flex-col gap-3">
      <h3 className="font-bold text-base leading-none">{title}</h3>
      <p className="text-sm leading-relaxed flex-1">{desc}</p>
      <a href={href} className="self-start bg-black text-white px-4 py-2 text-xs font-bold hover:bg-white hover:text-black border border-black transition">{action}</a>
    </div>
  );
}
