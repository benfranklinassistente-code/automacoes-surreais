/**
 * 🚀 Inicializador do Sistema de Memória Otimizada
 * 
 * Este módulo conecta todos os componentes:
 * - Cache Semântico (perguntas similares)
 * - Cache FAQ (perguntas exatas)
 * - Histórico Seletivo (compactação)
 * - Perfil de Usuário (fatos)
 * - Sistema de Memória (base de conhecimento)
 * 
 * USO:
 * const memoria = require('./memory-init.js');
 * const resultado = memoria.processar('usuario-123', 'quanto custa o curso?');
 */

const cacheSemantico = require('./cache-semantico.js');
const faqCache = require('./faq-cache.js');
const historicoSeletivo = require('./historico-seletivo.js');
const perfilUsuario = require('./memory/perfil-usuario.js');
const memoriaSistema = require('./memory-sistema.js');

// Estatísticas globais
let stats = {
  processamentos: 0,
  tokensEconomizados: 0,
  cacheHits: 0,
  cacheMisses: 0
};

/**
 * Processa uma mensagem do usuário
 * Retorna contexto mínimo ou resposta direta
 */
function processar(usuarioId, mensagem, historico = []) {
  stats.processamentos++;
  
  const resultado = {
    respostaDireta: null,
    contexto: null,
    origem: null,
    tokensEconomizados: 0
  };
  
  // 1. CACHE SEMÂNTICO (perguntas similares ~70%)
  const semantico = cacheSemantico.findSimilar(mensagem);
  if (semantico.found) {
    resultado.respostaDireta = semantico.response;
    resultado.origem = 'cache_semantico';
    resultado.similaridade = semantico.similarity;
    resultado.tokensEconomizados = 120;
    stats.cacheHits++;
    stats.tokensEconomizados += 120;
    return resultado;
  }
  
  // 2. CACHE FAQ (perguntas exatas)
  const faq = faqCache.findInCache(mensagem);
  if (faq.found) {
    resultado.respostaDireta = faq.response;
    resultado.origem = 'cache_faq';
    resultado.tokensEconomizados = 150;
    stats.cacheHits++;
    stats.tokensEconomizados += 150;
    faqCache.recordHit(150);
    return resultado;
  }
  
  // 3. PRECISA DO MODELO - montar contexto mínimo
  stats.cacheMisses++;
  
  let contexto = '';
  
  // 3.1 Perfil do usuário (~100 tokens)
  const perfil = perfilUsuario.gerarContextoResumido(usuarioId);
  if (perfil) {
    contexto += perfil + '\n';
    resultado.tokensEconomizados += 100; // vs histórico completo
  }
  
  // 3.2 Fatos relevantes da mensagem (~150 tokens)
  const fatos = memoriaSistema.gerarContextoCompacto(usuarioId, mensagem);
  if (fatos) {
    contexto += fatos + '\n';
    resultado.tokensEconomizados += 200;
  }
  
  // 3.3 Histórico compactado (~250 tokens)
  if (historico.length > 5) {
    const { historicoCompactado, resumo } = historicoSeletivo.processarHistorico(historico, usuarioId);
    if (resumo) contexto += resumo + '\n';
    if (historicoCompactado) {
      contexto += '[Recente:]\n';
      historicoCompactado.slice(-3).forEach(msg => {
        contexto += `${msg.role}: ${msg.content?.substring(0, 100)}\n`;
      });
    }
    resultado.tokensEconomizados += (historico.length - 5) * 50;
  }
  
  // 3.4 Mensagem atual
  contexto += `\nUsuário: ${mensagem}`;
  
  resultado.contexto = contexto;
  resultado.origem = 'modelo';
  
  // Registrar na timeline
  memoriaSistema.registrarEvento('pergunta', { usuario: usuarioId, mensagem: mensagem.substring(0, 100) });
  
  stats.tokensEconomizados += resultado.tokensEconomizados;
  
  return resultado;
}

/**
 * Aprende uma nova resposta (adiciona aos caches)
 */
function aprender(pergunta, resposta, categoria = 'geral') {
  // Adicionar ao cache semântico
  cacheSemantico.addToCache(pergunta, resposta, 100);
  
  // Adicionar ao cache FAQ
  const normalized = cacheSemantico.normalize(pergunta);
  if (normalized.split(' ').length <= 3) {
    // Pergunta curta = provavelmente comum
    faqCache.recordHit(0); // Apenas para registrar
  }
  
  // Adicionar à base de conhecimento
  const tags = cacheSemantico.extractKeywords(pergunta);
  memoriaSistema.adicionarFato('solucao', resposta.substring(0, 200), tags);
  
  return true;
}

/**
 * Atualiza perfil do usuário
 */
function atualizarPerfil(usuarioId, dados) {
  return perfilUsuario.atualizarPerfil(usuarioId, dados);
}

/**
 * Registra tópico discutido
 */
function registrarTopico(usuarioId, topico) {
  return perfilUsuario.registrarTopico(usuarioId, topico);
}

/**
 * Estatísticas completas
 */
function estatisticas() {
  return {
    geral: stats,
    cacheSemantico: cacheSemantico.getStats(),
    cacheFAQ: faqCache.getStats(),
    historico: historicoSeletivo.getStats(),
    memoria: memoriaSistema.getEstatisticas(),
    taxaAcerto: stats.processamentos > 0 
      ? ((stats.cacheHits / stats.processamentos) * 100).toFixed(1) + '%'
      : '0%'
  };
}

/**
 * Resumo diário de economia
 */
function relatorioEconomia() {
  const est = estatisticas();
  
  return `
📊 RELATÓRIO DE ECONOMIA DE TOKENS

✅ Processamentos: ${est.geral.processamentos}
🎯 Cache Hits: ${est.geral.cacheHits} (${est.taxaAcerto})
❌ Cache Misses: ${est.geral.cacheMisses}

💰 Tokens Economizados: ${est.geral.tokensEconomizados.toLocaleString()}

📈 Por componente:
   • Cache Semântico: ${est.cacheSemantico.tokensSaved.toLocaleString()}
   • Cache FAQ: ${est.cacheFAQ.tokensSaved.toLocaleString()}
   • Histórico: ${est.historico.tokensEconomizados.toLocaleString()}

📚 Base de Conhecimento: ${est.memoria.fatos} fatos
🗂️ Tópicos Indexados: ${est.memoria.topicosIndexados}
`.trim();
}

module.exports = {
  processar,
  aprender,
  atualizarPerfil,
  registrarTopico,
  estatisticas,
  relatorioEconomia
};
