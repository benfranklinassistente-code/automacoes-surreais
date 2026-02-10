# 🎙️ AUTOMAÇÃO #19 - CLONE DE VOZ

Sistema para criar áudios personalizados usando voz clonada.

## 🎯 Objetivo
Criar mensagens de áudio "sua voz" automaticamente para:
- Boas-vindas personalizadas
- Avisos de novas aulas
- Mensagens de aniversário
- Notificações de desconto

## 📁 Estrutura

```
19-clone-voz/
├── README.md
├── audios/
│   ├── boas-vindas/
│   ├── lembretes/
│   └── promocoes/
├── scripts/
│   ├── gerar-audio.py
│   └── enviar-whatsapp.js
├── templates/
│   └── mensagens.json
└── config/
    └── voz-config.json
```

## 🚀 Como funciona

### 1. Treinamento (uma vez)
- Gravar 10 minutos de áudio
- Processar com ElevenLabs ou similar
- Salvar modelo de voz

### 2. Uso automático
```bash
# Gerar áudio de boas-vindas
./gerar-audio.py --tipo boas-vindas --aluno "Dona Maria"

# Resultado: audio-dona-maria-boas-vindas.mp3
```

### 3. Envio
- WhatsApp automaticamente
- Email com anexo
- Download na plataforma

## 💡 Exemplos de uso

### Boas-vindas personalizada
**Entrada:** Nome do aluno
**Saída:** Áudio 30s: "Olá Dona Maria, seja bem-vinda ao 60maisPlay..."

### Lembrete de aula
**Entrada:** Nome + Nome da aula
**Saída:** Áudio 15s: "Oi Dona Maria, sua aula de WhatsApp está te esperando..."

## 🔧 Implementação

### Ferramentas necessárias
- ElevenLabs API (voz)
- WhatsApp Business API (envio)
- FFmpeg (processamento)

### Custo estimado
- ElevenLabs: ~$5/mês (plano básico)
- WhatsApp: Gratuito (própria API)

---
*Automação #19 - Em desenvolvimento*
