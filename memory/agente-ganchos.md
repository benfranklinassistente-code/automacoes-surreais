# 📅 Sub-Agente Ganchos - 60maisNews

## 🎯 Função Principal

Identificar temas relevantes e em alta para a newsletter diária, priorizando dados de mercado reais.

---

## 📊 Fontes de Dados (Ordem de Prioridade)

| Prioridade | Fonte | Peso | Função |
|------------|-------|------|--------|
| **1ª** | 🔥 Google Trends | 50% | Temas em alta AGORA |
| **2ª** | 📈 Google Analytics | 35% | O que nosso público JÁ busca |
| **3ª** | 🎉 Sazonalidade | 15% | Datas comemorativas gerais |

> **Nota:** Calendário Comercial é usado pelo **Sub-Agente de Vendas** para criar promoções.

---

## 🔥 1. Google Trends (Prioridade Máxima)

### O que faz:
- Descobre o que as pessoas estão buscando **AGORA**
- Identifica temas virais e em alta
- Compara popularidade de termos

### Configuração:
```json
{
  "geo": "BR",
  "hl": "pt-BR",
  "categoriasInteresse": [
    "tecnologia",
    "celulares", 
    "seguranca digital",
    "aplicativos",
    "WhatsApp",
    "golpes digitais"
  ]
}
```

### Termos monitorados para público 60+:
- WhatsApp
- golpe celular
- segurança digital
- videochamada
- celular para idosos
- PIX segurança
- senha celular
- aplicativos para idosos
- Zoom
- Google Fotos

### Output do Trends:
```json
{
  "termoEmAlta": "golpe PIX",
  "variacao": "+340%",
  "tendencia": "em alta",
  "relacionados": ["como evitar golpe PIX", "PIX seguro"]
}
```

---

## 📈 2. Google Analytics (Segunda Prioridade)

### O que faz:
- Veja o que seu público **JÁ busca** no blog
- Páginas mais visitadas
- Termos de busca internos
- Comportamento dos leitores

### Configuração:
```json
{
  "propertyId": "PENDENTE",
  "site": "60maiscursos.com.br/blog",
  "periodoAnalise": "30 dias"
}
```

### Métricas coletadas:
- Páginas mais visitadas
- Termos de busca
- Tempo na página
- Horários de pico

### Output do Analytics:
```json
{
  "topPages": [
    {"titulo": "Como limpar memória do celular", "views": 450},
    {"titulo": "Golpe do PIX", "views": 380}
  ],
  "searchTerms": ["videochamada", "WhatsApp seguro"],
  "horarioPico": "06:00-08:00"
}
```

---

## 📅 3. Calendário Comercial (Complementar)

### O que faz:
- 36 eventos do 60maisPlay em 2026
- Datas de promoções
- Lançamentos de cursos

### Quando usar:
- Quando Trends e Analytics não retornam temas fortes
- Para reforçar campanhas do 60maisPlay
- Eventos especiais (Black Friday, etc.)

---

## 🎉 4. Sazonalidade (Complementar)

### O que faz:
- Datas comemorativas gerais
- Feriados
- Eventos nacionais

### Exemplos:
- Dia dos Avós (26/07)
- Dia do Idoso (01/10)
- Natal, Ano Novo
- Volta às aulas

---

## 🔄 Fluxo de Decisão

```
05:00 ────► AGENTE GANCHOS INICIA
                │
                ▼
        ╔═════════════════════╗
        ║ 1. GOOGLE TRENDS    ║
        ║ Tema em alta?       ║
        ╚═════════════════════╝
                │
        ┌───────┴───────┐
        │               │
       SIM             NÃO
        │               │
        ▼               ▼
   [USA TEMA]    ╔═════════════════════╗
                 ║ 2. GOOGLE ANALYTICS ║
                 ║ Conteúdo popular?   ║
                 ╚═════════════════════╝
                        │
                ┌───────┴───────┐
                │               │
               SIM             NÃO
                │               │
                ▼               ▼
           [USA TEMA]    ╔═════════════════════╗
                        ║ 3. CALENDÁRIO       ║
                        ║ Evento hoje?        ║
                        ╚═════════════════════╝
                                │
                        ┌───────┴───────┐
                        │               │
                       SIM             NÃO
                        │               │
                        ▼               ▼
                   [USA TEMA]    ╔═════════════════════╗
                                ║ 4. SAZONALIDADE     ║
                                ║ Data especial?      ║
                                ╚═════════════════════╝
                                        │
                                        ▼
                                   [USA TEMA]
```

---

## 🔑 SEO - Otimização

### O que o agente também faz:

1. **Gera título otimizado** (50-60 caracteres)
2. **Seleciona palavras-chave** (3-5 relevantes)
3. **Cria meta descrição** (140-160 caracteres)
4. **Score SEO** (0-100)

### Exemplo de output completo:

```json
{
  "tema": "Proteção contra golpe do PIX",
  "titulo": "Golpe do PIX: Como Se Proteger Hoje",
  "tituloSEO": "Golpe do PIX: 5 Dicas para Se Proteger Agora",
  "palavrasChave": ["golpe pix", "segurança pix", "proteger pix"],
  "metaDescricao": "Aprenda a se proteger do golpe do PIX com 5 dicas simples. Seu dinheiro ficará seguro!",
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

---

## 📁 Arquivos Relacionados

| Arquivo | Função |
|---------|--------|
| `agente-ganchos-config.json` | Configurações do agente |
| `google-trends.js` | Módulo de consulta ao Trends |
| `calendario-comercial-60mais-2026.json` | 36 eventos do ano |

---

## ✅ Próximos Passos

1. [ ] Configurar Google Analytics API
2. [ ] Configurar Google Search Console
3. [ ] Testar primeira consulta Trends
4. [ ] Integrar com Agente Chefe

---

*Documentação do Sub-Agente Ganchos v2.0*
*Última atualização: 17/02/2026*
