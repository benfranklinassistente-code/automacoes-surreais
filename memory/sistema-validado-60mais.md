# 🤖 SISTEMA 60maisNews - ESTRUTURA VALIDADA
## Newsletter Autônoma com Agentes Especializados

---

## ✅ STATUS: VALIDADO E FUNCIONANDO

**Último teste:** 17/02/2026 às 04:13
**Resultado:** ✅ Sucesso total

---

## 📁 ESTRUTURA DE ARQUIVOS

```
/root/.openclaw/workspace/
│
├── 🤖 agente-chefe-60mais.js      # ORQUESTRADOR PRINCIPAL
│
├── 📦 MÓDULOS
│   ├── brevo.js                    # API de email
│   ├── wordpress.js                # API do blog
│   ├── trello.js                   # API de gestão
│   ├── produtos-60mais.js          # Funil de vendas R$37
│   ├── newsletter-template.js      # Template HTML/WordPress
│   └── google-trends.js            # API de tendências
│
├── ⚙️ CONFIGURAÇÕES
│   ├── credenciais-60mais.json     # Todas as credenciais
│   ├── brevo-config.json           # API Brevo
│   ├── wordpress-config.json       # API WordPress
│   ├── trello-config.json          # API Trello
│   ├── agente-ganchos-config.json  # Config Ganchos
│   └── calendario-comercial-60mais-2026.json
│
├── 📚 MEMÓRIA
│   ├── 60maisNews-newsletter.md    # Documentação geral
│   ├── copywriting-vendas.md       # 6 livros de copy
│   ├── agente-ganchos.md           # Doc do agente
│   ├── funil-vendas-60mais.md      # Escada de valor
│   └── fluxo-newsletter.md         # Fluxo completo
│
└── 🎨 ASSETS
    └── 60maisnews-logo.png         # Logo padrão
```

---

## 🤖 AGENTE CHEFE (ORQUESTRADOR)

**Arquivo:** `agente-chefe-60mais.js`

### Funções:
- Coordena todos os sub-agentes
- Valida qualidade (score ≥ 7)
- Trata erros e tenta novamente
- Gera relatório final

### Execução:
```bash
node agente-chefe-60mais.js
```

---

## 📋 SUB-AGENTES

### 1. 📅 GANCHOS
**Responsabilidade:** Identificar tema relevante

| Fonte | Peso | Função |
|-------|------|--------|
| Google Trends | 50% | Temas em alta |
| Google Analytics | 35% | O que o público busca |
| Sazonalidade | 15% | Datas especiais |

**Output:**
- Tema do dia
- Título SEO
- Palavras-chave
- Nível de urgência

---

### 2. ✍️ WRITER
**Responsabilidade:** Criar conteúdo S.L.P.C.

**Estrutura:**
```
Reflexão → Story → Lesson → Pivot → Dicas → CTA
```

**Validação:** Score ≥ 7 para prosseguir

---

### 3. 💰 VENDAS
**Responsabilidade:** Criar CTA conectado ao tema

**Mapeamento Tema → Produto:**

| Tema | Produto | Conexão |
|------|---------|---------|
| Golpe/Segurança/Senha | Mini Segurança Digital | "Proteja seu dinheiro!" |
| Videochamada/Netos | Mini Videochamadas | "Veja seus netos!" |
| WhatsApp | Mini WhatsApp | "Domine o WhatsApp!" |
| Fotos/Álbum | Mini Google Fotos | "Guarde memórias!" |
| Aplicativos | Mini Apps Essenciais | "Facilite seu dia!" |

**Preço:** R$37,00 (entrada no funil)

---

### 4. 📧 ENVIO
**Responsabilidade:** Enviar email via Brevo

**Configuração:**
- Lista: Assinantes 60maisNews
- Remetente: benjamin@60maiscursos.com.br
- Horário: 06:06 (automático)

---

### 5. 📝 BLOG
**Responsabilidade:** Publicar no WordPress + Trello

**WordPress:**
- Post com logo no topo
- Categoria relevante
- SEO otimizado

**Trello:**
- Cartão na lista "60maisNews"
- Conteúdo completo na descrição
- Data de publicação

---

### 6. 📊 MÉTRICAS
**Responsabilidade:** Coletar métricas após 7 dias

**Métricas:**
- Taxa de abertura (Brevo)
- Cliques no CTA (Brevo)
- Visualizações no blog (Analytics)
- Conversões

**Ação:** Atualizar cartão Trello

---

## 🔄 FLUXO AUTOMATIZADO

```
05:00 ───► Agente Chefe inicia
    │
    ├──► 1. GANCHOS seleciona tema
    │
    ├──► 2. WRITER cria conteúdo S.L.P.C.
    │
    ├──► 3. VENDAS cria CTA conectado
    │
    ├──► 4. ENVIO dispara email (Brevo)
    │
    ├──► 5. BLOG publica (WordPress + Trello)
    │
    └──► Relatório de sucesso
    │
06:06 ───► Email chega nos assinantes
    │
+7 dias ─► MÉTRICAS atualiza Trello
```

---

## 🔗 INTEGRAÇÕES ATIVAS

| Serviço | Status | Função |
|---------|--------|--------|
| **Brevo** | ✅ Ativo | Envio de email |
| **WordPress** | ✅ Ativo | Publicação no blog |
| **Trello** | ✅ Ativo | Gestão e métricas |
| **Google Trends** | 🔄 Simulado | Temas em alta |
| **Google Analytics** | 📋 Pendente | Métricas do blog |

---

## 💰 FUNIL DE VENDAS

### Degrau 1: R$37 (Entrada)
- Mini Cursos temáticos
- 1 hora de duração
- Acesso imediato via WhatsApp

### Degrau 2: R$197
- Curso Completo
- 8 módulos

### Degrau 3: R$497
- Mentoria 1:1

### Degrau 4: R$37/mês
- Clube VIP

---

## 📊 RESULTADOS DO TESTE

### Newsletter Criada:
- **Tema:** Golpe do PIX
- **Produto:** Mini Segurança Digital
- **Conexão:** "Proteja seu dinheiro e evite golpes!"

### Enviados:
| Canal | Status | Link |
|-------|--------|------|
| Email | ✅ | luis7nico@gmail.com |
| Blog | ✅ | https://60maiscursos.com.br/blog/?p=56 |
| Trello | ✅ | https://trello.com/c/9QS7UaBy |

---

## ⏰ PRÓXIMO PASSO: AUTOMAÇÃO CRON

Configurar execução diária às 05:00 via cron do Gateway.

---

*Sistema 60maisNews v1.0 - Validado e Funcionando*
*Última atualização: 17/02/2026*
