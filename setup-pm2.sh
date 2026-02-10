#!/bin/bash
# 🚀 MODO 24/7 COM PM2 (Mais fácil - não precisa root)

echo "🤖 Configurando Assistente 24/7 com PM2..."
echo ""

# Instalar PM2 globalmente se não tiver
if ! command -v pm2 &> /dev/null; then
    echo "📦 Instalando PM2..."
    npm install -g pm2
fi

cd /root/.openclaw/workspace/automacoes-surreais/16-assistente-pessoal

# Iniciar com PM2
echo "🚀 Iniciando serviço..."
pm2 start src/cron-scheduler.js --name "assistente-24-7" --log /var/log/assistente-24-7.log

# Salvar configuração
pm2 save

# Configurar para iniciar no boot
pm2 startup systemd -u root --hp /root

echo ""
echo "✅ ASSISTENTE 24/7 ATIVO!"
echo ""
echo "📋 Comandos PM2:"
echo "  pm2 status                    # Ver status"
echo "  pm2 logs assistente-24-7      # Ver logs"
echo "  pm2 stop assistente-24-7      # Parar"
echo "  pm2 restart assistente-24-7   # Reiniciar"
echo "  pm2 monit                     # Monitor em tempo real"
echo ""
echo "🕐 O assistente enviará mensagens nos horários programados!"
