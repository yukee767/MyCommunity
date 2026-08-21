"use client";
import { createContext, useContext } from "react";

export type Lang = "en" | "pt";

export const translations = {
  en: {
    welcome: "Welcome",
    welcomeSub: "find commonly used dashboard pages below.",
    stats: { status: "Status", servers: "Servers", uptime: "Uptime", commands: "Commands", marriages: "Marriages", giveaways: "Giveaways" },
    online: "Online", offline: "Offline",
    cards: {
      custom: { title: "Custom messages", desc: "Create fully customized messages called templates and pack them with your very own embeds, buttons and select menus. Use /embed and /say.", action: "Create template" },
      mod: { title: "Moderation cases", desc: "View and edit all moderation cases using the dashboard.", action: "View cases", suffix: "cases registered." },
      reports: { title: "User reports", desc: "Allow users to report others and fully customize how to handle them. Integrates with /kiss, /married.", action: "Configure reports" },
      greetings: { title: "Role greetings", desc: "Welcome users to their new role by using MyCommunity's role assignment messages. /addrole and /addroleall.", action: "Show role messages" },
      prefix: { title: "Prefix & calculator", desc: "Quick actions and utilities. /calculator and /ping — all logged in local SQLite.", action: "Open utilities" },
      ai: { title: "AI Moderation", desc: "Use artificial intelligence to assist you in moderating your community. /gpt text + /translation.", action: "Configure AI" },
    },
    sidebar: {
      general: "General Settings", commands: "Commands", messages: "Messages", branding: "Custom Branding",
      autoMod: "Auto Moderation", moderation: "Moderation", social: "Social Notifications", joinRoles: "Join Roles",
      reaction: "Reaction Roles", welcomeMsg: "Welcome Messages", connections: "Role Connections", logging: "Logging", giveaways: "Giveaways", marriages: "Marriages",
    },
    pages: {
      commandsTitle: "Commands", commandsSub: "Usage of each MyCommunity slash command.",
      usage: "Usage by command", recent: "Recent commands", command: "Command", times: "Times", user: "User", date: "Date", noUsage: "No usage yet", noLogs: "No logs",
      marriagesTitle: "Marriages", marriagesSub: "All marriages saved in local SQLite.", noMarriages: "No marriages yet. Use /married in Discord.", spouse1: "Spouse 1", spouse2: "Spouse 2",
      giveawaysTitle: "Giveaways", giveawaysSub: "Giveaways created with /giveway.", noGiveaways: "No giveaways yet.", prize: "Prize", winners: "Winners", participants: "Participants", ends: "Ends", status: "Status",
    },
  },
  pt: {
    welcome: "Bem-vindo",
    welcomeSub: "encontre as páginas mais usadas abaixo.",
    stats: { status: "Status", servers: "Servidores", uptime: "Uptime", commands: "Comandos", marriages: "Casamentos", giveaways: "Sorteios" },
    online: "Online", offline: "Offline",
    cards: {
      custom: { title: "Mensagens personalizadas", desc: "Crie mensagens totalmente personalizadas chamadas templates com seus próprios embeds, botões e menus. Use /embed e /say.", action: "Criar template" },
      mod: { title: "Casos de moderação", desc: "Veja e edite todos os casos de moderação pelo painel.", action: "Ver casos", suffix: "casos registrados." },
      reports: { title: "Denúncias", desc: "Permita que usuários denunciem outros e personalize o fluxo. Integra com /kiss, /married.", action: "Configurar denúncias" },
      greetings: { title: "Boas-vindas por cargo", desc: "Dê boas-vindas a novos cargos com mensagens do MyCommunity. /addrole e /addroleall.", action: "Ver mensagens" },
      prefix: { title: "Prefixo e calculadora", desc: "Ações rápidas e utilitários. /calculator e /ping — tudo logado no SQLite local.", action: "Abrir utilitários" },
      ai: { title: "Moderação com IA", desc: "Use inteligência artificial para moderar sua comunidade. /gpt texto + /translation.", action: "Configurar IA" },
    },
    sidebar: {
      general: "Configurações Gerais", commands: "Comandos", messages: "Mensagens", branding: "Marca Personalizada",
      autoMod: "Auto Moderação", moderation: "Moderação", social: "Notificações Sociais", joinRoles: "Cargos ao Entrar",
      reaction: "Cargos por Reação", welcomeMsg: "Mensagens de Boas-vindas", connections: "Conexões de Cargos", logging: "Logs", giveaways: "Sorteios", marriages: "Casamentos",
    },
    pages: {
      commandsTitle: "Comandos", commandsSub: "Uso de cada slash command do MyCommunity.",
      usage: "Uso por comando", recent: "Comandos recentes", command: "Comando", times: "Vezes", user: "Usuário", date: "Data", noUsage: "Nenhum uso ainda", noLogs: "Sem logs",
      marriagesTitle: "Casamentos", marriagesSub: "Todos os casamentos salvos no SQLite local.", noMarriages: "Nenhum casamento ainda. Use /married no Discord.", spouse1: "Cônjuge 1", spouse2: "Cônjuge 2",
      giveawaysTitle: "Sorteios", giveawaysSub: "Sorteios criados com /giveway.", noGiveaways: "Nenhum sorteio ainda.", prize: "Prêmio", winners: "Ganhadores", participants: "Participantes", ends: "Termina", status: "Status",
    },
  },
} as const;

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: any }>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export const useLang = () => useContext(LangContext);
