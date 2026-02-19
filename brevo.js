/**
 * Brevo API - Email Marketing e Transacional
 * Módulo para enviar emails, gerenciar contatos e campanhas
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'brevo-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const BREVO_API_KEY = config.apiKey;
const BREVO_API_URL = config.apiUrl;

/**
 * Enviar email transacional
 */
async function enviarEmail({ to, subject, htmlContent, textContent, sender }) {
  const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      sender: sender || { name: 'Ben - Assistente', email: 'benjamin@60maiscursos.com.br' },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent || ''
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao enviar email');
  }
  
  return data;
}

/**
 * Listar contatos
 */
async function listarContatos(limit = 50, offset = 0) {
  const response = await fetch(`${BREVO_API_URL}/contacts?limit=${limit}&offset=${offset}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao listar contatos');
  }
  
  return data;
}

/**
 * Criar contato
 */
async function criarContato({ email, attributes = {}, listIds = [] }) {
  const response = await fetch(`${BREVO_API_URL}/contacts`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      email: email,
      attributes: attributes,
      listIds: listIds,
      updateEnabled: true
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao criar contato');
  }
  
  return data;
}

/**
 * Obter estatísticas de emails
 */
async function estatisticasEmails() {
  const response = await fetch(`${BREVO_API_URL}/smtp/statistics/events?limit=100`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao obter estatísticas');
  }
  
  return data;
}

/**
 * Listar campanhas
 */
async function listarCampanhas() {
  const response = await fetch(`${BREVO_API_URL}/emailCampaigns`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao listar campanhas');
  }
  
  return data;
}

/**
 * Enviar email template
 */
async function enviarTemplate({ to, templateId, params = {} }) {
  const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      to: [{ email: to }],
      templateId: templateId,
      params: params
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao enviar template');
  }
  
  return data;
}

/**
 * Obter informações da conta
 */
async function infoConta() {
  const response = await fetch(`${BREVO_API_URL}/account`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao obter info da conta');
  }
  
  return data;
}

/**
 * Obter listas de contatos
 */
async function listarListas() {
  const response = await fetch(`${BREVO_API_URL}/contacts/lists`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao listar listas');
  }
  
  return data;
}

/**
 * Enviar email para lista completa (campanha)
 */
async function enviarParaLista({ 
  subject, 
  htmlContent, 
  textContent, 
  listIds,
  sender,
  testEmail = null 
}) {
  // Se for teste, envia apenas para o email de teste
  if (testEmail) {
    return await enviarEmail({
      to: testEmail,
      subject: subject,
      htmlContent: htmlContent,
      textContent: textContent,
      sender: sender
    });
  }
  
  // Enviar para lista completa via campanha
  const response = await fetch(`${BREVO_API_URL}/emailCampaigns`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      name: `60maisNews - ${new Date().toLocaleDateString('pt-BR')}`,
      subject: subject,
      sender: sender || { name: '60maisNews', email: 'benjamin@60maiscursos.com.br' },
      htmlContent: htmlContent,
      textContent: textContent || '',
      recipients: {
        listIds: listIds
      },
      scheduledAt: null // Enviar imediatamente
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    // Se falhar campanha, tentar enviar transacional para cada contato
    console.log('⚠️ Campanha falhou, enviando individualmente...');
    return await enviarTransacionalParaLista({ subject, htmlContent, textContent, listIds, sender });
  }
  
  return data;
}

/**
 * Enviar email transacional para todos da lista
 */
async function enviarTransacionalParaLista({ subject, htmlContent, textContent, listIds, sender }) {
  const contatos = await listarContatos(1000, 0);
  const emails = contatos.contacts?.map(c => c.email) || [];
  
  let enviados = 0;
  let erros = 0;
  
  for (const email of emails) {
    try {
      await enviarEmail({
        to: email,
        subject: subject,
        htmlContent: htmlContent,
        textContent: textContent,
        sender: sender
      });
      enviados++;
    } catch (e) {
      erros++;
    }
  }
  
  return {
    enviados,
    erros,
    total: emails.length
  };
}

/**
 * Criar campanha no Brevo (sem enviar)
 * Retorna o ID da campanha criada
 */
async function criarCampanha({ nome, subject, htmlContent, textContent, listIds, sender }) {
  const response = await fetch(`${BREVO_API_URL}/emailCampaigns`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY
    },
    body: JSON.stringify({
      name: nome,
      subject: subject,
      sender: sender || { name: '60maisNews', email: 'benjamin@60maiscursos.com.br' },
      htmlContent: htmlContent,
      textContent: textContent || '',
      recipients: {
        listIds: listIds
      }
      // Não agendar - será enviado manualmente via sendNow
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao criar campanha');
  }
  
  return data;
}

/**
 * Enviar campanha existente (após criada)
 */
async function enviarCampanha(campaignId) {
  const response = await fetch(`${BREVO_API_URL}/emailCampaigns/${campaignId}/sendNow`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao enviar campanha');
  }
  
  return data;
}

/**
 * Obter estatísticas de uma campanha
 */
async function estatisticasCampanha(campaignId) {
  const response = await fetch(`${BREVO_API_URL}/emailCampaigns/${campaignId}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'api-key': BREVO_API_KEY
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao obter estatísticas da campanha');
  }
  
  return data;
}

/**
 * Criar e enviar campanha em um passo
 * Nome da campanha = tema da newsletter
 */
async function criarEEnviarCampanha({ tema, subject, htmlContent, textContent, listIds, sender }) {
  // 1. Criar a campanha
  console.log(`   📝 Criando campanha: "${tema}"...`);
  const campanha = await criarCampanha({
    nome: tema,
    subject: subject,
    htmlContent: htmlContent,
    textContent: textContent,
    listIds: listIds,
    sender: sender
  });
  
  console.log(`   ✅ Campanha criada! ID: ${campanha.id}`);
  
  // 2. Enviar a campanha
  console.log(`   📧 Enviando campanha...`);
  await enviarCampanha(campanha.id);
  
  console.log(`   ✅ Campanha enviada!`);
  
  return {
    campaignId: campanha.id,
    nome: tema
  };
}

module.exports = {
  enviarEmail,
  listarContatos,
  criarContato,
  estatisticasEmails,
  listarCampanhas,
  enviarTemplate,
  infoConta,
  listarListas,
  enviarParaLista,
  enviarTransacionalParaLista,
  criarCampanha,
  enviarCampanha,
  estatisticasCampanha,
  criarEEnviarCampanha
};
