/**
 * Mission Control Client
 * Cliente HTTP para integrar agentes com o Mission Control
 * 
 * URL: https://ceaseless-puma-611.convex.site
 */

const MISSION_CONTROL_URL = "https://ceaseless-puma-611.convex.site";

/**
 * Registra uma atividade no Mission Control
 * @param {Object} activity
 * @param {string} activity.type - task, email, blog, search, file, cron, message
 * @param {string} activity.title - Título da atividade
 * @param {string} activity.description - Descrição detalhada
 * @param {string} activity.status - completed, running, failed, scheduled
 * @param {Object} [activity.metadata] - Dados extras
 */
async function logActivity({ type, title, description = "", status, metadata }) {
  try {
    const response = await fetch(`${MISSION_CONTROL_URL}/api/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title, description, status, metadata }),
    });
    
    const result = await response.json();
    console.log(`[Mission Control] Atividade registrada: ${title}`);
    return result;
  } catch (error) {
    console.error("[Mission Control] Erro ao registrar atividade:", error.message);
    return { error: error.message };
  }
}

/**
 * Cria uma tarefa agendada
 * @param {Object} task
 * @param {string} task.title - Título da tarefa
 * @param {string} task.type - newsletter, cron, reminder, custom
 * @param {number} task.scheduledAt - Timestamp agendado
 * @param {string} [task.recurrence] - daily, weekly, monthly
 * @param {string} [task.description] - Descrição
 * @param {Object} [task.metadata] - Dados extras
 */
async function createTask({ title, type, scheduledAt, recurrence, description, metadata }) {
  try {
    const response = await fetch(`${MISSION_CONTROL_URL}/api/task`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, type, scheduledAt, recurrence, description, metadata }),
    });
    
    const result = await response.json();
    console.log(`[Mission Control] Tarefa criada: ${title}`);
    return result;
  } catch (error) {
    console.error("[Mission Control] Erro ao criar tarefa:", error.message);
    return { error: error.message };
  }
}

/**
 * Cria uma memória para busca
 * @param {Object} memory
 * @param {string} memory.title - Título
 * @param {string} memory.content - Conteúdo (indexado para busca)
 * @param {string} memory.type - memory, document, task, note
 * @param {string[]} [memory.tags] - Tags
 * @param {string} [memory.source] - Arquivo original
 */
async function createMemory({ title, content, type, tags, source }) {
  try {
    const response = await fetch(`${MISSION_CONTROL_URL}/api/memory`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, type, tags, source }),
    });
    
    const result = await response.json();
    console.log(`[Mission Control] Memória criada: ${title}`);
    return result;
  } catch (error) {
    console.error("[Mission Control] Erro ao criar memória:", error.message);
    return { error: error.message };
  }
}

/**
 * Busca estatísticas do Mission Control
 */
async function getStats() {
  try {
    const response = await fetch(`${MISSION_CONTROL_URL}/api/stats`);
    return await response.json();
  } catch (error) {
    console.error("[Mission Control] Erro ao buscar stats:", error.message);
    return { error: error.message };
  }
}

/**
 * Lista atividades
 * @param {Object} options
 * @param {number} [options.limit=50] - Limite de resultados
 * @param {string} [options.type] - Filtrar por tipo
 */
async function getActivities({ limit = 50, type } = {}) {
  try {
    const params = new URLSearchParams({ limit: String(limit) });
    if (type) params.append("type", type);
    
    const response = await fetch(`${MISSION_CONTROL_URL}/api/activities?${params}`);
    return await response.json();
  } catch (error) {
    console.error("[Mission Control] Erro ao buscar atividades:", error.message);
    return { error: error.message };
  }
}

module.exports = {
  logActivity,
  createTask,
  createMemory,
  getStats,
  getActivities,
  MISSION_CONTROL_URL,
};
