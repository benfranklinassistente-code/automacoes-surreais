# 🧬 AUTOMAÇÃO #19 - CLONAGEM DE TAREFAS REPETITIVAS

**Status:** ✅ **OPERACIONAL** v1.0

> "O sistema aprende com você. Após 3 repetições, sugere automação."

---

## 🎯 COMO FUNCIONA

```
Você faz uma tarefa → 📝 Registrada
     ↓
Repete 2x mais → 🔍 Padrão detectado!
     ↓
Confiança 70%+ → 💡 Sugestão gerada
     ↓
Você aprova → 🤖 Automação ativa!
```

---

## 🚀 COMO USAR

### 1. Instalar
```bash
cd 19-clonagem-tarefas
npm install
```

### 2. Registrar tarefas (manual ou automático)
```bash
# Manualmente
npm run registrar -- backup "tar czf backup.tar.gz ./data"

# Ou automaticamente (integrado em outros scripts)
node -e "const C=require('./src/clonagem'); new C().registrarTarefa('deploy', 'git push origin master')"
```

### 3. Ver dashboard
```bash
npm start
# ou
npm run dashboard
```

### 4. Simular detecção (demonstração)
```bash
npm run simular
```

---

## 📊 DASHBOARD MOSTRA

```
╔════════════════════════════════════════════════════════╗
║    🧬 CLONAGEM DE TAREFAS - DASHBOARD                   ║
╚════════════════════════════════════════════════════════╝

📊 RESUMO
─────────────────────────────────────────────────────────
📝 Total tarefas registradas: 47
📈 Últimas 24h: 8
📅 Últimos 7 dias: 35
🔍 Padrões detectados: 5
💡 Sugestões pendentes: 2
🤖 Automações ativas: 3

🏆 TOP PADRÕES DETECTADOS
─────────────────────────────────────────────────────────
1. ✅ backup (12x) - 95%
2. 💡 deploy (8x) - 85%
3. 💡 newsletter (6x) - 80%
4. 🔍 test (5x) - 70%
5. 🔍 git-commit (4x) - 65%
```

---

## 🧠 ALGORITMO DE DETECÇÃO

### Thresholds configuráveis:
- **Repetições mínimas:** 3x (padrão)
- **Janela temporal:** 7 dias
- **Confiança mínima:** 70%

### Cálculo de confiança:
```
Confiança = (repetições × 10) + (dias únicos × 5) + bônus
Máximo: 95%
```

### Tipos detectados automaticamente:
| Padrão no comando | Tipo identificado |
|-------------------|-------------------|
| git add/commit/push | git |
| npm install/start | node |
| python | python |
| docker | docker |
| ssh/scp/rsync | ssh/backup |
| newsletter | conteudo |
| planilha | financas |

---

## 💡 EXEMPLO REAL

### Cenário: Backup diário manual

**Você faz:**
```bash
# Dia 1
tar czf backup-2024-02-10.tar.gz ./workspace

# Dia 2
tar czf backup-2024-02-09.tar.gz ./workspace

# Dia 3
tar czf backup-2024-02-08.tar.gz ./workspace
```

**Sistema detecta:**
```
🔍 PADRÃO DETECTADO!
   Tipo: backup
   Repetições: 3x
   Comando: tar czf backup-[DATA].tar.gz ./workspace

💡 SUGESTÃO DE AUTOMAÇÃO
   Confiança: 85%
   Tipo: backup
   Economia estimada: 10h/mês
   Arquivo: automacoes-geradas/sugestao-abc123.js

🤖 Para ativar: ./ativar-automacao.sh abc123
```

**Script gerado automaticamente:**
```javascript
// 🤖 AUTOMAÇÃO GERADA AUTOMATICAMENTE
// Detectado após: 3 repetições
// Confiança: 85%

class AutoBackupAbc123 {
    async executar() {
        const data = new Date().toISOString().split('T')[0];
        const comando = `tar czf backup-${data}.tar.gz ./workspace`;
        // ... execução automática
    }
}
```

---

## 📁 ESTRUTURA

```
19-clonagem-tarefas/
├── src/
│   └── clonagem.js           ← Core do sistema
├── scripts/
│   └── simular-padroes.js    ← Demonstração
├── config/
│   └── padroes-config.json   ← Configurações
├── data/
│   ├── tarefas-log.json      ← Log de todas as tarefas
│   └── padroes-detectados.json ← Padrões encontrados
├── automacoes-geradas/
│   ├── sugestao-xxx.js       ← Sugestões pendentes
│   └── ativas/
│       └── auto-xxx.js       ← Automações aprovadas
├── package.json
└── README.md
```

---

## ⚙️ CONFIGURAÇÃO

Edite `config/padroes-config.json`:

```json
{
  "thresholdRepeticoes": 3,
  "thresholdDias": 7,
  "autoSugerir": true,
  "ignorarTarefas": ["dormir", "comer"],
  "comandosComuns": {
    "git add": "git",
    "npm install": "node",
    "docker": "docker",
    "newsletter": "conteudo"
  }
}
```

---

## 🎮 COMANDOS

| Comando | Descrição |
|---------|-----------|
| `npm start` | Abre dashboard |
| `npm run dashboard` | Dashboard interativo |
| `npm run registrar -- <tipo> <comando>` | Registra nova tarefa |
| `npm run detectar` | Força verificação de padrões |
| `npm run relatorio` | Gera relatório JSON |
| `npm run ativar -- <hash>` | Ativa sugestão |
| `npm run simular` | Demonstração com dados fake |

---

## 🔗 INTEGRAÇÃO

### Com outros scripts:
```javascript
const ClonagemTarefas = require('./19-clonagem-tarefas/src/clonagem');
const clonador = new ClonagemTarefas();

// No final de qualquer script:
clonador.registrarTarefa('tipo', 'comando executado', { importante: true });
```

### Com cron jobs:
```bash
# Adicionar ao final de scripts cron:
node -e "const C=require('./src/clonagem'); new C().registrarTarefa('backup-daily', 'comando', {automated: true})"
```

---

## 📈 RESULTADOS ESPERADOS

| Métrica | Antes | Depois |
|---------|-------|--------|
| Tarefas manuais | 100% | 30% |
| Automações sugeridas | 0/mês | 5-10/mês |
| Tempo economizado | - | 15-20h/mês |
| Padroes detectados | Manual | Automático |

---

## 🎉 STATUS

✅ **Sistema operacional e aprendendo!**

Execute `npm run simular` para ver uma demonstração completa.

---

*Automação #19 - OPERACIONAL v1.0*
*Seu sistema que aprende com você* 🧠
