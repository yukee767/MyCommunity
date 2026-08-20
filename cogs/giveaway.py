import asyncio
import random
from datetime import timedelta

import discord
from discord import app_commands
from discord.ext import commands

import db


class GiveawayView(discord.ui.View):
    def __init__(self, message_id: int):
        super().__init__(timeout=None)
        self.message_id = message_id

    @discord.ui.button(label="🎉 Participar", style=discord.ButtonStyle.success)
    async def join(self, interaction: discord.Interaction, button: discord.ui.Button):
        if not db.giveaway_active(self.message_id):
            return await interaction.response.send_message("❌ Este sorteio já terminou.", ephemeral=True)
        participants = db.giveaway_participants(self.message_id)
        if interaction.user.id in participants:
            participants.discard(interaction.user.id)
            await interaction.response.send_message("❌ Você saiu do sorteio.", ephemeral=True)
        else:
            participants.add(interaction.user.id)
            await interaction.response.send_message("🎉 Você entrou no sorteio!", ephemeral=True)
        db.save_participants(self.message_id, participants)
        embed = interaction.message.embeds[0]
        for idx, field in enumerate(embed.fields):
            if field.name == "Participantes":
                embed.set_field_at(idx, name="Participantes", value=str(len(participants)), inline=True)
        await interaction.message.edit(embed=embed)


class Giveaway(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    @app_commands.command(name="giveway", description="Inicia um sorteio no canal")
    async def giveway(self, interaction: discord.Interaction, premio: str, duracao: int = 60, ganhadores: int = 1):
        if duracao < 5:
            return await interaction.response.send_message("❌ A duração mínima é de 5 segundos.", ephemeral=True)
        if ganhadores < 1:
            return await interaction.response.send_message("❌ O número de ganhadores deve ser maior que 0.", ephemeral=True)

        embed = discord.Embed(
            title="🎉 GIVEAWAY 🎉",
            description=f"**Prêmio:** {premio}\n**Ganhador(es):** {ganhadores}\n\nClique no botão abaixo para participar!",
            color=discord.Color.gold(),
        )
        embed.add_field(name="Participantes", value="0", inline=True)
        view = GiveawayView(0)  # message id preenchido abaixo
        msg = await interaction.channel.send(embed=embed, view=view)
        view.message_id = msg.id

        ends_at = discord.utils.utcnow() + timedelta(seconds=duracao)
        db.create_giveaway(msg.id, interaction.guild.id, premio, ganhadores, interaction.user.id, ends_at.strftime("%Y-%m-%d %H:%M:%S"))

        await interaction.response.send_message(f"✅ Sorteio criado em {msg.jump_url}", ephemeral=True)
        self.bot.loop.create_task(self.end_giveaway(msg, premio, ganhadores, duracao))

    async def end_giveaway(self, msg: discord.Message, premio: str, ganhadores: int, duracao: int):
        await asyncio.sleep(duracao)
        participants = db.giveaway_participants(msg.id)
        db.finish_giveaway(msg.id)

        final_embed = discord.Embed(
            title="🎉 GIVEAWAY ENCERRADO 🎉",
            description=f"**Prêmio:** {premio}\n\n👥 **Participantes:** {len(participants)}",
            color=discord.Color.dark_gold(),
        )
        view = GiveawayView(msg.id)
        for item in view.children:
            item.disabled = True
        await msg.edit(embed=final_embed, view=view)

        if not participants:
            await msg.reply("😔 Ninguém participou deste sorteio.")
            return

        winners = random.sample(list(participants), min(ganhadores, len(participants)))
        mentions = ", ".join(f"<@{w}>" for w in winners)
        await msg.reply(f"🏆 **Parabéns, {mentions}!**\nVocês ganharam: **{premio}**! 🎊")


async def setup(bot: commands.Bot):
    await bot.add_cog(Giveaway(bot))