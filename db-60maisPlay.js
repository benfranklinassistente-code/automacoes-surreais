/**
 * Banco de Dados SQLite - 60maisPlay
 * 
 * Gerencia:
 * - Usuários
 * - Progresso nos cursos
 * - Histórico de conversas
 * 
 * Arquivo: db-60maisPlay.js
 * Criado: 2026-02-21
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '60maisPlay.db');

// Criar conexão
function getDB() {
  return new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('❌ Erro ao abrir banco:', err.message);
    } else {
      console.log('✅ Banco SQLite conectado');
    }
  });
}

// Inicializar tabelas
function initDB() {
  const db = getDB();
  
  db.serialize(() => {
    // Tabela de usuários
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        telefone TEXT UNIQUE NOT NULL,
        nome TEXT,
        email TEXT,
        nivel TEXT DEFAULT 'iniciante',
        data_cadastro TEXT DEFAULT CURRENT_TIMESTAMP,
        ultima_interacao TEXT DEFAULT CURRENT_TIMESTAMP,
        preferencias TEXT DEFAULT '{}'
      )
    `);
    
    // Tabela de progresso
    db.run(`
      CREATE TABLE IF NOT EXISTS progresso (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        curso_id INTEGER,
        curso_slug TEXT,
        percentual INTEGER DEFAULT 0,
        aulas_concluidas TEXT DEFAULT '[]',
        data_inicio TEXT,
        data_ultima_aula TEXT,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    `);
    
    // Tabela de histórico de conversas
    db.run(`
      CREATE TABLE IF NOT EXISTS conversas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario_id INTEGER,
        mensagem_usuario TEXT,
        resposta_bot TEXT,
        data TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    `);
    
    console.log('✅ Tabelas criadas/verificadas');
  });
  
  db.close();
}

// Registrar ou atualizar usuário
function registrarUsuario(telefone, nome = null, email = null) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    // Verificar se já existe
    db.get('SELECT * FROM usuarios WHERE telefone = ?', [telefone], (err, row) => {
      if (err) {
        db.close();
        return reject(err);
      }
      
      if (row) {
        // Atualizar última interação
        db.run(
          'UPDATE usuarios SET ultima_interacao = CURRENT_TIMESTAMP WHERE telefone = ?',
          [telefone],
          (err) => {
            db.close();
            if (err) reject(err);
            else resolve({ ...row, novo: false });
          }
        );
      } else {
        // Criar novo usuário
        db.run(
          'INSERT INTO usuarios (telefone, nome, email) VALUES (?, ?, ?)',
          [telefone, nome, email],
          function(err) {
            db.close();
            if (err) reject(err);
            else resolve({ id: this.lastID, telefone, nome, email, novo: true });
          }
        );
      }
    });
  });
}

// Buscar usuário
function buscarUsuario(telefone) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.get('SELECT * FROM usuarios WHERE telefone = ?', [telefone], (err, row) => {
      db.close();
      if (err) reject(err);
      else resolve(row);
    });
  });
}

// Calcular nível do usuário
function calcularNivel(usuarioId) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.all(
      'SELECT * FROM progresso WHERE usuario_id = ?',
      [usuarioId],
      (err, rows) => {
        db.close();
        if (err) {
          reject(err);
          return;
        }
        
        const totalCursos = rows.length;
        const concluidos = rows.filter(r => r.percentual >= 100).length;
        
        let nivel = 'iniciante';
        if (totalCursos >= 4 || concluidos >= 2) {
          nivel = 'avancado';
        } else if (totalCursos >= 2 || concluidos >= 1) {
          nivel = 'intermediario';
        }
        
        resolve(nivel);
      }
    );
  });
}

// Registrar progresso
function registrarProgresso(usuarioId, cursoSlug, percentual) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.run(
      `INSERT INTO progresso (usuario_id, curso_slug, percentual, data_inicio, data_ultima_aula)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       ON CONFLICT(usuario_id, curso_slug) DO UPDATE SET
         percentual = ?,
         data_ultima_aula = CURRENT_TIMESTAMP`,
      [usuarioId, cursoSlug, percentual, percentual],
      function(err) {
        db.close();
        if (err) reject(err);
        else resolve({ success: true });
      }
    );
  });
}

// Buscar progresso do usuário
function buscarProgresso(usuarioId) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.all(
      'SELECT * FROM progresso WHERE usuario_id = ?',
      [usuarioId],
      (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

// Registrar conversa
function registrarConversa(usuarioId, mensagemUsuario, respostaBot) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.run(
      'INSERT INTO conversas (usuario_id, mensagem_usuario, resposta_bot) VALUES (?, ?, ?)',
      [usuarioId, mensagemUsuario, respostaBot],
      function(err) {
        db.close();
        if (err) reject(err);
        else resolve({ id: this.lastID });
      }
    );
  });
}

// Buscar histórico de conversas
function buscarHistorico(usuarioId, limite = 10) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    
    db.all(
      'SELECT * FROM conversas WHERE usuario_id = ? ORDER BY data DESC LIMIT ?',
      [usuarioId, limite],
      (err, rows) => {
        db.close();
        if (err) reject(err);
        else resolve(rows.reverse());
      }
    );
  });
}

// Exportar funções
module.exports = {
  initDB,
  registrarUsuario,
  buscarUsuario,
  calcularNivel,
  registrarProgresso,
  buscarProgresso,
  registrarConversa,
  buscarHistorico
};
