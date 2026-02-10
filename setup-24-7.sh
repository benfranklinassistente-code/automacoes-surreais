#!/bin/bash
# 🚀 SCRIPT DE INSTALAÇÃO - ASSISTENTE 24/7 AUTOMÁTICO
# Execute com: sudo bash setup-24-7.sh

echo "🤖 Configurando Assistente Pessoal 24/7..."
echo ""

# Criar serviço systemd
cat > /etc/systemd/system/assistente-24-7.service << 'EOF'
[Unit]
Description=Assistente Pessoal 24/7 - 60maisPlay
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/root/.openclaw/workspace/automacoes-surreais/16-assistente-pessoal
ExecStart=/usr/bin/node src/cron-scheduler.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=HOME=/root
StandardOutput=append:/var/log/assistente-24-7.log
StandardError=append:/var/log/assistente-24-7.log

[Install]
WantedBy=multi-user.target
EOF

# Criar diretório de logs se não existir
mkdir -p /var/log
touch /var/log/assistente-24-7.log

# Recarregar systemd
systemctl daemon-reload

# Habilitar serviço (inicia automaticamente no boot)
systemctl enable assistente-24-7

# Iniciar serviço
systemctl start assistente-24-7

echo ""
echo "✅ ASSISTENTE 24/7 CONFIGURADO!"
echo ""
echo "📋 Comandos úteis:"
echo "  sudo systemctl status assistente-24-7    # Ver status"
echo "  sudo systemctl stop assistente-24-7      # Parar"
echo "  sudo systemctl start assistente-24-7     # Iniciar"
echo "  sudo systemctl restart assistente-24-7   # Reiniciar"
echo "  tail -f /var/log/assistente-24-7.log     # Ver logs"
echo ""
echo "🕐 Horários ativos:"
echo "  06:00 - Bom dia!"
echo "  08:00 - Briefing do Nicho"
echo "  12:00 - Hora do Almoço"
echo "  18:00 - Fim do Expediente"
echo "  20:00 - Preparação para Amanhã"
echo ""
echo "🚀 O assistente está rodando 24/7!"
