# 🔄 FLUXO COMPLETO - 60maisNews
## Pipeline de Automação Diária

---

## 📋 ETAPAS DO FLUXO

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        🤖 AGENTE CHEFE (ORQUESTRADOR)                        │
│                              Executa às 05:00                                │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        │                             │                             │
        ▼                             ▼                             ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│ 1. GANCHOS    │           │ 2. WRITER     │           │ 3. VENDAS     │
│               │           │               │           │               │
│ Google Trends │──────────►│ S.L.P.C.      │──────────►│ CTA R$37      │
│ Analytics     │           │ Story         │           │ Copywriting   │
│ Tema + Título │           │ Lesson/Pivot  │           │ Oferta        │
└───────────────┘           └───────────────┘           └───────────────┘
                                                                │
        ┌───────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           4. ENVIO E PUBLICAÇÃO                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌───────────────┐                    ┌───────────────┐                    │
│   │ 📧 BREVO      │                    │ 📝 WORDPRESS  │                    │
│   │               │                    │               │                    │
│   │ Enviar email  │                    │ Publicar post │                    │
│   │ para lista    │                    │ no blog       │                    │
│   └───────────────┘                    └───────────────┘                    │
│                                                                              │
│                         ┌───────────────┐                                    │
│                         │ 📋 TRELLO     │                                    │
│                         │               │                                    │
│                         │ Criar cartão  │                                    │
│                         │ na lista      │                                    │
│                         │ 60maisNews    │                                    │
│                         └───────────────┘                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ 7 dias depois
                                        ▼
                        ┌───────────────────────────────┐
                        │ 5. MÉTRICAS                   │
                        │                               │
                        │ • Taxa de abertura            │
                        │ • Cliques no CTA              │
                        │ • Visualizações no blog       │
                        │ • Conversões                  │
                        │                               │
                        │ → Atualizar cartão no Trello  │
                        └───────────────────────────────┘
```

---

## ⏰ CRONOGRAMA

| Horário | Ação | Agente |
|---------|------|--------|
| 05:00 | Iniciar fluxo | Agente Chefe |
| 05:05 | Definir tema | Sub-Agente Ganchos |
| 05:10 | Criar conteúdo S.L.P.C. | Sub-Agente Writer |
| 05:15 | Criar CTA R$37 | Sub-Agente Vendas |
| 05:20 | Enviar email (Brevo) | Sub-Agente Envio |
| 05:21 | Publicar no blog | Sub-Agente Blog |
| 05:22 | Criar cartão Trello | Sub-Agente Blog |
| 06:06 | Email chega nos assinantes | (automático) |
| +7 dias | Atualizar métricas no Trello | Sub-Agente Métricas |

---

## 📋 TRELLO - ESTRUTURA DO CARTÃO

### Na criação (dia da publicação):

```
📰 [TÍTULO DA NEWSLETTER]
📅 Publicado em: DD/MM/AAAA

--- CONTEÚDO ---

🌟 Reflexão: "..."

📖 STORY:
[história completa]

💡 LESSON:
[lição]

📋 DICAS:
• Dica 1
• Dica 2
• Dica 3

🎓 CTA:
[oferta R$37]

🔗 Links:
• Blog: https://...
• Email ID: ...

---
⏳ Métricas serão adicionadas em 7 dias
```

### Após 7 dias (atualização):

```
---
📊 MÉTRICAS (7 dias):
📧 Emails abertos: 45 (32%)
👆 Cliques: 12 (8%)
📝 Visualizações no blog: 234
💬 Interações WhatsApp: 15
💰 Conversões: 3 (R$111,00)
📈 Score: 8/10
```

---

## 🔑 CONFIGURAÇÃO NECESSÁRIA

### Trello API:

1. Acesse: https://trello.com/app-key
2. Copie a **API Key**
3. Clique em "Token" e autorize
4. Copie o **Token**

### Encontrar IDs:

```bash
# Listar quadros
curl "https://api.trello.com/1/members/me/boards?key=API_KEY&token=TOKEN"

# Listar listas do quadro
curl "https://api.trello.com/1/boards/BOARD_ID/lists?key=API_KEY&token=TOKEN"
```

### Arquivo de configuração:

```json
{
  "trello": {
    "apiKey": "SUA_API_KEY",
    "token": "SEU_TOKEN",
    "boardId": "ID_DO_QUADRO",
    "listId": "ID_DA_LISTA_60MAISNEWS"
  }
}
```

---

## 📊 MÉTRICAS COLETADAS

| Métrica | Fonte | Prazo |
|---------|-------|-------|
| Taxa de abertura | Brevo API | 7 dias |
| Cliques | Brevo API | 7 dias |
| Visualizações blog | Google Analytics | 7 dias |
| Interações WhatsApp | Manual/API | 7 dias |
| Conversões | Brevo/Hotmart | 7 dias |

---

## 🔄 FLUXO DE DECISÃO

### Se nota < 7:
1. Agente Chefe solicita reescrita
2. Writer recria conteúdo
3. Nova avaliação

### Se nota ≥ 7:
1. Prossegue para envio
2. Publicação paralela (email + blog)
3. Criação do cartão Trello

### Se erro no envio:
1. Tentar novamente em 5 minutos
2. Máximo 3 tentativas
3. Se falhar, alertar no Trello

---

*Fluxo 60maisNews v2.0 - Com integração Trello*
*Última atualização: 17/02/2026*
