/**
 * 🤖 BOT 60maisPlay - WhatsApp V2
 * Responde mensagens diretas e do grupo
 * + Cache de FAQ para economia de tokens
 */

const fs = require('fs');
const http = require('http');

// Importar cache de FAQ
let faqCache = null;
try {
  faqCache = require('./faq-cache.js');
  console.log('✅ FAQ Cache carregado');
} catch (e) {
  console.log('⚠️ FAQ Cache não encontrado, usando fallback');
}

// Configurações
const CONFIG = {
  gatewayToken: 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  grupoId: '120363375518105627@g.us',
  adminNumber: '5511953545939',
  botNumber: '5511920990009',
  logPath: '/tmp/bot-v2-processado.json'
};

// Cursos
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

// FAQs
const FAQS = {
  "download": {
    resposta: `📥 *DOWNLOAD - O que é?*

**Download** = **Baixar**

É quando você traz algo da internet para o seu aparelho!

✅ Exemplos:
• Baixar uma foto
• Baixar um app
• Baixar uma música

⚠️ Só baixe de sites confiáveis!

🔄 **Upload** = você ENVIA para a internet`,
    aula: "https://60maiscursos.com.br"
  },
  "cadeado": {
    resposta: `🔒 *O CADEADO DO NAVEGADOR*

O cadeado indica que o site é SEGURO!

✅ O que significa:
• Seus dados estão protegidos
• A conexão é criptografada

⚠️ Se NÃO tiver cadeado, NÃO coloque seus dados!`,
    aula: "https://60maiscursos.com.br/aulas/134"
  },
  "senha": {
    resposta: `🔐 *CUIDADO COM SENHAS!*

⚠️ NUNCA compartilhe suas senhas!

✅ Dicas:
• Use 8 ou mais caracteres
• Misture letras, números e símbolos
• Não use datas de nascimento
• Use senhas diferentes para cada site`,
    aula: "https://60maiscursos.com.br"
  },
  "golpe": {
    resposta: `⚠️ *CUIDADO COM GOLPES!*

🚨 Sinais de golpe:
• Pedem código do WhatsApp
• Prometem dinheiro fácil
• Pressionam para decidir rápido

✅ NÃO clique em links suspeitos!
✅ NÃO passe dados por telefone!`,
    aula: "https://60maiscursos.com.br"
  },
  "pix": {
    resposta: `💰 *CUIDADO COM O PIX!*

⚠️ Antes de fazer PIX:
• Verifique o nome do destinatário
• Confirme o valor
• Não faça PIX para desconhecidos

🚨 "Ganhei um PIX errado, devolve!" = GOLPE!`,
    aula: "https://60maiscursos.com.br"
  },
  "whatsapp": {
    resposta: `📱 *SEGURANÇA NO WHATSAPP*

🔐 Nunca compartilhe:
• Código de 6 dígitos
• Código de verificação

⚠️ Golpe comum: "Família pedindo código"
NUNCA PASSE! Mesmo que pareça familiar!`,
    aula: "https://60maiscursos.com.br"
  }
};

// Menus
const MENUS = {
  principal: `🎓 *60maisPlay - Menu Principal*

📚 *1* - Ver todos os cursos
🎬 *2* - Assistir uma aula
❓ *3* - Tirar uma dúvida
📞 *4* - Falar com suporte

💬 Digite o número da opção!`,

  cursos: `📚 *CURSOS DISPONÍVEIS*

🔹 *1* - WhatsApp sem Mistérios
🔹 *2* - Compras na Internet
🔹 *3* - Inteligência Artificial
🔹 *4* - SmartPhone
🔹 *5* - Gmail e Email
🔹 *6* - Netflix na TV
🔹 *7* - Gov.br
🔹 *8* - Zoom

💬 Digite o número do curso!`,

  suporte: `📞 *SUPORTE 60maisPlay*

🤖 Atendimento Automático: 24 horas!

👤 Atendimento Humano:
⏰ Seg-Sex: 8h às 18h

📧 contato@60maiscursos.com.br

💬 Descreva sua dúvida!`
};

// Enviar mensagem
async function enviarMensagem(mensagem, target) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      channel: 'whatsapp',
      target: target,
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

// Processar comando
function processarComando(texto) {
  const t = texto.toLowerCase().trim();
  
  // TENTAR CACHE PRIMEIRO (economia de tokens)
  if (faqCache) {
    const cached = faqCache.findInCache(texto);
    if (cached.found) {
      faqCache.recordHit(100); // ~100 tokens economizados
      console.log('💾 Cache HIT! Tokens economizados');
      return cached.response;
    }
  }
  
  // Menu
  if (t === 'oi' || t === 'olá' || t === 'ola' || t === 'menu' || t === '1') {
    return MENUS.principal;
  }
  
  // Cursos
  if (t === 'cursos' || t === '2' || t === 'ver cursos') {
    return MENUS.cursos;
  }
  
  // Suporte
  if (t === 'suporte' || t === '4') {
    return MENUS.suporte;
  }
  
  // FAQ
  for (const [chave, faq] of Object.entries(FAQS)) {
    if (t.includes(chave)) {
      // Resposta mais curta (economia de tokens)
      return `${faq.resposta}\n\n🔗 ${faq.aula}`;
    }
  }
  
  // Registrar miss no cache
  if (faqCache) {
    faqCache.recordMiss();
  }
  
  return null;
}

// Carregar/Salvar histórico
function carregarHistorico() {
  try {
    if (fs.existsSync(CONFIG.logPath)) {
      return JSON.parse(fs.readFileSync(CONFIG.logPath, 'utf8'));
    }
  } catch (e) {}
  return { processados: [] };
}

function salvarHistorico(h) {
  fs.writeFileSync(CONFIG.logPath, JSON.stringify(h, null, 2));
}

// Buscar mensagens
function buscarMensagens() {
  const logDir = '/tmp/openclaw';
  const files = fs.readdirSync(logDir).filter(f => f.endsWith('.log')).sort().reverse();
  
  if (files.length === 0) return [];
  
  const logPath = `${logDir}/${files[0]}`;
  const logs = fs.readFileSync(logPath, 'utf8');
  const linhas = logs.split('\n').slice(-100);
  
  const mensagens = [];
  
  for (const linha of linhas) {
    // Formato novo: [WhatsApp +5511953545939 +9s Thu...] mensagem
    const match = linha.match(/\[WhatsApp \+(\d+)[^\]]*\]\s*(.+)$/);
    if (match) {
      mensagens.push({
        from: match[1],
        body: match[2],
        isGroup: false
      });
      continue;
    }
    
    // Formato antigo: "from":"xxx","body":"yyy"
    if (linha.includes('inbound message')) {
      try {
        const bodyMatch = linha.match(/"body":"([^"]+)"/);
        const fromMatch = linha.match(/"from":"([^"]+)"/);
        
        if (bodyMatch && fromMatch) {
          const body = bodyMatch[1];
          const from = fromMatch[1];
          
          // Ignorar mensagens do sistema
          if (body.startsWith('[WhatsApp')) continue;
          
          // Detectar se é grupo
          const isGroup = from.includes('@g.us');
          const fromClean = from.replace(/[^0-9]/g, '');
          
          mensagens.push({
            from: from, // Manter ID completo
            fromClean: fromClean,
            body: body,
            isGroup: isGroup
          });
        }
      } catch (e) {}
    }
  }
  
  return mensagens;
}

// Main
async function main() {
  console.log('🤖 Bot 60maisPlay V2 - Monitorando...\n');
  
  const historico = carregarHistorico();
  const mensagens = buscarMensagens();
  
  let respostas = 0;
  
  for (const msg of mensagens) {
    // Ignorar mensagens do bot
    if (msg.from.includes(CONFIG.botNumber)) continue;
    
    // Criar ID único
    const id = `${msg.from}-${msg.body}`;
    
    // Ignorar se já processou
    if (historico.processados.includes(id)) continue;
    
    // Marcar como processado
    historico.processados.push(id);
    if (historico.processados.length > 50) {
      historico.processados = historico.processados.slice(-30);
    }
    
    // Processar comando
    const resposta = processarComando(msg.body);
    
    if (resposta) {
      console.log(`📩 De: ${msg.from}`);
      console.log(`   Mensagem: ${msg.body}`);
      console.log(`   ✅ Respondendo...\n`);
      
      // Responder para o remetente (formatar corretamente)
      let target;
      if (msg.isGroup || msg.from.includes('@g.us')) {
        // É grupo - usar ID completo
        target = msg.from.includes('@g.us') ? msg.from : `${msg.from}@g.us`;
      } else {
        // É mensagem direta
        target = `+${msg.from}`;
      }
      
      console.log(`   Target: ${target}`);
      await enviarMensagem(resposta, target);
      respostas++;
    }
  }
  
  salvarHistorico(historico);
  console.log(`📊 Total: ${respostas} respostas enviadas`);
  
  // Mostrar estatísticas de economia
  if (faqCache) {
    const stats = faqCache.getStats();
    console.log(`💰 Cache: ${stats.hits} hits | ~${stats.tokensSaved} tokens economizados`);
  }
}

main().catch(console.error);
