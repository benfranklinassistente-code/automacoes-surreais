/**
 * 📱 Enviar Dica Diretamente via WhatsApp
 */

const GRUPO_ID = '120363375518105627@g.us';

const mensagem = `📰 *📺 Netflix: Como Assistir Séries e Filmes*

🌟 A tecnologia nos presenteia com o cinema dentro de casa!

🛡️ *COMO FAZER:*

1️⃣ Entre na Netflix (ícone N vermelho)
2️⃣ Faça login com email e senha
3️⃣ Escolha seu perfil

⚠️ *Dica:* Nunca empreste sua senha para estranhos!

---
📖 Tutorial completo: 60maiscursos.com.br/blog

_Professor Luis - 60maisNews_`;

console.log('📱 Enviando dica Netflix para o grupo...');
console.log('Grupo:', GRUPO_ID);

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
    console.log('✅ Dica enviada com sucesso!');
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
