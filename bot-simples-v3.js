/**
 * 🤖 Bot WhatsApp 60maisPlay - Versão Simplificada
 * 
 * Usa API REST do OpenClaw para enviar mensagens
 * Monitora mensagens recebidas via logs
 */

const http = require('http');
const fs = require('fs');

// ============================================
// 🔧 CONFIGURAÇÕES
// ============================================

const CONFIG = {
  gatewayToken: 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  gatewayHost: '127.0.0.1',
  gatewayPort: 18789,
  botNumber: '5511920990009',
  adminNumber: '5511953545939',
  logFile: '/tmp/openclaw/openclaw-2026-02-19.log',
  stateFile: '/tmp/bot-state.json'
};

// ============================================
// 📚 DADOS
// ============================================

const MENU = `🎓 *60maisPlay - Menu Principal*

📚 *1* - Ver todos os cursos
🎬 *2* - Assistir uma aula
❓ *3* - Tirar uma dúvida
📞 *4* - Falar com suporte

💬 _Digite o número da opção!_

---
_Professor Luis - 60maisPlay_`;

const LISTA_CURSOS = `📚 *CURSOS DISPONÍVEIS*

🔹 *1* - WhatsApp sem Mistérios
🔹 *2* - Compras na Internet
🔹 *3* - Inteligência Artificial
🔹 *4* - SmartPhone
🔹 *5* - Gmail e Email
🔹 *6* - Netflix na TV
🔹 *7* - Gov.br
🔹 *8* - Zoom

💬 _Digite o número do curso!_

---
_Professor Luis - 60maisPlay_`;

const CURSOS = {
  "1": { nome: "WhatsApp sem Mistérios", aulas: 5 },
  "2": { nome: "Compras na Internet", aulas: 5 },
  "3": { nome: "Inteligência Artificial", aulas: 3 },
  "4": { nome: "SmartPhone", aulas: 3 },
  "5": { nome: "Gmail e Email", aulas: 3 },
  "6": { nome: "Netflix na TV", aulas: 3 },
  "7": { nome: "Gov.br", aulas: 2 },
  "8": { nome: "Zoom", aulas: 2 }
};

const FAQS = {
  "cadeado": `🔒 *O CADEADO DO NAVEGADOR*

O cadeado 🔒 indica que o site é SEGURO!

✅ Seus dados estão protegidos
⚠️ Sem cadeado = CUIDADO!

---
_Professor Luis_`,
  
  "senha": `🔐 *SENHAS*

⚠️ NUNCA compartilhe senhas!

✅ Use 8+ caracteres
✅ Misture letras, números e símbolos

---
_Professor Luis_`,
  
  "golpe": `⚠️ *GOLPES*

🚨 Sinais de golpe:
• Pedem código do WhatsApp
• Dinheiro fácil
• Pressão rápida

---
_Professor Luis_`,
  
  "pix": `💰 *PIX*

⚠️ Antes de fazer PIX:
• Confirme nome e valor

🚨 "PIX errado, devolve" = GOLPE!

---
_Professor Luis_`
};

// ============================================
// 📤 ENVIAR MENSAGEM
// ============================================

function enviarMensagem(mensagem, target) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      channel: 'whatsapp',
      target: target,
      message: mensagem
    });

    const options = {
      hostname: CONFIG.gatewayHost,
      port: CONFIG.gatewayPort,
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
      res.on('end', () => {
        console.log(`📤 Enviado para ${target}: ${res.statusCode}`);
        resolve(data);
      });
    });

    req.on('error', (e) => {
      console.error('❌ Erro ao enviar:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// ============================================
// 🧠 PROCESSAR MENSAGEM
// ============================================

function processarMensagem(texto, from) {
  const t = texto.toLowerCase().trim();
  
  // Menu
  if (['oi', 'olá', 'ola', 'menu', '1'].includes(t)) {
    return MENU;
  }
  
  // Cursos
  if (['cursos', '2'].includes(t)) {
    return LISTA_CURSOS;
  }
  
  // Selecionar curso
  if (CURSOS[t]) {
    const curso = CURSOS[t];
    return `📚 *${curso.nome}*\n\n🎬 ${curso.aulas} aulas disponíveis!\n\n🔗 https://60maiscursos.com.br\n\n---\n_Professor Luis_`;
  }
  
  // FAQ
  for (const [chave, resposta] of Object.entries(FAQS)) {
    if (t.includes(chave)) {
      return resposta;
    }
  }
  
  return `Olá! 👋

Sou o *Professor Luis* do 60maisPlay.

${MENU}`;
}

// ============================================
// 📋 LER ESTADO
// ============================================

function lerEstado() {
  try {
    if (fs.existsSync(CONFIG.stateFile)) {
      return JSON.parse(fs.readFileSync(CONFIG.stateFile, 'utf8'));
    }
  } catch (e) {}
  return { lastLine: 0, processed: [] };
}

function salvarEstado(estado) {
  try {
    fs.writeFileSync(CONFIG.stateFile, JSON.stringify(estado, null, 2));
  } catch (e) {}
}

// ============================================
// 🔍 MONITORAR LOGS
// ============================================

async function monitorarLogs() {
  console.log('🔍 Monitorando logs...');
  
  const estado = lerEstado();
  let respostas = 0;
  
  try {
    if (!fs.existsSync(CONFIG.logFile)) {
      console.log('⚠️ Arquivo de log não encontrado');
      return respostas;
    }
    
    const logs = fs.readFileSync(CONFIG.logFile, 'utf8').split('\n');
    
    // Processar apenas linhas novas
    const novasLinhas = logs.slice(estado.lastLine);
    
    for (const linha of novasLinhas) {
      if (!linha.trim()) continue;
      
      // Procurar mensagens recebidas do WhatsApp
      // Formato: [timestamp] message-received from:xxx body:xxx
      const match = linha.match(/from:\s*(\d+@\w+).*body:\s*(.+)/i);
      
      if (match) {
        const from = match[1];
        const body = match[2];
        
        // Ignorar mensagens do bot
        if (from.includes(CONFIG.botNumber)) continue;
        
        // Verificar se já foi processada
        const msgId = `${from}-${body}`.substring(0, 50);
        if (estado.processed.includes(msgId)) continue;
        
        console.log(`\n🔔 NOVA MENSAGEM!`);
        console.log(`   De: ${from}`);
        console.log(`   Texto: ${body}`);
        
        // Processar e responder
        const resposta = processarMensagem(body, from);
        
        try {
          await enviarMensagem(resposta, from.split('@')[0]);
          respostas++;
          estado.processed.push(msgId);
          
          // Manter apenas últimos 100 processados
          if (estado.processed.length > 100) {
            estado.processed = estado.processed.slice(-100);
          }
        } catch (e) {
          console.error('❌ Erro ao responder:', e.message);
        }
      }
    }
    
    estado.lastLine = logs.length;
    salvarEstado(estado);
    
  } catch (e) {
    console.error('❌ Erro ao ler logs:', e.message);
  }
  
  return respostas;
}

// ============================================
// 🚀 EXECUTAR
// ============================================

async function main() {
  console.log('🤖 Bot 60maisPlay - Iniciando...');
  console.log('   Data:', new Date().toLocaleString('pt-BR'));
  
  const respostas = await monitorarLogs();
  
  console.log(`\n✅ Execução concluída`);
  console.log(`   Respostas enviadas: ${respostas}`);
}

main().catch(console.error);
