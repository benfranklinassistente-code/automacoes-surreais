/**
 * ✍️ ESCRITOR - Recebe conteúdo do Ben e envia/publica
 * O conteúdo é passado como parâmetro JSON
 */

const brevo = require('./brevo.js');
const wordpress = require('./wordpress.js');
const trello = require('./trello.js');
const produtos = require('./produtos-60mais.js');
const template = require('./newsletter-template.js');
const historico = require('./historico-temas.js');
const fs = require('fs');

const MODO_TESTE = false; // ⚠️ PRODUÇÃO ATIVO - Envia para lista real

async function processarEEnviar() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✍️ ESCRITOR: Processando e enviando...');
  console.log('═══════════════════════════════════════════════════════════════\n');
  
  // Carregar tema
  const temaInfo = JSON.parse(fs.readFileSync('./tema-selecionado.json', 'utf8'));
  
  // 🚨 VERIFICAR SE TEMA JÁ FOI ENVIADO (evitar duplicidade)
  if (historico.temaRecente(temaInfo.tema)) {
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🚫 BLOQUEADO: Este tema JÁ foi enviado nos últimos 30 dias!');
    console.log(`   Tema: ${temaInfo.tema}`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    historico.statusHistorico();
    return { erro: 'Tema duplicado', tema: temaInfo.tema };
  }
  
  // Carregar conteúdo gerado pelo Ben
  let conteudo;
  try {
    conteudo = JSON.parse(fs.readFileSync('./conteudo-gerado.json', 'utf8'));
    console.log('✅ Conteúdo carregado do Ben');
    console.log(`   Tema: ${conteudo.tema}`);
    console.log(`   Score: ${conteudo.score}/10\n`);
  } catch (e) {
    console.log('❌ Erro: Arquivo conteudo-gerado.json não encontrado');
    console.log('   Peça ao Ben para gerar o conteúdo primeiro!\n');
    return;
  }
  
  // 1. CRIAR CTA
  console.log('💰 Criando CTA...');
  const ctaHTML = produtos.gerarCTAHTMLEmail(temaInfo.tema);
  console.log(`   ✅ CTA criado\n`);
  
  // 2. ENVIAR EMAIL VIA CAMPANHA BREVO
  console.log('📧 Criando campanha no Brevo...');
  const html = template.gerarHTMLEmailCompleto({
    titulo: conteudo.titulo,
    reflexao: conteudo.reflexao,
    story: conteudo.story,
    lesson: conteudo.lesson,
    tutorial: conteudo.tutorial,
    oQueMaisAprender: conteudo.oQueMaisAprender,
    seguranca: conteudo.seguranca,
    cta: ctaHTML
  });
  
  const sender = { name: '60maisNews - Professor Luis', email: 'benjamin@60maiscursos.com.br' };
  const nomeCampanha = temaInfo.tema; // Nome da campanha = tema da newsletter
  
  if (MODO_TESTE) {
    console.log('   🧪 MODO TESTE: luis7nico@gmail.com');
    const result = await brevo.enviarEmail({
      to: 'luis7nico@gmail.com',
      subject: `📰 60maisNews - ${conteudo.titulo.replace(/^[🚨📱📹🌟]+\s*/, '')}`,
      htmlContent: html,
      textContent: 'Newsletter 60maisNews',
      sender
    });
    console.log(`   ✅ Enviado! ID: ${result.messageId}\n`);
  } else {
    console.log(`   📬 MODO REAL: Lista ID 4`);
    console.log(`   📝 Campanha: "${nomeCampanha}"`);
    const result = await brevo.criarEEnviarCampanha({
      tema: nomeCampanha,
      subject: `📰 60maisNews - ${conteudo.titulo.replace(/^[🚨📱📹🌟]+\s*/, '')}`,
      htmlContent: html,
      textContent: 'Newsletter 60maisNews',
      listIds: [4],
      sender
    });
    console.log(`   ✅ Campanha "${nomeCampanha}" enviada! ID: ${result.campaignId}\n`);
    
    // 💾 Salvar ID da campanha para o relatório diário
    fs.writeFileSync('./ultima-campanha.json', JSON.stringify({
      campaignId: result.campaignId,
      tema: nomeCampanha,
      data: new Date().toISOString(),
      atualizado: new Date().toISOString()
    }, null, 2));
    console.log(`   💾 Campanha salva para relatório\n`);
  }
  
  // 3. PUBLICAR NO BLOG
  console.log('📝 Publicando no blog...');
  const htmlWP = template.gerarHTMLWordPressCompleto({
    titulo: conteudo.titulo,
    reflexao: conteudo.reflexao,
    story: conteudo.story,
    lesson: conteudo.lesson,
    tutorial: conteudo.tutorial,
    oQueMaisAprender: conteudo.oQueMaisAprender,
    seguranca: conteudo.seguranca,
    cta: produtos.gerarCTAWordPress(temaInfo.tema)
  });
  
  try {
    const result = await wordpress.publicarNewsletter({
      title: conteudo.titulo.replace(/^[🚨📱📹🌟🔒]+\s*/, ''),
      content: htmlWP
    });
    console.log(`   ✅ Publicado! ${result.link}\n`);
    
    // 4. CRIAR CARTÃO NO TRELLO
    console.log('📋 Criando cartão no Trello...');
    try {
      const hoje = new Date().toLocaleDateString('pt-BR');
      const descricao = `📰 ${conteudo.titulo}
📅 Publicado em: ${hoje}
📊 Score: ${conteudo.score}/10
🎯 Tema: ${temaInfo.tema}

--- RESUMO ---

${conteudo.reflexao}

${conteudo.story.substring(0, 200)}...

--- TUTORIAL ---

${conteudo.tutorial.passos.map(p => `${p.numero}. ${p.titulo}`).join('\n')}

--- CHECKLIST ---

${conteudo.tutorial.checklist}`;
      
      const trelloResult = await trello.criarCartaoNewsletter({
        titulo: `📰 ${conteudo.titulo.replace(/^[🚨📱📹🌟🔒]+\s*/, '')}`,
        conteudo: descricao
      });
      console.log(`   ✅ Cartão criado! ${trelloResult.url}\n`);
    } catch (e) {
      console.log(`   ⚠️ Erro no Trello: ${e.message}\n`);
    }
    
  } catch (e) {
    console.log(`   ❌ Erro no blog: ${e.message}\n`);
  }
  
  // 5. REGISTRAR TEMA NO HISTÓRICO
  console.log('📋 Registrando tema no histórico...');
  historico.registrarTema(temaInfo.tema);
  console.log(`   ✅ Tema "${temaInfo.tema}" registrado (não repetir por 30 dias)\n`);
  
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('✅ FLUXO CONCLUÍDO!');
  console.log('═══════════════════════════════════════════════════════════════\n');
}

processarEEnviar().catch(console.error);
