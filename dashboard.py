import socket
import threading
import webbrowser
from datetime import datetime

from flask import Flask, render_template_string

import db

BOT = {"name": "MyCommunity", "started_at": None}

app = Flask(__name__)

def _duration(started_at_iso):
    if not started_at_iso:
        return "—"
    try:
        start = datetime.fromisoformat(started_at_iso)
        secs = int((datetime.now() - start).total_seconds())
    except Exception:
        return "—"
    days, secs = divmod(secs, 86400)
    hours, secs = divmod(secs, 3600)
    mins, secs = divmod(secs, 60)
    if days:
        return f"{days}d {hours}h {mins}m"
    if hours:
        return f"{hours}h {mins}m"
    return f"{mins}m {secs}s"

# ── Sapphire-inspired layout ──
BASE = r"""
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{{ title }} · {{ bot_name }}</title>
<meta http-equiv="refresh" content="30">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--bg:#0e1217;--sidebar:#111820;--card:#1a212b;--card-hover:#1e2732;--card-border:#232f3e;--muted:#8a96a8;--text:#e6edf5;--accent:#0ea5e9;--pill:#1c2530;--btn:#232f3e;--btn-hover:#2a3a4d}
  body{font-family:'Inter','Segoe UI',system-ui,sans-serif;background:var(--bg);color:var(--text);display:flex;min-height:100vh;overflow-x:hidden}
  /* sidebar */
  aside{width:250px;min-width:250px;background:var(--sidebar);border-right:1px solid #1c252f;display:flex;flex-direction:column;padding:18px 14px;gap:6px;position:sticky;top:0;height:100vh;overflow-y:auto}
  .side-top{display:flex;align-items:center;gap:10px;padding:6px 8px;margin-bottom:10px}
  .side-top .logo{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#0ea5e9,#6366f1);display:grid;place-items:center;font-weight:700;font-size:14px}
  .side-top .name{font-weight:600;font-size:14px}
  .pill{display:inline-flex;align-items:center;gap:8px;background:#1e2a36;border:1px solid #263547;color:#cbd5e1;padding:7px 16px;border-radius:999px;font-size:13px;font-weight:500}
  .pill.active{background:#1a2532;border-color:#2a3d52;color:#eaf2ff}
  .pill .dot{width:14px;height:14px;display:grid;place-items:center}
  .nav{display:flex;flex-direction:column;gap:2px;margin-top:12px}
  .nav a{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:8px;color:var(--muted);text-decoration:none;font-size:13px;font-weight:500;transition:.15s}
  .nav a:hover{background:#16202c;color:#d6e1ef}
  .nav a.active{background:#16202c;color:#e6edf5}
  .nav .badge{margin-left:auto;background:#c23a3a;color:#fff;font-size:11px;font-weight:700;padding:2px 7px;border-radius:999px}
  .section{margin:16px 8px 4px;font-size:10px;letter-spacing:.08em;color:#5b6b7f;font-weight:600}
  /* main */
  main{flex:1;position:relative;overflow:hidden;background:radial-gradient(800px 400px at 85% -10%, rgba(14,165,233,.18), transparent 60%), var(--bg);padding:36px 36px 32px}
  .orb{position:absolute;right:-120px;top:-40px;width:520px;height:520px;background:radial-gradient(circle at 50% 50%, rgba(14,165,233,.85) 0%, rgba(14,165,233,.45) 25%, rgba(14,165,233,0) 70%);filter:blur(22px);pointer-events:none;opacity:.95}
  .welcome{position:relative;z-index:1;margin-bottom:28px}
  .welcome h1{font-size:42px;font-weight:800;letter-spacing:-.02em;line-height:1}
  .welcome h1 span{color:var(--accent)}
  .welcome p{margin-top:10px;color:var(--muted);font-size:16px}
  /* stats pills */
  .stats{display:flex;gap:12px;flex-wrap:wrap;position:relative;z-index:1;margin-bottom:22px}
  .stat{background:var(--card);border:1px solid var(--card-border);padding:10px 14px;border-radius:999px;font-size:13px;display:flex;gap:8px;align-items:center}
  .stat b{color:var(--text)}
  .stat .ok{color:#22c55e} .stat .off{color:#ef4444}
  /* cards grid */
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;position:relative;z-index:1}
  @media(max-width:900px){.grid{grid-template-columns:1fr} aside{display:none} main{padding:20px}}
  .card{background:var(--card);border:1px solid var(--card-border);border-radius:16px;padding:22px;display:flex;flex-direction:column;gap:12px;transition:.15s;position:relative;overflow:hidden}
  .card:hover{background:var(--card-hover);border-color:#2a3d52;transform:translateY(-1px)}
  .card .icon{width:32px;height:32px;border-radius:8px;background:#111820;border:1px solid #223041;display:grid;place-items:center;font-size:15px}
  .card h3{font-size:17px;font-weight:700}
  .card p{color:var(--muted);font-size:13.5px;line-height:1.5;flex:1}
  .card .btn{align-self:flex-start;margin-top:4px;background:var(--btn);border:1px solid #2a3a4d;color:#d6e1ef;padding:8px 14px;border-radius:9px;font-size:13px;font-weight:600;text-decoration:none;transition:.15s}
  .card .btn:hover{background:var(--btn-hover);color:#fff}
  .wide{grid-column:1 / -1}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{text-align:left;padding:10px 12px;border-bottom:1px solid #1e2a36}
  th{color:var(--muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:.04em}
  .muted{color:var(--muted)}
  a{color:#7dd3fc}
</style>
</head>
<body>
<aside>
  <div class="side-top">
    <div class="logo">MC</div>
    <div class="name">{{ bot_name }}</div>
  </div>
  <div style="display:flex;gap:8px;align-items:center">
    <a href="/" class="pill {% if active=='home' %}active{% endif %}"><span class="dot">⌂</span> Home</a>
    <a href="/" style="width:32px;height:32px;display:grid;place-items:center;background:var(--pill);border:1px solid #223041;border-radius:999px;color:var(--muted);text-decoration:none">↻</a>
  </div>
  <nav class="nav">
    <a href="/" class="{% if active=='general' %}active{% endif %}"><span>⚙</span> General Settings <span class="badge">35</span></a>
    <a href="/comandos" class="{% if active=='comandos' %}active{% endif %}"><span>▭</span> Commands</a>
    <a href="/comandos" class="{% if active=='logs' %}active{% endif %}"><span>💬</span> Messages</a>
    <a href="/casamentos"><span>✦</span> Custom Branding</a>
    <div class="section">MODULES</div>
    <a href="/comandos"><span>🛡</span> Auto Moderation</a>
    <a href="/" style="color:#d6e1ef"><span>🛡</span> Moderation</a>
    <a href="/sorteios"><span>🔔</span> Social Notifications</a>
    <a href="/comandos"><span>👤+</span> Join Roles</a>
    <a href="/comandos"><span>😊</span> Reaction Roles</a>
    <a href="/"><span>👋</span> Welcome Messages</a>
    <a href="/comandos"><span>🔗</span> Role Connections</a>
    <a href="/comandos"><span>📋</span> Logging</a>
    <a href="/sorteios" class="{% if active=='sorteios' %}active{% endif %}"><span>🎉</span> Giveaways</a>
    <a href="/casamentos" class="{% if active=='casamentos' %}active{% endif %}"><span>💍</span> Marriages</a>
  </nav>
</aside>
<main>
  <div class="orb"></div>
  {{ content|safe }}
</main>
</body>
</html>
"""

def page(title, active, content):
    return render_template_string(BASE, title=title, bot_name=BOT["name"], active=active, content=content)

@app.route("/")
def home():
    online = db.get_meta("online") == "1"
    status = '<span class="ok">● Online</span>' if online else '<span class="off">● Offline</span>'
    total = sum(r["total"] for r in db.command_usage())
    stats = f'''
    <div class="stats">
      <div class="stat">Status <b>{status}</b></div>
      <div class="stat">Servidores <b>{db.get_meta("guilds") or 0}</b></div>
      <div class="stat">Uptime <b>{_duration(BOT["started_at"])}</b></div>
      <div class="stat">Comandos <b>{total}</b></div>
      <div class="stat">Casamentos <b>{len(db.get_marriages())}</b></div>
      <div class="stat">Sorteios <b>{len(db.get_giveaways("ativo"))}</b></div>
    </div>'''
    welcome = '''
    <div class="welcome">
      <h1>Welcome <span>Yu</span>,</h1>
      <p>find commonly used dashboard pages below.</p>
    </div>'''
    # 6 cards like Sapphire
    mod_total = len([r for r in db.command_usage() if r["command"] in ("ban","unban","mute","unmute","lock","lockall","unlock","unlockall")])
    cards = f'''
    <div class="grid">
      <div class="card">
        <div class="icon">💬</div>
        <h3>Custom messages</h3>
        <p>Create fully customized messages called templates and pack them with your very own embeds, buttons and select menus. Use <code>/embed</code> e <code>/say</code>.</p>
        <a class="btn" href="/comandos">Create template</a>
      </div>
      <div class="card">
        <div class="icon">🗂</div>
        <h3>Moderation cases</h3>
        <p>View and edit all moderation cases using the dashboard. <b>{mod_total}</b> casos registrados.</p>
        <a class="btn" href="/comandos">View cases</a>
      </div>
      <div class="card">
        <div class="icon">🏳</div>
        <h3>User reports</h3>
        <p>Allow users to report others and fully customize how to handle them. Integra com <code>/kiss</code>, <code>/married</code>.</p>
        <a class="btn" href="/casamentos">Configure reports</a>
      </div>
      <div class="card">
        <div class="icon">👋</div>
        <h3>Role greetings</h3>
        <p>Welcome users to their new role by using {BOT["name"]}'s role assignment messages. <code>/addrole</code> e <code>/addroleall</code>.</p>
        <a class="btn" href="/comandos">Show role messages</a>
      </div>
      <div class="card">
        <div class="icon">✎</div>
        <h3>Prefix &amp; calculator</h3>
        <p>Quick actions and utilities. <code>/calculator</code> e <code>/ping</code> logados: <b>{total}</b> usos.</p>
        <a class="btn" href="/comandos">Open utilities</a>
      </div>
      <div class="card">
        <div class="icon">⚙</div>
        <h3>AI Moderation</h3>
        <p>Use artificial intelligence to assist you in moderating your community. <code>/gpt</code> texto + <code>/translation</code>.</p>
        <a class="btn" href="/comandos">Configure AI</a>
      </div>
    </div>'''
    return page("Home", "home", welcome + stats + cards)

@app.route("/casamentos")
def casamentos():
    rows = db.get_marriages()
    header = '<div class="welcome"><h1>Casamentos <span>💍</span></h1><p>Todos os casamentos salvos no SQLite local.</p></div>'
    if not rows:
        body = '<div class="card"><p class="muted">Nenhum casamento ainda. Use /married no Discord.</p></div>'
    else:
        tr = "".join(f"<tr><td>{r['user1_id']}</td><td>{r['user2_id']}</td><td>{r['married_at']}</td></tr>" for r in rows)
        body = f'<div class="card wide"><table><tr><th>Conjuge 1</th><th>Conjuge 2</th><th>Data</th></tr>{tr}</table></div>'
    return page("Casamentos", "casamentos", header + f'<div class="grid">{body}</div>')

@app.route("/sorteios")
def sorteios():
    rows = db.get_giveaways()
    header = '<div class="welcome"><h1>Sorteios <span>🎉</span></h1><p>Giveaways criados com /giveway.</p></div>'
    if not rows:
        body = '<div class="card"><p class="muted">Nenhum sorteio ainda.</p></div>'
    else:
        tr = "".join(
            f"<tr><td>{r['prize']}</td><td>{r['winners']}</td><td>{len(__import__('json').loads(r['participants']))}</td><td>{r['ends_at']}</td><td>{'ativo' if r['status']=='ativo' else 'encerrado'}</td></tr>"
            for r in rows
        )
        body = f'<div class="card wide"><table><tr><th>Premio</th><th>Ganhadores</th><th>Participantes</th><th>Termina</th><th>Status</th></tr>{tr}</table></div>'
    return page("Sorteios", "sorteios", header + f'<div class="grid">{body}</div>')

@app.route("/comandos")
def comandos():
    usage = db.command_usage()
    header = '<div class="welcome"><h1>Commands <span>▭</span></h1><p>Uso de cada slash command do MyCommunity.</p></div>'
    usage_rows = "".join(f"<tr><td>/{r['command']}</td><td>{r['total']}</td></tr>" for r in usage) or '<tr><td colspan="2" class="muted">Nenhum uso registrado</td></tr>'
    logs_rows = "".join(f"<tr><td>/{r['command']}</td><td>{r['user_id']}</td><td>{r['used_at']}</td></tr>" for r in db.get_command_logs(100)) or '<tr><td colspan="3" class="muted">Sem logs</td></tr>'
    body = f'''
    <div class="grid">
      <div class="card"><h3>Uso por comando</h3><table><tr><th>Comando</th><th>Vezes</th></tr>{usage_rows}</table></div>
      <div class="card"><h3>Ultimos comandos</h3><table><tr><th>Comando</th><th>Usuario</th><th>Data</th></tr>{logs_rows}</table></div>
    </div>'''
    return page("Commands", "comandos", header + body)

def _find_port(start=5000):
    for port in range(start, start + 20):
        with socket.socket() as s:
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    return start

def start(bot=None, open_browser=True):
    if bot is not None:
        try:
            BOT["name"] = getattr(bot.user, "name", None) or "MyCommunity"
        except Exception:
            BOT["name"] = "MyCommunity"
        if BOT.get("started_at") is None:
            BOT["started_at"] = datetime.now().isoformat()
    def run():
        port = _find_port()
        print(f"[Dashboard] local: http://127.0.0.1:{port}", flush=True)
        if open_browser:
            try:
                webbrowser.open(f"http://127.0.0.1:{port}")
            except Exception:
                pass
        app.run(host="127.0.0.1", port=port, debug=False, use_reloader=False)
    t = threading.Thread(target=run, daemon=True)
    t.start()
    return t

if __name__ == "__main__":
    db.init_db()
    if BOT.get("started_at") is None:
        BOT["started_at"] = datetime.now().isoformat()
    port = _find_port()
    print(f"[Dashboard] standalone: http://127.0.0.1:{port}", flush=True)
    try:
        webbrowser.open(f"http://127.0.0.1:{port}")
    except Exception:
        pass
    app.run(host="127.0.0.1", port=port, debug=False, use_reloader=False)
