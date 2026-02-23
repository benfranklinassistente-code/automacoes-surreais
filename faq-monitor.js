/**
 * 🤖 FAQ Automático - Monitor Contínuo
 * 
 * Monitora mensagens do grupo e responde automaticamente
 * Executar via CRON a cada 1 minuto
 */

const fs = require('fs');
const http = require('http');
const { FAQS } = require('./faq-whatsapp.js');

// Configurações
const CONFIG = {
  gatewayToken: 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  grupoId: '120363407488049190@g.us',
  logPath: '/tmp/faq-processado.json',
  cooldownMs: 60000, // 1 minuto entre respostas do mesmo tema
  botNumber: '5511920990009'
};

// Carregar histórico de mensagens processadas
function carregarHistorico() {
  try {
    if (fs.existsSync(CONFIG.logPath)) {
      return JSON.parse(fs.readFileSync(CONFIG.logPath, 'utf8'));
    }
  } catch (e) {}
  return { processados: [], respostas: {} };
}

// Salvar histórico
function salvarHistorico(historico) {
  fs.writeFileSync(CONFIG.logPath, JSON.stringify(historico, null, 2));
}

// Enviar mensagem
function enviarMensagem(mensagem) {
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

// Buscar mensagens recentes do log
function buscarMensagensRecentes() {
  const logPath = '/tmp/openclaw/openclaw-2026-02-19.log';
  
  try {
    const logs = fs.readFileSync(logPath, 'utf8');
    const linhas = logs.split('\n').slice(-200); // Últimas 200 linhas
    
    const mensagens = [];
    
    for (const linha of linhas) {
      // Procurar mensagens inbound
      if (linha.includes('inbound message')) {
        try {
          // Extrair body da mensagem
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
  } catch (e) {
    console.error('Erro ao ler logs:', e.message);
    return [];
  }
}

// Encontrar FAQ correspondente
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

// Montar resposta
function montarResposta(faq) {
  return `${faq.resposta}

🔗 *Aula recomendada:*
${faq.aula}

---
_Professor Luis - 60maisPlay_`;
}

// Função principal
async function monitorar() {
  console.log('🤖 Monitorando grupo...');
  
  const historico = carregarHistorico();
  const mensagens = buscarMensagensRecentes();
  
  let respostasEnviadas = 0;
  
  for (const msg of mensagens) {
    // Ignorar mensagens do próprio bot
    if (msg.from.includes(CONFIG.botNumber)) continue;
    
    // Ignorar mensagens já processadas
    if (historico.processados.includes(msg.timestamp)) continue;
    
    // Marcar como processado
    historico.processados.push(msg.timestamp);
    
    // Limitar histórico
    if (historico.processados.length > 100) {
      historico.processados = historico.processados.slice(-50);
    }
    
    // Procurar FAQ
    const resultado = encontrarFAQ(msg.body);
    
    if (resultado) {
      // Verificar cooldown
      const ultimaResposta = historico.respostas[resultado.chave] || 0;
      if (Date.now() - ultimaResposta < CONFIG.cooldownMs) {
        console.log(`⏳ Cooldown ativo para: ${resultado.chave}`);
        continue;
      }
      
      // Enviar resposta
      console.log(`\n📩 Pergunta: "${msg.body}"`);
      console.log(`✅ FAQ: ${resultado.chave}`);
      
      const resposta = montarResposta(resultado.faq);
      await enviarMensagem(resposta);
      
      // Registrar
      historico.respostas[resultado.chave] = Date.now();
      respostasEnviadas++;
      
      console.log('✅ Resposta enviada!');
    }
  }
  
  // Salvar histórico
  salvarHistorico(historico);
  
  console.log(`\n📊 Resumo: ${respostasEnviadas} respostas enviadas`);
}

// Executar
monitorar().catch(console.error);
