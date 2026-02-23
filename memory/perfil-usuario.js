/**
 * 👤 Memória Estruturada por Usuário
 * Armazena apenas FATOS importantes, não conversas inteiras
 */

const fs = require('fs');
const path = require('path');

const PERFIS_DIR = '/root/.openclaw/workspace/memory/perfis';

// Schema de perfil
const PERFIL_SCHEMA = {
  usuario_id: '',
  criado_em: null,
  atualizado_em: null,
  perfil: { nome: null, nivel_tecnologico: null, faixa_etaria: null },
  interesses: [],
  dificuldades: [],
  ultimos_topicos: [],
  proximos_passos: [],
  metricas: { total_interacoes: 0, ultima_interacao: null }
};

function ensureDir() {
  if (!fs.existsSync(PERFIS_DIR)) fs.mkdirSync(PERFIS_DIR, { recursive: true });
}

function getPerfil(usuarioId) {
  ensureDir();
  const arquivo = path.join(PERFIS_DIR, `${usuarioId}.json`);
  if (fs.existsSync(arquivo)) return JSON.parse(fs.readFileSync(arquivo, 'utf8'));
  const novo = { ...PERFIL_SCHEMA, usuario_id: usuarioId, criado_em: Date.now(), atualizado_em: Date.now() };
  fs.writeFileSync(arquivo, JSON.stringify(novo, null, 2));
  return novo;
}

function atualizarPerfil(usuarioId, dados) {
  const perfil = getPerfil(usuarioId);
  if (dados.nome) perfil.perfil.nome = dados.nome;
  if (dados.nivel) perfil.perfil.nivel_tecnologico = dados.nivel;
  if (dados.interesse && !perfil.interesses.includes(dados.interesse)) perfil.interesses.push(dados.interesse);
  if (dados.dificuldade && !perfil.dificuldades.includes(dados.dificuldade)) perfil.dificuldades.push(dados.dificuldade);
  perfil.metricas.total_interacoes++;
  perfil.metricas.ultima_interacao = Date.now();
  perfil.atualizado_em = Date.now();
  fs.writeFileSync(path.join(PERFIS_DIR, `${usuarioId}.json`), JSON.stringify(perfil, null, 2));
  return perfil;
}

function registrarTopico(usuarioId, topico, status = 'discutido') {
  const perfil = getPerfil(usuarioId);
  perfil.ultimos_topicos.push({ topico, data: Date.now(), status });
  if (perfil.ultimos_topicos.length > 20) perfil.ultimos_topicos = perfil.ultimos_topicos.slice(-20);
  fs.writeFileSync(path.join(PERFIS_DIR, `${usuarioId}.json`), JSON.stringify(perfil, null, 2));
  return perfil;
}

function gerarContextoResumido(usuarioId) {
  const perfil = getPerfil(usuarioId);
  let ctx = '[Perfil]\n';
  if (perfil.perfil.nivel_tecnologico) ctx += `Nível: ${perfil.perfil.nivel_tecnologico}\n`;
  if (perfil.interesses.length > 0) ctx += `Interesses: ${perfil.interesses.slice(-5).join(', ')}\n`;
  if (perfil.dificuldades.length > 0) ctx += `Dificuldades: ${perfil.dificuldades.slice(-3).join(', ')}\n`;
  if (perfil.ultimos_topicos.length > 0) ctx += `Tópicos recentes: ${perfil.ultimos_topicos.slice(-3).map(t => t.topico).join(', ')}\n`;
  return ctx;
}

module.exports = { getPerfil, atualizarPerfil, registrarTopico, gerarContextoResumido, PERFIS_DIR };
