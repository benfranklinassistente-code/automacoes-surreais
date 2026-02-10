const fs = require('fs');
const path = require('path');

class Dashboard {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.activityLog = path.join(this.dataDir, 'activity-log.json');
    }

    async show() {
        console.clear();
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║         📊 DASHBOARD - ASSISTENTE PESSOAL 24/7        ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');

        const stats = this.getEstatisticas();
        
        // Seção 1: Hoje
        console.log('📅 HOJE');
        console.log('─────────────────────────────────────────────────────────');
        console.log(`⏱️  Tempo focado:     ${stats.horasFoco}h`);
        console.log(`📊 Produtividade:     ${stats.produtividade}%`);
        console.log(`💰 Receita:           ${stats.receita}`);
        console.log(`🎯 Metas:             ${stats.metasConcluidas}/${stats.metasTotal}`);
        console.log('');

        // Seção 2: Semana
        console.log('📈 SEMANA');
        console.log('─────────────────────────────────────────────────────────');
        console.log(`🔥 Streak:            ${stats.streak} dias`);
        console.log(`🏆 Recorde pessoal:   ${stats.recorde}h foco`);
        console.log(`💵 Total faturado:    ${stats.totalSemana}`);
        console.log('');

        // Seção 3: Padrões Detectados
        console.log('🧠 PADRÕES DETECTADOS');
        console.log('─────────────────────────────────────────────────────────');
        if (stats.padroes.length > 0) {
            stats.padroes.forEach(p => {
                console.log(`• ${p.tipo}: ${p.count}x esta semana`);
            });
        } else {
            console.log('• Ainda coletando dados...');
        }
        console.log('');

        // Seção 4: Sugestões
        console.log('💡 SUGESTÕES DO ASSISTENTE');
        console.log('─────────────────────────────────────────────────────────');
        console.log(stats.sugestao);
        console.log('');

        // Seção 5: Próximos Lembretes
        console.log('⏰ PRÓXIMOS LEMBRETES');
        console.log('─────────────────────────────────────────────────────────');
        const agora = new Date();
        const horarios = [
            { hora: 8, label: "Briefing do Nicho" },
            { hora: 12, label: "Hora do Almoço" },
            { hora: 18, label: "Fim do Expediente" },
            { hora: 20, label: "Preparação Amanhã" }
        ].filter(h => h.hora > agora.getHours());

        if (horarios.length > 0) {
            horarios.forEach(h => {
                console.log(`• ${h.hora}:00 - ${h.label}`);
            });
        } else {
            console.log('• Nenhum lembrete hoje');
        }
        console.log('');

        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║  Comandos: npm run bom-dia | modo-foco | dashboard    ║');
        console.log('╚════════════════════════════════════════════════════════╝');
    }

    getEstatisticas() {
        // Simulação - em produção buscaria dados reais
        return {
            horasFoco: "5h 23min",
            produtividade: 87,
            receita: "R$ 669,00",
            metasConcluidas: 3,
            metasTotal: 5,
            streak: 5,
            recorde: "12h",
            totalSemana: "R$ 3.247,00",
            padroes: [
                { tipo: "Criar newsletter", count: 3 },
                { tipo: "Atualizar planilha", count: 5 }
            ],
            sugestao: "Descansar 30min mais cedo (padrão de sono irregular detectado)"
        };
    }
}

// Se executado diretamente
if (require.main === module) {
    const dashboard = new Dashboard();
    dashboard.show();
}

module.exports = Dashboard;
