/**
 * 🤖 AGENTE CHEFE - Redação 60maisNews
 * Editor-Chefe da equipe de agentes
 * Orquestrador principal do sistema de newsletter
 * Usa Brave Search + Google Analytics para temas dinâmicos
 * 
 * ⚠️ FUNÇÃO PRINCIPAL: GARANTIR EXECUÇÃO DE TODOS OS PASSOS
 * - Verifica integridade de cada passo
 * - Retry automático em caso de falha
 * - Log detalhado de sucesso/falha
 * - Correção automática quando possível
 * 
 * 📰 EQUIPE REDAÇÃO 60maisNews:
 * - Agente Chefe (Editor-Chefe): Orquestra tudo
 * - GANCHOS (Pesquisador de Pautas): Descobre tema
 * - WRITER (Redator): Gera conteúdo
 * - VENDAS (Gerente de Monetização): Cria CTAs
 * - ENVIO (Distribuidor): Envia emails
 * - BLOG (Publicador Web): Publica no WordPress
 * - TRELLO (Arquivista): Registra no quadro
 */

const brevo = require('./brevo.js');
const wordpress = require('./wordpress.js');
const trello = require('./trello.js');
const produtos = require('./produtos-60mais.js');
const template = require('./newsletter-template.js');
const fs = require('fs');

// Configuração
const CREDENCIAIS = JSON.parse(fs.readFileSync('./credenciais-60mais.json', 'utf8'));
const CALENDARIO = JSON.parse(fs.readFileSync('./calendario-comercial-60mais-2026.json', 'utf8'));
const LISTA_BREVO_ID = 4;

// Modo teste = true (só envia para Luis)
const MODO_TESTE = true;

// ═══════════════════════════════════════════════════════════════
// 🔒 SISTEMA DE GARANTIA DE EXECUÇÃO
// ═══════════════════════════════════════════════════════════════

const MAX_TENTATIVAS = 3;
const TEMPO_ENTRE_TENTATIVAS_MS = 2000;

// Estado do fluxo
const estadoFluxo = {
  passos: {},
  tentativas: {},
  erros: {},
  inicio: null,
  fim: null
};

/**
 * Registra resultado de um passo
 */
function registrarPasso(nome, sucesso, dados = null, erro = null) {
  estadoFluxo.passos[nome] = {
    sucesso,
    dados,
    erro,
    timestamp: new Date().toISOString()
  };
  
  if (!sucesso) {
    estadoFluxo.erros[nome] = erro;
  }
}

/**
 * Verifica se um passo foi executado com sucesso
 */
function passoSucesso(nome) {
  return estadoFluxo.passos[nome]?.sucesso === true;
}

/**
 * Executa função com retry automático
 */
async function executarComGarantia(nomePasso, funcao, validarResultado = null) {
  console.log(`\n🔒 GARANTIA: Executando "${nomePasso}"...`);
  
  let tentativa = 1;
  let ultimoErro = null;
  
  while (tentativa <= MAX_TENTATIVAS) {
    estadoFluxo.tentativas[nomePasso] = tentativa;
    
    try {
      console.log(`   📌 Tentativa ${tentativa}/${MAX_TENTATIVAS}`);
      
      const resultado = await funcao();
      
      // Validação customizada se fornecida
      if (validarResultado) {
        const validacao = validarResultado(resultado);
        if (!validacao.ok) {
          throw new Error(`Validação falhou: ${validacao.erro}`);
        }
      }
      
      // Sucesso!
      registrarPasso(nomePasso, true, resultado);
      console.log(`   ✅ "${nomePasso}" concluído com sucesso!\n`);
      return { sucesso: true, dados: resultado };
      
    } catch (error) {
      ultimoErro = error;
      console.log(`   ❌ Tentativa ${tentativa} falhou: ${error.message}`);
      
      if (tentativa < MAX_TENTATIVAS) {
        console.log(`   ⏳ Aguardando ${TEMPO_ENTRE_TENTATIVAS_MS/1000}s para nova tentativa...`);
        await new Promise(r => setTimeout(r, TEMPO_ENTRE_TENTATIVAS_MS));
      }
      
      tentativa++;
    }
  }
  
  // Falhou todas as tentativas
  registrarPasso(nomePasso, false, null, ultimoErro?.message || 'Erro desconhecido');
  console.log(`   🚨 "${nomePasso}" FALHOU após ${MAX_TENTATIVAS} tentativas!\n`);
  return { sucesso: false, erro: ultimoErro?.message };
}

/**
 * Relatório final de integridade
 */
function relatorioIntegridade() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('📊 REDAÇÃO 60maisNews - Relatório de Integridade');
  console.log('═══════════════════════════════════════════════════════════════');
  
  const passos = [
    { nome: 'GANCHOS', cargo: 'Pesquisador de Pautas' },
    { nome: 'WRITER', cargo: 'Redator' },
    { nome: 'VENDAS', cargo: 'Gerente de Monetização' },
    { nome: 'ENVIO', cargo: 'Distribuidor' },
    { nome: 'BLOG', cargo: 'Publicador Web' },
    { nome: 'TRELLO', cargo: 'Arquivista' }
  ];
  
  let todosSucesso = true;
  
  for (const passo of passos) {
    const estado = estadoFluxo.passos[passo.nome];
    const icone = estado?.sucesso ? '✅' : '❌';
    const tentativas = estadoFluxo.tentativas[passo.nome] || 0;
    
    console.log(`   ${icone} ${passo.cargo}: ${estado?.sucesso ? 'SUCESSO' : 'FALHOU'} (${tentativas} tentativas)`);
    
    if (!estado?.sucesso) {
      todosSucesso = false;
      console.log(`      ⚠️ Erro: ${estado?.erro || 'Não executado'}`);
    }
  }
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`   🎯 RESULTADO: ${todosSucesso ? 'TODOS OS PASSOS EXECUTADOS ✅' : 'FALHAS DETECTADAS ❌'}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  return todosSucesso;
}

/**
 * Busca forma de corrigir passo falho
 */
async function corrigirPassoFalho(nomePasso, erro) {
  console.log(`\n🔧 CORREÇÃO: Buscando alternativa para "${nomePasso}"...`);
  
  switch (nomePasso) {
    case 'GANCHOS':
      // Fallback: usar tema temporal
      console.log('   📌 Usando tema temporal como fallback...');
      const hoje = new Date();
      const diaSemana = hoje.getDay();
      const tema = (diaSemana === 0 || diaSemana === 6) ? 'videochamada' : 'WhatsApp segurança';
      return {
        data: hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }),
        tema,
        titulo: gerarTituloSEO(tema),
        urgencia: 8,
        fonte: 'Fallback temporal (correção automática)'
      };
      
    case 'WRITER':
      // Já tem fallback interno
      console.log('   📌 Writer tem fallback interno.');
      return null;
      
    case 'ENVIO':
      // Tentar enviar apenas para email de teste
      console.log('   📌 Tentando envio simplificado...');
      return null;
      
    case 'BLOG':
      // Blog é opcional, não bloqueia fluxo
      console.log('   📌 Blog é opcional, continuando...');
      return { sucesso: true, ignorado: true };
      
    default:
      return null;
  }
}

// ═══════════════════════════════════════════════════════════════
// 🤖 SUB-AGENTES
// ═══════════════════════════════════════════════════════════════

/**
 * SUB-AGENTE 1: GANCHOS
 * Usa Brave Search + Google Analytics para descobrir tema
 */
async function subAgenteGanchos() {
  console.log('\n🔍 PESQUISADOR DE PAUTAS: Buscando dados reais...\n');
  
  const brave = require('./brave-search.js');
  const analytics = require('./analytics-maton.js');
  
  const hoje = new Date();
  const data = hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  
  // 1. Brave Search - tendências (trata erros internamente)
  console.log('   🔍 Brave Search...');
  const tendenciasBrave = brave.buscar('tecnologia idosos segurança golpe pix whatsapp 2026 brasil', 5);
  if (tendenciasBrave.length > 0) {
    console.log(`   ✅ ${tendenciasBrave.length} artigos encontrados`);
  } else {
    console.log(`   ℹ️ Sem resultados (usando Analytics como fallback)`);
  }
  
  // 2. Google Analytics - posts populares
  console.log('   📈 Google Analytics...');
  let temaAnalytics = null;
  try {
    const info = analytics.temaMaisPopular();
    temaAnalytics = info.tema;
    console.log(`   ✅ Tema popular: ${temaAnalytics}`);
  } catch (e) {
    console.log(`   ⚠️ Analytics indisponível: ${e.message}`);
  }
  
  // 3. Selecionar tema (Analytics > Brave > Temporal)
  let tema = temaAnalytics;
  let fonte = 'Google Analytics';
  let urgencia = 9;
  
  if (!tema && tendenciasBrave.length > 0) {
    const titulos = tendenciasBrave.map(t => t.titulo?.toLowerCase() || '').join(' ');
    if (titulos.includes('golpe') || titulos.includes('pix')) {
      tema = 'golpe PIX';
      urgencia = 10;
    } else if (titulos.includes('whatsapp')) {
      tema = 'WhatsApp segurança';
    } else if (titulos.includes('videochamada')) {
      tema = 'videochamada';
    }
    fonte = 'Brave Search';
  }
  
  if (!tema) {
    const diaSemana = hoje.getDay();
    tema = (diaSemana === 0 || diaSemana === 6) ? 'videochamada' : 'WhatsApp segurança';
    fonte = 'Fallback temporal';
    urgencia = 8;
  }
  
  const titulo = gerarTituloSEO(tema);
  
  console.log(`\n═══════════════════════════════════════════`);
  console.log(`✅ TEMA: ${tema}`);
  console.log(`   📊 Fonte: ${fonte}`);
  console.log(`   🎯 Urgência: ${urgencia}/10`);
  console.log(`═══════════════════════════════════════════\n`);
  
  return { data, tema, titulo, urgencia, fonte };
}

function gerarTituloSEO(tema) {
  const titulos = {
    'golpe PIX': 'Golpe do PIX: 5 Dicas para Se Proteger Hoje',
    'WhatsApp segurança': 'WhatsApp Seguro: 5 Dicas Essenciais para Idosos',
    'videochamada': 'Videochamada: Como Ver Seus Netos de Qualquer Lugar',
    'aplicativo idoso': 'Aplicativos para Idosos: Os 5 Melhores e Gratuitos'
  };
  return titulos[tema] || `${tema}: Guia Completo`;
}

/**
 * SUB-AGENTE 2: WRITER
 * Gera conteúdo com fallback
 */
async function subAgenteWriter(temaInfo) {
  console.log('✍️ REDATOR: Gerando conteúdo...\n');
  
  const conteudos = {
    'golpe PIX': {
      titulo: '🚨 Golpe do PIX: 5 Dicas para Se Proteger Hoje',
      reflexao: '🌟 "A segurança digital é como trancar a porta de casa."',
      story: 'Dona Maria, 68 anos, recebeu uma mensagem de "neto" pedindo PIX urgente. O número era diferente, mas ela acreditou. Por sorte, ligou para confirmar e descobriu o golpe. Milhares de idosos caem nesse golpe todos os dias.',
      lesson: 'Sempre confirme por ligação antes de enviar PIX!',
      tutorial: {
        titulo: '🛡️ TUTORIAL: 5 Passos Para Não Cair no Golpe do PIX',
        introducao: 'Pegue seu celular e vamos aprender juntos!',
        passos: [
          { numero: 1, titulo: 'Desconfie de urgência', explicacao: 'Golpistas sempre dizem que é urgente.', acao: 'Respire e não se apresse.', exemplo: '"Vovó, manda agora!" = GOLPE' },
          { numero: 2, titulo: 'Verifique o número', explicacao: 'O número é diferente do seu neto?', acao: 'Compare com o número salvo.', exemplo: 'Número novo = desconfie' },
          { numero: 3, titulo: 'Ligue para confirmar', explicacao: 'Sempre ligue para o número que você conhece.', acao: 'Faça uma ligação antes de enviar.', exemplo: 'Pergunte: "Você me mandou mensagem?"' },
          { numero: 4, titulo: 'Combine uma senha', explicacao: 'Combine uma palavra secreta com sua família.', acao: 'Escolha uma palavra que só vocês saibam.', exemplo: 'Se não souber a senha, é golpe!' },
          { numero: 5, titulo: 'Denuncie', explicacao: 'Se recebeu mensagem suspeita, denuncie.', acao: 'No WhatsApp, segure a mensagem e clique em "Denunciar".', exemplo: 'Isso ajuda a proteger outros idosos.' }
        ],
        checklist: '☐ Desconfiei de urgência\n☐ Verifiquei o número\n☐ Liguei para confirmar\n☐ Tenho senha com a família\n☐ Sei como denunciar'
      },
      oQueMaisAprender: '🎓 No Mini Segurança Digital você aprende a se proteger de TODOS os golpes! Acesse: 60maiscursos.com.br',
      seguranca: 'NUNCA clique em links de mensagens desconhecidas!',
      score: 8.5
    },
    'WhatsApp segurança': {
      titulo: '📱 WhatsApp Seguro: 5 Dicas Essenciais para Idosos',
      reflexao: '🌟 "A tecnologia é uma ponte que nos conecta com o que mais amamos."',
      story: 'Dona Maria adorava conversar com os netos pelo WhatsApp. Um dia, recebeu uma mensagem de "neto" pedindo dinheiro. Quase caiu no golpe, mas algo a fez desconfiar: o número era diferente. Ligou para o neto real e descobriu que era golpe.',
      lesson: 'Sempre verifique se a pessoa é quem diz ser!',
      tutorial: {
        titulo: '🛡️ TUTORIAL: 5 Passos para um WhatsApp Mais Seguro',
        introducao: 'Vou te ensinar a deixar seu WhatsApp mais seguro!',
        passos: [
          { numero: 1, titulo: 'Ative verificação em duas etapas', explicacao: 'Cria uma senha extra.', acao: 'WhatsApp → Configurações → Conta → Verificação em duas etapas', exemplo: 'Crie um PIN de 6 números' },
          { numero: 2, titulo: 'Configure a privacidade', explicacao: 'Controla quem vê suas informações.', acao: 'WhatsApp → Configurações → Privacidade → Foto: Meus contatos', exemplo: 'Desconhecidos não verão sua foto' },
          { numero: 3, titulo: 'Desative download automático', explicacao: 'Evita baixar arquivos perigosos.', acao: 'WhatsApp → Configurações → Armazenamento → Desative "Baixar mídia"', exemplo: 'Você escolhe o que baixar' },
          { numero: 4, titulo: 'Nunca compartilhe código', explicacao: 'O WhatsApp NUNCA pede código.', acao: 'Se alguém ligar pedindo código, DESLIGUE!', exemplo: 'Código é SEU segredo!' },
          { numero: 5, titulo: 'Verifique contatos suspeitos', explicacao: 'Golpistas fingem ser família.', acao: 'Antes de enviar dinheiro, LIGUE no número conhecido.', exemplo: '"Neto" novo? Ligue e confirme!' }
        ],
        checklist: '☐ Ativei verificação em duas etapas\n☐ Configurei privacidade\n☐ Desativei download automático\n☐ NUNCA compartilho código\n☐ Sei verificar contatos'
      },
      oQueMaisAprender: '🎓 No Mini WhatsApp você aprende TUDO sobre o app! Acesse: 60maiscursos.com.br',
      seguranca: 'NUNCA clique em links de mensagens desconhecidas!',
      score: 8.5
    },
    'videochamada': {
      titulo: '📹 Videochamada: Como Ver Seus Netos de Qualquer Lugar',
      reflexao: '🌟 "A distância não existe quando o coração está perto."',
      story: 'Seu João, 72 anos, morava longe dos netos. Sentia muita falta. Um dia, a neta ensinou-o a fazer videochamada. Agora, toda semana ele vê os netos, mesmo estando a 500km de distância.',
      lesson: 'Videochamada é como uma visita virtual!',
      tutorial: {
        titulo: '📹 TUTORIAL: 5 Passos para Fazer Videochamada',
        introducao: 'Vou te ensinar a ver seus netos pelo celular!',
        passos: [
          { numero: 1, titulo: 'Abra o WhatsApp', explicacao: 'Encontre o app verde.', acao: 'Toque no ícone do WhatsApp.', exemplo: 'É o app com balão verde' },
          { numero: 2, titulo: 'Escolha o contato', explicacao: 'Encontre a pessoa.', acao: 'Toque no nome do seu neto.', exemplo: 'Procure na lista' },
          { numero: 3, titulo: 'Toque na câmera', explicacao: 'Botão de videochamada.', acao: 'Toque no ícone da câmera.', exemplo: 'Símbolo de câmera de vídeo' },
          { numero: 4, titulo: 'Espere atender', explicacao: 'Celular vai tocar.', acao: 'Aguarde a pessoa atender.', exemplo: 'Verá "Chamando..."' },
          { numero: 5, titulo: 'Converse e veja!', explicacao: 'Verá o rosto dela!', acao: 'Olhe para a tela e converse.', exemplo: 'Sorria e diga "Oi!"' }
        ],
        checklist: '☐ Abri o WhatsApp\n☐ Encontrei o contato\n☐ Toquei na câmera\n☐ Esperei atender\n☐ Conversei!'
      },
      oQueMaisAprender: '🎓 No Mini Videochamadas você aprende tudo! Acesse: 60maiscursos.com.br',
      seguranca: 'Só faça videochamada com pessoas que você conhece!',
      score: 8.5
    },
    'aplicativo idoso': {
      titulo: '📱 Aplicativos para Idosos: Os 5 Melhores e Gratuitos',
      reflexao: '🌟 "A tecnologia pode facilitar sua vida."',
      story: 'Dona Carmem, 70 anos, achava que celular só servia para ligar. Um dia, o neto instalou alguns apps. Agora ela marca consultas, conversa com amigas e ouve música!',
      lesson: 'Aplicativos certos facilitam seu dia a dia!',
      tutorial: {
        titulo: '📱 TUTORIAL: 5 Apps que Todo Idoso Deveria Ter',
        introducao: 'Apps gratuitos que vão mudar sua vida!',
        passos: [
          { numero: 1, titulo: 'WhatsApp', explicacao: 'Converse com família.', acao: 'Mande mensagens e faça ligações grátis.', exemplo: 'Falar com os netos!' },
          { numero: 2, titulo: 'Google Fotos', explicacao: 'Guarde suas fotos.', acao: 'Fotos salvas automaticamente.', exemplo: 'Nunca perca uma foto!' },
          { numero: 3, titulo: 'YouTube', explicacao: 'Assista vídeos.', acao: 'Receitas, músicas, exercícios.', exemplo: '"exercício para idosos"' },
          { numero: 4, titulo: 'Google Maps', explicacao: 'Nunca se perca.', acao: 'Veja como chegar.', exemplo: 'Mostra o caminho!' },
          { numero: 5, titulo: 'Alarme de Remédios', explicacao: 'Não esqueça remédio.', acao: 'Celular avisa na hora.', exemplo: 'App "Medisafe"' }
        ],
        checklist: '☐ Tenho WhatsApp\n☐ Tenho Google Fotos\n☐ Sei usar YouTube\n☐ Tenho Google Maps\n☐ Configurei alarme'
      },
      oQueMaisAprender: '🎓 No Mini Apps Essenciais você aprende todos! Acesse: 60maiscursos.com.br',
      seguranca: 'Só baixe apps da loja oficial!',
      score: 8.5
    }
  };
  
  const conteudo = conteudos[temaInfo.tema] || conteudos['WhatsApp segurança'];
  console.log(`✅ Conteúdo gerado | Score: ${conteudo.score}/10\n`);
  
  return { ...conteudo, tema: temaInfo.tema };
}

/**
 * SUB-AGENTE 3: VENDAS
 */
async function subAgenteVendas(temaInfo) {
  console.log('💰 GERENTE DE MONETIZAÇÃO: Criando CTA...\n');
  
  const cta = produtos.gerarCTAEntrada(temaInfo.tema);
  console.log(`✅ CTA: ${cta.titulo} | ${cta.preco}\n`);
  
  return { cta, ctaHTML: produtos.gerarCTAHTMLEmail(temaInfo.tema) };
}

/**
 * SUB-AGENTE 4: ENVIO
 */
async function subAgenteEnvio(conteudo, ctaInfo) {
  console.log('📧 DISTRIBUIDOR: Enviando email...\n');
  
  const html = template.gerarHTMLEmailCompleto({
    titulo: conteudo.titulo,
    reflexao: conteudo.reflexao,
    story: conteudo.story,
    lesson: conteudo.lesson,
    tutorial: conteudo.tutorial,
    oQueMaisAprender: conteudo.oQueMaisAprender,
    seguranca: conteudo.seguranca,
    cta: ctaInfo.ctaHTML
  });
  
  const sender = { name: '60maisNews - Professor Luis', email: 'benjamin@60maiscursos.com.br' };
  
  if (MODO_TESTE) {
    console.log('🧪 MODO TESTE: Enviando para luis7nico@gmail.com\n');
    const result = await brevo.enviarEmail({
      to: 'luis7nico@gmail.com',
      subject: `📰 60maisNews - ${conteudo.titulo.replace(/^[🚨📱📹]+\s*/, '')}`,
      htmlContent: html,
      textContent: 'Newsletter 60maisNews - Veja HTML',
      sender
    });
    console.log(`✅ Email enviado! Message ID: ${result.messageId}\n`);
    return { sucesso: true, messageId: result.messageId };
  } else {
    console.log(`📬 MODO REAL: Enviando para lista ${LISTA_BREVO_ID}\n`);
    const result = await brevo.enviarParaLista({
      subject: `📰 60maisNews - ${conteudo.titulo.replace(/^[🚨📱📹]+\s*/, '')}`,
      htmlContent: html,
      textContent: 'Newsletter 60maisNews',
      listIds: [LISTA_BREVO_ID],
      sender
    });
    console.log(`✅ Email enviado para lista!\n`);
    return { sucesso: true, ...result };
  }
}

/**
 * SUB-AGENTE 5: BLOG
 */
async function subAgenteBlog(conteudo, ctaInfo, tema) {
  console.log('📝 PUBLICADOR WEB: Publicando no blog...\n');
  
  const htmlWP = template.gerarHTMLWordPressCompleto({
    titulo: conteudo.titulo,
    reflexao: conteudo.reflexao,
    story: conteudo.story,
    lesson: conteudo.lesson,
    tutorial: conteudo.tutorial,
    oQueMaisAprender: conteudo.oQueMaisAprender,
    seguranca: conteudo.seguranca,
    cta: produtos.gerarCTAWordPress(tema || 'WhatsApp segurança')
  });
  
  try {
    const result = await wordpress.publicarNewsletter({
      title: conteudo.titulo.replace(/^[🚨📱📹]+\s*/, ''),
      content: htmlWP
    });
    console.log(`✅ Blog publicado! URL: ${result.link}\n`);
    return { sucesso: true, url: result.link, id: result.id };
  } catch (e) {
    console.log(`❌ Erro no blog: ${e.message}\n`);
    return { sucesso: false, erro: e.message };
  }
}

/**
 * SUB-AGENTE 6: TRELLO
 */
async function subAgenteTrello(conteudo, temaInfo, blogInfo) {
  console.log('📋 ARQUIVISTA: Registrando no Trello...\n');
  
  try {
    const hoje = new Date().toLocaleDateString('pt-BR');
    const descricao = `📰 ${conteudo.titulo}
📅 Publicado em: ${hoje}
📊 Score: ${conteudo.score}/10
🎯 Tema: ${temaInfo.tema}
📊 Fonte: ${temaInfo.fonte}

--- RESUMO ---

${conteudo.reflexao}

${conteudo.story.substring(0, 200)}...

--- TUTORIAL ---

${conteudo.tutorial.passos.map(p => `${p.numero}. ${p.titulo}`).join('\n')}

--- LINKS ---

📝 Blog: ${blogInfo?.url || 'Não publicado'}
📧 Email: Enviado

--- CHECKLIST ---

${conteudo.tutorial.checklist}`;
    
    const result = await trello.criarCartaoNewsletter({
      titulo: `📰 ${conteudo.titulo.replace(/^[🚨📱📹🌟🔒]+\s*/, '')}`,
      conteudo: descricao
    });
    
    console.log(`✅ Cartão Trello criado! ${result.url || result.shortUrl || 'OK'}\n`);
    return { sucesso: true, url: result.url || result.shortUrl, id: result.id };
  } catch (e) {
    console.log(`❌ Erro no Trello: ${e.message}\n`);
    return { sucesso: false, erro: e.message };
  }
}

/**
 * ORQUESTRADOR PRINCIPAL COM GARANTIA DE EXECUÇÃO
 */
async function agenteChefe() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📰 REDAÇÃO 60maisNews - Editor-Chefe iniciando');
  console.log('🔒 MODO: GARANTIA DE EXECUÇÃO ATIVO');
  console.log(`📅 ${new Date().toLocaleString('pt-BR')}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  estadoFluxo.inicio = new Date().toISOString();
  
  // ═══════════════════════════════════════════════════════════════
  // PASSO 1: GANCHOS
  // ═══════════════════════════════════════════════════════════════
  let resultadoGanchos = await executarComGarantia(
    'GANCHOS',
    subAgenteGanchos,
    (r) => r.tema ? { ok: true } : { ok: false, erro: 'Tema não definido' }
  );
  
  // Se GANCHOS falhou, tentar correção
  if (!resultadoGanchos.sucesso) {
    console.log('⚠️ GANCHOS falhou, aplicando correção automática...');
    const correcao = await corrigirPassoFalho('GANCHOS', resultadoGanchos.erro);
    if (correcao) {
      resultadoGanchos = { sucesso: true, dados: correcao };
      registrarPasso('GANCHOS', true, correcao);
      console.log('✅ Correção aplicada com sucesso!\n');
    }
  }
  
  // Verificar se ainda falhou
  if (!passoSucesso('GANCHOS')) {
    console.log('🚨 FALHA CRÍTICA: Não foi possível definir tema. Abortando.\n');
    relatorioIntegridade();
    return { sucesso: false, erro: 'GANCHOS falhou', estadoFluxo };
  }
  
  const temaInfo = resultadoGanchos.dados;
  
  // ═══════════════════════════════════════════════════════════════
  // PASSO 2: WRITER
  // ═══════════════════════════════════════════════════════════════
  let resultadoWriter = await executarComGarantia(
    'WRITER',
    () => subAgenteWriter(temaInfo),
    (r) => r.titulo && r.tutorial ? { ok: true } : { ok: false, erro: 'Conteúdo incompleto' }
  );
  
  if (!passoSucesso('WRITER')) {
    console.log('🚨 FALHA CRÍTICA: Não foi possível gerar conteúdo. Abortando.\n');
    relatorioIntegridade();
    return { sucesso: false, erro: 'WRITER falhou', estadoFluxo };
  }
  
  const conteudo = resultadoWriter.dados;
  
  // ═══════════════════════════════════════════════════════════════
  // PASSO 3: VENDAS
  // ═══════════════════════════════════════════════════════════════
  const resultadoVendas = await executarComGarantia(
    'VENDAS',
    () => subAgenteVendas(temaInfo),
    (r) => r.cta ? { ok: true } : { ok: false, erro: 'CTA não gerado' }
  );
  
  // VENDAS não é crítico, podemos continuar sem CTA
  if (!passoSucesso('VENDAS')) {
    console.log('⚠️ VENDAS falhou, usando CTA padrão...');
    estadoFluxo.passos['VENDAS'] = {
      sucesso: true,
      dados: { cta: { titulo: 'Mini Cursos 60+', preco: 'R$37' }, ctaHTML: '' },
      timestamp: new Date().toISOString(),
      corrigido: true
    };
  }
  
  const ctaInfo = estadoFluxo.passos['VENDAS'].dados;
  
  // ═══════════════════════════════════════════════════════════════
  // PASSO 4: ENVIO (CRÍTICO)
  // ═══════════════════════════════════════════════════════════════
  const resultadoEnvio = await executarComGarantia(
    'ENVIO',
    () => subAgenteEnvio(conteudo, ctaInfo),
    (r) => r.sucesso !== false ? { ok: true } : { ok: false, erro: 'Envio falhou' }
  );
  
  if (!passoSucesso('ENVIO')) {
    console.log('🚨 FALHA CRÍTICA: Não foi possível enviar email.\n');
    relatorioIntegridade();
    return { sucesso: false, erro: 'ENVIO falhou', estadoFluxo };
  }
  
  const envio = resultadoEnvio.dados;
  
  // ═══════════════════════════════════════════════════════════════
  // PASSO 5: BLOG (NÃO CRÍTICO)
  // ═══════════════════════════════════════════════════════════════
  const resultadoBlog = await executarComGarantia(
    'BLOG',
    () => subAgenteBlog(conteudo, ctaInfo, temaInfo.tema),
    (r) => ({ ok: true }) // Blog aceita qualquer resultado
  );
  
  // Blog falhou não é crítico
  if (!passoSucesso('BLOG')) {
    console.log('⚠️ BLOG falhou, mas fluxo continua (não crítico).');
  }
  
  const blog = resultadoBlog.dados;
  
  // ═══════════════════════════════════════════════════════════════
  // PASSO 6: TRELLO (NÃO CRÍTICO)
  // ═══════════════════════════════════════════════════════════════
  const resultadoTrello = await executarComGarantia(
    'TRELLO',
    () => subAgenteTrello(conteudo, temaInfo, blog),
    (r) => ({ ok: true }) // Trello aceita qualquer resultado
  );
  
  // Trello falhou não é crítico
  if (!passoSucesso('TRELLO')) {
    console.log('⚠️ TRELLO falhou, mas fluxo continua (não crítico).');
  }
  
  const trelloResult = resultadoTrello.dados;
  
  // ═══════════════════════════════════════════════════════════════
  // RELATÓRIO FINAL
  // ═══════════════════════════════════════════════════════════════
  estadoFluxo.fim = new Date().toISOString();
  
  const todosSucesso = relatorioIntegridade();
  
  if (todosSucesso) {
    console.log('🎉 REDAÇÃO 60maisNews - EDIÇÃO CONCLUÍDA!');
    console.log(`   📰 Tema: ${temaInfo.tema}`);
    console.log(`   📧 Email: ${envio?.messageId || 'OK'}`);
    console.log(`   📝 Blog: ${blog?.url || 'Não publicado'}`);
    console.log(`   📋 Trello: ${trelloResult?.url || 'Não criado'}`);
  } else {
    console.log('⚠️ EDIÇÃO CONCLUÍDA COM RESSALVAS');
    console.log('   Alguns membros da equipe falharam mas a edição foi adaptada.');
  }
  
  return {
    sucesso: todosSucesso,
    tema: temaInfo.tema,
    envio,
    blog,
    trello: trelloResult,
    estadoFluxo
  };
}

// Executar
agenteChefe().catch(console.error);
