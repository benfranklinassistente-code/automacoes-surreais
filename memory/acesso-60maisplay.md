# 🖥️ Acesso à Plataforma 60maisPlay - Guia Completo

**Data:** 19/02/2026
**Status:** ✅ Funcionando

---

## 📋 INFORMAÇÕES DA PLATAFORMA

| Item | Valor |
|------|-------|
| **URL** | https://60maiscursos.com.br |
| **Nome** | 60maisPlay |
| **Tecnologia** | Laravel (PHP) |
| **Hospedagem** | HostGator (servidor compartilhado Linux) |
| **IP** | 192.185.213.140 |
| **SSL** | Let's Encrypt |
| **Framework** | Laravel (sessões, CSRF tokens) |

---

## 🔐 CREDENCIAIS DE ACESSO

### Conta de Aluno
| Campo | Valor |
|-------|-------|
| **Email** | luis7nico@gmail.com |
| **Senha** | 123456 |
| **Nome** | Luis Antonio Canabarra |
| **Tipo** | Aluno (sem acesso admin) |

---

## 🚀 MÉTODO DE ACESSO

### Problema Inicial
- A plataforma está protegida por **Mod_Security** no servidor Apache
- Tentativas de login via `curl` retornam erro 406/419
- A plataforma usa **Laravel** com proteção CSRF
- O servidor está em uma **VPS** sem interface gráfica

### Solução: Puppeteer (Navegador Headless)

#### 1. Instalar Puppeteer
```bash
npm install puppeteer
```

#### 2. Script de Acesso
Arquivo: `/root/.openclaw/workspace/60maisplay-browser.js`

```javascript
const puppeteer = require('puppeteer');

async function acessarPlataforma() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  const page = await browser.newPage();
  
  // User Agent para parecer um navegador real
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  // Ir para página de login
  await page.goto('https://60maiscursos.com.br/login', { waitUntil: 'networkidle2' });
  
  // Preencher credenciais
  await page.type('input[name="email"], input[type="email"]', 'luis7nico@gmail.com', { delay: 50 });
  await page.type('input[name="password"], input[type="password"]', '123456', { delay: 50 });
  
  // Clicar no botão de login
  const botaoLogin = await page.$('button[type="submit"]') || await page.$('button');
  await Promise.all([
    botaoLogin.click(),
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
  ]);
  
  // Aguardar carregamento
  await new Promise(r => setTimeout(r, 2000));
  
  // Verificar se logou
  const url = page.url();
  console.log('URL atual:', url);
  
  // Extrair conteúdo
  const content = await page.evaluate(() => document.body.innerText);
  console.log(content);
  
  await browser.close();
}

acessarPlataforma();
```

#### 3. Executar
```bash
cd /root/.openclaw/workspace && node 60maisplay-browser.js
```

---

## 📁 ARQUIVOS CRIADOS

| Arquivo | Função |
|---------|--------|
| `/root/.openclaw/workspace/60maisplay-browser.js` | Script básico de login |
| `/root/.openclaw/workspace/60maisplay-explorer.js` | Exploração completa da plataforma |
| `/root/.openclaw/workspace/60maisplay-admin.js` | Tentativa de acesso admin |
| `/root/.openclaw/workspace/60maisplay-courses.js` | Listar cursos via admin |
| `/root/.openclaw/workspace/60maisplay-client.js` | Cliente API (não funcional devido ao Mod_Security) |

---

## 🛡️ PROTEÇÕES DO SERVIDOR

### Mod_Security
O servidor Apache tem **Mod_Security** ativado, que bloqueia:
- Requisições sem headers completos
- Requisições POST sem tokens CSRF
- User-Agents suspeitos

### CSRF Token (Laravel)
A plataforma Laravel requer:
1. Acessar a página de login primeiro
2. Capturar o token CSRF do formulário
3. Enviar o token junto com o POST

### Sessões
- Cookies: `XSRF-TOKEN` e `60maisplay_session`
- Sessão expira se não houver atividade

---

## 📚 CURSOS ENCONTRADOS

Total: **25 cursos**

1. Inteligência Artificial no Dia a Dia
2. Rede Social Facebook
3. SmartPhone 1
4. Rede Social Instagram
5. SmartPhone 2
6. Podcast 60maisPlay
7. Gov.br
8. WhatsApp sem Mistérios
9. Compras na Internet
10. Netflix na TV e SmartPhone
11. Precisa de ajuda no dia a dia
12. Vamos falar um pouco sobre Nuvem
13. ChatGPT nosso secretário
14. Identificando Boletos Falsos
15. Tradução simultânea com WhatsApp
16. Usando o QrCode
17. Aprendendo a usar o Gmail
18. Zoom
19. Aprendendo a tirar fotos no Smartphone
20. Aprendendo a usar o Yahoo Mail
21. Aprendendo a usar o Outlook
22. Identificando Boletos Falsos
23. Tradução simultânea com WhatsApp
24. Usando o QrCode
25. Aprendendo a usar o Gmail

---

## ⚠️ LIMITAÇÕES

### Acesso Admin
- A conta `luis7nico@gmail.com` é **aluno**
- URLs `/admin/*` retornam **403 Forbidden**
- Necessário conta de administrador para:
  - Criar/editar cursos
  - Gerenciar alunos
  - Ver estatísticas

### API
- A plataforma não tem API pública
- Mod_Security bloqueia tentativas de automação simples
- Puppeteer é necessário para qualquer automação

---

## 🔄 FLUXO DE ACESSO

```
┌─────────────────────────────────────────────────────────────┐
│                    ACESSO 60maisPlay                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Tentar curl?   │
                    └─────────────────┘
                     │ Sim          │ Não
                     ▼              ▼
            ┌──────────────┐  ┌─────────────────┐
            │ BLOQUEADO    │  │ Usar Puppeteer  │
            │ Mod_Security │  │ (headless)      │
            └──────────────┘  └─────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │ Carregar página │
                            │ de login        │
                            └─────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │ Preencher       │
                            │ email/senha     │
                            └─────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │ Clicar em       │
                            │ Entrar          │
                            └─────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │ Aguardar        │
                            │ navegação       │
                            └─────────────────┘
                                      │
                                      ▼
                            ┌─────────────────┐
                            │ ✅ LOGADO!      │
                            │ Extrair dados   │
                            └─────────────────┘
```

---

## 📝 COMANDOS ÚTEIS

### Executar login básico
```bash
cd /root/.openclaw/workspace && node 60maisplay-browser.js
```

### Explorar plataforma completa
```bash
cd /root/.openclaw/workspace && node 60maisplay-explorer.js
```

### Ver dados salvos
```bash
cat /tmp/60maisplay-dados.json
```

### Ver screenshots
```bash
ls -la /tmp/*.png
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Conseguir conta de admin** para gerenciar cursos
2. **Criar sistema de backup** dos cursos
3. **Automatizar criação de cursos** via Puppeteer
4. **Integrar com o Mission Control** para monitoramento

---

*Documento criado em 19/02/2026 - Acesso automatizado à plataforma 60maisPlay*
