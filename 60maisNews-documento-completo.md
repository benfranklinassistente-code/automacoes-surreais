# 📰 60maisNews - Documento Completo da Redação Autônoma

## Visão Geral do Sistema

A **60maisNews** é uma newsletter diária automatizada que funciona como uma "carta de vendas disfarçada", utilizando a técnica **StorySelling (S.L.P.C.)** para engajar e converter idosos 60+ interessados em tecnologia.

| Característica | Valor |
|----------------|-------|
| **Público-alvo** | Idosos 60+ interessados em tecnologia |
| **Frequência** | Diária às 06:06 |
| **Plataforma de envio** | Brevo (102 assinantes) |
| **Blog** | https://60maiscursos.com.br/blog/ |
| **Técnica de escrita** | StorySelling (S.L.P.C.) |

---

## 🏗️ Arquitetura do Sistema de Redação

O sistema funciona como uma **redação autônoma** com 4 agentes especializados, coordenados por um orquestrador central.

```
┌─────────────────────────────────────────────────────────────────┐
│                    🎭 ORQUESTRADOR                               │
│         (Agente principal que coordena todos os processos)      │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ 📅 GANCHOS    │   │ ✍️ STORYTELLER │   │ 💰 VENDAS     │
│               │   │               │   │               │
│ • Trends      │   │ • StorySelling│   │ • CTAs        │
│ • Analytics   │   │ • Narrativa   │   │ • Ofertas     │
│ • Sazonalidade│   │ • Dicas 60+   │   │ • Produtos    │
└───────────────┘   └───────────────┘   └───────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                   ┌─────────────────┐
                   │ 📧 ENVIO        │
                   │                 │
                   │ • Brevo API     │
                   │ • Agendamento   │
                   │ • Métricas      │
                   └─────────────────┘
```

---

## 🤖 Agentes Autônomos - Descrição Detalhada

### AGENTE 1: GANCHOS 📅

#### Função Principal
Identificar temas relevantes e em alta para a newsletter diária, priorizando dados de mercado reais.

#### Fontes de Dados (Ordem de Prioridade)

| Prioridade | Fonte | Peso | Função |
|------------|-------|------|--------|
| **1ª** | 🔥 Google Trends | 50% | Temas em alta AGORA |
| **2ª** | 📈 Google Analytics | 35% | O que nosso público JÁ busca |
| **3ª** | 🎉 Sazonalidade | 15% | Datas comemorativas gerais |

#### Como Funciona

**Passo 1: Consulta Google Trends (05:00)**
- Consulta a API do Google Trends com parâmetros:
  - `geo: "BR"` (Brasil)
  - `hl: "pt-BR"` (português)
- Monitora termos relevantes para público 60+:
  - WhatsApp, golpe celular, segurança digital
  - Videochamada, celular para idosos
  - PIX segurança, senha celular
  - Aplicativos para idosos, Zoom, Google Fotos

**Passo 2: Análise de Tendências**
- Identifica variação de busca (+% nas últimas 24h)
- Detecta temas virais e emergentes
- Compara popularidade de termos relacionados

**Passo 3: Consulta Google Analytics (backup)**
- Se Trends não retornar tema forte:
  - Verifica páginas mais visitadas no blog
  - Analisa termos de busca internos
  - Identifica horários de pico de leitura

**Passo 4: Sazonalidade (complementar)**
- Datas comemorativas: Dia dos Avós (26/07), Dia do Idoso (01/10)
- Eventos nacionais: Black Friday, Natal, Volta às aulas

#### O que o Agente Produz

```json
{
  "tema": "Proteção contra golpe do PIX",
  "titulo": "Golpe do PIX: Como Se Proteger Hoje",
  "tituloSEO": "Golpe do PIX: 5 Dicas para Se Proteger Agora",
  "palavrasChave": ["golpe pix", "segurança pix", "proteger pix"],
  "metaDescricao": "Aprenda a se proteger do golpe do PIX com 5 dicas simples.",
  "gancho": "Notícia de golpe viralizada +340% no Google",
  "urgencia": 9,
  "seoScore": 85,
  "fontePrincipal": "Google Trends",
  "dadosTrends": {
    "termo": "golpe PIX",
    "variacao": "+340%",
    "tendencia": "em alta"
  }
}
```

#### Output Final
- **Tema definido** para a newsletter do dia
- **Título otimizado** para SEO (50-60 caracteres)
- **Palavras-chave** selecionadas (3-5)
- **Meta descrição** para compartilhamento
- **Score de urgência** (1-10)

---

### AGENTE 2: STORYTELLER ✍️

#### Função Principal
Criar o conteúdo da newsletter utilizando a técnica StorySelling (S.L.P.C.), mantendo o tom afetuoso e acessível do público 60+.

#### Técnica: Fórmula S.L.P.C.

```
S → L → P → C

Story → Lesson → Pivot → Call to Action
História → Lição → Conexão → Chamada para Ação
```

#### Estrutura de Palavras

| Seção | Palavras | Função |
|-------|----------|--------|
| Story (História) | 100-250 | Conexão emocional |
| Lesson (Lição) | 25-50 | Aprendizado |
| Pivot (Conexão) | 50-100 | Transição para dica |
| CTA (Ação) | 25-75 | Chamada para oferta |
| **TOTAL** | **250-450** | |

#### Como Funciona

**Passo 1: Recebe Input do Agente Ganchos**
- Tema: "Proteção contra golpe do PIX"
- Urgência: 9 (alta)
- Palavras-chave: ["golpe pix", "segurança pix"]

**Passo 2: Gera Reflexão do Dia**
- Frase inspiradora relacionada ao tema
- Tom: afetuoso, próximo, acolhedor

**Passo 3: Cria STORY (S)**
- Narra uma situação pessoal ou observação
- Usa metáforas familiares (ex: "celular engasgado = armário cheio")
- Mantém linguagem simples, sem jargões
- Inclui emojis para leveza

**Passo 4: Extrai LESSON (L)**
- Transforma a história em aprendizado
- Conexão emocional com o público 60+
- Frase curta e impactante

**Passo 5: Desenvolve PIVOT + DICAS (P)**
- Transição: "Isso me fez pensar em vocês..."
- Dica prática passo a passo
- Inclui dicas de segurança digital
- Tutorial visual com setas (→)

**Passo 6: Passa para Agente Vendas**
- Envia conteúdo completo SEM CTA
- Aguarda inserção de oferta relevante

#### Tom e Estilo Característicos

| Característica | Exemplos |
|----------------|----------|
| **Afetuoso** | "Queridos amigos", "com carinho" |
| **Proximidade** | "Estamos juntos nessa jornada" |
| **Metáforas familiares** | "Memória = armário", "Faxina digital" |
| **Emojis frequentes** | 🌟 💪 📞 🎉 ❤️ 🔒 🛡️ 🎓 🤝 |
| **Linguagem simples** | Sem jargões técnicos |

#### Exemplo de Output

```
🌟 Reflexão do Dia:
"Cada momento com a família é um tesouro que guardamos no coração."

📖 STORY (S):
Outro dia, liguei para minha mãe e ela disse: "Filho, não consigo ver suas 
fotos, meu celular está muito lento!"

Fui visitá-la e descobri que ela tinha 3.000 fotos no celular, cada álbum 
duplicado, e o WhatsApp guardava vídeos que ela nem lembrava de ter recebido. 😅

O celular dela estava "engasgado" - parece aquele armário que a gente enche 
de coisas e depois não consegue encontrar nada!

💭 LESSON (L):
Isso me ensinou que organizar o celular é como organizar a casa: um pouco 
de manutenção faz toda a diferença no dia a dia.

💡 PIVOT + DICAS (P):
E pensei comigo: quantos de vocês estão com o celular "cansado" também? 
Então vou ensinar uma faxina rápida:

1. Limpe o WhatsApp:
Configurações → Armazenamento → Gerenciar armazenamento
Apague vídeos e fotos antigas das conversas maiores.

2. Desinstale apps que não usa:
Toque e segure → "Desinstalar"

🛡️ Dica de Segurança:
Antes de apagar fotos, faça backup no Google Fotos!

[AGUARDANDO CTA DO AGENTE VENDAS]
```

---

### AGENTE 3: VENDAS 💰

#### Função Principal
Inserir ofertas de produtos de forma natural e casual, sem pressão agressiva.

#### Catálogo de Produtos Disponíveis

| Categoria | Produto | Preço | Quando Ofertar |
|-----------|---------|-------|----------------|
| **Cursos Pílula** | 18 cursos | R$ 47-97 | Temas técnicos |
| **Workshops** | Eventos ao vivo | R$ 47-97 | Datas especiais |
| **Aulas Particulares** | 1:1 com Luís | R$ 197/h | Alta urgência |
| **E-books** | Materiais digitais | R$ 27-47 | Conteúdos de referência |
| **60maisPlay** | Plataforma completa | Mensal | Ofertas principais |

#### Calendário Comercial 2026
- **36 eventos** programados para ganchos promocionais
- Datas de Black Friday, Natal, Dia do Idoso, etc.
- Lançamentos de novos cursos

#### Como Funciona

**Passo 1: Analisa Conteúdo do Storyteller**
- Tema da newsletter
- Nível de urgência
- Conteúdo das dicas

**Passo 2: Seleciona Produto Relevante**
```
IF tema = "segurança digital" → Curso "Proteção Digital 60+"
IF tema = "WhatsApp" → Workshop "WhatsApp para Idosos"
IF tema = "fotos/memória" → Curso "Google Fotos para Idosos"
IF urgencia >= 8 → Aula Particular (resolução rápida)
IF data especial → Promoção do calendário
```

**Passo 3: Cria CTA Casual**
- Oferta aparece apenas no final
- Linguagem: "Se quiser aprender mais..."
- Sem pressão, sem urgência falsa
- Contato: WhatsApp (11) 95354-5939

**Passo 4: Regras de Inserção**
- ✅ Relevância com o tema
- ✅ Tom casual e amigável
- ✅ Oferece valor antes de pedir
- ❌ Nunca agressivo
- ❌ Nunca múltiplas ofertas

#### Exemplo de Output

```
🎯 CTA (C):
Se quiser aprender mais dicas como essa com calma e carinho, nosso 
Curso 60+ Presencial é o lugar certo!

📱 Chame no WhatsApp: (11) 95354-5939
```

---

### AGENTE 4: ENVIO 📧

#### Função Principal
Formatar, agendar e enviar a newsletter, além de coletar métricas.

#### Configurações Brevo

| Info | Valor |
|------|-------|
| **Conta** | Luis Canabarra |
| **Email remetente** | benfranklinassistante@gmail.com |
| **Lista de contatos** | 102 assinantes |
| **API** | Configurada em `brevo-config.json` |

#### Como Funciona

**Passo 1: Formatação HTML**
- Converte markdown para HTML responsivo
- Adiciona estilos inline para compatibilidade
- Testa renderização em mobile e desktop

**Passo 2: Validação**
- ✅ Verifica todos os links
- ✅ Testa CTA (WhatsApp)
- ✅ Confirma imagens carregando
- ✅ Preview em múltiplos clientes de email

**Passo 3: Agendamento**
- Horário padrão: **06:06** (horário de pico do público 60+)
- Timezone: America/Sao_Paulo (UTC-3)

**Passo 4: Envio**
- Usa API Brevo para envio transacional
- Segmenta por engajamento se necessário

**Passo 5: Coleta de Métricas**
- Taxa de abertura
- Taxa de clique
- Descadastros
- Respostas

#### Funções Disponíveis

| Função | Descrição |
|--------|-----------|
| `enviarEmail()` | Email transacional simples |
| `enviarTemplate()` | Email com template HTML |
| `listarContatos()` | Ver assinantes |
| `criarContato()` | Adicionar novo contato |
| `listarCampanhas()` | Ver campanhas criadas |
| `estatisticasEmails()` | Métricas de desempenho |

---

## 🔄 Fluxo Completo de Trabalho

### Timeline Diária

```
05:00 ─────────────────────────────────────────────────────────────
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ AGENTE GANCHOS inicia                                            │
│ • Consulta Google Trends                                         │
│ • Analisa variações de busca                                     │
│ • Seleciona tema do dia                                          │
│ • Gera título e palavras-chave                                   │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼ Output: { tema, titulo, palavrasChave, urgencia }
  │
┌─────────────────────────────────────────────────────────────────┐
│ AGENTE STORYTELLER recebe tema                                   │
│ • Gera Reflexão do Dia                                           │
│ • Cria Story (S) com metáforas e emojis                          │
│ • Extrai Lesson (L) emocional                                    │
│ • Desenvolve Pivot + Dicas (P) práticas                          │
│ • Passa para Agente Vendas                                       │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼ Output: { reflexao, story, lesson, pivot+dicass }
  │
┌─────────────────────────────────────────────────────────────────┐
│ AGENTE VENDAS analisa conteúdo                                   │
│ • Identifica produto relevante                                   │
│ • Cria CTA casual                                                │
│ • Insere no final do conteúdo                                    │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼ Output: { cta, produtoSelecionado }
  │
┌─────────────────────────────────────────────────────────────────┐
│ AGENTE ENVIO processa                                            │
│ • Formata HTML responsivo                                        │
│ • Valida links e CTA                                             │
│ • Agenda para 06:06                                              │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
06:06 ─────────────────────────────────────────────────────────────
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ NEWSLETTER ENVIADA                                               │
│ • 102 assinantes recebem                                         │
│ • Métricas coletadas automaticamente                             │
└─────────────────────────────────────────────────────────────────┘
  │
  ▼
06:30+ ───────────────────────────────────────────────────────────
  │
  ▼
┌─────────────────────────────────────────────────────────────────┐
│ MÉTRICAS DISPONÍVEIS                                             │
│ • Taxa de abertura                                               │
│ • Taxa de clique                                                 │
│ • Respostas e feedback                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Interação Entre os Agentes

### Diagrama de Comunicação

```
                    ┌─────────────┐
                    │ ORQUESTRADOR │
                    └──────┬──────┘
                           │ coordena
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
    ┌─────────┐      ┌──────────┐      ┌─────────┐
    │ GANCHOS │──────│STORYTELLER│──────│ VENDAS  │
    └────┬────┘      └─────┬────┘      └────┬────┘
         │                 │                 │
         │ tema            │ conteúdo        │ cta
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
                           ▼
                    ┌──────────┐
                    │  ENVIO   │
                    └────┬─────┘
                         │
                         ▼
                  ┌────────────┐
                  │ NEWSLETTER │
                  └────────────┘
```

### Pipeline de Dados

| Etapa | Input | Agente | Output |
|-------|-------|--------|--------|
| 1 | Data/hora | GANCHOS | Tema + título + SEO |
| 2 | Tema + título | STORYTELLER | Conteúdo S.L.P. |
| 3 | Conteúdo | VENDAS | Conteúdo + CTA |
| 4 | Conteúdo final | ENVIO | Newsletter enviada |

---

## 🎯 O Produto Final: A Newsletter

### Estrutura Completa de Uma Newsletter

```
┌─────────────────────────────────────────────────────────────────┐
│  📰 60maisNews                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  🌟 REFLEXÃO DO DIA                                             │
│  "Frase inspiradora relacionada ao tema."                       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📖 STORY (S)                                                   │
│  História pessoal ou observação com metáforas familiares.       │
│  Tom afetuoso, emojis, linguagem simples.                       │
│  (100-250 palavras)                                             │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  💭 LESSON (L)                                                  │
│  Aprendizado extraído da história.                              │
│  Conexão emocional com o público 60+.                           │
│  (25-50 palavras)                                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  💡 PIVOT + DICAS PRÁTICAS (P)                                  │
│  Transição para dicas práticas.                                 │
│  Passo a passo com setas (→).                                   │
│  Dicas de segurança digital.                                    │
│  (50-100 palavras + tutorial)                                   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  🎯 CTA (C)                                                     │
│  Oferta casual para produto relevante.                          │
│  Contato via WhatsApp.                                          │
│  Sem pressão agressiva.                                         │
│  (25-75 palavras)                                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│  60maisNews | 60maiscursos.com.br                               │
│  📱 WhatsApp: (11) 95354-5939                                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Exemplo Real de Newsletter

---

**🌟 Reflexão do Dia:**
> "Cada momento com a família é um tesouro que guardamos no coração."

---

**📖 STORY (S):**
> Outro dia, liguei para minha mãe e ela disse: "Filho, não consigo ver suas fotos, meu celular está muito lento!"
>
> Fui visitá-la e descobri que ela tinha **3.000 fotos** no celular, cada álbum duplicado, e o WhatsApp guardava vídeos que ela nem lembrava de ter recebido. 😅
>
> O celular dela estava "engasgado" - parece aquele armário que a gente enche de coisas e depois não consegue encontrar nada!

---

**💭 LESSON (L):**
> Isso me ensinou que **organizar o celular é como organizar a casa**: um pouco de manutenção faz toda a diferença no dia a dia.

---

**💡 PIVOT + DICAS (P):**
> E pensei comigo: quantos de vocês estão com o celular "cansado" também? Então vou ensinar uma faxina rápida:

**1. Limpe o WhatsApp:**
> Configurações → Armazenamento → Gerenciar armazenamento
> Apague vídeos e fotos antigas das conversas maiores.

**2. Desinstale apps que não usa:**
> Toque e segure → "Desinstalar"

**🛡️ Dica de Segurança:**
> Antes de apagar fotos, faça backup no Google Fotos!

---

**🎯 CTA (C):**
> Se quiser aprender mais dicas como essa com calma e carinho, nosso **Curso 60+ Presencial** é o lugar certo!
>
> 📱 Chame no WhatsApp: (11) 95354-5939

---

### Métricas de Sucesso

| Métrica | Meta | Como Medir |
|---------|------|------------|
| Taxa de abertura | > 25% | Brevo Analytics |
| Taxa de clique | > 5% | Brevo Analytics |
| Respostas | > 1% | Emails respondidos |
| Descadastro | < 0.5% | Brevo Analytics |
| Conversões | > 2% | WhatsApp/Cursos |

---

## 🔧 Tecnologias Utilizadas

| Componente | Tecnologia | Status |
|------------|------------|--------|
| **Orquestrador** | Node.js + OpenClaw | ✅ Ativo |
| **Ganchos** | Google Trends API | ⏳ Configurar |
| **Storyteller** | Claude/OpenAI API | ⏳ Configurar |
| **Vendas** | Node.js + Catálogo | ✅ Ativo |
| **Envio** | Brevo API | ✅ Ativo |
| **Blog** | WordPress REST API | ✅ Ativo |
| **Analytics** | Google Analytics | ⏳ Configurar |

---

## ✅ Próximos Passos

1. [ ] Configurar API Google Trends
2. [ ] Configurar API Google Analytics
3. [ ] Configurar API Claude/OpenAI para Storyteller
4. [ ] Criar catálogo completo de produtos
5. [ ] Testar primeiro ciclo completo
6. [ ] Automatizar 100% do fluxo

---

## 📁 Arquivos do Sistema

| Arquivo | Função |
|---------|--------|
| `60maisNews-newsletter.md` | Documentação principal |
| `agente-ganchos-config.json` | Configurações do Agente Ganchos |
| `agente-storyteller-config.json` | Configurações do Agente Storyteller |
| `agente-vendas-config.json` | Configurações do Agente Vendas |
| `calendario-comercial-60mais-2026.json` | 36 eventos para ganchos |
| `catalogo-produtos.json` | Produtos para oferta |
| `brevo-config.json` | Credenciais Brevo |
| `google-trends.js` | Módulo de consulta Trends |
| `orquestrador-newsletter.js` | Script principal |

---

*Documento gerado em: 17/02/2026*
*Versão: 1.0*
*Sistema: 60maisNews - Redação Autônoma*
