# 🚀 PROJETO 60maisPlay - Documentação Completa

**Data:** 19/02/2026
**Status:** Desenvolvimento / Testes

---

## 📊 RESUMO DO PROJETO

**Objetivo:** Criar um bot no WhatsApp que permite alunos idosos navegar pela plataforma de cursos 60maisPlay sem precisar abrir o navegador.

**Funcionalidades:**
- Menu interativo no WhatsApp
- Navegação por cursos e aulas
- FAQ automático sobre segurança digital
- Respostas automáticas 24/7

---

## 🏗️ ARQUITETURA ATUAL (DESENVOLVIMENTO)

```
┌─────────────────┐
│   WhatsApp      │
│   (Mensagem)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OpenClaw       │
│  Gateway        │
│  (localhost)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  CRON (1 min)   │
│  + bot-simples.js│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Arquivos JSON  │
│  (estado/logs)  │
└─────────────────┘
```

---

## ⚠️ LIMITAÇÕES ATUAIS

| Problema | Solução |
|----------|---------|
| CRON não escala | Usar Webhooks |
| Arquivos JSON | Usar PostgreSQL |
| Logs inconsistentes | Usar banco de dados |
| Sem IA | Integrar OpenAI/LLM |
| Sem concorrência | Usar Redis + Filas |

---

## ✅ ARQUITETURA DE PRODUÇÃO

```
┌─────────────────────────────────────────────────────────────┐
│                     WHATSAPP (500+ usuários)                │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Webhook
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    NGINX (Load Balancer)                    │
│                    Porta 443 (SSL)                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API SERVER (Node.js)                     │
│                                                             │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│   │   Router    │  │  Controller │  │   Service   │        │
│   └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│     Redis       │  │   PostgreSQL    │  │   RabbitMQ      │
│   (Cache/State) │  │    (Dados)      │  │   (Filas)       │
└─────────────────┘  └─────────────────┘  └─────────────────┘
                              │
                              │
                              ▼
                    ┌─────────────────┐
                    │   OpenAI API    │
                    │   (Inteligência │
                    │    Artificial)  │
                    └─────────────────┘
```

---

## 📁 ESTRUTURA DE ARQUIVOS CRIADOS

### Memória e Documentação
- `/root/.openclaw/workspace/memory/configuracao-whatsapp-grupo.md` - Configuração do bot
- `/root/.openclaw/workspace/memory/acesso-60maisplay.md` - Acesso à plataforma
- `/root/.openclaw/workspace/memory/automacoes-60maisplay.md` - Ideias de automação
- `/root/.openclaw/workspace/memory/whatsapp-60maisplay-integracao.md` - Integração WhatsApp
- `/root/.openclaw/workspace/memory/mission-control.md` - Dashboard

### Scripts
- `/root/.openclaw/workspace/bot-whatsapp.js` - Bot principal
- `/root/.openclaw/workspace/bot-whatsapp-v2.js` - Bot versão 2
- `/root/.openclaw/workspace/bot-simples.js` - Bot simplificado
- `/root/.openclaw/workspace/menu-whatsapp.js` - Menus
- `/root/.openclaw/workspace/faq-whatsapp.js` - FAQ
- `/root/.openclaw/workspace/60maisplay-browser.js` - Acesso plataforma
- `/root/.openclaw/workspace/60maisplay-explorer.js` - Exploração
- `/root/.openclaw/workspace/dica-diaria-60mais.js` - Dicas diárias

---

## 🔑 INFORMAÇÕES IMPORTANTES

### Credenciais
| Serviço | Valor |
|---------|-------|
| **Gateway Token** | `pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE` |
| **Bot WhatsApp** | `+5511920990009` |
| **Admin** | `+5511953545939` |
| **Grupo Segurança** | `120363407488049190@g.us` |
| **Grupo Tecnologia** | `120363375518105627@g.us` |

### URLs
| Serviço | URL |
|---------|-----|
| **Mission Control** | https://ceaseless-puma-611.convex.cloud |
| **60maisPlay** | https://60maiscursos.com.br |
| **OpenClaw Gateway** | http://localhost:18789 |

---

## 📚 CURSOS MAPEADOS

| # | Curso | Aulas |
|---|-------|-------|
| 1 | WhatsApp sem Mistérios | 5 |
| 2 | Compras na Internet | 5 |
| 3 | Inteligência Artificial | 3 |
| 4 | SmartPhone | 3 |
| 5 | Gmail e Email | 3 |
| 6 | Netflix na TV | 3 |
| 7 | Gov.br | 2 |
| 8 | Zoom | 2 |

---

## 🤖 FAQ CONFIGURADO

| Tema | Palavras-chave |
|------|----------------|
| Cadeado | cadeado, site seguro, https |
| Senha | senha, password, código |
| Golpe | golpe, golpista, clonado, hackeado |
| PIX | pix, transferência |
| WhatsApp | whatsapp, zap, wpp |
| Email | email, spam, phishing |
| Download | download, baixar |

---

## ⏰ CRONs ATIVOS

| Nome | Frequência | Função |
|------|------------|--------|
| Dica Diária 60+ | 8h (diário) | Envia dica no grupo |
| Bot WhatsApp | 1 min | Monitora mensagens |
| Mission Control | 30 min | Atualiza dashboard |

---

## 🔧 PRÓXIMOS PASSOS

### Fase 1 - Webhooks ✅ (Implementar)
- [ ] Configurar webhook no OpenClaw
- [ ] Criar endpoint para receber mensagens
- [ ] Responder em tempo real

### Fase 2 - Banco de Dados
- [ ] Configurar PostgreSQL
- [ ] Migrar estado dos usuários
- [ ] Salvar histórico de conversas

### Fase 3 - Inteligência Artificial
- [ ] Integrar OpenAI API
- [ ] Criar prompts personalizados
- [ ] Respostas mais inteligentes

### Fase 4 - Produção
- [ ] Servidor dedicado
- [ ] SSL/HTTPS
- [ ] Monitoramento
- [ ] Backup automático

---

## 📊 STATUS ATUAL

| Sistema | Status |
|---------|--------|
| Bot WhatsApp | ✅ Funcionando (gateway resolvido em 20/02/2026) |
| Webhooks | ❌ Não configurado |
| Banco de Dados | ❌ Não configurado |
| IA | ❌ Não integrada |
| Produção | ❌ Não configurado |

---

*Documento atualizado em 19/02/2026 - 21:50 (Brasília)*
