import aiohttp
import discord
from discord import app_commands
from discord.ext import commands


class AI(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    # ---------- GPT ----------
    @app_commands.command(name="gpt", description="Faz uma pergunta para a inteligência artificial")
    async def gpt(self, interaction: discord.Interaction, pergunta: str):
        await interaction.response.defer()
        resposta = ""
        async with aiohttp.ClientSession() as session:
            try:
                payload = {
                    "model": "openai",
                    "messages": [
                        {"role": "system", "content": "Você é um assistente amigável que responde em português de forma clara e direta."},
                        {"role": "user", "content": pergunta},
                    ],
                    "temperature": 0.7,
                }
                async with session.post(
                    "https://text.pollinations.ai/openai",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=90),
                ) as resp:
                    if resp.status == 200:
                        resposta = (await resp.text()).strip()
            except Exception:
                resposta = ""

        if not resposta:
            resposta = "❌ A IA não conseguiu responder agora. Tente novamente em instantes."

        embed = discord.Embed(title="🤖 GPT", color=discord.Color.blurple())
        embed.add_field(name="Pergunta", value=pergunta[:1024], inline=False)
        embed.add_field(name="Resposta", value=resposta[:1024], inline=False)
        embed.set_footer(text=f"Pedido por {interaction.user.display_name}")
        await interaction.followup.send(embed=embed)

    # ---------- TRANSLATION ----------
    @app_commands.command(name="translation", description="Traduz um texto (ex: /translation Olá, mundo para: en)")
    async def translation(
        self,
        interaction: discord.Interaction,
        texto: str,
        para: str = "pt",
        de: str = "auto",
    ):
        await interaction.response.defer()
        traducao = None
        async with aiohttp.ClientSession() as session:
            # Tenta LibreTranslate (suporta auto-detect)
            try:
                payload = {"q": texto, "source": de, "target": para, "format": "text"}
                async with session.post(
                    "https://libretranslate.com/translate",
                    json=payload,
                    timeout=aiohttp.ClientTimeout(total=20),
                ) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        traducao = data.get("translatedText", "")
            except Exception:
                traducao = None

            # Fallback: MyMemory
            if not traducao:
                try:
                    langpair = f"{de if de != 'auto' else 'pt'}|{para}"
                    async with session.get(
                        "https://api.mymemory.translated.net/get",
                        params={"q": texto, "langpair": langpair},
                        timeout=aiohttp.ClientTimeout(total=20),
                    ) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            traducao = data.get("responseData", {}).get("translatedText", "")
                except Exception:
                    traducao = None

        if not traducao:
            traducao = "❌ Não foi possível traduzir. Tente novamente."

        embed = discord.Embed(title="🌐 Tradução", color=discord.Color.teal())
        embed.add_field(name=f"Original ({de})", value=texto[:1024], inline=False)
        embed.add_field(name=f"Tradução ({para})", value=traducao[:1024], inline=False)
        await interaction.followup.send(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(AI(bot))
