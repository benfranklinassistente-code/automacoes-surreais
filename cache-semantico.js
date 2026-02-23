/**
 * 🧠 Cache Semântico
 * Detecta perguntas SIMILARES (não apenas idênticas)
 * Usa similaridade de texto simples (sem embeddings externos)
 */

const fs = require('fs');
const path = require('path');

const CACHE_FILE = '/root/.openclaw/workspace/memory/cache-semantico.json';

// Configurações
const CONFIG = {
  similarityThreshold: 0.7,    // 70% similar = cache hit
  maxCacheSize: 200,           // Máximo de entradas
  ttlMs: 24 * 60 * 60 * 1000,  // 24 horas
  minQueryLength: 3            // Mínimo de caracteres
};

// Cache em memória
let cache = {
  entries: [],
  stats: { hits: 0, misses: 0, tokensSaved: 0 }
};

/**
 * Carrega cache do disco
 */
function loadCache() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    }
  } catch (e) {
    cache = { entries: [], stats: { hits: 0, misses: 0, tokensSaved: 0 } };
  }
}

/**
 * Salva cache no disco
 */
function saveCache() {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (e) {}
}

// Inicializar
loadCache();

/**
 * Normaliza texto para comparação
 */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Remove acentos
    .replace(/[^\w\s]/g, '')          // Remove pontuação
    .replace(/\s+/g, ' ')             // Normaliza espaços
    .trim();
}

/**
 * Extrai palavras-chave
 */
function extractKeywords(text) {
  const stopWords = new Set([
    'o', 'a', 'os', 'as', 'um', 'uma', 'uns', 'umas',
    'de', 'do', 'da', 'dos', 'das', 'em', 'no', 'na', 'nos', 'nas',
    'para', 'por', 'com', 'sem', 'sobre', 'entre', 'após',
    'que', 'qual', 'quando', 'onde', 'como', 'quem', 'quanto',
    'é', 'são', 'está', 'estão', 'ser', 'estar', 'ter', 'haver',
    'eu', 'você', 'ele', 'ela', 'nós', 'eles', 'elas',
    'me', 'te', 'se', 'nos', 'lhes', 'meu', 'seu', 'nosso',
    'isso', 'esse', 'este', 'aquilo', 'aquela', 'aquele',
    'mas', 'porém', 'porque', 'se', 'ou', 'e', 'também'
  ]);
  
  const words = normalize(text).split(' ');
  return words.filter(w => w.length > 2 && !stopWords.has(w));
}

/**
 * Calcula similaridade Jaccard entre dois textos
 */
function jaccardSimilarity(text1, text2) {
  const words1 = new Set(extractKeywords(text1));
  const words2 = new Set(extractKeywords(text2));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Detecta intenção da pergunta
 */
function detectIntent(text) {
  const intents = {
    saudacao: ['oi', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'eae'],
    ajuda: ['ajuda', 'help', 'socorro', 'ajudar', 'como funciona'],
    curso: ['curso', 'cursos', 'aula', 'aulas', 'aprender', 'estudar'],
    preco: ['quanto custa', 'preco', 'valor', 'pagar', 'quanto e'],
    suporte: ['suporte', 'humano', 'atendente', 'falar com'],
    problema: ['nao funciona', 'nao consigo', 'erro', 'problema', 'ajuda'],
    tutorial: ['como', 'como fazer', 'passo a passo', 'tutorial', 'ensina']
  };
  
  const normalized = normalize(text);
  
  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(k => normalized.includes(k))) {
      return intent;
    }
  }
  
  return 'geral';
}

/**
 * Busca no cache semântico
 */
function findSimilar(query) {
  if (!query || query.length < CONFIG.minQueryLength) {
    return { found: false };
  }
  
  // Limpar entradas expiradas
  const now = Date.now();
  cache.entries = cache.entries.filter(e => now - e.timestamp < CONFIG.ttlMs);
  
  const queryIntent = detectIntent(query);
  let bestMatch = null;
  let bestScore = 0;
  
  for (const entry of cache.entries) {
    // Calcular similaridade
    const similarity = jaccardSimilarity(query, entry.query);
    const sameIntent = entry.intent === queryIntent;
    
    // Score combinado (similaridade + intenção)
    const score = sameIntent ? similarity + 0.2 : similarity;
    
    if (score > bestScore && score >= CONFIG.similarityThreshold) {
      bestScore = score;
      bestMatch = entry;
    }
  }
  
  if (bestMatch) {
    cache.stats.hits++;
    cache.stats.tokensSaved += 100;
    saveCache();
    
    return {
      found: true,
      response: bestMatch.response,
      similarity: bestScore,
      intent: queryIntent,
      cached: true
    };
  }
  
  cache.stats.misses++;
  saveCache();
  
  return { found: false, intent: queryIntent };
}

/**
 * Adiciona ao cache
 */
function addToCache(query, response, tokens = 100) {
  if (!query || !response) return;
  if (query.length < CONFIG.minQueryLength) return;
  
  // Verificar se já existe similar
  const existing = findSimilar(query);
  if (existing.found) return;
  
  // Adicionar nova entrada
  cache.entries.push({
    query: normalize(query),
    response: response,
    intent: detectIntent(query),
    tokens: tokens,
    timestamp: Date.now()
  });
  
  // Limitar tamanho
  if (cache.entries.length > CONFIG.maxCacheSize) {
    cache.entries = cache.entries.slice(-CONFIG.maxCacheSize);
  }
  
  saveCache();
}

/**
 * Perguntas pré-populadas comuns
 */
const PREPOPULATED = [
  // Saudações
  { q: 'oi', r: 'Olá! 👋 Sou o assistente 60maisPlay. Como posso te ajudar?' },
  { q: 'ola', r: 'Olá! 👋 Sou o assistente 60maisPlay. Como posso te ajudar?' },
  { q: 'bom dia', r: 'Bom dia! ☀️ Como posso te ajudar hoje?' },
  { q: 'boa tarde', r: 'Boa tarde! 🌤️ Como posso te ajudar?' },
  { q: 'boa noite', r: 'Boa noite! 🌙 Precisando de alguma ajuda?' },
  
  // Identidade
  { q: 'quem e voce', r: 'Sou o assistente virtual 60maisPlay! 🤖 Ajudo com tecnologia, cursos e muito mais.' },
  { q: 'o que voce faz', r: 'Ajudo com: tecnologia, cursos, dúvidas do dia a dia. Digite "menu" para ver opções.' },
  
  // Cursos
  { q: 'cursos', r: '📚 *Cursos 60+:*\n1. Smartphone Básico\n2. WhatsApp Completo\n3. Internet Segura\n4. Facebook Social\n\nDigite "aula [nome]" para começar!' },
  { q: 'ver cursos', r: '📚 *Cursos 60+:*\n1. Smartphone Básico\n2. WhatsApp Completo\n3. Internet Segura\n4. Facebook Social' },
  
  // Preços
  { q: 'quanto custa', r: 'Nossos cursos começam em R$ 37,00. 💰 Temos opções parceladas!' },
  { q: 'preco', r: 'Cursos a partir de R$ 37,00. 💰 Fale com suporte para condições especiais!' },
  { q: 'valor', r: 'Investimento a partir de R$ 37,00 por mini curso. 📚' },
  
  // Suporte
  { q: 'suporte', r: '📞 Para falar com atendente humano, aguarde que já respondemos!' },
  { q: 'falar com humano', r: '📞 Para atendimento humano: aguarde, respondemos em até 24h.' },
  
  // Agradecimentos
  { q: 'obrigado', r: 'Por nada! 😊 Estou aqui pra ajudar. Mais alguma dúvida?' },
  { q: 'obrigada', r: 'Por nada! 😊 Estou aqui pra ajudar. Mais alguma dúvida?' },
  { q: 'valeu', r: 'De nada! 👍 Precisando, é só chamar!' },
  
  // Despedida
  { q: 'tchau', r: 'Até logo! 👋 Foi um prazer ajudar. Volte sempre!' },
  { q: 'ate mais', r: 'Até mais! 👋 Qualquer coisa é só chamar!' },
  
  // Menu
  { q: 'menu', r: '📱 *Menu Principal:*\n• "cursos" - ver cursos\n• "aula [tema]" - fazer aula\n• "dica" - dica tech\n• "suporte" - falar humano' },
  { q: 'ajuda', r: '📱 Digite "menu" para ver todas as opções disponíveis!' },
  
  // Problemas comuns
  { q: 'esqueci a senha', r: '🔐 Para recuperar senha:\n1. Vá em "Esqueci senha"\n2. Digite seu email\n3. Verifique sua caixa de entrada' },
  { q: 'nao consigo entrar', r: 'Problemas de acesso:\n1. Verifique email/senha\n2. Tente "Esqueci senha"\n3. Limpe cache do navegador' },
  { q: 'nao funciona', r: 'Vou te ajudar! 🤔 Me conta melhor o que está acontecendo.' },
  
  // Tecnologia
  { q: 'o que e pdf', r: '📄 PDF é um formato de documento que pode ser aberto em qualquer aparelho sem perder a formatação.' },
  { q: 'o que e app', r: '📱 App = Aplicativo. É um programinha que você instala no celular.' },
  { q: 'o que e wifi', r: '📶 WiFi é internet sem fio. Conecta seu celular/PC à internet pelo ar!' },
  
  // Segurança
  { q: 'golpe', r: '⚠️ *CUIDADO COM GOLPES!*\n• Não passe códigos do WhatsApp\n• Não clique em links suspeitos\n• Não faça PIX para desconhecidos' },
  { q: 'senha', r: '🔐 *Dicas de senha:*\n• Use 8+ caracteres\n• Misture letras, números, símbolos\n• Não use datas de nascimento' },
  { q: 'pix', r: '💰 Antes de fazer PIX:\n• Verifique o nome do destinatário\n• Confirme o valor\n• Não faça para desconhecidos' }
];

/**
 * Popula cache com perguntas comuns
 */
function prepopulate() {
  for (const item of PREPOPULATED) {
    addToCache(item.q, item.r, 80);
  }
}

/**
 * Estatísticas do cache
 */
function getStats() {
  return {
    ...cache.stats,
    entries: cache.entries.length,
    hitRate: cache.stats.hits + cache.stats.misses > 0
      ? ((cache.stats.hits / (cache.stats.hits + cache.stats.misses)) * 100).toFixed(1) + '%'
      : '0%'
  };
}

/**
 * Limpa cache
 */
function clear() {
  cache = { entries: [], stats: { hits: 0, misses: 0, tokensSaved: 0 } };
  saveCache();
}

// Pre-popular ao carregar
prepopulate();

module.exports = {
  findSimilar,
  addToCache,
  getStats,
  clear,
  prepopulate,
  detectIntent,
  jaccardSimilarity,
  normalize,
  extractKeywords
};
