/**
 * Sistema Automático de Newsletter 60maisNews
 * Usa cache-newsletter-completo.json
 * Executado pelo CRON às 06:06 (Brasília)
 */

const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const CACHE_FILE = path.join(__dirname, 'cache-newsletter-completo.json');
const HISTORICO_FILE = path.join(__dirname, 'historico-temas.json');

// Carregar credenciais
const brevoConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'brevo-config.json'), 'utf8'));
const credenciais = JSON.parse(fs.readFileSync(path.join(__dirname, 'credenciais-60mais.json'), 'utf8'));

/**
 * Seleciona próximo tema não usado nos últimos 30 dias
 */
function selecionarTema() {
  const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
  
  // Carregar histórico de temas usados
  let historico = { temas: [] };
  if (fs.existsSync(HISTORICO_FILE)) {
    historico = JSON.parse(fs.readFileSync(HISTORICO_FILE, 'utf8'));
  }
  
  // Calcular data de 30 dias atrás
  const trintaDiasAtras = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  // Filtrar temas usados nos últimos 30 dias
  const temasUsadosRecente = historico.temas
    .filter(t => t.timestamp > trintaDiasAtras)
    .map(t => t.tema.toLowerCase());
  
  console.log('📋 Temas usados nos últimos 30 dias:', temasUsadosRecente.length);
  
  // Encontrar tema disponível
  const temaDisponivel = cache.temas.find(t => {
    const nomeTema = t.tema.toLowerCase();
    return !temasUsadosRecente.some(usado => 
      usado.includes(nomeTema) || nomeTema.includes(usado)
    );
  });
  
  // Se todos foram usados, usar o primeiro
  return temaDisponivel || cache.temas[0];
}

/**
 * Registrar tema como usado
 */
function registrarTemaUsado(nomeTema) {
  let historico = { temas: [] };
  if (fs.existsSync(HISTORICO_FILE)) {
    historico = JSON.parse(fs.readFileSync(HISTORICO_FILE, 'utf8'));
  }
  
  historico.temas.push({
    tema: nomeTema,
    data: new Date().toISOString(),
    timestamp: Date.now()
  });
  
  historico.atualizado = new Date().toISOString();
  
  fs.writeFileSync(HISTORICO_FILE, JSON.stringify(historico, null, 2));
}

/**
 * Gerar HTML da newsletter
 */
function gerarHTML(tema, imagens) {
  return `
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
    <img src="${imagens.cabecalho}" alt="60maisNews" style="max-width: 550px; width: 100%;">
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
      <h2 style="color: #b91c1c; font-size: 16px; margin: 0 0 10px 0;">⚠️ Dica Extra</h2>
      <p style="color: #7f1d1d; font-size: 15px; margin: 0;">${tema.dica_extra}</p>
    </div>
    
  </div>
  
  <!-- RODAPÉ -->
  <div style="width: 100%; text-align: center; padding: 20px 0;">
    <img src="${imagens.rodape}" alt="60maisPlay" style="max-width: 600px; width: 100%;">
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
}

/**
 * Enviar email usando API transacional do Brevo
 */
async function enviarEmailTransacional(tema, html) {
  // Usar API transacional para enviar para lista
  const response = await fetch(`${brevoConfig.apiUrl}/smtp/email`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': brevoConfig.apiKey
    },
    body: JSON.stringify({
      sender: { name: '60maisNews', email: 'newsletter@60maiscursos.com.br' },
      to: [{ email: 'luis7nico@gmail.com', name: 'Luis' }],
      subject: tema.titulo,
      htmlContent: html,
      tags: ['newsletter', '60maisnews']
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao enviar email');
  }
  
  return data;
}

/**
 * Executar fluxo completo
 */
async function executar() {
  console.log('📰 Iniciando envio da newsletter...');
  console.log('⏰', new Date().toLocaleString('pt-BR'));
  
  try {
    // Carregar cache
    const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    
    // Selecionar tema
    const tema = selecionarTema();
    console.log('📌 Tema selecionado:', tema.tema);
    console.log('   Título:', tema.titulo);
    
    // Gerar HTML
    const html = gerarHTML(tema, cache.configuracao.imagens);
    
    // Enviar email
    console.log('📧 Enviando email...');
    const resultado = await enviarEmailTransacional(tema, html);
    console.log('✅ Email enviado! Message ID:', resultado.messageId);
    
    // Registrar tema usado
    registrarTemaUsado(tema.tema);
    console.log('📝 Tema registrado no histórico');
    
    // Salvar log
    const log = {
      data: new Date().toISOString(),
      tema: tema.tema,
      titulo: tema.titulo,
      messageId: resultado.messageId,
      sucesso: true
    };
    
    const logFile = path.join(__dirname, 'newsletter-log.json');
    let logs = [];
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    logs.push(log);
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    
    console.log('🎉 Newsletter enviada com sucesso!');
    
    return { sucesso: true, tema: tema.tema, messageId: resultado.messageId };
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    
    // Salvar erro no log
    const logFile = path.join(__dirname, 'newsletter-log.json');
    let logs = [];
    if (fs.existsSync(logFile)) {
      logs = JSON.parse(fs.readFileSync(logFile, 'utf8'));
    }
    logs.push({
      data: new Date().toISOString(),
      erro: error.message,
      sucesso: false
    });
    fs.writeFileSync(logFile, JSON.stringify(logs, null, 2));
    
    return { sucesso: false, erro: error.message };
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  executar();
}

module.exports = { executar, selecionarTema, gerarHTML };
