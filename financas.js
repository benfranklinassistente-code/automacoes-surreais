const { google } = require('googleapis');

const SPREADSHEET_ID = '1VhY95rXzg9UjVnjr21nuOVpxhEuM3N8HN1TeeFrX7X8';
const SHEET_NAME = 'Página1';

async function getAuth() {
  return new google.auth.GoogleAuth({
    keyFile: '/root/.config/gcloud/service-account.json',
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

async function registrarTransacao(tipo, categoria, descricao, valor, formaPagamento = '', status = '', clienteFornecedor = '', observacoes = '') {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const hoje = new Date();
  const data = hoje.toLocaleDateString('pt-BR');
  const mesRef = hoje.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase();
  const ano = hoje.getFullYear().toString();
  const dataInclusao = data;
  
  // Formatar valor
  const valorFormatado = `R$ ${parseFloat(valor).toFixed(2).replace('.', ',')}`;
  
  const novaLinha = [
    data,                    // A - Data
    tipo.toUpperCase(),      // B - TIPO
    categoria,               // C - CATEGORIA
    descricao,               // D - DESCRICAO
    valorFormatado,          // E - VALOR (R$)
    formaPagamento,          // F - FORMA PAGAMENTO
    status,                  // G - STATUS
    clienteFornecedor,       // H - CLIENTE/FORNECEDOR
    mesRef,                  // I - MES REF
    ano,                     // J - ANO
    observacoes,             // K - OBSERVACOES
    '',                      // L - COMPROVANTE
    dataInclusao             // M - DATA INCLUSAO
  ];
  
  try {
    // Descobrir última linha
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:A`,
    });
    const ultimaLinha = (res.data.values || []).length + 1;
    
    // Adicionar nova linha
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A${ultimaLinha}`,
      valueInputOption: 'USER_ENTERED',
      resource: { values: [novaLinha] },
    });
    
    return { sucesso: true, linha: ultimaLinha, dados: novaLinha };
  } catch (err) {
    return { sucesso: false, erro: err.message };
  }
}

async function verUltimosRegistros(qtd = 5) {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:M`,
  });
  
  const rows = res.data.values || [];
  const ultimos = rows.slice(-qtd);
  
  return ultimos;
}

async function verResumo() {
  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });
  
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${SHEET_NAME}!A:M`,
  });
  
  const rows = res.data.values || [];
  let receitas = 0;
  let despesas = 0;
  
  rows.slice(1).forEach(row => {
    const valor = parseFloat((row[4] || '0').replace('R$ ', '').replace('.', '').replace(',', '.')) || 0;
    if ((row[1] || '').toUpperCase() === 'RECEITA') {
      receitas += valor;
    } else if ((row[1] || '').toUpperCase() === 'DESPESA') {
      despesas += valor;
    }
  });
  
  return {
    receitas: receitas.toFixed(2),
    despesas: despesas.toFixed(2),
    saldo: (receitas - despesas).toFixed(2),
    totalRegistros: rows.length - 1
  };
}

module.exports = { registrarTransacao, verUltimosRegistros, verResumo };
