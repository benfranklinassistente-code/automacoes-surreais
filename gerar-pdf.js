const { marked } = require('marked');
const fs = require('fs');
const path = require('path');

async function createPDF() {
  // Ler o markdown
  const mdPath = '/root/.openclaw/workspace/guia-agentes-autonomos.md';
  const pdfPath = '/root/.openclaw/workspace/guia-agentes-autonomos.pdf';
  
  const markdown = fs.readFileSync(mdPath, 'utf-8');
  
  // Converter para HTML com estilos
  const htmlContent = await marked(markdown);
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 40px auto;
      padding: 20px;
      color: #333;
      line-height: 1.6;
    }
    h1 { color: #2c3e50; border-bottom: 3px solid #3498db; padding-bottom: 10px; }
    h2 { color: #27ae60; border-bottom: 2px solid #27ae60; padding-bottom: 8px; margin-top: 30px; }
    h3 { color: #e74c3c; }
    table { border-collapse: collapse; width: 100%; margin: 15px 0; }
    th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
    th { background: #3498db; color: white; }
    tr:nth-child(even) { background: #f9f9f9; }
    code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; font-size: 14px; }
    pre { background: #f4f4f4; padding: 15px; border-radius: 8px; overflow-x: auto; }
    pre code { background: none; padding: 0; }
    blockquote { border-left: 4px solid #3498db; margin: 20px 0; padding-left: 20px; color: #666; }
    ul, ol { margin: 10px 0; }
    li { margin: 5px 0; }
    hr { border: none; border-top: 2px solid #eee; margin: 30px 0; }
    em { color: #666; font-size: 14px; }
  </style>
</head>
<body>
${htmlContent}
</body>
</html>
  `;
  
  // Salvar HTML temporário
  const htmlPath = '/tmp/guia-agentes.html';
  fs.writeFileSync(htmlPath, html);
  
  console.log('HTML criado:', htmlPath);
  
  // Usar Puppeteer para gerar PDF
  const puppeteer = require('puppeteer');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
  
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' },
    printBackground: true
  });
  
  await browser.close();
  
  console.log('✅ PDF criado:', pdfPath);
}

createPDF().catch(err => {
  console.error('Erro:', err.message);
  process.exit(1);
});
