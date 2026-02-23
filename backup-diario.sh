#!/bin/bash
# Backup diário de memórias - Ben Assistant
# Executa todo dia à meia-noite

echo "🔄 BACKUP DIÁRIO DE MEMÓRIAS"
echo "Data: $(date '+%d/%m/%Y %H:%M:%S')"
echo ""

# Diretório do brain-backup
BRAIN_BACKUP="/root/.openclaw/workspace/brain-backup"
WORKSPACE="/root/.openclaw/workspace"

# Copiar arquivos de memória
echo "📁 Copiando arquivos de memória..."
cp $WORKSPACE/MEMORY.md $BRAIN_BACKUP/
cp $WORKSPACE/USER.md $BRAIN_BACKUP/

# Copiar pasta memory/ completa (e-mails importantes, pagamentos, etc.)
echo "📁 Copiando pasta memory/..."
mkdir -p $BRAIN_BACKUP/memory
cp -r $WORKSPACE/memory/*.md $BRAIN_BACKUP/memory/ 2>/dev/null || echo "  Nenhum arquivo .md em memory/"

# Entrar no diretório
cd $BRAIN_BACKUP

# Verificar se há mudanças
if git diff --quiet && git diff --staged --quiet; then
    echo "✅ Nenhuma mudança detectada."
else
    # Adicionar todos os .md (incluindo memory/)
    git add *.md config/*.md ideias/*.md aprendizados/*.md reunioes/*.md decisoes/*.md memory/*.md 2>/dev/null
    
    # Commit com data
    DATA=$(date '+%d/%m/%Y')
    git commit -m "Backup diário automático - $DATA"
    
    # Push para GitHub
    git push origin master
    
    echo "✅ Backup realizado com sucesso!"
fi

echo ""
echo "📦 Backup concluído: $(date '+%d/%m/%Y %H:%M:%S')"
