// Dados de demonstração para o Mission Control
// Serão usados quando não houver conexão com Convex
// IMPORTANTE: Usar datas fixas para evitar erros de hidratação

// Data base fixa para consistência SSR/CSR
const NOW = 1739894400000; // 18/02/2026 14:00 UTC

export const demoActivities = [
  {
    _id: "demo-1",
    type: "email",
    title: "Newsletter enviada",
    description: "Campanha 'Dicas de Produtividade' enviada para 150 assinantes",
    status: "completed",
    createdAt: NOW - 1000 * 60 * 5, // 5 min atrás
  },
  {
    _id: "demo-2",
    type: "blog",
    title: "Artigo publicado",
    description: "Como usar IA para automatizar tarefas diárias",
    status: "completed",
    createdAt: NOW - 1000 * 60 * 30, // 30 min atrás
  },
  {
    _id: "demo-3",
    type: "cron",
    title: "Backup automático",
    description: "Backup diário dos dados realizado com sucesso",
    status: "completed",
    createdAt: NOW - 1000 * 60 * 60, // 1h atrás
  },
  {
    _id: "demo-4",
    type: "search",
    title: "Pesquisa realizada",
    description: "Busca por 'tendências de mercado 2024' completada",
    status: "completed",
    createdAt: NOW - 1000 * 60 * 60 * 2, // 2h atrás
  },
  {
    _id: "demo-5",
    type: "message",
    title: "Mensagem processada",
    description: "Resposta automática enviada para cliente sobre produto X",
    status: "completed",
    createdAt: NOW - 1000 * 60 * 60 * 3, // 3h atrás
  },
  {
    _id: "demo-6",
    type: "task",
    title: "Relatório semanal",
    description: "Gerando relatório de atividades da semana...",
    status: "running",
    createdAt: NOW - 1000 * 60 * 2, // 2 min atrás
  },
  {
    _id: "demo-7",
    type: "email",
    title: "Campanha agendada",
    description: "Newsletter 'Black Friday' agendada para amanhã",
    status: "scheduled",
    createdAt: NOW - 1000 * 60 * 60 * 5, // 5h atrás
  },
  {
    _id: "demo-8",
    type: "blog",
    title: "Rascunho salvo",
    description: "Artigo sobre automação salvo como rascunho",
    status: "failed",
    createdAt: NOW - 1000 * 60 * 60 * 8, // 8h atrás
  },
];

export const demoScheduledTasks = [
  {
    _id: "task-1",
    title: "Newsletter Diária",
    description: "Enviar newsletter matinal para assinantes",
    scheduledAt: NOW + 1000 * 60 * 30, // 30 min
    type: "newsletter",
    status: "pending",
    recurrence: "daily",
  },
  {
    _id: "task-2",
    title: "Backup do Banco",
    description: "Backup automático do banco de dados",
    scheduledAt: NOW + 1000 * 60 * 60 * 2, // 2h
    type: "cron",
    status: "pending",
    recurrence: "daily",
  },
  {
    _id: "task-3",
    title: "Reunião de Planejamento",
    description: "Reunião semanal de planejamento",
    scheduledAt: NOW + 1000 * 60 * 60 * 24, // amanhã
    type: "reminder",
    status: "pending",
    recurrence: "weekly",
  },
  {
    _id: "task-4",
    title: "Relatório Mensal",
    description: "Gerar relatório mensal de métricas",
    scheduledAt: NOW + 1000 * 60 * 60 * 48, // 2 dias
    type: "custom",
    status: "pending",
    recurrence: "monthly",
  },
  {
    _id: "task-5",
    title: "Atualização de Sistema",
    description: "Aplicar patches de segurança",
    scheduledAt: NOW + 1000 * 60 * 60 * 72, // 3 dias
    type: "cron",
    status: "pending",
  },
];

export const demoMemories = [
  {
    _id: "mem-1",
    title: "Configuração Brevo",
    content: "API Key configurada para envio de newsletters. Usando o serviço Brevo para automação de emails. Lista principal: 'assinantes-ativos' com 150 contatos.",
    type: "memory",
    tags: ["config", "brevo", "email"],
    source: "setup.md",
    createdAt: NOW - 1000 * 60 * 60 * 24 * 7,
    updatedAt: NOW - 1000 * 60 * 60 * 24,
  },
  {
    _id: "mem-2",
    title: "Estratégia de Conteúdo",
    content: "Plano de conteúdo para o blog: artigos sobre produtividade, IA, automação. Frequência: 2x por semana. Tom: técnico mas acessível.",
    type: "document",
    tags: ["estratégia", "blog", "conteúdo"],
    source: "estrategia.md",
    createdAt: NOW - 1000 * 60 * 60 * 24 * 5,
    updatedAt: NOW - 1000 * 60 * 60 * 24 * 2,
  },
  {
    _id: "mem-3",
    title: "Integrações Ativas",
    content: "Integrações configuradas: OpenAI (GPT-4), Brevo (email), Convex (banco), Telegram (bot). Todas funcionando corretamente.",
    type: "memory",
    tags: ["integrações", "api", "config"],
    source: "integracoes.md",
    createdAt: NOW - 1000 * 60 * 60 * 24 * 3,
    updatedAt: NOW - 1000 * 60 * 60 * 24,
  },
  {
    _id: "mem-4",
    title: "Tarefas Recorrentes",
    content: "Newsletter diária às 9h, backup às 3h, relatório semanal na sexta. Todas as tarefas automatizadas via cron.",
    type: "task",
    tags: ["cron", "automação", "tarefas"],
    source: "tasks.md",
    createdAt: NOW - 1000 * 60 * 60 * 24 * 2,
    updatedAt: NOW - 1000 * 60 * 60 * 24,
  },
];

export const demoStats = {
  total: 156,
  today: 12,
  completed: 142,
  failed: 3,
  byType: {
    email: 45,
    blog: 23,
    cron: 38,
    search: 28,
    message: 22,
  },
};
