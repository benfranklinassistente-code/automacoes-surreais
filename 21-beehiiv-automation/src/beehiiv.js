// Beehiiv Automation - Publicação de Newsletters
// Não requer dotenv - credenciais hardcoded para automação

class BeehiivAutomation {
    constructor() {
        this.apiKey = 'Yf4b1NDFyI7nRu8jTR1YlNr1L5B3wgyNM35W68XYbIM5GttGTBXwbxdgZhJinEdg';
        this.publicationId = 'pub_1f90e761-b2ff-4b49-8aba-c765bf91c6e9';
        this.baseUrl = 'https://api.beehiiv.com/v2';
    }

    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/publications`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Conexão Beehiiv OK!');
                console.log(`📰 Publication: ${data.data[0]?.name}`);
                return true;
            } else {
                console.error('❌ Erro na conexão:', response.status);
                return false;
            }
        } catch (error) {
            console.error('❌ Erro:', error.message);
            return false;
        }
    }

    async criarPost(titulo, conteudoHTML, options = {}) {
        const {
            status = 'draft', // 'draft', 'confirmed', 'scheduled'
            sendAt = null,    // ISO 8601 para agendamento
            emailSubject = titulo,
            subtitle = ''
        } = options;

        try {
            const postData = {
                email_subject: emailSubject,
                email_preview_text: subtitle,
                content: conteudoHTML,
                status: status
            };

            if (sendAt) {
                postData.send_at = sendAt;
            }

            const response = await fetch(
                `${this.baseUrl}/publications/${this.publicationId}/posts`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(postData)
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Post criado com sucesso!');
                console.log(`📧 ID: ${data.data?.id}`);
                console.log(`📊 Status: ${data.data?.status}`);
                return data.data;
            } else {
                const error = await response.text();
                console.error('❌ Erro ao criar post:', error);
                return null;
            }
        } catch (error) {
            console.error('❌ Erro:', error.message);
            return null;
        }
    }

    async listarPosts(limit = 10) {
        try {
            const response = await fetch(
                `${this.baseUrl}/publications/${this.publicationId}/posts?limit=${limit}`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                return data.data;
            } else {
                console.error('❌ Erro ao listar posts');
                return [];
            }
        } catch (error) {
            console.error('❌ Erro:', error.message);
            return [];
        }
    }

    async agendarPost(titulo, conteudoHTML, dataHora) {
        // dataHora deve ser ISO 8601: "2026-02-15T10:00:00Z"
        return await this.criarPost(titulo, conteudoHTML, {
            status: 'scheduled',
            sendAt: dataHora
        });
    }

    async publicarImediato(titulo, conteudoHTML) {
        return await this.criarPost(titulo, conteudoHTML, {
            status: 'confirmed'
        });
    }

    async salvarRascunho(titulo, conteudoHTML) {
        return await this.criarPost(titulo, conteudoHTML, {
            status: 'draft'
        });
    }
}

// Teste se executado diretamente
if (require.main === module) {
    const beehiiv = new BeehiivAutomation();
    
    console.log('🐝 Beehiiv Automation - 60maisNews');
    console.log('=====================================\n');
    
    // Testar conexão
    beehiiv.testConnection().then(ok => {
        if (ok) {
            console.log('\n✅ Sistema pronto para automação!');
            console.log('\nComandos disponíveis:');
            console.log('  - criarPost(titulo, html, options)');
            console.log('  - agendarPost(titulo, html, dataISO)');
            console.log('  - publicarImediato(titulo, html)');
            console.log('  - salvarRascunho(titulo, html)');
            console.log('  - listarPosts(limit)');
        }
    });
}

module.exports = BeehiivAutomation;
