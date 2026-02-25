# 📰 REDAÇÃO 60maisNews - DOCUMENTAÇÃO COMPLETA
## Sistema Autônomo de Newsletter para Idosos

**Última atualização:** 18/02/2026 11:36 UTC

---

## 🎯 VISÃO GERAL

A **Redação 60maisNews** é uma equipe de agentes automatizados que produz uma newsletter diária de tecnologia para pessoas 60+ anos. O sistema é **100% automatizado** e usa dados reais para escolher temas dinâmicos.

### 👥 Equipe de Agentes

| Agente | Cargo | Função |
|--------|-------|--------|
| Agente Chefe | Editor-Chefe | Orquestra toda a redação |
| GANCHOS | Pesquisador de Pautas | Descobre tema (Brave + Analytics) |
| WRITER | Redator | Gera conteúdo |
| VENDAS | Gerente de Monetização | Cria CTAs |
| ENVIO | Distribuidor | Envia emails |
| BLOG | Publicador Web | Publica no WordPress |
| TRELLO | Arquivista | Registra no quadro |

### Persona
- **Professor Luis** - canal 60maisPlay
- Linguagem simples, carinhosa, sem jargões técnicos
- Conteúdo APLICÁVEL - o leitor resolve o problema

---

## ✅ STATUS ATUAL

| Componente | Status | Arquivo |
|------------|--------|---------|
| Brave Search | ✅ Funcionando | `brave-search.js` |
| Google Analytics | ✅ Funcionando | `analytics-maton.js` |
| Histórico de Temas | ✅ Funcionando | `historico-temas.js` |
| Brevo (Email) | ✅ Funcionando | `brevo.js` |
| WordPress (Blog) | ✅ Funcionando | `wordpress.js` |
| Produtos/CTA | ✅ Funcionando | `produtos-60mais.js` |
| Templates HTML | ✅ Funcionando | `newsletter-template.js` |
| CRON | ✅ Configurado | 05:00 UTC |

---

## 📁 ESTRUTURA DE ARQUIVOS

```
/root/.openclaw/workspace/
│
├── 🤖 FLUXO PRINCIPAL
│   ├── ganchos-tema.js          # Descobre tema (Brave + Analytics)
│   ├── escritor-envia.js        # Envia email + publica blog
│   └── agente-chefe-60mais.js   # Executa tudo junto
│
├── 📦 MÓDULOS
│   ├── brave-search.js          # Pesquisa web via Brave
│   ├── analytics-maton.js       # Google Analytics via Maton
│   ├── historico-temas.js       # Controle 30 dias sem repetir
│   ├── brevo.js                 # API de email
│   ├── wordpress.js             # API do blog
│   ├── produtos-60mais.js       # Catálogo R$37
│   └── newsletter-template.js   # Templates HTML
│
├── ⚙️ CONFIGURAÇÕES
│   ├── credenciais-60mais.json  # Todas as credenciais
│   ├── calendario-comercial-60mais-2026.json
│   └── historico-temas.json     # Gerado automaticamente
│
├── 📄 ARQUIVOS TEMPORÁRIOS (gerados no fluxo)
│   ├── tema-selecionado.json    # Tema escolhido
│   └── conteudo-gerado.json     # Conteúdo do Ben
│
└── 📚 SKILLS
    ├── brave-search/            # Skill Brave Search
    └── google-analytics/        # Skill Maton
```

---

## 🔧 CREDENCIAIS CONFIGURADAS

| Serviço | Status | Local |
|---------|--------|-------|
| Brevo | ✅ | `credenciais-60mais.json` |
| WordPress | ✅ | `credenciais-60mais.json` |
| Trello | ✅ | `credenciais-60mais.json` |
| Brave Search | ✅ | `credenciais-60mais.json` |
| Maton (Analytics) | ✅ | `credenciais-60mais.json` |
| WhatsApp | ✅ | (11) 95354-5939 |

---

## 📊 FLUXO DE EXECUÇÃO

### Opção 1: Fluxo Separado (Recomendado)

```bash
# PASSO 1: Descobrir tema
node ganchos-tema.js

# PASSO 2: Ben gera o conteúdo (salva em conteudo-gerado.json)
# (Executado pela IA)

# PASSO 3: Enviar e publicar
node escritor-envia.js
```

### Opção 2: Fluxo Unificado

```bash
node agente-chefe-60mais.js
```

---

## 🎯 SELEÇÃO DE TEMA

### Prioridade de Seleção

1. **Google Analytics** - Posts mais visualizados (se não usado nos últimos 30 dias)
2. **Brave Search** - Tendências do dia (se não usado nos últimos 30 dias)
3. **Fallback Temporal** - Baseado no dia da semana

### Regra de 30 Dias

O sistema **NÃO REPETE** o mesmo tema por 30 dias:

- Arquivo: `historico-temas.json`
- Módulo: `historico-temas.js`
- Funções:
  - `temaRecente(tema)` - Verifica se foi usado
  - `registrarTema(tema)` - Registra uso
  - `temasDisponiveis()` - Lista disponíveis

### Temas Disponíveis

1. golpe PIX
2. WhatsApp segurança
3. videochamada
4. aplicativo idoso
5. segurança celular
6. Google Fotos
7. senha banco
8. Facebook segurança

---

## 📧 ENVIO DE EMAIL

### ⚠️ MODO PRODUÇÃO ATIVO
- `MODO_TESTE = false` ✅
- Envia para lista Brevo ID 4 (~98 assinantes)
- **Verificação de duplicidade implementada** (18/02/2026)

### Modo Teste (desativado)
- `MODO_TESTE = true` (não usar)
- Envia apenas para: `luis7nico@gmail.com`

---

## 💰 PRODUTOS (CTA R$37)

| Tema | Produto | Conexão |
|------|---------|---------|
| golpe PIX / senha / segurança | Mini Segurança Digital | "Proteja seu dinheiro!" |
| videochamada / netos | Mini Videochamadas | "Veja seus netos!" |
| WhatsApp | Mini WhatsApp | "Domine o WhatsApp!" |
| fotos / álbum | Mini Google Fotos | "Guarde memórias!" |
| aplicativos | Mini Apps Essenciais | "Facilite seu dia!" |

---

## 📝 ESTRUTURA DO CONTEÚDO

```json
{
  "titulo": "🚨 Título com Emoji",
  "tema": "golpe PIX",
  "reflexao": "🌟 Frase inspiradora...",
  "story": "História emocional de 150-200 palavras...",
  "lesson": "Lição de 30-50 palavras...",
  "tutorial": {
    "titulo": "🛡️ TUTORIAL COMPLETO...",
    "introducao": "...",
    "passos": [
      {
        "numero": 1,
        "titulo": "...",
        "explicacao": "...",
        "acao": "...",
        "exemplo": "..."
      }
    ],
    "checklist": "☐ Item 1\n☐ Item 2..."
  },
  "oQueMaisAprender": "Bridge para produto...",
  "seguranca": "Dica extra...",
  "score": 9.0
}
```

---

## 🔄 HISTÓRICO DE MELHORIAS

### 18/02/2026

| Hora | Melhoria |
|------|----------|
| 11:17 | Corrigido problema de duplicidade - histórico limpo |
| 11:26 | Newsletter enviada para lista completa (93 emails) |
| 11:36 | Adicionada verificação de tema recente no escritor-envia.js |

### 17/02/2026

| Hora | Melhoria |
|------|----------|
| 14:00 | Criado sistema de documentação |
| 14:17 | Teste inicial - tema "aplicativo idoso" |
| 14:34 | Bug corrigido no template |
| 14:37 | Email + Blog funcionando |
| 15:00 | Skill Brave Search instalada |
| 15:22 | Skill Google Analytics instalada |
| 15:32 | Maton conectado ao Google Analytics |
| 16:07 | Módulo `brave-search.js` criado |
| 16:27 | Módulo `analytics-maton.js` criado |
| 16:43 | `agente-chefe-60mais.js` atualizado para usar Brave + Analytics |
| 17:01 | Fluxo completo funcionando com dados reais |
| 17:13 | Fluxo separado: GANCHOS → BEN → ESCRITOR |
| 17:20 | Sistema de histórico 30 dias implementado |

---

## 🐛 PROBLEMAS RESOLVIDOS

| Problema | Solução | Data |
|----------|---------|------|
| Duplicidade de envio | Verificação de tema recente adicionada | 18/02 |
| Google Trends bloqueado | Substituído por Brave Search | 17/02 |
| Google Analytics não inicializava | Maton API conectada | 17/02 |
| OpenClaw API timeout | Conteúdo gerado pelo Ben | 17/02 |
| Templates duplicados | Arquivo reescrito limpo | 17/02 |
| Temas repetitivos | Histórico de 30 dias | 17/02 |

---

## 📋 PRÓXIMOS PASSOS (Opcionais)

1. **Trello** - Corrigir erro menor na publicação

---

## ⚠️ INFORMAÇÕES CRÍTICAS - NÃO ESQUECER

### 📰 REGRA #1: APENAS UMA CAMPANHA DE NEWSLETTER POR DIA
- **NUNCA** enviar mais de uma newsletter no mesmo dia
- O CRON diário (06:06 Brasília) já faz o envio automático
- Se precisar reenviar, esperar o dia seguinte
- Evita duplicidade e spam para a lista

### 📰 REGRA #2: NEWSLETTER SEMPRE EM MODO PRODUÇÃO
- `MODO_TESTE = false` - SEMPRE em produção
- Enviar para a **lista completa** (Brevo ID 4)
- NÃO enviar apenas para email de teste
- O objetivo é alcançar todos os assinantes

### 📰 REGRA #3: VARIAR TEMAS E CATEGORIAS
- NÃO repetir a mesma categoria em dias seguidos
- Escolher temas aleatoriamente de categorias diferentes
- Hoje: Netflix (apps/entretenimento) → Amanhã: categoria diferente
- Objetivo: diversificar o conteúdo para o leitor
- Manter a qualidade alta do conteúdo (elogiado em 24/02/2026)

### 📰 REGRA #5: SEMPRE PUBLICAR NO BLOG APÓS ENVIAR NEWSLETTER
- **NUNCA** esquecer de postar no blog após enviar a newsletter
- Script: `publicar-blog.js`
- O fluxo é: Newsletter → Blog → WhatsApp
- Verificar se foi publicado antes de finalizar o dia

### 📰 REGRA #4: DICA WHATSAPP = MESMO TEMA DA NEWSLETTER
- A dica do WhatsApp deve ser o **mesmo tema** da Newsletter do dia
- Script: `dica-whatsapp-newsletter.js`
- CRON: 08:00 Brasília (2h após newsletter 06:06)
- Formato: resumido para WhatsApp (até 1500 caracteres)
- NÃO usar dicas fixas/rotativas - sempre sincronizado com a newsletter

### 📚 Lista de 100 Temas
- **Arquivo:** `/root/.openclaw/workspace/lista-temas.json`
- **Total:** 100 temas organizados em 12 categorias
- **Integração:** ✅ Já está integrada no `historico-temas.js`
- **Sistema:** Não repete tema por 30 dias

### ⏰ CRON Jobs Ativos

| Job | Horário | Comando |
|-----|---------|---------|
| Newsletter Diária | 06:06 Brasília | `node agente-chefe-60mais.js` |
| Relatório Telegram | 17:00 Brasília | Envia para Luis (id: 1007517562) |
| Monitor Manhã | 06:00 Brasília | `node monitor-emails.js` |
| Monitor Tarde | 15:00 Brasília | `node monitor-emails.js` |

### 🔧 Arquivos Principais
- `ganchos-tema.js` - Seleciona tema (usa lista de 100)
- `historico-temas.js` - Controla repetição 30 dias
- `agente-chefe-60mais.js` - Executa fluxo completo
- `lista-temas.json` - **100 temas disponíveis**

**⚠️ IMPORTANTE:** Este sistema está em PRODUÇÃO e não deve ser alterado sem necessidade.

---

## 🚀 MISSION CONTROL

**Painel de Controle para Agentes Autônomos**

| Item | Valor |
|------|-------|
| **Deployment URL** | https://ceaseless-puma-611.convex.cloud |
| **Local** | `/root/.openclaw/workspace/mission-control/` |
| **Stack** | Next.js 16 + Convex + Tailwind |
| **Status** | ✅ Deployado |

### Funcionalidades
- 📊 **Feed de Atividades** - Registro em tempo real de todas as ações
- 📅 **Calendário Semanal** - Visualização de tarefas agendadas
- 🔍 **Pesquisa Global** - Busca em memórias e documentos

### Integração
Permite que agentes registrem atividades, agendem tarefas e indexem memórias para busca.

Ver documentação completa: `memory/mission-control.md`

---

## 🔗 LINKS IMPORTANTES

| Item | URL |
|------|-----|
| **Mission Control** | https://ceaseless-puma-611.convex.cloud |
| Blog 60maisNews | https://60maiscursos.com.br/blog/ |
| WhatsApp | https://wa.me/5511953545939 |
| Maton | https://maton.ai |
| Maton Settings | https://maton.ai/settings |
| Maton Connections | https://ctrl.maton.ai |

---

## 👥 CONTATOS

- **Professor Luis** - 60maisPlay
- **Email teste** - luis7nico@gmail.com
- **WhatsApp** - (11) 95354-5939

---

## 🧠 PROBLEM SOLVER - Metodologia

> "Sempre que houver um problema, buscar skills existentes. Se não encontrar, criar uma nova e resolver."

### Fluxo de Resolução

```
1. IDENTIFICAR → Qual é o problema?
2. BUSCAR → Verificar em /skills/ e memory/
3. AVALIAR → Encontrou? Executar. Não? Criar.
4. CRIAR → Implementar + Testar
5. DOCUMENTAR → Salvar em /skills/ + memory/
```

### Skills Disponíveis

| Skill | Função | Arquivo |
|-------|--------|---------|
| Problem Solver | Metodologia de resolução | `problem-solver.md` |
| Skill Manager | Gerenciar skills | `skill-manager.js` |
| YouTube Channel | Listar vídeos de canais | `youtube-channel.js` |

### Local

```
/root/.openclaw/workspace/skills/
├── problem-solver.md
├── skill-manager.js
└── youtube-channel.js
```

---

---

## 🧠 APRENDIZAGENS DO DIA - 23/02/2026

### ✅ Conquistas do Dia

| Conquista | Detalhes |
|-----------|----------|
| **Newsletter 30 temas** | Cache completo implementado (`cache-newsletter-completo.json`) |
| **Imagens hospedadas** | Imgur funcionando (cabeçalho + rodapé) |
| **WhatsApp CTA** | Atualizado para 11 95354-5939 |
| **CRONs funcionando** | Newsletter 06:06 + Dicas WhatsApp 08:00 |
| **Grupo WhatsApp correto** | ID: `120363375518105627@g.us` |
| **Aprendizagem diária** | Sistema ativado às 19:00 |

### 📱 Formato WhatsApp - CRÍTICO

```
GRUPOS:    120363375518105627@g.us     ✅ CORRETO
NÚMEROS:   5511953545939@s.whatsapp.net ✅ CORRETO
NUNCA:     @c.us                        ❌ ERRADO
```

### 🖼️ Hospedagem de Imagens

- **Imgur** funciona bem para newsletter
- URLs: `https://i.imgur.com/[ID].jpeg`
- Sempre testar com `curl -I` antes de usar

### 📋 Cache de Temas

- **30 temas** no arquivo `cache-newsletter-completo.json`
- Sistema não repete por 30 dias
- Campo `categoria` para organizar

### ⚠️ Problemas Pendentes

1. CRON Relatório Telegram (timeout)
2. CRON Lembrete MVP (target incorreto)
3. Gateway com lentidão às vezes

---

## 🧠 APRENDIZAGENS DO DIA - 24/02/2026

### ✅ Fix Cron WhatsApp

**Problema:** Cron `enviar-dica-whatsapp.js` (08:00) falhava com HTTP 405

**Causa Raiz:** Script usava requisição HTTP para endpoint `/api/message` que não é suportado pelo gateway OpenClaw

**Solução:** Reescrito para usar CLI `openclaw message send`

**Arquivos:**
- Script corrigido: `/root/.openclaw/workspace/enviar-dica-whatsapp.js`
- Documentação completa: `memory/fix-cron-whatsapp.md`

**Comando correto para enviar mensagens:**
```bash
openclaw message send --channel whatsapp --target "120363375518105627@g.us" -m "Mensagem"
```

### 📊 Monitor de Tokens

- Sistema funcionando (`monitor-tokens.js`)
- Consumo: 118M tokens/dia
- Economia: 67.6% vs 364M/dia anterior
- Cache HIT rate: 53.8%

### 🔧 Comandos Úteis

```bash
# Verificar crons
crontab -l

# Testar envio WhatsApp
openclaw message send --channel whatsapp --target "120363375518105627@g.us" -m "Teste"

# Ver logs dica WhatsApp
cat /tmp/dicas-whatsapp.log

# Rodar monitor de tokens
cd /root/.openclaw/workspace && node run-monitor-tokens.js
```

---

*Documentação atualizada por Ben - 24/02/2026*
*Sistema 60maisNews v2.0*
