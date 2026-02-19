/**
 * Brave Search - Módulo para Newsletter 60maisNews
 * Usa a skill instalada em /root/.openclaw/skills/brave-search
 * 
 * ⚠️ TRATAMENTO DE RATE LIMIT (429):
 * - Retorna array vazio silenciosamente
 * - Sistema usa fallback automático
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Carregar credenciais
const CREDENCIAIS = JSON.parse(fs.readFileSync('./credenciais-60mais.json', 'utf8'));
const BRAVE_API_KEY = CREDENCIAIS.brave?.apiKey;
const SKILL_PATH = CREDENCIAIS.brave?.skillPath || '/root/.openclaw/skills/brave-search';

// Cache simples para evitar chamadas repetidas
const cache = new Map();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hora

/**
 * Busca na web usando Brave Search
 * @param {string} query - Termo de busca
 * @param {number} count - Número de resultados (padrão: 5)
 * @param {boolean} includeContent - Incluir conteúdo das páginas (padrão: false)
 * @returns {Array} Resultados da busca
 */
function buscar(query, count = 5, includeContent = false) {
  // Verificar cache
  const cacheKey = `${query}-${count}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.results;
  }
  
  try {
    let cmd = `cd ${SKILL_PATH} && BRAVE_API_KEY=${BRAVE_API_KEY} node search.js "${query.replace(/"/g, '\\"')}" -n ${count}`;
    if (includeContent) cmd += ' --content';
    
    // stdio: ['pipe', 'pipe', 'ignore'] para silenciar stderr
    const output = execSync(cmd, { 
      encoding: 'utf-8', 
      timeout: 30000,
      stdio: ['pipe', 'pipe', 'ignore']
    });
    
    // Parsear resultados
    const results = [];
    const blocos = output.split('--- Result ');
    
    for (const bloco of blocos) {
      if (!bloco.trim()) continue;
      
      const result = {};
      const linhas = bloco.split('\n');
      
      for (const linha of linhas) {
        if (linha.startsWith('Title: ')) {
          result.titulo = linha.replace('Title: ', '').trim();
        } else if (linha.startsWith('Link: ')) {
          result.link = linha.replace('Link: ', '').trim();
        } else if (linha.startsWith('Snippet: ')) {
          result.snippet = linha.replace('Snippet: ', '').trim();
        } else if (linha.startsWith('Content:')) {
          // Capturar todo o conteúdo restante
          const idx = bloco.indexOf('Content:');
          if (idx !== -1) {
            result.conteudo = bloco.substring(idx + 8).trim();
          }
        }
      }
      
      if (result.titulo && result.link) {
        results.push(result);
      }
    }
    
    // Salvar no cache
    cache.set(cacheKey, { results, timestamp: Date.now() });
    
    return results;
    
  } catch (error) {
    // Tratamento silencioso de rate limit (429) ou outros erros
    // Sistema usará fallback automático
    return [];
  }
}

/**
 * Extrai conteúdo de uma URL
 * @param {string} url - URL para extrair
 * @returns {string} Conteúdo em markdown
 */
function extrairConteudo(url) {
  try {
    const cmd = `cd ${SKILL_PATH} && BRAVE_API_KEY=${BRAVE_API_KEY} node content.js "${url}"`;
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
    return output;
  } catch (error) {
    console.error('❌ Erro ao extrair conteúdo:', error.message);
    return '';
  }
}

/**
 * Busca tendências para o tema da newsletter
 * @param {string} tema - Tema da newsletter
 * @returns {Object} Dados de tendência
 */
async function buscarTendenciasParaTema(tema) {
  const queries = {
    'golpe PIX': ['golpe pix idosos 2026 como evitar', 'golpe pix notícias recente'],
    'segurança celular': ['segurança celular idosos dicas', 'proteger celular golpe 2026'],
    'videochamada': ['videochamada whatsapp idosos tutorial', 'como fazer videochamada netos'],
    'WhatsApp segurança': ['whatsapp segurança idosos golpes', 'proteger whatsapp dicas 2026'],
    'senha banco': ['senha banco celular segurança idosos', 'proteger conta banco celular'],
    'aplicativo idoso': ['melhores aplicativos idosos 2026', 'apps gratuitos idosos úteis'],
    'Google Fotos': ['google fotos backup tutorial idosos', 'salvar fotos google fotos'],
    'Facebook segurança': ['facebook segurança privacidade idosos', 'proteger facebook golpes']
  };
  
  const queryList = queries[tema] || [`${tema} idosos dicas 2026`];
  
  const resultados = [];
  
  for (const query of queryList.slice(0, 2)) {
    const busca = buscar(query, 3);
    resultados.push(...busca);
  }
  
  // Extrair snippets e criar contexto
  const contexto = resultados.map(r => `• ${r.titulo}: ${r.snippet}`).join('\n');
  
  return {
    tema,
    queryUsada: queryList[0],
    resultados,
    contexto,
    totalResultados: resultados.length
  };
}

/**
 * Busca notícias de tecnologia para idosos
 * @returns {Array} Notícias relevantes
 */
function buscarNoticiasTecnologiaIdosos() {
  const query = 'tecnologia idosos dicas segurança 2026 brasil';
  return buscar(query, 5);
}

/**
 * Busca tendências do Google (via Brave)
 * @returns {Array} Tendências
 */
function buscarTendenciasGoogle() {
  const query = 'google trends brasil hoje tecnologia';
  return buscar(query, 5);
}

module.exports = {
  buscar,
  extrairConteudo,
  buscarTendenciasParaTema,
  buscarNoticiasTecnologiaIdosos,
  buscarTendenciasGoogle
};
