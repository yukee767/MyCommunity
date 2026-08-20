from datetime import timedelta

import discord
from discord import app_commands
from discord.ext import commands


class Moderation(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot
        # guild_id -> { channel_id: {"send": ... , "add_reactions": ...} }
        self.locked: dict[int, dict[int, dict]] = {}

    # ---------- BAN ----------
    @app_commands.command(name="ban", description="Bane um usuário do servidor")
    @app_commands.default_permissions(ban_members=True)
    @app_commands.checks.has_permissions(ban_members=True)
    async def ban(self, interaction: discord.Interaction, user: discord.User, motivo: str = "Não informado"):
        await interaction.guild.ban(user, reason=motivo)
        embed = discord.Embed(
            title="🔨 Usuário banido",
            description=f"{user.mention} foi banido.\n**Motivo:** {motivo}",
            color=discord.Color.red(),
        )
        await interaction.response.send_message(embed=embed)

    # ---------- UNBAN ----------
    @app_commands.command(name="unban", description="Remove o banimento de um usuário")
    @app_commands.default_permissions(ban_members=True)
    @app_commands.checks.has_permissions(ban_members=True)
    async def unban(self, interaction: discord.Interaction, user: discord.User):
        await interaction.guild.unban(user)
        embed = discord.Embed(
            title="✅ Banimento removido",
            description=f"{user.mention} foi desbanido.",
            color=discord.Color.green(),
        )
        await interaction.response.send_message(embed=embed)

    # ---------- MUTE ----------
    @app_commands.command(name="mute", description="Silencia um usuário por um tempo (minutos)")
    @app_commands.default_permissions(moderate_members=True)
    @app_commands.checks.has_permissions(moderate_members=True)
    async def mute(self, interaction: discord.Interaction, user: discord.Member, minutos: int = 10, motivo: str = "Não informado"):
        if user.id == interaction.user.id:
            return await interaction.response.send_message("❌ Você não pode se silenciar.", ephemeral=True)
        if minutos < 1 or minutos > 40320:
            return await interaction.response.send_message("❌ O tempo deve estar entre 1 minuto e 28 dias.", ephemeral=True)
        await user.timeout(timedelta(minutes=minutos), reason=motivo)
        embed = discord.Embed(
            title="🔇 Usuário silenciado",
            description=f"{user.mention} silenciado por **{minutos} minuto(s)**.\n**Motivo:** {motivo}",
            color=discord.Color.orange(),
        )
        await interaction.response.send_message(embed=embed)

    # ---------- UNMUTE ----------
    @app_commands.command(name="unmute", description="Remove o silenciamento de um usuário")
    @app_commands.default_permissions(moderate_members=True)
    @app_commands.checks.has_permissions(moderate_members=True)
    async def unmute(self, interaction: discord.Interaction, user: discord.Member):
        if user.is_timed_out():
            await user.timeout(None)
            embed = discord.Embed(
                title="🔊 Silenciamento removido",
                description=f"{user.mention} pode falar novamente.",
                color=discord.Color.green(),
            )
            await interaction.response.send_message(embed=embed)
        else:
            await interaction.response.send_message("❌ Esse usuário não está silenciado.", ephemeral=True)

    # ---------- LOCK ----------
    @app_commands.command(name="lock", description="Fecha um canal (ninguém pode enviar mensagens)")
    @app_commands.default_permissions(manage_channels=True)
    @app_commands.checks.has_permissions(manage_channels=True)
    async def lock(self, interaction: discord.Interaction, canal: discord.TextChannel = None):
        channel = canal or interaction.channel
        overwrite = channel.overwrites_for(interaction.guild.default_role)
        self.locked.setdefault(interaction.guild.id, {})[channel.id] = {
            "send": overwrite.send_messages,
            "add_reactions": overwrite.add_reactions,
        }
        overwrite.send_messages = False
        overwrite.add_reactions = False
        await channel.set_permissions(interaction.guild.default_role, overwrite=overwrite)
        embed = discord.Embed(
            title="🔒 Canal trancado",
            description=f"{channel.mention} foi fechado.",
            color=discord.Color.red(),
        )
        await interaction.response.send_message(embed=embed)

    # ---------- LOCKALL ----------
    @app_commands.command(name="lockall", description="Fecha todos os canais públicos do servidor")
    @app_commands.default_permissions(manage_channels=True)
    @app_commands.checks.has_permissions(manage_channels=True)
    async def lockall(self, interaction: discord.Interaction):
        await interaction.response.defer()
        locked_count = 0
        for channel in interaction.guild.channels:
            if isinstance(channel, discord.TextChannel):
                overwrite = channel.overwrites_for(interaction.guild.default_role)
                if overwrite.send_messages is not False:
                    self.locked.setdefault(interaction.guild.id, {})[channel.id] = {
                        "send": overwrite.send_messages,
                        "add_reactions": overwrite.add_reactions,
                    }
                    overwrite.send_messages = False
                    overwrite.add_reactions = False
                    await channel.set_permissions(interaction.guild.default_role, overwrite=overwrite)
                    locked_count += 1
        embed = discord.Embed(
            title="🔒 Todos os canais trancados",
            description=f"{locked_count} canais públicos foram fechados.",
            color=discord.Color.red(),
        )
        await interaction.followup.send(embed=embed)

    # ---------- UNLOCK ----------
    @app_commands.command(name="unlock", description="Abre um canal trancado")
    @app_commands.default_permissions(manage_channels=True)
    @app_commands.checks.has_permissions(manage_channels=True)
    async def unlock(self, interaction: discord.Interaction, canal: discord.TextChannel = None):
        channel = canal or interaction.channel
        saved = self.locked.get(interaction.guild.id, {}).get(channel.id)
        overwrite = channel.overwrites_for(interaction.guild.default_role)
        if saved:
            overwrite.send_messages = saved["send"]
            overwrite.add_reactions = saved["add_reactions"]
            del self.locked[interaction.guild.id][channel.id]
        else:
            overwrite.send_messages = None
            overwrite.add_reactions = None
        await channel.set_permissions(interaction.guild.default_role, overwrite=overwrite)
        embed = discord.Embed(
            title="🔓 Canal aberto",
            description=f"{channel.mention} foi liberado.",
            color=discord.Color.green(),
        )
        await interaction.response.send_message(embed=embed)

    # ---------- UNLOCKALL ----------
    @app_commands.command(name="unlockall", description="Abre todos os canais trancados com /lock e /lockall")
    @app_commands.default_permissions(manage_channels=True)
    @app_commands.checks.has_permissions(manage_channels=True)
    async def unlockall(self, interaction: discord.Interaction):
        await interaction.response.defer()
        guild_locked = self.locked.get(interaction.guild.id, {})
        if not guild_locked:
            embed = discord.Embed(
                title="ℹ️ Nada para abrir",
                description="Nenhum canal foi trancado com /lock ou /lockall.",
                color=discord.Color.blue(),
            )
            return await interaction.followup.send(embed=embed)
        for channel_id, perms in list(guild_locked.items()):
            channel = interaction.guild.get_channel(channel_id)
            if isinstance(channel, discord.TextChannel):
                overwrite = channel.overwrites_for(interaction.guild.default_role)
                overwrite.send_messages = perms["send"]
                overwrite.add_reactions = perms["add_reactions"]
                await channel.set_permissions(interaction.guild.default_role, overwrite=overwrite)
        count = len(guild_locked)
        self.locked.pop(interaction.guild.id, None)
        embed = discord.Embed(
            title="🔓 Todos os canais abertos",
            description=f"{count} canais foram liberados.",
            color=discord.Color.green(),
        )
        await interaction.followup.send(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(Moderation(bot))
