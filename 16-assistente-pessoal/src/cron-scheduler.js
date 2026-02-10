const cron = require('node-cron');
const AssistentePessoal = require('./assistente');

console.log('🤖 Assistente Pessoal 24/7 - Cron Scheduler Iniciado');
console.log('⏰ Agendamentos ativos:\n');

const assistente = new AssistentePessoal();

// 06:00 - Bom dia!
cron.schedule('0 6 * * *', async () => {
    console.log('[06:00] Enviando bom dia...');
    await assistente.bomDia();
}, {
    timezone: "America/Sao_Paulo"
});
console.log('✅ 06:00 - Bom dia!');

// 08:00 - Briefing da manhã
cron.schedule('0 8 * * *', async () => {
    console.log('[08:00] Enviando briefing...');
    await assistente.briefingManha();
}, {
    timezone: "America/Sao_Paulo"
});
console.log('✅ 08:00 - Briefing do Nicho');

// 12:00 - Hora do almoço
cron.schedule('0 12 * * *', async () => {
    console.log('[12:00] Lembrete de almoço...');
    await assistente.horaDoAlmoco();
}, {
    timezone: "America/Sao_Paulo"
});
console.log('✅ 12:00 - Hora do Almoço');

// 18:00 - Fim do expediente
cron.schedule('0 18 * * *', async () => {
    console.log('[18:00] Resumo do dia...');
    await assistente.fimDoExpediente();
}, {
    timezone: "America/Sao_Paulo"
});
console.log('✅ 18:00 - Fim do Expediente');

// 20:00 - Preparação para amanhã
cron.schedule('0 20 * * *', async () => {
    console.log('[20:00] Preparando amanhã...');
    await assistente.preparacaoAmanha();
}, {
    timezone: "America/Sao_Paulo"
});
console.log('✅ 20:00 - Preparação para Amanhã');

console.log('\n🚀 Scheduler rodando. Pressione Ctrl+C para parar.');
console.log('📱 O assistente enviará notificações nos horários agendados.');
