/**
 * Templates de Respostas Curtas
 * Economia de tokens com respostas padronizadas
 */

module.exports = {
  // ==================== SAUDAÇÕES ====================
  saudacao: {
    curto: 'Olá! 👋 Como posso ajudar?',
    medio: 'Olá! 👋 Sou o assistente 60maisPlay. Digite "menu" para ver opções.'
  },
  
  // ==================== CONFIRMAÇÕES ====================
  confirmacao: {
    ok: '✅ Pronto!',
    feito: '✅ Feito!',
    salvo: '✅ Salvo!',
    enviado: '✅ Enviado!',
    aguardando: '⏳ Aguarde...'
  },
  
  // ==================== ERROS ====================
  erro: {
    geral: '❌ Ops! Algo deu errado.',
    naoEntendi: '❓ Não entendi. Tente novamente.',
    invalido: '❌ Opção inválida.',
    tenteSuporte: '❌ Erro. Digite "suporte" para ajuda.'
  },
  
  // ==================== NAVEGAÇÃO ====================
  navegacao: {
    menu: '📱 Digite "menu" para opções.',
    voltar: '◀️ Digite "voltar" para retornar.',
    continuar: '➡️ Digite "continuar" para prosseguir.'
  },
  
  // ==================== AÇÕES ====================
  acoes: {
    processando: '⏳ Processando...',
    aguarde: '⏳ Aguarde um momento...',
    carregando: '⏳ Carregando...',
    verificando: '⏳ Verificando...'
  },
  
  // ==================== RESPOSTAS RÁPIDAS ====================
  rapido: {
    sim: '✅ Sim!',
    nao: '❌ Não.',
    ok: '👍 OK!',
    perfeito: '✨ Perfeito!',
    entendi: '👌 Entendi!'
  },
  
  // ==================== INSTRUÇÕES ====================
  instrucoes: {
    digiteOpcao: '💬 Digite o número da opção.',
    escolhaUm: '👆 Escolha uma opção acima.',
    informeDados: '📝 Informe os dados solicitados.'
  },
  
  // ==================== CONTATO ====================
  contato: {
    suporte: '📞 Suporte: digite "suporte"',
    humano: '👤 Para falar com humano, digite "suporte".',
    email: '📧 contato@60maiscursos.com.br'
  },
  
  // ==================== AGRADECIMENTOS ====================
  agradecimento: {
    obrigado: '😊 Por nada!',
    disponha: '👍 Disponha!',
    sempre: '🤝 Sempre às ordens!'
  },
  
  // ==================== DESPEDIDA ====================
  despedida: {
    tchau: '👋 Até logo!',
    ateMais: '👋 Até mais!',
    volteSempre: '👋 Volte sempre!'
  },
  
  // ==================== FUNÇÕES AUXILIARES ====================
  
  /**
   * Retorna resposta curta por padrão
   * @param {string} categoria - categoria do template
   * @param {string} tipo - tipo da resposta
   * @param {boolean} longo - se true, retorna versão longa
   */
  get(categoria, tipo, longo = false) {
    const cat = this[categoria];
    if (!cat) return null;
    
    if (typeof cat[tipo] === 'object') {
      return longo ? cat[tipo].medio || cat[tipo].curto : cat[tipo].curto;
    }
    
    return cat[tipo] || null;
  },
  
  /**
   * Aplica variáveis em template
   * @param {string} template - template com {variaveis}
   * @param {object} vars - objeto com valores
   */
  format(template, vars = {}) {
    let result = template;
    for (const [key, value] of Object.entries(vars)) {
      result = result.replace(new RegExp(`{${key}}`, 'g'), value);
    }
    return result;
  },
  
  /**
   * Resposta rápida (1 linha, < 50 chars)
   */
  rapidoResposta(tipo) {
    const respostas = {
      sim: '✅ Sim!',
      nao: '❌ Não.',
      ok: '👍',
      entendi: '👌',
      aguarde: '⏳',
      feito: '✅',
      erro: '❌',
      duvida: '❓'
    };
    return respostas[tipo] || '👍';
  }
};
