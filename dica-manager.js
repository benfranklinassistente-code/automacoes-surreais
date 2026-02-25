/**
 * 📱 DICA PENDENTE PARA WHATSAPP
 * Este arquivo é lido pelo bot-whatsapp-v2.js
 * Se houver dica pendente (enviada: false), o bot envia
 */

const fs = require('fs');
const path = require('path');

const ARQUIVO_DICA = '/root/.openclaw/workspace/dica-pendente.json';

// Verificar se tem dica pendente
function temDicaPendente() {
  try {
    if (fs.existsSync(ARQUIVO_DICA)) {
      const dica = JSON.parse(fs.readFileSync(ARQUIVO_DICA, 'utf8'));
      return dica && !dica.enviada;
    }
  } catch (e) {}
  return false;
}

// Obter dica pendente
function obterDica() {
  try {
    if (fs.existsSync(ARQUIVO_DICA)) {
      return JSON.parse(fs.readFileSync(ARQUIVO_DICA, 'utf8'));
    }
  } catch (e) {}
  return null;
}

// Marcar como enviada
function marcarEnviada() {
  try {
    if (fs.existsSync(ARQUIVO_DICA)) {
      const dica = JSON.parse(fs.readFileSync(ARQUIVO_DICA, 'utf8'));
      dica.enviada = true;
      dica.enviadaEm = new Date().toISOString();
      fs.writeFileSync(ARQUIVO_DICA, JSON.stringify(dica, null, 2));
    }
  } catch (e) {}
}

module.exports = {
  temDicaPendente,
  obterDica,
  marcarEnviada,
  ARQUIVO_DICA
};
