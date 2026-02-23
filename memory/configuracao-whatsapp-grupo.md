# 📱 Configuração WhatsApp Bot em Grupos - Guia Completo

**Data:** 19/02/2026
**Status:** ✅ Funcionando

---

## 🔑 INFORMAÇÕES IMPORTANTES

### IDs e Tokens

| Item | Valor |
|------|-------|
| **Número do Bot** | +5511920990009 |
| **Número do Luis** | +5511953545939 |
| **ID do Grupo** | `120363375518105627@g.us` |
| **Gateway Token** | `pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE` |
| **Device ID** | `6ff26db6c88348f70d5739193d664a6519efcb99115159a9d5b977ea57604ec0` |

### Arquivos de Configuração

| Arquivo | Caminho |
|---------|---------|
| Config Principal | `/root/.openclaw/openclaw.json` |
| Credenciais WhatsApp | `/root/.openclaw/credentials/whatsapp/default/creds.json` |
| Device Auth | `/root/.openclaw/identity/device-auth.json` |
| Pareamento | `/root/.openclaw/credentials/whatsapp-pairing.json` |

---

## 🚀 PASSO A PASSO - CONEXÃO COMPLETA

### Problema 1: Token Mismatch

**Erro:** `unauthorized: device token mismatch (rotate/reissue device token)`

**Solução:**

```bash
# 1. Listar dispositivos pareados
openclaw devices list --token "TOKEN_ANTIGO"

# 2. Rotacionar o token
openclaw devices rotate --device "DEVICE_ID" --role operator --token "TOKEN_ANTIGO"

# 3. Atualizar o token no arquivo de configuração
# Editar /root/.openclaw/openclaw.json e /root/.openclaw/identity/device-auth.json
```

### Problema 2: WhatsApp Precisa de Pareamento

**Solução:**

1. Gerar código de pareamento:
   ```bash
   openclaw channels login --channel whatsapp
   ```

2. No celular:
   - WhatsApp → Ajustes → Aparelhos conectados
   - Conectar um aparelho
   - Digitar o código gerado

3. Aprovar o pareamento:
   ```bash
   openclaw pairing approve whatsapp CODIGO
   ```

### Problema 3: Bot Não Recebe Mensagens de Grupo

**Erro:** Mensagens de grupo não aparecem nos logs

**Solução:**

1. Editar `/root/.openclaw/openclaw.json`:
   ```json
   {
     "channels": {
       "whatsapp": {
         "dmPolicy": "pairing",
         "allowFrom": ["5511920990009"],
         "groupPolicy": "open",
         "mediaMaxMb": 50,
         "debounceMs": 0
       }
     }
   }
   ```

2. Mudar `groupPolicy` de `"allowlist"` para `"open"`

3. Reiniciar o gateway ou recarregar configuração

### Problema 4: Descobrir ID do Grupo

**Solução:**

1. Mandar mensagem no grupo marcando o bot (@5511920990009)
2. Verificar logs:
   ```bash
   openclaw channels logs --channel whatsapp
   ```
3. Procurar linha com `@g.us` (ex: `120363375518105627@g.us`)

---

## 📋 COMANDOS ÚTEIS

### Verificar Status

```bash
# Status dos canais
OPENCLAW_GATEWAY_TOKEN="SEU_TOKEN" openclaw channels status

# Ver logs do WhatsApp
OPENCLAW_GATEWAY_TOKEN="SEU_TOKEN" openclaw channels logs --channel whatsapp

# Listar dispositivos
OPENCLAW_GATEWAY_TOKEN="SEU_TOKEN" openclaw devices list

# Listar grupos
OPENCLAW_GATEWAY_TOKEN="SEU_TOKEN" openclaw directory groups list --channel whatsapp
```

### Enviar Mensagens

```bash
# Mensagem direta
OPENCLAW_GATEWAY_TOKEN="SEU_TOKEN" openclaw message send --channel whatsapp --target "5511953545939" --message "Sua mensagem"

# Mensagem para grupo
OPENCLAW_GATEWAY_TOKEN="SEU_TOKEN" openclaw message send --channel whatsapp --target "120363375518105627@g.us" --message "Sua mensagem"
```

### Rotacionar Token

```bash
# Gerar novo token
openclaw devices rotate --device "DEVICE_ID" --role operator --token "TOKEN_ATUAL"

# Depois atualizar nos arquivos:
# - /root/.openclaw/openclaw.json (gateway.auth.token)
# - /root/.openclaw/identity/device-auth.json (tokens.operator)
```

---

## ⚠️ ERROS COMUNS E SOLUÇÕES

| Erro | Causa | Solução |
|------|-------|---------|
| `device token mismatch` | Token desatualizado | Rotacionar token e atualizar config |
| `no tab is connected` | Chrome não conectado | Clicar no ícone da extensão OpenClaw |
| `No groups found` | Política restritiva | Mudar `groupPolicy` para `open` |
| `Cross-context messaging denied` | Sessão em canal diferente | Usar CLI com `--channel whatsapp` |
| `unauthorized` | Não aprovado | Usar `openclaw pairing approve` |

---

## 🔄 FLUXO DE RESOLUÇÃO DE PROBLEMAS

```
┌─────────────────────────────────────────────────────────────┐
│                    WHATSAPP NÃO CONECTA                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Token Mismatch? │
                    └─────────────────┘
                     │ Sim          │ Não
                     ▼              ▼
            ┌──────────────┐  ┌─────────────────┐
            │ Rotacionar   │  │ Verificar logs  │
            │ Token        │  │ openclaw logs   │
            └──────────────┘  └─────────────────┘
                     │
                     ▼
        ┌─────────────────────────┐
        │ Pareamento Necessário?  │
        └─────────────────────────┘
         │ Sim              │ Não
         ▼                  ▼
┌─────────────────┐  ┌─────────────────┐
│ Gerar código    │  │ Testar envio    │
│ openclaw login  │  │ de mensagem     │
└─────────────────┘  └─────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Mensagem de Grupo       │
│ Não Aparece?            │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Mudar groupPolicy=open  │
│ Reiniciar gateway       │
└─────────────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Mencionar bot no grupo  │
│ para descobrir ID       │
└─────────────────────────┘
         │
         ▼
      ✅ PRONTO!
```

---

## 📝 NOTAS IMPORTANTES

1. **Sempre use variável de ambiente para o token:**
   ```bash
   OPENCLAW_GATEWAY_TOKEN="TOKEN" openclaw ...
   ```

2. **O ID do grupo termina em `@g.us`** — é diferente de número de telefone

3. **Mensagens em grupo só aparecem se:**
   - `groupPolicy` está como `open`
   - OU o ID do grupo está em `groupAllowFrom`

4. **Para reiniciar o gateway:**
   ```bash
   pkill -HUP -f "openclaw-gateway"
   ```

5. **Os arquivos de credenciais do WhatsApp ficam em:**
   `/root/.openclaw/credentials/whatsapp/default/`

---

---

## 🤖 AUTOMAÇÃO: DICA DIÁRIA 60+

### Configuração

| Item | Valor |
|------|-------|
| **Script** | `/root/.openclaw/workspace/dica-diaria-60mais.js` |
| **CRON ID** | `a49aff4f-2400-4ca9-8ded-9c04200a7e5b` |
| **Horário** | 08:00 (Brasília) - `0 11 * * *` America/Sao_Paulo |
| **Grupo** | `120363375518105627@g.us` |
| **Histórico** | `/root/.openclaw/workspace/historico-dicas.json` |

### Como Funciona

1. Todo dia às 8h, o sistema roda automaticamente
2. Seleciona um tema (sem repetir nos últimos 7 dias)
3. Pesquisa no Brave Search (últimos 7 dias)
4. Gera mensagem formatada (máx 2000 chars)
5. Envia para o grupo do WhatsApp

### Formato da Mensagem

```
📌 Título chamativo

🧠 Dica do dia (explicação simples)

⚠️ Por que isso é importante

✅ O que fazer na prática (passo a passo)

💬 Pergunta para interação

---
Professor Luis - 60maisNews
```

### Comandos Úteis

```bash
# Verificar status do CRON
OPENCLAW_GATEWAY_TOKEN="TOKEN" openclaw cron list

# Executar manualmente (teste)
OPENCLAW_GATEWAY_TOKEN="TOKEN" openclaw cron run a49aff4f-2400-4ca9-8ded-9c04200a7e5b

# Ver logs
OPENCLAW_GATEWAY_TOKEN="TOKEN" openclaw cron runs a49aff4f-2400-4ca9-8ded-9c04200a7e5b
```

---

*Documento criado em 19/02/2026 - Resolução de problemas de conexão WhatsApp Bot*
*Atualizado em 19/02/2026 - Adicionada automação Dica Diária 60+*
