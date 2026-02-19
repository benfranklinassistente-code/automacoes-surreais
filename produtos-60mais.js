/**
 * Produtos e Ofertas - 60maisPlay
 * Funil de Vendas com Escada de Valor
 */

const PRODUTOS = {
  // ═══════════════════════════════════════════
  // DEGRAU 1: PRODUTO DE ENTRADA - R$37,00
  // ═══════════════════════════════════════════
  entrada: {
    id: 'mini-videochamadas',
    nome: 'Mini Curso: Videochamadas para Avós',
    preco: 37.00,
    precoDe: 97.00, // Preço âncora
    formato: 'Vídeo-aula + PDF',
    duracao: '1 hora',
    entrega: 'Imediata via WhatsApp',
    
    // Headlines
    headlines: [
      'Aprenda a ver seus netos no celular em apenas 1 hora!',
      'Seus netos vão adorar ver sua cara no celular! 📱❤️',
      'Videochamadas: o presente que seus netos vão amar!'
    ],
    
    // Benefícios
    beneficios: [
      'Vídeo-aula passo a passo',
      'Guia em PDF com prints',
      'Grupo WhatsApp exclusivo',
      'Suporte por 7 dias'
    ],
    
    // Bônus
    bonus: [
      { nome: 'Grupo WhatsApp exclusivo', valor: 47 },
      { nome: 'Suporte por 7 dias', valor: 97 },
      { nome: 'PDF com checklist', valor: 27 }
    ],
    
    // Garantia
    garantia: {
      dias: 7,
      texto: '7 dias ou seu dinheiro de volta!'
    },
    
    // Prova social
    provaSocial: {
      totalAlunos: 300,
      depoimentos: [
        { nome: 'D. Maria', idade: 68, texto: 'Agora falo com meus netos toda semana!' },
        { nome: 'Sr. João', idade: 72, texto: 'Muito fácil, aprendi em 1 hora!' }
      ]
    },
    
    // Escassez/Urgência
    escassez: {
      tipo: 'vagas',
      texto: 'Apenas 20 vagas no grupo este mês'
    },
    
    // WhatsApp
    whatsapp: '(11) 95354-5939',
    linkWhatsApp: 'https://wa.me/5511953545939?text=Quero%20o%20Mini%20Curso%20de%20Videochamadas%20por%20R$37'
  },

  // ═══════════════════════════════════════════
  // DEGRAU 2: CURSO COMPLETO - R$197,00
  // ═══════════════════════════════════════════
  curso: {
    id: 'curso-completo',
    nome: 'Curso Completo: Celular para Idosos',
    preco: 197.00,
    precoDe: 497.00,
    formato: '8 módulos + suporte',
    duracao: '8 semanas',
    
    beneficios: [
      'WhatsApp completo',
      'Fotos e álbuns',
      'Segurança digital',
      'Apps úteis',
      'Banco digital',
      'Suporte por 30 dias'
    ],
    
    whatsapp: '(11) 95354-5939'
  },

  // ═══════════════════════════════════════════
  // DEGRAU 3: MENTORIA - R$497,00
  // ═══════════════════════════════════════════
  mentoria: {
    id: 'mentoria-1-1',
    nome: 'Mentoria Personalizada 1:1',
    preco: 497.00,
    formato: '4 encontros online',
    
    whatsapp: '(11) 95354-5939'
  },

  // ═══════════════════════════════════════════
  // DEGRAU 4: CLUBE VIP - R$37,00/mês
  // ═══════════════════════════════════════════
  clubeVip: {
    id: 'clube-60mais-vip',
    nome: 'Clube 60mais VIP',
    preco: 37.00,
    periodo: 'mês',
    
    beneficios: [
      'Aulas semanais ao vivo',
      'Comunidade exclusiva',
      'Dúvidas respondidas',
      'Conteúdo Premium'
    ],
    
    whatsapp: '(11) 95354-5939'
  }
};

/**
 * Gera CTA para produto de entrada (R$37)
 */
function gerarCTAEntrada(tema = null) {
  const p = selecionarProdutoPorTema(tema || '');
  const valorBonus = p.bonus.reduce((acc, b) => acc + b.valor, 0);
  
  // Headline aleatória ou a primeira
  const headline = p.headlines[Math.floor(Math.random() * p.headlines.length)];
  
  return {
    titulo: `🎓 ${p.nome}`,
    headline: headline,
    conexaoLogica: p.conexaoLogica || '',
    beneficios: p.beneficios,
    preco: `R$ ${p.preco.toFixed(2).replace('.', ',')}`,
    precoDe: `R$ ${p.precoDe.toFixed(2).replace('.', ',')}`,
    bonus: p.bonus,
    valorBonus: `R$ ${valorBonus.toFixed(2).replace('.', ',')}`,
    garantia: p.garantia.texto,
    provaSocial: `Mais de ${p.provaSocial.totalAlunos} pessoas já aprenderam!`,
    escassez: p.escassez.texto,
    whatsapp: p.whatsapp,
    link: p.linkWhatsApp
  };
}

/**
 * Gera CTA HTML para email
 */
function gerarCTAHTMLEmail(tema = null) {
  const cta = gerarCTAEntrada(tema);
  
  const conexaoHTML = cta.conexaoLogica ? 
    `<p style="margin: 0 0 10px 0; font-size: 14px; color: #90EE90; font-style: italic;">💡 ${cta.conexaoLogica}</p>` : '';
  
  return `
<div style="background: linear-gradient(135deg, #1e3a5f, #2d5a87); color: white; border-radius: 10px; padding: 20px; text-align: center; margin: 25px 0;">
  <h3 style="margin: 0 0 5px 0; font-size: 18px;">${cta.titulo}</h3>
  <p style="margin: 0 0 15px 0; font-size: 15px;">${cta.headline}</p>
  
  ${conexaoHTML}
  
  <div style="text-align: left; padding: 0 20px;">
    ${cta.beneficios.map(b => `<p style="margin: 5px 0;">✅ ${b}</p>`).join('')}
  </div>
  
  <p style="margin: 15px 0 0 0; font-size: 14px; color: #90EE90;">${cta.provaSocial}</p>
  
  <p style="margin: 10px 0;">
    <span style="text-decoration: line-through; font-size: 14px;">${cta.precoDe}</span>
    <span style="font-size: 24px; font-weight: bold; margin-left: 10px;">${cta.preco}</span>
  </p>
  
  <p style="margin: 5px 0; font-size: 12px; color: #FFD700;">🎁 Bônus: ${cta.valorBonus} em extras!</p>
  
  <p style="margin: 5px 0; font-size: 12px; color: #90EE90;">⏰ ${cta.escassez}</p>
  
  <p style="margin: 10px 0; font-size: 11px;">🛡️ Garantia: ${cta.garantia}</p>
  
  <a href="${cta.link}" style="display: inline-block; background: #25D366; color: white; padding: 12px 25px; border-radius: 25px; text-decoration: none; font-weight: bold; margin-top: 15px;">
    📱 Quero Aprender Agora!
  </a>
</div>`;
}

/**
 * Gera CTA para WordPress
 */
function gerarCTAWordPress(tema = null) {
  const cta = gerarCTAEntrada(tema);
  
  const conexaoHTML = cta.conexaoLogica ? 
    `<!-- wp:paragraph -->
<p style="font-style: italic; color: #2d5a87;"><em>💡 ${cta.conexaoLogica}</em></p>
<!-- /wp:paragraph -->` : '';
  
  return `
<!-- wp:heading {"level":3} -->
<h3>🎓 ${cta.titulo}</h3>
<!-- /wp:heading -->

<!-- wp:paragraph -->
<p><strong>${cta.headline}</strong></p>
<!-- /wp:paragraph -->

${conexaoHTML}

<!-- wp:list -->
<ul>
${cta.beneficios.map(b => `<li>✅ ${b}</li>`).join('\n')}
</ul>
<!-- /wp:list -->

<!-- wp:paragraph -->
<p>${cta.provaSocial}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><span style="text-decoration: line-through;">${cta.precoDe}</span> <strong style="font-size: 24px;">${cta.preco}</strong></p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>🎁 Bônus: ${cta.valorBonus} em extras!</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>⏰ ${cta.escassez}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p>🛡️ Garantia: ${cta.garantia}</p>
<!-- /wp:paragraph -->

<!-- wp:paragraph -->
<p><a href="${cta.link}">📱 Clique aqui e comece agora!</a></p>
<!-- /wp:paragraph -->`;
}

/**
 * Seleciona produto baseado no degrau do cliente
 */
function selecionarProdutoPorDegrau(degrau) {
  switch (degrau) {
    case 1: return PRODUTOS.entrada;
    case 2: return PRODUTOS.curso;
    case 3: return PRODUTOS.mentoria;
    case 4: return PRODUTOS.clubeVip;
    default: return PRODUTOS.entrada;
  }
}

/**
 * Seleciona produto baseado no tema da newsletter
 * CONEXÃO LÓGICA: Tema → Problema → Solução (Produto)
 */
function selecionarProdutoPorTema(tema) {
  const temaLower = tema.toLowerCase();
  
  // ═══════════════════════════════════════════
  // MAPEAMENTO: TEMA → PRODUTO
  // ═══════════════════════════════════════════
  
  // TEMA: Videochamadas/Netos → PRODUTO: Mini Videochamadas
  if (temaLower.includes('videochamada') || temaLower.includes('zoom') || temaLower.includes('neto') || temaLower.includes('ligar')) {
    return {
      ...PRODUTOS.entrada,
      conexaoLogica: 'Quer ver seus netos? Aprenda a fazer videochamadas!'
    };
  }
  
  // TEMA: Segurança/Golpes/Senhas → PRODUTO: Mini Segurança Digital
  if (temaLower.includes('segurança') || temaLower.includes('golpe') || temaLower.includes('senha') || temaLower.includes('pix') || temaLower.includes('proteger') || temaLower.includes('celular')) {
    return {
      ...PRODUTOS.entrada,
      id: 'mini-seguranca-digital',
      nome: 'Mini Curso: Segurança Digital para Idosos',
      headlines: [
        'Aprenda a se proteger de golpes em apenas 1 hora!',
        'Seu dinheiro e suas senhas protegidos! 🛡️',
        'Não seja mais uma vítima de golpe!'
      ],
      beneficios: [
        'Como identificar golpes antes de cair',
        'Proteja suas senhas e contas bancárias',
        'Configurações de segurança passo a passo',
        'Grupo WhatsApp exclusivo de alertas'
      ],
      provaSocial: {
        totalAlunos: 450,
        depoimentos: [
          { nome: 'D. Carmem', idade: 70, texto: 'Depois do curso, nunca mais caí em golpe!' },
          { nome: 'Sr. Antônio', idade: 68, texto: 'Aprendi a proteger meu PIX!' }
        ]
      },
      conexaoLogica: 'Proteja seu dinheiro e evite golpes!'
    };
  }
  
  // TEMA: WhatsApp → PRODUTO: Mini WhatsApp
  if (temaLower.includes('whatsapp')) {
    return {
      ...PRODUTOS.entrada,
      id: 'mini-whatsapp',
      nome: 'Mini Curso: WhatsApp Completo para Idosos',
      headlines: [
        'Domine o WhatsApp em apenas 1 hora!',
        'Converse com sua família todos os dias! 💬',
        'WhatsApp sem mistérios, passo a passo!'
      ],
      beneficios: [
        'Enviar mensagens e fotos',
        'Fazer chamadas e videochamadas',
        'Criar grupos com a família',
        'Dicas de segurança essenciais'
      ],
      conexaoLogica: 'Domine o WhatsApp e fique mais perto da família!'
    };
  }
  
  // TEMA: Fotos/Álbuns → PRODUTO: Mini Google Fotos
  if (temaLower.includes('foto') || temaLower.includes('álbum') || temaLower.includes('memória')) {
    return {
      ...PRODUTOS.entrada,
      id: 'mini-google-fotos',
      nome: 'Mini Curso: Google Fotos para Guardar Memórias',
      headlines: [
        'Suas fotos organizadas e seguras para sempre!',
        'Nunca mais perca uma memória! 📸',
        'Álbum de fotos digital: presente para a família!'
      ],
      beneficios: [
        'Salvar fotos automaticamente',
        'Criar álbuns compartilhados',
        'Encontrar fotos pelo rosto',
        'Limpar memória do celular'
      ],
      conexaoLogica: 'Guarde suas memórias para sempre!'
    };
  }
  
  // TEMA: Banco Digital/PIX → PRODUTO: Mini Banco Digital
  if (temaLower.includes('banco') || temaLower.includes('pix') || temaLower.includes('transfer')) {
    return {
      ...PRODUTOS.entrada,
      id: 'mini-banco-digital',
      nome: 'Mini Curso: Banco Digital e PIX Seguro',
      headlines: [
        'Domine o PIX e o banco no celular!',
        'Suas finanças na palma da mão! 💰',
        'PIX sem medo, passo a passo!'
      ],
      beneficios: [
        'Fazer transferências pelo PIX',
        'Pagar contas pelo celular',
        'Ver extrato e saldo',
        'Dicas de segurança bancária'
      ],
      conexaoLogica: 'Use o banco digital com segurança!'
    };
  }
  
  // TEMA: Aplicativos → PRODUTO: Mini Apps Essenciais
  if (temaLower.includes('aplicativo') || temaLower.includes('app')) {
    return {
      ...PRODUTOS.entrada,
      id: 'mini-apps-essenciais',
      nome: 'Mini Curso: Apps Essenciais para o Dia a Dia',
      headlines: [
        'Aplicativos úteis para facilitar sua vida!',
        'Do remédio ao supermercado: tudo no celular! 📱',
        'Apps que todo idoso deveria ter!'
      ],
      beneficios: [
        'Apps de lembrete de remédios',
        'Apps de supermercado e delivery',
        'Apps de transporte (Uber, 99)',
        'Apps de comunicação'
      ],
      conexaoLogica: 'Facilite seu dia a dia com os apps certos!'
    };
  }
  
  // DEFAULT: Segurança Digital (produto mais vendável)
  return {
    ...PRODUTOS.entrada,
    id: 'mini-seguranca-digital',
    nome: 'Mini Curso: Segurança Digital para Idosos',
    headlines: [
      'Aprenda a se proteger de golpes em apenas 1 hora!',
      'Seu dinheiro protegido! 🛡️'
    ],
    beneficios: [
      'Como identificar golpes',
      'Proteja suas senhas',
      'Configurações de segurança'
    ],
    conexaoLogica: 'Proteja-se no mundo digital!'
  };
}

module.exports = {
  PRODUTOS,
  gerarCTAEntrada,
  gerarCTAHTMLEmail,
  gerarCTAWordPress,
  selecionarProdutoPorDegrau,
  selecionarProdutoPorTema
};
