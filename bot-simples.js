/**
 * 🤖 Bot 60maisPlay - Versão Simples e Confiável
 */

const fs = require('fs');
const { execSync } = require('child_process');

const TOKEN = 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE';
const ADMIN = '5511953545939';
const GRUPO = '120363407488049190@g.us';
const BOT = '5511920990009';

// Estado
const STATE_FILE = '/tmp/bot-state.json';
let state = { processed: [] };
try { state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8')); } catch(e) {}

// Salvar estado
function save() { fs.writeFileSync(STATE_FILE, JSON.stringify(state)); }

// Enviar mensagem
function send(msg, to) {
  const target = to || ADMIN;
  const cmd = `openclaw message send --channel whatsapp --target "${target}" --message '${msg.replace(/'/g, "'\\''")}'`;
  try {
    execSync(cmd, { env: { ...process.env, OPENCLAW_GATEWAY_TOKEN: TOKEN }});
    return true;
  } catch(e) { return false; }
}

// Buscar mensagens recentes
function getMessages() {
  const logDir = '/tmp/openclaw';
  const files = fs.readdirSync(logDir).filter(f => f.endsWith('.log')).sort().reverse();
  if (!files.length) return [];
  
  const content = fs.readFileSync(`${logDir}/${files[0]}`, 'utf8');
  const lines = content.split('\n').slice(-200);
  const msgs = [];
  
  for (const line of lines) {
    // Formato: [WhatsApp +5511953545939 ...] mensagem
    const match = line.match(/\[WhatsApp \+?(\d+)[^\]]*\]\s*(.+)$/);
    if (match) {
      msgs.push({ from: match[1], body: match[2].trim() });
    }
    // Formato JSON
    const json = line.match(/"body":"([^"]+)".*"from":"([^"]+)"/);
    if (json) {
      msgs.push({ from: json[2].replace(/[^0-9]/g, ''), body: json[1] });
    }
  }
  
  return msgs;
}

// Menu
const MENU = `🎓 *60maisPlay*

📚 *CURSOS* - Digite para ver
❓ *DÚVIDA* - Pergunte sobre tecnologia

---
_Professor Luis_`;

const CURSOS = `📚 *CURSOS*

1 - WhatsApp
2 - Compras Online
3 - Inteligência Artificial
4 - Celular
5 - Email
6 - Netflix
7 - Gov.br
8 - Zoom

Digite o número!

---
_Professor Luis_`;

// FAQ
const FAQS = {
  'cadeado': `🔒 *CADEADO DO NAVEGADOR*

O cadeado 🔒 indica site SEGURO!

✅ Seus dados protegidos
⚠️ Sem cadeado = CUIDADO!

---
_Professor Luis_`,
  
  'senha': `🔐 *SENHAS*

⚠️ NUNCA compartilhe senhas!

✅ Use 8+ caracteres
✅ Letras, números, símbolos

---
_Professor Luis_`,
  
  'golpe': `⚠️ *GOLPES*

🚨 Sinais de golpe:
• Pedem código WhatsApp
• Dinheiro fácil
• Pressão rápida

❌ NÃO clique em links suspeitos!

---
_Professor Luis_`,
  
  'pix': `💰 *PIX*

⚠️ Antes de fazer PIX:
• Confirme nome
• Confirme valor

🚨 "PIX errado, devolve" = GOLPE!

---
_Professor Luis_`,
  
  'download': `📥 *DOWNLOAD*

Download = BAIXAR

É trazer algo da internet para seu aparelho.

⚠️ Só baixe de sites confiáveis!

---
_Professor Luis_`
};

// Processar
function process(body) {
  const t = body.toLowerCase().trim();
  
  if (t === 'oi' || t === 'olá' || t === 'ola' || t === 'menu' || t === '1') {
    return MENU;
  }
  
  if (t === 'cursos' || t === '2' || t === 'ver cursos') {
    return CURSOS;
  }
  
  for (const [key, msg] of Object.entries(FAQS)) {
    if (t.includes(key)) return msg;
  }
  
  return null;
}

// Main
function main() {
  console.log('🤖 Bot rodando...\n');
  
  const msgs = getMessages();
  let count = 0;
  
  for (const msg of msgs) {
    if (msg.from.includes(BOT)) continue;
    
    const id = `${msg.from}-${msg.body}`;
    if (state.processed.includes(id)) continue;
    
    state.processed.push(id);
    if (state.processed.length > 100) state.processed = state.processed.slice(-50);
    
    const resp = process(msg.body);
    if (resp) {
      console.log(`📩 ${msg.from}: ${msg.body}`);
      console.log(`   ✅ Respondendo...`);
      send(resp, msg.from.includes('@g.us') ? msg.from : `+${msg.from}`);
      count++;
    }
  }
  
  save();
  console.log(`\n📊 ${count} respostas enviadas`);
}

main();
