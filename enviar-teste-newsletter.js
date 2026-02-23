/**
 * Enviar Teste da Newsletter
 * Usa o cache-newsletter-completo.json
 */

const fs = require('fs');

// Carregar cache
const cache = JSON.parse(fs.readFileSync('./cache-newsletter-completo.json', 'utf8'));
const tema = cache.temas[0]; // Primeiro tema: Antivírus Grátis

// Carregar credenciais Brevo
const brevoConfig = JSON.parse(fs.readFileSync('./brevo-config.json', 'utf8'));

// HTML da newsletter
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${tema.titulo}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Georgia, serif;">
  
  <!-- CABEÇALHO -->
  <div style="width: 100%; background-color: #2563eb; text-align: center; padding: 20px 0;">
    <img src="${cache.configuracao.imagens.cabecalho}" alt="60maisNews" style="max-width: 550px; width: 100%;">
  </div>
  
  <!-- CONTEÚDO -->
  <div style="max-width: 600px; margin: 0 auto; padding: 30px 20px; background-color: #ffffff;">
    
    <!-- TÍTULO -->
    <h1 style="color: #2563eb; font-size: 24px; margin-bottom: 10px;">${tema.titulo}</h1>
    
    <!-- REFLEXÃO -->
    <div style="background-color: #f0f9ff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
      <p style="font-style: italic; color: #1e40af; font-size: 18px; margin: 0;">
        "${tema.reflexao}"
      </p>
    </div>
    
    <!-- HISTÓRIA -->
    <div style="margin: 25px 0;">
      <h2 style="color: #333; font-size: 20px;">📖 História</h2>
      <p style="color: #333; font-size: 16px; line-height: 1.6;">${tema.historia}</p>
    </div>
    
    <!-- LIÇÃO -->
    <div style="background-color: #fef3c7; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <h2 style="color: #92400e; font-size: 18px; margin: 0 0 10px 0;">💡 Lição</h2>
      <p style="color: #78350f; font-size: 16px; margin: 0; font-weight: bold;">${tema.licao}</p>
    </div>
    
    <!-- TUTORIAL -->
    <div style="margin: 30px 0;">
      <h2 style="color: #2563eb; font-size: 22px; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">🛡️ Tutorial Passo a Passo</h2>
      
      <div style="margin: 20px 0; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
        <h3 style="color: #1e40af; margin: 0 0 10px 0;">PASSO 1: ${tema.tutorial.passo1.titulo}</h3>
        <p style="color: #333; margin: 5px 0;"><strong>▸ Explicação:</strong> ${tema.tutorial.passo1.explicacao}</p>
        <p style="color: #333; margin: 5px 0;"><strong>▸ Ação:</strong> ${tema.tutorial.passo1.acao}</p>
        <p style="color: #666; margin: 5px 0; font-style: italic;">Exemplo: ${tema.tutorial.passo1.exemplo}</p>
      </div>
      
      <div style="margin: 20px 0; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
        <h3 style="color: #1e40af; margin: 0 0 10px 0;">PASSO 2: ${tema.tutorial.passo2.titulo}</h3>
        <p style="color: #333; margin: 5px 0;"><strong>▸ Explicação:</strong> ${tema.tutorial.passo2.explicacao}</p>
        <p style="color: #333; margin: 5px 0;"><strong>▸ Ação:</strong> ${tema.tutorial.passo2.acao}</p>
        <p style="color: #666; margin: 5px 0; font-style: italic;">Exemplo: ${tema.tutorial.passo2.exemplo}</p>
      </div>
      
      <div style="margin: 20px 0; padding: 20px; background-color: #f8fafc; border-radius: 10px;">
        <h3 style="color: #1e40af; margin: 0 0 10px 0;">PASSO 3: ${tema.tutorial.passo3.titulo}</h3>
        <p style="color: #333; margin: 5px 0;"><strong>▸ Explicação:</strong> ${tema.tutorial.passo3.explicacao}</p>
        <p style="color: #333; margin: 5px 0;"><strong>▸ Ação:</strong> ${tema.tutorial.passo3.acao}</p>
        <p style="color: #666; margin: 5px 0; font-style: italic;">Exemplo: ${tema.tutorial.passo3.exemplo}</p>
      </div>
    </div>
    
    <!-- CHECKLIST -->
    <div style="background-color: #ecfdf5; padding: 20px; border-radius: 10px; margin: 25px 0;">
      <h2 style="color: #065f46; font-size: 18px; margin: 0 0 15px 0;">☐ Checklist Rápido</h2>
      <p style="color: #047857; font-size: 16px; margin: 5px 0;">${tema.checklist.join('<br>')}</p>
    </div>
    
    <!-- CTA -->
    <div style="text-align: center; margin: 30px 0; padding: 25px; background-color: #fef3c7; border-radius: 15px;">
      <h2 style="color: #92400e; font-size: 20px; margin: 0 0 15px 0;">📚 Quer Aprender Mais?</h2>
      <p style="color: #78350f; font-size: 16px; margin: 0 0 20px 0;">${tema.cta.produto} - ${tema.cta.preco}</p>
      <a href="${tema.cta.link_whatsapp}" style="display: inline-block; background-color: #25D366; color: white; padding: 15px 30px; text-decoration: none; border-radius: 30px; font-size: 18px; font-weight: bold;">
        🟢 Falar no WhatsApp
      </a>
    </div>
    
    <!-- DICA EXTRA -->
    <div style="background-color: #fef2f2; padding: 20px; border-left: 4px solid #ef4444; margin: 25px 0;">
      <h2 style="color: #b91c1c; font-size: 16px; margin: 0 0 10px 0;">⚠️ Dica Extra de Segurança</h2>
      <p style="color: #7f1d1d; font-size: 15px; margin: 0;">${tema.dica_extra}</p>
    </div>
    
  </div>
  
  <!-- RODAPÉ -->
  <div style="width: 100%; text-align: center; padding: 20px 0;">
    <img src="${cache.configuracao.imagens.rodape}" alt="60maisPlay" style="max-width: 600px; width: 100%;">
  </div>
  
  <!-- FOOTER -->
  <div style="background-color: #1e3a5f; padding: 20px; text-align: center;">
    <p style="color: #94a3b8; font-size: 14px; margin: 0;">
      Professor Luis - 60maisPlay<br>
      Você recebe este email porque se cadastrou na 60maisNews.<br>
      <a href="{{unsubscribe_url}}" style="color: #60a5fa;">Descadastrar</a>
    </p>
  </div>
  
</body>
</html>
`;

// Enviar email
async function enviar() {
  const response = await fetch(`${brevoConfig.apiUrl}/smtp/email`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': brevoConfig.apiKey
    },
    body: JSON.stringify({
      sender: { name: '60maisNews', email: 'newsletter@60maiscursos.com.br' },
      to: [{ email: 'luis7nico@gmail.com' }],
      subject: tema.titulo,
      htmlContent: htmlContent
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    console.error('Erro:', data);
    return;
  }
  
  console.log('✅ Email de teste enviado com sucesso!');
  console.log('📧 Para: luis7nico@gmail.com');
  console.log('📌 Tema:', tema.tema);
  console.log('🔗 Message ID:', data.messageId);
}

enviar().catch(console.error);
