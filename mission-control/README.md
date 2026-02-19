# 🚀 Mission Control

Painel de Controle de Missão para agentes autônomos OpenClaw.

## 📦 Tecnologias

- **Next.js 16** - Framework React
- **Convex** - Banco de dados em tempo real
- **Tailwind CSS** - Estilização
- **TypeScript** - Tipagem estática

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

## 🛠️ Setup

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar Convex
```bash
npx convex dev
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
# Adicione o NEXT_PUBLIC_CONVEX_URL fornecido pelo comando anterior
```

### 4. Executar
```bash
npm run dev
```

## 📁 Estrutura

```
src/
├── app/
│   ├── layout.tsx      # Layout principal
│   ├── page.tsx        # Dashboard
│   ├── providers.tsx   # Convex Provider
│   └── globals.css     # Estilos globais
├── components/
│   ├── ActivityFeed.tsx    # Feed de atividades
│   ├── CalendarView.tsx    # Calendário semanal
│   ├── GlobalSearch.tsx    # Pesquisa global
│   ├── StatsCards.tsx      # Cards de estatísticas
│   └── UpcomingTasks.tsx   # Próximas tarefas
convex/
├── schema.ts           # Schema do banco
├── activities.ts       # CRUD de atividades
├── scheduledTasks.ts   # CRUD de tarefas
├── memories.ts         # CRUD + busca
└── _generated/         # Tipos gerados
```

## 🔌 Integração com OpenClaw

Para registrar atividades do agente:

```typescript
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";

// Registrar uma ação
const logActivity = useMutation(api.activities.log);

await logActivity({
  type: "email",
  title: "Newsletter enviada",
  description: "Campanha 'tema' enviada para 100 assinantes",
  status: "completed",
  metadata: { campaignId: 123 }
});
```

Para agendar tarefas:

```typescript
const createTask = useMutation(api.scheduledTasks.create);

await createTask({
  title: "Newsletter Diária",
  type: "newsletter",
  scheduledAt: Date.now() + 86400000, // amanhã
  recurrence: "daily"
});
```

Para indexar memórias:

```typescript
const createMemory = useMutation(api.memories.create);

await createMemory({
  title: "Configuração Brevo",
  content: "API Key configurada para...",
  type: "memory",
  tags: ["config", "brevo"]
});
```

## 📊 Dashboard

O dashboard exibe:
- **Total de ações** realizadas
- **Ações hoje**
- **Concluídas** vs **Falharam**
- Feed em tempo real
- Calendário interativo
- Busca instantânea

---

Desenvolvido para OpenClaw Agents 🤖
