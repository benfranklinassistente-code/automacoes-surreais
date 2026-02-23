const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://60maiscursos.com.br';

async function explorarPlataforma() {
  console.log('🚀 Iniciando navegador...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  const dados = {
    login: null,
    cursos: [],
    alunos: [],
    estatisticas: null,
    admin: null
  };
  
  try {
    // ========== LOGIN ==========
    console.log('🔐 Fazendo login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.type('input[name="email"], input[type="email"]', 'luis7nico@gmail.com', { delay: 30 });
    await page.type('input[name="password"], input[type="password"]', '123456', { delay: 30 });
    
    const botaoLogin = await page.$('button[type="submit"]') || await page.$('button');
    await Promise.all([botaoLogin.click(), page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})]);
    
    await new Promise(r => setTimeout(r, 2000));
    dados.login = { sucesso: page.url().includes('60maiscursos.com.br') && !page.url().includes('login') };
    console.log(dados.login.sucesso ? '✅ Login OK' : '❌ Login falhou');
    
    // ========== LISTAR CURSOS ==========
    console.log('\n📚 Listando cursos...');
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    
    dados.cursos = await page.evaluate(() => {
      const cursos = [];
      document.querySelectorAll('a[href*="curso"], .curso-item, .course-card, [class*="curso"]').forEach(el => {
        const href = el.href || el.querySelector('a')?.href;
        const text = el.innerText?.split('\n')[0]?.trim();
        if (href && text && text.length > 3 && text.length < 100) {
          cursos.push({ titulo: text, link: href });
        }
      });
      
      // Remover duplicatas
      const vistos = new Set();
      return cursos.filter(c => {
        if (vistos.has(c.titulo)) return false;
        vistos.add(c.titulo);
        return true;
      });
    });
    
    console.log(`✓ ${dados.cursos.length} cursos encontrados`);
    
    // ========== PROCURAR ÁREA ADMIN ==========
    console.log('\n🔧 Procurando área administrativa...');
    
    const adminUrls = ['/admin', '/dashboard', '/painel', '/admin/dashboard', '/manager'];
    for (const url of adminUrls) {
      try {
        await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle2', timeout: 10000 });
        const content = await page.evaluate(() => document.body.innerText);
        
        if (!content.includes('404') && !content.includes('Not Found') && !content.includes('login')) {
          dados.admin = { url: `${BASE_URL}${url}`, encontrado: true };
          console.log(`✅ Área admin encontrada: ${url}`);
          break;
        }
      } catch (e) {}
    }
    
    if (!dados.admin) {
      console.log('⚠️ Nenhuma área admin encontrada');
    }
    
    // ========== ESTATÍSTICAS ==========
    console.log('\n📊 Buscando estatísticas...');
    
    dados.estatisticas = await page.evaluate(() => {
      const stats = {};
      
      // Procurar números na página
      const text = document.body.innerText;
      const matches = text.match(/(\d+)\s*(alunos?|cursos?|aulas?|vídeos?)/gi);
      if (matches) {
        stats.numeros = matches;
      }
      
      // Procurar elementos de estatística
      document.querySelectorAll('[class*="stat"], [class*="counter"], [class*="numero"]').forEach(el => {
        const num = el.innerText.match(/\d+/);
        if (num) {
          stats[el.className] = num[0];
        }
      });
      
      return stats;
    });
    
    console.log('✓ Estatísticas coletadas');
    
    // ========== ACESSAR UM CURSO ==========
    if (dados.cursos.length > 0) {
      console.log('\n📖 Acessando primeiro curso para detalhes...');
      const primeiroCurso = dados.cursos[0];
      
      try {
        await page.goto(primeiroCurso.link, { waitUntil: 'networkidle2', timeout: 10000 });
        
        primeiroCurso.detalhes = await page.evaluate(() => {
          return {
            descricao: document.querySelector('p, .descricao, .description')?.innerText?.substring(0, 200),
            aulas: document.querySelectorAll('a[href*="aula"], .aula-item, .lesson').length,
            modulo: document.querySelector('h2, h3, .modulo')?.innerText
          };
        });
        
        console.log(`✓ Detalhes: ${primeiroCurso.detalhes.aulas || 0} aulas`);
      } catch (e) {
        console.log('⚠️ Não foi possível acessar detalhes');
      }
    }
    
    // ========== SALVAR RESULTADOS ==========
    console.log('\n💾 Salvando resultados...');
    fs.writeFileSync('/tmp/60maisplay-dados.json', JSON.stringify(dados, null, 2));
    console.log('✓ Dados salvos em /tmp/60maisplay-dados.json');
    
    // Screenshot final
    await page.screenshot({ path: '/tmp/60maisplay-home.png', fullPage: true });
    console.log('✓ Screenshot salvo em /tmp/60maisplay-home.png');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
  
  // ========== RESUMO ==========
  console.log('\n' + '='.repeat(50));
  console.log('📋 RESUMO DA PLATAFORMA 60maisPlay');
  console.log('='.repeat(50));
  console.log(`\n✅ Login: ${dados.login?.sucesso ? 'Sucesso' : 'Falhou'}`);
  console.log(`📚 Cursos encontrados: ${dados.cursos.length}`);
  console.log(`🔧 Área Admin: ${dados.admin?.encontrado ? 'Sim' : 'Não encontrada'}`);
  
  if (dados.cursos.length > 0) {
    console.log('\n📚 Lista de Cursos:');
    dados.cursos.forEach((c, i) => console.log(`   ${i+1}. ${c.titulo}`));
  }
  
  console.log('\n' + '='.repeat(50));
  
  return dados;
}

explorarPlataforma();
