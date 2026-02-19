/**
 * 📧 Módulo de Email - Ben Assistant
 * IMAP + SMTP para Hostgator Titan
 */

const Imap = require('imap');
const { simpleParser } = require('mailparser');
const nodemailer = require('nodemailer');

// Configurações Titan
const CONFIG = {
  user: 'benjamin@60maiscursos.com.br',
  password: 'Ch@vedeacesso64',
  imap: {
    host: 'imap.titan.email',
    port: 993,
    tls: true
  },
  smtp: {
    host: 'smtp.titan.email',
    port: 465,
    secure: true
  }
};

// ============ LER EMAILS (IMAP) ============

async function lerEmails(limite = 10, pasta = 'INBOX') {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: CONFIG.user,
      password: CONFIG.password,
      host: CONFIG.imap.host,
      port: CONFIG.imap.port,
      tls: CONFIG.imap.tls
    });
    
    const emails = [];
    
    imap.once('ready', () => {
      imap.openBox(pasta, false, (err, box) => {
        if (err) return reject(err);
        
        console.log(`📬 Caixa: ${pasta}`);
        console.log(`   Total: ${box.messages.total} emails`);
        
        if (box.messages.total === 0) {
          imap.end();
          resolve([]);
          return;
        }
        
        const fetch = imap.seq.fetch(`${Math.max(1, box.messages.total - limite + 1)}:*`, {
          bodies: '',
          struct: true
        });
        
        fetch.on('message', (msg) => {
          msg.on('body', (stream) => {
            simpleParser(stream, (err, parsed) => {
              if (!err && parsed) {
                emails.push({
                  de: parsed.from?.text || '',
                  para: parsed.to?.text || '',
                  assunto: parsed.subject || '(sem assunto)',
                  data: parsed.date?.toLocaleString('pt-BR') || '',
                  texto: parsed.text?.substring(0, 500) || '',
                  html: parsed.html || '',
                  lido: !parsed.headers?.get('x-unread')
                });
              }
            });
          });
        });
        
        fetch.once('end', () => {
          imap.end();
        });
      });
    });
    
    imap.once('error', reject);
    imap.once('end', () => resolve(emails.reverse()));
    imap.connect();
  });
}

// ============ ENVIAR EMAIL (SMTP) ============

async function enviarEmail(para, assunto, texto, html = null) {
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
    to: para,
    subject: assunto,
    text: texto,
    html: html || texto
  });
  
  console.log('✅ Email enviado:', info.messageId);
  return info;
}

// ============ BUSCAR NÃO LIDOS ============

async function buscarNaoLidos() {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: CONFIG.user,
      password: CONFIG.password,
      host: CONFIG.imap.host,
      port: CONFIG.imap.port,
      tls: CONFIG.imap.tls
    });
    
    const emails = [];
    
    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) return reject(err);
        
        imap.search(['UNSEEN'], (err, results) => {
          if (err || !results.length) {
            imap.end();
            resolve([]);
            return;
          }
          
          const fetch = imap.fetch(results, { bodies: '' });
          
          fetch.on('message', (msg) => {
            msg.on('body', (stream) => {
              simpleParser(stream, (err, parsed) => {
                if (!err && parsed) {
                  emails.push({
                    de: parsed.from?.text || '',
                    assunto: parsed.subject || '(sem assunto)',
                    data: parsed.date?.toLocaleString('pt-BR') || '',
                    resumo: parsed.text?.substring(0, 200) || ''
                  });
                }
              });
            });
          });
          
          fetch.once('end', () => imap.end());
        });
      });
    });
    
    imap.once('error', reject);
    imap.once('end', () => resolve(emails));
    imap.connect();
  });
}

// ============ ESTATÍSTICAS ============

async function estatisticas() {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: CONFIG.user,
      password: CONFIG.password,
      host: CONFIG.imap.host,
      port: CONFIG.imap.port,
      tls: CONFIG.imap.tls
    });
    
    imap.once('ready', () => {
      imap.openBox('INBOX', false, (err, box) => {
        if (err) return reject(err);
        
        imap.search(['UNSEEN'], (err, unread) => {
          resolve({
            total: box.messages.total,
            naoLidos: unread?.length || 0,
            email: CONFIG.user
          });
          imap.end();
        });
      });
    });
    
    imap.once('error', reject);
    imap.connect();
  });
}

// ============ EXPORT ============

module.exports = {
  lerEmails,
  enviarEmail,
  buscarNaoLidos,
  estatisticas,
  CONFIG
};
