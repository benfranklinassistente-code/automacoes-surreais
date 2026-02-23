const puppeteer = require('puppeteer');

async function acessarPlataforma() {
  console.log('🚀 Iniciando navegador...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
  
  const page = await browser.newPage();
  
  // Configurar user agent
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  
  try {
    // 1. Ir para página de login
    console.log('📱 Acessando página de login...');
    await page.goto('https://60maiscursos.com.br/login', { waitUntil: 'networkidle2' });
    
    // Screenshot da página
    await page.screenshot({ path: '/tmp/login-page.png' });
    console.log('✓ Página de login carregada');
    
    // 2. Preencher login
    console.log('\n🔐 Fazendo login...');
    
    await page.type('input[name="email"], input[type="email"]', 'luis7nico@gmail.com', { delay: 50 });
    await page.type('input[name="password"], input[type="password"]', '123456', { delay: 50 });
    
    // Screenshot antes de clicar
    await page.screenshot({ path: '/tmp/login-filled.png' });
    console.log('✓ Credenciais preenchidas');
    
    // 3. Clicar no botão de login
    const botaoLogin = await page.$('button[type="submit"]') || 
                       await page.$('input[type="submit"]') ||
                       await page.$('button');
    
    if (botaoLogin) {
      await Promise.all([
        botaoLogin.click(),
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {})
      ]);
    }
    
    await new Promise(r => setTimeout(r, 2000));
    
    // Screenshot após login
    await page.screenshot({ path: '/tmp/after-login.png' });
    
    // 4. Verificar URL atual
    const url = page.url();
    console.log(`\n📍 URL atual: ${url}`);
    
    // 5. Extrair informações
    if (url.includes('dashboard') || url.includes('home') || url.includes('cursos')) {
      console.log('✅ Login realizado com sucesso!\n');
      
      // Extrair conteúdo da página
      const content = await page.evaluate(() => {
        return {
          title: document.title,
          text: document.body.innerText.substring(0, 2000)
        };
      });
      
      console.log('📄 Conteúdo da página:');
      console.log('─'.repeat(50));
      console.log(content.text);
      console.log('─'.repeat(50));
      
      // Listar cursos se houver
      const cursos = await page.evaluate(() => {
        const items = document.querySelectorAll('a[href*="curso"], .curso-item, .course-card');
        return Array.from(items).slice(0, 10).map(item => ({
          text: item.innerText,
          href: item.href
        }));
      });
      
      if (cursos.length > 0) {
        console.log('\n📚 Cursos encontrados:');
        cursos.forEach((c, i) => console.log(`  ${i+1}. ${c.text.substring(0, 50)}`));
      }
      
    } else {
      console.log('❌ Login pode ter falhado. URL não mudou.');
      
      // Verificar mensagens de erro
      const erro = await page.evaluate(() => {
        const el = document.querySelector('.alert-danger, .error, .alert');
        return el ? el.innerText : null;
      });
      
      if (erro) {
        console.log(`⚠️ Erro: ${erro}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

acessarPlataforma();
