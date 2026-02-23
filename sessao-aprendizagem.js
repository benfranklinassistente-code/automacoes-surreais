/**
 * Sessão de Aprendizagem Diária - 19:00 Brasília
 * Registra lições aprendidas e melhora contínua
 */

const fs = require('fs');
const path = require('path');

const MEMORY_FILE = '/root/.openclaw/workspace/memory/licoes-aprendidas.md';
const SESSIONS_DIR = '/root/.openclaw/workspace/memory/sessoes-aprendizagem';

function getDataBrasilia() {
  const now = new Date();
  // Brasília é UTC-3
  const brasilia = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  return brasilia.toLocaleDateString('pt-BR');
}

function getHoraBrasilia() {
  const now = new Date();
  const brasilia = new Date(now.getTime() - (3 * 60 * 60 * 1000));
  return brasilia.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

async function analisarSessoesDoDia() {
  // Buscar arquivos de sessão de hoje
  const hoje = getDataBrasilia().replace(/\//g, '-');
  const sessionFiles = fs.readdirSync('/root/.openclaw/workspace/memory/')
    .filter(f => f.includes('2026-02-20') || f.includes(hoje));
  
  const licoes = [];
  
  // Analisar MEMORY.md principal
  if (fs.existsSync('/root/.openclaw/workspace/MEMORY.md')) {
    const memory = fs.readFileSync('/root/.openclaw/workspace/MEMORY.md', 'utf-8');
    // Extrair insights...
  }
  
  return licoes;
}

async function registrarSessao() {
  const data = getDataBrasilia();
  const hora = getHoraBrasilia();
  
  // Criar diretório se não existir
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }
  
  // Ler arquivo de lições existente
  let conteudo = '';
  if (fs.existsSync(MEMORY_FILE)) {
    conteudo = fs.readFileSync(MEMORY_FILE, 'utf-8');
  }
  
  // Template da sessão
  const sessao = `

---

## 📅 ${data} - Sessão das ${hora}

### ✅ O que funcionou bem hoje:
- [Registre aqui]

### ❌ O que pode melhorar:
- [Registre aqui]

### 💡 Insights importantes:
- [Registre aqui]

### 📋 Próximas ações:
- [Registre aqui]

`;

  // Atualizar arquivo
  if (!conteudo.includes(`## 📅 ${data}`)) {
    fs.appendFileSync(MEMORY_FILE, sessao);
    console.log(`✅ Sessão de aprendizagem registrada: ${data} ${hora}`);
  } else {
    console.log(`ℹ️ Sessão já registrada hoje`);
  }
  
  return { sucesso: true, data, hora };
}

// Executar se chamado diretamente
if (require.main === module) {
  registrarSessao().then(r => console.log(JSON.stringify(r, null, 2)));
}

module.exports = { registrarSessao, analisarSessoesDoDia };
