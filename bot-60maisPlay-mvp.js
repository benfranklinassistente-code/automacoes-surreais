/**
 * Bot 60maisPlay MVP
 * 
 * Bot conversacional para WhatsApp com:
 * - Menu fluido e conversacional
 * - IA para responder dúvidas
 * - Cache de cursos (resposta instantânea)
 * - Banco de dados (usuários, progresso, histórico)
 * 
 * Filosofia: RESOLVER O PROBLEMA PRIMEIRO, aulas depois
 * 
 * Arquivo: bot-60maisPlay-mvp.js
 * Criado: 2026-02-21
 */

const fs = require('fs');
const path = require('path');

// Carregar cache de cursos
const CURSOS_CACHE = JSON.parse(fs.readFileSync(path.join(__dirname, 'cursos-cache.json'), 'utf8'));

// Carregar banco de dados
const banco = require('./banco-60maisPlay.js');

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Buscar curso por termo
function buscarCurso(termo) {
  const termoLower = termo.toLowerCase();
  return CURSOS_CACHE.cursos.find(c => 
    c.nome.toLowerCase().includes(termoLower) ||
    c.slug.toLowerCase().includes(termoLower) ||
    c.descricao.toLowerCase().includes(termoLower)
  );
}

// Buscar cursos por categoria
function cursosPorCategoria(categoria) {
  return CURSOS_CACHE.cursos.filter(c => c.categoria === categoria);
}

// Listar todos os cursos (formatado)
function listarCursos() {
  return CURSOS_CACHE.cursos.map((c, i) => `${i + 1}. ${c.nome}`).join('\n');
}

// ============================================
// PROCESSADOR DE MENSAGENS
// ============================================

async function processarMensagem(telefone, mensagem) {
  console.log(`📱 [${telefone}] Mensagem: ${mensagem}`);
  
  // 1. Registrar/buscar usuário
  const usuario = banco.registrarUsuario(telefone);
  console.log(`👤 Usuário: ${usuario.nome || 'Novo'} (${usuario.nivel})`);
  
  // 2. Buscar histórico recente
  const historico = banco.buscarHistorico(usuario.id, 5);
  
  // 3. Processar a mensagem
  const resposta = await gerarResposta(usuario, mensagem, historico);
  
  // 4. Registrar conversa
  banco.registrarConversa(usuario.id, mensagem, resposta);
  
  return resposta;
}

// ============================================
// GERADOR DE RESPOSTAS
// ============================================

async function gerarResposta(usuario, mensagem, historico) {
  const msgLower = mensagem.toLowerCase().trim();
  
  // ----------------------------------------
  // SAUDAÇÕES INICIAIS
  // ----------------------------------------
  if (['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'começar', 'comecar'].some(s => msgLower.includes(s))) {
    return gerarSaudacao(usuario);
  }
  
  // ----------------------------------------
  // VER CURSOS / CATÁLOGO
  // ----------------------------------------
  if (['curso', 'cursos', 'catalogo', 'catálogo', 'ver cursos', '1'].some(s => msgLower.includes(s))) {
    return gerarListaCursos(usuario);
  }
  
  // ----------------------------------------
  // TIRAR DÚVIDA
  // ----------------------------------------
  if (['dúvida', 'duvida', 'pergunta', 'ajuda', '2', 'como faço', 'como fazer', 'não sei', 'nao sei'].some(s => msgLower.includes(s))) {
    return gerarRespostaDuvida(usuario, mensagem);
  }
  
  // ----------------------------------------
  // VER PROGRESSO
  // ----------------------------------------
  if (['progresso', 'meu progresso', '3', 'andamento'].some(s => msgLower.includes(s))) {
    return gerarRelatorioProgresso(usuario);
  }
  
  // ----------------------------------------
  // DETECTAR INTENÇÃO ESPECÍFICA
  // ----------------------------------------
  
  // WhatsApp
  if (['whatsapp', 'zap', 'wpp', 'mensagem', 'enviar foto', 'enviar video'].some(s => msgLower.includes(s))) {
    const curso = buscarCurso('whatsapp');
    return gerarRespostaComCurso(usuario, mensagem, curso);
  }
  
  // Segurança / Golpe / PIX
  if (['golpe', 'pix', 'segurança', 'seguranca', 'roubado', 'senha', 'boleton', 'senha banco'].some(s => msgLower.includes(s))) {
    const curso = buscarCurso('seguranca');
    return gerarRespostaComCurso(usuario, mensagem, curso);
  }
  
  // Celular / Smartphone
  if (['celular', 'smartphone', 'telefone', 'foto', 'câmera', 'camera'].some(s => msgLower.includes(s))) {
    const curso = buscarCurso('smartphone');
    return gerarRespostaComCurso(usuario, mensagem, curso);
  }
  
  // Email
  if (['email', 'e-mail', 'gmail', 'outlook', 'yahoo'].some(s => msgLower.includes(s))) {
    const curso = buscarCurso('gmail');
    return gerarRespostaComCurso(usuario, mensagem, curso);
  }
  
  // Videochamada
  if (['videochamada', 'video chamada', 'zoom', 'meet', 'reunião', 'reuniao'].some(s => msgLower.includes(s))) {
    const curso = buscarCurso('zoom');
    return gerarRespostaComCurso(usuario, mensagem, curso);
  }
  
  // ----------------------------------------
  // RESPOSTA PADRÃO COM MENU
  // ----------------------------------------
  return gerarMenuPrincipal(usuario);
}

// ============================================
// FUNÇÕES DE RESPOSTA
// ============================================

function gerarSaudacao(usuario) {
  const saudacao = usuario.novo 
    ? `Olá! Seja bem-vindo ao 60maisPlay! 🎉\n\nSou seu assistente de tecnologia. Estou aqui para te ajudar!`
    : `Olá ${usuario.nome || ''}! 👋 Que bom ver você de novo!`;
  
  return `${saudacao}

O que você gostaria de fazer hoje?

1️⃣ Ver cursos disponíveis
2️⃣ Tirar uma dúvida
3️⃣ Ver meu progresso

💡 *Dica: Você também pode me fazer qualquer pergunta sobre tecnologia!*`;
}

function gerarMenuPrincipal(usuario) {
  return `Como posso te ajudar?

1️⃣ Ver cursos disponíveis
2️⃣ Tirar uma dúvida
3️⃣ Ver meu progresso

💬 *É só digitar sua dúvida que eu te ajudo!*`;
}

function gerarListaCursos(usuario) {
  const cursosPorNivel = usuario.nivel === 'iniciante'
    ? CURSOS_CACHE.cursos.filter(c => c.nivel === 'iniciante').slice(0, 10)
    : CURSOS_CACHE.cursos;
  
  let resposta = `📚 *CURSOS DISPONÍVEIS*\n\n`;
  
  cursosPorNivel.forEach((c, i) => {
    resposta += `${i + 1}. ${c.nome}\n`;
  });
  
  resposta += `\n💡 *Digite o nome do curso que você quer saber mais!*`;
  resposta += `\n\n Ou me diga o que você quer aprender!`;
  
  return resposta;
}

function gerarRelatorioProgresso(usuario) {
  const progresso = banco.buscarProgresso(usuario.id);
  
  if (progresso.length === 0) {
    return `📊 *SEU PROGRESSO*\n\nVocê ainda não iniciou nenhum curso.\n\nQuer começar agora? É só me dizer o que quer aprender! 🚀`;
  }
  
  let resposta = `📊 *SEU PROGRESSO*\n\n`;
  
  progresso.forEach(p => {
    const curso = CURSOS_CACHE.cursos.find(c => c.slug === p.curso_slug);
    const emoji = p.percentual >= 100 ? '✅' : '🔄';
    resposta += `${emoji} ${curso?.nome || p.curso_slug}: ${p.percentual}%\n`;
  });
  
  resposta += `\n🎯 *Nível atual: ${usuario.nivel.toUpperCase()}*`;
  
  return resposta;
}

function gerarRespostaDuvida(usuario, mensagem) {
  // Extrair a dúvida real da mensagem
  const duvida = mensagem
    .replace(/^(duvida|dúvida|pergunta|ajuda|como faço|como fazer)\s*/i, '')
    .trim();
  
  if (!duvida || duvida.length < 3) {
    return `Claro! Qual é a sua dúvida? Me conta que eu te ajudo! 😊`;
  }
  
  // Buscar curso relacionado
  const cursoRelacionado = buscarCurso(duvida);
  
  if (cursoRelacionado) {
    return `Ótima pergunta! 😊

📚 Temos um curso que pode te ajudar muito:
*${cursoRelacionado.nome}*

${cursoRelacionado.descricao}

🔗 Acesse: ${cursoRelacionado.url}

---
💡 *Ou me diz exatamente o que você precisa fazer que eu te explico agora mesmo!*`;
  }
  
  // Não encontrou curso específico
  return `Entendi sua dúvida! 

Me explica um pouco mais o que você precisa fazer? Assim eu te ajudo da melhor forma! 

💡 *Quanto mais detalhes, melhor eu posso te ajudar!*`;
}

function gerarRespostaComCurso(usuario, mensagem, curso) {
  if (!curso) {
    return gerarMenuPrincipal(usuario);
  }
  
  // Registrar interesse no curso
  banco.registrarProgresso(usuario.id, curso.slug, 0);
  
  return `Encontrei algo que pode te ajudar! 🎯

📚 *${curso.nome}*

${curso.descricao}

🔗 Acesse o curso: ${curso.url}

---
💡 *Quer que eu te explique algo específico? É só perguntar!*`;
}

// ============================================
// EXPORTAR
// ============================================

module.exports = {
  processarMensagem,
  buscarCurso,
  listarCursos,
  CURSOS_CACHE
};
