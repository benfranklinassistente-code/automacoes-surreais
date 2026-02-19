/**
 * 🤖 Sistema de Newsletter Autônoma 60maisPlay
 * 
 * Arquitetura com 4 agentes:
 * 1. Agente Ganchos - Identifica oportunidades de conteúdo
 * 2. Agente Storyteller - Cria conteúdo usando método S.L.P.C.
 * 3. Agente Vendas - Insere ofertas relevantes
 * 4. Agente Envio - Envia via Brevo
 */

const fs = require('fs');
const path = require('path');
const brevo = require('./brevo.js');

// Carregar configurações
const calendarioPath = path.join(__dirname, 'calendario-comercial-60mais-2026.json');
const catalogoPath = path.join(__dirname, 'catalogo-produtos-60mais.json');
const manualPath = path.join(__dirname, 'manual-storyselling.md');

// =====================================================
// 📅 AGENTE GANCHOS - Identifica oportunidades de conteúdo
// =====================================================

class AgenteGanchos {
  constructor() {
    this.calendario = JSON.parse(fs.readFileSync(calendarioPath, 'utf8'));
    this.eventos = this.calendario.eventos;
  }

  /**
   * Buscar eventos próximos (próximos 7 dias)
   */
  buscarEventosProximos(diasFrente = 7) {
    const hoje = new Date();
    const eventosProximos = [];

    for (const evento of this.eventos) {
      const dataEvento = this.parseData(evento.data);
      const diffDias = Math.ceil((dataEvento - hoje) / (1000 * 60 * 60 * 24));
      
      if (diffDias >= 0 && diffDias <= diasFrente) {
        eventosProximos.push({
          ...evento,
          diasParaEvento: diffDias
        });
      }
    }

    return eventosProximos.sort((a, b) => a.diasParaEvento - b.diasParaEvento);
  }

  /**
   * Buscar evento do dia
   */
  buscarEventoHoje() {
    const hoje = new Date();
    const diaAtual = hoje.getDate();
    const mesAtual = hoje.toLocaleString('pt-BR', { month: 'long' });

    return this.eventos.find(e => {
      const [dia] = e.data.split('/');
      return parseInt(dia) === diaAtual && 
             e.mes.toLowerCase() === mesAtual.toLowerCase();
    });
  }

  /**
   * Sugerir tema para newsletter
   */
  sugerirTema() {
    // Primeiro, verificar eventos próximos (até 7 dias)
    const eventosProximos = this.buscarEventosProximos(7);
    
    if (eventosProximos.length > 0) {
      const evento = eventosProximos[0];
      // Se é hoje ou em poucos dias, criar urgência
      if (evento.diasParaEvento <= 3) {
        return {
          tipo: 'evento_calendario',
          gancho: evento.evento,
          data: evento.data,
          acao: evento.acao,
          produto: evento.produto,
          urgencia: evento.diasParaEvento === 0 ? 'HOJE' : `em ${evento.diasParaEvento} dias`,
          diasParaEvento: evento.diasParaEvento
        };
      }
      // Mesmo se não for urgente, usar o evento como gancho
      return {
        tipo: 'evento_calendario',
        gancho: evento.evento,
        data: evento.data,
        acao: evento.acao,
        produto: evento.produto,
        urgencia: `${evento.diasParaEvento} dias`,
        diasParaEvento: evento.diasParaEvento
      };
    }

    // Se não houver evento, sugerir tema padrão baseado no dia da semana
    const diaSemana = new Date().getDay();
    const temasPadrao = [
      { tema: 'Segurança Digital', gancho: 'Segurança Digital' }, // Domingo
      { tema: 'WhatsApp', gancho: 'WhatsApp' }, // Segunda
      { tema: 'Fotos', gancho: 'Fotos' }, // Terça
      { tema: 'Videochamada', gancho: 'Videochamada' }, // Quarta
      { tema: 'Golpes', gancho: 'Golpes' }, // Quinta
      { tema: 'WhatsApp', gancho: 'WhatsApp' }, // Sexta
      { tema: 'Segurança Digital', gancho: 'Segurança Digital' } // Sábado
    ];

    return {
      tipo: 'tema_padrao',
      ...temasPadrao[diaSemana],
      diaSemana: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][diaSemana]
    };
  }

  parseData(dataStr) {
    const [dia, mes] = dataStr.split('/');
    const ano = new Date().getFullYear();
    return new Date(ano, parseInt(mes) - 1, parseInt(dia));
  }
}

// =====================================================
// ✍️ AGENTE STORYTELLER - Cria conteúdo S.L.P.C.
// =====================================================

class AgenteStoryteller {
  constructor() {
    this.template = {
      story: { min: 100, max: 250 },
      lesson: { min: 25, max: 50 },
      pivot: { min: 50, max: 100 },
      cta: { min: 25, max: 75 }
    };
  }

  /**
   * Criar newsletter usando método S.L.P.C.
   */
  criarNewsletter(gancho, oferta = null) {
    const { tipo, gancho: tema, acao, produto } = gancho;

    // Mapear tema do evento para tema de conteúdo
    const temaConteudo = this.mapearTemaConteudo(tema, acao);

    // Gerar cada parte do S.L.P.C.
    const story = this.gerarHistoria(temaConteudo, tipo, tema);
    const lesson = this.gerarLicao(temaConteudo, tema);
    const pivot = this.gerarPivot(temaConteudo, oferta, tema);
    const cta = this.gerarCTA(oferta);

    return {
      subject: this.criarSubject(temaConteudo, tema),
      body: {
        story,
        lesson,
        pivot,
        cta
      },
      html: this.montarHTML({ story, lesson, pivot, cta }),
      text: this.montarTexto({ story, lesson, pivot, cta })
    };
  }

  /**
   * Mapear evento para tema de conteúdo
   */
  mapearTemaConteudo(evento, acao) {
    const mapa = {
      'Dia do Administrador': 'Fotos',
      'Dia da Internet Segura': 'Segurança Digital',
      'Dia dos Namorados': 'WhatsApp',
      'Dia Internacional da Mulher': 'WhatsApp',
      'Dia do Consumidor': 'Golpes',
      'Dia da Mentira': 'Golpes',
      'Dia das Mães': 'Videochamada',
      'Dia dos Pais': 'Videochamada',
      'Dia do Idoso': 'Segurança Digital',
      'Black Friday': 'Golpes',
      'Natal': 'Videochamada',
      'Ano Novo': 'WhatsApp'
    };

    // Verificar palavras-chave na ação
    if (acao) {
      if (acao.toLowerCase().includes('seguran')) return 'Segurança Digital';
      if (acao.toLowerCase().includes('whatsapp')) return 'WhatsApp';
      if (acao.toLowerCase().includes('foto')) return 'Fotos';
      if (acao.toLowerCase().includes('video')) return 'Videochamada';
      if (acao.toLowerCase().includes('golpe')) return 'Golpes';
    }

    return mapa[evento] || 'default';
  }

  gerarHistoria(tema, tipo, evento = null) {
    // Se for evento específico, criar história relacionada
    if (tipo === 'evento_calendario' && evento) {
      const historiasEvento = {
        'Dia do Administrador': `Ontem estava ajudando o Sr. Carlos, 67 anos, a organizar as contas no celular. "Tenho tantas senhas que não sei mais onde parei!", ele reclama. A verdade é que administrar a vida financeira depois dos 60 pode ser confuso. Mas e se eu te dissesse que o seu celular pode ser seu maior aliado nisso?`,
        'Dia da Internet Segura': `Recebi uma ligação ontem de uma senhora de 74 anos. "Benjamin, eu cliquei em um link e agora meu celular está estranho!" Ela entrou em pânico. O pior? Isso acontece todos os dias com milhares de idosos. A boa notícia? Existe jeito de se proteger.`,
        'Dia dos Namorados': `Dona Lúcia, 71 anos, me contou que o marido, 74, aprendeu a mandar áudio no WhatsApp só para falar "Te amo" todo dia. "Ele era tão tímido antes...", ela sorri. A tecnologia pode aproximar corações de maneiras que nem imaginamos.`,
        'Dia Internacional da Mulher': `Conheci Dona Thereza, 78 anos, que aprendeu a usar o celular para mandar fotos das bisnetas para toda a família. "Elas moram longe, mas agora sinto que estou perto todo dia." Mulheres 60+ estão revolucionando a forma de se conectar.`,
        'Dia do Consumidor': `O Sr. Antônio, 69 anos, quase caiu num golpe de "promoção relâmpago" semana passada. "Era muito boa para ser verdade...", ele me disse depois. Exato. Quando parece bom demais, desconfie. Proteger seu dinheiro digital é essencial.`,
        'Dia das Mães': `Mãe é mãe, não importa a idade. Dona Francisca, 82 anos, faz videochamada com os 5 filhos todo domingo. "É o melhor dia da semana", ela diz. A tecnologia não substitui o abraço, mas ameniza a saudade.`,
        'Dia dos Pais': `Pai também tem saudade. O Sr. Roberto, 75 anos, aprendeu a mandar memes para os netos. "Eles acham que eu sou 'cringe', mas eu não sei o que é isso!", ri. O importante é que eles se divertem juntos.`,
        'Dia do Idoso': `Outubro é o mês do idoso! E cada dia descubro uma nova história inspiradora. Como a de Dona Yara, 80 anos, que aprendeu a usar o celular para dar aulas de culinária para as netas pelo WhatsApp. Idade? Só número.`,
        'Black Friday': `Black Friday chegando e com ela, as "ofertas imperdíveis". Cuidado! O Sr. José, 68 anos, comprou um "celular top" por R$ 200. Adivinha? Nunca chegou. Aprenda a identificar promoções verdadeiras das armadilhas.`,
        'Natal': `Natal sem a família é difícil. Mas Dona Elza, 79 anos, descobriu como fazer a "ceia virtual" com os filhos que moram fora. "Não é a mesma coisa, mas ver os netos abrindo presentes me faz feliz." A tecnologia traz a família para perto.`,
        'Ano Novo': `Ano novo, habilidades novas! O Sr. Nelson, 73 anos, fez um ano novo promessa: aprender a usar o celular direito. Seis meses depois? Ele manda fotos, faz videochamadas e até pagamentos. "Nunca é tarde demais!", ele orgulha-se.`
      };
      
      if (historiasEvento[evento]) {
        return historiasEvento[evento];
      }
    }

    // Histórias baseadas no tema
    const historias = {
      'Segurança Digital': `Ontem, recebi uma mensagem da Dona Maria, 72 anos, toda assustada. Ela tinha clicado em um link que dizia que seu "WhatsApp iria expirar" se não fizesse algo urgente. Resultado? Perdeu o acesso à conta por 2 horas. Felizmente, consegui ajudá-la a recuperar. Mas fiquei pensando: quantos idosos passam por isso todo dia?`,

      'WhatsApp': `Estava no supermercado quando vi um senhor tentando mostrar uma foto do neto para a esposa. Ele ficava apertando a tela, passando o dedo, mas não conseguia ampliar. "Não consigo ver o rosto dele!", reclamava. Cheguei perto e mostrei: "É só usar dois dedos, esticando assim..." O sorriso dele valeu mais que as compras.`,

      'Fotos': `Dona Lúcia, 68 anos, me ligou desesperada ontem. "Benjamin, meu celular morreu e perdi todas as fotos dos netos!" Ela não tinha backup. Nenhuma cópia. Anos de memórias... Felizmente, consegui recuperar. Mas e da próxima vez? Você tem suas fotos salvas em outro lugar?`,

      'Videochamada': `No domingo, vi minha vizinha Dona Tereza, 75 anos, tentando fazer videochamada com a neta que mora em Portugal. "Ela não me ouve!", repetia frustrada. O problema? O botão de áudio estava desligado. Um toque só. Quando conseguiu ouvir a neta, os olhos brilharam. "Vovó, te vejo!"`,

      'Golpes': `Segunda-feira passada, o Sr. Akira, 80 anos, quase transferiu R$ 500 para um "neto" no WhatsApp. O neto real estava na sala ao lado. "Vovô, não fui eu que mandei mensagem!", disse quando viu o celular. Sorte que perguntou antes de clicar. Milhares de idosos não têm essa sorte.`,

      'default': `Acordou cedo hoje pensando nos meus alunos do 60maisPlay. Cada um tem uma história, uma dificuldade, um medo... Mas todos têm algo em comum: a vontade de se conectar com a família através da tecnologia. E isso é o que me move todos os dias.`
    };

    return historias[tema] || historias['default'];
  }

  gerarLicao(tema, evento = null) {
    const licoes = {
      'Segurança Digital': 'A verdade é: golpes digitais contra idosos cresceram 40% no último ano. E a maioria começa com uma mensagem urgente pedindo "clique aqui".',
      'WhatsApp': 'Pequenos gestos fazem grande diferença. Um toque na tela certa pode significar ver o rosto de quem amamos.',
      'Fotos': 'Memórias digitais precisam de cuidado especial. Um celular pode quebrar, mas suas fotos podem durar para sempre.',
      'Videochamada': 'A tecnologia pode parecer complicada, mas muitas vezes é só um botão que precisa ser apertado.',
      'Golpes': 'Sempre confirme por voz ou vídeo antes de enviar dinheiro. Se a mensagem parece urgente demais, desconfie.',
      'default': 'Tecnologia não precisa ser assustadora. Com o guia certo, qualquer um pode aprender.'
    };

    return licoes[tema] || licoes['default'];
  }

  gerarPivot(tema, oferta, evento = null) {
    if (oferta) {
      return `Por isso criamos o ${oferta.nome}. Um jeito simples e descomplicado de você dominar sua tecnologia e se conectar com quem você ama.`;
    }

    const pivots = {
      'Segurança Digital': 'É por isso que no 60maisPlay ensinamos exatamente como identificar e evitar golpes digitais.',
      'WhatsApp': 'No 60maisPlay, temos aulas específicas para você dominar o WhatsApp do jeito certo.',
      'Fotos': 'No nosso curso, ensinamos passo a passo como fazer backup automático das suas fotos.',
      'Videochamada': 'Queremos que você nunca perca um momento especial. Nossas aulas de videochamada são feitas para você.',
      'Golpes': 'Nossa missão é proteger você. Temos um curso inteiro sobre segurança digital para idosos.',
      'default': 'No 60maisPlay, ensinamos tecnologia de verdade para pessoas de verdade.'
    };

    return pivots[tema] || pivots['default'];
  }

  gerarCTA(oferta) {
    if (oferta) {
      return `🔗 Clique aqui e garanta seu acesso: ${oferta.link}\n\n💡 Use o código ${oferta.codigo || '60MAIS'} e ganhe desconto especial!`;
    }

    return `🔗 Conheça nossos cursos: https://60maisplay.com.br\n\n💬 Dúvidas? Responda este email que eu te ajudo!`;
  }

  criarSubject(tema, evento = null) {
    // Se for evento específico, criar subject relacionado
    if (evento) {
      const subjectsEvento = {
        'Dia do Administrador': '📊 Organize sua vida financeira no celular',
        'Dia da Internet Segura': '🔒 Navegue sem medo na internet',
        'Dia dos Namorados': '❤️ Um gesto que mudou tudo...',
        'Dia Internacional da Mulher': '👩 Mulheres 60+ conectadas',
        'Dia do Consumidor': '🛒 Proteja seu dinheiro digital',
        'Dia das Mães': '💐 Mãe, saudade e videochamada',
        'Dia dos Pais': '👔 Pai, netos e memes',
        'Dia do Idoso': '🎉 Outubro: mês do idoso 60+!',
        'Black Friday': '🛍️ Cuidado com "ofertas" estranhas',
        'Natal': '🎄 Natal virtual, amor real',
        'Ano Novo': '🎆 Ano novo, habilidades novas!'
      };
      
      if (subjectsEvento[evento]) {
        return subjectsEvento[evento];
      }
    }

    const subjects = {
      'Segurança Digital': '⚠️ Atenção: O que fazer se clonarem seu WhatsApp',
      'WhatsApp': '📱 Dica que pode mudar seu dia a dia',
      'Fotos': '📸 Suas fotos estão seguras?',
      'Videochamada': '👩‍👧 Não consigo ver meus netos!',
      'Golpes': '🚨 Isso quase aconteceu ontem...',
      'default': '💡 Uma história que pode te ajudar'
    };

    return subjects[tema] || subjects['default'];
  }

  montarHTML({ story, lesson, pivot, cta }) {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; line-height: 1.8; }
    h1 { color: #2c3e50; font-size: 22px; }
    .story { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .lesson { font-weight: bold; color: #27ae60; font-size: 16px; margin: 20px 0; }
    .pivot { background: #e8f5e9; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .cta { text-align: center; margin: 30px 0; }
    .cta a { background: #27ae60; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .footer { text-align: center; color: #888; font-size: 12px; margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; }
  </style>
</head>
<body>
  <p>Olá! 👋</p>
  
  <div class="story">
    ${story}
  </div>
  
  <p class="lesson">${lesson}</p>
  
  <div class="pivot">
    ${pivot}
  </div>
  
  <div class="cta">
    <p>${cta.replace(/\n/g, '<br>')}</p>
  </div>
  
  <div class="footer">
    <p>60maisPlay - Tecnologia para quem tem vida</p>
    <p><a href="https://60maisplay.com.br">60maisplay.com.br</a></p>
    <p>Para parar de receber, <a href="{{unsubscribe_url}}">clique aqui</a></p>
  </div>
</body>
</html>
    `;
  }

  montarTexto({ story, lesson, pivot, cta }) {
    return `
${story}

${lesson}

${pivot}

${cta}

---
60maisPlay - Tecnologia para quem tem vida
https://60maisplay.com.br

Para parar de receber, acesse: {{unsubscribe_url}}
    `.trim();
  }
}

// =====================================================
// 💰 AGENTE VENDAS - Gerencia ofertas e produtos
// =====================================================

class AgenteVendas {
  constructor() {
    this.catalogo = this.carregarCatalogo();
  }

  carregarCatalogo() {
    // Catálogo padrão
    return {
      produtos: [
        { id: 1, nome: 'Curso WhatsApp Mastery', preco: 47, categoria: 'WhatsApp', link: 'https://60maisplay.com.br/whatsapp', codigo: 'ZAP60' },
        { id: 2, nome: 'Escudo Anti-Golpes', preco: 47, categoria: 'Segurança', link: 'https://60maisplay.com.br/seguranca', codigo: 'SEGURO60' },
        { id: 3, nome: 'Curso de Fotos e Memórias', preco: 37, categoria: 'Fotos', link: 'https://60maisplay.com.br/fotos', codigo: 'FOTO60' },
        { id: 4, nome: 'Videochamadas Sem Mistério', preco: 37, categoria: 'Videochamada', link: 'https://60maisplay.com.br/video', codigo: 'VIDEO60' },
        { id: 5, nome: 'Aula Particular 1h', preco: 197, categoria: 'Aula', link: 'https://60maisplay.com.br/aula', codigo: '' }
      ]
    };
  }

  /**
   * Encontrar produto relevante para o tema ou evento
   */
  encontrarProdutoRelevante(tema, evento = null) {
    const mapaTemaCategoria = {
      'Segurança Digital': 'Segurança',
      'WhatsApp': 'WhatsApp',
      'Fotos': 'Fotos',
      'Videochamada': 'Videochamada',
      'Golpes': 'Segurança'
    };

    // Mapa específico para eventos
    const mapaEventoCategoria = {
      'Dia do Administrador': 'Fotos',
      'Dia da Internet Segura': 'Segurança',
      'Dia dos Namorados': 'WhatsApp',
      'Dia Internacional da Mulher': 'WhatsApp',
      'Dia do Consumidor': 'Segurança',
      'Dia das Mães': 'Videochamada',
      'Dia dos Pais': 'Videochamada',
      'Dia do Idoso': 'Segurança',
      'Black Friday': 'Segurança',
      'Natal': 'Videochamada',
      'Ano Novo': 'WhatsApp'
    };

    // Primeiro tentar pelo evento
    if (evento && mapaEventoCategoria[evento]) {
      const categoria = mapaEventoCategoria[evento];
      const produto = this.catalogo.produtos.find(p => p.categoria === categoria);
      if (produto) return produto;
    }

    // Depois tentar pelo tema
    const categoria = mapaTemaCategoria[tema];
    return this.catalogo.produtos.find(p => p.categoria === categoria) || null;
  }

  /**
   * Criar oferta do dia
   */
  criarOferta(produto, urgencia = null) {
    if (!produto) return null;

    const desconto = urgencia === 'HOJE' ? 20 : 10;
    const precoFinal = produto.preco * (1 - desconto / 100);

    return {
      ...produto,
      desconto,
      precoOriginal: produto.preco,
      precoFinal: precoFinal.toFixed(2).replace('.', ','),
      urgencia
    };
  }
}

// =====================================================
// 📧 AGENTE ENVIO - Envia newsletter via Brevo
// =====================================================

class AgenteEnvio {
  constructor() {
    this.brevo = brevo;
  }

  /**
   * Enviar newsletter para lista
   */
  async enviar({ subject, htmlContent, textContent, listaId = null }) {
    try {
      // Buscar contatos
      const contatos = await this.brevo.listarContatos(100);
      
      if (!contatos.contacts || contatos.contacts.length === 0) {
        console.log('⚠️ Nenhum contato encontrado');
        return { sucesso: false, erro: 'Sem contatos' };
      }

      console.log(`📤 Enviando para ${contatos.contacts.length} contatos...`);

      // Enviar para cada contato
      let enviados = 0;
      let erros = 0;

      for (const contato of contatos.contacts.slice(0, 10)) { // Limitar a 10 para teste
        try {
          await this.brevo.enviarEmail({
            to: contato.email,
            subject: subject,
            htmlContent: htmlContent,
            textContent: textContent
          });
          enviados++;
        } catch (err) {
          erros++;
          console.log(`❌ Erro para ${contato.email}: ${err.message}`);
        }
      }

      return {
        sucesso: true,
        enviados,
        erros,
        total: contatos.contacts.length
      };
    } catch (err) {
      return { sucesso: false, erro: err.message };
    }
  }

  /**
   * Enviar para email específico (teste)
   */
  async enviarTeste({ to, subject, htmlContent, textContent }) {
    return await this.brevo.enviarEmail({
      to,
      subject,
      htmlContent,
      textContent
    });
  }
}

// =====================================================
// 🎭 ORQUESTRADOR - Coordena todos os agentes
// =====================================================

class OrquestradorNewsletter {
  constructor() {
    this.agenteGanchos = new AgenteGanchos();
    this.agenteStoryteller = new AgenteStoryteller();
    this.agenteVendas = new AgenteVendas();
    this.agenteEnvio = new AgenteEnvio();
  }

  /**
   * Executar ciclo completo de newsletter
   */
  async executar(teste = false) {
    console.log('🚀 Iniciando ciclo de newsletter...\n');

    // 1. Agente Ganchos: Identificar tema
    console.log('📅 [1/4] Agente Ganchos identificando tema...');
    const gancho = this.agenteGanchos.sugerirTema();
    console.log(`   Tema: ${gancho.gancho}`);
    if (gancho.urgencia) {
      console.log(`   ⚡ Urgência: ${gancho.urgencia}`);
    }

    // 2. Agente Vendas: Encontrar produto relevante
    console.log('\n💰 [2/4] Agente Vendas buscando oferta...');
    const produto = this.agenteVendas.encontrarProdutoRelevante(gancho.gancho, gancho.tipo === 'evento_calendario' ? gancho.gancho : null);
    const oferta = produto ? this.agenteVendas.criarOferta(produto, gancho.urgencia) : null;
    if (oferta) {
      console.log(`   Produto: ${oferta.nome}`);
      console.log(`   Preço: R$ ${oferta.precoFinal} (${oferta.desconto}% off)`);
    }

    // 3. Agente Storyteller: Criar conteúdo
    console.log('\n✍️ [3/4] Agente Storyteller criando conteúdo...');
    const newsletter = this.agenteStoryteller.criarNewsletter(gancho, oferta);
    console.log(`   Subject: ${newsletter.subject}`);
    console.log(`   Palavras: ~${newsletter.text.split(/\s+/).length}`);

    // 4. Agente Envio: Enviar
    console.log('\n📧 [4/4] Agente Envio enviando...');
    
    if (teste) {
      // Enviar apenas para teste
      const resultado = await this.agenteEnvio.enviarTeste({
        to: 'luis7nico@gmail.com',
        subject: newsletter.subject,
        htmlContent: newsletter.html,
        textContent: newsletter.text
      });
      console.log('   ✅ Enviado para teste: luis7nico@gmail.com');
      return { gancho, oferta, newsletter, resultado };
    }

    // Enviar para lista
    const resultado = await this.agenteEnvio.enviar({
      subject: newsletter.subject,
      htmlContent: newsletter.html,
      textContent: newsletter.text
    });

    console.log(`\n📊 Resultado:`);
    console.log(`   Enviados: ${resultado.enviados || 0}`);
    console.log(`   Erros: ${resultado.erros || 0}`);

    return { gancho, oferta, newsletter, resultado };
  }

  /**
   * Preview da newsletter sem enviar
   */
  preview() {
    const gancho = this.agenteGanchos.sugerirTema();
    const produto = this.agenteVendas.encontrarProdutoRelevante(gancho.gancho);
    const oferta = produto ? this.agenteVendas.criarOferta(produto, gancho.urgencia) : null;
    const newsletter = this.agenteStoryteller.criarNewsletter(gancho, oferta);

    return {
      gancho,
      oferta,
      newsletter
    };
  }
}

// =====================================================
// EXPORT
// =====================================================

module.exports = {
  OrquestradorNewsletter,
  AgenteGanchos,
  AgenteStoryteller,
  AgenteVendas,
  AgenteEnvio
};

// Executar se chamado diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const orquestrador = new OrquestradorNewsletter();

  if (args[0] === '--preview') {
    const preview = orquestrador.preview();
    console.log('\n=== PREVIEW ===\n');
    console.log('📅 GANCHO:', JSON.stringify(preview.gancho, null, 2));
    console.log('\n💰 OFERTA:', JSON.stringify(preview.oferta, null, 2));
    console.log('\n📧 SUBJECT:', preview.newsletter.subject);
    console.log('\n📝 CONTEÚDO:\n');
    console.log(preview.newsletter.text);
  } else if (args[0] === '--teste') {
    orquestrador.executar(true);
  } else {
    orquestrador.executar(false);
  }
}
