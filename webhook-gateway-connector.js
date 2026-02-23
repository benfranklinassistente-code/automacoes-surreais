/**
 * 🌐 Webhook Server + WebSocket - Conectado ao OpenClaw Gateway
 * 
 * Este servidor:
 * 1. Conecta ao OpenClaw Gateway via WebSocket
 * 2. Escuta eventos de mensagens do WhatsApp
 * 3. Responde em tempo real
 */

const http = require('http');
const WebSocket = require('ws');

// ============================================
// 🔧 CONFIGURAÇÕES
// ============================================

const CONFIG = {
  // Webhook Server
  webhookPort: 3001,
  
  // OpenClaw Gateway
  gatewayUrl: 'ws://127.0.0.1:18789',
  gatewayToken: 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  
  // Bot
  botNumber: '5511920990009',
  adminNumber: '5511953545939'
};

// ============================================
// 📚 DADOS
// ============================================

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
_Professor Luis_`,
  
  "download": `📥 *DOWNLOAD*

Download = BAIXAR

É trazer algo da internet para seu aparelho.

⚠️ Só baixe de sites confiáveis!

---
_Professor Luis_`
};

// ============================================
// 🧠 PROCESSAR MENSAGEM
// ============================================

const userState = new Map();

function processarMensagem(body, from) {
  const texto = body.toLowerCase().trim();
  const state = userState.get(from) || { menu: 'principal' };
  
  console.log(`📩 Processando: "${texto}" de ${from}`);
  
  // Menu
  if (texto === 'oi' || texto === 'olá' || texto === 'menu' || texto === '1') {
    userState.set(from, { menu: 'principal' });
    return MENU;
  }
  
  // Cursos
  if (texto === 'cursos' || texto === '2' || texto === 'ver cursos') {
    userState.set(from, { menu: 'cursos' });
    return LISTA_CURSOS;
  }
  
  // Selecionar curso
  if (state.menu === 'cursos' && CURSOS[texto]) {
    userState.set(from, { menu: 'aulas', curso: texto });
    const curso = CURSOS[texto];
    return `📚 *${curso.nome}*\n\n🎬 ${curso.aulas} aulas disponíveis!\n\n🔗 https://60maiscursos.com.br\n\n---\n_Professor Luis_`;
  }
  
  // FAQ
  for (const [chave, resposta] of Object.entries(FAQS)) {
    if (texto.includes(chave)) {
      return resposta;
    }
  }
  
  // Mensagem não reconhecida
  return `Olá! 👋

Sou o *Professor Luis* do 60maisPlay.

${MENU}`;
}

// ============================================
// 🌐 SERVIDOR HTTP (Health + Webhook)
// ============================================

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      gateway: gatewayReady ? 'connected' : 'disconnected',
      timestamp: new Date().toISOString() 
    }));
    return;
  }
  
  res.writeHead(404);
  res.end('Not Found');
});

// ============================================
// 🔌 WEBSOCKET CLIENT (Conecta ao Gateway)
// ============================================

let ws = null;
let gatewayReady = false;

function connectToGateway() {
  console.log('🔌 Conectando ao OpenClaw Gateway...');
  
  ws = new WebSocket(CONFIG.gatewayUrl, {
    headers: {
      'Authorization': `Bearer ${CONFIG.gatewayToken}`
    }
  });
  
  ws.on('open', () => {
    console.log('✅ Conectado ao Gateway!');
    gatewayReady = true;
  });
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      console.log('📨 Recebido do Gateway:', JSON.stringify(msg, null, 2));
      
      // Responder ao challenge de autenticação
      if (msg.type === 'event' && msg.event === 'connect.challenge') {
        console.log('🔑 Autenticando...');
        ws.send(JSON.stringify({
          type: 'connect.response',
          auth: { token: CONFIG.gatewayToken }
        }));
        return;
      }
      
      // Confirmar conexão
      if (msg.type === 'event' && msg.event === 'connect.ready') {
        console.log('✅ Autenticado com sucesso!');
        return;
      }
      
      // Processar mensagens do WhatsApp
      if (msg.channel === 'whatsapp' && msg.kind === 'message') {
        const from = msg.from || msg.sender;
        const body = msg.body || msg.message || msg.text;
        
        // Ignorar mensagens do bot
        if (from && from.includes(CONFIG.botNumber)) {
          console.log('⏭️ Mensagem do bot, ignorando');
          return;
        }
        
        if (from && body) {
          console.log(`\n🔔 MENSAGEM RECEBIDA!`);
          console.log(`   De: ${from}`);
          console.log(`   Texto: ${body}`);
          
          // Processar e responder
          const resposta = processarMensagem(body, from);
          
          if (resposta) {
            enviarMensagem(resposta, from);
          }
        }
      }
    } catch (e) {
      console.error('❌ Erro ao processar mensagem:', e.message);
    }
  });
  
  ws.on('close', () => {
    console.log('⚠️ Conexão com Gateway fechada');
    gatewayReady = false;
    
    // Reconectar após 5 segundos
    setTimeout(connectToGateway, 5000);
  });
  
  ws.on('error', (err) => {
    console.error('❌ Erro no WebSocket:', err.message);
  });
}

// ============================================
// 📤 ENVIAR MENSAGEM
// ============================================

function enviarMensagem(mensagem, target) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('❌ Gateway não conectado');
    return;
  }
  
  const payload = {
    kind: 'send',
    channel: 'whatsapp',
    target: target,
    message: mensagem
  };
  
  console.log('📤 Enviando mensagem...');
  ws.send(JSON.stringify(payload));
  console.log('✅ Mensagem enviada!');
}

// ============================================
// 🚀 INICIAR
// ============================================

server.listen(CONFIG.webhookPort, () => {
  console.log('🌐 Servidor HTTP rodando');
  console.log(`   Health: http://localhost:${CONFIG.webhookPort}/health`);
  
  // Conectar ao Gateway
  connectToGateway();
});

// Tratamento de erros
process.on('uncaughtException', (e) => {
  console.error('❌ Erro não tratado:', e.message);
});
