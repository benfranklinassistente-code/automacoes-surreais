# 🚀 Mission Control - Painel de Controle

**Criado:** 18/02/2026  
**Deployment URL:** https://ceaseless-puma-611.convex.cloud  
**HTTP Actions URL:** https://ceaseless-puma-611.convex.site

---

## 📋 Visão Geral

Mission Control é um **painel de controle visual** para monitorar e gerenciar agentes autônomos OpenClaw em tempo real.

## 🛠️ Stack Tecnológica

| Tecnologia | Função |
|------------|--------|
| Next.js 16 | Framework React frontend |
| Convex | Banco de dados em tempo real |
| Tailwind CSS | Estilização |
| TypeScript | Tipagem estática |

## 🎯 Funcionalidades

### 1. Feed de Atividades
- Registra TODAS as ações do agente
- Histórico completo de tarefas
- Status em tempo real (completed, running, failed, scheduled)
- Filtros por tipo e data

### 2. Calendário Semanal
- Visualização de tarefas agendadas
- Navegação entre semanas
- Tipos: newsletter, cron, reminder, custom
- Código de cores por tipo

### 3. Pesquisa Global
- Busca em memórias, documentos, tarefas
- Full-text search com Convex
- Resultados relevantes ordenados

## 📊 Schema do Banco (Convex)

### Tabela: activities
- `type`: task, email, blog, search, file, cron, message
- `title`: Título da atividade
- `description`: Descrição detalhada
- `status`: completed, running, failed, scheduled
- `metadata`: Dados extras específicos
- `createdAt`: Timestamp

### Tabela: scheduledTasks
- `title`: Título da tarefa
- `type`: newsletter, cron, reminder, custom
- `scheduledAt`: Timestamp agendado
- `status`: pending, completed, cancelled
- `recurrence`: daily, weekly, monthly, null

### Tabela: memories
- `title`: Título
- `content`: Conteúdo (indexado para busca)
- `type`: memory, document, task, note
- `tags`: Array de tags
- `source`: Arquivo original

## 🔌 Integração com Agentes

```typescript
// Registrar atividade
await logActivity({
  type: "email",
  title: "Newsletter enviada",
  description: "Campanha enviada para 100 assinantes",
  status: "completed",
  metadata: { campaignId: 123 }
});

// Agendar tarefa
await createTask({
  title: "Newsletter Diária",
  type: "newsletter",
  scheduledAt: Date.now() + 86400000,
  recurrence: "daily"
});

// Indexar memória
await createMemory({
  title: "Configuração Brevo",
  content: "API Key configurada...",
  type: "memory",
  tags: ["config", "brevo"]
});
```

## 📁 Localização

```
/root/.openclaw/workspace/mission-control/
```

## 🔗 Links

| Item | URL |
|------|-----|
| Convex Dashboard | https://ceaseless-puma-611.convex.cloud |
| HTTP Actions API | https://ceaseless-puma-611.convex.site |
| Local Dev | http://localhost:3000 |

## 🌐 HTTP API Endpoints

### POST /api/activity
Registra uma atividade
```json
{
  "type": "email",
  "title": "Newsletter enviada",
  "description": "Enviada para 100 assinantes",
  "status": "completed",
  "metadata": { "campaignId": 123 }
}
```

### POST /api/task
Cria uma tarefa agendada
```json
{
  "title": "Newsletter Diária",
  "type": "newsletter",
  "scheduledAt": 1739856000000,
  "recurrence": "daily"
}
```

### POST /api/memory
Cria uma memória para busca
```json
{
  "title": "Configuração Brevo",
  "content": "API Key configurada...",
  "type": "memory",
  "tags": ["config", "brevo"]
}
```

### GET /api/stats
Retorna estatísticas do sistema

### GET /api/activities
Lista atividades (parâmetros: limit, type)

## 📦 Cliente JavaScript

Arquivo: `mission-control-client.js`

```javascript
const { logActivity, createTask, getStats } = require('./mission-control-client');

// Registrar atividade
await logActivity({
  type: "email",
  title: "Newsletter enviada",
  status: "completed"
});

// Buscar stats
const stats = await getStats();
```

---

## ⚠️ PENDENTE

Para que as HTTP Actions funcionem, é necessário:

```bash
cd /root/.openclaw/workspace/mission-control
npx convex login
npx convex deploy
```

---

*Documentação atualizada em 18/02/2026*
