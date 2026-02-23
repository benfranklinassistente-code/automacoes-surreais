/**
 * Leitor de Mensagens - Bot 60maisPlay MVP
 * 
 * Lê mensagens do gateway OpenClaw e processa com o bot MVP
 * 
 * Arquivo: bot-mvp-reader.js
 * Criado: 2026-02-21
 */

const http = require('http');
const bot = require('./bot-60maisPlay-mvp.js');

const GATEWAY_HOST = '127.0.0.1';
const GATEWAY_PORT = 18789;

// Buscar mensagens do gateway
async function buscarMensagens() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: GATEWAY_HOST,
      port: GATEWAY_PORT,
      path: '/api/messages?channel=whatsapp&limit=10',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.messages || []);
        } catch (e) {
          resolve([]);
        }
      });
    });

    req.on('error', (e) => {
      console.error('❌ Erro ao buscar mensagens:', e.message);
      resolve([]);
    });

    req.end();
  });
}

// Enviar resposta via gateway
async function enviarResposta(telefone, mensagem) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      channel: 'whatsapp',
      target: telefone,
      message: mensagem
    });

    const options = {
      hostname: GATEWAY_HOST,
      port: GATEWAY_PORT,
      path: '/message/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });

    req.on('error', (e) => {
      console.error('❌ Erro ao enviar:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// Processar novas mensagens
async function processarNovasMensagens() {
  console.log('🔍 Verificando mensagens...');
  
  const mensagens = await buscarMensagens();
  
  if (!mensagens || mensagens.length === 0) {
    console.log('📭 Nenhuma mensagem nova');
    return;
  }

  console.log(`📬 ${mensagens.length} mensagem(s) encontrada(s)`);

  for (const msg of mensagens) {
    // Ignorar mensagens enviadas por mim
    if (msg.fromMe) continue;
    
    const telefone = msg.from || msg.sender;
    const texto = msg.body || msg.text || '';
    
    if (!telefone || !texto) continue;
    
    console.log(`📱 [${telefone}] "${texto.substring(0, 50)}..."`);
    
    // Processar com o bot MVP
    const resposta = await bot.processarMensagem(telefone, texto);
    
    // Enviar resposta
    console.log(`📤 Enviando resposta...`);
    await enviarResposta(telefone, resposta);
    
    console.log(`✅ Resposta enviada para ${telefone}`);
  }
}

// Executar
if (require.main === module) {
  processarNovasMensagens().then(() => {
    console.log('✅ Processamento concluído');
  }).catch(e => {
    console.error('❌ Erro:', e.message);
  });
}

module.exports = {
  buscarMensagens,
  enviarResposta,
  processarNovasMensagens
};
