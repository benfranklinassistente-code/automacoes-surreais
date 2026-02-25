/**
 * Enviar Dica Diária para Grupo WhatsApp
 * Grupo: Curso Smartphone Inteligência Artificial 60+
 * Usa CLI do OpenClaw Gateway
 */

const { execSync } = require('child_process');
const fs = require('fs');

const GRUPO_ID = '120363375518105627@g.us'; // Grupo: Curso Smartphone Inteligência Artificial 60+
const LOG_FILE = '/tmp/dicas-whatsapp.log';

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

function log(data) {
  fs.appendFileSync(LOG_FILE, JSON.stringify(data) + '\n');
}

async function main() {
  console.log('📱 Enviando dica diária para o grupo WhatsApp...');
  console.log('⏰', new Date().toLocaleString('pt-BR'));
  
  const dica = selecionarDica();
  console.log('📌 Dica:', dica.titulo);
  
  const mensagem = `☀️ *${dica.titulo}*\n\n${dica.texto}\n\n_Dica do dia 60maisPlay_`;
  
  try {
    // Usar CLI do OpenClaw para enviar mensagem
    const resultado = execSync(
      `openclaw message send --channel whatsapp --target "${GRUPO_ID}" --message "${mensagem.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" --json`,
      { encoding: 'utf-8', timeout: 30000 }
    );
    
    console.log('✅ Dica enviada com sucesso!');
    console.log(resultado);
    
    log({
      data: new Date().toISOString(),
      tema: dica.titulo,
      sucesso: true
    });
    
  } catch (erro) {
    console.error('❌ Erro ao enviar:', erro.message);
    
    log({
      data: new Date().toISOString(),
      erro: erro.message,
      sucesso: false
    });
    
    process.exit(1);
  }
}

main();
