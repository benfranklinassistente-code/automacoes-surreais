/**
 * Template HTML da Newsletter 60maisNews
 * Logo no topo, padrão visual consistente
 */

const LOGO_URL = 'https://60maiscursos.com.br/blog/wp-content/uploads/2026/02/60maisnews-logo.png';

/**
 * Gera HTML da newsletter para email (formato antigo com dicas)
 */
function gerarHTMLEmail({ titulo, reflexao, story, lesson, dicas, seguranca, cta }) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>60maisNews - ${titulo}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  
  <!-- Logo no Topo -->
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="${LOGO_URL}" alt="60maisNews - Professor Luis" style="max-width: 100%; height: auto; border-radius: 10px;">
  </div>

  <!-- Conteúdo -->
  <div style="background: white; padding: 25px; border-radius: 10px;">
    
    <!-- Reflexão -->
    <div style="background: #f8f9fa; border-left: 4px solid #1e3a5f; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; font-style: italic; font-size: 16px;">${reflexao}</p>
    </div>

    <!-- Título -->
    <h2 style="color: #1e3a5f; font-size: 22px; margin-top: 0;">${titulo}</h2>

    <!-- Story -->
    <div style="font-size: 16px; line-height: 1.6; color: #333;">${story}</div>

    <!-- Lesson -->
    <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 16px;">💡 <strong>O que isso nos ensina:</strong> ${lesson}</p>
    </div>

    <!-- Dicas -->
    <h3 style="color: #1e3a5f; font-size: 18px;">📋 Dicas Práticas:</h3>
    <div style="background: #e8f4f8; border-radius: 8px; padding: 15px; margin: 15px 0;">
      ${(dicas || []).map(d => `<p style="margin: 8px 0;">${d}</p>`).join('')}
    </div>

    <!-- Dica de Segurança -->
    ${seguranca ? `
    <div style="background: #d4edda; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 15px;">🛡️ <strong>Dica Extra:</strong> ${seguranca}</p>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="background: linear-gradient(135deg, #1e3a5f, #2d5a87); color: white; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;">
      ${cta}
    </div>

  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
    <p>📰 <strong>60maisNews</strong> - Dicas de tecnologia para idosos</p>
    <p>📧 Enviado por: 60maisPlay | Professor Luis</p>
    <p style="font-size: 11px; color: #999;">Você recebeu este email porque se cadastrou na 60maisNews.</p>
  </div>

</body>
</html>`;
}

/**
 * Gera HTML completo da newsletter para email (com tutorial dinâmico)
 */
function gerarHTMLEmailCompleto({ titulo, reflexao, story, lesson, tutorial, oQueMaisAprender, seguranca, cta }) {
  let tutorialHTML = '';
  
  if (tutorial) {
    tutorialHTML = `
    <!-- Tutorial Completo -->
    <h3 style="color: #1e3a5f; font-size: 20px; margin-top: 30px;">${tutorial.titulo}</h3>
    
    <p style="font-size: 16px; line-height: 1.6;">${tutorial.introducao}</p>

    <div style="background: #e8f4f8; border-radius: 8px; padding: 20px; margin: 20px 0;">
      ${tutorial.passos.map(p => `
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #ccc;">
          <h4 style="color: #1e3a5f; margin: 0 0 10px 0;">${p.numero}. ${p.titulo}</h4>
          <p style="margin: 5px 0;"><strong>Explicação:</strong> ${p.explicacao}</p>
          <p style="margin: 5px 0; color: #2e7d32;"><strong>✅ Ação:</strong> ${p.acao}</p>
          <p style="margin: 5px 0; background: #fff; padding: 10px; border-radius: 5px;"><strong>Exemplo:</strong> ${p.exemplo}</p>
        </div>
      `).join('')}
    </div>

    <!-- Checklist -->
    <div style="background: #d4edda; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <h4 style="margin: 0 0 10px 0;">📋 CHECKLIST - Salve esta mensagem!</h4>
      <pre style="margin: 0; font-family: Arial, sans-serif; white-space: pre-wrap;">${tutorial.checklist}</pre>
    </div>

    <!-- O que mais aprender -->
    <div style="background: #f5f5f5; border-radius: 8px; padding: 15px; margin: 20px 0;">
      ${oQueMaisAprender}
    </div>`;
  }

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>60maisNews - ${titulo}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  
  <!-- Logo no Topo -->
  <div style="text-align: center; margin-bottom: 20px;">
    <img src="${LOGO_URL}" alt="60maisNews - Professor Luis" style="max-width: 100%; height: auto; border-radius: 10px;">
  </div>

  <!-- Conteúdo -->
  <div style="background: white; padding: 25px; border-radius: 10px;">
    
    <!-- Reflexão -->
    <div style="background: #f8f9fa; border-left: 4px solid #1e3a5f; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; font-style: italic; font-size: 16px;">${reflexao}</p>
    </div>

    <!-- Título -->
    <h2 style="color: #1e3a5f; font-size: 22px; margin-top: 0;">${titulo}</h2>

    <!-- Story -->
    <div style="font-size: 16px; line-height: 1.6; color: #333;">${story}</div>

    <!-- Lesson -->
    <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 16px;">💡 <strong>O que isso nos ensina:</strong> ${lesson}</p>
    </div>

    ${tutorialHTML}

    <!-- Dica de Segurança -->
    ${seguranca ? `
    <div style="background: #ffebee; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 15px;">🛡️ <strong>Dica de Segurança:</strong> ${seguranca}</p>
    </div>
    ` : ''}

    <!-- CTA -->
    <div style="background: linear-gradient(135deg, #1e3a5f, #2d5a87); color: white; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;">
      ${cta}
    </div>

  </div>

  <!-- Footer -->
  <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
    <p>📰 <strong>60maisNews</strong> - Dicas de tecnologia para idosos</p>
    <p>📧 Enviado por: 60maisPlay | Professor Luis</p>
    <p style="font-size: 11px; color: #999;">Você recebeu este email porque se cadastrou na 60maisNews.</p>
  </div>

</body>
</html>`;
}

/**
 * Gera HTML para WordPress (formato antigo com dicas)
 */
function gerarHTMLWordPress({ titulo, reflexao, story, lesson, dicas, seguranca, cta }) {
  return `<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="${LOGO_URL}" alt="60maisNews - Professor Luis"/></figure></div>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>${reflexao}</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>${titulo}</h2>
<!-- /wp:heading -->

${story}

<!-- wp:heading {"level":3} -->
<h3>💡 O que isso nos ensina?</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${lesson}</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":3} -->
<h3>📋 Dicas Práticas:</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
${(dicas || []).map(d => `<li>${d}</li>`).join('\n')}
</ul>
<!-- /wp:list -->

${seguranca ? `<!-- wp:paragraph -->
<p><strong>🛡️ Dica Extra:</strong> ${seguranca}</p>
<!-- /wp:paragraph -->` : ''}

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

${cta}

<!-- wp:paragraph -->
<p><em>📰 60maisNews - Dicas de tecnologia para idosos, todos os dias!</em></p>
<!-- /wp:paragraph -->`;
}

/**
 * Gera HTML para WordPress com tutorial completo (Gutenberg blocks)
 */
function gerarHTMLWordPressCompleto({ titulo, reflexao, story, lesson, tutorial, oQueMaisAprender, seguranca, cta }) {
  let tutorialHTML = '';
  
  if (tutorial) {
    tutorialHTML = `
<!-- wp:heading {"level":3} -->
<h3>${tutorial.titulo}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p>${tutorial.introducao}</p>
<!-- /wp:paragraph -->

${tutorial.passos.map(p => `
<!-- wp:heading {"level":4} -->
<h4>${p.numero}. ${p.titulo}</h4>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>Explicação:</strong> ${p.explicacao}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>✅ Ação:</strong> ${p.acao}</p>
<!-- /wp:paragraph -->

<!-- wp:quote -->
<blockquote class="wp-block-quote"><p><strong>Exemplo:</strong> ${p.exemplo}</p></blockquote>
<!-- /wp:quote -->
`).join('\n')}

<!-- wp:heading {"level":4} -->
<h4>📋 CHECKLIST - Salve para consultar!</h4>
<!-- /wp:heading -->

<!-- wp:preformatted -->
<pre class="wp-block-preformatted">${tutorial.checklist}</pre>
<!-- /wp:preformatted -->

<!-- wp:paragraph -->
<p>${oQueMaisAprender || ''}</p>
<!-- /wp:paragraph -->`;
  }

  return `<!-- wp:image {"align":"center","sizeSlug":"large"} -->
<div class="wp-block-image"><figure class="aligncenter size-large"><img src="${LOGO_URL}" alt="60maisNews - Professor Luis"/></figure></div>
<!-- /wp:image -->

<!-- wp:paragraph -->
<p>${reflexao}</p>
<!-- /wp:paragraph -->

<!-- wp:heading {"level":2} -->
<h2>${titulo}</h2>
<!-- /wp:heading -->

${story}

<!-- wp:paragraph -->
<p>💡 <strong>O que isso nos ensina:</strong> ${lesson}</p>
<!-- /wp:paragraph -->

${tutorialHTML}

${seguranca ? `<!-- wp:paragraph -->
<p>🛡️ <strong>Dica de Segurança:</strong> ${seguranca}</p>
<!-- /wp:paragraph -->` : ''}

<!-- wp:separator -->
<hr class="wp-block-separator"/>
<!-- /wp:separator -->

${cta}

<!-- wp:paragraph -->
<p><em>📰 60maisNews - Dicas de tecnologia para idosos, todos os dias!</em></p>
<!-- /wp:paragraph -->`;
}

/**
 * Gera CTA HTML para email
 */
function gerarCTA({ produto, beneficios, provaSocial, whatsapp }) {
  return `<h3 style="margin: 0 0 10px 0; font-size: 18px;">🎓 ${produto}</h3>
      <div style="text-align: left; padding: 0 20px;">
        ${(beneficios || []).map(b => `<p style="margin: 5px 0;">✅ ${b}</p>`).join('')}
      </div>
      <p style="margin: 15px 0 0 0; font-size: 14px;">${provaSocial}</p>
      <a href="https://wa.me/55${whatsapp.replace(/\D/g, '')}" style="display: inline-block; background: #25D366; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: bold; margin-top: 15px;">
        📱 Chame no WhatsApp
      </a>`;
}

/**
 * Gera CTA para WordPress
 */
function gerarCTAWordPress({ produto, beneficios, provaSocial, whatsapp }) {
  return `<!-- wp:heading {"level":3} -->
<h3>🎓 ${produto}</h3>
<!-- /wp:heading -->

<!-- wp:list -->
<ul>
${(beneficios || []).map(b => `<li>✅ ${b}</li>`).join('\n')}
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>${provaSocial}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><strong>📱 Chame no WhatsApp:</strong> <a href="https://wa.me/55${whatsapp.replace(/\D/g, '')}">${whatsapp}</a></p>
<!-- /wp:paragraph -->`;
}

module.exports = {
  LOGO_URL,
  gerarHTMLEmail,
  gerarHTMLEmailCompleto,
  gerarHTMLWordPress,
  gerarHTMLWordPressCompleto,
  gerarCTA,
  gerarCTAWordPress
};
