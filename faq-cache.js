/**
 * FAQ Cache - Sistema de respostas pré-definidas para economizar tokens
 * Usado pelo Bot WhatsApp 60maisPlay
 */

const FAQ_CACHE = {
  // Saudações
  'oi': 'Olá! 👋 Sou o assistente 60maisPlay. Como posso te ajudar hoje?',
  'olá': 'Olá! 👋 Sou o assistente 60maisPlay. Como posso te ajudar hoje?',
  'bom dia': 'Bom dia! ☀️ Como posso te ajudar hoje?',
  'boa tarde': 'Boa tarde! 🌤️ Como posso te ajudar?',
  'boa noite': 'Boa noite! 🌙 Precisando de alguma ajuda?',
  
  // Identidade
  'quem é você': 'Sou o assistente virtual 60maisPlay! Ajudo com dúvidas de tecnologia, cursos e muito mais. 🤖',
  'quem e voce': 'Sou o assistente virtual 60maisPlay! Ajudo com dúvidas de tecnologia, cursos e muito mais. 🤖',
  'o que você faz': 'Ajudo com: tecnologia, cursos, dúvidas do dia a dia. Digite "ajuda" para ver opções.',
  
  // Ajuda
  'ajuda': `📱 *Comandos disponíveis:*
• "cursos" - ver cursos disponíveis
• "aula [tema]" - fazer aula sobre tema
• "dica" - dica de tecnologia
• "suporte" - falar com humano`,
  'menu': `📱 *Menu Principal:*
• "cursos" - ver cursos
• "aula [tema]" - fazer aula
• "dica" - dica tech
• "suporte" - falar humano`,
  
  // Cursos
  'cursos': `📚 *Cursos 60+:*
1. Smartphone Básico
2. WhatsApp Completo
3. Internet Segura
4. Facebook Social

Digite "aula [nome]" para começar!`,
  'curso': `📚 *Cursos 60+:*
1. Smartphone Básico
2. WhatsApp Completo
3. Internet Segura
4. Facebook Social

Digite "aula [nome]" para começar!`,
  
  // Suporte
  'suporte': '📞 Para falar com um atendente humano, ligue: (11) 99999-9999 ou aguarde que já respondemos.',
  'humano': '📞 Para atendimento humano: (11) 99999-9999. Respondemos em até 24h.',
  
  // Agradecimento
  'obrigado': 'Por nada! 😊 Estou aqui pra ajudar. Mais alguma dúvida?',
  'obrigada': 'Por nada! 😊 Estou aqui pra ajudar. Mais alguma dúvida?',
  'valeu': 'De nada! 👍 Precisando, é só chamar!',
  
  // Despedida
  'tchau': 'Até logo! 👋 Foi um prazer ajudar. Volte sempre!',
  'até mais': 'Até mais! 👋 Qualquer coisa é só chamar!',
  
  // Problemas comuns
  'esqueci a senha': 'Para recuperar senha:\n1. Vá em "Esqueci senha"\n2. Digite seu email\n3. Verifique sua caixa de entrada\n\nPosso ajudar com mais alguma coisa?',
  'não consigo entrar': 'Problemas de acesso:\n1. Verifique email/senha\n2. Tente "Esqueci senha"\n3. Limpe cache do navegador\n\nAinda com problemas? Digite "suporte".',
  'não funciona': 'Vou te ajudar! Me conta melhor o que está acontecendo? 🤔',
  
  // Preços
  'quanto custa': 'Nossos cursos começam em R$ 37,00. Temos opções parceladas! 💳',
  'preço': 'Cursos a partir de R$ 37,00. Fale com suporte para condições especiais! 💰',
  'valor': 'Investimento a partir de R$ 37,00 por mini curso. 📚',
  
  // Pagamento
  'como pagar': `💳 *Formas de pagamento:*
• Cartão (parcele em até 12x)
• PIX (5% de desconto)
• Boleto

Qual prefere?`,
  'pagamento': 'Aceitamos cartão, PIX e boleto! 💳 Qual sua preferência?',
  'valor': 'Cursos a partir de R$ 37,00. 💰',
  
  // ==================== NOVAS PERGUNTAS ====================
  
  // Tecnologia
  'o que é pdf': '📄 PDF é um formato de documento que pode ser aberto em qualquer aparelho sem perder a formatação.',
  'como abrir pdf': '📱 Toque no arquivo PDF. Se não abrir, baixe o app Adobe Acrobat Reader (grátis).',
  'o que é app': '📱 App = Aplicativo. É um programinha que você instala no celular.',
  'como baixar app': '📱 Vá na Play Store (Android) ou App Store (iPhone) e busque pelo nome do app.',
  
  // Internet
  'o que é wifi': '📶 WiFi é internet sem fio. Conecta seu celular/PC à internet pelo ar!',
  'sem internet': '🔴 Sem internet? Tente: 1) Reiniciar o roteador, 2) Checar se pagou a conta, 3) Ligar para operadora.',
  'internet lenta': '🐢 Internet lenta? Tente: 1) Reiniciar o roteador, 2) Checar quantos dispositivos conectados, 3) Mudar de lugar.',
  'o que é google': '🔍 Google é um site de busca. Digite sua dúvida e ele mostra respostas!',
  'como usar google': '🔍 1) Entre em google.com.br, 2) Digite sua dúvida, 3) Aperte Enter, 4) Clique nos resultados.',
  
  // WhatsApp
  'como usar whatsapp': '📱 WhatsApp básico: 1) Toque em "Conversas", 2) Clique no símbolo de mensagem, 3) Escolha o contato, 4) Digite e envie!',
  'enviar foto whatsapp': '📷 No chat: 1) Clique no clipe de papel, 2) Escolha "Câmera", 3) Tire ou escolha a foto, 4) Envie!',
  'fazer chamada whatsapp': '📞 No chat da pessoa: clique no ícone de telefone ou câmera (para vídeo).',
  'apagar mensagem': '❌ Pressione a mensagem e segure → clique "Apagar".',
  
  // Email
  'o que é email': '📧 Email = correio eletrônico. Funciona como uma carta digital.',
  'como criar email': '📧 1) Vá em gmail.com, 2) Clique "Criar conta", 3) Preencha seus dados.',
  'esqueci email': '📧 Na tela de login, clique "Esqueci minha senha" e siga as instruções.',
  
  // Segurança
  'vírus': '🦠 Sinais de vírus: celular lento, apps estranhos, popups. Instale um antivirus e evite sites suspeitos.',
  'antivírus': '🛡️ Antivírus recomendados: Avast, Kaspersky, McAfee. Tem versões gratuitas!',
  'site seguro': '🔒 Site seguro tem: 1) Cadeado na barra, 2) Endereço começa com https://',
  
  // Netflix/Streaming
  'como usar netflix': '🎬 1) Abra a Netflix, 2) Escolha um perfil, 3) Navegue pelos filmes, 4) Clique para assistir!',
  'netflix não funciona': '🔴 Tente: 1) Verificar internet, 2) Atualizar o app, 3) Reiniciar o aparelho.',
  
  // Zoom
  'como usar zoom': '📹 1) Instale o app Zoom, 2) Crie uma conta, 3) Clique "Nova Reunião" ou entre com código.',
  'entrar na reunião': '📹 Clique no link que receberam, ou abra o Zoom e digite o código da reunião.',
  
  // Smartphone
  'celular lento': '🐢 Celular lento? 1) Feche apps abertos, 2) Apague fotos velhas, 3) Reinicie o aparelho.',
  'sem espaço': '📦 Sem espaço? Apague: fotos velhas, apps não usados, vídeos pesados.',
  'bateria acabando': '🔋 Dicas: 1) Diminuir brilho, 2) Fechar apps em segundo plano, 3) Usar modo economia.',
  
  // Gov.br
  'gov.br': '🏛️ gov.br é o portal do governo. Use para: CPF, CNH, aposentadoria, e muito mais.',
  'como acessar gov.br': '🏛️ 1) Entre em gov.br, 2) Clique "Entrar", 3) Use seu CPF e senha.',
  
  // Erros comuns
  'não sei': '🤔 Tudo bem! Me conta melhor o que precisa que eu explico passo a passo.',
  'não entendi': '📝 Vou explicar de outro jeito! O que não ficou claro?',
  'ajuda comprovante': '📄 Para comprovantes: 1) Acesse o site/app, 2) Busque "Comprovantes", 3) Baixe ou imprima.',
  
  // Horário
  'que horas são': new Date().toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'}),
  'que dia é hoje': new Date().toLocaleDateString('pt-BR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})
};

// Templates de resposta curta
const TEMPLATES = {
  confirmacao: '✅ Pronto! {acao}',
  erro: '❌ Ops! {erro}. Tente novamente ou digite "suporte".',
  aguarde: '⏳ Aguarde um momento...',
  sucesso: '✅ {mensagem}',
  info: 'ℹ️ {mensagem}',
  proximo: '➡️ {mensagem}'
};

// Normaliza texto para busca
function normalize(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^\w\s]/g, '') // Remove pontuação
    .trim();
}

// Busca resposta no cache
function findInCache(userMessage) {
  const normalized = normalize(userMessage);
  
  // Busca exata
  if (FAQ_CACHE[normalized]) {
    return {
      found: true,
      response: FAQ_CACHE[normalized],
      cached: true
    };
  }
  
  // Busca parcial
  for (const [key, value] of Object.entries(FAQ_CACHE)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return {
        found: true,
        response: value,
        cached: true,
        partial: true
      };
    }
  }
  
  return { found: false };
}

// Aplica template
function applyTemplate(templateName, vars) {
  let template = TEMPLATES[templateName];
  if (!template) return null;
  
  for (const [key, value] of Object.entries(vars)) {
    template = template.replace(`{${key}}`, value);
  }
  
  return template;
}

// Estatísticas de economia
let stats = {
  hits: 0,
  misses: 0,
  tokensSaved: 0
};

function getStats() {
  return {
    ...stats,
    hitRate: stats.hits + stats.misses > 0 
      ? ((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1) + '%'
      : '0%'
  };
}

function recordHit(estimatedTokens = 100) {
  stats.hits++;
  stats.tokensSaved += estimatedTokens;
}

function recordMiss() {
  stats.misses++;
}

module.exports = {
  findInCache,
  applyTemplate,
  getStats,
  recordHit,
  recordMiss,
  FAQ_CACHE,
  TEMPLATES
};
