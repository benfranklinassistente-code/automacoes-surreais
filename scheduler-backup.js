const cron = require('node-cron');
const { execSync } = require('child_process');

console.log('💾 Backup Diário de Memórias - Scheduler Iniciado');
console.log('⏰ Agendamento: Todo dia à 00:00 (meia-noite)\n');

// Todo dia à meia-noite
cron.schedule('0 0 * * *', () => {
    console.log('\n🔄 [00:00] Executando backup diário...');
    
    try {
        const output = execSync('/root/.openclaw/workspace/backup-diario.sh', {
            cwd: '/root/.openclaw/workspace',
            env: process.env
        });
        console.log(output.toString());
    } catch (err) {
        console.error('❌ Erro no backup:', err.message);
    }
}, {
    timezone: "America/Sao_Paulo"
});

console.log('✅ 00:00 - Backup diário de memórias');
console.log('\n🚀 Scheduler rodando. Pressione Ctrl+C para parar.');
