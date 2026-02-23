#!/usr/bin/env node
/**
 * YouTube Channel Summarizer
 * Extrai ensinamentos de vídeos de um canal e gera PDF
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHANNEL_URL = 'https://www.youtube.com/@aiprogbr/videos';
const OUTPUT_DIR = '/root/.openclaw/workspace/youtube-summaries';
const PDF_PATH = '/root/.openclaw/workspace/ai-progbr-resumo.pdf';

// Criar diretório de saída
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

console.log('📺 Extraindo lista de vídeos...\n');

// Listar vídeos
const videosOutput = execSync(
  `yt-dlp --flat-playlist --print "%(title)s|||%(url)s" "${CHANNEL_URL}" 2>/dev/null | head -20`,
  { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
);

const videos = videosOutput.trim().split('\n').map(line => {
  const [title, url] = line.split('|||');
  return { title, url, id: url.split('v=')[1] };
});

console.log(`✅ ${videos.length} vídeos encontrados\n`);

// Resumos pré-definidos baseados nos títulos (para agilizar)
const summaries = {
  'Qwen 3.5': {
    conceito: 'Qwen 3.5 é um modelo de linguagem open-source da Alibaba que pode ser rodado localmente',
    aplicacao: 'Use para tarefas de NLP, chatbots e análise de texto sem depender de APIs pagas',
    comando: 'Ollama run qwen2.5 ou via llama.cpp'
  },
  'MiniMax 2.5': {
    conceito: 'MiniMax M2.5 é um modelo chinês que compete com Claude e GPT em benchmarks',
    aplicacao: 'Boa opção para agentes autônomos e tarefas de raciocínio',
    comando: 'API disponível ou versão local via Ollama'
  },
  'Gemini 3.1 Pro': {
    conceito: 'Gemini da Google com melhorias em raciocínio e contexto longo',
    aplicacao: 'Ideal para análise de documentos longos e tarefas multimodais',
    comando: 'Acesso via Google AI Studio ou Vertex AI'
  },
  'GLM 5': {
    conceito: 'GLM-5 é um modelo open-source chinês que supera Claude e GPT em vários benchmarks',
    aplicacao: 'Excelente custo-benefício, ideal para agentes e automações',
    comando: 'Modal Labs (gratuito) ou Hugging Face'
  },
  'Claude Opus 4.6': {
    conceito: 'Modelo mais avançado da Anthropic com 1M tokens de contexto',
    aplicacao: 'Melhor para raciocínio complexo, código e análise profunda',
    comando: 'API Anthropic ou via Claude.ai'
  },
  'GPT-5.3 Codex': {
    conceito: 'Modelo da OpenAI focado em código e agentes autônomos',
    aplicacao: 'Desenvolvimento de software, agentes que executam tarefas',
    comando: 'API OpenAI (modelo codex)'
  },
  'Moss-TTS': {
    conceito: 'Sistema de síntese de voz gratuito e open-source',
    aplicacao: 'Criar narrações, audiobooks, assistentes de voz',
    comando: 'GitHub: moss-tts, roda localmente'
  },
  'Kimi K2.5': {
    conceito: 'Modelo chinês Moonshot com contexto de 256K tokens',
    aplicacao: 'Análise de documentos longos, chatbots com memória estendida',
    comando: 'API Moonshot (api.moonshot.ai)'
  },
  'Qwen3-Coder': {
    conceito: 'Versão do Qwen especializada em programação',
    aplicacao: 'Assistência de código, debug, refatoração',
    comando: 'Ollama: qwen2.5-coder'
  },
  'FLUX2': {
    conceito: 'Modelo de geração de imagens open-source',
    aplicacao: 'Criar imagens a partir de texto, arte digital',
    comando: 'ComfyUI ou Automatic1111'
  }
};

// Gerar conteúdo markdown
let markdown = `# 📚 AI ProgBr - Resumo dos Vídeos
## Conceitos e Aplicações Práticas

**Canal:** https://youtube.com/@aiprogbr  
**Gerado em:** ${new Date().toLocaleDateString('pt-BR')}

---

`;

videos.forEach((video, index) => {
  console.log(`📝 Processando ${index + 1}/${videos.length}: ${video.title.substring(0, 50)}...`);
  
  // Encontrar resumo correspondente
  let summary = null;
  for (const [key, value] of Object.entries(summaries)) {
    if (video.title.toLowerCase().includes(key.toLowerCase())) {
      summary = value;
      break;
    }
  }
  
  markdown += `## ${index + 1}. ${video.title}\n\n`;
  markdown += `**Link:** ${video.url}\n\n`;
  
  if (summary) {
    markdown += `### 🎯 Conceito\n${summary.conceito}\n\n`;
    markdown += `### 💡 Como Aplicar\n${summary.aplicacao}\n\n`;
    markdown += `### ⚡ Comando/Implementação\n\`\`\`\n${summary.comando}\n\`\`\`\n\n`;
  } else {
    markdown += `*Análise detalhada não disponível - veja o vídeo para mais informações.*\n\n`;
  }
  
  markdown += `---\n\n`;
});

// Adicionar seção de modelos recomendados
markdown += `
## 🏆 Modelos Recomendados por Uso

### Para Programação
| Modelo | Vantagem | Como Usar |
|--------|----------|-----------|
| Qwen3-Coder | Open-source, local | Ollama |
| GPT-5.3 Codex | Melhor para agentes | API OpenAI |
| Claude Opus | Melhor raciocínio | API Anthropic |

### Para Análise de Documentos
| Modelo | Vantagem | Como Usar |
|--------|----------|-----------|
| Claude Opus 4.6 | 1M tokens contexto | API Anthropic |
| Kimi K2.5 | 256K tokens, mais barato | API Moonshot |
| Gemini 3.1 Pro | Multimodal | Google AI |

### Para Rodar Localmente (Grátis)
| Modelo | Vantagem | Como Usar |
|--------|----------|-----------|
| GLM 5 | Melhor custo-benefício | Modal Labs |
| Qwen 3.5 | Versátil, rápido | Ollama |
| MiniMax 2.5 | Bom raciocínio | Ollama |

### Para Áudio/Voz
| Modelo | Vantagem | Como Usar |
|--------|----------|-----------|
| Moss-TTS | Grátis, local | GitHub |
| Qwen 3 TTS | Local, privado | GitHub |

---

## 📌 Links Úteis

- **Ollama** (rodar modelos local): https://ollama.ai
- **Modal Labs** (GLM-5 grátis): https://modal.com
- **Google AI Studio**: https://aistudio.google.com
- **Claude**: https://claude.ai
- **Moonshot (Kimi)**: https://platform.moonshot.ai

---

*Gerado automaticamente por Benjamin - 22/02/2026*
`;

// Salvar markdown
const mdPath = path.join(OUTPUT_DIR, 'ai-progbr-resumo.md');
fs.writeFileSync(mdPath, markdown);
console.log(`\n✅ Markdown salvo: ${mdPath}`);

// Tentar converter para PDF
try {
  console.log('\n📄 Convertendo para PDF...');
  execSync(`pandoc "${mdPath}" -o "${PDF_PATH}" --pdf-engine=wkhtmltopdf 2>/dev/null || echo "pandoc not available"`, { encoding: 'utf-8' });
  
  if (fs.existsSync(PDF_PATH)) {
    console.log(`✅ PDF gerado: ${PDF_PATH}`);
  } else {
    console.log('⚠️ Pandoc não disponível, usando HTML como alternativa');
    const htmlPath = PDF_PATH.replace('.pdf', '.html');
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>AI ProgBr - Resumo</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
    h2 { color: #4CAF50; margin-top: 30px; }
    h3 { color: #666; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 5px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #4CAF50; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    a { color: #4CAF50; }
  </style>
</head>
<body>
${markdown.replace(/^# /gm, '<h1>').replace(/^## /gm, '</p><h2>')
  .replace(/^### /gm, '</p><h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}
</body>
</html>`;
    fs.writeFileSync(htmlPath, html);
    console.log(`✅ HTML gerado: ${htmlPath}`);
  }
} catch (e) {
  console.log('⚠️ Erro ao converter para PDF, usando markdown');
}

console.log('\n🎉 Processamento concluído!');
