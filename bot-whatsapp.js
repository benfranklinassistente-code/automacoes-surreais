/**
 * 🤖 BOT 60maisPlay - WhatsApp
 * 
 * Monitor unificado que processa:
 * - Comandos de menu
 * - Perguntas (FAQ)
 * - Navegação por cursos
 */

const fs = require('fs');
const http = require('http');
const { FAQS } = require('./faq-whatsapp.js');
const { CURSOS, menuPrincipal, menuCursos, menuAulas, menuSuporte, menuSobre, resumoAula } = require('./menu-whatsapp.js');

// ============================================
// 🔧 CONFIGURAÇÕES
// ============================================

const CONFIG = {
  gatewayToken: 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  grupoId: '120363407488049190@g.us',
  logPath: '/tmp/bot-processado.json',
  statePath: '/tmp/bot-estado.json',
  cooldownFaqMs: 60000, // 1 min entre respostas do mesmo FAQ
  botNumber: '5511920990009'
};

// ============================================
// 💾 PERSISTÊNCIA
// ============================================

function carregar(path, def = {}) {
  try {
    if (fs.existsSync(path)) {
      return JSON.parse(fs.readFileSync(path, 'utf8'));
    }
  } catch (e) {}
  return def;
}

function salvar(path, data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

// Estado dos usuários
let estado = carregar(CONFIG.statePath, { usuarios: {} });
let historico = carregar(CONFIG.logPath, { processados: [], respostas: {} });

// ============================================
// 📨 ENVIO DE MENSAGEM
// ============================================

async function enviarMensagem(mensagem) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      channel: 'whatsapp',
      target: CONFIG.grupoId,
      message: mensagem
    });

    const options = {
      hostname: '127.0.0.1',
      port: 18789,
      path: '/api/message/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.gatewayToken}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ============================================
// 📥 BUSCAR MENSAGENS
// ============================================

function buscarMensagensRecentes() {
  // Encontrar arquivo de log mais recente
  const logDir = '/tmp/openclaw';
  const files = fs.readdirSync(logDir).filter(f => f.endsWith('.log')).sort().reverse();
  
  if (files.length === 0) return [];
  
  const logPath = `${logDir}/${files[0]}`;
  const logs = fs.readFileSync(logPath, 'utf8');
  const linhas = logs.split('\n').slice(-300);
  
  const mensagens = [];
  
  for (const linha of linhas) {
    if (linha.includes('inbound message')) {
      try {
        const bodyMatch = linha.match(/"body":"([^"]+)"/);
        const fromMatch = linha.match(/"from":"([^"]+)"/);
        const timestampMatch = linha.match(/"timestamp":(\d+)/);
        
        if (bodyMatch && fromMatch) {
          mensagens.push({
            body: bodyMatch[1],
            from: fromMatch[1],
            timestamp: timestampMatch ? parseInt(timestampMatch[1]) : Date.now()
          });
        }
      } catch (e) {}
    }
  }
  
  return mensagens;
}

// ============================================
// 🧠 PROCESSAMENTO
// ============================================

function encontrarFAQ(mensagem) {
  const textoLower = mensagem.toLowerCase();
  
  for (const [chave, faq] of Object.entries(FAQS)) {
    for (const palavra of faq.palavras) {
      if (textoLower.includes(palavra.toLowerCase())) {
        return { chave, faq };
      }
    }
  }
  
  return null;
}

function processarComandoMenu(mensagem, usuarioId) {
  const texto = mensagem.toLowerCase().trim();
  const userState = estado.usuarios[usuarioId] || { menu: 'principal' };
  
  // Comandos globais - MENU
  if (texto === 'menu' || texto === 'oi' || texto === 'olá' || texto === 'ola' || texto === '1') {
    estado.usuarios[usuarioId] = { menu: 'principal' };
    salvar(CONFIG.statePath, estado);
    return menuPrincipal();
  }
  
  // CURSOS
  if (texto === 'cursos' || texto === 'ver cursos' || texto === '2') {
    estado.usuarios[usuarioId] = { menu: 'cursos' };
    salvar(CONFIG.statePath, estado);
    return menuCursos();
  }
  
  // SUPORTE
  if (texto === 'suporte' || texto === '5') {
    return menuSuporte();
  }
  
  // SOBRE
  if (texto === 'sobre' || texto === '6') {
    return menuSobre();
  }
  
  // Navegação em cursos (se o usuário está no menu de cursos)
  if (userState.menu === 'cursos' && CURSOS[texto]) {
    estado.usuarios[usuarioId] = { menu: 'aulas', curso: texto };
    salvar(CONFIG.statePath, estado);
    return menuAulas(texto);
  }
  
  // Navegação em aulas
  if (userState.menu === 'aulas' && userState.curso) {
    const aula = resumoAula(userState.curso, texto);
    if (aula) return aula;
  }
  
  // Comando direto de curso (ex: "curso 2")
  if (texto.startsWith('curso ')) {
    const num = texto.split(' ')[1];
    if (CURSOS[num]) {
      estado.usuarios[usuarioId] = { menu: 'aulas', curso: num };
      salvar(CONFIG.statePath, estado);
      return menuAulas(num);
    }
  }
  
  return null;
}

function montarRespostaFAQ(faq) {
  return `${faq.resposta}

🔗 *Aula recomendada:*
${faq.aula}

---
_Professor Luis - 60maisPlay_`;
}

// ============================================
// 🚀 MONITOR PRINCIPAL
// ============================================

async function monitorar() {
  console.log('🤖 Monitorando grupo...\n');
  
  const mensagens = buscarMensagensRecentes();
  let respostasEnviadas = 0;
  
  for (const msg of mensagens) {
    // Ignorar mensagens do próprio bot
    if (msg.from.includes(CONFIG.botNumber)) continue;
    
    // Ignorar mensagens já processadas
    if (historico.processados.includes(msg.timestamp)) continue;
    
    // Marcar como processado
    historico.processados.push(msg.timestamp);
    if (historico.processados.length > 100) {
      historico.processados = historico.processados.slice(-50);
    }
    
    // 1. TENTAR PROCESSAR COMO COMANDO DE MENU
    const respostaMenu = processarComandoMenu(msg.body, msg.from);
    
    if (respostaMenu) {
      console.log(`📩 Menu: "${msg.body}"`);
      console.log('✅ Respondendo com menu...\n');
      await enviarMensagem(respostaMenu);
      respostasEnviadas++;
      continue;
    }
    
    // 2. TENTAR PROCESSAR COMO FAQ
    const resultado = encontrarFAQ(msg.body);
    
    if (resultado) {
      // Verificar cooldown
      const ultimaResposta = historico.respostas[resultado.chave] || 0;
      if (Date.now() - ultimaResposta < CONFIG.cooldownFaqMs) {
        console.log(`⏳ Cooldown: ${resultado.chave}`);
        continue;
      }
      
      console.log(`📩 FAQ: "${msg.body}"`);
      console.log(`✅ Tema: ${resultado.chave}\n`);
      
      const resposta = montarRespostaFAQ(resultado.faq);
      await enviarMensagem(resposta);
      
      historico.respostas[resultado.chave] = Date.now();
      respostasEnviadas++;
    }
  }
  
  // Salvar histórico
  salvar(CONFIG.logPath, historico);
  
  console.log(`📊 Resumo: ${respostasEnviadas} respostas enviadas`);
}

// Executar
monitorar().catch(console.error);
