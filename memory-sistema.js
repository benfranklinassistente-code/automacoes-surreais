/**
 * 🧠 Sistema de Memória Estruturada Completa
 * 
 * COMPONENTES:
 * 1. Perfil do usuário (já existe)
 * 2. Base de conhecimento (fatos aprendidos)
 * 3. Índice de tópicos (para busca rápida)
 * 4. Timeline de interações
 */

const fs = require('fs');
const path = require('path');

const MEMORY_DIR = '/root/.openclaw/workspace/memory';
const CONHECIMENTO_FILE = path.join(MEMORY_DIR, 'base-conhecimento.json');
const INDICE_FILE = path.join(MEMORY_DIR, 'indice-topicos.json');
const TIMELINE_FILE = path.join(MEMORY_DIR, 'timeline.json');

// Carregar perfil-usuario (caminho correto)
let perfilUsuario = null;
try {
  perfilUsuario = require(path.join(MEMORY_DIR, 'perfil-usuario.js'));
} catch (e) {
  // Fallback vazio
  perfilUsuario = {
    gerarContextoResumido: () => ''
  };
}

// ==================== BASE DE CONHECIMENTO ====================

/**
 * Estrutura:
 * {
 *   "fatos": [
 *     { "id": "fato-1", "tipo": "curso", "conteudo": "...", "tags": [], "fonte": "usuario", "data": ... }
 *   ],
 *   "regras": [
 *     { "condicao": "...", "acao": "...", "prioridade": 1 }
 *   ],
 *   "ultimas_atualizacoes": {}
 * }
 */

let conhecimento = { fatos: [], regras: [], ultimas_atualizacoes: {} };

function carregarConhecimento() {
  try {
    if (fs.existsSync(CONHECIMENTO_FILE)) {
      conhecimento = JSON.parse(fs.readFileSync(CONHECIMENTO_FILE, 'utf8'));
    }
  } catch (e) {}
}

function salvarConhecimento() {
  try {
    if (!fs.existsSync(MEMORY_DIR)) fs.mkdirSync(MEMORY_DIR, { recursive: true });
    fs.writeFileSync(CONHECIMENTO_FILE, JSON.stringify(conhecimento, null, 2));
  } catch (e) {}
}

/**
 * Adiciona um fato à base de conhecimento
 */
function adicionarFato(tipo, conteudo, tags = [], fonte = 'sistema') {
  carregarConhecimento();
  
  const fato = {
    id: `fato-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    tipo,           // 'curso', 'dica', 'problema', 'solucao', 'preferencia'
    conteudo,
    tags,
    fonte,
    data: Date.now(),
    acessos: 0
  };
  
  conhecimento.fatos.push(fato);
  
  // Manter máximo de 500 fatos
  if (conhecimento.fatos.length > 500) {
    // Remover menos acessados
    conhecimento.fatos.sort((a, b) => b.acessos - a.acessos);
    conhecimento.fatos = conhecimento.fatos.slice(0, 500);
  }
  
  conhecimento.ultimas_atualizacoes[tipo] = Date.now();
  salvarConhecimento();
  
  return fato.id;
}

/**
 * Busca fatos por tags ou tipo
 */
function buscarFatos(query = {}) {
  carregarConhecimento();
  
  let resultados = conhecimento.fatos;
  
  if (query.tipo) {
    resultados = resultados.filter(f => f.tipo === query.tipo);
  }
  
  if (query.tags && query.tags.length > 0) {
    resultados = resultados.filter(f => 
      query.tags.some(tag => f.tags.includes(tag))
    );
  }
  
  if (query.texto) {
    const textoLower = query.texto.toLowerCase();
    resultados = resultados.filter(f => 
      f.conteudo.toLowerCase().includes(textoLower) ||
      f.tags.some(t => t.toLowerCase().includes(textoLower))
    );
  }
  
  // Incrementar acessos
  resultados.forEach(f => f.acessos++);
  salvarConhecimento();
  
  return resultados;
}

// ==================== ÍNDICE DE TÓPICOS ====================

/**
 * Estrutura para busca rápida:
 * {
 *   "whatsapp": ["fato-1", "fato-5", ...],
 *   "senha": ["fato-2", "fato-7", ...],
 *   ...
 * }
 */

let indiceTopicos = {};

function carregarIndice() {
  try {
    if (fs.existsSync(INDICE_FILE)) {
      indiceTopicos = JSON.parse(fs.readFileSync(INDICE_FILE, 'utf8'));
    }
  } catch (e) {}
}

function salvarIndice() {
  try {
    fs.writeFileSync(INDICE_FILE, JSON.stringify(indiceTopicos, null, 2));
  } catch (e) {}
}

/**
 * Indexa um fato por suas tags
 */
function indexarFato(fatoId, tags) {
  carregarIndice();
  
  for (const tag of tags) {
    const tagLower = tag.toLowerCase();
    if (!indiceTopicos[tagLower]) {
      indiceTopicos[tagLower] = [];
    }
    if (!indiceTopicos[tagLower].includes(fatoId)) {
      indiceTopicos[tagLower].push(fatoId);
    }
  }
  
  salvarIndice();
}

/**
 * Busca fatos por tópico
 */
function buscarPorTopico(topico) {
  carregarIndice();
  carregarConhecimento();
  
  const topicoLower = topico.toLowerCase();
  const fatoIds = indiceTopicos[topicoLower] || [];
  
  return fatoIds.map(id => 
    conhecimento.fatos.find(f => f.id === id)
  ).filter(Boolean);
}

// ==================== TIMELINE DE INTERAÇÕES ====================

/**
 * Registro cronológico de interações:
 * {
 *   "eventos": [
 *     { "tipo": "pergunta", "usuario": "...", "conteudo": "...", "data": ... }
 *   ]
 * }
 */

let timeline = { eventos: [] };

function carregarTimeline() {
  try {
    if (fs.existsSync(TIMELINE_FILE)) {
      timeline = JSON.parse(fs.readFileSync(TIMELINE_FILE, 'utf8'));
    }
  } catch (e) {}
}

function salvarTimeline() {
  try {
    fs.writeFileSync(TIMELINE_FILE, JSON.stringify(timeline, null, 2));
  } catch (e) {}
}

/**
 * Registra evento na timeline
 */
function registrarEvento(tipo, dados) {
  carregarTimeline();
  
  const evento = {
    id: `evt-${Date.now()}`,
    tipo,           // 'pergunta', 'resposta', 'erro', 'aprendizado'
    dados,
    data: Date.now()
  };
  
  timeline.eventos.push(evento);
  
  // Manter últimos 1000 eventos
  if (timeline.eventos.length > 1000) {
    timeline.eventos = timeline.eventos.slice(-1000);
  }
  
  salvarTimeline();
  
  return evento.id;
}

/**
 * Busca eventos recentes
 */
function eventosRecentes(limite = 20, tipo = null) {
  carregarTimeline();
  
  let eventos = timeline.eventos;
  
  if (tipo) {
    eventos = eventos.filter(e => e.tipo === tipo);
  }
  
  return eventos.slice(-limite);
}

// ==================== CONTEXTO COMPACTO ====================

/**
 * Gera contexto compacto para o modelo
 * Combina: perfil + fatos relevantes + eventos recentes
 */
function gerarContextoCompacto(usuarioId, mensagem = '') {
  let contexto = '';
  
  // 1. Perfil do usuário (máx 200 tokens)
  const perfilCtx = perfilUsuario.gerarContextoResumido(usuarioId);
  if (perfilCtx) {
    contexto += perfilCtx + '\n';
  }
  
  // 2. Fatos relevantes à mensagem (máx 300 tokens)
  if (mensagem) {
    const palavras = mensagem.toLowerCase().split(' ');
    const fatosRelevantes = [];
    
    for (const palavra of palavras) {
      if (palavra.length > 3) {
        const fatos = buscarPorTopico(palavra);
        fatosRelevantes.push(...fatos.slice(0, 2));
      }
    }
    
    if (fatosRelevantes.length > 0) {
      contexto += '[Conhecimento relevante:]\n';
      const unicos = [...new Set(fatosRelevantes)].slice(0, 3);
      for (const fato of unicos) {
        contexto += `• ${fato.conteudo.substring(0, 80)}\n`;
      }
    }
  }
  
  // 3. Últimos eventos do usuário (máx 100 tokens)
  const recentes = eventosRecentes(3);
  if (recentes.length > 0) {
    contexto += '[Recente:]\n';
    for (const evt of recentes) {
      if (evt.dados.usuario === usuarioId) {
        contexto += `• ${evt.tipo}: ${JSON.stringify(evt.dados).substring(0, 50)}\n`;
      }
    }
  }
  
  return contexto;
}

// ==================== ESTATÍSTICAS ====================

function getEstatisticas() {
  carregarConhecimento();
  carregarIndice();
  carregarTimeline();
  
  return {
    fatos: conhecimento.fatos.length,
    topicosIndexados: Object.keys(indiceTopicos).length,
    eventos: timeline.eventos.length,
    fatosPorTipo: {
      curso: conhecimento.fatos.filter(f => f.tipo === 'curso').length,
      dica: conhecimento.fatos.filter(f => f.tipo === 'dica').length,
      problema: conhecimento.fatos.filter(f => f.tipo === 'problema').length,
      solucao: conhecimento.fatos.filter(f => f.tipo === 'solucao').length
    }
  };
}

// ==================== INICIALIZAÇÃO ====================

carregarConhecimento();
carregarIndice();
carregarTimeline();

// Pré-popular com conhecimento inicial
function prepopulaConhecimento() {
  // Cursos
  adicionarFato('curso', 'WhatsApp sem Mistérios - 5 aulas', ['whatsapp', 'curso']);
  adicionarFato('curso', 'Compras na Internet - 5 aulas', ['internet', 'compras', 'curso']);
  adicionarFato('curso', 'Inteligência Artificial - 3 aulas', ['ia', 'chatgpt', 'curso']);
  adicionarFato('curso', 'SmartPhone - 3 aulas', ['celular', 'smartphone', 'curso']);
  
  // Dicas
  adicionarFato('dica', 'Nunca compartilhe código do WhatsApp', ['seguranca', 'whatsapp', 'golpe']);
  adicionarFato('dica', 'Use senhas de 8+ caracteres com letras, números e símbolos', ['senha', 'seguranca']);
  adicionarFato('dica', 'Verifique o cadeado do site antes de colocar dados', ['seguranca', 'internet']);
  adicionarFato('dica', 'Não clique em links suspeitos recebidos por mensagem', ['seguranca', 'golpe']);
  
  // Problemas comuns e soluções
  adicionarFato('problema', 'Celular lento - fechar apps, apagar fotos, reiniciar', ['celular', 'lento', 'problema']);
  adicionarFato('problema', 'Sem internet - reiniciar roteador, verificar conta', ['internet', 'wifi', 'problema']);
  adicionarFato('solucao', 'Para enviar foto no WhatsApp: clique no clipe, escolha câmera, envie', ['whatsapp', 'foto', 'tutorial']);
}

// Executar apenas se base vazia
if (conhecimento.fatos.length === 0) {
  prepopulaConhecimento();
}

module.exports = {
  // Conhecimento
  adicionarFato,
  buscarFatos,
  
  // Índice
  indexarFato,
  buscarPorTopico,
  
  // Timeline
  registrarEvento,
  eventosRecentes,
  
  // Contexto
  gerarContextoCompacto,
  
  // Stats
  getEstatisticas
};
