/**
 * Script temporário para enviar documento por email
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Configurações
const CONFIG = {
  user: 'benjamin@60maiscursos.com.br',
  password: 'Ch@vedeacesso64',
  smtp: {
    host: 'smtp.titan.email',
    port: 465,
    secure: true
  }
};

async function enviarDocumento() {
  // Lê o documento HTML
  const htmlPath = path.join(__dirname, '60maisNews-documento-completo.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf-8');
  
  // Lê o documento Markdown
  const mdPath = path.join(__dirname, '60maisNews-documento-completo.md');
  const mdContent = fs.readFileSync(mdPath, 'utf-8');
  
  const transporter = nodemailer.createTransport({
    host: CONFIG.smtp.host,
    port: CONFIG.smtp.port,
    secure: CONFIG.smtp.secure,
    auth: {
      user: CONFIG.user,
      pass: CONFIG.password
    }
  });
  
  const info = await transporter.sendMail({
    from: `"Ben - Assistente" <${CONFIG.user}>`,
    to: 'luis7nico@gmail.com',
    subject: '📰 60maisNews - Documento Completo da Redação Autônoma',
    html: htmlContent,
    attachments: [
      {
        filename: '60maisNews-documento-completo.html',
        content: htmlContent,
        contentType: 'text/html'
      },
      {
        filename: '60maisNews-documento-completo.md',
        content: mdContent,
        contentType: 'text/markdown'
      }
    ]
  });
  
  console.log('✅ Email enviado com sucesso!');
  console.log('   MessageId:', info.messageId);
  return info;
}

enviarDocumento()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Erro:', err);
    process.exit(1);
  });
