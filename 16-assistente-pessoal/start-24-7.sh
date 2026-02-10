#!/bin/bash
# 🚀 MODO 24/7 COM NOHUP (Simples - roda agora!)

echo "🤖 Iniciando Assistente 24/7 (modo simples)..."
echo ""

cd /root/.openclaw/workspace/automacoes-surreais/16-assistente-pessoal

# Matar processo anterior se existir
pkill -f "cron-scheduler.js" 2>/dev/null

# Iniciar com nohup (sobrevive logout)
nohup node src/cron-scheduler.js > /tmp/assistente-24-7.log 2>&1 &

# Pegar PID
PID=$!
echo $PID > /tmp/assistente-24-7.pid

echo "✅ ASSISTENTE 24/7 INICIADO!"
echo ""
echo "📊 PID: $PID"
echo "📝 Logs: tail -f /tmp/assistente-24-7.log"
echo ""
echo "📋 Comandos:"
echo "  tail -f /tmp/assistente-24-7.log     # Ver logs"
echo "  kill $(cat /tmp/assistente-24-7.pid) # Parar"
echo "  bash start-24-7.sh                   # Reiniciar"
echo ""
echo "🕐 Próximos horários:"
echo "  06:00 - Bom dia!"
echo "  08:00 - Briefing do Nicho 60+"
echo "  12:00 - Hora do Almoço"
echo "  18:00 - Fim do Expediente"
echo "  20:00 - Preparação para Amanhã"
echo ""
echo "💡 O assistente está rodando em background!"
echo "   Mesmo se você sair do terminal, ele continua."
