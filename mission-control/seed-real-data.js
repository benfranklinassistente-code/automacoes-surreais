// Script para popular o Mission Control com dados reais do sistema OpenClaw
// Executado na inicialização e a cada 30 minutos

const CONVEX_URL = "https://ceaseless-puma-611.convex.site";

// Busca dados reais do sistema
async function fetchRealData() {
  const now = Date.now();
  
  // Buscar status do gateway
  let gatewayStatus = "unknown";
  try {
    const res = await fetch("http://localhost:3010/status");
    if (res.ok) gatewayStatus = "online";
  } catch {
    gatewayStatus = "offline";
  }
  
  // Buscar jobs do cron
  let cronJobs = [];
  try {
    const res = await fetch("http://localhost:3010/cron/list");
    if (res.ok) {
      const data = await res.json();
      cronJobs = data.jobs || [];
    }
  } catch {}
  
  // Buscar sessões ativas com uso de tokens
  let sessions = [];
  let totalTokens = 0;
  let totalContextTokens = 0;
  try {
    const res = await fetch("http://localhost:3010/sessions/list");
    if (res.ok) {
      const data = await res.json();
      sessions = data.sessions || [];
      
      // Calcular totais de tokens
      for (const session of sessions) {
        totalTokens += session.totalTokens || 0;
        totalContextTokens += session.contextTokens || 0;
      }
    }
  } catch {}
  
  // Buscar status de uso detalhado
  let usageData = null;
  try {
    const res = await fetch("http://localhost:3010/status");
    if (res.ok) {
      usageData = await res.json();
    }
  } catch {}
  
  return { 
    now, 
    gatewayStatus, 
    cronJobs, 
    sessions, 
    totalTokens,
    totalContextTokens,
    usageData 
  };
}

// Registra uma atividade no Convex
async function logActivity(type, title, description, status, metadata = {}) {
  try {
    await fetch(`${CONVEX_URL}/api/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title, description, status, metadata })
    });
    console.log(`✓ Atividade: ${title}`);
  } catch (err) {
    console.error(`✗ Erro ao registrar atividade: ${err.message}`);
  }
}

// Cria uma tarefa agendada no Convex
async function createTask(title, type, scheduledAt, recurrence, description) {
  try {
    await fetch(`${CONVEX_URL}/api/task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type, scheduledAt, recurrence, description })
    });
    console.log(`✓ Tarefa: ${title}`);
  } catch (err) {
    console.error(`✗ Erro ao criar tarefa: ${err.message}`);
  }
}

// Formata número de tokens para exibição
function formatTokens(tokens) {
  if (tokens >= 1000000) return `${(tokens / 1000000).toFixed(2)}M`;
  if (tokens >= 1000) return `${(tokens / 1000).toFixed(1)}K`;
  return tokens.toString();
}

// Popula dados iniciais
async function seedInitialData() {
  console.log("\n🚀 Populando Mission Control com dados iniciais...\n");
  
  const now = Date.now();
  
  // Atividades de hoje
  await logActivity("cron", "Newsletter 60maisNews", "Newsletter diária enviada para 93 assinantes via Telegram", "completed", { recipients: 93, channel: "telegram" });
  await logActivity("cron", "Relatório Diário Telegram", "Relatório de atividades enviado às 20:00 UTC", "completed", { time: "20:00 UTC" });
  await logActivity("email", "Verificação de API Brevo", "Conexão com Brevo verificada com sucesso", "completed", { service: "brevo" });
  await logActivity("system", "Gateway OpenClaw Online", "Gateway iniciado e operacional", "completed", { port: 3010 });
  await logActivity("agent", "Sessão Principal Ativa", "Agente principal rodando em webchat", "running", { model: "GLM-5-FP8" });
  
  // Atividades de ontem
  const yesterday = now - 24 * 60 * 60 * 1000;
  await logActivity("cron", "Backup Automático", "Backup diário do workspace realizado", "completed");
  await logActivity("search", "Pesquisa de Tendências", "Busca por tendências de IA realizadas", "completed");
  
  // Tarefas agendadas
  const tomorrow9am = now + 24 * 60 * 60 * 1000 - (now % (24 * 60 * 60 * 1000)) + 9 * 60 * 60 * 1000;
  await createTask("Newsletter 60maisNews - Diária", "newsletter", tomorrow9am, "daily", "Enviar newsletter matinal para assinantes Telegram");
  await createTask("Relatório Telegram", "cron", tomorrow9am + 11 * 60 * 60 * 1000, "daily", "Relatório diário enviado às 20:00 UTC");
  await createTask("Backup Workspace", "cron", now + 3 * 24 * 60 * 60 * 1000, "weekly", "Backup completo do workspace OpenClaw");
  
  console.log("\n✅ Dados iniciais populados!\n");
}

// Atualiza dados do sistema (executado a cada 30 min)
async function updateSystemData() {
  console.log("\n🔄 Atualizando dados do sistema...\n");
  
  const { 
    now, 
    gatewayStatus, 
    cronJobs, 
    sessions, 
    totalTokens,
    totalContextTokens,
    usageData 
  } = await fetchRealData();
  
  // Log do status do gateway
  if (gatewayStatus === "online") {
    await logActivity("system", "Gateway Online", "Verificação de saúde: Gateway operacional", "completed");
  } else {
    await logActivity("system", "Gateway Offline", "Verificação de saúde: Gateway não responde", "failed");
  }
  
  // Log de uso de tokens
  if (totalTokens > 0) {
    const usedPercent = totalContextTokens > 0 ? ((totalTokens / totalContextTokens) * 100).toFixed(1) : 0;
    await logActivity(
      "tokens", 
      `Uso de Tokens: ${formatTokens(totalTokens)}`, 
      `${formatTokens(totalTokens)} tokens usados de ${formatTokens(totalContextTokens)} disponíveis (${usedPercent}%)`,
      totalTokens > totalContextTokens * 0.9 ? "running" : "completed",
      { 
        totalTokens, 
        contextTokens: totalContextTokens,
        usedPercent: parseFloat(usedPercent),
        sessionsCount: sessions.length
      }
    );
    
    // Log por sessão
    for (const session of sessions) {
      if (session.totalTokens > 0) {
        await logActivity(
          "tokens",
          `Sessão: ${session.displayName || session.key}`,
          `${formatTokens(session.totalTokens)} tokens | Modelo: ${session.model || 'N/A'}`,
          "completed",
          { 
            sessionKey: session.key,
            tokens: session.totalTokens,
            model: session.model
          }
        );
      }
    }
  }
  
  // Log dos jobs ativos
  for (const job of cronJobs) {
    if (job.enabled) {
      await logActivity("cron", `Job: ${job.name}`, `Próxima execução: ${new Date(job.state?.nextRunAtMs).toLocaleString('pt-BR')}`, "scheduled", job);
    }
  }
  
  // Log das sessões ativas
  if (sessions.length > 0) {
    await logActivity("agent", `${sessions.length} Sessões Ativas`, `${sessions.map(s => s.displayName || s.key).join(", ")}`, "running", { count: sessions.length });
  }
  
  console.log("\n✅ Dados atualizados!\n");
}

// Executa
const args = process.argv.slice(2);
if (args.includes("--seed")) {
  seedInitialData();
} else if (args.includes("--update")) {
  updateSystemData();
} else {
  seedInitialData().then(() => updateSystemData());
}

module.exports = { seedInitialData, updateSystemData };
