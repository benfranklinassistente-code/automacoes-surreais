/**
 * 📊 Monitor Diário de Tokens
 * Registra consumo e gera relatórios para otimização contínua
 */

const fs = require('fs');
const path = require('path');

const MONITOR_FILE = '/root/.openclaw/workspace/memory/monitor-tokens.json';
const ALERTAS_FILE = '/root/.openclaw/workspace/memory/alertas-tokens.json';

// Meta diária
const META_DIARIA = 60000000; // 60M tokens

// Inicializar dados
let dados = {
  registros: [],
  alertas: [],
  media7dias: null,
  tendencia: 'estavel'
};

// Carregar dados existentes
function carregar() {
  try {
    if (fs.existsSync(MONITOR_FILE)) {
      dados = JSON.parse(fs.readFileSync(MONITOR_FILE, 'utf8'));
    }
  } catch (e) {}
}

// Salvar dados
function salvar() {
  try {
    const dir = path.dirname(MONITOR_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(MONITOR_FILE, JSON.stringify(dados, null, 2));
  } catch (e) {}
}

/**
 * Registra consumo do dia
 */
function registrar(tokensEntrada, tokensSaida, fonte = 'sistema') {
  carregar();
  
  const hoje = new Date().toISOString().split('T')[0];
  const total = tokensEntrada + tokensSaida;
  
  // Verificar se já existe registro de hoje
  const registroExistente = dados.registros.find(r => r.data === hoje);
  
  if (registroExistente) {
    // Atualizar registro existente
    registroExistente.tokensEntrada += tokensEntrada;
    registroExistente.tokensSaida += tokensSaida;
    registroExistente.total += total;
    registroExistente.amostras++;
    registroExistente.ultimaAtualizacao = Date.now();
  } else {
    // Novo registro
    dados.registros.push({
      data: hoje,
      tokensEntrada,
      tokensSaida,
      total,
      meta: META_DIARIA,
      percentualMeta: ((total / META_DIARIA) * 100).toFixed(1),
      amostras: 1,
      timestamp: Date.now(),
      ultimaAtualizacao: Date.now()
    });
  }
  
  // Manter últimos 30 dias
  if (dados.registros.length > 30) {
    dados.registros = dados.registros.slice(-30);
  }
  
  // Calcular média 7 dias
  calcularMedia();
  
  // Verificar alertas
  verificarAlertas(total);
  
  salvar();
  
  return dados;
}

/**
 * Calcula média dos últimos 7 dias
 */
function calcularMedia() {
  const ultimos7 = dados.registros.slice(-7);
  
  if (ultimos7.length > 0) {
    const soma = ultimos7.reduce((acc, r) => acc + r.total, 0);
    dados.media7dias = Math.round(soma / ultimos7.length);
    
    // Calcular tendência
    if (ultimos7.length >= 3) {
      const primeiros3 = ultimos7.slice(0, 3).reduce((acc, r) => acc + r.total, 0) / 3;
      const ultimos3 = ultimos7.slice(-3).reduce((acc, r) => acc + r.total, 0) / 3;
      
      if (ultimos3 < primeiros3 * 0.9) {
        dados.tendencia = 'diminuindo';
      } else if (ultimos3 > primeiros3 * 1.1) {
        dados.tendencia = 'aumentando';
      } else {
        dados.tendencia = 'estavel';
      }
    }
  }
}

/**
 * Verifica se precisa gerar alerta
 */
function verificarAlertas(total) {
  const percentual = (total / META_DIARIA) * 100;
  
  // Alerta se acima de 120% da meta
  if (percentual > 120) {
    const alerta = {
      data: new Date().toISOString(),
      tipo: 'acima_meta',
      mensagem: `Consumo ${percentual.toFixed(1)}% acima da meta! (${(total/1000000).toFixed(1)}M tokens)`,
      valor: total,
      meta: META_DIARIA,
      percentual: percentual.toFixed(1)
    };
    
    dados.alertas.push(alerta);
    
    // Manter últimos 50 alertas
    if (dados.alertas.length > 50) {
      dados.alertas = dados.alertas.slice(-50);
    }
  }
  
  // Alerta se aumento repentino
  if (dados.registros.length >= 2) {
    const anterior = dados.registros[dados.registros.length - 2]?.total || 0;
    if (anterior > 0 && total > anterior * 1.5) {
      dados.alertas.push({
        data: new Date().toISOString(),
        tipo: 'aumento_repentino',
        mensagem: `Aumento de ${((total/anterior - 1) * 100).toFixed(0)}% em relação ao dia anterior`,
        valorAnterior: anterior,
        valorAtual: total
      });
    }
  }
}

/**
 * Gera relatório diário
 */
function relatorioDiario() {
  carregar();
  
  const hoje = dados.registros[dados.registros.length - 1];
  
  if (!hoje) {
    return '❌ Nenhum registro encontrado';
  }
  
  return `
📊 RELATÓRIO DIÁRIO DE TOKENS
============================
📅 Data: ${hoje.data}

📈 CONSUMO:
   • Entrada: ${(hoje.tokensEntrada / 1000000).toFixed(1)}M
   • Saída: ${(hoje.tokensSaida / 1000000).toFixed(1)}M
   • Total: ${(hoje.total / 1000000).toFixed(1)}M tokens
   
🎯 META: ${(META_DIARIA / 1000000).toFixed(0)}M tokens
📊 Status: ${hoje.percentualMeta}% da meta

📉 MÉDIA 7 DIAS: ${dados.media7dias ? (dados.media7dias / 1000000).toFixed(1) + 'M' : 'N/A'}
📈 TENDÊNCIA: ${dados.tendencia.toUpperCase()}

${dados.alertas.length > 0 ? '⚠️ ALERTAS: ' + dados.alertas.filter(a => a.data.startsWith(hoje.data)).length + ' hoje' : '✅ Sem alertas'}
`.trim();
}

/**
 * Gera relatório semanal
 */
function relatorioSemanal() {
  carregar();
  
  const ultimos7 = dados.registros.slice(-7);
  
  if (ultimos7.length === 0) {
    return '❌ Dados insuficientes';
  }
  
  const totalSemana = ultimos7.reduce((acc, r) => acc + r.total, 0);
  const mediaDia = totalSemana / ultimos7.length;
  const economiaEstimada = (364000000 - mediaDia) * 7;
  
  return `
📊 RELATÓRIO SEMANAL DE TOKENS
==============================
📅 Período: ${ultimos7[0]?.data || 'N/A'} a ${ultimos7[ultimos7.length-1]?.data || 'N/A'}

📈 CONSUMO TOTAL: ${(totalSemana / 1000000).toFixed(1)}M tokens
📊 MÉDIA DIÁRIA: ${(mediaDia / 1000000).toFixed(1)}M tokens
📉 TENDÊNCIA: ${dados.tendencia.toUpperCase()}

💰 ECONOMIA ESTIMADA (vs 364M/dia):
   • Diária: ${((364000000 - mediaDia) / 1000000).toFixed(1)}M tokens
   • Semanal: ${(economiaEstimada / 1000000).toFixed(1)}M tokens

📊 DETAHAMENTO:
${ultimos7.map(r => `   ${r.data}: ${(r.total/1000000).toFixed(1)}M (${r.percentualMeta}%)`).join('\n')}
`.trim();
}

/**
 * Sugestões de otimização
 */
function sugestoesOtimizacao() {
  carregar();
  
  const sugestoes = [];
  const hoje = dados.registros[dados.registros.length - 1];
  
  if (!hoje) return ['Dados insuficientes para análise'];
  
  // Verificar se está acima da meta
  if (hoje.percentualMeta > 100) {
    sugestoes.push('⚠️ Acima da meta! Considere:');
    sugestoes.push('   • Aumentar threshold do cache semântico (70% → 75%)');
    sugestoes.push('   • Reduzir frequência de crons');
    sugestoes.push('   • Expandir cache FAQ');
  }
  
  // Verificar tendência
  if (dados.tendencia === 'aumentando') {
    sugestoes.push('📈 Consumo aumentando! Monitorar:');
    sugestoes.push('   • Novos crons adicionados?');
    sugestoes.push('   • Mais interações de usuários?');
    sugestoes.push('   • Cache funcionando corretamente?');
  }
  
  if (sugestoes.length === 0) {
    sugestoes.push('✅ Sistema otimizado! Mantenha o monitoramento.');
  }
  
  return sugestoes;
}

/**
 * Exporta dados para análise
 */
function exportarDados() {
  carregar();
  return {
    registros: dados.registros,
    alertas: dados.alertas,
    media7dias: dados.media7dias,
    tendencia: dados.tendencia,
    meta: META_DIARIA
  };
}

// Inicializar
carregar();

module.exports = {
  registrar,
  relatorioDiario,
  relatorioSemanal,
  sugestoesOtimizacao,
  exportarDados,
  META_DIARIA
};
