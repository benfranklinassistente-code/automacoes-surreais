/**
 * Publicar Newsletter no Blog WordPress
 */

const https = require('https');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./wordpress-config.json', 'utf8'));
const conteudo = JSON.parse(fs.readFileSync('./conteudo-gerado.json', 'utf8'));

const auth = 'Basic ' + Buffer.from(config.username + ':' + config.password).toString('base64');

// Gerar HTML
let html = `<h2>${conteudo.reflexao}</h2>\n\n`;
html += `<p><em>${conteudo.story}</em></p>\n\n`;
html += `<p>${conteudo.lesson}</p>\n\n`;
html += `<h2>${conteudo.tutorial.titulo}</h2>\n\n`;
html += `<p>${conteudo.tutorial.introducao}</p>\n\n`;

conteudo.tutorial.passos.forEach(p => {
  html += `<h3>${p.numero}. ${p.titulo}</h3>\n`;
  html += `<p><strong>Como fazer:</strong> ${p.acao}</p>\n`;
  html += `<p><em>Exemplo: ${p.exemplo}</em></p>\n\n`;
});

html += `<h2>✅ Checklist</h2>\n<pre>${conteudo.tutorial.checklist}</pre>\n\n`;
html += `<h2>⚠️ Segurança</h2>\n<p>${conteudo.seguranca}</p>\n\n`;
html += `<p style="background:#f0f0f0;padding:15px;border-radius:8px;">${conteudo.oQueMaisAprender}</p>\n`;

const postData = JSON.stringify({
  title: conteudo.titulo,
  content: html,
  status: 'publish',
  categories: [1]
});

console.log('📝 Publicando:', conteudo.titulo);

const options = {
  hostname: '60maiscursos.com.br',
  path: '/blog/wp-json/wp/v2/posts',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': auth,
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 201) {
      const post = JSON.parse(data);
      console.log('✅ PUBLICADO COM SUCESSO!');
      console.log('🔗 Link:', post.link);
      
      // Salvar registro
      fs.writeFileSync('./ultimo-post.json', JSON.stringify({
        id: post.id,
        link: post.link,
        titulo: post.title.rendered,
        data: new Date().toISOString()
      }, null, 2));
    } else {
      console.log('❌ Erro HTTP:', res.statusCode);
      console.log(data.substring(0, 300));
    }
  });
});

req.on('error', e => console.error('❌ Erro:', e.message));
req.write(postData);
req.end();
