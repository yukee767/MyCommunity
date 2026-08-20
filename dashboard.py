import socket
import threading
import webbrowser
from datetime import datetime

from flask import Flask, render_template_string

import db

BOT = {"name": "MyCommunity", "started_at": None}

app = Flask(__name__)


def _fmt_usernames(guild_id, user_id):
    return f"<@{user_id}>"


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
        return f"{hours}h {mins}m {secs}s"
    return f"{mins}m {secs}s"


BASE = """
<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<title>{{ title }} · {{ bot_name }}</title>
<meta http-equiv="refresh" content="15">
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background:#111318; color:#e6e8ef; margin:0; padding:24px; }
  header { display:flex; align-items:center; justify-content:space-between; gap:16px; flex-wrap:wrap; margin-bottom:20px; }
  h1 { font-size:22px; margin:0; }
  .badge { background:#5865F2; color:#fff; padding:4px 12px; border-radius:999px; font-size:13px; }
  nav a { color:#9aa0b4; text-decoration:none; margin-right:14px; font-size:14px; }
  nav a.active, nav a:hover { color:#fff; }
  .cards { display:grid; grid-template-columns:repeat(auto-fit,minmax(170px,1fr)); gap:14px; margin-bottom:24px; }
  .card { background:#1b1f29; border-radius:12px; padding:18px; border:1px solid #262b37; }
  .card .num { font-size:30px; font-weight:700; margin-top:6px; }
  .card .lbl { font-size:13px; color:#9aa0b4; }
  .ok { color:#3ba55c; } .warn { color:#f0b232; } .off { color:#ed4245; }
  table { width:100%; border-collapse:collapse; background:#1b1f29; border-radius:12px; overflow:hidden; }
  th,td { text-align:left; padding:10px 14px; font-size:14px; border-bottom:1px solid #262b37; }
  th { background:#222734; color:#9aa0b4; font-weight:600; }
  .muted { color:#9aa0b4; font-size:13px; }
  a.botbtn { background:#5865F2; color:#fff; padding:8px 14px; border-radius:8px; text-decoration:none; }
</style>
</head>
<body>
<header>
  <h1>🤖 {{ bot_name }} — Dashboard</h1>
  <span class="badge">Painel local</span>
</header>
<nav>
  <a href="/" {% if active=='home' %}class="active"{% endif %}>Início</a>
  <a href="/casamentos" {% if active=='casamentos' %}class="active"{% endif %}>Casamentos</a>
  <a href="/sorteios" {% if active=='sorteios' %}class="active"{% endif %}>Sorteios</a>
  <a href="/comandos" {% if active=='comandos' %}class="active"{% endif %}>Comandos</a>
</nav>
{{ content }}
</body>
</html>
"""


def page(title, active, content):
    return render_template_string(BASE, title=title, bot_name=BOT["name"], active=active, content=content)


@app.route("/")
def home():
    online = db.get_meta("online") == "1"
    status_html = '<span class="ok">● Online</span>' if online else '<span class="off">● Offline</span>'
    total_cmds = sum(r["total"] for r in db.command_usage())
    cards = f"""
    <div class="cards">
      <div class="card"><div class="lbl">Status</div><div class="num">{status_html}</div></div>
      <div class="card"><div class="lbl">Servidores</div><div class="num">{db.get_meta('guilds') or 0}</div></div>
      <div class="card"><div class="lbl">Tempo online</div><div class="num" style="font-size:18px">{_duration(BOT['started_at'])}</div></div>
      <div class="card"><div class="lbl">Comandos usados</div><div class="num">{total_cmds}</div></div>
      <div class="card"><div class="lbl">Casamentos</div><div class="num">{len(db.get_marriages())}</div></div>
      <div class="card"><div class="lbl">Sorteios ativos</div><div class="num">{len(db.get_giveaways('ativo'))}</div></div>
    </div>"""
    top = "".join(
        f"<tr><td>{_fmt_usernames(0, r['user_id'])}</td><td>{r['total']}</td></tr>"
        for r in db.top_users(10)
    )
    content = cards + f"""
    <h2 style="font-size:17px">👥 Top usuários</h2>
    <table><tr><th>Usuário</th><th>Comandos</th></tr>{top}</table>"""
    return page("Início", "home", content)


@app.route("/casamentos")
def casamentos():
    rows = db.get_marriages()
    table = "".join(
        f"<tr><td>{_fmt_usernames(0, r['user1_id'])}</td><td>{_fmt_usernames(0, r['user2_id'])}</td><td>{r['married_at']}</td></tr>"
        for r in rows
    )
    content = f'<h2 style="font-size:17px">💍 Casamentos ({len(rows)})</h2><table><tr><th>Cônjuge 1</th><th>Cônjuge 2</th><th>Data</th></tr>{table}</table>'
    return page("Casamentos", "casamentos", content)


@app.route("/sorteios")
def sorteios():
    rows = db.get_giveaways()
    table = "".join(
        f"<tr><td>{r['prize']}</td><td>{r['winners']}</td><td>{len(__import__('json').loads(r['participants']))}</td>"
        f"<td>{r['ends_at']}</td><td>{'🟢 ativo' if r['status']=='ativo' else '⚫ encerrado'}</td></tr>"
        for r in rows
    )
    content = f'<h2 style="font-size:17px">🎉 Sorteios ({len(rows)})</h2><table><tr><th>Prêmio</th><th>Ganhadores</th><th>Participantes</th><th>Termina</th><th>Status</th></tr>{table}</table>'
    return page("Sorteios", "sorteios", content)


@app.route("/comandos")
def comandos():
    usage_rows = db.command_usage()
    usage = f"""
    <h2 style="font-size:17px">🧮 Uso por comando</h2>
    <table><tr><th>Comando</th><th>Vezes</th></tr>
    {''.join(f"<tr><td>/{r['command']}</td><td>{r['total']}</td></tr>" for r in usage_rows)}
    </table>"""
    logs = "".join(
        f"<tr><td>/{r['command']}</td><td>{_fmt_usernames(0, r['user_id'])}</td><td>{r['used_at']}</td></tr>"
        for r in db.get_command_logs(100)
    )
    logs_tbl = f"""
    <h2 style="font-size:17px">🕓 Últimos comandos</h2>
    <table><tr><th>Comando</th><th>Usuário</th><th>Data</th></tr>{logs}</table>"""
    return page("Comandos", "comandos", usage + logs_tbl)


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