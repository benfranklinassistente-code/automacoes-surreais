const puppeteer = require('puppeteer');
const fs = require('fs');

const BASE_URL = 'https://60maiscursos.com.br';

async function assistirAula() {
  console.log('🎬 Acessando aula sobre o cadeado...\n');
  
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
    
    // Acessar aula
    console.log('🎬 Acessando aula: Com cadeado, tudo certo!\n');
    await page.goto('https://60maiscursos.com.br/aulas/134', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 3000));
    
    // Screenshot
    await page.screenshot({ path: '/tmp/aula-cadeado.png', fullPage: true });
    
    // Extrair conteúdo da aula
    const aulaInfo = await page.evaluate(() => {
      const info = {
        titulo: document.title,
        texto: '',
        videoUrl: null,
        duracao: null,
        descricao: null
      };
      
      // Texto principal
      info.texto = document.body.innerText;
      
      // Procurar vídeo
      const video = document.querySelector('video, iframe');
      if (video) {
        info.videoUrl = video.src || video.querySelector('source')?.src;
      }
      
      // Procurar duração
      const duracaoEl = document.querySelector('[class*="duracao"], [class*="duration"], .time');
      if (duracaoEl) {
        info.duracao = duracaoEl.innerText;
      }
      
      // Descrição
      const descEl = document.querySelector('.descricao, .description, p');
      if (descEl) {
        info.descricao = descEl.innerText;
      }
      
      return info;
    });
    
    console.log('📄 Título:', aulaInfo.titulo);
    console.log('⏱️  Duração:', aulaInfo.duracao || '7 min');
    
    console.log('\n📝 CONTEÚDO DA AULA:');
    console.log('─'.repeat(50));
    console.log(aulaInfo.texto.substring(0, 3000));
    console.log('─'.repeat(50));
    
    // Salvar conteúdo completo
    fs.writeFileSync('/tmp/aula-conteudo.txt', aulaInfo.texto);
    console.log('\n💾 Conteúdo salvo em /tmp/aula-conteudo.txt');
    
    return aulaInfo;
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await browser.close();
  }
}

assistirAula();
