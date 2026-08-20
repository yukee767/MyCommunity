import time

import aiohttp
import discord
from discord import app_commands
from discord.ext import commands

import db


def calcular(expressao: str) -> float:
    tokens = []
    num = ""
    for ch in expressao.replace(" ", ""):
        if ch.isdigit() or ch == ".":
            num += ch
        else:
            if num:
                tokens.append(float(num))
                num = ""
            if ch in "+-*/()":
                tokens.append(ch)
            else:
                raise ValueError("Caractere inválido")
    if num:
        tokens.append(float(num))
    if not tokens:
        raise ValueError("Expressão vazia")

    pos = 0

    def parse_expr():
        nonlocal pos
        val = parse_term()
        while pos < len(tokens) and tokens[pos] in ("+", "-"):
            op = tokens[pos]
            pos += 1
            right = parse_term()
            val = val + right if op == "+" else val - right
        return val

    def parse_term():
        nonlocal pos
        val = parse_factor()
        while pos < len(tokens) and tokens[pos] in ("*", "/"):
            op = tokens[pos]
            pos += 1
            right = parse_factor()
            if op == "*":
                val *= right
            else:
                if right == 0:
                    raise ValueError("Divisão por zero")
                val /= right
        return val

    def parse_factor():
        nonlocal pos
        if pos < len(tokens) and tokens[pos] == "(":
            pos += 1
            val = parse_expr()
            if pos < len(tokens) and tokens[pos] == ")":
                pos += 1
            return val
        val = tokens[pos]
        pos += 1
        return val

    result = parse_expr()
    if result == int(result):
        return int(result)
    return round(result, 4)


class MarriageConfirm(discord.ui.View):
    def __init__(self, proposer: discord.Member, target: discord.Member):
        super().__init__(timeout=60)
        self.proposer = proposer
        self.target = target

    async def on_timeout(self):
        for item in self.children:
            item.disabled = True

    @discord.ui.button(label="Aceito 💍", style=discord.ButtonStyle.success)
    async def accept(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != self.target.id:
            return await interaction.response.send_message("❌ Só quem foi pedido pode aceitar.", ephemeral=True)
        if db.is_married(interaction.guild.id, self.proposer.id) or db.is_married(interaction.guild.id, self.target.id):
            return await interaction.response.send_message("❌ Alguém já está casado(a) agora.", ephemeral=True)
        db.add_marriage(interaction.guild.id, self.proposer.id, self.target.id)
        for item in self.children:
            item.disabled = True
        await interaction.response.edit_message(
            content=f"💖 **{self.proposer.mention}** e **{self.target.mention}** estão casados! Parabéns! 🎊",
            view=self,
        )

    @discord.ui.button(label="Recusar 💔", style=discord.ButtonStyle.danger)
    async def decline(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != self.target.id:
            return await interaction.response.send_message("❌ Só quem foi pedido pode recusar.", ephemeral=True)
        for item in self.children:
            item.disabled = True
        await interaction.response.edit_message(
            content=f"💔 {self.target.mention} recusou o pedido de **{self.proposer.mention}**.",
            view=self,
        )


class DivorceConfirm(discord.ui.View):
    def __init__(self, requester: discord.Member, partner: discord.Member):
        super().__init__(timeout=60)
        self.requester = requester
        self.partner = partner

    async def on_timeout(self):
        for item in self.children:
            item.disabled = True

    @discord.ui.button(label="Assinar o divórcio 💔", style=discord.ButtonStyle.danger)
    async def confirm(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != self.partner.id:
            return await interaction.response.send_message("❌ Só o cônjuge pode assinar o divórcio.", ephemeral=True)
        removed = db.remove_marriage(interaction.guild.id, self.requester.id, self.partner.id)
        for item in self.children:
            item.disabled = True
        if removed:
            content = f"💔 **{self.requester.mention}** e **{self.partner.mention}** se divorciaram oficialmente."
        else:
            content = "ℹ️ O casamento já não existia mais."
        await interaction.response.edit_message(content=content, view=self)

    @discord.ui.button(label="Não vou assinar ✋", style=discord.ButtonStyle.secondary)
    async def decline(self, interaction: discord.Interaction, button: discord.ui.Button):
        if interaction.user.id != self.partner.id:
            return await interaction.response.send_message("❌ Só o cônjuge pode responder.", ephemeral=True)
        for item in self.children:
            item.disabled = True
        await interaction.response.edit_message(
            content=f"👀 {self.partner.mention} não aceitou o divórcio. O casamento continua!",
            view=self,
        )


class Fun(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    # ---------- KISS ----------
    @app_commands.command(name="kiss", description="Beija outro usuário com um gif fofo")
    async def kiss(self, interaction: discord.Interaction, user: discord.Member):
        gif = None
        async with aiohttp.ClientSession() as session:
            try:
                async with session.get("https://api.waifu.pics/sfw/kiss", timeout=aiohttp.ClientTimeout(total=15)) as resp:
                    if resp.status == 200:
                        data = await resp.json()
                        gif = data.get("url")
            except Exception:
                gif = None
            if not gif:
                try:
                    async with session.get("https://nekos.best/api/v2/kiss", timeout=aiohttp.ClientTimeout(total=15)) as resp:
                        if resp.status == 200:
                            data = await resp.json()
                            gif = data.get("results", [{}])[0].get("url")
                except Exception:
                    gif = None
        if not gif:
            gif = "https://i.imgur.com/VwmZ8bH.gif"
        embed = discord.Embed(
            description=f"💋 **{interaction.user.mention}** deu um beijo em **{user.mention}**!",
            color=discord.Color.pink(),
        )
        embed.set_image(url=gif)
        await interaction.response.send_message(embed=embed)

    # ---------- MARRIED ----------
    @app_commands.command(name="married", description="Pede alguém em casamento (a pessoa precisa confirmar)")
    async def married(self, interaction: discord.Interaction, user: discord.Member = None):
        if user is None:
            partner_id = db.find_partner(interaction.guild.id, interaction.user.id)
            if partner_id:
                embed = discord.Embed(
                    title="💖 Casamento ativo",
                    description=f"Você está casado(a) com <@{partner_id}>.",
                    color=discord.Color.pink(),
                )
                return await interaction.response.send_message(embed=embed)
            return await interaction.response.send_message(
                "ℹ️ Você não está casado(a). Use `/married @usuário` para pedir.",
                ephemeral=True,
            )

        if user.id == interaction.user.id:
            return await interaction.response.send_message("❌ Você não pode casar consigo mesmo.", ephemeral=True)
        if user.bot:
            return await interaction.response.send_message("❌ Bots não podem casar. 💔", ephemeral=True)
        if db.is_married(interaction.guild.id, interaction.user.id):
            return await interaction.response.send_message("❌ Você já está casado(a). Use `/divorce` para terminar.", ephemeral=True)
        if db.is_married(interaction.guild.id, user.id):
            return await interaction.response.send_message("❌ Essa pessoa já está casada.", ephemeral=True)

        view = MarriageConfirm(interaction.user, user)
        embed = discord.Embed(
            title="💍 Pedido de casamento!",
            description=f"**{interaction.user.mention}** pediu **{user.mention}** em casamento!\n\n{user.mention}, você aceita?",
            color=discord.Color.pink(),
        )
        embed.set_footer(text="O pedido expira em 60 segundos.")
        await interaction.response.send_message(embed=embed, view=view)

    # ---------- DIVORCE ----------
    @app_commands.command(name="divorce", description="Pedido de divórcio (a outra pessoa precisa assinar)")
    async def divorce(self, interaction: discord.Interaction):
        partner_id = db.find_partner(interaction.guild.id, interaction.user.id)
        if partner_id is None:
            return await interaction.response.send_message(
                "ℹ️ Você não está casado(a), não precisa de divórcio. 💔",
                ephemeral=True,
            )
        partner = interaction.guild.get_member(partner_id)
        if partner is None:
            return await interaction.response.send_message(
                "❌ Seu cônjuge não está mais no servidor.",
                ephemeral=True,
            )
        view = DivorceConfirm(interaction.user, partner)
        embed = discord.Embed(
            title="💔 Pedido de divórcio",
            description=f"**{interaction.user.mention}** quer se divorciar de **{partner.mention}**.\n\n{partner.mention}, você assina?",
            color=discord.Color.dark_red(),
        )
        embed.set_footer(text="O pedido expira em 60 segundos.")
        await interaction.response.send_message(embed=embed, view=view)

    # ---------- PING ----------
    @app_commands.command(name="ping", description="Testa a conexão do bot com o servidor")
    async def ping(self, interaction: discord.Interaction):
        start = time.monotonic()
        await interaction.response.defer()
        end = time.monotonic()
        api_latency = round((end - start) * 1000, 2)
        ws_latency = round(self.bot.latency * 1000, 2)
        embed = discord.Embed(
            title="🏓 Pong!",
            description=f"**Latência da API:** {api_latency}ms\n**Latência WebSocket:** {ws_latency}ms",
            color=discord.Color.green(),
        )
        embed.set_footer(text="Comando executado em tempo real pelo bot.")
        await interaction.followup.send(embed=embed)

    # ---------- CALCULATOR ----------
    @app_commands.command(name="calculator", description="Calcula contas de + - × ÷ (ex: 10 + 5 * 2)")
    async def calculator(self, interaction: discord.Interaction, expressao: str):
        try:
            resultado = calcular(expressao)
        except Exception as e:
            embed = discord.Embed(
                title="❌ Expressão inválida",
                description=f"Use apenas números e + - * / ( ).\n```{e}```",
                color=discord.Color.red(),
            )
            return await interaction.response.send_message(embed=embed)
        embed = discord.Embed(
            title="🧮 Calculadora",
            description=f"```\n{expressao} = {resultado}\n```",
            color=discord.Color.blue(),
        )
        embed.set_footer(text=f"Pedido por {interaction.user.display_name}")
        await interaction.response.send_message(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(Fun(bot))