/**
 * 📅 CONTROLE DE TEMAS - Evita repetição por 30 dias
 * Gerencia histórico de temas usados na newsletter
 */

const fs = require('fs');
const ARQUIVO_HISTORICO = './historico-temas.json';

/**
 * Carrega histórico de temas
 */
function carregarHistorico() {
  try {
    return JSON.parse(fs.readFileSync(ARQUIVO_HISTORICO, 'utf8'));
  } catch (e) {
    return { temas: [], atualizado: new Date().toISOString() };
  }
}

/**
 * Salva histórico de temas
 */
function salvarHistorico(historico) {
  historico.atualizado = new Date().toISOString();
  fs.writeFileSync(ARQUIVO_HISTORICO, JSON.stringify(historico, null, 2));
}

/**
 * Adiciona tema ao histórico
 */
function registrarTema(tema) {
  const historico = carregarHistorico();
  
  // Adicionar novo registro
  historico.temas.push({
    tema,
    data: new Date().toISOString(),
    timestamp: Date.now()
  });
  
  // Remover temas com mais de 30 dias
  const trintaDiasAtras = Date.now() - (30 * 24 * 60 * 60 * 1000);
  historico.temas = historico.temas.filter(t => t.timestamp > trintaDiasAtras);
  
  salvarHistorico(historico);
  
  console.log(`📝 Tema "${tema}" registrado no histórico`);
}

/**
 * Verifica se tema foi usado nos últimos 30 dias
 */
function temaRecente(tema) {
  const historico = carregarHistorico();
  const trintaDiasAtras = Date.now() - (30 * 24 * 60 * 60 * 1000);
  
  const usadoRecente = historico.temas.some(t => 
    t.tema === tema && t.timestamp > trintaDiasAtras
  );
  
  return usadoRecente;
}

/**
 * Lista temas disponíveis (não usados nos últimos 30 dias)
 * Carrega da lista completa de 100 temas
 */
function temasDisponiveis() {
  // Carregar lista completa de 100 temas
  let todosTemas = [];
  try {
    const lista = JSON.parse(fs.readFileSync('./lista-temas.json', 'utf8'));
    todosTemas = lista.temas.map(t => t.tema);
  } catch (e) {
    // Fallback para lista básica se arquivo não existir
    todosTemas = [
      'golpe PIX',
      'WhatsApp segurança', 
      'videochamada',
      'aplicativo idoso',
      'segurança celular',
      'Google Fotos',
      'senha banco',
      'Facebook segurança'
    ];
  }
  
  const disponiveis = todosTemas.filter(t => !temaRecente(t));
  
  return {
    disponiveis,
    usados: todosTemas.filter(t => temaRecente(t)),
    todos: todosTemas
  };
}

/**
 * Mostra status do histórico
 */
function statusHistorico() {
  const historico = carregarHistorico();
  const { disponiveis, usados } = temasDisponiveis();
  
  console.log('\n📊 STATUS DO HISTÓRICO (últimos 30 dias)');
  console.log('═════════════════════════════════════════');
  
  if (usados.length > 0) {
    console.log('\n❌ Temas JÁ USADOS:');
    historico.temas.forEach(t => {
      const diasAtras = Math.floor((Date.now() - t.timestamp) / (24 * 60 * 60 * 1000));
      console.log(`   • ${t.tema} (${diasAtras} dias atrás)`);
    });
  }
  
  if (disponiveis.length > 0) {
    console.log('\n✅ Temas DISPONÍVEIS:');
    disponiveis.forEach(t => console.log(`   • ${t}`));
  }
  
  console.log('\n═════════════════════════════════════════\n');
  
  return { disponiveis, usados, total: historico.temas.length };
}

module.exports = {
  carregarHistorico,
  salvarHistorico,
  registrarTema,
  temaRecente,
  temasDisponiveis,
  statusHistorico
};
