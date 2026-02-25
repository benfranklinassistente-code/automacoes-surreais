/**
 * 📱 DICA WHATSAPP - Mesmo tema da Newsletter
 * Pega o conteúdo da newsletter e formata para WhatsApp
 * Executa às 08:00 Brasília (após newsletter 06:06)
 */

const http = require('http');
const fs = require('fs');

const CONFIG = {
  gatewayToken: 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  grupoId: '120363375518105627@g.us',
  temaArquivo: '/root/.openclaw/workspace/tema-selecionado.json',
  conteudoArquivo: '/root/.openclaw/workspace/conteudo-gerado.json'
};

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
      path: '/message/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + CONFIG.gatewayToken,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('Status:', res.statusCode);
        resolve(data);
      });
    });

    req.on('error', reject);
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Timeout'));
    });
    req.write(postData);
    req.end();
  });
}

// Formatar conteúdo da newsletter para WhatsApp
function formatarParaWhatsApp(conteudo) {
  const titulo = conteudo.titulo || 'Dica do Dia';
  const reflexao = conteudo.reflexao || '';
  const tutorial = conteudo.tutorial || { passos: [] };
  const seguranca = conteudo.seguranca || '';
  
  // Pegar os 3 primeiros passos do tutorial
  let passosTexto = '';
  if (tutorial.passos && tutorial.passos.length > 0) {
    passosTexto = tutorial.passos.slice(0, 3).map(p => 
      `${p.numero}️⃣ ${p.titulo}`
    ).join('\n');
  }

  const mensagem = `📰 *${titulo}*

${reflexao}

🛡️ *COMO FAZER:*
${passosTexto}

${seguranca.substring(0, 150)}...

---
📖 Tutorial completo: 60maiscursos.com.br/blog

_Professor Luis - 60maisNews_`;

  // Limitar a 1500 caracteres (WhatsApp)
  return mensagem.substring(0, 1500);
}

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📱 DICA WHATSAPP - Sincronizada com Newsletter');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Carregar tema
  let tema;
  try {
    tema = JSON.parse(fs.readFileSync(CONFIG.temaArquivo, 'utf8'));
    console.log('📌 Tema:', tema.tema);
  } catch (e) {
    console.log('❌ Erro: tema-selecionado.json não encontrado');
    process.exit(1);
  }
  
  // Carregar conteúdo
  let conteudo;
  try {
    conteudo = JSON.parse(fs.readFileSync(CONFIG.conteudoArquivo, 'utf8'));
    console.log('✅ Conteúdo carregado\n');
  } catch (e) {
    console.log('❌ Erro: conteudo-gerado.json não encontrado');
    process.exit(1);
  }
  
  // Formatar para WhatsApp
  const mensagem = formatarParaWhatsApp(conteudo);
  console.log('📝 Mensagem preparada\n');
  
  // Enviar
  try {
    const resultado = await enviarMensagem(mensagem);
    console.log('\n✅ DICA ENVIADA!\n');
    
    // Salvar log
    fs.appendFileSync('/tmp/dicas-whatsapp.log', JSON.stringify({
      data: new Date().toISOString(),
      tema: tema.tema,
      sucesso: true
    }) + '\n');
    
  } catch (erro) {
    console.error('❌ Erro:', erro.message);
    process.exit(1);
  }
}

main();
