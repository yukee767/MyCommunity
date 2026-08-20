import { api } from "../../lib/api";
export const dynamic = "force-dynamic";
export default async function Marriages() {
  let rows:any[]=[];
  try { rows = await api.marriages(); } catch {}
  return (
    <>
      <div className="mb-6">
        <h1 className="text-[32px] font-extrabold">Casamentos <span className="text-sky-400">💍</span></h1>
        <p className="text-[#8a96a8] mt-1">Todos os casamentos salvos no SQLite local.</p>
      </div>
      <div className="bg-[#1a212b] border border-[#232f3e] rounded-2xl p-5">
        {!rows.length ? <p className="text-[#8a96a8]">Nenhum casamento ainda. Use /married no Discord.</p> :
          <table className="w-full text-sm">
            <thead><tr className="text-[#8a96a8] text-xs uppercase"><th className="text-left py-2">Cônjuge 1</th><th className="text-left py-2">Cônjuge 2</th><th className="text-left py-2">Data</th></tr></thead>
            <tbody>{rows.map((r:any)=><tr key={`${r.guild_id}-${r.user1_id}-${r.user2_id}`} className="border-t border-[#1e2a36]"><td className="py-2">{r.user1_id}</td><td className="py-2">{r.user2_id}</td><td className="py-2 text-[#8a96a8]">{r.married_at}</td></tr>)}</tbody>
          </table>}
      </div>
    </>
  );
}
