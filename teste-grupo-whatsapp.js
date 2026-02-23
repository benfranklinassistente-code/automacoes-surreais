/**
 * Enviar mensagem de teste para grupo WhatsApp
 */

const GRUPO_ID = '120363375518105627@g.us';

const mensagem = `🤖 *TESTE DO SISTEMA 60maisPlay*

Olá! Este é um teste automático do sistema de dicas diárias.

✅ Se você recebeu esta mensagem, o sistema está funcionando corretamente!

_Esta mensagem foi enviada automaticamente pelo Ben - Assistente 60maisPlay_`;

console.log('📱 Enviando mensagem de teste...');
console.log('Grupo:', GRUPO_ID);
console.log('Mensagem:', mensagem);

// Usar o bot-whatsapp-v2 para enviar
const { Client, LocalAuth } = require('whatsapp-web.js');

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: '60mais-bot',
    dataPath: '/root/.openclaw/workspace/.wwebjs_auth'
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  }
});

client.on('ready', async () => {
  console.log('✅ Bot conectado!');
  
  try {
    const chat = await client.getChatById(GRUPO_ID);
    await chat.sendMessage(mensagem);
    console.log('✅ Mensagem enviada com sucesso!');
    process.exit(0);
  } catch (erro) {
    console.error('❌ Erro ao enviar:', erro.message);
    process.exit(1);
  }
});

client.on('auth_failure', (erro) => {
  console.error('❌ Falha na autenticação:', erro);
  process.exit(1);
});

console.log('🔄 Conectando ao WhatsApp...');
client.initialize();
