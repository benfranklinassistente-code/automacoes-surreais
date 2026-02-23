/**
 * Enviar Dica Diária para Grupo WhatsApp
 * Grupo: Curso Smartphone Inteligência Artificial 60+
 * Usa API local do OpenClaw Gateway
 */

const https = require('https');
const http = require('http');

const GATEWAY_HOST = '127.0.0.1';
const GATEWAY_PORT = 18789;
const GATEWAY_TOKEN = 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE';
const GRUPO_ID = '120363375518105627@g.us'; // Grupo: Curso Smartphone Inteligência Artificial 60+

// Banco de dicas rotativas
const DICAS = [
  { titulo: "🔒 Proteção de Senha", texto: "Nunca use a mesma senha em todos os sites. Crie senhas com pelo menos 8 caracteres, misturando letras, números e símbolos." },
  { titulo: "📱 Celular Lento?", texto: "Reinicie seu celular pelo menos uma vez por semana. Isso limpa a memória e melhora o desempenho!" },
  { titulo: "⚠️ Cuidado com Links", texto: "Nunca clique em links suspeitos recebidos por WhatsApp ou email. Se parece bom demais para ser verdade, provavelmente é golpe!" },
  { titulo: "📸 Backup de Fotos", texto: "Ative o backup automático no Google Fotos. Suas memórias ficam seguras mesmo se você perder o celular!" },
  { titulo: "🔋 Bateria Durando Menos?", texto: "Diminua o brilho da tela e feche apps que não está usando. Isso economiza bastante bateria!" },
  { titulo: "📶 Internet Lenta?", texto: "Reinicie seu roteador tirando da tomada por 30 segundos. Isso resolve muitos problemas de conexão!" },
  { titulo: "📧 Email Suspeito?", texto: "Bancos NUNCA pedem senha por email. Se receber um email do banco pedindo dados, é golpe!" },
  { titulo: "🔐 Verificação em 2 Etapas", texto: "Ative a verificação em 2 etapas no WhatsApp. É uma camada extra de segurança para sua conta!" },
  { titulo: "🗂️ Organize seus Apps", texto: "Agrupe apps por categoria em pastas. Segure o ícone e arraste sobre outro para criar uma pasta!" },
  { titulo: "💬 Mensagens Sumindo?", texto: "Verifique se você não ativou 'Mensagens temporárias' na conversa. Elas somem após 24h ou 7 dias!" }
];

function selecionarDica() {
  const hoje = new Date();
  const diaDoAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
  return DICAS[diaDoAno % DICAS.length];
}

async function enviarMensagem(mensagem) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      action: 'send',
      channel: 'whatsapp',
      target: GRUPO_ID,
      message: mensagem
    });

    const options = {
      hostname: GATEWAY_HOST,
      port: GATEWAY_PORT,
      path: '/api/message',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GATEWAY_TOKEN}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            resolve({ status: 'ok', raw: body });
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(data);
    req.end();
  });
}

async function main() {
  console.log('📱 Enviando dica diária para o grupo WhatsApp...');
  console.log('⏰', new Date().toLocaleString('pt-BR'));
  
  const dica = selecionarDica();
  console.log('📌 Dica:', dica.titulo);
  
  const mensagem = `☀️ *${dica.titulo}*\n\n${dica.texto}\n\n_Dica do dia 60maisPlay_`;
  
  try {
    const resultado = await enviarMensagem(mensagem);
    console.log('✅ Dica enviada com sucesso!');
    
    const fs = require('fs');
    fs.appendFileSync('/tmp/dicas-whatsapp.log', JSON.stringify({
      data: new Date().toISOString(),
      dica: dica.titulo,
      sucesso: true
    }) + '\n');
    
  } catch (erro) {
    console.error('❌ Erro ao enviar:', erro.message);
    
    const fs = require('fs');
    fs.appendFileSync('/tmp/dicas-whatsapp.log', JSON.stringify({
      data: new Date().toISOString(),
      erro: erro.message,
      sucesso: false
    }) + '\n');
    
    process.exit(1);
  }
}

main();
