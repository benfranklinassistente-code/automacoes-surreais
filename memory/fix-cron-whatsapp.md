# Fix Cron Job WhatsApp - 24/02/2026

## 📋 Problema Identificado

O cron job `enviar-dica-whatsapp.js` que roda às 08:00 todos os dias estava falhando com erro **HTTP 405: Method Not Allowed**.

### Sintomas

```
{"data":"2026-02-24T14:39:00.358Z","erro":"HTTP 405: Method Not Allowed","sucesso":false}
{"data":"2026-02-24T14:43:19.484Z","erro":"HTTP 405: Method Not Allowed","sucesso":false}
```

---

## 🔍 Diagnóstico

### 1. Verificar se os arquivos existiam

```bash
ls -la /root/.openclaw/workspace/enviar-dica-whatsapp.js
# -rw-r--r-- 1 root root 4323 Feb 23 19:11 enviar-dica-whatsapp.js ✅
```

### 2. Verificar logs de erro

```bash
cat /tmp/dicas-whatsapp.log
# Mostrava erros HTTP 405 recorrentes
```

### 3. Testar API manualmente

```bash
curl -X POST http://127.0.0.1:18789/api/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"action":"send","channel":"whatsapp","target":"120363375518105627@g.us","message":"Teste"}'
# Resposta: Method Not Allowed
```

### 4. Descobrir método correto

Testei usar a CLI do OpenClaw diretamente:

```bash
openclaw message send --channel whatsapp --target "120363375518105627@g.us" --message "Teste" --json
# Funcionou! ✅
```

---

## 💡 Causa Raiz

O script original usava requisição HTTP direta para o endpoint `/api/message` do gateway, mas esse endpoint **não é suportado** (retorna 405).

O gateway OpenClaw espera que mensagens sejam enviadas via:
- CLI: `openclaw message send`
- Tool interna: `message` tool (usada por agentes)

---

## ✅ Solução

### Código Antigo (com problema)

```javascript
// ❌ NÃO FUNCIONA - Endpoint não suportado
const options = {
  hostname: GATEWAY_HOST,
  port: GATEWAY_PORT,
  path: '/api/message',  // ← Este endpoint não existe!
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GATEWAY_TOKEN}`,
  }
};

const req = http.request(options, ...);
```

### Código Corrigido

```javascript
// ✅ FUNCIONA - Usando CLI do OpenClaw
const { execSync } = require('child_process');

const resultado = execSync(
  `openclaw message send --channel whatsapp --target "${GRUPO_ID}" --message "${mensagem}" --json`,
  { encoding: 'utf-8', timeout: 30000 }
);
```

---

## 📁 Arquivo Corrigido

**Caminho:** `/root/.openclaw/workspace/enviar-dica-whatsapp.js`

### Código Completo

```javascript
/**
 * Enviar Dica Diária para Grupo WhatsApp
 * Grupo: Curso Smartphone Inteligência Artificial 60+
 * Usa CLI do OpenClaw Gateway
 */

const { execSync } = require('child_process');
const fs = require('fs');

const GRUPO_ID = '120363375518105627@g.us'; // Grupo: Curso Smartphone Inteligência Artificial 60+
const LOG_FILE = '/tmp/dicas-whatsapp.log';

// Banco de dicas rotativas
const DICAS = [
  { titulo: "🔒 Proteção de Senha", texto: "Nunca use a mesma senha em todos os sites. Crie senhas com pelo menos 8 caracteres, misturando letras, números e símbolos." },
  { titulo: "📱 Celular Lento?", texto: "Reinicie seu celular pelo menos uma vez por semana. Isso limpa a memória e melhora o desempenho!" },
  { titulo: "⚠️ Cuidado com Links", texto: "Nunca clique em links suspeitos recebidos por WhatsApp ou email. Se parece bom demais para ser verdade, provavelmente é golpe!" },
  { titulo: "📸 Backup de Fotos", texto: "Ative o backup automático no Google Fotos. Suas memórias ficam seguras mesmo se você perder o celular!" },
  { titulo: "🔋 Bateria Durando Menos?", texto: "Diminua o brilho da tela e feche apps que não está usando. Isso economiza bastante bateria!" },
  { titulo: "📶 Internet Lenta?", texto: "Reinicie seu roteador tirando da tomada por 30 segundos. Isso resolve muitos problemas de conexão!" },
  { titulo: "📧 Email Suspeito?", texto: "Bancos NUNCA pedem senha por email. Se receber um email do banco pedindo dados, é golpe!" },
  { titulo: "🔐 Verificação em 2 Etapas", texto: "Ative a verificação em 2 etapas no WhatsApp. É uma camada extra de segurança para sua conta!" },
  { titulo: "🗂️ Organize seus Apps", texto: "Agrupe apps por categoria em pastas. Segure o ícone e arraste sobre outro para criar uma pasta!" },
  { titulo: "💬 Mensagens Sumindo?", texto: "Verifique se você não ativou 'Mensagens temporárias' na conversa. Elas somem após 24h ou 7 dias!" }
];

function selecionarDica() {
  const hoje = new Date();
  const diaDoAno = Math.floor((hoje - new Date(hoje.getFullYear(), 0, 0)) / 86400000);
  return DICAS[diaDoAno % DICAS.length];
}

function log(data) {
  fs.appendFileSync(LOG_FILE, JSON.stringify(data) + '\n');
}

async function main() {
  console.log('📱 Enviando dica diária para o grupo WhatsApp...');
  console.log('⏰', new Date().toLocaleString('pt-BR'));
  
  const dica = selecionarDica();
  console.log('📌 Dica:', dica.titulo);
  
  const mensagem = `☀️ *${dica.titulo}*\n\n${dica.texto}\n\n_Dica do dia 60maisPlay_`;
  
  try {
    // Usar CLI do OpenClaw para enviar mensagem
    const resultado = execSync(
      `openclaw message send --channel whatsapp --target "${GRUPO_ID}" --message "${mensagem.replace(/"/g, '\\"').replace(/\n/g, '\\n')}" --json`,
      { encoding: 'utf-8', timeout: 30000 }
    );
    
    console.log('✅ Dica enviada com sucesso!');
    console.log(resultado);
    
    log({
      data: new Date().toISOString(),
      tema: dica.titulo,
      sucesso: true
    });
    
  } catch (erro) {
    console.error('❌ Erro ao enviar:', erro.message);
    
    log({
      data: new Date().toISOString(),
      erro: erro.message,
      sucesso: false
    });
    
    process.exit(1);
  }
}

main();
```

---

## 🧪 Teste Realizado

```bash
cd /root/.openclaw/workspace && node enviar-dica-whatsapp.js

# Saída:
# 📱 Enviando dica diária para o grupo WhatsApp...
# ⏰ 24/02/2026, 15:02:50
# 📌 Dica: 📶 Internet Lenta?
# ✅ Dica enviada com sucesso!
```

### Log de Sucesso

```bash
tail /tmp/dicas-whatsapp.log
# {"data":"2026-02-24T17:57:10.914Z","tema":"📶 Internet Lenta?","sucesso":true}
# {"data":"2026-02-24T18:02:53.924Z","tema":"📶 Internet Lenta?","sucesso":true}
```

---

## 📌 Cron Job

O script é executado automaticamente via crontab:

```bash
crontab -l | grep dica
# 0 8 * * * cd /root/.openclaw/workspace && /usr/bin/node enviar-dica-whatsapp.js >> /tmp/dica-whatsapp.log 2>&1
```

**Horário:** 08:00 todos os dias
**Grupo:** 120363375518105627@g.us (Curso Smartphone Inteligência Artificial 60+)

---

## 📚 Lições Aprendidas

1. **Sempre usar a CLI do OpenClaw** (`openclaw message send`) para enviar mensagens via gateway
2. O endpoint HTTP `/api/message` não é suportado diretamente
3. Verificar logs em `/tmp/dicas-whatsapp.log` para diagnóstico
4. A CLI retorna JSON com `--json` para parsing fácil

---

## 🔗 Comandos Úteis

```bash
# Testar envio manual
openclaw message send --channel whatsapp --target "120363375518105627@g.us" --message "Teste" --json

# Ver logs
cat /tmp/dicas-whatsapp.log

# Executar script manualmente
cd /root/.openclaw/workspace && node enviar-dica-whatsapp.js

# Verificar cron
crontab -l
```

---

**Data da correção:** 24/02/2026
**Responsável:** Benjamin (agente)
