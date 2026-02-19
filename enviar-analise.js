const { enviarEmail } = require('./email.js');

const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset='utf-8'>
  <style>
    body { font-family: Arial, sans-serif; color: #333; }
    h1 { color: #2c3e50; }
    h2 { color: #27ae60; border-bottom: 2px solid #27ae60; padding-bottom: 10px; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #3498db; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    .online { color: green; font-weight: bold; }
  </style>
</head>
<body>
  <h1>📊 Análise Completa do Negócio 60+</h1>
  <p>Olá Luís! Aqui está o mapa completo do seu negócio baseado no Trello GTD e Ben Trello.</p>

  <h2>✅ O QUE VOCÊ TEM HOJE - Já Funcionando (Automações Ativas)</h2>
  <table>
    <tr><th>Automação</th><th>Status</th><th>Gera Renda?</th></tr>
    <tr><td>Assistente 24/7</td><td class='online'>✅ Online</td><td>Indireto (suporte)</td></tr>
    <tr><td>Lead Magnet Semanal</td><td class='online'>✅ Online</td><td>⚠️ Potencial</td></tr>
    <tr><td>Clonagem de Tarefas</td><td class='online'>✅ Online</td><td>Não</td></tr>
    <tr><td>Notícias OpenClaw</td><td class='online'>✅ Online</td><td>Não</td></tr>
  </table>

  <h2>🏗️ Estrutura de Produtos Identificada</h2>
  <ul>
    <li>✅ Cursos Pílula (18 cursos rápidos criados)</li>
    <li>✅ Workshops presenciais (R$ 47-97)</li>
    <li>✅ Aulas particulares (R$ 197/hora)</li>
    <li>✅ E-book "101 Dicas" - Criado</li>
    <li>✅ Calendário Comercial 2026 - Pronto</li>
    <li>✅ Newsletter (leads capturados)</li>
  </ul>

  <h2>🤖 Agentes no Trello (PRONTOS PARA ATIVAR)</h2>
  <p>📰 Conteúdo | 🔍 Oportunidades | 🎭 Orquestrador | 📚 Pesquisador | 📖 Storyteller | 🧑‍🏫 Instrutor | ✍️ Copywriter | 🚀 DevOps</p>

  <h2>💡 AUTOMAÇÕES PARA RENDA AUTOMÁTICA</h2>

  <h3>1️⃣ NEWSLETTER AUTOMATIZADA COM VENDAS</h3>
  <ul>
    <li><strong>Frequência:</strong> 2x/semana</li>
    <li><strong>Conteúdo:</strong> Dica rápida + Oferta de curso</li>
    <li><strong>Setup:</strong> Email → Hotmart/MercadoPago</li>
    <li><strong>Renda potencial:</strong> R$ 500-2000/mês</li>
  </ul>

  <h3>2️⃣ BOT WHATSAPP VENDAS 24/7</h3>
  <ul>
    <li><strong>Trigger:</strong> Novo lead entra</li>
    <li><strong>Resposta:</strong> Saudação + Oferta curso + Link pagamento</li>
    <li><strong>Follow-up:</strong> 3 dias depois (lembrete)</li>
  </ul>

  <h3>3️⃣ AGENDA INTELIGENTE DE AULAS</h3>
  <ul>
    <li><strong>Sistema:</strong> Aluno marca aula online</li>
    <li><strong>Pagamento:</strong> Automático no ato</li>
    <li><strong>Lembrete:</strong> Email/WhatsApp dia anterior</li>
    <li><strong>Renda:</strong> R$ 197 por aula marcada automaticamente</li>
  </ul>

  <h3>4️⃣ GERADOR DE CONTEÚDO REDES SOCIAIS</h3>
  <ul>
    <li><strong>Agente:</strong> ✍️ Copywriter + 📖 Storyteller</li>
    <li><strong>Output:</strong> 3 posts/semana (Instagram, Facebook, YouTube)</li>
    <li><strong>Agendamento:</strong> Automático</li>
  </ul>

  <h3>5️⃣ FUNIL DE VENDAS LEAD MAGNET → CURSO</h3>
  <ol>
    <li>Passo 1: Baixa e-book gratuito</li>
    <li>Passo 2: Email com dica (dia 1)</li>
    <li>Passo 3: Oferta curso básico (dia 3)</li>
    <li>Passo 4: Desconto relâmpago (dia 7)</li>
  </ol>
  <p><strong>Conversão média:</strong> 2-5% dos leads</p>

  <h2>🚀 PRÓXIMOS PASSOS SUGERIDOS</h2>
  
  <p><strong>📢 PRIORIDADE 1 - Ativar Agente de Conteúdo:</strong></p>
  <ul>
    <li>Posts automáticos nas redes sociais</li>
    <li>Conteúdo para newsletter</li>
  </ul>

  <p><strong>📢 PRIORIDADE 2 - Configurar pagamentos automáticos:</strong></p>
  <ul>
    <li>Hotmart ou MercadoPago</li>
    <li>Links de checkout nos emails</li>
  </ul>

  <p><strong>📢 PRIORIDADE 3 - Bot WhatsApp de vendas:</strong></p>
  <ul>
    <li>Respostas automáticas</li>
    <li>Agendamento de aulas</li>
  </ul>

  <hr>
  <p><strong>🤖 Quer que eu comece a implementar alguma dessas automações?</strong></p>
  <p>Posso ativar o Agente Copywriter para criar posts automáticos hoje mesmo!</p>
  
  <p><em>Enviado por Ben - Assistente 60+</em></p>
</body>
</html>
`;

enviarEmail('luis7nico@gmail.com', '📊 Análise Completa do Negócio 60+', '', html)
  .then(() => console.log('✅ Email enviado com sucesso para luis7nico@gmail.com!'))
  .catch(err => console.error('❌ Erro:', err));
