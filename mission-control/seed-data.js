/**
 * Script para popular dados iniciais no Mission Control
 * Execute após configurar o Convex
 */

const DEMO_ACTIVITIES = [
  {
    type: "email",
    title: "Newsletter enviada: aplicativo idoso",
    description: "Campanha 'aplicativo idoso' enviada para 100 assinantes via Brevo",
    status: "completed",
    metadata: { campaignId: 123, recipients: 100 }
  },
  {
    type: "blog",
    title: "Post publicado: Aplicativos Que Facilitam Sua Vida",
    description: "Artigo publicado em 60maiscursos.com.br/blog",
    status: "completed",
    metadata: { url: "https://60maiscursos.com.br/blog/aplicativos-que-facilitam-sua-vida" }
  },
  {
    type: "cron",
    title: "Newsletter agendada para 06:06 AM",
    description: "Tarefa recorrente configurada via CRON para envio diário",
    status: "scheduled",
    metadata: { cron: "6 9 * * *" }
  },
  {
    type: "search",
    title: "Pesquisa: tendências tecnologia idosos 2026",
    description: "Brave Search retornou 5 artigos relevantes sobre o tema",
    status: "completed",
    metadata: { results: 5 }
  },
  {
    type: "task",
    title: "Tema selecionado: WhatsApp segurança",
    description: "Baseado em Google Analytics - post mais visualizado",
    status: "completed",
    metadata: { fonte: "analytics", urgencia: 8 }
  }
];

const DEMO_SCHEDULED_TASKS = [
  {
    title: "60maisNews - Newsletter Diária",
    description: "Enviar newsletter para lista de assinantes",
    type: "newsletter",
    recurrence: "daily",
    scheduledAt: new Date().setHours(9, 6, 0, 0) // 06:06 Brasília = 09:06 UTC
  },
  {
    title: "Backup de memórias",
    description: "Backup semanal das memórias do agente",
    type: "cron",
    recurrence: "weekly",
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).setHours(12, 0, 0, 0)
  },
  {
    title: "Relatório semanal de métricas",
    description: "Gerar relatório de emails abertos e cliques",
    type: "reminder",
    recurrence: "weekly",
    scheduledAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).setHours(10, 0, 0, 0)
  }
];

const DEMO_MEMORIES = [
  {
    title: "Configuração Brevo",
    content: "API Key configurada para conta Luis Canabarra. Lista NewsLetter_2026 (ID: 4) com 100 assinantes. Remetente: benjamin@60maiscursos.com.br",
    type: "memory",
    tags: ["brevo", "email", "configuração"],
    source: "credenciais-60mais.json"
  },
  {
    title: "Temas da Newsletter",
    content: "Temas disponíveis: golpe PIX, WhatsApp segurança, videochamada, aplicativo idoso, Google Fotos, senha banco, Facebook segurança. Regra: não repetir por 30 dias.",
    type: "memory",
    tags: ["newsletter", "temas", "60maisnews"],
    source: "MEMORY.md"
  },
  {
    title: "Produtos R$37",
    content: "Mini Segurança Digital - proteção financeira. Mini Videochamadas - netos. Mini WhatsApp - domine o app. Mini Google Fotos - memórias. Mini Apps Essenciais - facilidade.",
    type: "document",
    tags: ["produtos", "vendas", "cta"],
    source: "produtos-60mais.js"
  },
  {
    title: "Persona Professor Luis",
    content: "Canal 60maisPlay. Linguagem simples, carinhosa, sem jargões técnicos. Conteúdo APLICÁVEL - o leitor resolve o problema. Foco em pessoas 60+ anos.",
    type: "memory",
    tags: ["persona", "copywriting", "tom"],
    source: "MEMORY.md"
  }
];

console.log("📊 Dados de demonstração prontos!");
console.log("Execute com: npx convex run activities:log '{...}'");
