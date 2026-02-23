/**
 * Banco de Dados JSON - 60maisPlay
 * 
 * Gerencia:
 * - Usuários
 * - Progresso nos cursos
 * - Histórico de conversas
 * 
 * Arquivo: banco-60maisPlay.js
 * Criado: 2026-02-21
 */

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '60maisPlay-db.json');

// Inicializar banco
function initDB() {
  if (!fs.existsSync(DB_PATH)) {
    const dbInicial = {
      criado_em: new Date().toISOString(),
      usuarios: [],
      progresso: [],
      conversas: []
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(dbInicial, null, 2));
    console.log('✅ Banco criado:', DB_PATH);
  }
  return getDB();
}

// Ler banco
function getDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return initDB();
  }
}

// Salvar banco
function saveDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// Registrar ou atualizar usuário
function registrarUsuario(telefone, nome = null, email = null) {
  const db = getDB();
  
  // Verificar se já existe
  let usuario = db.usuarios.find(u => u.telefone === telefone);
  
  if (usuario) {
    // Atualizar última interação
    usuario.ultima_interacao = new Date().toISOString();
    saveDB(db);
    return { ...usuario, novo: false };
  } else {
    // Criar novo usuário
    const novoId = db.usuarios.length > 0 ? Math.max(...db.usuarios.map(u => u.id)) + 1 : 1;
    usuario = {
      id: novoId,
      telefone,
      nome: nome || null,
      email: email || null,
      nivel: 'iniciante',
      data_cadastro: new Date().toISOString(),
      ultima_interacao: new Date().toISOString()
    };
    db.usuarios.push(usuario);
    saveDB(db);
    return { ...usuario, novo: true };
  }
}

// Buscar usuário por telefone
function buscarUsuario(telefone) {
  const db = getDB();
  return db.usuarios.find(u => u.telefone === telefone) || null;
}

// Buscar usuário por ID
function buscarUsuarioPorId(id) {
  const db = getDB();
  return db.usuarios.find(u => u.id === id) || null;
}

// Atualizar nível do usuário
function atualizarNivel(usuarioId) {
  const db = getDB();
  const usuario = db.usuarios.find(u => u.id === usuarioId);
  if (!usuario) return null;
  
  const progressoUsuario = db.progresso.filter(p => p.usuario_id === usuarioId);
  const totalCursos = progressoUsuario.length;
  const concluidos = progressoUsuario.filter(p => p.percentual >= 100).length;
  
  let nivel = 'iniciante';
  if (totalCursos >= 4 || concluidos >= 2) {
    nivel = 'avancado';
  } else if (totalCursos >= 2 || concluidos >= 1) {
    nivel = 'intermediario';
  }
  
  usuario.nivel = nivel;
  saveDB(db);
  return nivel;
}

// Registrar progresso
function registrarProgresso(usuarioId, cursoSlug, percentual) {
  const db = getDB();
  
  // Verificar se já existe
  let progresso = db.progresso.find(
    p => p.usuario_id === usuarioId && p.curso_slug === cursoSlug
  );
  
  if (progresso) {
    // Atualizar
    progresso.percentual = percentual;
    progresso.data_ultima_aula = new Date().toISOString();
  } else {
    // Criar novo
    const novoId = db.progresso.length > 0 ? Math.max(...db.progresso.map(p => p.id)) + 1 : 1;
    progresso = {
      id: novoId,
      usuario_id: usuarioId,
      curso_slug: cursoSlug,
      percentual,
      data_inicio: new Date().toISOString(),
      data_ultima_aula: new Date().toISOString()
    };
    db.progresso.push(progresso);
  }
  
  saveDB(db);
  
  // Atualizar nível do usuário
  atualizarNivel(usuarioId);
  
  return progresso;
}

// Buscar progresso do usuário
function buscarProgresso(usuarioId) {
  const db = getDB();
  return db.progresso.filter(p => p.usuario_id === usuarioId);
}

// Registrar conversa
function registrarConversa(usuarioId, mensagemUsuario, respostaBot) {
  const db = getDB();
  
  const novoId = db.conversas.length > 0 ? Math.max(...db.conversas.map(c => c.id)) + 1 : 1;
  const conversa = {
    id: novoId,
    usuario_id: usuarioId,
    mensagem_usuario: mensagemUsuario,
    resposta_bot: respostaBot,
    data: new Date().toISOString()
  };
  
  db.conversas.push(conversa);
  saveDB(db);
  
  return conversa;
}

// Buscar histórico de conversas
function buscarHistorico(usuarioId, limite = 10) {
  const db = getDB();
  return db.conversas
    .filter(c => c.usuario_id === usuarioId)
    .slice(-limite);
}

// Estatísticas gerais
function estatisticas() {
  const db = getDB();
  return {
    total_usuarios: db.usuarios.length,
    usuarios_ativos: db.usuarios.filter(u => {
      const ultima = new Date(u.ultima_interacao);
      const hoje = new Date();
      const dias = (hoje - ultima) / (1000 * 60 * 60 * 24);
      return dias <= 7;
    }).length,
    total_progresso: db.progresso.length,
    cursos_concluidos: db.progresso.filter(p => p.percentual >= 100).length,
    total_conversas: db.conversas.length
  };
}

module.exports = {
  initDB,
  registrarUsuario,
  buscarUsuario,
  buscarUsuarioPorId,
  atualizarNivel,
  registrarProgresso,
  buscarProgresso,
  registrarConversa,
  buscarHistorico,
  estatisticas
};
