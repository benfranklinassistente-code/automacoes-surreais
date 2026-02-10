const BeehiivAutomation = require('../src/beehiiv');

const beehiiv = new BeehiivAutomation();

async function publicarNewsletter() {
    console.log('🚀 Publicando newsletter na Beehiiv...\n');
    
    // Template de newsletter exemplo
    const titulo = "📱 Dica de Segurança: Proteja seu WhatsApp";
    
    const conteudoHTML = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>60maisNews</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <header style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #667eea;">60maisNews</h1>
            <p>Tecnologia simples para idosos 60+</p>
        </header>

        <article>
            <h2>📱 Dica do Dia: Verificação em Duas Etapas</h2>
            
            <p>Olá, leitor! 👋</p>
            
            <p>Hoje vamos falar sobre uma configuração super importante no WhatsApp que pode salvar sua conta de golpistas! 🛡️</p>

            <h3>O que é a Verificação em Duas Etapas?</h3>
            
            <p>É como uma senha extra que só você sabe. Mesmo que alguém consiga seu código SMS, não conseguirá acessar sua conta sem esse PIN especial.</p>

            <h3>Como ativar (passo a passo):</h3>
            
            <ol>
                <li>Abra o WhatsApp</li>
                <li>Toque nos <strong>3 pontinhos</strong> (canto superior direito)</li>
                <li>Vá em <strong>Configurações</strong></li>
                <li>Toque em <strong>Conta</strong></li>
                <li>Selecione <strong>Verificação em duas etapas</strong></li>
                <li>Toque em <strong>Ativar</strong></li>
                <li>Crie um PIN de 6 dígitos (guarde em lugar seguro!)</li>
                <li>Adicione um email de recuperação</li>
            </ol>

            <div style="background: #f0f7ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <p style="margin: 0;"><strong>💡 Dica do Vovô:</strong> Escreva seu PIN em um papel e guarde na gaveta. Não anote no celular! 😉</p>
            </div>

            <h3>🎁 Bônus: Guia Gratuito!</h3>
            
            <p>Baixe nosso <strong>"Guia de Emergência: Conta Hackeada"</strong> completo com 5 passos para recuperar seu WhatsApp:</p>

            <p style="text-align: center;">
                <a href="https://web-production-df2db.up.railway.app/lead-magnet/guia-conta-hackeada.html" 
                   style="display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    📥 BAIXAR GUIA GRÁTIS
                </a>
            </p>

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">

            <p>Até a próxima! 👋</p>
            
            <p><strong>Equipe 60maisPlay</strong><br>
            <em>Tecnologia para todos</em></p>
        </article>

        <footer style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
            <p>Você recebeu este email porque se inscreveu na 60maisNews.</p>
            <p>📱 WhatsApp: (11) 95354-5939 | 📧 benjamin@60maiscursos.com.br</p>
        </footer>
    </div>
</body>
</html>
    `;

    // Publicar como rascunho (para revisar antes)
    console.log('📝 Criando rascunho...');
    const resultado = await beehiiv.salvarRascunho(titulo, conteudoHTML);
    
    if (resultado) {
        console.log('\n✅ Newsletter criada com sucesso!');
        console.log(`📧 ID: ${resultado.id}`);
        console.log(`📊 Status: ${resultado.status}`);
        console.log(`🔗 Acesse: https://beehiiv.com/60maisnews/posts`);
    } else {
        console.log('\n❌ Erro ao criar newsletter');
    }
}

publicarNewsletter();
