/**
 * 🗂️ Sistema de Histórico Seletivo
 * Reduz tokens de entrada mantendo apenas o essencial
 * 
 * ESTRATÉGIA:
 * - Últimas 5 mensagens: completas
 * - Mensagens antigas: resumidas em bullet points
 * - Fatos importantes: extraídos e armazenados
 */

const fs = require('fs');
const path = require('path');

// Configurações
const CONFIG = {
  memoriaDir: '/root/.openclaw/workspace/memory/conversas',
  resumosDir: '/root/.openclaw/workspace/memory/resumos',
  keepLastMessages: 5,        // Manter últimas N mensagens completas
  maxSummaryTokens: 150,      // Máximo de tokens no resumo
  maxHistoryTokens: 500,      // Limite de tokens do histórico
  compactThreshold: 10        // Compactar após N mensagens
};

// Garante que diretórios existem
function ensureDirs() {
  [CONFIG.memoriaDir, CONFIG.resumosDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
}

/**
 * Extrai pontos-chave de uma conversa
 */
function extrairPontosChave(mensagens) {
  const pontos = [];
  
  for (const msg of mensagens) {
    // Extrair tópicos mencionados
    const topicos = identificarTopicos(msg.content);
    if (topicos.length > 0) {
      pontos.push(...topicos.map(t => ({ topico: t, data: msg.timestamp })));
    }
    
    // Extrair perguntas não respondidas
    if (msg.role === 'user' && msg.content.includes('?')) {
      pontos.push({
        tipo: 'pergunta',
        content: msg.content.substring(0, 100),
        data: msg.timestamp
      });
    }
    
    // Extrair decisões/acordos
    if (msg.role === 'assistant') {
      const decisoes = identificarDecisoes(msg.content);
      pontos.push(...decisoes);
    }
  }
  
  return pontos;
}

/**
 * Identifica tópicos mencionados no texto
 */
function identificarTopicos(texto) {
  const topicosConhecidos = [
    'whatsapp', 'email', 'gmail', 'internet', 'wifi',
    'senha', 'segurança', 'golpe', 'pix', 'download',
    'curso', 'aula', 'video', 'netflix', 'zoom',
    'smartphone', 'celular', 'foto', 'arquivo',
    'gov.br', 'cpf', 'cnh'
  ];
  
  const textoLower = texto.toLowerCase();
  return topicosConhecidos.filter(t => textoLower.includes(t));
}

/**
 * Identifica decisões ou conclusões na resposta
 */
function identificarDecisoes(texto) {
  const decisoes = [];
  const indicadores = [
    'vamos', 'vou', 'podemos', 'será', 'definido',
    'combinado', 'decidido', 'resolvido', 'próximo passo'
  ];
  
  const frases = texto.split(/[.!?]+/);
  for (const frase of frases) {
    const fraseLower = frase.toLowerCase().trim();
    if (indicadores.some(i => fraseLower.includes(i)) && frase.length > 20) {
      decisoes.push({
        tipo: 'decisao',
        content: frase.trim().substring(0, 100),
        data: Date.now()
      });
    }
  }
  
  return decisoes;
}

/**
 * Gera resumo compacto do histórico
 */
function gerarResumo(mensagens) {
  if (mensagens.length === 0) return '';
  
  const pontos = extrairPontosChave(mensagens);
  const topicosUnicos = [...new Set(pontos.filter(p => p.topico).map(p => p.topico))];
  const perguntas = pontos.filter(p => p.tipo === 'pergunta');
  const decisoes = pontos.filter(p => p.tipo === 'decisao');
  
  let resumo = '📝 **Resumo da conversa:**\n';
  
  if (topicosUnicos.length > 0) {
    resumo += `• Tópicos: ${topicosUnicos.join(', ')}\n`;
  }
  
  if (decisoes.length > 0) {
    resumo += `• Decisões: ${decisoes.slice(-2).map(d => d.content).join('; ')}\n`;
  }
  
  if (perguntas.length > 0) {
    resumo += `• Última dúvida: ${perguntas[perguntas.length - 1].content}\n`;
  }
  
  return resumo;
}

/**
 * Processa histórico e retorna versão compactada
 */
function processarHistorico(historico, usuarioId = 'default') {
  ensureDirs();
  
  if (!historico || historico.length === 0) {
    return { historicoCompactado: [], resumo: '' };
  }
  
  // Se histórico é pequeno, retornar como está
  if (historico.length <= CONFIG.keepLastMessages) {
    return { historicoCompactado: historico, resumo: '' };
  }
  
  // Separar mensagens antigas das recentes
  const mensagensAntigas = historico.slice(0, -CONFIG.keepLastMessages);
  const mensagensRecentes = historico.slice(-CONFIG.keepLastMessages);
  
  // Gerar resumo das antigas
  const resumo = gerarResumo(mensagensAntigas);
  
  // Salvar histórico completo localmente
  salvarHistoricoLocal(usuarioId, historico);
  
  // Retornar: resumo + mensagens recentes
  return {
    historicoCompactado: mensagensRecentes,
    resumo: resumo,
    totalOriginal: historico.length,
    totalCompactado: CONFIG.keepLastMessages,
    economiaEstimada: mensagensAntigas.length * 50 // ~50 tokens por msg
  };
}

/**
 * Salva histórico completo localmente
 */
function salvarHistoricoLocal(usuarioId, historico) {
  const arquivo = path.join(CONFIG.memoriaDir, `${usuarioId}.json`);
  
  let dados = { conversas: [] };
  if (fs.existsSync(arquivo)) {
    try {
      dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
    } catch (e) {}
  }
  
  // Adicionar nova conversa
  dados.conversas.push({
    timestamp: Date.now(),
    mensagens: historico,
    resumo: gerarResumo(historico)
  });
  
  // Manter apenas últimas 10 conversas
  if (dados.conversas.length > 10) {
    dados.conversas = dados.conversas.slice(-10);
  }
  
  fs.writeFileSync(arquivo, JSON.stringify(dados, null, 2));
}

/**
 * Busca histórico local por usuário
 */
function buscarHistoricoLocal(usuarioId, query = null) {
  const arquivo = path.join(CONFIG.memoriaDir, `${usuarioId}.json`);
  
  if (!fs.existsSync(arquivo)) {
    return null;
  }
  
  try {
    const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8'));
    
    if (query) {
      // Buscar conversas que mencionam a query
      return dados.conversas.filter(c => 
        JSON.stringify(c).toLowerCase().includes(query.toLowerCase())
      );
    }
    
    return dados;
  } catch (e) {
    return null;
  }
}

/**
 * Estatísticas de economia
 */
let stats = {
  processamentos: 0,
  tokensEconomizados: 0,
  mensagensCompactadas: 0
};

function getStats() {
  return { ...stats };
}

function recordProcessamento(economia) {
  stats.processamentos++;
  stats.tokensEconomizados += economia;
  stats.mensagensCompactadas++;
}

module.exports = {
  processarHistorico,
  salvarHistoricoLocal,
  buscarHistoricoLocal,
  gerarResumo,
  extrairPontosChave,
  getStats,
  recordProcessamento,
  CONFIG
};
