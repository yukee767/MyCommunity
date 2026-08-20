# 🤖 aMyCommunity — Bot Interativo para Comunidades

Bot para Discord com **22 comandos** em slash, feito com **discord.py** + Python,
banco de dados **SQLite** local e **dashboard web** rodando no seu PC.

## 🚀 Como rodar

1. Crie o bot no [Discord Developer Portal](https://discord.com/developers/applications) com o nome **aMyCommunity** (veja o passo a passo abaixo).
2. Copie o token para um arquivo `.env` (use o `.env.example` como modelo).
3. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```
4. Rode o bot (o dashboard sobe sozinho em `http://127.0.0.1:5000`):
   ```bash
   python main.py
   ```
   Para rodar sem dashboard: `set NO_DASHBOARD=1` antes.

> 💾 O banco de dados fica salvo em `data.db` (na mesma pasta) — seus dados de
> casamentos, sorteios e logs ficam **no seu PC**. Apenas o código é publicado no GitHub.

## 🛠️ Necessário no Developer Portal

- **Intents privilegiados**: ative **Server Members Intent** e **Message Content Intent** (em *Bot > Privileged Gateway Intents*).
- **Invite**: use uma permissão alta (Administrator ou as listadas abaixo) para o bot funcionar.

## 📚 Comandos

### Moderação (staff)
| Comando | Descrição |
|---|---|
| `/ban` | Bane um usuário |
| `/unban` | Remove o banimento |
| `/mute` | Silencia (timeout) por minutos |
| `/unmute` | Remove o silenciamento |
| `/lock` | Fecha um canal |
| `/lockall` | Fecha todos os canais públicos |
| `/unlock` | Abre um canal trancado |
| `/unlockall` | Abre todos os canais trancados |

### Utilitários (admin/mod)
| Comando | Descrição |
|---|---|
| `/say` | O bot envia uma mensagem |
| `/embed` | Envia um embed (título, descrição, imagem, cor, rodapé) |

### Diversão (todos)
| Comando | Descrição |
|---|---|
| `/kiss` | Beija alguém com um GIF |
| `/married` | Pede em casamento (a pessoa confirma pelo botão) |
| `/divorce` | Pedido de divórcio (o cônjuge assina pelo botão) |
| `/ping` | Latência da API + WebSocket |
| `/calculator` | Calcula + - * / (ex: `10 + 5 * 2`) |

### Inteligência (todos)
| Comando | Descrição |
|---|---|
| `/gpt` | Pergunta para IA (API gratuita) |
| `/translation` | Traduz texto (ex: `para: en`) |

### Cargos (staff)
| Comando | Descrição |
|---|---|
| `/addrole` | Adiciona cargo a um usuário |
| `/removerole` | Remove cargo de um usuário |
| `/addroleall` | Adiciona cargo a todos |
| `/removeroleall` | Remove cargo de todos |

### Sorteio (todos)
| Comando | Descrição |
|---|---|
| `/giveway` | Cria um sorteio com botão de participar |

## 💾 Banco de dados (SQLite local)

Todos os dados ficam em `data.db` na pasta do projeto:
- **Casamentos** (guild, cônjuges e data)
- **Sorteios** (prêmio, participantes, status)
- **Logs de comandos** (quem usou o quê)

O arquivo `data.db` é ignorado pelo git — seus dados nunca são enviados ao GitHub.

## 🖥️ Dashboard local

Painel web que sobe junto com o bot (rodando **no seu PC**):

```
http://127.0.0.1:5000
```

Mostra: status online, servidores, tempo online, comandos usados, top usuários,
casamentos, sorteios e histórico de comandos. Atualiza sozinho a cada 15s.
(Para abrir em outro dispositivo na mesma rede, rode `python dashboard.py` e
use o IP da sua máquina — opcional.)

## 🌐 APIs usadas (100% gratuitas, sem key)

- **GIF de beijo**: [waifu.pics](https://waifu.pics) (fallback: nekos.best)
- **GPT**: [pollinations.ai](https://text.pollinations.ai)
- **Tradução**: [LibreTranslate](https://libretranslate.com) (fallback: MyMemory)

## ⚠️ Permissões do bot

Para os comandos de staff funcionarem, o bot precisa de:
- `Ban Members`, `Moderate Members`, `Manage Channels`, `Manage Messages` e `Manage Roles` (ou a permissão Admin).

Cada comando só aparece para quem tem a permissão correspondente.