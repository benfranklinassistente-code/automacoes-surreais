#!/usr/bin/env node
/**
 * 🧪 EXEMPLO: Simulação de Detecção de Padrões
 * 
 * Este script demonstra como o sistema detecta padrões
 * e sugere automações após 3 repetições.
 */

const ClonagemTarefas = require('../src/clonagem');

console.log('🧬 Clonagem de Tarefas - Demonstração\n');
console.log('═══════════════════════════════════════════════════════════\n');

const clonador = new ClonagemTarefas();

// Limpa dados anteriores para demonstração
const fs = require('fs');
const path = require('path');
const dataDir = path.join(__dirname, '../data');

fs.writeFileSync(path.join(dataDir, 'tarefas-log.json'), '[]');
fs.writeFileSync(path.join(dataDir, 'padroes-detectados.json'), '{}');

console.log('📋 Cenário: Você faz backup manual todo dia...\n');

const tarefas = [
    {
        tipo: 'backup',
        comando: 'tar czf backup-2024-02-10.tar.gz ./workspace',
        contexto: { importante: true, projeto: '60maisPlay' }
    },
    {
        tipo: 'backup', 
        comando: 'tar czf backup-2024-02-09.tar.gz ./workspace',
        contexto: { importante: true, projeto: '60maisPlay' }
    },
    {
        tipo: 'backup',
        comando: 'tar czf backup-2024-02-08.tar.gz ./workspace',
        contexto: { importante: true, projeto: '60maisPlay' }
    }
];

console.log('📝 Registrando tarefas...\n');

tarefas.forEach((t, i) => {
    console.log(`Tarefa ${i + 1}: ${t.tipo}`);
    console.log(`  Comando: ${t.comando}`);
    clonador.registrarTarefa(t.tipo, t.comando, t.contexto);
    console.log('');
});

console.log('🔍 Verificando padrões...\n');
clonador.verificarPadroes();

console.log('\n═══════════════════════════════════════════════════════════\n');
console.log('✅ DEMONSTRAÇÃO CONCLUÍDA!\n');
console.log('O sistema detectou que você faz backup todos os dias');
console.log('e gerou uma sugestão de automação!\n');
console.log('Execute "npm run dashboard" para ver o resultado.');
