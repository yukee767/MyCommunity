import discord
from discord import app_commands
from discord.ext import commands


class Roles(commands.Cog):
    def __init__(self, bot: commands.Bot):
        self.bot = bot

    # ---------- ADD ROLE ----------
    @app_commands.command(name="addrole", description="Adiciona um cargo a um usuário")
    @app_commands.default_permissions(manage_roles=True)
    @app_commands.checks.has_permissions(manage_roles=True)
    async def addrole(self, interaction: discord.Interaction, user: discord.Member, cargo: discord.Role):
        if cargo >= interaction.guild.me.top_role:
            return await interaction.response.send_message("❌ Eu não posso aplicar um cargo acima ou igual ao meu.", ephemeral=True)
        if cargo in user.roles:
            return await interaction.response.send_message(f"❌ {user.mention} já tem o cargo {cargo.mention}.", ephemeral=True)
        await user.add_roles(cargo)
        embed = discord.Embed(
            title="✅ Cargo adicionado",
            description=f"{cargo.mention} foi adicionado a {user.mention}.",
            color=discord.Color.green(),
        )
        await interaction.response.send_message(embed=embed)

    # ---------- REMOVE ROLE ----------
    @app_commands.command(name="removerole", description="Remove um cargo de um usuário")
    @app_commands.default_permissions(manage_roles=True)
    @app_commands.checks.has_permissions(manage_roles=True)
    async def removerole(self, interaction: discord.Interaction, user: discord.Member, cargo: discord.Role):
        if cargo not in user.roles:
            return await interaction.response.send_message(f"❌ {user.mention} não tem o cargo {cargo.mention}.", ephemeral=True)
        await user.remove_roles(cargo)
        embed = discord.Embed(
            title="✅ Cargo removido",
            description=f"{cargo.mention} foi removido de {user.mention}.",
            color=discord.Color.green(),
        )
        await interaction.response.send_message(embed=embed)

    # ---------- ADD ROLE ALL ----------
    @app_commands.command(name="addroleall", description="Adiciona um cargo a todos os usuários")
    @app_commands.default_permissions(manage_roles=True)
    @app_commands.checks.has_permissions(manage_roles=True)
    async def addroleall(self, interaction: discord.Interaction, cargo: discord.Role):
        if cargo >= interaction.guild.me.top_role:
            return await interaction.response.send_message("❌ Eu não posso aplicar um cargo acima ou igual ao meu.", ephemeral=True)
        await interaction.response.defer()
        members = [m for m in interaction.guild.members if not m.bot]
        added = 0
        for m in members:
            if cargo not in m.roles:
                try:
                    await m.add_roles(cargo)
                    added += 1
                except Exception:
                    pass
        embed = discord.Embed(
            title="✅ Cargo adicionado a todos",
            description=f"{cargo.mention} foi adicionado a **{added}** usuários.",
            color=discord.Color.green(),
        )
        await interaction.followup.send(embed=embed)

    # ---------- REMOVE ROLE ALL ----------
    @app_commands.command(name="removeroleall", description="Remove um cargo de todos os usuários")
    @app_commands.default_permissions(manage_roles=True)
    @app_commands.checks.has_permissions(manage_roles=True)
    async def removeroleall(self, interaction: discord.Interaction, cargo: discord.Role):
        await interaction.response.defer()
        members = [m for m in interaction.guild.members if not m.bot]
        removed = 0
        for m in members:
            if cargo in m.roles:
                try:
                    await m.remove_roles(cargo)
                    removed += 1
                except Exception:
                    pass
        embed = discord.Embed(
            title="✅ Cargo removido de todos",
            description=f"{cargo.mention} foi removido de **{removed}** usuários.",
            color=discord.Color.green(),
        )
        await interaction.followup.send(embed=embed)


async def setup(bot: commands.Bot):
    await bot.add_cog(Roles(bot))