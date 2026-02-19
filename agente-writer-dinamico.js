/**
 * 🤖 SUB-AGENTE WRITER DINÂMICO
 * Gera conteúdo de newsletter usando OpenClaw nativo
 * Tema vem dinamicamente do Google Trends/Analytics
 * 
 * NOTA: Este módulo exporta dados para serem usados com ferramentas nativas
 */

/**
 * Gera prompt estruturado para o Writer
 * @param {Object} temaInfo - Informações do tema selecionado
 * @param {string} pesquisa - Resultado da pesquisa web sobre o tema
 * @returns {string} Prompt completo
 */
function criarPromptWriter(temaInfo, pesquisa = '') {
  const { tema, titulo, urgencia } = temaInfo;
  
  return `Você é o Professor Luis do canal 60maisPlay, especialista em ensinar tecnologia para pessoas de 60+ anos de forma simples, paciente e carinhosa.

Tema selecionado: ${tema}
Título sugerido: ${titulo}
Nível de urgência: ${urgencia}/10

${pesquisa ? `## DADOS DE PESQUISA RECENTE:\n${pesquisa}\n` : ''}

---

Crie uma NEWSLETTER COMPLETA seguindo a estrutura abaixo. O conteúdo deve ser APLICÁVEL - o leitor deve conseguir resolver o problema lendo a dica gratuita.

## ESTRUTURA OBRIGATÓRIA:

### 1. REFLEXÃO DO DIA
Uma frase inspiradora curta relacionada ao tema (1 linha)

### 2. STORY (História)
- Uma história real ou hipotética de uma pessoa 60+ enfrentando o problema
- Use linguagem afetuosa e metáforas familiares
- 150-200 palavras
- Crie conexão emocional

### 3. LESSON (Lição)
- O que essa história nos ensina?
- Conecte o problema à solução
- 30-50 palavras

### 4. TUTORIAL COMPLETO (A DICA DE VALOR)
Este é o CORAÇÃO da newsletter. Deve ser um tutorial COMPLETO que o leitor pode aplicar AGORA.

Estrutura do tutorial:
- Título do tutorial
- Introdução (o que vamos aprender)
- 5 PASSOS detalhados, cada um com:
  * Título do passo
  * Explicação clara
  * Ação concreta (o que fazer)
  * Exemplo prático
- Checklist que o leitor pode salvar

### 5. O QUE MAIS VOCÊ PODE APRENDER (Bridge para produto)
- Liste 3-5 tópicos relacionados que o leitor poderia aprender
- Mencione que existem DEZENAS de outros temas
- Não seja agressivo, apenas informativo

### 6. DICA DE SEGURANÇA
Uma dica extra de segurança relacionada ao tema

---

## REGRAS DE ESCRITA:

✅ Linguagem simples e acessível (sem jargões técnicos)
✅ Use analogias do dia a dia (ex: "como organizar um armário")
✅ Seja específico: diga ONDE clicar, COMO fazer
✅ Use emojis com moderação (🌟 💡 📱 🔒 ✅ ❌)
✅ Trate o leitor com respeito e carinho
✅ O tutorial DEVE resolver o problema de verdade
✅ Deixe claro que o produto oferece MAIS conteúdo, não o mesmo

❌ Não seja repetitivo
❌ Não use linguagem técnica difícil
❌ Não seja genérico ou vago
❌ Não faça propaganda agressiva

---

Retorne APENAS um JSON válido (sem markdown, sem comentários):

{
  "reflexao": "...",
  "story": "...",
  "lesson": "...",
  "tutorial": {
    "titulo": "...",
    "introducao": "...",
    "passos": [
      {
        "numero": 1,
        "titulo": "...",
        "explicacao": "...",
        "acao": "...",
        "exemplo": "..."
      }
    ],
    "checklist": "..."
  },
  "oQueMaisAprender": "...",
  "seguranca": "...",
  "score": 8.5
}`;
}

/**
 * Gera query de pesquisa baseada no tema
 */
function gerarQueryPesquisa(tema) {
  const queries = {
    'golpe PIX': 'golpe pix como evitar idosos 2026 dicas segurança',
    'segurança celular': 'segurança celular idosos dicas proteger golpe',
    'videochamada': 'como fazer videochamada whatsapp idosos tutorial',
    'WhatsApp': 'whatsapp dicas idosos tutorial básico segurança',
    'senha banco': 'senha banco celular segurança idosos proteger',
    'aplicativo idoso': 'melhores aplicativos idosos 2026 gratuitos úteis',
    'Google Fotos': 'google fotos backup fotos idosos tutorial',
    'Facebook': 'facebook segurança idosos privacidade configurar'
  };
  
  return queries[tema] || `${tema} dicas tutorial idosos`;
}

/**
 * Processa resposta da IA e extrai JSON
 */
function processarRespostaIA(resposta) {
  try {
    // Tentar parsear diretamente
    const json = JSON.parse(resposta);
    return json;
  } catch (e) {
    // Tentar extrair JSON da resposta
    const jsonMatch = resposta.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e2) {
        console.log('⚠️ Erro ao extrair JSON da resposta');
        return null;
      }
    }
    return null;
  }
}

/**
 * Fallback com conteúdo básico
 */
function gerarConteudoFallback(tema, titulo) {
  return {
    titulo: `🚨 ${titulo}`,
    tema: tema,
    reflexao: '🌟 "A tecnologia é uma ponte que nos conecta com o que mais amamos."',
    story: `Todos os dias, descubro novas histórias de pessoas como você que estão aprendendo a usar a tecnologia com mais confiança.\n\nNão é sobre ser especialista, é sobre se sentir seguro e conectado com a família e amigos.`,
    lesson: 'Um passo de cada vez, você pode dominar qualquer ferramenta digital!',
    tutorial: {
      titulo: `📖 Guia Prático: ${titulo}`,
      introducao: 'Vou te ensinar o passo a passo completo para você resolver isso agora.',
      passos: [
        {
          numero: 1,
          titulo: 'Identifique o problema',
          explicacao: 'Primeiro, entenda exatamente o que você precisa fazer.',
          acao: 'Respire fundo e defina claramente o que quer aprender.',
          exemplo: 'Exemplo: "Quero aprender a fazer uma videochamada com meus netos."'
        },
        {
          numero: 2,
          titulo: 'Encontre a ferramenta certa',
          explicacao: 'Para cada problema, existe uma ferramenta simples e gratuita.',
          acao: 'Pergunte a um familiar ou procure no YouTube "como [seu problema] passo a passo".',
          exemplo: 'WhatsApp é ideal para videochamadas com a família.'
        },
        {
          numero: 3,
          titulo: 'Pratique sem medo',
          explicacao: 'Errar faz parte do aprendizado. Não tenha vergonha!',
          acao: 'Tente fazer sozinho uma vez. Se não conseguir, peça ajuda.',
          exemplo: 'Ligue para um neto e peça para ele te ensinar devagarzinho.'
        },
        {
          numero: 4,
          titulo: 'Anote os passos',
          explicacao: 'Escrever ajuda a memorizar e consultar depois.',
          acao: 'Use um caderninho ou peça para alguém anotar para você.',
          exemplo: 'Anote: "1. Abrir WhatsApp 2. Clicar na câmera 3. Chamar neto"'
        },
        {
          numero: 5,
          titulo: 'Pratique novamente',
          explicacao: 'A repetição é o segredo do aprendizado.',
          acao: 'Faça o mesmo processo 3 vezes seguidas.',
          exemplo: 'Hoje, amanhã e depois de amanhã, pratique a mesma tarefa.'
        }
      ],
      checklist: `☐ Identifiquei o que quero aprender\n☐ Encontrei a ferramenta certa\n☐ Pratiquei sem medo de errar\n☐ Anotei os passos principais\n☐ Pratiquei 3 vezes`
    },
    oQueMaisAprender: `🎓 Quer aprender mais? No Mini Cursos 60+ você encontra dezenas de tutoriais passo a passo, com vídeos explicando devagarzinho! Acesse: 60maiscursos.com.br`,
    seguranca: 'Nunca compartilhe senhas com desconhecidos!',
    score: 7,
    dinamico: false
  };
}

/**
 * Formata o conteúdo para HTML do email
 */
function formatarHTML(conteudo) {
  const { reflexao, story, lesson, tutorial, oQueMaisAprender, seguranca } = conteudo;
  
  let html = `
    <!-- Reflexão -->
    <div style="background: #f8f9fa; border-left: 4px solid #1e3a5f; padding: 15px; margin-bottom: 20px;">
      <p style="margin: 0; font-style: italic; font-size: 16px;">${reflexao}</p>
    </div>

    <!-- Story -->
    <div style="font-size: 16px; line-height: 1.6; color: #333;">
      ${story}
    </div>

    <!-- Lesson -->
    <div style="background: #fff3cd; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 16px;">💡 <strong>O que isso nos ensina:</strong> ${lesson}</p>
    </div>

    <!-- Tutorial Completo -->
    <h3 style="color: #1e3a5f; font-size: 20px; margin-top: 30px;">${tutorial.titulo}</h3>
    
    <p style="font-size: 16px; line-height: 1.6;">${tutorial.introducao}</p>

    <div style="background: #e8f4f8; border-radius: 8px; padding: 20px; margin: 20px 0;">
      ${tutorial.passos.map(p => `
        <div style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px dashed #ccc;">
          <h4 style="color: #1e3a5f; margin: 0 0 10px 0;">${p.numero}. ${p.titulo}</h4>
          <p style="margin: 5px 0;"><strong>Explicação:</strong> ${p.explicacao}</p>
          <p style="margin: 5px 0; color: #2e7d32;"><strong>✅ Ação:</strong> ${p.acao}</p>
          <p style="margin: 5px 0; background: #fff; padding: 10px; border-radius: 5px;"><strong>Exemplo:</strong> ${p.exemplo}</p>
        </div>
      `).join('')}
    </div>

    <!-- Checklist -->
    <div style="background: #d4edda; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <h4 style="margin: 0 0 10px 0;">📋 CHECKLIST - Salve esta mensagem!</h4>
      <pre style="margin: 0; font-family: Arial, sans-serif; white-space: pre-wrap;">${tutorial.checklist}</pre>
    </div>

    <!-- O que mais aprender -->
    <div style="background: #f5f5f5; border-radius: 8px; padding: 15px; margin: 20px 0;">
      ${oQueMaisAprender}
    </div>
  `;

  if (seguranca) {
    html += `
    <!-- Dica de Segurança -->
    <div style="background: #ffebee; border-radius: 8px; padding: 15px; margin: 20px 0;">
      <p style="margin: 0; font-size: 15px;">🛡️ <strong>Dica de Segurança:</strong> ${seguranca}</p>
    </div>
    `;
  }

  return html;
}

module.exports = {
  criarPromptWriter,
  gerarQueryPesquisa,
  processarRespostaIA,
  gerarConteudoFallback,
  formatarHTML
};
