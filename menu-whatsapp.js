/**
 * 📱 MENU INTERATIVO 60maisPlay - WhatsApp
 * 
 * O aluno envia comandos e navega pela plataforma
 * sem precisar abrir o navegador!
 */

const http = require('http');
const fs = require('fs');

// ============================================
// 🔧 CONFIGURAÇÕES
// ============================================

const CONFIG = {
  gatewayToken: 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  gatewayUrl: '127.0.0.1',
  gatewayPort: 18789,
  grupoId: '120363407488049190@g.us',
  botNumber: '5511920990009'
};

// ============================================
// 📚 BANCO DE CURSOS E AULAS
// ============================================

const CURSOS = {
  "1": {
    nome: "WhatsApp sem Mistérios",
    descricao: "Aprenda tudo sobre WhatsApp de forma simples!",
    aulas: [
      { num: "1", titulo: "Instalando o WhatsApp", duracao: "10 min" },
      { num: "2", titulo: "Enviando mensagens", duracao: "8 min" },
      { num: "3", titulo: "Fazendo ligações", duracao: "7 min" },
      { num: "4", titulo: "Enviando fotos e vídeos", duracao: "12 min" },
      { num: "5", titulo: "Grupos no WhatsApp", duracao: "15 min" }
    ],
    link: "https://60maiscursos.com.br/cursos/whatsapp"
  },
  "2": {
    nome: "Compras na Internet",
    descricao: "Compre com segurança na internet!",
    aulas: [
      { num: "1", titulo: "O policial", duracao: "16 min" },
      { num: "2", titulo: "Com cadeado, tudo certo!", duracao: "7 min" },
      { num: "3", titulo: "Olha o CNPJ ai pessoal", duracao: "23 min" },
      { num: "4", titulo: "Cuidado com as promoções milagrosas", duracao: "14 min" },
      { num: "5", titulo: "Só mais algumas dicas importantes", duracao: "8 min" }
    ],
    link: "https://60maiscursos.com.br/cursos/comprasnainternet"
  },
  "3": {
    nome: "Inteligência Artificial no Dia a Dia",
    descricao: "Descubra como a IA pode te ajudar!",
    aulas: [
      { num: "1", titulo: "O que é Inteligência Artificial", duracao: "10 min" },
      { num: "2", titulo: "ChatGPT: seu secretário virtual", duracao: "15 min" },
      { num: "3", titulo: "Traduzindo textos com IA", duracao: "8 min" }
    ],
    link: "https://60maiscursos.com.br/cursos/ia"
  },
  "4": {
    nome: "SmartPhone 1 e 2",
    descricao: "Domine seu celular!",
    aulas: [
      { num: "1", titulo: "Conhecendo seu celular", duracao: "12 min" },
      { num: "2", titulo: "Tirando fotos", duracao: "15 min" },
      { num: "3", titulo: "Aplicativos úteis", duracao: "20 min" }
    ],
    link: "https://60maiscursos.com.br/cursos/smartphone"
  },
  "5": {
    nome: "Gmail e Email",
    descricao: "Aprenda a usar email!",
    aulas: [
      { num: "1", titulo: "Criando seu email", duracao: "10 min" },
      { num: "2", titulo: "Enviando emails", duracao: "8 min" },
      { num: "3", titulo: "Cuidado com spam", duracao: "12 min" }
    ],
    link: "https://60maiscursos.com.br/cursos/gmail"
  },
  "6": {
    nome: "Netflix na TV",
    descricao: "Assista filmes e séries na sua TV!",
    aulas: [
      { num: "1", titulo: "O que é Netflix", duracao: "8 min" },
      { num: "2", titulo: "Instalando na TV", duracao: "15 min" },
      { num: "3", titulo: "Escolhendo filmes", duracao: "10 min" }
    ],
    link: "https://60maiscursos.com.br/cursos/netflix"
  },
  "7": {
    nome: "Gov.br",
    descricao: "Acesse serviços do governo!",
    aulas: [
      { num: "1", titulo: "Criando sua conta", duracao: "12 min" },
      { num: "2", titulo: "Documentos digitais", duracao: "15 min" }
    ],
    link: "https://60maiscursos.com.br/cursos/govbr"
  },
  "8": {
    nome: "Zoom",
    descricao: "Faça videochamadas!",
    aulas: [
      { num: "1", titulo: "Instalando o Zoom", duracao: "10 min" },
      { num: "2", titulo: "Entrando em uma reunião", duracao: "8 min" }
    ],
    link: "https://60maiscursos.com.br/cursos/zoom"
  }
};

// ============================================
// 📨 FUNÇÕES DE MENSAGEM
// ============================================

async function enviarMensagem(mensagem, target = CONFIG.grupoId) {
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
// 📋 MENUS
// ============================================

function menuPrincipal() {
  return `🎓 *60maisPlay - Sua Escola de Tecnologia!*

Olá! Sou o Professor Luis e vou te ajudar a aprender tecnologia de forma simples! 📱

━━━━━━━━━━━━━━━━━━━━

📚 *MENU PRINCIPAL*

🔹 *1* - Ver todos os cursos
🔹 *2* - Assistir uma aula
🔹 *3* - Tirar uma dúvida
🔹 *4* - Ver meu progresso
🔹 *5* - Falar com suporte
🔹 *6* - Sobre a plataforma

━━━━━━━━━━━━━━━━━━━━

💬 _Digite o número da opção que você quer!_

💡 _Você também pode me perguntar sobre: cadeado, senha, golpe, pix, whatsapp..._`;
}

function menuCursos() {
  let msg = `📚 *CURSOS DISPONÍVEIS*\n\n`;
  
  for (const [num, curso] of Object.entries(CURSOS)) {
    msg += `🔹 *${num}* - ${curso.nome}\n`;
    msg += `   _${curso.descricao}_\n\n`;
  }
  
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `📱 _Digite o número do curso para ver as aulas!_`;
  
  return msg;
}

function menuAulas(cursoNum) {
  const curso = CURSOS[cursoNum];
  
  if (!curso) {
    return `❌ Curso não encontrado!\n\nDigite *cursos* para ver a lista.`;
  }
  
  let msg = `📚 *${curso.nome}*\n\n`;
  msg += `${curso.descricao}\n\n`;
  msg += `🎬 *AULAS:*\n\n`;
  
  for (const aula of curso.aulas) {
    msg += `📹 *${aula.num}* - ${aula.titulo}\n`;
    msg += `   ⏱️ ${aula.duracao}\n\n`;
  }
  
  msg += `━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `🔗 _Acesse: ${curso.link}_\n\n`;
  msg += `💬 _Digite o número da aula para ver o resumo!_`;
  
  return msg;
}

function resumoAula(cursoNum, aulaNum) {
  const curso = CURSOS[cursoNum];
  
  if (!curso) return `❌ Curso não encontrado!`;
  
  const aula = curso.aulas.find(a => a.num === aulaNum);
  
  if (!aula) return `❌ Aula não encontrada!`;
  
  // Resumos de exemplo (na prática, viriam da plataforma)
  const resumos = {
    "2.2": `🎬 *${aula.titulo}*\n⏱️ ${aula.duracao}\n\n📝 *RESUMO:*\n\n🔒 O cadeado no navegador indica que o site é SEGURO!\n\n✅ O que significa:\n• Seus dados estão protegidos\n• A conexão é criptografada\n\n⚠️ Atenção:\n• Se NÃO tiver cadeado, NÃO coloque seus dados!\n• O cadeado garante a conexão, mas confirme se o site é confiável!\n\n🔗 ${curso.link}`,
    "2.1": `🎬 *${aula.titulo}*\n⏱️ ${aula.duracao}\n\n📝 *RESUMO:*\n\n👮 Antes de comprar, verifique se o site é confiável!\n\n✅ Dicas:\n• Procure o cadeado 🔒\n• Verifique o CNPJ\n• Leia avaliações\n\n🔗 ${curso.link}`
  };
  
  const chave = `${cursoNum}.${aulaNum}`;
  return resumos[chave] || `🎬 *${aula.titulo}*\n⏱️ ${aula.duracao}\n\n🔗 Acesse a aula completa:\n${curso.link}\n\n💡 _Para ver o resumo de outras aulas, me peça!_`;
}

function menuSuporte() {
  return `📞 *SUPORTE 60maisPlay*

━━━━━━━━━━━━━━━━━━━━

🤖 *Atendimento Automático:*
Disponível 24 horas!

👤 *Atendimento Humano:*
⏰ Segunda a Sexta: 8h às 18h
📱 Sábados: 9h às 12h

━━━━━━━━━━━━━━━━━━━━

💬 *Como posso ajudar?*

• Tire suas dúvidas sobre tecnologia
• Problemas para acessar a plataforma
• Questões sobre cursos e aulas
• Sugestões e reclamações

━━━━━━━━━━━━━━━━━━━━

📧 *Email:* contato@60maiscursos.com.br

💬 _Descreva sua dúvida que vou te ajudar!_`;
}

function menuSobre() {
  return `ℹ️ *SOBRE O 60maisPlay*

━━━━━━━━━━━━━━━━━━━━

🎓 *Quem somos:*

A 60maisPlay é uma plataforma de cursos de tecnologia para pessoas com mais de 60 anos!

📱 *Nossa missão:*
Ensinar tecnologia de forma simples, clara e acessível!

📚 *O que oferecemos:*
• Mais de 25 cursos
• Aulas em vídeo
• Suporte 24 horas
• Certificados de conclusão

━━━━━━━━━━━━━━━━━━━━

🔗 *Acesse:*
https://60maiscursos.com.br

📧 *Contato:*
contato@60maiscursos.com.br

━━━━━━━━━━━━━━━━━━━━

💬 _Estou aqui para te ajudar! Pode perguntar!_`;
}

// ============================================
// 🧠 PROCESSADOR DE COMANDOS
// ============================================

// Estado do usuário (qual menu está)
const userState = new Map();

function processarComando(mensagem, remetente) {
  const texto = mensagem.toLowerCase().trim();
  const state = userState.get(remetente) || { menu: 'principal' };
  
  // Comandos globais
  if (texto === 'menu' || texto === 'oi' || texto === 'olá' || texto === 'ola') {
    userState.set(remetente, { menu: 'principal' });
    return menuPrincipal();
  }
  
  if (texto === 'cursos' || texto === '1') {
    userState.set(remetente, { menu: 'cursos' });
    return menuCursos();
  }
  
  if (texto === 'suporte' || texto === '5') {
    return menuSuporte();
  }
  
  if (texto === 'sobre' || texto === '6') {
    return menuSobre();
  }
  
  // Navegação em cursos
  if (state.menu === 'cursos' && CURSOS[texto]) {
    userState.set(remetente, { menu: 'aulas', curso: texto });
    return menuAulas(texto);
  }
  
  // Navegação em aulas
  if (state.menu === 'aulas' && state.curso) {
    return resumoAula(state.curso, texto);
  }
  
  // Comando direto de curso (ex: "curso 2")
  if (texto.startsWith('curso ')) {
    const num = texto.split(' ')[1];
    if (CURSOS[num]) {
      userState.set(remetente, { menu: 'aulas', curso: num });
      return menuAulas(num);
    }
  }
  
  // Não entendeu
  return null;
}

// ============================================
// 🚀 EXPORTS
// ============================================

module.exports = {
  enviarMensagem,
  processarComando,
  menuPrincipal,
  menuCursos,
  menuAulas,
  menuSuporte,
  menuSobre,
  CURSOS
};

// ============================================
// 🎯 EXECUÇÃO DIRETA
// ============================================

if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('📱 Menu Interativo 60maisPlay\n');
    console.log('Uso:');
    console.log('  node menu-whatsapp.js --menu        # Ver menu principal');
    console.log('  node menu-whatsapp.js --cursos      # Ver lista de cursos');
    console.log('  node menu-whatsapp.js --send "oi"   # Enviar menu para o grupo');
    console.log('\n--- MENU PRINCIPAL ---\n');
    console.log(menuPrincipal());
  } else if (args[0] === '--menu') {
    console.log(menuPrincipal());
  } else if (args[0] === '--cursos') {
    console.log(menuCursos());
  } else if (args[0] === '--send' && args[1]) {
    const resposta = processarComando(args.slice(1).join(' '), 'teste');
    if (resposta) {
      enviarMensagem(resposta).then(() => {
        console.log('✅ Mensagem enviada!');
      });
    } else {
      console.log('❌ Comando não reconhecido');
    }
  }
}
