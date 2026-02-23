/**
 * 📱 DICA DIÁRIA 60+ - Sistema de Dicas Automatizadas
 * 
 * Executa todos os dias às 8h da manhã
 * Pesquisa conteúdos recentes e envia dica para o grupo
 */

const http = require('http');
const https = require('https');
const fs = require('fs');

// Configurações
const CONFIG = {
  gatewayToken: process.env.OPENCLAW_GATEWAY_TOKEN || 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  grupoId: '120363375518105627@g.us',
  braveApiKey: process.env.BRAVE_API_KEY || 'BSA7rIRz-_-fDkN7LFkL9nBMqQsN6n8r',
  historicoArquivo: '/root/.openclaw/workspace/historico-dicas.json',
  maxChars: 2000
};

// Temas para pesquisa
const TEMAS = [
  'dicas segurança digital idosos',
  'golpes virtuais novos 2024 2025',
  'atualizações WhatsApp novidades',
  'novidades PIX segurança',
  'aplicativos úteis idosos terceira idade',
  'funcionalidades simples smartphone',
  'dicas internet segura',
  'alertas golpes bancários',
  'inteligência artificial dia a dia idosos',
  'truques facilitar uso celular'
];

// Carregar histórico
function carregarHistorico() {
  try {
    if (fs.existsSync(CONFIG.historicoArquivo)) {
      return JSON.parse(fs.readFileSync(CONFIG.historicoArquivo, 'utf8'));
    }
  } catch (e) {
    console.log('Criando novo histórico...');
  }
  return { temasUsados: [], ultimaDica: null };
}

// Salvar histórico
function salvarHistorico(historico) {
  fs.writeFileSync(CONFIG.historicoArquivo, JSON.stringify(historico, null, 2));
}

// Pesquisar no Brave Search
async function pesquisarBrave(query) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.search.brave.com',
      path: `/res/v1/web/search?q=${encodeURIComponent(query + ' última semana')}&count=5&freshness=pw`,
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': CONFIG.braveApiKey
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.web?.results || []);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Selecionar tema (evitar repetição nos últimos 7 dias)
function selecionarTema(historico) {
  const temasDisponiveis = TEMAS.filter(t => !historico.temasUsados.includes(t));
  
  if (temasDisponiveis.length === 0) {
    // Resetar histórico se todos foram usados
    historico.temasUsados = [];
    return TEMAS[Math.floor(Math.random() * TEMAS.length)];
  }
  
  return temasDisponiveis[Math.floor(Math.random() * temasDisponiveis.length)];
}

// Gerar mensagem formatada
function gerarMensagem(tema, resultado) {
  const titulo = resultado.title || `Dica sobre ${tema}`;
  const descricao = resultado.description || '';
  
  // Gerar mensagem no formato especificado
  const mensagem = `📌 ${titulo}

🧠 *Dica do dia:*

${descricao}

⚠️ *Por que isso é importante?*
Manter-se informado sobre tecnologia ajuda a evitar golpes e aproveitar melhor o celular!

✅ *O que fazer na prática:*
1️⃣ Leia a dica com calma
2️⃣ Se tiver dúvida, pergunte aqui
3️⃣ Compartilhe com seus amigos!

💬 *Pergunta do dia:*
Você já passou por alguma situação parecida? Conta pra gente! 👇

---
_Professor Luis - 60maisNews_`;

  // Limitar a 2000 caracteres
  return mensagem.substring(0, CONFIG.maxChars);
}

// Enviar mensagem para o grupo
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
      path: '/message/send',  // Endpoint correto (sem /api)
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.gatewayToken}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    // Usar http para conexão local (gateway não usa SSL em localhost)
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('✅ Mensagem enviada:', data);
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

// Função principal
async function main() {
  console.log('🚀 Iniciando geração de dica diária...');
  
  try {
    // Carregar histórico
    const historico = carregarHistorico();
    
    // Selecionar tema
    const tema = selecionarTema(historico);
    console.log(`📖 Tema selecionado: ${tema}`);
    
    // Pesquisar
    const resultados = await pesquisarBrave(tema);
    
    if (resultados.length === 0) {
      console.log('⚠️ Nenhum resultado encontrado, usando dica padrão');
      const dicaPadrao = gerarMensagem(tema, {
        title: 'Cuidado com links suspeitos!',
        description: 'Nunca clique em links de remetentes desconhecidos. Golpistas usam links falsos para roubar seus dados.'
      });
      await enviarMensagem(dicaPadrao);
      return;
    }
    
    // Usar primeiro resultado
    const resultado = resultados[0];
    console.log(`📰 Resultado: ${resultado.title}`);
    
    // Gerar mensagem
    const mensagem = gerarMensagem(tema, resultado);
    console.log('📝 Mensagem gerada');
    
    // Enviar
    await enviarMensagem(mensagem);
    
    // Atualizar histórico
    historico.temasUsados.push(tema);
    historico.ultimaDica = {
      tema,
      titulo: resultado.title,
      data: new Date().toISOString()
    };
    salvarHistorico(historico);
    
    console.log('✅ Dica diária enviada com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executar
main();
