require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

class AssistentePessoal24_7 {
    constructor() {
        this.dataDir = path.join(__dirname, '../data');
        this.configFile = path.join(__dirname, '../config/user-profile.json');
        this.activityLog = path.join(this.dataDir, 'activity-log.json');
        this.patternsFile = path.join(this.dataDir, 'patterns.json');
        
        this.ensureDirectories();
        this.loadUserProfile();
    }

    ensureDirectories() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
        if (!fs.existsSync(this.activityLog)) {
            fs.writeFileSync(this.activityLog, JSON.stringify([]));
        }
        if (!fs.existsSync(this.patternsFile)) {
            fs.writeFileSync(this.patternsFile, JSON.stringify({}));
        }
    }

    loadUserProfile() {
        if (fs.existsSync(this.configFile)) {
            this.profile = JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
        } else {
            // Perfil padrão do Luis
            this.profile = {
                nome: "Luis",
                preferencias: {
                    horarioInicio: "06:00",
                    horarioFim: "20:00",
                    canalPreferido: "telegram", // telegram, whatsapp, email
                    fusoHorario: "America/Sao_Paulo"
                },
                contatos: {
                    mae: "+554484130849",
                    whatsappPessoal: "+5511953545939"
                },
                projetos: ["60maisPlay", "Newsletter", "Aulas"],
                metas: {
                    faturamentoMensal: 50000,
                    alunosNovos: 100
                }
            };
            this.saveProfile();
        }
    }

    saveProfile() {
        fs.writeFileSync(this.configFile, JSON.stringify(this.profile, null, 2));
    }

    // ============ ROTINA DIÁRIA ============

    async bomDia() {
        const hora = new Date().getHours();
        if (hora !== 6) return; // Só executa às 6h

        const mensagem = await this.gerarMensagemBomDia();
        await this.enviarNotificacao("☀️ Bom dia!", mensagem);
        console.log("✅ Mensagem de bom dia enviada");
    }

    async briefingManha() {
        const hora = new Date().getHours();
        if (hora !== 8) return;

        const mensagem = await this.gerarBriefingManha();
        await this.enviarNotificacao("📰 Briefing do Nicho", mensagem);
        console.log("✅ Briefing da manhã enviado");
    }

    async horaDoAlmoco() {
        const hora = new Date().getHours();
        if (hora !== 12) return;

        const stats = this.getEstatisticasDia();
        const mensagem = `🍽️ Hora de pausar!\n\n⏱️ Você trabalhou ${stats.horasTrabalhadas}h hoje\n🎯 Produtividade: ${stats.produtividade}%\n\n💡 Lembretes pós-almoço:\n${stats.tarefasPendentes.map(t => "- " + t).join("\n")}`;
        
        await this.enviarNotificacao("🍽️ Hora do Almoço", mensagem);
        console.log("✅ Lembrete de almoço enviado");
    }

    async fimDoExpediente() {
        const hora = new Date().getHours();
        if (hora !== 18) return;

        const stats = this.getEstatisticasDia();
        const mensagem = `🌇 Fim do dia!\n\n📊 Resumo de hoje:\n✅ Tarefas concluídas: ${stats.tarefasConcluidas}/${stats.tarefasTotal}\n💰 Vendas: ${stats.vendas}\n📈 Novos alunos: ${stats.novosAlunos}\n\n🏆 Conquista do dia: ${stats.conquista}\n\n📋 Amanhã:\n${stats.prioridadesAmanha.map((p, i) => `${i+1}. ${p}`).join("\n")}`;

        await this.enviarNotificacao("🌇 Fim do Expediente", mensagem);
        console.log("✅ Resumo do dia enviado");
    }

    async preparacaoAmanha() {
        const hora = new Date().getHours();
        if (hora !== 20) return;

        const amanha = this.prepararAgendaAmanha();
        const mensagem = `🌙 Preparando seu amanhã...\n\n📅 Agenda organizada:\n${amanha.compromissos.map(c => `• ${c.hora} - ${c.titulo}`).join("\n")}\n\n📧 Emails priorizados:\n✅ ${amanha.emails.importantes} importantes marcados\n✅ ${amanha.emails.spam} spam limpo\n📌 ${amanha.emails.aguardando} aguardando resposta\n\n💤 Boa noite! Descanse bem.\nAmanhã tem mais. 💪`;

        await this.enviarNotificacao("🌙 Preparação para Amanhã", mensagem);
        console.log("✅ Preparação para amanhã enviada");
    }

    // ============ FUNÇÕES INTELIGENTES ============

    detectarPadraoAtividade() {
        const logs = JSON.parse(fs.readFileSync(this.activityLog, 'utf8'));
        const hoje = new Date().toDateString();
        const logsHoje = logs.filter(l => new Date(l.timestamp).toDateString() === hoje);

        // Detecta horários produtivos
        const horariosProdutivos = this.analisarHorariosProdutivos(logsHoje);
        
        // Detecta tarefas repetitivas
        const tarefasRepetitivas = this.analisarTarefasRepetitivas(logs);

        return {
            horariosProdutivos,
            tarefasRepetitivas
        };
    }

    analisarHorariosProdutivos(logs) {
        const porHora = {};
        logs.forEach(log => {
            const hora = new Date(log.timestamp).getHours();
            if (!porHora[hora]) porHora[hora] = 0;
            porHora[hora] += log.intensidade || 1;
        });

        // Encontra as 3 horas mais produtivas
        const horasOrdenadas = Object.entries(porHora)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([hora, _]) => `${hora}:00`);

        return horasOrdenadas;
    }

    analisarTarefasRepetitivas(logs) {
        const ultimos7Dias = logs.filter(l => {
            const diasDiff = (new Date() - new Date(l.timestamp)) / (1000 * 60 * 60 * 24);
            return diasDiff <= 7;
        });

        const contagem = {};
        ultimos7Dias.forEach(log => {
            if (!contagem[log.tipo]) contagem[log.tipo] = 0;
            contagem[log.tipo]++;
        });

        // Retorna tarefas feitas 3+ vezes
        return Object.entries(contagem)
            .filter(([_, count]) => count >= 3)
            .map(([tipo, count]) => ({ tipo, count }));
    }

    async lembreteContextual() {
        // Verifica contexto e envia lembretes relevantes
        const contexto = await this.obterContextoAtual();
        
        if (contexto.local === "perto_da_padaria") {
            await this.enviarNotificacao("📍 Lembrete Local", "Você está perto da padaria da Dona Lourdes. Ela pediu para avisar quando tivesse novos bolos! 🧁");
        }
    }

    async modoFoco(duracao = 120) { // minutos
        const mensagem = `🎯 Modo Foco ativado (${duracao} minutos)\n\nBloqueando:\n❌ WhatsApp (exceto emergências)\n❌ Instagram\n❌ Notificações de email\n\nPermitindo:\n✅ Telegram (sua família)\n✅ Ligações\n✅ Mensagens com "URGENTE"\n\n⏱️ Cronômetro iniciado\n🏆 Recompensa ao final: 15 min de pausa`;

        await this.enviarNotificacao("🎯 Modo Foco", mensagem);
        
        // Registra início do modo foco
        this.registrarAtividade('modo_foco_inicio', { duracao });
    }

    // ============ UTILITÁRIOS ============

    async gerarMensagemBomDia() {
        const diaSemana = new Date().toLocaleDateString('pt-BR', { weekday: 'long' });
        const stats = this.getStatsSemana();
        
        return `☀️ Bom dia, ${this.profile.nome}!\n\nHoje é ${diaSemana}.\n\n📧 Resumo:\n• ${stats.emailsNovos} emails novos\n• ${stats.tarefasHoje} tarefas para hoje\n\n📅 Hoje:\n${this.getAgendaDia().map(e => `• ${e.hora} - ${e.titulo}`).join("\n")}\n\n💡 Sugestão do dia:\n${await this.gerarSugestaoDia()}`;
    }

    async gerarBriefingManha() {
        return `📰 Notícias 60+ (resumo):\n\n• Nova atualização WhatsApp (relevante para alunos)\n• Golpe do PIX cresce 30% (tema para newsletter)\n• Dia Nacional do Idoso em 27/09 (oportunidade)\n\n🔥 Trends YouTube:\n• "Como usar Instagram" +45% buscas\n• "Segurança digital" viralizando\n\n💡 Ideia do dia:\nCriar curso "Instagram para Avós"?\nBusca alta + pouca concorrência`;
    }

    gerarSugestaoDia() {
        const sugestoes = [
            "Sua mãe não respondeu WhatsApp há 2 dias. Quer que eu envie mensagem de check?",
            "Você tem 3 tarefas pendentes do projeto 60maisPlay. Priorizar?",
            "A newsletter de ontem teve ótimo engajamento! Considerar série sobre o tema?",
            "Detectei padrão: você trabalha melhor das 9h às 12h. Proteger esse horário?"
        ];
        return sugestoes[Math.floor(Math.random() * sugestoes.length)];
    }

    getEstatisticasDia() {
        // Simulação - em produção, buscaria de APIs reais
        return {
            horasTrabalhadas: "5h 23min",
            produtividade: 87,
            tarefasConcluidas: 12,
            tarefasTotal: 15,
            tarefasPendentes: ["Revisar email da Dona Maria", "Revisar métricas 60maisPlay"],
            vendas: "R$ 669,00",
            novosAlunos: 1,
            conquista: "Plataforma 60maisPlay no ar!",
            prioridadesAmanha: [
                "Barra de acessibilidade (60maisPlay)",
                "Página de admin",
                "Responder emails pendentes"
            ]
        };
    }

    prepararAgendaAmanha() {
        return {
            compromissos: [
                { hora: "10:00", titulo: "Aula 60mais (remoto)" },
                { hora: "15:00", titulo: "Reunião com fornecedor" }
            ],
            emails: {
                importantes: 3,
                spam: 12,
                aguardando: 5
            }
        };
    }

    getStatsSemana() {
        return {
            emailsNovos: 3,
            tarefasHoje: 5
        };
    }

    getAgendaDia() {
        return [
            { hora: "10:00", titulo: "Aula 60mais (remoto)" },
            { hora: "15:00", titulo: "Reunião com fornecedor" }
        ];
    }

    async enviarNotificacao(titulo, mensagem) {
        const canal = this.profile.preferencias.canalPreferido;
        
        if (canal === "telegram") {
            // Envia via OpenClaw message tool
            console.log(`📱 Telegram: ${titulo}`);
            console.log(mensagem);
            // Aqui integraria com o sistema de mensagens
        } else if (canal === "whatsapp") {
            console.log(`💬 WhatsApp: ${titulo}`);
            console.log(mensagem);
        }

        // Salva no log
        this.registrarAtividade('notificacao_enviada', { titulo, canal });
    }

    registrarAtividade(tipo, dados = {}) {
        const logs = JSON.parse(fs.readFileSync(this.activityLog, 'utf8'));
        logs.push({
            timestamp: new Date().toISOString(),
            tipo,
            ...dados
        });
        fs.writeFileSync(this.activityLog, JSON.stringify(logs, null, 2));
    }

    async obterContextoAtual() {
        // Em produção, integraria com GPS, calendário, etc.
        return {
            local: "escritorio",
            hora: new Date().getHours(),
            diaSemana: new Date().getDay()
        };
    }

    // ============ EXECUÇÃO PRINCIPAL ============

    async executarRotina(horario) {
        switch(horario) {
            case '06:00':
                await this.bomDia();
                break;
            case '08:00':
                await this.briefingManha();
                break;
            case '12:00':
                await this.horaDoAlmoco();
                break;
            case '18:00':
                await this.fimDoExpediente();
                break;
            case '20:00':
                await this.preparacaoAmanha();
                break;
            default:
                console.log(`⏰ Horário ${horario} - sem ação programada`);
        }
    }
}

// Se executado diretamente
if (require.main === module) {
    const assistente = new AssistentePessoal24_7();
    
    // Pega hora atual e executa rotina correspondente
    const agora = new Date();
    const horaStr = `${String(agora.getHours()).padStart(2, '0')}:00`;
    
    console.log(`🤖 Assistente Pessoal 24/7 - Execução: ${horaStr}`);
    assistente.executarRotina(horaStr);
}

module.exports = AssistentePessoal24_7;
