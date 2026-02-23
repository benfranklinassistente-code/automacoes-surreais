# 🚀 60maisPlay - Guia Completo para Produção

**Data:** 19 de Fevereiro de 2026
**Projeto:** Bot WhatsApp para plataforma de cursos 60+

---

## 📋 RESUMO DO PROJETO

Bot no WhatsApp que permite alunos idosos (60+) navegar pela plataforma de cursos sem precisar abrir o navegador.

---

## ✅ O QUE VOCÊ PRECISA PARA PRODUÇÃO

### 1. INFRAESTRUTURA

| Recurso | Especificação | Custo/mês |
|---------|---------------|-----------|
| Servidor VPS | 4GB RAM, 2 vCPU | R$ 100 |
| PostgreSQL | Banco de dados gerenciado | R$ 50 |
| Redis | Cache e sessões | R$ 30 |
| Domínio | .com.br | R$ 40/ano |
| SSL | Let's Encrypt (grátis) | R$ 0 |
| **TOTAL** | | **R$ 180/mês** |

### 2. TECNOLOGIAS NECESSÁRIAS

- Node.js 18+
- PostgreSQL 15
- Redis 7
- NGINX
- PM2 (process manager)
- OpenAI API (opcional para IA)

### 3. ARQUIVOS PRINCIPAIS

Localização: `/root/.openclaw/workspace/`

| Arquivo | Função |
|---------|--------|
| `webhook-server.js` | Recebe mensagens em tempo real |
| `bot-whatsapp-v2.js` | Bot principal |
| `menu-whatsapp.js` | Menus interativos |
| `faq-whatsapp.js` | Base de conhecimento |
| `60maisplay-browser.js` | Acesso à plataforma |

### 4. WEBHOOKS (ao invés de CRON)

**Por que webhooks?**
- Resposta em tempo real
- Escala para 500+ usuários
- Não sobrecarrega o servidor

**Como configurar:**
1. Configure URL: `https://seu-servidor.com/webhook`
2. Eventos: `message.received`
3. O WhatsApp avisa quando chega mensagem

### 5. BANCO DE DADOS (PostgreSQL)

```sql
-- Tabela de usuários
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) UNIQUE,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  last_interaction TIMESTAMP
);

-- Tabela de conversas
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  message TEXT,
  response TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de cursos
CREATE TABLE courses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200),
  description TEXT,
  lessons INTEGER
);

-- Tabela de progresso
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  course_id INTEGER REFERENCES courses(id),
  lesson_id INTEGER,
  completed BOOLEAN DEFAULT FALSE
);
```

### 6. INTELIGÊNCIA ARTIFICIAL

**Integração com OpenAI:**

```javascript
const { OpenAI } = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY });

async function responderComIA(pergunta, historico) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { 
        role: 'system', 
        content: `Você é o Professor Luis do 60maisPlay.
        Responda de forma SIMPLES e CLARA para pessoas idosas.
        Use linguagem acessível, sem jargões técnicos.`
      },
      ...historico,
      { role: 'user', content: pergunta }
    ]
  });
  
  return response.choices[0].message.content;
}
```

---

## 📊 ARQUITETURA DE PRODUÇÃO

```
┌─────────────────────────────────────────────────────────────┐
│                    WHATSAPP (500+ usuários)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Webhook (tempo real)
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
│     Redis       │  │   PostgreSQL    │  │   OpenAI API    │
│   (Cache/State) │  │    (Dados)      │  │   (Inteligência)│
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

## 🔑 INFORMAÇÕES CRÍTICAS

| Item | Valor |
|------|-------|
| **Gateway Token** | `pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE` |
| **Bot WhatsApp** | `+5511920990009` |
| **Admin** | `+5511953545939` |
| **Grupo Segurança** | `120363407488049190@g.us` |
| **Grupo Tecnologia** | `120363375518105627@g.us` |
| **Gateway URL** | `http://localhost:18789` |
| **Webhook URL** | `http://localhost:3001/webhook` |
| **60maisPlay** | `https://60maiscursos.com.br` |
| **Login** | `luis7nico@gmail.com` / `123456` |
| **Mission Control** | `https://ceaseless-puma-611.convex.cloud` |

---

## 🔧 PRÓXIMOS PASSOS

### Fase 1 - Webhooks ✅
- [x] Criar servidor webhook
- [ ] Integrar com OpenClaw Gateway
- [ ] Testar fluxo completo

### Fase 2 - Banco de Dados
- [ ] Instalar PostgreSQL
- [ ] Criar tabelas
- [ ] Migrar dados existentes

### Fase 3 - Inteligência Artificial
- [ ] Obter API key OpenAI
- [ ] Implementar respostas com IA
- [ ] Treinar com conteúdo do 60maisPlay

### Fase 4 - Produção
- [ ] Servidor dedicado
- [ ] Domínio próprio
- [ ] SSL/HTTPS
- [ ] Monitoramento 24/7

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

## 🎓 PERSONA DO BOT

**Nome:** Professor Luis
**Canal:** 60maisPlay
**Tom:** Amigável, simples, sem jargões técnicos
**Público:** Idosos (60+ anos)

**Exemplo de menu:**
```
🎓 *60maisPlay - Menu Principal*

📚 *1* - Ver todos os cursos
🎬 *2* - Assistir uma aula
❓ *3* - Tirar uma dúvida
📞 *4* - Falar com suporte

💬 _Digite o número da opção!_

---
_Professor Luis - 60maisPlay_
```

---

## ⚠️ PROBLEMAS CONHECIDOS

1. **CRON não detecta mensagens**
   - Solução: Usar webhooks (já implementado)

2. **Gateway Token Mismatch**
   - Ocorre esporadicamente
   - Gateway reconecta automaticamente

3. **Arquitetura não escala**
   - JSON files não suportam 500+ usuários
   - Solução: PostgreSQL + Redis

---

## 📞 CONTATO

**Professor Luis**
WhatsApp: +5511953545939
Email: luis7nico@gmail.com

---

*Documento gerado automaticamente pelo assistente 60maisPlay*
*19 de Fevereiro de 2026 - 22:50 (Brasília)*
