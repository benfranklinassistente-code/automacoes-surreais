# 📊 Otimização de Tokens - Guia Completo

## Problema Atual

- **Uso diário:** 364 milhões de tokens
- **Meta:** Reduzir para < 50 milhões/dia
- **Custo atual:** $0 (GLM-5 gratuito, mas limitado)

---

## 🎯 Estratégias de Economia

### 1️⃣ REDUZIR JANELA DE CONTEXTO

```json
{
  "agents": {
    "defaults": {
      "maxContextMessages": 20,  // Limitar mensagens antigas
      "maxContextTokens": 50000   // Limite de tokens de contexto
    }
  }
}
```

**Economia esperada:** 60-70%

---

### 2️⃣ ATIVAR CACHE DE RESPOSTAS

```json
{
  "cache": {
    "enabled": true,
    "ttl": 3600,  // 1 hora
    "similarity": 0.95  // Similaridade para usar cache
  }
}
```

**Economia esperada:** 20-30% (para perguntas repetidas)

---

### 3️⃣ OTIMIZAR SYSTEM PROMPTS

**Antes (longo):**
```
Você é um assistente especializado em... [500 tokens]
```

**Depois (curto):**
```
Assistente IA especializado. [10 tokens]
```

**Economia esperada:** 10-20% por requisição

---

### 4️⃣ CONFIGURAR COMPACTION

```json
{
  "agents": {
    "defaults": {
      "compaction": {
        "enabled": true,
        "threshold": 0.7,  // Compactar ao atingir 70% do contexto
        "strategy": "summarize"  // Resumir em vez de remover
      }
    }
  }
}
```

**Economia esperada:** 40-50%

---

### 5️⃣ USAR MODELO MENOR PARA TAREFAS SIMPLES

```json
{
  "agents": {
    "whatsapp-bot": {
      "model": "moonshot/moonshot-v1-8k"  // Mais barato para respostas simples
    },
    "benjamin": {
      "model": "modal/zai-org/GLM-5-FP8"  // Principal
    }
  }
}
```

**Economia esperada:** 30-40%

---

### 6️⃣ LIMITAR SUBAGENTES

- Evitar criar subagentes desnecessariamente
- Reutilizar sessões quando possível
- Usar `cleanup: "delete"` após tarefas

```json
{
  "sessions_spawn": {
    "cleanup": "delete",  // Remove sessão após completar
    "maxConcurrent": 3    // Limitar concorrência
  }
}
```

**Economia esperada:** 50-60%

---

### 7️⃣ PODAR MENSAGENS ANTIGAS

```json
{
  "agents": {
    "defaults": {
      "pruneAfter": 3600,  // Remover após 1 hora
      "keepLast": 10       // Manter últimas 10 mensagens
    }
  }
}
```

**Economia esperada:** 40-50%

---

## 📋 CONFIGURAÇÃO RECOMENDADA

```json
{
  "agents": {
    "defaults": {
      "maxContextMessages": 15,
      "maxContextTokens": 30000,
      "compaction": {
        "enabled": true,
        "threshold": 0.6
      },
      "pruneAfter": 1800
    }
  },
  "cache": {
    "enabled": true,
    "ttl": 7200
  }
}
```

---

## 📊 Estimativa de Economia

| Estratégia | Economia | Dificuldade |
|------------|----------|-------------|
| Reduzir contexto | 60-70% | Fácil |
| Ativar cache | 20-30% | Fácil |
| Otimizar prompts | 10-20% | Médio |
| Configurar compaction | 40-50% | Fácil |
| Modelo menor | 30-40% | Fácil |
| Limitar subagentes | 50-60% | Médio |

**Total estimado:** Redução de 70-80% no uso de tokens

---

## 🎯 PRIORIDADES

### Imediato (Fazer Agora):
1. ✅ Reduzir `maxContextMessages` para 15
2. ✅ Ativar cache
3. ✅ Configurar compaction

### Curto Prazo (Esta Semana):
4. Otimizar system prompts
5. Configurar modelo menor para bots

### Médio Prazo (Próxima Semana):
6. Implementar rate limiting
7. Monitorar uso por sessão

---

## 📈 Monitoramento

Verificar uso diariamente:
- Tokens de entrada
- Tokens de saída
- Sessões mais ativas
- Modelos mais usados

---

*Documento criado em 22/02/2026*
