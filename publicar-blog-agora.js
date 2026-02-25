/**
 * Publicar Newsletter no Blog - Imediato
 */

const fs = require('fs');
const https = require('https');

const config = JSON.parse(fs.readFileSync('./wordpress-config.json', 'utf8'));
const conteudo = JSON.parse(fs.readFileSync('./conteudo-gerado.json', 'utf8'));

const WP_URL = config.apiUrl;
const WP_USER = config.username;
const WP_PASS = config.password;
const auth = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

// Gerar HTML do post
const html = `
<h2>${conteudo.reflexao}</h2>

<p><em>${conteudo.story}</em></p>

<h3>💡 O que aprendemos</h3>
<p>${conteudo.lesson}</p>

<h3>📋 ${conteudo.tutorial.titulo}</h3>
<p>${conteudo.tutorial.introducao}</p>

<ol>
${conteudo.tutorial.passos.map(p => `
<li><strong>${p.titulo}</strong><br>
${p.explicacao}<br>
<em>Ação:</em> ${p.acao}</li>
`).join('')}
</ol>

<p><strong>✅ Checklist:</strong></p>
<pre>${conteudo.tutorial.checklist}</pre>

<p>${conteudo.seguranca}</p>

<hr>
<p>${conteudo.oQueMaisAprender}</p>
<p><a href="https://60maiscursos.com.br">Conheça o 60maisPlay →</a></p>
`;

const postData = JSON.stringify({
  title: conteudo.titulo.replace(/^[📺🎬🎥]+\s*/, ''),
  content: html,
  status: 'publish',
  categories: [1], // Sem categoria ou ajustar
  tags: ['netflix', 'tutorial', 'idosos', 'tecnologia']
});

const url = new URL(WP_URL + '/posts');
const options = {
  hostname: url.hostname,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': auth,
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('📝 Publicando no blog...');
console.log('Título:', conteudo.titulo);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 201 || res.statusCode === 200) {
      const post = JSON.parse(data);
      console.log('✅ Publicado com sucesso!');
      console.log('🔗 Link:', post.link);
    } else {
      console.log('❌ Erro:', res.statusCode);
      console.log(data.substring(0, 500));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Erro de conexão:', e.message);
});

req.write(postData);
req.end();
