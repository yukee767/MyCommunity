import { api } from "../../lib/api";
export const dynamic = "force-dynamic";
export default async function Giveaways() {
  let rows:any[]=[];
  try { rows = await api.giveaways(); } catch {}
  return (
    <>
      <div className="mb-6">
        <h1 className="text-[32px] font-extrabold">Sorteios <span className="text-sky-400">🎉</span></h1>
        <p className="text-[#8a96a8] mt-1">Giveaways criados com /giveway.</p>
      </div>
      <div className="bg-[#1a212b] border border-[#232f3e] rounded-2xl p-5">
        {!rows.length ? <p className="text-[#8a96a8]">Nenhum sorteio ainda.</p> :
          <table className="w-full text-sm">
            <thead><tr className="text-[#8a96a8] text-xs uppercase"><th className="text-left py-2">Prêmio</th><th className="text-left py-2">Ganhadores</th><th className="text-left py-2">Participantes</th><th className="text-left py-2">Termina</th><th className="text-left py-2">Status</th></tr></thead>
            <tbody>{rows.map((r:any)=> {
              let p=0; try{ p=JSON.parse(r.participants).length}catch{}
              return <tr key={r.message_id} className="border-t border-[#1e2a36]"><td className="py-2">{r.prize}</td><td className="py-2">{r.winners}</td><td className="py-2">{p}</td><td className="py-2 text-[#8a96a8]">{r.ends_at}</td><td className="py-2">{r.status}</td></tr>
            })}</tbody>
          </table>}
      </div>
    </>
  );
}
