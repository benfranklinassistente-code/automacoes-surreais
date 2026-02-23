const puppeteer = require('puppeteer');

const BASE_URL = 'https://60maiscursos.com.br';

async function verAulasCurso() {
  console.log('🔍 Listando todas as aulas do curso...\n');
  
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
    
    // Acessar curso Compras na Internet
    console.log('📖 Acessando curso: Compras na Internet\n');
    await page.goto('https://60maiscursos.com.br/cursos/comprasnainternet', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));
    
    // Extrair todas as aulas
    const info = await page.evaluate(() => {
      const aulas = [];
      
      // Buscar por diferentes tipos de elementos de aula
      document.querySelectorAll('a, button, li, div').forEach(el => {
        const text = el.innerText?.trim();
        const href = el.href || el.querySelector('a')?.href;
        
        // Filtrar textos que parecem títulos de aula
        if (text && text.length > 3 && text.length < 150) {
          const linhas = text.split('\n').filter(l => l.trim().length > 0);
          linhas.forEach(linha => {
            const texto = linha.trim();
            if (texto.length > 3 && texto.length < 100 && 
                !texto.includes('60maisPlay') && 
                !texto.includes('Privacidade') && 
                !texto.includes('Termos') &&
                !texto.includes('Início')) {
              aulas.push({ titulo: texto, link: href });
            }
          });
        }
      });
      
      return {
        titulo: document.title,
        descricao: document.querySelector('p, .descricao, .description')?.innerText,
        aulas
      };
    });
    
    console.log('📄 Curso:', info.titulo);
    console.log('📝 Descrição:', info.descricao?.substring(0, 200) || 'Não encontrada');
    
    // Remover duplicatas e ordenar
    const aulasUnicas = [...new Set(info.aulas.map(a => a.titulo))]
      .map(titulo => info.aulas.find(a => a.titulo === titulo));
    
    console.log('\n📚 AULAS DO CURSO:\n');
    console.log('─'.repeat(50));
    
    aulasUnicas.forEach((a, i) => {
      console.log(`${String(i+1).padStart(2)}. ${a.titulo}`);
    });
    
    console.log('─'.repeat(50));
    console.log(`\n📊 Total: ${aulasUnicas.length} aulas`);
    
    // Procurar aula sobre cadeado
    const aulaCadeado = aulasUnicas.find(a => 
      a.titulo.toLowerCase().includes('cadeado') ||
      a.titulo.toLowerCase().includes('segurança') ||
      a.titulo.toLowerCase().includes('site seguro') ||
      a.titulo.toLowerCase().includes('https') ||
      a.titulo.toLowerCase().includes('certificado')
    );
    
    if (aulaCadeado) {
      console.log('\n🎯 AULA SOBRE CADEADO ENCONTRADA!');
      console.log(`   📌 Título: ${aulaCadeado.titulo}`);
      console.log(`   🔗 Link: ${aulaCadeado.link}`);
    } else {
      console.log('\n⚠️ Nenhuma aula específica sobre cadeado.');
      console.log('   As aulas acima podem conter o conteúdo!');
    }
    
    // Screenshot
    await page.screenshot({ path: '/tmp/curso-compras.png', fullPage: true });
    console.log('\n📸 Screenshot salvo: /tmp/curso-compras.png');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

verAulasCurso();
