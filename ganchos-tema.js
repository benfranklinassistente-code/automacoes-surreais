/**
 * 🤖 GANCHOS - Seleciona tema dinâmico
 * Executar primeiro para descobrir o tema
 * NÃO REPETE tema nos últimos 30 dias
 */

const brave = require('./brave-search.js');
const analytics = require('./analytics-maton.js');
const historico = require('./historico-temas.js');

async function descobrirTema() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('📅 GANCHOS: Descobrindo tema do dia...');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Verificar histórico primeiro
  const status = historico.statusHistorico();
  
  const hoje = new Date();
  const data = hoje.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  
  // 1. Brave Search
  console.log('🔍 Brave Search...');
  let tendencias = [];
  try {
    tendencias = brave.buscar('tecnologia idosos segurança golpe pix whatsapp 2026 brasil', 5);
    console.log(`   ✅ ${tendencias.length} artigos\n`);
  } catch (e) {
    console.log(`   ⚠️ ${e.message}\n`);
  }
  
  // 2. Google Analytics - buscar lista ordenada de temas
  console.log('📈 Google Analytics...');
  let listaTemasAnalytics = [];
  try {
    listaTemasAnalytics = analytics.temasOrdenadosPorPopularidade();
    console.log(`   ✅ ${listaTemasAnalytics.length} temas encontrados`);
    listaTemasAnalytics.forEach(t => console.log(`      • ${t.tema}: ${t.views} views`));
    console.log('');
  } catch (e) {
    console.log(`   ⚠️ ${e.message}\n`);
  }
  
  // 3. Selecionar tema (verificando histórico)
  let tema = null;
  let fonte = '';
  let urgencia = 7;
  
  // Prioridade 1: Analytics - percorrer lista ORDENADA e pegar primeiro disponível
  for (const item of listaTemasAnalytics) {
    if (!historico.temaRecente(item.tema)) {
      tema = item.tema;
      fonte = 'Google Analytics';
      urgencia = 9;
      console.log(`   ✅ Tema disponível encontrado: ${tema}`);
      break;
    } else {
      console.log(`   ⏭️ ${item.tema} já usado recentemente, pulando...`);
    }
  }
  
  // Prioridade 2: Brave Search (se não foi usado recentemente)
  if (!tema && tendencias.length > 0) {
    const titulos = tendencias.map(t => t.titulo?.toLowerCase() || '').join(' ');
    
    const temasCandidatos = [
      { nome: 'golpe PIX', keys: ['golpe', 'pix'], urgencia: 10 },
      { nome: 'WhatsApp segurança', keys: ['whatsapp'], urgencia: 8 },
      { nome: 'videochamada', keys: ['videochamada', 'neto'], urgencia: 8 },
      { nome: 'segurança celular', keys: ['segurança', 'celular'], urgencia: 7 },
      { nome: 'aplicativo idoso', keys: ['aplicativo', 'app', 'idoso'], urgencia: 7 }
    ];
    
    for (const candidato of temasCandidatos) {
      const match = candidato.keys.some(k => titulos.includes(k));
      if (match && !historico.temaRecente(candidato.nome)) {
        tema = candidato.nome;
        urgencia = candidato.urgencia;
        fonte = 'Brave Search';
        break;
      }
    }
  }
  
  // Prioridade 3: Fallback - primeiro disponível da lista de 100 temas
  if (!tema) {
    const disponiveis = status.disponiveis;
    
    if (disponiveis.length > 0) {
      // Pegar o primeiro disponível (sem repetir)
      tema = disponiveis[0];
      urgencia = 7;
      fonte = 'Lista de temas (sem repetição)';
    } else {
      // TODOS foram usados - escolher o mais antigo (30+ dias)
      console.log('   ⚠️ TODOS os temas foram usados. Reutilizando o mais antigo...');
      const h = historico.carregarHistorico();
      if (h.temas.length > 0) {
        const maisAntigo = h.temas.sort((a, b) => a.timestamp - b.timestamp)[0];
        tema = maisAntigo.tema;
        fonte = 'Reutilização (mais antigo)';
        urgencia = 7;
      } else {
        tema = 'WhatsApp segurança';
        fonte = 'Padrão';
      }
    }
  }
  
  const titulo = {
    'golpe PIX': 'Golpe do PIX: 5 Dicas para Se Proteger Hoje',
    'WhatsApp segurança': 'WhatsApp Seguro: 5 Dicas Essenciais para Idosos',
    'videochamada': 'Videochamada: Como Ver Seus Netos de Qualquer Lugar',
    'aplicativo idoso': 'Aplicativos para Idosos: Os 5 Melhores Gratuitos',
    'segurança celular': 'Segurança no Celular: Proteja Seus Dados',
    'Google Fotos': 'Google Fotos: Salve Suas Memórias Para Sempre',
    'senha banco': 'Senha do Banco: Como Proteger Seu Dinheiro',
    'Facebook segurança': 'Facebook Seguro: Como Usar Sem Perigo'
  }[tema] || `${tema}: Guia Completo`;
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`✅ TEMA SELECIONADO: ${tema}`);
  console.log(`   📊 Fonte: ${fonte}`);
  console.log(`   🎯 Urgência: ${urgencia}/10`);
  console.log(`   📰 Título: ${titulo}`);
  console.log(`   📅 Temas disponíveis: ${status.disponiveis.length}`);
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Salvar para o próximo passo
  const fs = require('fs');
  fs.writeFileSync('./tema-selecionado.json', JSON.stringify({
    tema,
    titulo,
    urgencia,
    fonte,
    data,
    tendencias: tendencias.slice(0, 3),
    temasDisponiveis: status.disponiveis
  }, null, 2));
  
  console.log('💾 Tema salvo em tema-selecionado.json');
  console.log('\n👉 AGORA: Peça ao Ben para gerar o conteúdo!\n');
  
  return { tema, titulo, urgencia, fonte };
}

descobrirTema().catch(console.error);
