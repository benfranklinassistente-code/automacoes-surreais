/**
 * 📊 RELATÓRIO DIÁRIO DA NEWSLETTER
 * Envia estatísticas para o Telegram às 20:00 UTC
 */

const brevo = require('./brevo.js');
const fs = require('fs');

async function gerarRelatorio() {
  console.log('📊 Gerando relatório diário...\n');
  
  try {
    // Ler última campanha enviada
    const ultimaCampanha = JSON.parse(fs.readFileSync('./ultima-campanha.json', 'utf8'));
    const campaignId = ultimaCampanha.campaignId;
    
    if (!campaignId) {
      return '⚠️ Nenhuma newsletter enviada ainda.';
    }
    
    // Buscar estatísticas da campanha
    const stats = await brevo.estatisticasCampanha(campaignId);
    
    if (!stats) {
      return '⚠️ Campanha não encontrada.';
    }
    
    const campStats = stats.statistics?.campaignStats?.[0] || {};
    
    // Calcular taxa de entrega
    const taxaEntrega = campStats.sent > 0 
      ? ((campStats.delivered / campStats.sent) * 100).toFixed(1) 
      : 0;
    
    // Obter eventos de abertura em tempo real
    const eventos = await brevo.estatisticasEmails();
    const eventosHoje = eventos.events.filter(e => 
      e.subject === stats.subject && 
      new Date(e.date).getDate() === new Date().getDate()
    );
    const aberturasUnicas = [...new Set(
      eventosHoje.filter(e => e.event === 'opened').map(e => e.email)
    )];
    
    // Calcular taxa de abertura
    const taxaAbertura = campStats.delivered > 0 
      ? ((aberturasUnicas.length / campStats.delivered) * 100).toFixed(1) 
      : 0;
    
    // Formatar data
    const hoje = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    
    // Montar mensagem
    const mensagem = `📊 *RELATÓRIO DIÁRIO - 60maisNews*
📅 ${hoje}

━━━━━━━━━━━━━━━━━━━━

📰 *TEMA:* ${stats.name.toUpperCase()}
📧 ${stats.subject}

━━━━━━━━━━━━━━━━━━━━

📤 *ENVIADOS:* ${campStats.sent || 0}
✅ *ENTREGUES:* ${campStats.delivered || 0}
📊 *Taxa de Entrega:* ${taxaEntrega}%

━━━━━━━━━━━━━━━━━━━━

👁️ *ABERTURAS:* ${aberturasUnicas.length} pessoas
📊 *Taxa de Abertura:* ${taxaAbertura}%

━━━━━━━━━━━━━━━━━━━━

🖱️ *Cliques:* ${stats.statistics?.globalStats?.uniqueClicks || 0}
🚫 *Descadastros:* ${stats.statistics?.globalStats?.unsubscriptions || 0}

━━━━━━━━━━━━━━━━━━━━

_Gerado automaticamente às 20:00 UTC_`;
    
    return mensagem;
    
  } catch (error) {
    return `❌ Erro ao gerar relatório: ${error.message}`;
  }
}

// Exportar para uso pelo CRON
module.exports = { gerarRelatorio };

// Executar se chamado diretamente
if (require.main === module) {
  gerarRelatorio().then(console.log);
}
