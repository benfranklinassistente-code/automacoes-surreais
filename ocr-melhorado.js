/**
 * OCR Melhorado para Imagens
 * 
 * Usa múltiplas configurações do Tesseract para melhor resultado
 * 
 * Arquivo: ocr-melhorado.js
 * Criado: 21/02/2026
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Executa OCR com múltiplas configurações e retorna o melhor resultado
 */
function ocrMelhorado(caminhoImagem) {
  console.log('🔍 Processando:', caminhoImagem);
  
  const configs = [
    { lang: 'por', psm: 6, desc: 'Português PSM 6' },
    { lang: 'por', psm: 3, desc: 'Português PSM 3' },
    { lang: 'por', psm: 11, desc: 'Português PSM 11' },
    { lang: 'por+eng', psm: 6, desc: 'Port+Eng PSM 6' },
    { lang: 'eng', psm: 6, desc: 'English PSM 6' },
  ];
  
  let melhorResultado = '';
  let melhorTamanho = 0;
  
  for (const config of configs) {
    try {
      const cmd = `tesseract "${caminhoImagem}" stdout -l ${config.lang} --psm ${config.psm} 2>/dev/null`;
      const resultado = execSync(cmd, { encoding: 'utf8', timeout: 30000 }).trim();
      
      if (resultado.length > melhorTamanho) {
        melhorTamanho = resultado.length;
        melhorResultado = resultado;
        console.log(`✅ ${config.desc}: ${resultado.length} chars`);
      }
    } catch (e) {
      // Ignora erros e tenta próxima configuração
    }
  }
  
  return melhorResultado;
}

/**
 * OCR com pré-processamento de imagem (se ImageMagick disponível)
 */
function ocrComPreprocessamento(caminhoImagem) {
  const tempFile = '/tmp/ocr-temp.jpg';
  
  try {
    // Tentar melhorar a imagem com ImageMagick
    execSync(`convert "${caminhoImagem}" -resize 200% -enhance -contrast -sharpen 0x1 "${tempFile}"`, { timeout: 10000 });
    return ocrMelhorado(tempFile);
  } catch (e) {
    // Se ImageMagick não estiver disponível, usar imagem original
    return ocrMelhorado(caminhoImagem);
  }
}

/**
 * Processa múltiplas imagens
 */
function processarImagens(diretorio, padrao = '*.jpg') {
  const resultados = [];
  const arquivos = fs.readdirSync(diretorio)
    .filter(f => f.endsWith('.jpg') || f.endsWith('.png'))
    .map(f => path.join(diretorio, f));
  
  for (const arquivo of arquivos) {
    const texto = ocrComPreprocessamento(arquivo);
    resultados.push({ arquivo, texto });
  }
  
  return resultados;
}

// CLI
if (require.main === module) {
  const arquivo = process.argv[2];
  if (!arquivo) {
    console.log('Uso: node ocr-melhorado.js <arquivo.jpg>');
    process.exit(1);
  }
  
  const resultado = ocrComPreprocessamento(arquivo);
  console.log('\n📄 Resultado:\n');
  console.log(resultado);
}

module.exports = { ocrMelhorado, ocrComPreprocessamento };
