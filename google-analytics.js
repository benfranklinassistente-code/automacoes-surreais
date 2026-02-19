/**
 * Google Analytics Data API - Módulo para Sub-Agente Ganchos
 * Busca métricas reais do site 60maiscursos.com.br/blog
 * 
 * REQUER: Service Account do Google Cloud com Analytics Data API habilitada
 * CONFIG: Colocar arquivo de credenciais em ./google-credentials.json
 */

const fs = require('fs');
const path = require('path');

// Tentar carregar credenciais
let credentialsPath = path.join(__dirname, 'google-credentials.json');
let credentials = null;
let analyticsClient = null;

// INICIALIZAÇÃO AUTOMÁTICA
try {
  if (fs.existsSync(credentialsPath)) {
    credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    console.log('✅ Credenciais Google Analytics carregadas');
  }
} catch (error) {
  console.log('⚠️ Erro ao carregar credenciais:', error.message);
}

/**
 * Inicializar cliente do Google Analytics
 */
async function inicializar() {
  // Se já tem cliente, retorna
  if (analyticsClient) {
    return true;
  }
  
  // Se não tem credenciais, retorna false
  if (!credentials) {
    console.log('⚠️ Credenciais não encontradas');
    return false;
  }

  try {
    // Verificar se tem as credenciais necessárias
    if (!credentials.type || !credentials.project_id) {
      console.log('⚠️ Credenciais inválidas');
      return false;
    }

    // Carregar biblioteca dinamicamente
    const { BetaAnalyticsDataClient } = require('@google-analytics/data');
    analyticsClient = new BetaAnalyticsDataClient({
      credentials: credentials
    });

    console.log('✅ Google Analytics client inicializado');
    return true;
  } catch (error) {
    console.log('❌ Erro ao inicializar Analytics:', error.message);
    return false;
  }
}

/**
 * Buscar posts mais visualizados
 */
async function postsMaisVisualizados(propertyId, dias = 30, limite = 10) {
  if (!analyticsClient) {
    console.log('⚠️ Analytics não inicializado, usando dados simulados');
    return getDadosSimulados('postsPopulares');
  }

  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${dias}daysAgo`,
          endDate: 'today'
        }
      ],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' }
      ],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' }
      ],
      orderBys: [
        {
          metric: { metricName: 'screenPageViews' },
          desc: true
        }
      ],
      limit: limite
    });

    return response.rows.map(row => ({
      pagina: row.dimensionValues[0].value,
      titulo: row.dimensionValues[1].value,
      visualizacoes: parseInt(row.metricValues[0].value),
      tempoMedio: parseFloat(row.metricValues[1].value).toFixed(1)
    }));
  } catch (error) {
    console.log('❌ Erro ao buscar posts:', error.message);
    return getDadosSimulados('postsPopulares');
  }
}

/**
 * Buscar termos de busca mais usados
 */
async function termosBuscaPopulares(propertyId, dias = 30, limite = 20) {
  if (!analyticsClient) {
    console.log('⚠️ Analytics não inicializado, usando dados simulados');
    return getDadosSimulados('termosBusca');
  }

  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${dias}daysAgo`,
          endDate: 'today'
        }
      ],
      dimensions: [
        { name: 'searchTerm' }
      ],
      metrics: [
        { name: 'eventCount' }
      ],
      orderBys: [
        {
          metric: { metricName: 'eventCount' },
          desc: true
        }
      ],
      limit: limite
    });

    return response.rows.map(row => ({
      termo: row.dimensionValues[0].value,
      buscas: parseInt(row.metricValues[0].value)
    }));
  } catch (error) {
    console.log('❌ Erro ao buscar termos:', error.message);
    return getDadosSimulados('termosBusca');
  }
}

/**
 * Buscar páginas de entrada (por onde chegam ao site)
 */
async function paginasEntrada(propertyId, dias = 30, limite = 10) {
  if (!analyticsClient) {
    return getDadosSimulados('paginasEntrada');
  }

  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${dias}daysAgo`,
          endDate: 'today'
        }
      ],
      dimensions: [
        { name: 'landingPage' }
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'bounceRate' }
      ],
      orderBys: [
        {
          metric: { metricName: 'sessions' },
          desc: true
        }
      ],
      limit: limite
    });

    return response.rows.map(row => ({
      pagina: row.dimensionValues[0].value,
      sessoes: parseInt(row.metricValues[0].value),
      taxaRejeicao: (parseFloat(row.metricValues[1].value) * 100).toFixed(1) + '%'
    }));
  } catch (error) {
    console.log('❌ Erro ao buscar páginas de entrada:', error.message);
    return getDadosSimulados('paginasEntrada');
  }
}

/**
 * Buscar resumo geral do site
 */
async function resumoGeral(propertyId, dias = 30) {
  if (!analyticsClient) {
    return getDadosSimulados('resumoGeral');
  }

  try {
    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: `${dias}daysAgo`,
          endDate: 'today'
        }
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ]
    });

    const row = response.rows[0];
    return {
      periodo: `Últimos ${dias} dias`,
      sessoes: parseInt(row.metricValues[0].value),
      usuarios: parseInt(row.metricValues[1].value),
      visualizacoes: parseInt(row.metricValues[2].value),
      tempoMedioSegundos: parseFloat(row.metricValues[3].value).toFixed(1),
      taxaRejeicao: (parseFloat(row.metricValues[4].value) * 100).toFixed(1) + '%'
    };
  } catch (error) {
    console.log('❌ Erro ao buscar resumo:', error.message);
    return getDadosSimulados('resumoGeral');
  }
}

/**
 * Identificar temas mais populares para ganchos
 */
async function temasParaGanchos(propertyId) {
  // Buscar posts populares
  const posts = await postsMaisVisualizados(propertyId, 30, 20);
  
  // Buscar termos de busca
  const termos = await termosBuscaPopulares(propertyId, 30, 20);
  
  // Análise de temas relevantes para 60+
  const temas60mais = [
    'whatsapp', 'golpe', 'pix', 'senha', 'videochamada', 
    'celular', 'seguranca', 'segurança', 'foto', 'neto',
    'aplicativo', 'app', 'facebook', 'instagram', 'zoom',
    'google', 'internet', 'wifi', 'banco', 'email'
  ];
  
  // Filtrar e pontuar temas
  const temasEncontrados = {};
  
  posts.forEach(post => {
    const tituloLower = post.titulo.toLowerCase();
    temas60mais.forEach(tema => {
      if (tituloLower.includes(tema)) {
        if (!temasEncontrados[tema]) {
          temasEncontrados[tema] = { visualizacoes: 0, posts: [] };
        }
        temasEncontrados[tema].visualizacoes += post.visualizacoes;
        temasEncontrados[tema].posts.push({
          titulo: post.titulo,
          views: post.visualizacoes
        });
      }
    });
  });
  
  termos.forEach(termo => {
    const termoLower = termo.termo.toLowerCase();
    temas60mais.forEach(tema => {
      if (termoLower.includes(tema)) {
        if (!temasEncontrados[tema]) {
          temasEncontrados[tema] = { visualizacoes: 0, buscas: 0 };
        }
        temasEncontrados[tema].buscas = (temasEncontrados[tema].buscas || 0) + termo.buscas;
      }
    });
  });
  
  // Ordenar por popularidade
  const temasOrdenados = Object.entries(temasEncontrados)
    .map(([tema, dados]) => ({
      tema,
      score: (dados.visualizacoes || 0) + (dados.buscas || 0) * 2,
      ...dados
    }))
    .sort((a, b) => b.score - a.score);
  
  return {
    temasPopulares: temasOrdenados.slice(0, 5),
    postsPopulares: posts.slice(0, 5),
    termosBusca: termos.slice(0, 10),
    recomendacao: temasOrdenados[0]?.tema || 'WhatsApp'
  };
}

/**
 * Dados simulados para quando Analytics não está configurado
 */
function getDadosSimulados(tipo) {
  const simulados = {
    postsPopulares: [
      { pagina: '/blog/whatsapp-seguranca', titulo: 'WhatsApp Seguro: Como Proteger Suas Conversas', visualizacoes: 234, tempoMedio: '45' },
      { pagina: '/blog/golpe-pix', titulo: 'Golpe do PIX: 5 Dicas para Se Proteger', visualizacoes: 189, tempoMedio: '52' },
      { pagina: '/blog/videochamada-netos', titulo: 'Como Fazer Videochamada com os Netos', visualizacoes: 156, tempoMedio: '38' },
      { pagina: '/blog/celular-lento', titulo: 'Celular Lento: Como Deixar Mais Rápido', visualizacoes: 142, tempoMedio: '41' },
      { pagina: '/blog/senhas-seguras', titulo: 'Senhas Seguras: Guia para Idosos', visualizacoes: 128, tempoMedio: '47' }
    ],
    termosBusca: [
      { termo: 'como usar whatsapp', buscas: 45 },
      { termo: 'golpe no celular', buscas: 38 },
      { termo: 'videochamada netos', buscas: 32 },
      { termo: 'senha do banco', buscas: 28 },
      { termo: 'celular lento o que fazer', buscas: 25 }
    ],
    paginasEntrada: [
      { pagina: '/blog/', sessoes: 450, taxaRejeicao: '35%' },
      { pagina: '/blog/whatsapp-seguranca', sessoes: 180, taxaRejeicao: '28%' }
    ],
    resumoGeral: {
      periodo: 'Últimos 30 dias',
      sessoes: 1250,
      usuarios: 890,
      visualizacoes: 3200,
      tempoMedioSegundos: '42.5',
      taxaRejeicao: '38%'
    }
  };
  
  return simulados[tipo] || {};
}

// Verificar se @google-analytics/data está instalado
async function verificarDependencias() {
  try {
    require.resolve('@google-analytics/data');
    return true;
  } catch (e) {
    console.log('⚠️ @google-analytics/data não instalado');
    console.log('   Execute: npm install @google-analytics/data');
    return false;
  }
}

module.exports = {
  inicializar,
  postsMaisVisualizados,
  termosBuscaPopulares,
  paginasEntrada,
  resumoGeral,
  temasParaGanchos,
  verificarDependencias
};
