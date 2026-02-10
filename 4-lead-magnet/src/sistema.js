const PesquisadorNicho = require('./pesquisador');
const GeradorLeadMagnet = require('./gerador');
const LandingPageGenerator = require('./landing-generator');

class LeadMagnetInfinito {
    constructor() {
        this.pesquisador = new PesquisadorNicho();
        this.gerador = new GeradorLeadMagnet();
        this.landing = new LandingPageGenerator();
    }

    async executar() {
        console.log('╔════════════════════════════════════════╗');
        console.log('║   🤖 LEAD MAGNET INFINITO v1.0         ║');
        console.log('║   Sistema de Geração Automática        ║');
        console.log('╚════════════════════════════════════════╝\n');

        try {
            // PASSO 1: Pesquisar
            console.log('📊 PASSO 1: Pesquisando nicho 60+...\n');
            const pesquisa = await this.pesquisador.pesquisarCompleta();
            
            console.log('\n✅ Pesquisa concluída!');
            console.log(`🎯 Tema selecionado: ${pesquisa.temaVencedor.titulo}`);
            console.log(`📈 Score: ${pesquisa.temaVencedor.score}/100`);
            console.log(`💡 Justificativa: ${pesquisa.temaVencedor.justificativa}\n`);

            // PASSO 2: Gerar Lead Magnet
            console.log('📚 PASSO 2: Gerando conteúdo...\n');
            
            const leadMagnet = await this.gerarLeadMagnet(pesquisa.temaVencedor);
            
            console.log('\n✅ Lead magnet gerado!');
            console.log(`📄 Tipo: ${leadMagnet.tipo}`);
            console.log(`📄 Arquivo: ${leadMagnet.arquivo}`);
            console.log(`📄 Páginas: ${leadMagnet.paginas || 'N/A'}\n`);

            // PASSO 3: Gerar Landing Page
            console.log('🌐 PASSO 3: Criando landing page...\n');
            
            const landing = await this.landing.gerarLandingPage({
                titulo: pesquisa.temaVencedor.titulo,
                subtitulo: pesquisa.temaVencedor.subtitulo,
                tipo: leadMagnet.tipo,
                problema: pesquisa.temaVencedor.problema
            });
            
            console.log('\n✅ Landing page criada!');
            console.log(`🌐 Arquivo: ${landing.arquivo}`);
            console.log(`🔗 URL: ${landing.url}\n`);

            // PASSO 4: Resumo final
            this.mostrarResumo(pesquisa, leadMagnet, landing);

            return {
                sucesso: true,
                pesquisa,
                leadMagnet,
                landing
            };

        } catch (erro) {
            console.error('❌ Erro na execução:', erro.message);
            return {
                sucesso: false,
                erro: erro.message
            };
        }
    }

    async gerarLeadMagnet(tema) {
        // Decide qual formato gerar baseado no tema
        if (tema.formato === 'checklist') {
            return await this.gerador.gerarChecklist({
                titulo: tema.titulo,
                subtitulo: tema.subtitulo,
                items: [
                    'Verificar remetente do email/SMS',
                    'Confirmar identidade por ligação',
                    'Checar URL do site (começa com https?)',
                    'Desconfiar de urgência excessiva',
                    'Nunca clicar em links suspeitos',
                    'Verificar erros de português',
                    'Confirmar com familiar de confiança',
                    'Não compartilhar senhas/códigos',
                    'Verificar se pedido faz sentido',
                    'Quando em dúvida, NÃO FAÇA'
                ]
            });
        } else {
            // Padrão: ebook
            return await this.gerador.gerarEbook({
                titulo: tema.titulo,
                subtitulo: tema.subtitulo,
                paginas: tema.paginas,
                tema: tema.problema
            });
        }
    }

    mostrarResumo(pesquisa, leadMagnet, landing) {
        console.log('\n' + '='.repeat(60));
        console.log('📊 RESUMO DA GERAÇÃO');
        console.log('='.repeat(60) + '\n');

        console.log('🎯 TEMA:');
        console.log(`   ${pesquisa.temaVencedor.titulo}`);
        console.log(`   ${pesquisa.temaVencedor.subtitulo}\n`);

        console.log('📈 DADOS DE MERCADO:');
        console.log(`   • Trend: ${pesquisa.trends[0].crescimento}`);
        console.log(`   • Volume: ${pesquisa.trends[0].volume}`);
        console.log(`   • Concorrência: ${pesquisa.analiseConcorrencia.gaps.length} gaps identificados\n`);

        console.log('📦 LEAD MAGNET:');
        console.log(`   • Tipo: ${leadMagnet.tipo.toUpperCase()}`);
        console.log(`   • Arquivo: ${leadMagnet.arquivo}`);
        console.log(`   • Local: ${leadMagnet.caminho}\n`);

        console.log('🌐 LANDING PAGE:');
        console.log(`   • HTML: ${landing.arquivo}`);
        console.log(`   • URL: ${landing.url}\n`);

        console.log('📧 SEQUÊNCIA DE EMAILS:');
        console.log('   (Configurar manualmente no email marketing)');
        console.log('   1. Boas-vindas + Download');
        console.log('   2. Dica #1 (Dia 2)');
        console.log('   3. Case de sucesso (Dia 4)');
        console.log('   4. Oferta curso (Dia 6)');
        console.log('   5. Última chance (Dia 8)\n');

        console.log('='.repeat(60));
        console.log('✅ Sistema pronto para deploy!');
        console.log('='.repeat(60) + '\n');

        console.log('🚀 PRÓXIMOS PASSOS:');
        console.log('   1. Revisar conteúdo gerado');
        console.log('   2. Converter Markdown → PDF (se necessário)');
        console.log('   3. Fazer upload do arquivo');
        console.log('   4. Configurar formulário de captura');
        console.log('   5. Criar sequência de emails\n');
    }
}

// Executar se chamado diretamente
if (require.main === module) {
    const sistema = new LeadMagnetInfinito();
    sistema.executar();
}

module.exports = LeadMagnetInfinito;
