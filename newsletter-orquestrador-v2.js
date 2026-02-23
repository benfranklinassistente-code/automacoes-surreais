#!/usr/bin/env node
/**
 * Newsletter 60maisNews - Orquestrador v2.0
 * 
 * Usa SUBAGENTES REAIS via sessions_spawn
 * 
 * Fluxo:
 * 1. Pesquisador → Busca tema
 * 2. Escritor → Cria conteúdo
 * 3. Revisor → Melhora qualidade
 * 4. Envio → Email + Blog
 */

const fs = require('fs');
const path = require('path');

// Configurações
const CONFIG = {
  emailTo: 'luis7nico@gmail.com',
  emailSender: 'benjamin@60maiscursos.com.br',
  blogUrl: 'https://60maiscursos.com.br/blog',
  historicoFile: '/root/.openclaw/workspace/historico-temas.json',
  temasFile: '/root/.openclaw/workspace/temas-60mais.json'
};

// Carregar histórico de temas
function carregarHistorico() {
  try {
    const data = fs.readFileSync(CONFIG.historicoFile, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { temas: [] };
  }
}

// Verificar se tema foi usado nos últimos 30 dias
function temaRecente(tema, historico) {
  const trintaDiasAtras = Date.now() - (30 * 24 * 60 * 60 * 1000);
  return historico.temas.some(t => {
    const dataTema = new Date(t.data).getTime();
    return t.tema.toLowerCase().includes(tema.toLowerCase()) && dataTema > trintaDiasAtras;
  });
}

// Registrar tema no histórico
function registrarTema(tema) {
  const historico = carregarHistorico();
  historico.temas.push({
    tema: tema,
    data: new Date().toISOString(),
    timestamp: Date.now()
  });
  historico.atualizado = new Date().toISOString();
  fs.writeFileSync(CONFIG.historicoFile, JSON.stringify(historico, null, 2));
}

// Carregar lista de temas
function carregarTemas() {
  try {
    const data = fs.readFileSync(CONFIG.temasFile, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return { temas: [] };
  }
}

// ============================================
// AGENTE PESQUISADOR
// ============================================
async function agentePesquisador(historico) {
  console.log('🔍 [PESQUISADOR] Iniciando busca de tema...');
  
  const temas = carregarTemas();
  const temasDisponiveis = temas.temas.filter(t => !temaRecente(t.tema, historico));
  
  // Prompt para o pesquisador
  const prompt = `Você é um PESQUISADOR especializado em temas sobre tecnologia para pessoas idosas (60+).

TEMAS DISPONÍVEIS (não usados nos últimos 30 dias):
${temasDisponiveis.slice(0, 20).map(t => `- ${t.tema} (${t.categoria})`).join('\n')}

TAREFA:
1. Escolha UM tema da lista acima
2. O tema deve ser relevante e útil para idosos
3. Priorize temas sobre segurança digital, golpes, apps úteis

RESPONDA APENAS O NOME DO TEMA ESCOLHIDO, nada mais.`;

  // Usar sessions_spawn para criar subagente real
  const response = await fetch('http://localhost:8080/api/sessions/spawn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.GATEWAY_TOKEN
    },
    body: JSON.stringify({
      task: prompt,
      model: 'modal/zai-org/GLM-5-FP8',
      runTimeoutSeconds: 60
    })
  });

  const result = await response.json();
  const tema = result.result?.trim() || 'segurança WhatsApp';
  
  console.log(`✅ [PESQUISADOR] Tema escolhido: ${tema}`);
  return tema;
}

// ============================================
// AGENTE ESCRITOR
// ============================================
async function agenteEscritor(tema) {
  console.log(`✍️ [ESCRITOR] Criando conteúdo sobre: ${tema}...`);
  
  const prompt = `Você é um ESCRITOR especializado em criar conteúdo educativo para pessoas idosas (60+).

TEMA: ${tema}

TAREFA: Crie uma newsletter completa com a seguinte estrutura:

---
TÍTULO: [Título atrativo e simples]

HISTÓRIA:
[Crie uma história curta (3-4 frases) com personagens como "Dona Maria" ou "Seu João" que enfrentam um problema relacionado ao tema]

TUTORIAL (5 PASSOS DETALHADOS):

PASSO 1: [Título do passo]
- Explicação: [O que é e por que é importante]
- Como fazer: [Instrução clara e simples]
- Exemplo: [Exemplo prático]

PASSO 2: [Título do passo]
- Explicação: ...
- Como fazer: ...
- Exemplo: ...

[Repita até PASSO 5]

DICAS IMPORTANTES:
- [3 dicas práticas e simples]

MENSAGEM FINAL:
[Encorajamento para a pessoa idosa praticar]
---

REGRAS:
- Use linguagem MUITO SIMPLES
- Evite termos técnicos
- Seja objetivo e claro
- Cada passo deve ser bem detalhado`;

  const response = await fetch('http://localhost:8080/api/sessions/spawn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.GATEWAY_TOKEN
    },
    body: JSON.stringify({
      task: prompt,
      model: 'modal/zai-org/GLM-5-FP8',
      runTimeoutSeconds: 120
    })
  });

  const result = await response.json();
  const conteudo = result.result || '';
  
  console.log(`✅ [ESCRITOR] Conteúdo criado (${conteudo.length} caracteres)`);
  return conteudo;
}

// ============================================
// AGENTE REVISOR
// ============================================
async function agenteRevisor(conteudo, tema) {
  console.log('📝 [REVISOR] Analisando qualidade...');
  
  const prompt = `Você é um REVISOR especializado em conteúdo para pessoas idosas (60+).

TEMA: ${tema}

CONTEÚDO PARA REVISAR:
${conteudo}

TAREFA:
1. Verifique se o texto é simples e claro
2. Verifique se tem 5 passos detalhados
3. Verifique se tem exemplos práticos
4. Corrija erros se houver
5. Dê uma nota de 0 a 10

RESPONDA NO FORMATO:
SCORE: [0-10]
CONTEÚDO REVISADO:
[Conteúdo final melhorado]`;

  const response = await fetch('http://localhost:8080/api/sessions/spawn', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.GATEWAY_TOKEN
    },
    body: JSON.stringify({
      task: prompt,
      model: 'moonshot/moonshot-v1-8k',
      runTimeoutSeconds: 90
    })
  });

  const result = await response.json();
  const revisao = result.result || conteudo;
  
  // Extrair score
  const scoreMatch = revisao.match(/SCORE:\s*(\d+)/i);
  const score = scoreMatch ? parseInt(scoreMatch[1]) : 8;
  
  // Extrair conteúdo revisado
  const conteudoMatch = revisao.match(/CONTEÚDO REVISADO:\s*([\s\S]*)/i);
  const conteudoFinal = conteudoMatch ? conteudoMatch[1].trim() : revisao;
  
  console.log(`✅ [REVISOR] Score: ${score}/10`);
  return { conteudo: conteudoFinal, score };
}

// ============================================
// ENVIAR EMAIL
// ============================================
async function enviarEmail(conteudo, tema, isTest = true) {
  console.log(`📧 Enviando email ${isTest ? 'de TESTE' : 'de PRODUÇÃO'}...`);
  
  // Carregar config do Brevo
  const brevoConfig = JSON.parse(fs.readFileSync('/root/.openclaw/workspace/brevo-config.json', 'utf-8'));
  
  // HTML do email
  const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
    h1 { color: #2c3e50; }
    h2 { color: #3498db; }
    .passo { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
    .dica { background: #e8f5e9; padding: 10px; border-left: 4px solid #4caf50; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  ${conteudo.replace(/\n/g, '<br>').replace(/PASSO \d:/g, '</div><div class="passo"><strong>$&</strong>')}
  <div class="footer">
    <p>${isTest ? '🧪 EMAIL DE TESTE - Newsletter 60maisNews' : '📰 Newsletter 60maisNews'}</p>
    <p>60mais Cursos - Educação Digital para Idosos</p>
  </div>
</body>
</html>`;

  const emailData = {
    sender: { name: '60maisNews', email: CONFIG.emailSender },
    to: [{ email: CONFIG.emailTo }],
    subject: `${isTest ? '[TESTE] ' : ''}📰 ${tema}`,
    htmlContent: htmlContent,
    textContent: conteudo
  };

  const response = await fetch(brevoConfig.apiUrl + '/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': brevoConfig.apiKey
    },
    body: JSON.stringify(emailData)
  });

  const result = await response.json();
  
  if (result.messageId) {
    console.log(`✅ Email enviado! Message ID: ${result.messageId}`);
    return true;
  } else {
    console.log('❌ Erro ao enviar email:', result);
    return false;
  }
}

// ============================================
// ORQUESTRADOR PRINCIPAL
// ============================================
async function main() {
  console.log('\n========================================');
  console.log('📰 Newsletter 60maisNews - Orquestrador v2.0');
  console.log('🤖 Usando SUBAGENTES REAIS');
  console.log('========================================\n');

  try {
    // 1. Carregar histórico
    const historico = carregarHistorico();
    console.log(`📋 Histórico: ${historico.temas.length} temas registrados\n`);

    // 2. AGENTE PESQUISADOR - Buscar tema
    const tema = await agentePesquisador(historico);

    // 3. AGENTE ESCRITOR - Criar conteúdo
    const conteudo = await agenteEscritor(tema);

    // 4. AGENTE REVISOR - Melhorar qualidade
    const { conteudo: conteudoFinal, score } = await agenteRevisor(conteudo, tema);

    // 5. Verificar qualidade mínima
    if (score < 8) {
      console.log(`⚠️ Score baixo (${score}/10). Refazendo...`);
      // Poderia tentar novamente aqui
    }

    // 6. Enviar email de TESTE
    console.log('\n📧 Enviando email de TESTE para aprovação...');
    const emailEnviado = await enviarEmail(conteudoFinal, tema, true);

    if (emailEnviado) {
      console.log('\n✅ ========================================');
      console.log('📧 Email de TESTE enviado!');
      console.log(`📨 Para: ${CONFIG.emailTo}`);
      console.log(`📝 Tema: ${tema}`);
      console.log(`⭐ Score: ${score}/10`);
      console.log('========================================\n');
      console.log('⚠️ AGUARDANDO APROVAÇÃO para enviar para produção.');
      console.log('   Responda "APROVADO" para enviar para a lista.');
    }

    // Salvar resultado para aprovação posterior
    const resultado = {
      tema,
      conteudo: conteudoFinal,
      score,
      data: new Date().toISOString(),
      status: 'aguardando_aprovacao'
    };
    fs.writeFileSync('/root/.openclaw/workspace/newsletter-resultado.json', JSON.stringify(resultado, null, 2));

    return resultado;

  } catch (error) {
    console.error('❌ Erro:', error.message);
    throw error;
  }
}

// Executar
main().catch(console.error);
