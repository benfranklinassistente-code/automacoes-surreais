#!/bin/bash
# Aprendizagem Diária - Execução via CRON do sistema
cd /root/.openclaw/workspace
node sessao-aprendizagem.js >> /tmp/aprendizagem.log 2>&1
echo "$(date): Aprendizagem executada" >> /tmp/aprendizagem.log
