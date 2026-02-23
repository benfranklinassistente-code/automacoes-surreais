/**
 * 📊 RELATÓRIO DIÁRIO DA NEWSLETTER
 * Envia estatísticas completas para o Telegram às 20:00 UTC
 */

const brevo = require('./brevo.js');
const fs = require('fs');

async function gerarRelatorio() {
  console.log('📊 Gerando relatório diário...\n');
  
  try {
    // Buscar TODOS os eventos de email
    const eventos = await brevo.estatisticasEmails();
    
    // Filtrar eventos de HOJE
    const hoje = new Date().toDateString();
    const eventosHoje = eventos.events?.filter(e => 
      new Date(e.date).toDateString() === hoje
    ) || [];
    
    // Contabilizar por tipo
    const aberturasHoje = eventosHoje.filter(e => e.event === 'opened');
    const cliquesHoje = eventosHoje.filter(e => e.event === 'clicked');
    
    // Emails únicos que abriram
    const emailsAberturas = [...new Set(aberturasHoje.map(e => e.email))];
    
    // Emails únicos que clicaram
    const emailsCliques = [...new Set(cliquesHoje.map(e => e.email))];
    
    // Top engajados (mais aberturas)
    const contagemAberturas = {};
    aberturasHoje.forEach(e => {
      contagemAberturas[e.email] = (contagemAberturas[e.email] || 0) + 1;
    });
    const topEngajados = Object.entries(contagemAberturas)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([email, count]) => `• ${email.split('@')[0]}: ${count}x`);
    
    // Última campanha enviada (se existir)
    let campanhaInfo = '';
    try {
      const ultimaCampanha = JSON.parse(fs.readFileSync('./ultima-campanha.json', 'utf8'));
      if (ultimaCampanha.tema) {
        campanhaInfo = `\n📰 *Última Newsletter:* ${ultimaCampanha.tema.toUpperCase()}`;
      }
    } catch (e) {}
    
    // Formatar data
    const dataFormatada = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    
    // Montar mensagem
    const mensagem = `📊 *RELATÓRIO DIÁRIO - 60maisNews*
📅 ${dataFormatada}
${campanhaInfo}

━━━━━━━━━━━━━━━━━━━━

👁️ *ABERTURAS HOJE:* ${aberturasHoje.length}
📧 *Emails únicos:* ${emailsAberturas.length}

━━━━━━━━━━━━━━━━━━━━

👆 *CLIQUES HOJE:* ${cliquesHoje.length}
📧 *Emails únicos:* ${emailsCliques.length}

━━━━━━━━━━━━━━━━━━━━

🏆 *TOP 3 MAIS ATIVOS:*
${topEngajados.join('\n') || '• Sem dados suficientes'}

━━━━━━━━━━━━━━━━━━━━

📈 *Engajamento:*
${emailsAberturas.length > 0 ? `✅ ${emailsAberturas.length} pessoas engajadas hoje!` : '⚠️ Nenhuma abertura registrada'}

━━━━━━━━━━━━━━━━━━━━

_Gerado automaticamente às 17:00 (Brasília)_`;
    
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
