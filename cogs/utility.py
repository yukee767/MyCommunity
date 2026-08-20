import discord
from discord import app_commands
from discord.ext import commands

COLORS = {
    "azul": discord.Color.blue(),
    "vermelho": discord.Color.red(),
    "verde": discord.Color.green(),
    "amarelo": discord.Color.gold(),
    "roxo": discord.Color.purple(),
    "rosa": discord.Color.pink(),
    "laranja": discord.Color.orange(),
    "preto": discord.Color.dark_grey(),
    "branco": discord.Color.light_gray(),
    "blurple": discord.Color.blurple(),
    "teal": discord.Color.teal(),
}


class Utility(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    # ---------- SAY ----------
    @app_commands.command(name="say", description="Faz o bot enviar uma mensagem")
    @app_commands.default_permissions(manage_messages=True)
    @app_commands.checks.has_permissions(manage_messages=True)
    async def say(self, interaction: discord.Interaction, mensagem: str, canal: discord.TextChannel = None):
        channel = canal or interaction.channel
        await channel.send(mensagem)
        await interaction.response.send_message("✅ Mensagem enviada.", ephemeral=True)

    # ---------- EMBED ----------
    @app_commands.command(name="embed", description="Cria uma mensagem com embed (título, texto, imagem e cor)")
    @app_commands.default_permissions(manage_messages=True)
    @app_commands.checks.has_permissions(manage_messages=True)
    async def embed(
        self,
        interaction: discord.Interaction,
        titulo: str,
        descricao: str = None,
        imagem: str = None,
        cor: str = "azul",
        rodape: str = None,
        canal: discord.TextChannel = None,
    ):
        color = COLORS.get(cor.lower(), discord.Color.blue())
        e = discord.Embed(title=titulo, description=descricao, color=color)
        if imagem:
            e.set_image(url=imagem)
        if rodape:
            e.set_footer(text=rodape)
        channel = canal or interaction.channel
        await channel.send(embed=e)
        await interaction.response.send_message("✅ Embed enviado.", ephemeral=True)


async def setup(bot: commands.Bot):
    await bot.add_cog(Utility(bot))
