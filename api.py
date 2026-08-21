from datetime import datetime
from typing import Optional

import db
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MyCommunity API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BOT = {"name": "MyCommunity", "started_at": None}
bot_ref = None  # preenchido por main.py

def _duration(iso: Optional[str]) -> str:
    if not iso:
        # tenta ler do banco (quando api roda separado do bot)
        iso = db.get_meta("started_at")
        if not iso:
            return "—"
    try:
        start = datetime.fromisoformat(iso)
        secs = int((datetime.now() - start).total_seconds())
    except Exception:
        return "—"
    d, secs = divmod(secs, 86400)
    h, secs = divmod(secs, 3600)
    m, s = divmod(secs, 60)
    if d: return f"{d}d {h}h {m}m"
    if h: return f"{h}h {m}m"
    return f"{m}m {s}s"

def set_started_now():
    iso = datetime.now().isoformat()
    BOT["started_at"] = iso
    db.set_meta("started_at", iso)
    return iso

@app.get("/api/health")
def health():
    return {"ok": True, "bot": BOT["name"]}

@app.get("/api/stats")
def stats():
    return {
        "bot_name": BOT["name"],
        "online": db.get_meta("online") == "1",
        "guilds": int(db.get_meta("guilds") or 0),
        "uptime": _duration(BOT["started_at"]),
        "uptime_iso": BOT["started_at"],
        "commands_total": sum(r["total"] for r in db.command_usage()),
        "marriages": len(db.get_marriages()),
        "giveaways_active": len(db.get_giveaways("ativo")),
        "giveaways_total": len(db.get_giveaways()),
    }

@app.get("/api/marriages")
def marriages():
    return db.get_marriages()

@app.get("/api/giveaways")
def giveaways(status: Optional[str] = None):
    return db.get_giveaways(status)

@app.get("/api/commands/usage")
def usage():
    return db.command_usage()

@app.get("/api/commands/logs")
def logs(limit: int = 100):
    return db.get_command_logs(limit)

@app.get("/api/top-users")
def top_users(limit: int = 10):
    return db.top_users(limit)

@app.get("/api/guilds")
def guilds():
    if bot_ref is not None and hasattr(bot_ref, "guilds"):
        try:
            return [{"id": str(g.id), "name": g.name, "member_count": g.member_count or len(g.members) if g.members else 0, "icon": str(g.icon) if g.icon else None} for g in bot_ref.guilds]
        except Exception:
            pass
    import json
    raw = db.get_meta("guilds_json")
    if raw:
        try:
            return json.loads(raw)
        except Exception:
            pass
    return []

@app.get("/api/commands/list")
def commands_list():
    if bot_ref is not None and hasattr(bot_ref, "tree"):
        try:
            cmds = bot_ref.tree.get_commands()
            return [{"name": c.name, "description": c.description or "", "type": "slash"} for c in cmds]
        except Exception:
            pass
    return [{"name": n, "description": "", "type": "slash"} for n in ["ban","unban","mute","unmute","lock","lockall","unlock","unlockall","say","embed","kiss","married","divorce","ping","calculator","gpt","translation","giveway","addrole","removerole","addroleall","removeroleall"]]

@app.get("/api/stats/daily")
def daily(days: int = 7):
    return db.daily_usage(days)

@app.get("/api/stats/top-guilds")
def top_guilds():
    return db.top_guilds()

@app.post("/api/bot/sync")
async def bot_sync():
    if bot_ref is not None:
        try:
            synced = await bot_ref.tree.sync()
            return {"ok": True, "synced": len(synced)}
        except Exception as e:
            return {"ok": False, "error": str(e)}
    return {"ok": False, "error": "bot not ready"}

@app.get("/api/bot/status")
def bot_status():
    if bot_ref is not None:
        try:
            return {"online": not bot_ref.is_closed(), "guilds": len(bot_ref.guilds), "latency": round(bot_ref.latency*1000, 1) if hasattr(bot_ref, 'latency') else 0}
        except Exception:
            pass
    return {"online": db.get_meta("online") == "1", "guilds": int(db.get_meta("guilds") or 0), "latency": 0}

# — para uso integrado com o bot (thread) —
def start(host: str = "127.0.0.1", port: int = 8000):
    import threading, uvicorn
    def _run():
        uvicorn.run(app, host=host, port=port, log_level="warning")
    t = threading.Thread(target=_run, daemon=True)
    t.start()
    print(f"[API] FastAPI em http://{host}:{port}", flush=True)
    return t
