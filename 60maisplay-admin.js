const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://60maiscursos.com.br';

async function explorarAdmin() {
  console.log('🚀 Acessando área administrativa...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    // Login
    console.log('🔐 Fazendo login...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.type('input[name="email"], input[type="email"]', 'luis7nico@gmail.com', { delay: 30 });
    await page.type('input[name="password"], input[type="password"]', '123456', { delay: 30 });
    
    const botaoLogin = await page.$('button[type="submit"]') || await page.$('button');
    await Promise.all([botaoLogin.click(), page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})]);
    await new Promise(r => setTimeout(r, 2000));
    console.log('✅ Login OK\n');
    
    // Acessar área admin
    console.log('🔧 Acessando área admin...');
    await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    
    const url = page.url();
    console.log(`📍 URL: ${url}`);
    
    // Screenshot
    await page.screenshot({ path: '/tmp/admin-page.png', fullPage: true });
    
    // Extrair menu e opções
    const adminInfo = await page.evaluate(() => {
      const info = {
        titulo: document.title,
        menus: [],
        botoes: [],
        links: [],
        conteudo: document.body.innerText.substring(0, 3000)
      };
      
      // Menus
      document.querySelectorAll('nav a, .menu a, .sidebar a, .nav-link, [class*="menu"] a').forEach(el => {
        if (el.innerText && el.href) {
          info.menus.push({ texto: el.innerText.trim().substring(0, 50), href: el.href });
        }
      });
      
      // Botões
      document.querySelectorAll('button, .btn, [role="button"]').forEach(el => {
        if (el.innerText) {
          info.botoes.push(el.innerText.trim().substring(0, 30));
        }
      });
      
      // Links principais
      document.querySelectorAll('a[href*="admin"]').forEach(el => {
        if (el.innerText && el.href) {
          info.links.push({ texto: el.innerText.trim().substring(0, 50), href: el.href });
        }
      });
      
      return info;
    });
    
    console.log('\n📄 Título da página:', adminInfo.titulo);
    
    // Remover duplicatas dos menus
    const menusUnicos = [...new Set(adminInfo.menus.map(m => m.texto))].slice(0, 20);
    
    console.log('\n📋 Menu/Opções encontradas:');
    menusUnicos.forEach(m => console.log(`   • ${m}`));
    
    console.log('\n🔘 Botões encontrados:');
    [...new Set(adminInfo.botoes)].slice(0, 10).forEach(b => console.log(`   • ${b}`));
    
    console.log('\n📝 Conteúdo principal:');
    console.log('─'.repeat(50));
    console.log(adminInfo.conteudo.substring(0, 1000));
    console.log('─'.repeat(50));
    
    // Salvar dados
    fs.writeFileSync('/tmp/admin-info.json', JSON.stringify(adminInfo, null, 2));
    console.log('\n💾 Dados salvos em /tmp/admin-info.json');
    
    // Tentar acessar páginas comuns de admin
    console.log('\n🔍 Procurando páginas de administração...');
    
    const paginasComuns = [
      '/admin/users', '/admin/alunos', '/admin/cursos', '/admin/courses',
      '/admin/relatorios', '/admin/reports', '/admin/configuracoes',
      '/admin/settings', '/admin/aulas', '/admin/videos'
    ];
    
    const paginasEncontradas = [];
    
    for (const pagina of paginasComuns) {
      try {
        await page.goto(`${BASE_URL}${pagina}`, { waitUntil: 'networkidle2', timeout: 5000 });
        const conteudo = await page.evaluate(() => document.body.innerText);
        
        if (!conteudo.includes('404') && !conteudo.includes('Not Found') && !conteudo.includes('login')) {
          paginasEncontradas.push(pagina);
          console.log(`   ✅ ${pagina}`);
        }
      } catch (e) {}
    }
    
    if (paginasEncontradas.length === 0) {
      console.log('   ⚠️ Nenhuma página adicional encontrada');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

explorarAdmin();
