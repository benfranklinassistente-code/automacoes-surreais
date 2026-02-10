# 🐝 AUTOMAÇÃO #21 - BEEHIIV NEWSLETTER

**Status:** ✅ **OPERACIONAL** v1.0

Automação completa para publicação de newsletters na Beehiiv (60maisNews).

---

## 🚀 COMO USAR

### 1. Testar Conexão
```bash
cd 21-beehiiv-automation
npm start
```

### 2. Publicar Newsletter
```bash
# Como rascunho (revisar antes)
npm run rascunho

# Agendar para data específica
npm run agendar

# Publicar imediatamente
npm run publicar
```

### 3. Listar Posts
```bash
npm run listar
```

---

## 📋 ESTRUTURA

```
21-beehiiv-automation/
├── src/
│   └── beehiiv.js          ← Core da API Beehiiv
├── scripts/
│   ├── publicar-exemplo.js ← Exemplo de publicação
│   ├── publicar-newsletter.js
│   ├── agendar-newsletter.js
│   └── criar-rascunho.js
├── package.json
└── README.md
```

---

## 🎯 FUNCIONALIDADES

| Função | Descrição |
|--------|-----------|
| `criarPost()` | Cria post com opções (draft/confirmed/scheduled) |
| `agendarPost()` | Agenda publicação para data/hora específica |
| `publicarImediato()` | Publica newsletter imediatamente |
| `salvarRascunho()` | Salva como rascunho para revisar |
| `listarPosts()` | Lista últimos posts publicados |

---

## 🔧 INTEGRAÇÃO COM LEAD MAGNET

Quando alguém baixa o lead magnet na landing page:

```javascript
// 1. Captura email na landing
// 2. Adiciona à lista Beehiiv automaticamente
// 3. Envia email de boas-vindas
// 4. Inclui na próxima newsletter
```

---

## 📊 CREDENCIAIS

Configuradas em `TOOLS.md`:
- **Publication ID:** pub_1f90e761-b2ff-4b49-8aba-c765bf91c6e9
- **API Key:** Configurada
- **Endpoint:** https://api.beehiiv.com/v2

---

## 🎉 EXEMPLO DE USO

```javascript
const BeehiivAutomation = require('./src/beehiiv');
const beehiiv = new BeehiivAutomation();

// Criar rascunho
await beehiiv.salvarRascunho(
    "📱 Dica de Segurança",
    "<html>...</html>"
);

// Agendar para amanhã 10h
await beehiiv.agendarPost(
    "📰 Newsletter Semanal",
    "<html>...</html>",
    "2026-02-12T10:00:00Z"
);
```

---

**Automação #21 - OPERACIONAL** 🐝
