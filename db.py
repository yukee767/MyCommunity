import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent / "data.db"


def utcnow_str() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S")


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    with connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS marriages (
                guild_id INTEGER NOT NULL,
                user1_id INTEGER NOT NULL,
                user2_id INTEGER NOT NULL,
                married_at TEXT NOT NULL,
                PRIMARY KEY (guild_id, user1_id, user2_id)
            );

            CREATE TABLE IF NOT EXISTS giveaways (
                message_id INTEGER PRIMARY KEY,
                guild_id INTEGER NOT NULL,
                prize TEXT NOT NULL,
                winners INTEGER NOT NULL DEFAULT 1,
                creator_id INTEGER NOT NULL,
                ends_at TEXT NOT NULL,
                participants TEXT NOT NULL DEFAULT '[]',
                status TEXT NOT NULL DEFAULT 'ativo'
            );

            CREATE TABLE IF NOT EXISTS command_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                command TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                guild_id INTEGER NOT NULL,
                used_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS meta (
                key TEXT PRIMARY KEY,
                value TEXT
            );
            """
        )


# ---------------- CASAMENTOS ----------------
def add_marriage(guild_id: int, user1_id: int, user2_id: int) -> None:
    with connect() as conn:
        conn.execute(
            "INSERT OR IGNORE INTO marriages VALUES (?,?,?,?)",
            (guild_id, user1_id, user2_id, utcnow_str()),
        )


def find_partner(guild_id: int, user_id: int):
    with connect() as conn:
        row = conn.execute(
            "SELECT * FROM marriages WHERE guild_id=? AND (user1_id=? OR user2_id=?)",
            (guild_id, user_id, user_id),
        ).fetchone()
    if not row:
        return None
    return row["user2_id"] if row["user1_id"] == user_id else row["user1_id"]


def is_married(guild_id: int, user_id: int, exclude_user_id: int = None) -> bool:
    with connect() as conn:
        row = conn.execute(
            "SELECT * FROM marriages WHERE guild_id=? AND (user1_id=? OR user2_id=?)",
            (guild_id, user_id, user_id),
        ).fetchone()
    if not row:
        return False
    if exclude_user_id is not None:
        other = row["user2_id"] if row["user1_id"] == user_id else row["user1_id"]
        if other == exclude_user_id:
            return False
    return True


def remove_marriage(guild_id: int, user1_id: int, user2_id: int) -> bool:
    with connect() as conn:
        cur = conn.execute(
            "DELETE FROM marriages WHERE guild_id=? AND "
            "((user1_id=? AND user2_id=?) OR (user1_id=? AND user2_id=?))",
            (guild_id, user1_id, user2_id, user2_id, user1_id),
        )
        return cur.rowcount > 0


def get_marriages() -> list:
    with connect() as conn:
        rows = conn.execute(
            "SELECT * FROM marriages ORDER BY married_at DESC"
        ).fetchall()
    return [dict(r) for r in rows]


# ---------------- SORTEIOS ----------------
def create_giveaway(message_id: int, guild_id: int, prize: str, winners: int,
                    creator_id: int, ends_at: str) -> None:
    with connect() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO giveaways VALUES (?,?,?,?,?,?,?,?)",
            (message_id, guild_id, prize, winners, creator_id, ends_at, "[]", "ativo"),
        )


def giveaway_participants(message_id: int) -> set:
    with connect() as conn:
        row = conn.execute(
            "SELECT participants FROM giveaways WHERE message_id=?", (message_id,)
        ).fetchone()
    if not row:
        return set()
    return set(json.loads(row["participants"]))


def save_participants(message_id: int, participants: set) -> None:
    with connect() as conn:
        conn.execute(
            "UPDATE giveaways SET participants=? WHERE message_id=?",
            (json.dumps(list(participants)), message_id),
        )


def finish_giveaway(message_id: int) -> None:
    with connect() as conn:
        conn.execute(
            "UPDATE giveaways SET status='encerrado' WHERE message_id=?", (message_id,)
        )


def giveaway_active(message_id: int) -> bool:
    with connect() as conn:
        row = conn.execute(
            "SELECT status FROM giveaways WHERE message_id=?", (message_id,)
        ).fetchone()
    return bool(row and row["status"] == "ativo")


def get_giveaways(status: str = None) -> list:
    with connect() as conn:
        if status:
            rows = conn.execute(
                "SELECT * FROM giveaways WHERE status=? ORDER BY ends_at DESC", (status,)
            ).fetchall()
        else:
            rows = conn.execute(
                "SELECT * FROM giveaways ORDER BY ends_at DESC"
            ).fetchall()
    return [dict(r) for r in rows]


# ---------------- LOGS ----------------
def log_command(command: str, user_id: int, guild_id: int) -> None:
    with connect() as conn:
        conn.execute(
            "INSERT INTO command_logs (command, user_id, guild_id, used_at) VALUES (?,?,?,?)",
            (command, user_id, guild_id, utcnow_str()),
        )


def get_command_logs(limit: int = 200) -> list:
    with connect() as conn:
        rows = conn.execute(
            "SELECT * FROM command_logs ORDER BY id DESC LIMIT ?", (limit,)
        ).fetchall()
    return [dict(r) for r in rows]


def command_usage() -> list:
    with connect() as conn:
        rows = conn.execute(
            "SELECT command, COUNT(*) AS total FROM command_logs "
            "GROUP BY command ORDER BY total DESC"
        ).fetchall()
    return [dict(r) for r in rows]


def top_users(limit: int = 10) -> list:
    with connect() as conn:
        rows = conn.execute(
            "SELECT user_id, COUNT(*) AS total FROM command_logs "
            "GROUP BY user_id ORDER BY total DESC LIMIT ?", (limit,)
        ).fetchall()
    return [dict(r) for r in rows]


def daily_usage(days: int = 7) -> list:
    with connect() as conn:
        rows = conn.execute(
            "SELECT substr(used_at, 1, 10) as day, COUNT(*) as total FROM command_logs "
            "WHERE used_at >= datetime('now', ? || ' days') GROUP BY day ORDER BY day",
            (f"-{days}",),
        ).fetchall()
    return [dict(r) for r in rows]


def top_guilds(limit: int = 5) -> list:
    with connect() as conn:
        rows = conn.execute(
            "SELECT guild_id, COUNT(*) as total FROM command_logs "
            "GROUP BY guild_id ORDER BY total DESC LIMIT ?", (limit,)
        ).fetchall()
    return [dict(r) for r in rows]


# ---------------- META ----------------
def set_meta(key: str, value: str) -> None:
    with connect() as conn:
        conn.execute(
            "INSERT OR REPLACE INTO meta (key, value) VALUES (?,?)", (key, value)
        )


def get_meta(key: str, default: str = None):
    with connect() as conn:
        row = conn.execute(
            "SELECT value FROM meta WHERE key=?", (key,)
        ).fetchone()
    return row["value"] if row else default