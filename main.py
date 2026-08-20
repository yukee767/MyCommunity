import os
import asyncio
from datetime import datetime, timezone

import discord
from discord import app_commands
from discord.ext import commands
from dotenv import load_dotenv

import db
import dashboard

load_dotenv()

TOKEN = os.getenv("DISCORD_TOKEN")

if not TOKEN:
    raise SystemExit("Token não encontrado. Crie o arquivo .env com DISCORD_TOKEN=seu_token")

BOT_NAME = "MyCommunity"

# Intents sem privilegiados por padrão para o bot subir mesmo sem configurar o portal.
# Se você ativar Server Members + Message Content no portal, troque para Intents.all()
intents = discord.Intents.default()
intents.message_content = False

bot = commands.Bot(command_prefix="/", intents=intents)


@bot.event
async def on_ready():
    db.set_meta("online", "1")
    db.set_meta("guilds", str(len(bot.guilds)))
    dashboard.BOT["started_at"] = datetime.now(timezone.utc).isoformat()
    try:
        await bot.change_presence(activity=discord.Activity(type=discord.ActivityType.watching, name=BOT_NAME))
    except Exception:
        pass
    print(f"✅ Bot {bot.user} online! ({len(bot.guilds)} servidores)")
    try:
        synced = await bot.tree.sync()
        print(f"✅ {len(synced)} comandos sincronizados.")
    except Exception as e:
        print(f"⚠️ Erro ao sincronizar comandos: {e}")


@bot.listen("on_app_command_completion")
async def on_app_command_completion(interaction: discord.Interaction, command: app_commands.Command):
    try:
        db.log_command(command.name, interaction.user.id, interaction.guild_id or 0)
    except Exception:
        pass


async def load_cogs():
    for file in os.listdir("cogs"):
        if file.endswith(".py") and not file.startswith("__"):
            await bot.load_extension(f"cogs.{file[:-3]}")
            print(f"✅ Cog carregado: {file}")


@bot.tree.error
async def on_app_error(interaction: discord.Interaction, error: app_commands.AppCommandError):
    embed = discord.Embed(color=discord.Color.red())
    if isinstance(error, app_commands.MissingPermissions):
        embed.title = "❌ Sem permissão"
        embed.description = "Você não tem permissão para usar este comando."
    elif isinstance(error, app_commands.BotMissingPermissions):
        embed.title = "❌ Bot sem permissão"
        embed.description = "O bot não tem permissão para executar essa ação. Confira os cargos."
    else:
        embed.title = "❌ Erro"
        embed.description = f"```{error}```"
    try:
        await interaction.response.send_message(embed=embed, ephemeral=True)
    except discord.HTTPException:
        await interaction.followup.send(embed=embed, ephemeral=True)


async def main():
    db.init_db()
    if os.getenv("NO_DASHBOARD") != "1":
        dashboard.start(bot)
    async with bot:
        await load_cogs()
        await bot.start(TOKEN)


if __name__ == "__main__":
    asyncio.run(main())
