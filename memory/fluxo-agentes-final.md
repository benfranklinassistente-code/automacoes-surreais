# 🤖 FLUXO DE AGENTES - Newsletter 60maisNews
## Arquitetura Final - 17/02/2026

---

## 📐 DIAGRAMA

```
┌─────────────────────────────────────────────────────────────────┐
│                        🤖 GANCHOS                                │
│                    (ganchos-tema.js)                            │
│                                                                  │
│  1. Brave Search → tendências do dia                            │
│  2. Google Analytics → posts populares                          │
│  3. Histórico → não repetir últimos 30 dias                     │
│                                                                  │
│  OUTPUT: tema-selecionado.json                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                         🧠 BEN (IA)                              │
│                     (sessions_spawn / manual)                   │
│                                                                  │
│  Gera conteúdo dinâmico:                                        │
│  - Reflexão, Story, Lesson                                      │
│  - Tutorial 5 passos com ação + exemplo                         │
│  - Checklist, Bridge para produto, Dica segurança               │
│                                                                  │
│  OUTPUT: conteudo-gerado.json                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ✍️ ESCRITOR                               │
│                   (escritor-envia.js)                           │
│                                                                  │
│  1. Carrega tema + conteúdo                                     │
│  2. Gera CTA (R$37)                                             │
│  3. Formata HTML                                                │
│  4. Envia email (Brevo)                                         │
│  5. Publica blog (WordPress)                                    │
│  6. Registra tema no histórico                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 MÓDULOS IMPLEMENTADOS

### 1. GANCHOS (`ganchos-tema.js`)

**Função:** Descobrir tema relevante dinamicamente

**Fontes de dados:**
| Fonte | Prioridade | Implementação |
|-------|------------|---------------|
| Google Analytics | 1ª | ✅ Maton API |
| Brave Search | 2ª | ✅ Skill instalada |
| Fallback Temporal | 3ª | ✅ Dia da semana |

**Controle de repetição:**
- ✅ Não repete tema por 30 dias
- ✅ Módulo `historico-temas.js`
- ✅ Arquivo `historico-temas.json` gerado automaticamente

---

### 2. BEN (IA)

**Função:** Gerar conteúdo dinâmico

**Estrutura do conteúdo:**
- ✅ Reflexão do dia
- ✅ Story (história emocional)
- ✅ Lesson (lição)
- ✅ Tutorial com 5 passos
- ✅ Cada passo: título + explicação + ação + exemplo
- ✅ Checklist
- ✅ Bridge para produto
- ✅ Dica de segurança

**Implementação:**
- ✅ Arquivo `conteudo-gerado.json` salvo manualmente
- 🔴 OpenClaw API (sessions_spawn) com timeout

---

### 3. ESCRITOR (`escritor-envia.js`)

**Função:** Processar e distribuir conteúdo

**Tarefas:**
| Tarefa | Status |
|--------|--------|
| Carregar tema | ✅ |
| Carregar conteúdo | ✅ |
| Gerar CTA | ✅ |
| Formatar HTML email | ✅ |
| Enviar email Brevo | ✅ |
| Publicar WordPress | ✅ |
| Registrar no histórico | ⚠️ Pendente adicionar |

---

### 4. AGENTE CHEFE (`agente-chefe-60mais.js`)

**Função:** Executar tudo em sequência

**Execução:**
```bash
node agente-chefe-60mais.js
```

**Também disponível:**
```bash
# Fluxo separado
node ganchos-tema.js    # Descobre tema
# Ben gera conteúdo
node escritor-envia.js  # Envia e publica
```

---

## 📊 SKILLS INSTALADAS

### Brave Search
- **Caminho:** `/root/.openclaw/skills/brave-search`
- **API Key:** Configurada em `credenciais-60mais.json`
- **Módulo:** `brave-search.js`

### Google Analytics (Maton)
- **Caminho:** `/root/.openclaw/skills/google-analytics`
- **API Key:** Configurada em `credenciais-60mais.json`
- **Connection ID:** `adf6136a-af40-45fa-879f-192d3b181fea`
- **Módulo:** `analytics-maton.js`

---

## ⚙️ CONFIGURAÇÕES

### credenciais-60mais.json
```json
{
  "brevo": { "apiKey": "..." },
  "wordpress": { "username": "benjamin", "password": "..." },
  "trello": { "apiKey": "...", "token": "..." },
  "brave": { "apiKey": "..." },
  "maton": { "apiKey": "...", "connectionId": "..." },
  "whatsapp": { "numero": "(11) 95354-5939" }
}
```

---

## 📅 CRON

**Configurado para:** 05:00 UTC (02:00 Brasília)

**Comando:**
```bash
0 5 * * * cd /root/.openclaw/workspace && node agente-chefe-60mais.js
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

- [x] Brave Search instalado e funcionando
- [x] Google Analytics via Maton funcionando
- [x] Histórico de 30 dias implementado
- [x] Módulo `ganchos-tema.js` atualizado
- [x] Módulo `escritor-envia.js` criado
- [x] Módulo `historico-temas.js` criado
- [x] Template HTML completo
- [x] CTA dinâmico por tema
- [x] Email enviando (modo teste)
- [x] Blog publicando
- [x] CRON configurado
- [x] Documentação completa

---

## 🔴 PENDENTE

- [ ] Adicionar `historico.registrarTema()` no `escritor-envia.js`
- [ ] Investigar sessions_spawn timeout
- [ ] Corrigir erro Trello
- [ ] Mudar para modo produção (lista real)

---

*Atualizado: 17/02/2026 17:30 UTC*
