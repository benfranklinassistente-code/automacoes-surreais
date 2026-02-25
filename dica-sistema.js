/**
 * 📱 Sistema de Dica WhatsApp via Arquivo
 * O Bot V2 verifica este arquivo e envia a dica
 */

const fs = require('fs');

const ARQUIVO_COMANDO = '/tmp/dica-comando.json';

// Criar comando para enviar dica
function criarComandoDica(conteudo) {
  const mensagem = `📰 *${conteudo.titulo}*

${conteudo.reflexao}

🛡️ *COMO FAZER:*
${conteudo.tutorial.passos.slice(0, 3).map(p => `${p.numero}️⃣ ${p.titulo}`).join('\n')}

${conteudo.seguranca.substring(0, 120)}...

---
📖 60maiscursos.com.br/blog

_Professor Luis - 60maisNews_`;

  fs.writeFileSync(ARQUIVO_COMANDO, JSON.stringify({
    comando: 'enviar_dica',
    target: '120363375518105627@g.us',
    mensagem: mensagem,
    criadoEm: new Date().toISOString()
  }));

  console.log('✅ Comando de dica criado!');
  console.log('📂 Arquivo:', ARQUIVO_COMANDO);
}

// Verificar se há comando pendente
function verificarComando() {
  try {
    if (fs.existsSync(ARQUIVO_COMANDO)) {
      const cmd = JSON.parse(fs.readFileSync(ARQUIVO_COMANDO, 'utf8'));
      
      // Verificar se é de hoje
      const dataCmd = new Date(cmd.criadoEm).toDateString();
      const hoje = new Date().toDateString();
      
      if (dataCmd === hoje && cmd.comando === 'enviar_dica') {
        return cmd;
      }
    }
  } catch (e) {}
  return null;
}

// Marcar como enviado
function marcarEnviado() {
  try {
    if (fs.existsSync(ARQUIVO_COMANDO)) {
      fs.unlinkSync(ARQUIVO_COMANDO);
    }
  } catch (e) {}
}

module.exports = {
  criarComandoDica,
  verificarComando,
  marcarEnviado,
  ARQUIVO_COMANDO
};
