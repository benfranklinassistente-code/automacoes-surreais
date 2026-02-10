const fs = require('fs');
const path = require('path');

class ClonagemTarefas {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.configFile = path.join(__dirname, '../config/padroes-config.json');
        this.logFile = path.join(this.dataDir, 'tarefas-log.json');
        this.padroesFile = path.join(this.dataDir, 'padroes-detectados.json');
        this.automacoesDir = path.join(__dirname, '../automacoes-geradas');
        
        this.ensureDirectories();
        this.config = this.loadConfig();
    }

    ensureDirectories() {
        [this.dataDir, this.automacoesDir].forEach(dir => {
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        });
        
        if (!fs.existsSync(this.logFile)) {
            fs.writeFileSync(this.logFile, JSON.stringify([]));
        }
        if (!fs.existsSync(this.padroesFile)) {
            fs.writeFileSync(this.padroesFile, JSON.stringify({}));
        }
    }

    loadConfig() {
        if (fs.existsSync(this.configFile)) {
            return JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        }
        return {
            thresholdRepeticoes: 3,
            thresholdDias: 7,
            autoSugerir: true,
            ignorarTarefas: ['dormir', 'comer', 'banho'],
            comandosComuns: {
                'git add': 'git',
                'npm install': 'node',
                'python': 'python',
                'docker': 'docker',
                'ssh': 'ssh',
                'scp': 'ssh',
                'rsync': 'backup',
                'tar': 'backup',
                'newsletter': 'conteudo',
                'planilha': 'financas',
                'email': 'comunicacao'
            }
        };
    }

    // ============ REGISTRO DE TAREFAS ============

    registrarTarefa(tipo, comando, contexto = {}) {
        const log = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
        
        const entrada = {
            id: Date.now().toString(36),
            timestamp: new Date().toISOString(),
            tipo,
            comando: this.normalizarComando(comando),
            contexto,
            hash: this.gerarHash(tipo, comando)
        };

        log.push(entrada);
        fs.writeFileSync(this.logFile, JSON.stringify(log, null, 2));
        
        console.log(`📝 Tarefa registrada: ${tipo}`);
        
        // Verifica se atingiu threshold
        this.verificarPadroes();
        
        return entrada;
    }

    normalizarComando(comando) {
        return comando
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\d{4}-\d{2}-\d{2}/g, '[DATA]')  // Normaliza datas
            .replace(/\d{2}:\d{2}/g, '[HORA]');        // Normaliza horas
    }

    gerarHash(tipo, comando) {
        const str = `${tipo}:${this.normalizarComando(comando)}`;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        // Garante hash positivo e consistente
        return Math.abs(hash).toString(16).substring(0, 8);
    }

    // ============ DETECÇÃO DE PADRÕES ============

    verificarPadroes() {
        const log = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
        const padroes = JSON.parse(fs.readFileSync(this.padroesFile, 'utf8'));
        
        // Agrupa por hash
        const grupos = {};
        log.forEach(entrada => {
            if (!grupos[entrada.hash]) grupos[entrada.hash] = [];
            grupos[entrada.hash].push(entrada);
        });

        // Detecta novos padrões
        Object.entries(grupos).forEach(([hash, entradas]) => {
            if (entradas.length >= this.config.thresholdRepeticoes) {
                const tipo = entradas[0].tipo;
                const comandoBase = entradas[0].comando;
                
                if (!padroes[hash]) {
                    // Novo padrão detectado!
                    padroes[hash] = {
                        tipo,
                        comando: comandoBase,
                        repeticoes: entradas.length,
                        primeiraVez: entradas[0].timestamp,
                        ultimaVez: entradas[entradas.length - 1].timestamp,
                        sugerido: false,
                        automatizado: false,
                        confianca: this.calcularConfianca(entradas)
                    };

                    console.log(`\n🔍 PADRÃO DETECTADO!`);
                    console.log(`   Tipo: ${tipo}`);
                    console.log(`   Repetições: ${entradas.length}x`);
                    console.log(`   Comando: ${comandoBase.substring(0, 60)}...`);
                    
                    if (this.config.autoSugerir) {
                        this.sugerirAutomacao(hash, padroes[hash], padroes);
                    }
                } else {
                    // Atualiza contagem
                    padroes[hash].repeticoes = entradas.length;
                    padroes[hash].ultimaVez = entradas[entradas.length - 1].timestamp;
                }
            }
        });

        fs.writeFileSync(this.padroesFile, JSON.stringify(padroes, null, 2));
    }

    calcularConfianca(entradas) {
        // Mais repetições = mais confiança
        const repeticoes = entradas.length;
        const diasUnicos = new Set(entradas.map(e => 
            new Date(e.timestamp).toDateString()
        )).size;
        
        let confianca = Math.min(repeticoes * 10, 50);  // Base: repetições
        confianca += Math.min(diasUnicos * 5, 30);       // Bônus: consistência temporal
        confianca += entradas.some(e => e.contexto?.importante) ? 10 : 0;
        
        return Math.min(confianca, 95);  // Max 95%
    }

    // ============ SUGESTÃO DE AUTOMAÇÃO ============

    sugerirAutomacao(hash, padrao, padroes) {
        const tipoAutomacao = this.identificarTipoAutomacao(padrao);
        const scriptGerado = this.gerarScript(padrao, tipoAutomacao);
        
        console.log(`\n💡 SUGESTÃO DE AUTOMAÇÃO`);
        console.log(`   Confiança: ${padrao.confianca}%`);
        console.log(`   Tipo: ${tipoAutomacao}`);
        console.log(`   Economia estimada: ${this.calcularEconomia(padrao)}`);
        
        // Salva sugestão
        const arquivoSugestao = path.join(this.automacoesDir, `sugestao-${hash}.js`);
        fs.writeFileSync(arquivoSugestao, scriptGerado);
        
        console.log(`   Arquivo: ${arquivoSugestao}`);
        console.log(`\n🤖 Para ativar: ./ativar-automacao.sh ${hash}`);
        
        // Atualiza status (usando o objeto passado)
        padroes[hash].sugerido = true;
        padroes[hash].arquivoSugestao = arquivoSugestao;
        
        return {
            hash,
            tipo: tipoAutomacao,
            arquivo: arquivoSugestao,
            confianca: padrao.confianca
        };
    }

    identificarTipoAutomacao(padrao) {
        const cmd = padrao.comando.toLowerCase();
        const tipo = padrao.tipo.toLowerCase();
        
        // Verifica comandos comuns
        for (const [key, value] of Object.entries(this.config.comandosComuns)) {
            if (cmd.includes(key)) return value;
        }
        
        // Inferência por tipo
        if (tipo.includes('backup')) return 'backup';
        if (tipo.includes('deploy')) return 'deploy';
        if (tipo.includes('test')) return 'test';
        if (tipo.includes('build')) return 'build';
        if (tipo.includes('email') || tipo.includes('mensagem')) return 'comunicacao';
        if (tipo.includes('planilha') || tipo.includes('financeiro')) return 'financas';
        if (tipo.includes('newsletter') || tipo.includes('conteudo')) return 'conteudo';
        
        return 'script';
    }

    gerarScript(padrao, tipo) {
        const nome = `auto-${tipo}-${Date.now().toString(36)}`;
        
        const template = `#!/usr/bin/env node
/**
 * 🤖 AUTOMAÇÃO GERADA AUTOMATICAMENTE
 * Tipo: ${tipo}
 * Detectado após: ${padrao.repeticoes} repetições
 * Confiança: ${padrao.confianca}%
 * Gerado em: ${new Date().toISOString()}
 */

const { exec } = require('child_process');
const fs = require('fs');

class ${this.toCamelCase(nome)} {
    constructor() {
        this.nome = "${nome}";
        this.tipo = "${tipo}";
        this.ultimaExecucao = null;
    }

    async executar() {
        console.log(\`🤖 Executando: \${this.nome}\`);
        
        // Comando detectado:
        // ${padrao.comando.substring(0, 80)}${padrao.comando.length > 80 ? '...' : ''}
        
        try {
            // TODO: Implementar lógica específica
            await this.executarComandoBase();
            this.ultimaExecucao = new Date().toISOString();
            this.registrarSucesso();
            console.log('✅ Automação concluída');
        } catch (erro) {
            console.error('❌ Erro:', erro.message);
            this.registrarErro(erro);
        }
    }

    async executarComandoBase() {
        // Implementação baseada no padrão detectado
        const comando = \`${padrao.comando}\`;
        
        return new Promise((resolve, reject) => {
            exec(comando, (error, stdout, stderr) => {
                if (error) reject(error);
                else resolve(stdout);
            });
        });
    }

    registrarSucesso() {
        const log = {
            timestamp: new Date().toISOString(),
            automacao: this.nome,
            status: 'sucesso'
        };
        console.log('📝 Log registrado');
    }

    registrarErro(erro) {
        const log = {
            timestamp: new Date().toISOString(),
            automacao: this.nome,
            status: 'erro',
            mensagem: erro.message
        };
        console.log('📝 Erro registrado');
    }
}

// Execução direta
if (require.main === module) {
    const auto = new ${this.toCamelCase(nome)}();
    auto.executar();
}

module.exports = ${this.toCamelCase(nome)};
`;

        return template;
    }

    toCamelCase(str) {
        return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase())
                  .replace(/^(.)/, (_, char) => char.toUpperCase());
    }

    calcularEconomia(padrao) {
        const minutosPorExecucao = 5;  // Estimativa conservadora
        const repeticoesMes = padrao.repeticoes * 4;  // Projeção mensal
        const minutosEconomizados = repeticoesMes * minutosPorExecucao;
        const horasEconomizadas = Math.round(minutosEconomizados / 60);
        
        return `${horasEconomizadas}h/mês`;
    }

    // ============ RELATÓRIOS ============

    gerarRelatorio() {
        const log = JSON.parse(fs.readFileSync(this.logFile, 'utf8'));
        const padroes = JSON.parse(fs.readFileSync(this.padroesFile, 'utf8'));
        
        const ultimas24h = log.filter(e => {
            const horas = (new Date() - new Date(e.timestamp)) / (1000 * 60 * 60);
            return horas <= 24;
        });

        const ultimos7d = log.filter(e => {
            const dias = (new Date() - new Date(e.timestamp)) / (1000 * 60 * 60 * 24);
            return dias <= 7;
        });

        const padoesAtivos = Object.values(padroes).filter(p => p.sugerido && !p.automatizado);
        const padoesAutomatizados = Object.values(padroes).filter(p => p.automatizado);

        return {
            resumo: {
                totalTarefas: log.length,
                tarefas24h: ultimas24h.length,
                tarefas7d: ultimos7d.length,
                padroesDetectados: Object.keys(padroes).length,
                sugestoesPendentes: padoesAtivos.length,
                automatizacoesAtivas: padoesAutomatizados.length
            },
            topPadroes: Object.entries(padroes)
                .sort((a, b) => b[1].repeticoes - a[1].repeticoes)
                .slice(0, 5)
                .map(([hash, p]) => ({
                    tipo: p.tipo,
                    repeticoes: p.repeticoes,
                    confianca: p.confianca,
                    sugerido: p.sugerido,
                    automatizado: p.automatizado
                })),
            ultimasTarefas: ultimas24h.slice(-10).map(e => ({
                tipo: e.tipo,
                hora: new Date(e.timestamp).toLocaleTimeString('pt-BR'),
                comando: e.comando.substring(0, 40) + '...'
            }))
        };
    }

    mostrarDashboard() {
        const relatorio = this.gerarRelatorio();
        
        console.clear();
        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║    🧬 CLONAGEM DE TAREFAS - DASHBOARD                   ║');
        console.log('╚════════════════════════════════════════════════════════╝\n');

        console.log('📊 RESUMO');
        console.log('─────────────────────────────────────────────────────────');
        console.log(`📝 Total tarefas registradas: ${relatorio.resumo.totalTarefas}`);
        console.log(`📈 Últimas 24h: ${relatorio.resumo.tarefas24h}`);
        console.log(`📅 Últimos 7 dias: ${relatorio.resumo.tarefas7d}`);
        console.log(`🔍 Padrões detectados: ${relatorio.resumo.padroesDetectados}`);
        console.log(`💡 Sugestões pendentes: ${relatorio.resumo.sugestoesPendentes}`);
        console.log(`🤖 Automações ativas: ${relatorio.resumo.automatizacoesAtivas}`);
        console.log('');

        if (relatorio.topPadroes.length > 0) {
            console.log('🏆 TOP PADRÕES DETECTADOS');
            console.log('─────────────────────────────────────────────────────────');
            relatorio.topPadroes.forEach((p, i) => {
                const status = p.automatizado ? '✅' : (p.sugerido ? '💡' : '🔍');
                console.log(`${i+1}. ${status} ${p.tipo} (${p.repeticoes}x) - ${p.confianca}%`);
            });
            console.log('');
        }

        if (relatorio.ultimasTarefas.length > 0) {
            console.log('⏰ ÚLTIMAS TAREFAS (24h)');
            console.log('─────────────────────────────────────────────────────────');
            relatorio.ultimasTarefas.forEach(t => {
                console.log(`• ${t.hora} - ${t.tipo}`);
            });
            console.log('');
        }

        console.log('╔════════════════════════════════════════════════════════╗');
        console.log('║  Comandos: registrar | detectar | relatorio | ativar  ║');
        console.log('╚════════════════════════════════════════════════════════╝');
    }

    ativarAutomacao(hash) {
        const padroes = JSON.parse(fs.readFileSync(this.padroesFile, 'utf8'));
        
        if (!padroes[hash]) {
            console.log('❌ Padrão não encontrado');
            return false;
        }

        if (!padroes[hash].sugerido) {
            console.log('⚠️  Sugestão ainda não gerada');
            return false;
        }

        // Move de sugestão para ativa
        const arquivoSugestao = padroes[hash].arquivoSugestao;
        const nomeArquivo = path.basename(arquivoSugestao);
        const arquivoAtivo = path.join(this.automacoesDir, 'ativas', nomeArquivo);
        
        if (!fs.existsSync(path.dirname(arquivoAtivo))) {
            fs.mkdirSync(path.dirname(arquivoAtivo), { recursive: true });
        }

        fs.renameSync(arquivoSugestao, arquivoAtivo);
        fs.chmodSync(arquivoAtivo, 0o755);  // Torna executável

        padroes[hash].automatizado = true;
        padroes[hash].arquivoAtivo = arquivoAtivo;
        padroes[hash].dataAtivacao = new Date().toISOString();
        
        fs.writeFileSync(this.padroesFile, JSON.stringify(padroes, null, 2));

        console.log('✅ Automação ativada!');
        console.log(`   Arquivo: ${arquivoAtivo}`);
        console.log(`   Execute: node ${arquivoAtivo}`);

        return true;
    }
}

// Se executado diretamente
if (require.main === module) {
    const clonador = new ClonagemTarefas();
    
    const comando = process.argv[2];
    
    switch(comando) {
        case 'registrar':
            const tipo = process.argv[3] || 'tarefa';
            const cmd = process.argv[4] || 'comando';
            clonador.registrarTarefa(tipo, cmd, { importante: true });
            break;
        case 'detectar':
            clonador.verificarPadroes();
            break;
        case 'relatorio':
            console.log(JSON.stringify(clonador.gerarRelatorio(), null, 2));
            break;
        case 'dashboard':
            clonador.mostrarDashboard();
            break;
        case 'ativar':
            const hash = process.argv[3];
            if (hash) clonador.ativarAutomacao(hash);
            else console.log('Uso: node clonagem.js ativar <hash>');
            break;
        default:
            console.log('🧬 Clonagem de Tarefas Repetitivas');
            console.log('');
            console.log('Uso:');
            console.log('  node clonagem.js registrar <tipo> <comando>');
            console.log('  node clonagem.js detectar');
            console.log('  node clonagem.js relatorio');
            console.log('  node clonagem.js dashboard');
            console.log('  node clonagem.js ativar <hash>');
            console.log('');
            console.log('Exemplo:');
            console.log('  node clonagem.js registrar "backup" "tar czf backup.tar.gz ./data"');
            clonador.mostrarDashboard();
    }
}

module.exports = ClonagemTarefas;
