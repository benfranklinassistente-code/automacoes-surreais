/**
 * Enviar Dica para Grupo WhatsApp - AGORA
 */
const http = require('http');

const CONFIG = {
  gatewayToken: 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  grupoId: '120363375518105627@g.us'
};

const MENSAGEM = `📰 *📺 Netflix: Como Assistir Séries e Filmes*

🌟 A tecnologia nos presenteia com o cinema dentro de casa!

🛡️ *COMO FAZER:*

1️⃣ Entre na Netflix (ícone N vermelho)
2️⃣ Faça login com email e senha
3️⃣ Escolha seu perfil

⚠️ Nunca empreste sua senha para estranhos!

---
📖 60maiscursos.com.br/blog

_Professor Luis - 60maisNews_`;

// Tentar diferentes endpoints
async function tentarEnviar() {
  const endpoints = [
    { path: '/api/message/send', method: 'POST' },
    { path: '/api/send', method: 'POST' },
    { path: '/message/send', method: 'POST' },
    { path: '/send', method: 'POST' }
  ];

  for (const ep of endpoints) {
    console.log(`Tentando: ${ep.method} ${ep.path}`);
    
    const result = await new Promise((resolve) => {
      const postData = JSON.stringify({
        channel: 'whatsapp',
        target: CONFIG.grupoId,
        message: MENSAGEM
      });

      const options = {
        hostname: '127.0.0.1',
        port: 18789,
        path: ep.path,
        method: ep.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${CONFIG.gatewayToken}`,
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, body: data }));
      });

      req.on('error', (e) => resolve({ error: e.message }));
      req.setTimeout(10000, () => {
        req.destroy();
        resolve({ error: 'timeout' });
      });
      req.write(postData);
      req.end();
    });

    console.log('  Resultado:', result);
    
    if (result.status === 200 || result.status === 201) {
      console.log('✅ SUCESSO!');
      return;
    }
  }

  console.log('❌ Nenhum endpoint funcionou');
}

tentarEnviar();
