export function Card({ kicker, title, desc, action, href, count }: { kicker: string; title: string; desc: string; action: string; href: string; count?: string }) {
  return (
    <div className="bg-white border border-black p-6 flex flex-col">
      <div className="text-xs font-bold tracking-widest">{kicker}</div>
      <h3 className="font-black text-xl leading-tight mt-2">{title}</h3>
      {count && <div className="text-4xl font-black mt-3">{count}</div>}
      <p className="text-sm leading-relaxed mt-3 flex-1">{desc}</p>
      <a href={href} className="mt-5 inline-block bg-black text-white px-4 py-2 text-xs font-bold text-center hover:bg-white hover:text-black border border-black transition">{action}</a>
    </div>
  );
}
