const BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function get(path: string) {
  const r = await fetch(`${BASE}${path}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`GET ${path} ${r.status}`);
  return r.json();
}

export const api = {
  stats: () => get("/api/stats"),
  marriages: () => get("/api/marriages"),
  giveaways: (status?: string) => get(status ? `/api/giveaways?status=${status}` : "/api/giveaways"),
  usage: () => get("/api/commands/usage"),
  logs: (limit=100) => get(`/api/commands/logs?limit=${limit}`),
  topUsers: () => get("/api/top-users"),
  guilds: () => get("/api/guilds"),
  commandsList: () => get("/api/commands/list"),
};
