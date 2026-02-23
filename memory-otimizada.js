/**
 * 🔗 Integrador de Memória Otimizada
 * Conecta: Histórico Seletivo + Memória Estruturada + Cache FAQ + Cache Semântico
 * 
 * FLUXO:
 * 1. Checar cache semântico (perguntas similares)
 * 2. Checar cache FAQ (perguntas exatas)
 * 3. Se não, carregar perfil do usuário
 * 4. Processar histórico com compactação
 * 5. Retornar contexto mínimo para o modelo
 */

const faqCache = require('./faq-cache.js');
const cacheSemantico = require('./cache-semantico.js');
const historicoSeletivo = require('./historico-seletivo.js');
const perfilUsuario = require('./memory/perfil-usuario.js');

/**
 * Processa mensagem do usuário com otimização de tokens
 */
function processarMensagem(usuarioId, mensagem, historicoCompleto = []) {
  const resultado = {
    usarCache: false,
    respostaCache: null,
    tipoCache: null,        // 'semantico' ou 'faq'
    similaridade: null,     // Para cache semântico
    contextoUsuario: null,
    historicoCompactado: null,
    resumoHistorico: null,
    tokensEconomizados: 0
  };
  
  // 1. CHECAR CACHE SEMÂNTICO (perguntas similares)
  if (cacheSemantico) {
    const semanticoHit = cacheSemantico.findSimilar(mensagem);
    if (semanticoHit.found) {
      resultado.usarCache = true;
      resultado.respostaCache = semanticoHit.response;
      resultado.tipoCache = 'semantico';
      resultado.similaridade = semanticoHit.similarity;
      resultado.tokensEconomizados += 120;
      return resultado;
    }
  }
  
  // 2. CHECAR CACHE FAQ (perguntas exatas)
  if (faqCache) {
    const cacheHit = faqCache.findInCache(mensagem);
    if (cacheHit.found) {
      resultado.usarCache = true;
      resultado.respostaCache = cacheHit.response;
      resultado.tipoCache = 'faq';
      resultado.tokensEconomizados += 150;
      faqCache.recordHit(150);
      return resultado;
    }
  }
  
  // 3. CARREGAR CONTEXTO DO USUÁRIO
  if (perfilUsuario) {
    resultado.contextoUsuario = perfilUsuario.gerarContextoResumido(usuarioId);
    resultado.tokensEconomizados += 100;
  }
  
  // 4. COMPACTAR HISTÓRICO
  if (historicoCompleto && historicoCompleto.length > 5) {
    const { historicoCompactado, resumo } = historicoSeletivo.processarHistorico(
      historicoCompleto, 
      usuarioId
    );
    
    resultado.historicoCompactado = historicoCompactado;
    resultado.resumoHistorico = resumo;
    resultado.tokensEconomizados += (historicoCompleto.length - 5) * 50;
    
    historicoSeletivo.recordProcessamento(resultado.tokensEconomizados);
  }
  
  return resultado;
}

/**
 * Gera prompt otimizado com contexto mínimo
 */
function gerarPromptOtimizado(usuarioId, mensagem, historicoCompleto = []) {
  const processado = processarMensagem(usuarioId, mensagem, historicoCompleto);
  
  // Se cache hit, retornar resposta direta
  if (processado.usarCache) {
    return {
      usarRespostaDireta: true,
      resposta: processado.respostaCache,
      tokensEconomizados: processado.tokensEconomizados
    };
  }
  
  // Montar prompt otimizado
  let prompt = '';
  
  // Adicionar contexto do usuário (resumido)
  if (processado.contextoUsuario) {
    prompt += processado.contextoUsuario + '\n';
  }
  
  // Adicionar resumo do histórico (se houver)
  if (processado.resumoHistorico) {
    prompt += processado.resumoHistorico + '\n';
  }
  
  // Adicionar histórico recente compactado
  if (processado.historicoCompactado && processado.historicoCompactado.length > 0) {
    prompt += '\n[Conversa recente:]\n';
    for (const msg of processado.historicoCompactado.slice(-3)) {
      const role = msg.role === 'user' ? 'Usuário' : 'Assistente';
      prompt += `${role}: ${msg.content}\n`;
    }
  }
  
  // Adicionar mensagem atual
  prompt += `\nUsuário: ${mensagem}`;
  
  return {
    usarRespostaDireta: false,
    prompt: prompt,
    tokensEconomizados: processado.tokensEconomizados
  };
}

/**
 * Estatísticas gerais
 */
function getEstatisticas() {
  return {
    cacheFAQ: faqCache ? faqCache.getStats() : null,
    cacheSemantico: cacheSemantico ? cacheSemantico.getStats() : null,
    historico: historicoSeletivo ? historicoSeletivo.getStats() : null
  };
}

/**
 * Aprende nova resposta (adiciona aos caches)
 */
function aprenderResposta(pergunta, resposta, tokensEconomizados = 100) {
  // Adicionar ao cache semântico
  if (cacheSemantico) {
    cacheSemantico.addToCache(pergunta, resposta, tokensEconomizados);
  }
}

module.exports = {
  processarMensagem,
  gerarPromptOtimizado,
  getEstatisticas,
  aprenderResposta
};
