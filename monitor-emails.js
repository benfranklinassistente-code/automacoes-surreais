// Monitor de aberturas de email - executa diariamente
const brevo = require('./brevo.js');

const CONVEX_URL = "https://ceaseless-puma-611.convex.site";

async function registrarAtividade(type, title, description, status, metadata = {}) {
  try {
    await fetch(`${CONVEX_URL}/api/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, title, description, status, metadata })
    });
    console.log(`✓ ${title}`);
  } catch (err) {
    console.error(`✗ Erro: ${err.message}`);
  }
}

async function monitorarEmails() {
  console.log("\n📧 Monitorando aberturas de email...\n");
  
  try {
    const stats = await brevo.estatisticasEmails();
    const hoje = new Date().toDateString();
    
    // Filtrar eventos de hoje
    const eventosHoje = stats.events?.filter(e => 
      new Date(e.date).toDateString() === hoje
    ) || [];
    
    const aberturasHoje = eventosHoje.filter(e => e.event === 'opened').length;
    const cliquesHoje = eventosHoje.filter(e => e.event === 'clicked').length;
    const emailsUnicos = [...new Set(eventosHoje.filter(e => e.event === 'opened').map(e => e.email))];
    
    // Top engajados
    const contagemEmails = {};
    eventosHoje.filter(e => e.event === 'opened').forEach(e => {
      contagemEmails[e.email] = (contagemEmails[e.email] || 0) + 1;
    });
    const topEngajados = Object.entries(contagemEmails)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([email, count]) => ({ email, opens: count }));
    
    // Registrar no Mission Control
    await registrarAtividade(
      "email",
      `📬 ${aberturasHoje} Aberturas Hoje`,
      `${aberturasHoje} aberturas de ${emailsUnicos.length} emails únicos | ${cliquesHoje} cliques`,
      aberturasHoje > 50 ? "completed" : "running",
      {
        opens: aberturasHoje,
        uniqueOpens: emailsUnicos.length,
        clicks: cliquesHoje,
        topEngajados
      }
    );
    
    // Se tiver cliques, registrar também
    if (cliquesHoje > 0) {
      await registrarAtividade(
        "email",
        `👆 ${cliquesHoje} Cliques Hoje`,
        `${cliquesHoje} cliques em links dos emails`,
        "completed",
        { clicks: cliquesHoje }
      );
    }
    
    console.log(`\n📊 Resumo:`);
    console.log(`   Aberturas: ${aberturasHoje}`);
    console.log(`   Emails únicos: ${emailsUnicos.length}`);
    console.log(`   Cliques: ${cliquesHoje}`);
    console.log(`   Top engajados: ${topEngajados.map(t => t.email).join(', ')}`);
    
    return { aberturasHoje, cliquesHoje, emailsUnicos: emailsUnicos.length };
    
  } catch (err) {
    console.error("Erro ao monitorar:", err.message);
  }
}

// Executar
monitorarEmails();

module.exports = { monitorarEmails };
