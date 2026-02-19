const WP_URL = 'https://60maiscursos.com.br/blog/wp-json/wp/v2';
const auth = 'Basic ' + Buffer.from('benjamin:N40u Hpcw VTFh vqAW vEmN Ycfb').toString('base64');
const LOGO_URL = 'https://60maiscursos.com.br/blog/wp-content/uploads/2026/02/60maisnews-logo.png';

const conteudo = `
<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="${LOGO_URL}" alt="60maisNews - Professor Luis"/></figure></div>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>🌟 <em>"A segurança do nosso dinheiro é a tranquilidade da nossa família."</em></p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>🚨 Golpe do PIX: 5 Dicas Simples para Se Proteger Hoje</h2>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Outro dia, recebi uma ligação de uma senhora muito assustada. Ela tinha acabado de perder <strong>R$ 2.000</strong> em um golpe do PIX.</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote><em>"Moço, eu só queria pagar uma conta"</em>, ela me disse, com a voz trêmula. <em>"A pessoa me ligou dizendo que era do banco e que minha conta estava bloqueada. Eu fiquei com medo..."</em></blockquote>
<!-- /wp:quote -->

<!-- wp:paragraph -->
<p>Ela seguiu as instruções, abriu o aplicativo do banco, e em segundos... o dinheiro tinha sumido. 😢</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>O pior? Ela tinha 72 anos e aquele dinheiro era para comprar remédios.</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>Fiquei com o coração apertado. Isso está acontecendo com milhares de idosos todos os dias.</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>💡 O que isso nos ensina?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Os golpistas usam o <strong>medo</strong> para nos enganar. Mas com algumas dicas simples, podemos nos proteger e manter nosso dinheiro seguro!</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>📋 5 Dicas Para Se Proteger do Golpe do PIX:</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
<li>📞 <strong>O banco NUNCA liga pedindo senha ou código</strong></li>
<li>🔐 <strong>Nunca compartilhe códigos que chegam no celular</strong></li>
<li>⚠️ <strong>Se ligarem dizendo que sua conta está bloqueada, DESLIGUE</strong></li>
<li>📱 <strong>Ligue você mesmo no número oficial do banco</strong></li>
<li>👨‍👩‍👧 <strong>Converse com um familiar antes de fazer qualquer transferência</strong></li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p><strong>🛡️ Dica Extra:</strong> Salve o número oficial do seu banco na agenda. Assim, se precisar ligar, você sabe que é o número certo!</p>
<!-- /wp:paragraph -->

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

<!-- wp:heading {"level":3} -->
<h3>🎓 Quer aprender a se proteger de todos os tipos de golpes?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>Nosso <strong>Curso Segurança Digital</strong> foi criado especialmente para você!</p>
<!-- /wp:paragraph -->

<!-- wp:list -->
<ul>
<li>✅ Aprenda a identificar golpes antes de cair</li>
<li>✅ Proteja suas senhas e contas bancárias</li>
<li>✅ Faça compras online com segurança</li>
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>Mais de 500 alunos já aprenderam a se proteger!</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>📱 Chame no WhatsApp:</strong> <a href="https://wa.me/5511953545939">(11) 95354-5939</a></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><em>📰 60maisNews - Dicas de tecnologia para idosos, todos os dias!</em></p>
<!-- /wp:paragraph -->
`;

async function atualizarPost() {
  console.log('📝 Atualizando post com logo no topo...\n');
  
  const response = await fetch(WP_URL + '/posts/51', {
    method: 'POST',
    headers: {
      'authorization': auth,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      content: conteudo
    })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    console.log('✅ POST ATUALIZADO COM LOGO!');
    console.log('🔗 URL:', data.link);
  } else {
    console.log('❌ Erro:', data.message);
  }
}

atualizarPost();
