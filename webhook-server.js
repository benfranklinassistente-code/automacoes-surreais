/**
 * 🌐 Webhook Server - Recebe mensagens do WhatsApp em tempo real
 * 
 * Este servidor recebe eventos do OpenClaw Gateway quando
 * chegam mensagens no WhatsApp e responde imediatamente.
 */

const http = require('http');
const https = require('https');

// Configurações
const CONFIG = {
  port: process.env.WEBHOOK_PORT || 3001,
  gatewayToken: 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  gatewayUrl: '127.0.0.1',
  gatewayPort: 18789,
  botNumber: '5511920990009'
};

// ============================================
// 📚 DADOS DOS CURSOS
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

// ============================================
// 🤖 RESPOSTAS
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
// 📨 ENVIAR MENSAGEM
// ============================================

async function enviarMensagem(mensagem, target) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      channel: 'whatsapp',
      target: target,
      message: mensagem
    });

    const options = {
      hostname: CONFIG.gatewayUrl,
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
      res.on('end', () => resolve(data));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// ============================================
// 🧠 PROCESSAR MENSAGEM
// ============================================

// Estado dos usuários (em produção: usar Redis)
const userState = new Map();

function processarMensagem(body, from) {
  const texto = body.toLowerCase().trim();
  const state = userState.get(from) || { menu: 'principal' };
  
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
  
  return null;
}

// ============================================
// 🌐 SERVIDOR WEBHOOK
// ============================================

const server = http.createServer(async (req, res) => {
  console.log(`📥 ${req.method} ${req.url}`);
  
  // Health check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  
  // Webhook endpoint
  if (req.url === '/webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const event = JSON.parse(body);
        console.log('\n🔔 Webhook recebido:');
        console.log(JSON.stringify(event, null, 2));
        
        // Processar mensagem do WhatsApp
        if (event.channel === 'whatsapp' && event.message) {
          const from = event.from;
          const messageBody = event.message.body || event.body || event.message;
          
          // Ignorar mensagens do próprio bot
          if (from.includes(CONFIG.botNumber)) {
            console.log('⏭️ Mensagem do bot, ignorando');
            res.writeHead(200);
            res.end('OK');
            return;
          }
          
          console.log(`📩 De: ${from}`);
          console.log(`   Mensagem: ${messageBody}`);
          
          // Processar e responder
          const resposta = processarMensagem(messageBody, from);
          
          if (resposta) {
            console.log('📤 Enviando resposta...');
            await enviarMensagem(resposta, from);
            console.log('✅ Resposta enviada!');
          }
        }
        
        res.writeHead(200);
        res.end('OK');
      } catch (e) {
        console.error('❌ Erro:', e.message);
        res.writeHead(500);
        res.end('Error');
      }
    });
    return;
  }
  
  // Rota não encontrada
  res.writeHead(404);
  res.end('Not Found');
});

// Iniciar servidor
server.listen(CONFIG.port, () => {
  console.log('🌐 Webhook Server rodando!');
  console.log(`   URL: http://localhost:${CONFIG.port}/webhook`);
  console.log(`   Health: http://localhost:${CONFIG.port}/health`);
  console.log('\n📋 Configure o OpenClaw Gateway para enviar eventos para:');
  console.log(`   http://localhost:${CONFIG.port}/webhook`);
  console.log('\n⏳ Aguardando mensagens...\n');
});

// Tratamento de erros
process.on('uncaughtException', (e) => {
  console.error('❌ Erro não tratado:', e.message);
});
