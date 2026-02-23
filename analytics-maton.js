/**
 * Google Analytics via Maton API
 * Módulo para Newsletter 60maisNews
 */

const { execSync } = require('child_process');
const fs = require('fs');

// Carregar credenciais
const CREDENCIAIS = JSON.parse(fs.readFileSync('./credenciais-60mais.json', 'utf8'));
const MATON_API_KEY = CREDENCIAIS.maton?.apiKey;
const MATON_CONNECTION_ID = CREDENCIAIS.maton?.connectionId;
const PROPERTY_ID = CREDENCIAIS.google?.analytics?.propertyId;

/**
 * Executa query no Maton Gateway
 */
function matonRequest(endpoint, data = null) {
  const url = `https://gateway.maton.ai/${endpoint}`;
  
  let cmd = `curl -s -X ${data ? 'POST' : 'GET'} "${url}"`;
  cmd += ` -H "Authorization: Bearer ${MATON_API_KEY}"`;
  cmd += ` -H "Maton-Connection: ${MATON_CONNECTION_ID}"`;
  cmd += ` -H "Content-Type: application/json"`;
  
  if (data) {
    cmd += ` -d '${JSON.stringify(data)}'`;
  }
  
  try {
    const output = execSync(cmd, { encoding: 'utf-8', timeout: 30000 });
    return JSON.parse(output);
  } catch (error) {
    console.error('❌ Erro no Maton:', error.message);
    return null;
  }
}

/**
 * Busca páginas mais visualizadas
 * @param {number} dias - Período em dias (padrão: 7)
 * @param {number} limite - Máximo de resultados (padrão: 10)
 */
function paginasMaisVisualizadas(dias = 7, limite = 10) {
  const data = {
    dateRanges: [{
      startDate: `${dias}daysAgo`,
      endDate: 'today'
    }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'pageTitle' }
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'activeUsers' }
    ],
    orderBys: [{
      metric: { metricName: 'screenPageViews' },
      desc: true
    }],
    limit: limite
  };
  
  const result = matonRequest(`google-analytics-data/v1beta/properties/${PROPERTY_ID}:runReport`, data);
  
  if (!result || !result.rows) {
    return [];
  }
  
  return result.rows.map(row => ({
    pagina: row.dimensionValues[0].value,
    titulo: row.dimensionValues[1].value,
    visualizacoes: parseInt(row.metricValues[0].value),
    usuariosAtivos: parseInt(row.metricValues[1].value)
  }));
}

/**
 * Busca posts populares sobre tecnologia para idosos
 */
function postsPopularesTecnologia() {
  const paginas = paginasMaisVisualizadas(30, 20);
  
  // Filtrar apenas posts do blog
  const posts = paginas.filter(p => 
    p.pagina.includes('/202') && 
    !p.pagina.includes('/page/')
  );
  
  return posts;
}

/**
 * Extrai tema do post baseado no título
 */
function extrairTemaDoPost(titulo) {
  const temas = {
    'golpe': 'golpe PIX',
    'pix': 'golpe PIX',
    'whatsapp': 'WhatsApp segurança',
    'videochamada': 'videochamada',
    'senha': 'segurança celular',
    'foto': 'Google Fotos',
    'aplicativo': 'aplicativo idoso',
    'app': 'aplicativo idoso',
    'facebook': 'Facebook segurança'
  };
  
  const tituloLower = titulo.toLowerCase();
  
  for (const [chave, tema] of Object.entries(temas)) {
    if (tituloLower.includes(chave)) {
      return tema;
    }
  }
  
  return null;
}

/**
 * Identifica tema mais popular baseado em visualizações
 * Retorna LISTA ORDENADA de temas por popularidade
 */
function temaMaisPopular() {
  const posts = postsPopularesTecnologia();
  
  if (posts.length === 0) {
    return { tema: 'WhatsApp segurança', motivo: 'fallback padrão', listaTemas: [] };
  }
  
  // Contar visualizações por tema
  const temaViews = {};
  
  for (const post of posts) {
    const tema = extrairTemaDoPost(post.titulo);
    if (tema) {
      temaViews[tema] = (temaViews[tema] || 0) + post.visualizacoes;
    }
  }
  
  // Ordenar temas por popularidade (MAIS views primeiro)
  const listaTemas = Object.entries(temaViews)
    .sort((a, b) => b[1] - a[1])
    .map(([tema, views]) => ({ tema, views }));
  
  // Retornar o mais popular (primeiro da lista)
  const temaVencedor = listaTemas.length > 0 ? listaTemas[0].tema : 'WhatsApp segurança';
  const maxViews = listaTemas.length > 0 ? listaTemas[0].views : 0;
  
  return {
    tema: temaVencedor,
    views: maxViews,
    motivo: 'baseado em posts populares',
    listaTemas: listaTemas, // NOVO: retorna lista completa ordenada
    postsAnalise: posts.slice(0, 5)
  };
}

/**
 * Retorna lista de temas ordenados por popularidade
 * Útil para escolher tema disponível (não usado recentemente)
 */
function temasOrdenadosPorPopularidade() {
  const resultado = temaMaisPopular();
  return resultado.listaTemas || [];
}

/**
 * Estatísticas gerais do blog
 */
function estatisticasGerais(dias = 7) {
  const data = {
    dateRanges: [{
      startDate: `${dias}daysAgo`,
      endDate: 'today'
    }],
    metrics: [
      { name: 'sessions' },
      { name: 'activeUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' }
    ]
  };
  
  const result = matonRequest(`google-analytics-data/v1beta/properties/${PROPERTY_ID}:runReport`, data);
  
  if (!result || !result.rows || result.rows.length === 0) {
    return null;
  }
  
  const row = result.rows[0];
  return {
    sessoes: parseInt(row.metricValues[0].value),
    usuarios: parseInt(row.metricValues[1].value),
    visualizacoes: parseInt(row.metricValues[2].value),
    duracaoMedia: Math.round(parseFloat(row.metricValues[3].value))
  };
}

module.exports = {
  paginasMaisVisualizadas,
  postsPopularesTecnologia,
  extrairTemaDoPost,
  temaMaisPopular,
  temasOrdenadosPorPopularidade,
  estatisticasGerais,
  PROPERTY_ID
};
