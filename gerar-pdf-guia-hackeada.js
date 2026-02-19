const { marked } = require('marked');
const fs = require('fs');
const puppeteer = require('puppeteer');

async function createPDF() {
  const pdfPath = '/root/.openclaw/workspace/guia-emergencia-conta-hackeada.pdf';
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      color: #333;
      line-height: 1.8;
    }
    h1 { 
      color: #e74c3c; 
      border-bottom: 3px solid #e74c3c; 
      padding-bottom: 10px; 
      font-size: 28px;
    }
    h2 { 
      color: #c0392b; 
      border-bottom: 2px solid #c0392b; 
      padding-bottom: 8px; 
      margin-top: 30px; 
      font-size: 22px;
    }
    h3 { 
      color: #d35400; 
      margin-top: 20px;
      font-size: 18px;
    }
    p { margin: 12px 0; }
    ul, ol { margin: 15px 0; padding-left: 25px; }
    li { margin: 8px 0; }
    .alert {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
    }
    .tip {
      background: #d4edda;
      border-left: 4px solid #28a745;
      padding: 15px;
      margin: 20px 0;
    }
    .checklist {
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .checklist li {
      list-style: none;
      margin: 10px 0;
    }
    .checklist li:before {
      content: "□ ";
      font-size: 18px;
    }
    .header {
      text-align: center;
      padding: 30px 0;
      border-bottom: 2px solid #eee;
      margin-bottom: 30px;
    }
    .subtitle {
      color: #666;
      font-size: 18px;
      margin-top: 5px;
    }
    .author {
      color: #888;
      font-style: italic;
      margin-top: 10px;
    }
    hr { border: none; border-top: 1px solid #eee; margin: 30px 0; }
    .footer {
      text-align: center;
      color: #888;
      font-size: 12px;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    .warning-box {
      background: #f8d7da;
      border-left: 4px solid #dc3545;
      padding: 15px;
      margin: 20px 0;
    }
    .step {
      background: #e3f2fd;
      border-left: 4px solid #2196f3;
      padding: 15px;
      margin: 20px 0;
    }
    .step-title {
      font-weight: bold;
      color: #1565c0;
      margin-bottom: 10px;
    }
  </style>
</head>
<body>

<div class="header">
  <h1>🚨 GUIA DE EMERGÊNCIA: CONTA HACKEADA</h1>
  <div class="subtitle">Recupere seu WhatsApp em 5 Passos</div>
  <div class="author">Por 60maisPlay - Fevereiro 2026</div>
</div>

<h2>📋 SUMÁRIO</h2>
<ol>
  <li>Introdução</li>
  <li>O Problema</li>
  <li>Solução Passo a Passo</li>
  <li>Checklist de Prevenção</li>
  <li>Recursos Adicionais</li>
</ol>

<h2>1. INTRODUÇÃO</h2>
<p>Olá! Se você está lendo este guia, provavelmente já passou por ter sua conta clonada ou hackeada, ou conhece alguém que passou por isso.</p>
<p><strong>A boa notícia é que existe solução e ela é mais simples do que parece!</strong></p>
<p>Neste guia prático, você vai aprender:</p>
<ul>
  <li>✅ Como identificar o problema rapidamente</li>
  <li>✅ Os 5 passos para resolver</li>
  <li>✅ Como prevenir que aconteça de novo</li>
</ul>
<p><strong>Tempo estimado de leitura:</strong> 10 minutos<br>
<strong>Tempo para aplicar:</strong> 15 minutos</p>

<h2>2. O PROBLEMA</h2>
<p>O golpe da clonagem de WhatsApp afeta milhares de idosos todos os dias no Brasil. Os criminosos usam engenharia social para conseguir o código de verificação e tomar controle da conta.</p>

<div class="warning-box">
  <h3>⚠️ SINAIS DE ALERTA</h3>
  <p>Fique atento a estes sinais:</p>
  <ul>
    <li>Você recebeu uma mensagem de um amigo pedindo o código que você "recebeu por engano"</li>
    <li>Seus contatos dizem que estão recebendo mensagens suspeitas de você</li>
    <li>Foi desconectado do WhatsApp de repente</li>
    <li>Alguém ligou dizendo ser do "suporte do WhatsApp"</li>
  </ul>
</div>

<h2>3. SOLUÇÃO PASSO A PASSO</h2>

<div class="step">
  <div class="step-title">PASSO 1: NÃO ENTRE EM PÂNICO</div>
  <p><strong>O que fazer:</strong></p>
  <ul>
    <li>Respire fundo</li>
    <li>Lembre-se: existe solução</li>
    <li>Vamos resolver juntos passo a passo</li>
  </ul>
  <div class="tip">
    <strong>💡 Dica do Vovô:</strong><br>
    "Calma é a melhor arma contra o desespero. Um passo de cada vez!"
  </div>
</div>

<div class="step">
  <div class="step-title">PASSO 2: RECUPERE O ACESSO IMEDIATAMENTE</div>
  <p><strong>O que fazer:</strong></p>
  <ul>
    <li>Abra o WhatsApp no seu celular</li>
    <li>Toque em "Verificar" quando pedir o código</li>
    <li>Peça para reenviar o código por SMS</li>
    <li><strong>NUNCA compartilhe este código com ninguém</strong></li>
  </ul>
</div>

<div class="step">
  <div class="step-title">PASSO 3: AVISE SEUS CONTATOS</div>
  <p><strong>O que fazer:</strong></p>
  <ul>
    <li>Envie uma mensagem para seus grupos e contatos importantes</li>
    <li>Explique que sua conta foi clonada</li>
    <li>Peça para ignorarem mensagens suspeitas</li>
    <li>Peça para não clicarem em links</li>
  </ul>
  <div class="alert">
    <strong>📝 Mensagem sugerida:</strong><br>
    "Olá! Minha conta do WhatsApp foi clonada. Por favor, ignore qualquer mensagem estranha que você tenha recebido de mim. Já recuperei minha conta. Obrigado!"
  </div>
</div>

<div class="step">
  <div class="step-title">PASSO 4: ATIVE A VERIFICAÇÃO EM DUAS ETAPAS</div>
  <p><strong>O que fazer:</strong></p>
  <ul>
    <li>Vá em <strong>Configurações → Conta → Verificação em duas etapas</strong></li>
    <li>Ative a opção</li>
    <li>Crie um PIN de 6 dígitos (guarde em lugar seguro!)</li>
    <li>Adicione um email de recuperação</li>
  </ul>
</div>

<div class="step">
  <div class="step-title">PASSO 5: REFORCE A SEGURANÇA</div>
  <p><strong>O que fazer:</strong></p>
  <ul>
    <li>Verifique se seus contatos estão salvos</li>
    <li>Faça backup das conversas importantes</li>
    <li>Configure o WhatsApp Web apenas quando precisar</li>
    <li>Desconecte todos os dispositivos vinculados</li>
  </ul>
  <p><strong>Verificação:</strong></p>
  <ul>
    <li>✅ Recuperei o acesso à conta</li>
    <li>✅ Avisei meus contatos</li>
    <li>✅ Ativei verificação em duas etapas</li>
    <li>✅ Reforcei minha segurança</li>
  </ul>
</div>

<h2>4. CHECKLIST DE PREVENÇÃO</h2>
<p>Imprima esta página e deixe na geladeira ou perto do computador:</p>

<div class="checklist">
  <h3>🛡️ ANTES DE QUALQUER TRANSAÇÃO:</h3>
  <ul>
    <li>Desconfie de mensagens pedindo dinheiro emergencial</li>
    <li>Confirme por ligação de voz ou vídeo antes de transferir</li>
    <li>Nunca clique em links de remetentes desconhecidos</li>
    <li>Desconfie de ofertas muito boas para ser verdade</li>
  </ul>
</div>

<div class="checklist">
  <h3>🔐 CONFIGURAÇÕES DE SEGURANÇA:</h3>
  <ul>
    <li>Verificação em duas etapas: ATIVADA</li>
    <li>Email de recuperação cadastrado</li>
    <li>Backup automático configurado</li>
    <li>PIN de segurança memorizado</li>
  </ul>
</div>

<h2>5. RECURSOS ADICIONAIS</h2>

<div class="tip">
  <h3>🎥 VÍDEO TUTORIAL</h3>
  <p>Assista o passo a passo em vídeo completo:<br>
  <strong>Link:</strong> https://60maisplay.com.br/tutorial-seguranca</p>
</div>

<div class="alert">
  <h3>📞 SUPORTE</h3>
  <p>Dúvidas? Fale conosco:</p>
  <ul>
    <li><strong>WhatsApp:</strong> (11) 95354-5939</li>
    <li><strong>Email:</strong> benjamin@60maiscursos.com.br</li>
    <li><strong>Site:</strong> https://60maisplay.com.br</li>
  </ul>
</div>

<h3>🎓 CURSO COMPLETO</h3>
<p>Quer dominar a tecnologia com segurança?</p>
<p><strong>Conheça nosso curso completo:</strong><br>
"ESCUDO ANTI-GOLPES 60+"</p>

<p><strong>Conteúdo:</strong></p>
<ul>
  <li>10 módulos de segurança digital</li>
  <li>Aulas em vídeo simples</li>
  <li>Material de apoio impresso</li>
  <li>Grupo VIP de alunos</li>
  <li>Suporte por 6 meses</li>
</ul>

<p><strong>Investimento:</strong> R$ 47,00<br>
<strong>Garantia:</strong> 7 dias de garantia incondicional</p>

<p>Para se inscrever, acesse:<br>
https://60maisplay.com.br/escudo-anti-golpes</p>

<hr>

<h2>SOBRE O 60maisPlay</h2>
<p>Somos a plataforma de tecnologia para idosos 60+. Nossa missão é tornar a tecnologia acessível, segura e descomplicada para você.</p>
<p><strong>Já ajudamos mais de 500 idosos</strong> a usarem tecnologia com confiança e segurança.</p>

<p><strong>Nossos valores:</strong></p>
<ul>
  <li>Linguagem simples, sem termos técnicos</li>
  <li>Respeito ao seu ritmo de aprendizado</li>
  <li>Suporte humano e paciente</li>
  <li>Conteúdo atualizado constantemente</li>
</ul>

<div class="footer">
  <p>© 2026 60maisPlay. Todos os direitos reservados.</p>
  <p>Este material é gratuito. Sinta-se à vontade para compartilhar com amigos e familiares.</p>
  <p>Versão 1.0 - Fevereiro 2026</p>
</div>

</body>
</html>
  `;

  // Salvar HTML temporário
  const htmlPath = '/tmp/guia-hackeada.html';
  fs.writeFileSync(htmlPath, html);
  
  // Usar Puppeteer para gerar PDF
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    printBackground: true
  });
  
  await browser.close();
  
  console.log('✅ PDF criado:', pdfPath);
}

createPDF().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
