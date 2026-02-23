/**
 * 🤖 FAQ Automático WhatsApp - 60maisPlay
 * 
 * Monitora mensagens do grupo e responde automaticamente
 * perguntas frequentes sobre segurança digital
 */

const https = require('https');
const http = require('http');

// ============================================
// 📚 BANCO DE FAQs - PERGUNTAS E RESPOSTAS
// ============================================

const FAQS = {
  // Segurança
  "cadeado": {
    palavras: ["cadeado", "cadenado", "cadeado do navegador", "site seguro", "https"],
    resposta: `🔒 *O CADEADO DO NAVEGADOR*

O cadeado indica que o site é SEGURO!

✅ *O que significa:*
• Seus dados estão protegidos
• A conexão é criptografada
• Ninguém pode "ouvir" suas informações

⚠️ *Atenção:*
• Se NÃO tiver cadeado, NÃO coloque seus dados!
• O cadeado garante conexão segura, mas confirme se o site é confiável!`,
    aula: "https://60maiscursos.com.br/aulas/134",
    curso: "Compras na Internet"
  },

  "senha": {
    palavras: ["senha", "senhas", "password", "código", "codigo"],
    resposta: `🔐 *CUIDADO COM SENHAS!*

⚠️ *NUNCA compartilhe suas senhas!*

✅ *Dicas de segurança:*
• Use senhas diferentes para cada site
• Não use datas de nascimento
• Misture letras, números e símbolos
• Nunca mande senha por WhatsApp!

💡 *Se alguém pedir sua senha:*
É GOLPE! Denuncie e bloqueie!`,
    aula: "https://60maiscursos.com.br/cursos/seguranca",
    curso: "Segurança Digital"
  },

  "golpe": {
    palavras: ["golpe", "golpista", "golpistas", "roubado", "hackeado", "clonado"],
    resposta: `⚠️ *CUIDADO COM GOLPES!*

🚨 *Sinais de golpe:*
• Pedem código do WhatsApp
• Prometem dinheiro fácil
• Pressionam para decidir rápido
• Pedem dados bancários

✅ *O que fazer:*
1. NÃO clique em links suspeitos
2. NÃO passe dados por telefone
3. Desconfie de "promoções milagrosas"
4. Sempre confirme com a fonte oficial!`,
    aula: "https://60maiscursos.com.br/cursos/seguranca",
    curso: "Segurança Digital"
  },

  "pix": {
    palavras: ["pix", "pix errado", "transferência", "transferencia"],
    resposta: `💰 *CUIDADO COM O PIX!*

⚠️ *Antes de fazer PIX:*
• Verifique o nome do destinatário
• Confirme o valor
• Não faça PIX para desconhecidos

🚨 *Golpe comum:*
"Ganhei um PIX errado, devolve!"
NÃO CAIA! É golpe!`,
    aula: "https://60maiscursos.com.br/cursos/compras",
    curso: "Compras na Internet"
  },

  "whatsapp": {
    palavras: ["whatsapp", "zap", "wpp", "zapzap", "clonar whatsapp", "código whatsapp"],
    resposta: `📱 *SEGURANÇA NO WHATSAPP*

🔐 *Nunca compartilhe:*
• Código de 6 dígitos
• Código de verificação
• Senha do app

⚠️ *Golpe comum:*
"Família pedindo código do WhatsApp"
NUNCA PASSE! Mesmo que pareça familiar!

✅ *Proteção:*
Ative a verificação em duas etapas!
Configurações → Conta → Verificação em duas etapas`,
    aula: "https://60maiscursos.com.br/cursos/whatsapp",
    curso: "WhatsApp sem Mistérios"
  },

  "email": {
    palavras: ["email", "e-mail", "spam", "phishing", "email falso"],
    resposta: `📧 *CUIDADO COM EMAILS FALSOS!*

⚠️ *Sinais de email falso:*
• Erros de portuguça
• Pedem dados urgentes
• Links estranhos
• Remetente desconhecido

✅ *O que fazer:*
1. NÃO clique em links suspeitos
2. NÃO baixe anexos desconhecidos
3. Verifique o remetente
4. Desconfie de "urgências"!`,
    aula: "https://60maiscursos.com.br/cursos/email",
    curso: "Aprendendo a usar o Gmail"
  },

  "compra": {
    palavras: ["comprar", "compra", "site de compras", "loja online", "shopee", "mercado livre", "amazon"],
    resposta: `🛒 *COMPRAS SEGURAS NA INTERNET*

✅ *Antes de comprar:*
• Procure o cadeado 🔒
• Verifique o CNPJ
• Leia avaliações
• Desconfie de preços muito baixos

⚠️ *Cuidado:*
• Nunca faça transferência para "reservar"
• Guarde comprovantes
• Use cartão virtual quando possível!`,
    aula: "https://60maiscursos.com.br/cursos/comprasnainternet",
    curso: "Compras na Internet"
  },

  "curso": {
    palavras: ["curso", "cursos", "aula", "aulas", "plataforma", "60mais", "60maisplay"],
    resposta: `📚 *PLATAFORMA 60maisPlay*

🎓 *Temos 25 cursos sobre tecnologia!*

✅ *Cursos disponíveis:*
• WhatsApp sem Mistérios
• Compras na Internet
• Inteligência Artificial
• Segurança Digital
• E muito mais!

🔗 *Acesse:*
https://60maiscursos.com.br`,
    aula: "https://60maiscursos.com.br",
    curso: "Plataforma"
  },

  "celular": {
    palavras: ["celular", "smartphone", "telefone", "cel", "celular roubado", "perdi o celular"],
    resposta: `📱 *SEGURANÇA DO CELULAR*

⚠️ *Se perdeu ou roubaram:*
1. Bloqueie o chip (ligue na operadora)
2. Altere senhas importantes
3. Ative o rastreamento
4. Faça boletim de ocorrência

✅ *Prevenção:*
• Use senha ou biometria
• Ative localização
• Faça backup regular!`,
    aula: "https://60maiscursos.com.br/cursos/smartphone",
    curso: "SmartPhone 1 e 2"
  },

  "ajuda": {
    palavras: ["ajuda", "socorro", "problema", "dúvida", "duvida", "não sei", "nao sei"],
    resposta: `🤝 *COMO POSSO AJUDAR?*

Fale sua dúvida que eu tento ajudar!

📚 *Tópicos que conheço:*
• Segurança digital
• WhatsApp
• Compras online
• Senhas
• Golpes
• PIX

💡 *Também temos aulas:*
https://60maiscursos.com.br`,
    aula: "https://60maiscursos.com.br",
    curso: "Plataforma"
  }
};

// ============================================
// 🔧 CONFIGURAÇÕES
// ============================================

const CONFIG = {
  gatewayToken: process.env.OPENCLAW_GATEWAY_TOKEN || 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  gatewayUrl: '127.0.0.1',
  gatewayPort: 18789,
  grupoId: '120363407488049190@g.us', // Grupo Segurança Digital 60mais
  cooldownMs: 30000, // 30 segundos entre respostas do mesmo tema
  respostaAutomatica: true
};

// Histórico de respostas (para evitar spam)
const historicoRespostas = new Map();

// ============================================
// 📨 FUNÇÕES DE MENSAGEM
// ============================================

async function enviarMensagem(mensagem) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      channel: 'whatsapp',
      target: CONFIG.grupoId,
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
// 🔍 FUNÇÕES DE ANÁLISE
// ============================================

function encontrarFAQ(mensagem) {
  const textoLower = mensagem.toLowerCase();
  
  for (const [chave, faq] of Object.entries(FAQS)) {
    for (const palavra of faq.palavras) {
      if (textoLower.includes(palavra.toLowerCase())) {
        // Verificar cooldown
        const ultimaResposta = historicoRespostas.get(chave);
        if (ultimaResposta && (Date.now() - ultimaResposta) < CONFIG.cooldownMs) {
          return null; // Ainda em cooldown
        }
        
        return { chave, faq };
      }
    }
  }
  
  return null;
}

function montarResposta(faq) {
  return `${faq.resposta}

🔗 *Aula recomendada:*
${faq.aula}

---
_Professor Luis - 60maisPlay_`;
}

// ============================================
// 🚀 EXECUÇÃO PRINCIPAL
// ============================================

async function processarMensagem(mensagem, remetente) {
  console.log(`\n📩 Mensagem recebida de ${remetente}:`);
  console.log(`   "${mensagem.substring(0, 50)}..."`);
  
  // Ignorar mensagens muito curtas
  if (mensagem.length < 3) return;
  
  // Ignorar se for do próprio bot
  if (remetente.includes('5511920990009')) return;
  
  // Procurar FAQ correspondente
  const resultado = encontrarFAQ(mensagem);
  
  if (resultado) {
    console.log(`✅ FAQ encontrado: ${resultado.chave}`);
    
    // Registrar no histórico
    historicoRespostas.set(resultado.chave, Date.now());
    
    // Montar e enviar resposta
    const resposta = montarResposta(resultado.faq);
    
    console.log('📤 Enviando resposta...');
    await enviarMensagem(resposta);
    
    console.log('✅ Resposta enviada!');
  } else {
    console.log('ℹ️ Nenhum FAQ correspondente');
  }
}

// ============================================
// 📋 LISTAR FAQs DISPONÍVEIS
// ============================================

function listarFAQs() {
  console.log('\n📚 FAQs DISPONÍVEIS:\n');
  console.log('─'.repeat(50));
  
  for (const [chave, faq] of Object.entries(FAQS)) {
    console.log(`\n🔑 ${chave.toUpperCase()}`);
    console.log(`   Palavras: ${faq.palavras.join(', ')}`);
    console.log(`   Curso: ${faq.curso}`);
  }
  
  console.log('\n' + '─'.repeat(50));
}

// ============================================
// 🧪 MODO TESTE
// ============================================

async function testeFAQ(mensagemTeste) {
  console.log('\n🧪 TESTE DE FAQ\n');
  console.log('─'.repeat(50));
  
  const resultado = encontrarFAQ(mensagemTeste);
  
  if (resultado) {
    console.log(`\n✅ FAQ encontrado: ${resultado.chave}`);
    console.log(`\n📝 Resposta:\n`);
    console.log(montarResposta(resultado.faq));
  } else {
    console.log('\n❌ Nenhum FAQ correspondente encontrado');
    console.log('\n💡 Tente palavras como:');
    console.log('   cadeado, senha, golpe, pix, whatsapp, email, compra, curso, celular, ajuda');
  }
  
  console.log('\n' + '─'.repeat(50));
}

// ============================================
// 📥 EXPORTS
// ============================================

module.exports = {
  FAQS,
  processarMensagem,
  enviarMensagem,
  encontrarFAQ,
  montarResposta,
  listarFAQs,
  testeFAQ
};

// ============================================
// 🎯 EXECUÇÃO DIRETA
// ============================================

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('🤖 FAQ Automático WhatsApp - 60maisPlay\n');
    console.log('Uso:');
    console.log('  node faq-whatsapp.js --list      # Listar FAQs');
    console.log('  node faq-whatsapp.js --test "mensagem"  # Testar FAQ');
    console.log('  node faq-whatsapp.js --send "mensagem"  # Enviar para grupo');
    listarFAQs();
  } else if (args[0] === '--list') {
    listarFAQs();
  } else if (args[0] === '--test' && args[1]) {
    testeFAQ(args.slice(1).join(' '));
  } else if (args[0] === '--send' && args[1]) {
    const resultado = encontrarFAQ(args.slice(1).join(' '));
    if (resultado) {
      enviarMensagem(montarResposta(resultado.faq)).then(() => {
        console.log('✅ Mensagem enviada para o grupo!');
      });
    } else {
      console.log('❌ Nenhum FAQ correspondente');
    }
  }
}
