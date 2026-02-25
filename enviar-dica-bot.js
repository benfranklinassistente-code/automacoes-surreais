/**
 * 📱 Enviar Dica via Bot WhatsApp
 * Este script é executado pelo bot V2 que TEM acesso ao WhatsApp
 */

const fs = require('fs');

// Mensagem da dica Netflix
const DICA_NETFLIX = `📰 *📺 Netflix: Como Assistir Séries e Filmes*

🌟 A tecnologia nos presenteia com o cinema dentro de casa!

🛡️ *COMO FAZER:*

1️⃣ Entre na Netflix (ícone N vermelho)
2️⃣ Faça login com email e senha
3️⃣ Escolha seu perfil

⚠️ *Dica:* Nunca empreste sua senha para estranhos!

---
📖 Tutorial completo: 60maiscursos.com.br/blog

_Professor Luis - 60maisNews_`;

const GRUPO_ID = '120363375518105627@g.us';
const ARQUIVO_ENVIO = '/tmp/dica-enviada-hoje.json';

// Verificar se já enviou hoje
function jaEnviouHoje() {
  try {
    if (fs.existsSync(ARQUIVO_ENVIO)) {
      const dados = JSON.parse(fs.readFileSync(ARQUIVO_ENVIO, 'utf8'));
      const hoje = new Date().toDateString();
      return dados.data === hoje && dados.enviado;
    }
  } catch (e) {}
  return false;
}

// Marcar como enviado
function marcarEnviado() {
  fs.writeFileSync(ARQUIVO_ENVIO, JSON.stringify({
    data: new Date().toDateString(),
    enviado: true,
    timestamp: new Date().toISOString()
  }));
}

module.exports = {
  DICA_NETFLIX,
  GRUPO_ID,
  jaEnviouHoje,
  marcarEnviado
};
