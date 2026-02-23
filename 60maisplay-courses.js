const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://60maiscursos.com.br';

async function explorarCursosAdmin() {
  console.log('🚀 Explorando área de cursos...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu']
  });
  
  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
  
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
    
    // ========== PÁGINA DE CURSOS ==========
    console.log('📚 Acessando /admin/courses...');
    await page.goto(`${BASE_URL}/admin/courses`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 3000));
    
    const urlCursos = page.url();
    console.log(`📍 URL: ${urlCursos}`);
    
    await page.screenshot({ path: '/tmp/admin-courses.png', fullPage: true });
    
    // Extrair informações de cursos
    const cursosData = await page.evaluate(() => {
      const cursos = [];
      
      // Procurar lista de cursos
      document.querySelectorAll('tr, .curso-item, .course-row, [class*="curso"], [class*="course"]').forEach(el => {
        const titulo = el.querySelector('h3, h4, .titulo, .title, td:first-child')?.innerText?.trim();
        const status = el.querySelector('.status, .badge, [class*="status"]')?.innerText?.trim();
        const alunos = el.innerText?.match(/(\d+)\s*alunos?/i)?.[1];
        const link = el.querySelector('a')?.href;
        
        if (titulo && titulo.length > 2 && titulo.length < 100) {
          cursos.push({ titulo, status, alunos, link });
        }
      });
      
      // Se não encontrou na lista, pegar qualquer tabela
      if (cursos.length === 0) {
        document.querySelectorAll('table tr').forEach((row, i) => {
          if (i > 0) { // Pular cabeçalho
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
              cursos.push({
                titulo: cells[0]?.innerText?.trim(),
                info: Array.from(cells).map(c => c.innerText?.trim()).join(' | ')
              });
            }
          }
        });
      }
      
      return {
        titulo: document.title,
        cursos,
        bodyText: document.body.innerText.substring(0, 2000)
      };
    });
    
    console.log('\n📄 Título:', cursosData.titulo);
    console.log('\n📚 Cursos encontrados:');
    
    const cursosUnicos = cursosData.cursos.filter((c, i, arr) => 
      arr.findIndex(x => x.titulo === c.titulo) === i
    );
    
    cursosUnicos.forEach((c, i) => {
      console.log(`   ${i+1}. ${c.titulo}${c.alunos ? ` (${c.alunos} alunos)` : ''}`);
    });
    
    if (cursosUnicos.length === 0) {
      console.log('\n📝 Conteúdo da página:');
      console.log(cursosData.bodyText);
    }
    
    // ========== PÁGINA DE CONFIGURAÇÕES ==========
    console.log('\n\n⚙️ Acessando /admin/settings...');
    await page.goto(`${BASE_URL}/admin/settings`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    
    await page.screenshot({ path: '/tmp/admin-settings.png' });
    
    const settingsData = await page.evaluate(() => ({
      titulo: document.title,
      bodyText: document.body.innerText.substring(0, 1500)
    }));
    
    console.log('📄 Título:', settingsData.titulo);
    console.log('\n📝 Conteúdo:');
    console.log('─'.repeat(50));
    console.log(settingsData.bodyText);
    console.log('─'.repeat(50));
    
    // Salvar tudo
    const resultado = {
      cursos: cursosUnicos,
      settings: settingsData
    };
    
    fs.writeFileSync('/tmp/60maisplay-admin.json', JSON.stringify(resultado, null, 2));
    console.log('\n💾 Dados salvos em /tmp/60maisplay-admin.json');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

explorarCursosAdmin();
