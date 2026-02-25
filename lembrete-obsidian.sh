#!/bin/bash
# Lembrete: Configurar Obsidian na Nuvem
# Data: Quinta-feira, 26/02/2026 às 09:00

MENSAGEM="🔔 LEMBRETE: Configurar Obsidian na Nuvem

📅 Quinta-feira, 26 de Fevereiro de 2026

🎯 Tarefa: Mover vault do Obsidian para nuvem

📋 Opções:
1. Google Drive + rclone (gratuito)
2. Dropbox (gratuito até 2GB)
3. Syncthing (P2P gratuito)
4. Obsidian Sync (R$ 4-8/mês)

💡 Após configurar, o Ben poderá:
- Ler suas anotações
- Criar novos arquivos
- Sincronizar memória
- Automatizar criação de notas

Fale com o Ben para configurar! 🚀"

# Enviar via WhatsApp para o admin
openclaw message send --channel whatsapp --target "5511953545939" --message "$MENSAGEM" --json
