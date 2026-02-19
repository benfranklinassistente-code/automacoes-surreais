# 🤖 ESCOPO COMPLETO DOS AGENTES - 60maisNews
## Sistema de Newsletter Autônoma

---

## 📐 ARQUITETURA GERAL

```
┌─────────────────────────────────────────────────────────────────┐
│                    🤖 AGENTE CHEFE                               │
│                   (orquestrador principal)                       │
│                                                                  │
│  Executa às 05:00 e coordena todos os sub-agentes               │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ 📅 GANCHOS    │     │ ✍️ WRITER     │     │ 💰 VENDAS     │
│               │     │               │     │               │
│ Google Trends │────►│ OpenClaw API  │────►│ CTA R$37      │
│ Analytics     │     │ Conteúdo      │     │ Tema→Produto  │
│ DINÂMICO      │     │ DINÂMICO      │     │               │
└───────────────┘     └───────────────┘     └───────────────┘
                                                  │
        ┌─────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                         ENVIO E PUBLICAÇÃO                       │
│                                                                  │
│  📧 Brevo ────► Email para assinantes                           │
│  📝 WordPress ─► Post no blog                                   │
│  📋 Trello ────► Cartão para gestão                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🤖 1. AGENTE CHEFE (ORQUESTRADOR)

### Arquivo
`agente-chefe-60mais.js`

### O que faz
Coordena todos os sub-agentes em sequência, garantindo qualidade e tratando erros.

### Como faz

```javascript
async function agenteChefe() {
  // 1. GANCHOS - Seleciona tema
  const temaInfo = await subAgenteGanchos();
  
  // 2. WRITER - Gera conteúdo DINÂMICO
  const conteudo = await subAgenteWriter(temaInfo);
  
  // 3. VENDAS - Cria CTA
  const ctaInfo = await subAgenteVendas(temaInfo, conteudo);
  
  // 4. ENVIO - Dispara email
  const envioResult = await subAgenteEnvio(conteudo, ctaInfo);
  
  // 5. BLOG - Publica WordPress + Trello
  const blogResult = await subAgenteBlog(conteudo, ctaInfo);
  
  // 6. Relatório final
  return { sucesso: true, ... };
}
```

### Validações
- Score do conteúdo ≥ 7 (se menor, solicita reescrita)
- Retry automático em caso de erro (máx 3 tentativas)
- Log completo de cada etapa

### Execução
- **Manual:** `node agente-chefe-60mais.js`
- **Automática:** CRON às 05:00 UTC

---

## 📅 2. SUB-AGENTE GANCHOS

### Arquivo
`agente-chefe-60mais.js` → função `subAgenteGanchos()`

### O que faz
Identifica o tema mais relevante do dia usando dados REAIS de múltiplas fontes.

### Como faz

#### Fontes de dados (com pesos):
| Fonte | Peso | O que busca |
|-------|------|-------------|
| Google Trends | 50% | Termos em alta no Brasil |
| Google Analytics | 35% | Páginas mais visualizadas |
| Calendário Comercial | 15% | Eventos sazonais |

#### Processo:

```
1. BUSCAR DADOS
   ├── Google Trends API → termos em alta
   ├── Google Analytics API → posts populares
   └── Calendário → eventos do dia

2. MAPEAR TERMOS
   └── Normaliza termos para temas padrão:
       • "whatsapp" → "WhatsApp segurança"
       • "golpe", "pix" → "golpe PIX"
       • "videochamada", "netos" → "videochamada"
       • etc.

3. CALCULAR SCORE
   └── Soma ponderada de todas as fontes

4. SELECIONAR TEMA
   └── Maior score = tema do dia

5. GERAR TÍTULO SEO
   └── Título otimizado para o tema
```

#### Output:
```javascript
{
  data: "terça-feira, 17 de fevereiro",
  tema: "golpe PIX",
  titulo: "Golpe do PIX: 5 Dicas Simples para Se Proteger Hoje",
  urgencia: 9,
  fonte: "Google Trends + Analytics",
  dadosColetados: {
    trends: [...],
    analytics: [...],
    eventoCalendario: null
  }
}
```

### Dependências
- `google-trends.js` - API do Google Trends
- `google-analytics.js` - API do Google Analytics
- `calendario-comercial-60mais-2026.json` - Eventos sazonais

---

## ✍️ 3. SUB-AGENTE WRITER (DINÂMICO)

### Arquivo
`agente-writer-dinamico.js`

### O que faz
Gera conteúdo COMPLETO e DINÂMICO usando OpenClaw API (IA).

### Como faz

#### Estrutura do prompt para IA:
```
Você é o Professor Luis do canal 60maisPlay...
Tema: {tema dinâmico}
Título: {título dinâmico}

Crie uma newsletter com:
1. REFLEXÃO DO DIA (frase inspiradora)
2. STORY (história emocional, 150-200 palavras)
3. LESSON (lição, 30-50 palavras)
4. TUTORIAL COMPLETO:
   - Título
   - Introdução
   - 5 PASSOS detalhados:
     * Título
     * Explicação
     * Ação concreta
     * Exemplo prático
   - Checklist
5. O QUE MAIS APRENDER (bridge para produto)
6. DICA DE SEGURANÇA
```

#### Processo:

```
1. RECEBER TEMA
   └── Tema dinâmico do GANCHOS

2. CHAMAR OPENCLAW API
   ├── Monta prompt estruturado
   ├── Envia para sessions_spawn
   └── Recebe JSON com conteúdo

3. VALIDAR CONTEÚDO
   ├── Score ≥ 7
   └── Todos os campos preenchidos

4. FORMATAR OUTPUT
   ├── HTML para email
   └── HTML para WordPress

5. FALLBACK (se API falhar)
   └── Usa template básico
```

#### Output:
```javascript
{
  titulo: "🚨 Golpe do PIX...",
  reflexao: "🌟 Frase inspiradora...",
  story: "História emocional...",
  lesson: "Lição aprendida...",
  tutorial: {
    titulo: "🛡️ TUTORIAL COMPLETO...",
    introducao: "...",
    passos: [
      { numero: 1, titulo: "...", explicacao: "...", acao: "...", exemplo: "..." },
      // ... 5 passos
    ],
    checklist: "☐ Item 1\n☐ Item 2..."
  },
  oQueMaisAprender: "Bridge para produto...",
  seguranca: "Dica de segurança...",
  score: 8.5,
  dinamico: true,
  htmlConteudo: "<html>...</html>",
  wordpressConteudo: "<!-- wp:... -->"
}
```

### Dependências
- OpenClaw API (`sessions_spawn`)
- Prompt estruturado para IA

---

## 💰 4. SUB-AGENTE VENDAS

### Arquivo
`agente-chefe-60mais.js` → função `subAgenteVendas()`

### O que faz
Cria CTA (Call-to-Action) conectando o tema ao produto relevante.

### Como faz

#### Mapeamento Tema → Produto:
| Tema | Produto | Preço | Conexão |
|------|---------|-------|---------|
| golpe PIX / senha / segurança | Mini Segurança Digital | R$37 | "Proteja seu dinheiro!" |
| videochamada / netos | Mini Videochamadas | R$37 | "Veja seus netos!" |
| WhatsApp | Mini WhatsApp | R$37 | "Domine o WhatsApp!" |
| fotos / álbum | Mini Google Fotos | R$37 | "Guarde memórias!" |
| aplicativos | Mini Apps Essenciais | R$37 | "Facilite seu dia!" |

#### Processo:

```
1. RECEBER TEMA
   └── Tema do GANCHOS

2. MAPEAR PRODUTO
   └── Seleciona produto baseado no tema

3. CRIAR CTA
   ├── Headline atrativa
   ├── 3-4 benefícios
   ├── Prova social
   ├── Preço
   └── Link WhatsApp

4. VERIFICAR CALENDÁRIO
   └── Se evento especial, adiciona desconto

5. GERAR HTML
   ├── Versão para email
   └── Versão para WordPress
```

#### Output:
```javascript
{
  cta: {
    titulo: "🎓 Mini Segurança Digital",
    headline: "Proteja seu dinheiro!",
    beneficios: ["Aprenda a identificar golpes", "Crie senhas seguras", "..."],
    preco: "R$ 37,00",
    whatsapp: "(11) 95354-5939"
  },
  ctaHTML: "<div>...</div>",
  ctaWordPress: "<!-- wp:... -->",
  ofertaEspecial: null // ou { nome: "...", desconto: "20%" }
}
```

### Dependências
- `produtos-60mais.js` - Catálogo de produtos
- `calendario-comercial-60mais-2026.json` - Eventos

---

## 📧 5. SUB-AGENTE ENVIO

### Arquivo
`agente-chefe-60mais.js` → função `subAgenteEnvio()`

### O que faz
Envia email para lista de assinantes via Brevo.

### Como faz

#### Processo:

```
1. RECEBER CONTEÚDO
   └── Conteúdo do WRITER + CTA do VENDAS

2. GERAR HTML
   ├── Usa template com logo
   ├── Insere todo o conteúdo
   └── Adiciona CTA no final

3. GERAR TEXTO SIMPLES
   └── Versão sem HTML para clientes de email antigos

4. ENVIAR
   ├── MODO TESTE: luis7nico@gmail.com
   └── MODO PRODUÇÃO: Lista ID 4 (102 assinantes)

5. VALIDAR ENVIO
   └── Retorna message ID ou erro
```

#### Modos:
- `MODO_TESTE = true` → Envia só para teste
- `MODO_TESTE = false` → Envia para lista real

#### Output:
```javascript
{
  sucesso: true,
  messageId: "<20260217...@smtp-relay.mailin.fr>",
  modo: "teste" // ou "lista",
  enviados: 101,
  erros: 1
}
```

### Dependências
- `brevo.js` - API do Brevo
- `newsletter-template.js` - Template HTML

---

## 📝 6. SUB-AGENTE BLOG

### Arquivo
`agente-chefe-60mais.js` → função `subAgenteBlog()`

### O que faz
Publica o conteúdo no WordPress e cria cartão no Trello.

### Como faz

#### WordPress:
```
1. Receber conteúdo formatado
2. Chamar API do WordPress
3. Publicar como post
4. Retornar URL e ID
```

#### Trello:
```
1. Criar cartão na lista "60maisNews"
2. Adicionar título
3. Adicionar descrição completa
4. Retornar URL do cartão
```

#### Output:
```javascript
{
  sucesso: true,
  blogUrl: "https://60maiscursos.com.br/blog/...",
  blogId: 58,
  trelloId: "abc123",
  trelloUrl: "https://trello.com/c/..."
}
```

### Dependências
- `wordpress.js` - API do WordPress
- `trello.js` - API do Trello

---

## 📊 7. SUB-AGENTE MÉTRICAS

### Arquivo
`agente-chefe-60mais.js` → função `subAgenteMetricas()`

### O que faz
Coleta métricas após 7 dias e atualiza o Trello.

### Como faz (Pendente implementação):
```
1. Buscar métricas do Brevo (aberturas, cliques)
2. Buscar métricas do Analytics (visualizações)
3. Calcular conversões
4. Atualizar cartão no Trello
```

---

## 🔗 INTEGRAÇÕES

| Serviço | Arquivo | Status |
|---------|---------|--------|
| Brevo | `brevo.js` | ✅ Ativo |
| WordPress | `wordpress.js` | ✅ Ativo |
| Trello | `trello.js` | ✅ Ativo |
| Google Trends | `google-trends.js` | ✅ Ativo |
| Google Analytics | `google-analytics.js` | ✅ Ativo |
| OpenClaw API | `sessions_spawn` | ✅ Ativo |

---

## 📁 ESTRUTURA DE ARQUIVOS

```
/root/.openclaw/workspace/
│
├── 🤖 agente-chefe-60mais.js      # ORQUESTRADOR
├── ✍️ agente-writer-dinamico.js   # GERADOR DE CONTEÚDO (NOVO!)
│
├── 📦 MÓDULOS
│   ├── brevo.js                    # API de email
│   ├── wordpress.js                # API do blog
│   ├── trello.js                   # API de gestão
│   ├── produtos-60mais.js          # Funil de vendas
│   ├── newsletter-template.js      # Templates HTML
│   ├── google-trends.js            # API de tendências
│   └── google-analytics.js         # API de analytics
│
├── ⚙️ CONFIGURAÇÕES
│   ├── credenciais-60mais.json     # Credenciais centralizadas
│   ├── google-credentials.json     # Credenciais Google (NOVO!)
│   └── calendario-comercial-60mais-2026.json
│
└── 📚 MEMÓRIA
    └── memory/
        ├── 60maisNews-newsletter.md
        ├── diretrizes-conteudo.md
        └── escopo-agentes-60mais.md (este arquivo)
```

---

## ⚡ FLUXO COMPLETO

```
05:00 ───► AGENTE CHEFE inicia
    │
    ├──► GANCHOS
    │    ├── Google Trends: "golpe PIX em alta"
    │    ├── Analytics: "post sobre PIX teve 200 views"
    │    └── Resultado: tema = "golpe PIX", urgência = 9
    │
    ├──► WRITER (DINÂMICO via OpenClaw API)
    │    ├── Gera história emocional
    │    ├── Cria tutorial com 5 passos detalhados
    │    ├── Adiciona checklist
    │    └── Score: 8.5/10
    │
    ├──► VENDAS
    │    ├── Mapeia: "golpe PIX" → "Mini Segurança Digital"
    │    └── Cria CTA: "Proteja seu dinheiro! R$37"
    │
    ├──► ENVIO (Brevo)
    │    ├── Formata HTML
    │    └── Envia para 102 assinantes
    │
    └──► BLOG
         ├── WordPress: Publica post
         └── Trello: Cria cartão

06:06 ───► Email chega nos assinantes
```

---

*Documentação do Sistema 60maisNews*
*Versão 2.0 - 17/02/2026*
*Writer agora é DINÂMICO via OpenClaw API*
