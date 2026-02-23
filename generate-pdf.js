const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const mdContent = fs.readFileSync('/root/.openclaw/workspace/youtube-summaries/ai-progbr-resumo.md', 'utf-8');
const outputPath = '/root/.openclaw/workspace/ai-progbr-resumo.pdf';

// Criar documento PDF
const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },
  info: {
    Title: 'AI ProgBr - Resumo dos Vídeos',
    Author: 'Benjamin - Assistente',
    Subject: 'Conceitos e Aplicações de IA'
  }
});

doc.pipe(fs.createWriteStream(outputPath));

// Fonte
doc.font('Helvetica');

// Título
doc.fontSize(24).fillColor('#4CAF50').text('📚 AI ProgBr - Resumo dos Vídeos', { align: 'center' });
doc.moveDown();
doc.fontSize(12).fillColor('#666').text('Conceitos e Aplicações Práticas de IA', { align: 'center' });
doc.moveDown();
doc.fontSize(10).text('Gerado em: ' + new Date().toLocaleDateString('pt-BR'), { align: 'center' });
doc.moveDown(2);

// Linha separadora
doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#4CAF50');
doc.moveDown();

// Processar markdown
const lines = mdContent.split('\n');
let inCode = false;
let inTable = false;

lines.forEach(line => {
  // Pular cabeçalho inicial
  if (line.startsWith('# 📚') || line.startsWith('## Conceitos')) return;
  if (line.startsWith('**Canal:**') || line.startsWith('**Gerado')) return;
  if (line === '---') {
    doc.moveDown();
    doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke('#ddd');
    doc.moveDown();
    return;
  }
  
  // Títulos
  if (line.startsWith('## ')) {
    doc.moveDown();
    doc.fontSize(14).fillColor('#4CAF50').text(line.replace('## ', '').trim());
    doc.moveDown(0.5);
    return;
  }
  
  if (line.startsWith('### ')) {
    doc.fontSize(11).fillColor('#333').text(line.replace('### ', '').trim());
    doc.moveDown(0.3);
    return;
  }
  
  // Código
  if (line.startsWith('```')) {
    inCode = !inCode;
    return;
  }
  
  if (inCode) {
    doc.fontSize(9).fillColor('#555').text(line, { indent: 20 });
    return;
  }
  
  // Tabelas
  if (line.startsWith('|')) {
    const cells = line.split('|').filter(c => c.trim());
    if (cells.length > 0) {
      doc.fontSize(9).fillColor('#333').text(cells.map(c => c.trim()).join(' | '));
    }
    return;
  }
  
  // Texto normal
  if (line.trim()) {
    const cleanLine = line
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\[(.*?)\]\(.*?\)/g, '$1');
    doc.fontSize(10).fillColor('#333').text(cleanLine);
  }
});

// Finalizar
doc.end();

console.log('✅ PDF gerado: ' + outputPath);
