const puppeteer = require('puppeteer');

const BASE_URL = 'https://60maiscursos.com.br';

async function buscarAulaCadeado() {
  console.log('🔍 Procurando aula sobre cadeado do navegador...\n');
  
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
    
    // Ir para página inicial
    await page.goto(BASE_URL, { waitUntil: 'networkidle2' });
    
    // Buscar todos os links de cursos/aulas
    console.log('📚 Buscando cursos e aulas...\n');
    
    const todosCursos = await page.evaluate(() => {
      const cursos = [];
      document.querySelectorAll('a').forEach(el => {
        const href = el.href;
        const text = el.innerText?.trim();
        if (href && text && text.length > 2 && text.length < 100) {
          cursos.push({ titulo: text, link: href });
        }
      });
      return cursos;
    });
    
    // Filtrar por palavras relacionadas a cadeado/segurança/navegador
    const palavrasChave = ['cadeado', 'segurança', 'navegador', 'site seguro', 'https', 'ssl', 'certificado', 'site', 'internet', 'compras'];
    
    const cursosRelevantes = todosCursos.filter(c => {
      const textoLower = c.titulo.toLowerCase();
      return palavrasChave.some(p => textoLower.includes(p));
    });
    
    console.log('📌 Cursos relevantes encontrados:');
    cursosRelevantes.forEach((c, i) => console.log(`   ${i+1}. ${c.titulo}`));
    
    // Acessar cada curso relevante e procurar aulas sobre cadeado
    console.log('\n🔍 Procurando aulas dentro dos cursos...\n');
    
    const aulasCadeado = [];
    
    for (const curso of cursosRelevantes.slice(0, 5)) {
      try {
        console.log(`📖 Acessando: ${curso.titulo}`);
        await page.goto(curso.link, { waitUntil: 'networkidle2', timeout: 10000 });
        await new Promise(r => setTimeout(r, 1500));
        
        // Buscar aulas dentro do curso
        const aulas = await page.evaluate(() => {
          const lista = [];
          document.querySelectorAll('a, button, .aula, .lesson, [class*="aula"], [class*="lesson"]').forEach(el => {
            const text = el.innerText?.trim();
            const href = el.href || el.closest('a')?.href;
            if (text && text.length > 2 && text.length < 200) {
              lista.push({ titulo: text, link: href });
            }
          });
          return lista;
        });
        
        // Filtrar aulas sobre cadeado
        const aulasSobreCadeado = aulas.filter(a => {
          const textoLower = a.titulo.toLowerCase();
          return textoLower.includes('cadeado') || 
                 textoLower.includes('segurança') ||
                 textoLower.includes('site seguro') ||
                 textoLower.includes('https');
        });
        
        if (aulasSobreCadeado.length > 0) {
          console.log(`   ✅ ${aulasSobreCadeado.length} aula(s) encontrada(s)`);
          aulasSobreCadeado.forEach(a => {
            aulasCadeado.push({
              curso: curso.titulo,
              aula: a.titulo,
              link: a.link
            });
          });
        }
        
      } catch (e) {
        console.log(`   ⚠️ Erro ao acessar`);
      }
    }
    
    // Resultado final
    console.log('\n' + '='.repeat(50));
    
    if (aulasCadeado.length > 0) {
      console.log('🎯 AULAS SOBRE CADEADO DO NAVEGADOR:\n');
      aulasCadeado.forEach((a, i) => {
        console.log(`${i+1}. 📚 Curso: ${a.curso}`);
        console.log(`   🎬 Aula: ${a.aula}`);
        console.log(`   🔗 Link: ${a.link}`);
        console.log('');
      });
    } else {
      console.log('⚠️ Nenhuma aula específica sobre cadeado encontrada.');
      console.log('\n💡 Cursos relacionados que podem ter o conteúdo:');
      cursosRelevantes.forEach((c, i) => {
        console.log(`   ${i+1}. ${c.titulo} - ${c.link}`);
      });
    }
    
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

buscarAulaCadeado();
