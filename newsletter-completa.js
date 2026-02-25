/**
 * 📰 NEWSLETTER + DICA WHATSAPP + BLOG
 * Executa às 06:06 e faz tudo junto
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Caminhos
const CACHE_FILE = path.join(__dirname, 'cache-newsletter-completo.json');
const HISTORICO_FILE = path.join(__dirname, 'historico-temas.json');
const GRUPO_WHATSAPP = '120363375518105627@g.us';

// Credenciais
const brevoConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'brevo-config.json'), 'utf8'));
const wpConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'wordpress-config.json'), 'utf8'));

// Selecionar tema
function selecionarTema() {
  const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  let historico = { temas: [] };
  if (fs.existsSync(HISTORICO_FILE)) {
    historico = JSON.parse(fs.readFileSync(HISTORICO_FILE, 'utf8'));
  }
  
  const trintaDiasAtras = Date.now() - (30 * 24 * 60 * 60 * 1000);
  const temasUsadosRecente = historico.temas
    .filter(t => t.timestamp > trintaDiasAtras)
    .map(t => t.tema.toLowerCase());
  
  const temaDisponivel = cache.temas.find(t => {
    const nomeTema = t.tema.toLowerCase();
    return !temasUsadosRecente.some(usado => 
      usado.includes(nomeTema) || nomeTema.includes(usado)
    );
  });
  
  return temaDisponivel || cache.temas[0];
}

// Gerar HTML para email
function gerarHTMLEmail(tema) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    .reflexao { background: #f5f5f5; padding: 15px; border-radius: 8px; font-style: italic; }
    .passo { background: #e8f4f8; padding: 12px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #0077b6; }
    .seguranca { background: #fff3cd; padding: 12px; border-radius: 8px; }
    .cta { background: #0077b6; color: white; padding: 15px; text-align: center; border-radius: 8px; margin-top: 20px; }
    .cta a { color: white; }
  </style>
</head>
<body>
  <h1 style="color: #0077b6;">${tema.titulo}</h1>
  
  <div class="reflexao">
    ${tema.reflexao || '🌟 Dica do dia para você!'}
  </div>
  
  <p>${tema.story || tema.conteudo || ''}</p>
  
  <h2>📋 Como Fazer:</h2>
  ${(tema.passos || tema.tutorial?.passos || []).map(p => `
    <div class="passo">
      <strong>${p.numero || ''}. ${p.titulo || ''}</strong>
      <p>${p.acao || p.explicacao || ''}</p>
    </div>
  `).join('')}
  
  <div class="seguranca">
    <strong>⚠️ Segurança:</strong><br>
    ${tema.seguranca || 'Mantenha suas senhas seguras!'}
  </div>
  
  <div class="cta">
    <a href="https://60maiscursos.com.br/cursos">📚 Quero aprender mais!</a>
  </div>
  
  <p style="text-align: center; color: #666; font-size: 12px;">
    Professor Luis - 60maisNews<br>
    <a href="{{unsubscribe}}">Descadastrear</a>
  </p>
</body>
</html>
`;
}

// Formatar para WhatsApp
function formatarWhatsApp(tema) {
  let passos = '';
  if (tema.passos || tema.tutorial?.passos) {
    const lista = tema.passos || tema.tutorial.passos;
    passos = lista.slice(0, 3).map(p => `${p.numero}️⃣ ${p.titulo}`).join('\n');
  }
  
  return `📰 *${tema.titulo}*

${tema.reflexao || ''}

🛡️ *COMO FAZER:*
${passos}

${(tema.seguranca || '').substring(0, 100)}...

---
📖 60maiscursos.com.br/blog

_Professor Luis - 60maisNews_`.substring(0, 1500);
}

// Enviar email via Brevo
async function enviarEmail(tema, html) {
  const postData = JSON.stringify({
    sender: { name: 'Professor Luis', email: 'luis@60maiscursos.com.br' },
    to: [{ email: 'lista@60maiscursos.com.br', name: 'Lista 60mais' }],
    subject: tema.titulo,
    htmlContent: html,
    tags: ['newsletter', '60maisnews']
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'api.brevo.com',
      path: '/v3/smtp/email',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': brevoConfig.apiKey,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`Brevo: ${res.statusCode}`));
        }
      });
    });
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Publicar no blog
async function publicarBlog(tema, html) {
  const auth = 'Basic ' + Buffer.from(wpConfig.username + ':' + wpConfig.password).toString('base64');
  
  const postData = JSON.stringify({
    title: tema.titulo,
    content: html,
    status: 'publish'
  });

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: '60maiscursos.com.br',
      path: '/blog/wp-json/wp/v2/posts',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth,
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          resolve(JSON.parse(data));
        } else {
          console.log('Blog erro:', res.statusCode, data.substring(0, 200));
          resolve(null); // Não falha tudo se o blog der erro
        }
      });
    });
    req.on('error', (e) => {
      console.log('Blog erro:', e.message);
      resolve(null);
    });
    req.write(postData);
    req.end();
  });
}

// Salvar dica para ser enviada pelo bot
function salvarDicaParaBot(tema, mensagem) {
  const dica = {
    tema: tema.tema,
    titulo: tema.titulo,
    mensagem: mensagem,
    grupoId: GRUPO_WHATSAPP,
    data: new Date().toISOString(),
    enviada: false
  };
  fs.writeFileSync(path.join(__dirname, 'dica-pendente.json'), JSON.stringify(dica, null, 2));
  console.log('💾 Dica salva para envio pelo Bot WhatsApp');
}

// Registrar tema usado
function registrarTema(tema) {
  let historico = { temas: [] };
  if (fs.existsSync(HISTORICO_FILE)) {
    historico = JSON.parse(fs.readFileSync(HISTORICO_FILE, 'utf8'));
  }
  historico.temas.push({
    tema: tema.tema,
    data: new Date().toISOString(),
    timestamp: Date.now()
  });
  fs.writeFileSync(HISTORICO_FILE, JSON.stringify(historico, null, 2));
}

// EXECUTAR
async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📰 NEWSLETTER 60maisNews - Sistema Unificado');
  console.log('⏰', new Date().toLocaleString('pt-BR'));
  console.log('═══════════════════════════════════════════════════════════════\n');

  try {
    // 1. Selecionar tema
    const tema = selecionarTema();
    console.log('📌 Tema:', tema.tema);
    console.log('   Título:', tema.titulo, '\n');

    // 2. Gerar HTML
    const html = gerarHTMLEmail(tema);

    // 3. Enviar email
    console.log('📧 Enviando newsletter...');
    const resultado = await enviarEmail(tema, html);
    console.log('✅ Email enviado! ID:', resultado.messageId, '\n');

    // 4. Publicar no blog
    console.log('📝 Publicando no blog...');
    const post = await publicarBlog(tema, html);
    if (post) {
      console.log('✅ Blog publicado:', post.link, '\n');
    } else {
      console.log('⚠️ Blog não publicado (continuando...)\n');
    }

    // 5. Salvar dica para WhatsApp
    const msgWhatsApp = formatarWhatsApp(tema);
    salvarDicaParaBot(tema, msgWhatsApp);

    // 6. Registrar tema
    registrarTema(tema);

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log('✅ NEWSLETTER CONCLUÍDA!');
    console.log('   📧 Email: enviado');
    console.log('   📝 Blog: ' + (post ? 'publicado' : 'pendente'));
    console.log('   📱 WhatsApp: aguardando Bot enviar');
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (erro) {
    console.error('❌ ERRO:', erro.message);
    process.exit(1);
  }
}

main();
