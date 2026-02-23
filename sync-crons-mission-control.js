/**
 * 🔄 Sincroniza CRONs do OpenClaw com Mission Control
 * 
 * Busca todos os jobs do CRON e envia para o Mission Control
 * Executar a cada hora para manter sincronizado
 */

const http = require('http');
const https = require('https');

// Configurações
const CONFIG = {
  gatewayToken: process.env.OPENCLAW_GATEWAY_TOKEN || 'pUfMKh_QxGckUpL3TpMNuGRiQRyIaaoBjcQwvh247FE',
  gatewayUrl: '127.0.0.1',
  gatewayPort: 18789,
  missionControlUrl: 'https://ceaseless-puma-611.convex.site'
};

// Buscar CRONs do OpenClaw
async function getCrons() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: CONFIG.gatewayUrl,
      port: CONFIG.gatewayPort,
      path: '/api/cron/list',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONFIG.gatewayToken}`,
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.jobs || []);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

// Enviar tarefa para Mission Control
async function syncTask(task) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      title: task.name || task.id,
      type: mapTaskType(task),
      scheduledAt: task.state?.nextRunAtMs || Date.now(),
      status: task.enabled ? 'pending' : 'cancelled',
      recurrence: getRecurrence(task.schedule),
      metadata: {
        jobId: task.id,
        enabled: task.enabled,
        sessionTarget: task.sessionTarget
      }
    });

    const options = {
      hostname: 'ceaseless-puma-611.convex.site',
      port: 443,
      path: '/api/task',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`✅ Sincronizado: ${task.name || task.id}`);
        resolve(data);
      });
    });

    req.on('error', (e) => {
      console.error(`❌ Erro ao sincronizar ${task.name}:`, e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

// Mapear tipo de tarefa
function mapTaskType(task) {
  const name = (task.name || '').toLowerCase();
  
  if (name.includes('newsletter') || name.includes('60mais')) return 'newsletter';
  if (name.includes('cron')) return 'cron';
  if (name.includes('reminder') || name.includes('lembrete')) return 'reminder';
  if (name.includes('dica')) return 'newsletter';
  
  return 'cron';
}

// Determinar recorrência
function getRecurrence(schedule) {
  if (!schedule) return null;
  
  if (schedule.kind === 'every') return 'daily';
  if (schedule.kind === 'cron') {
    // Simplificar - se tem hora específica, assume diário
    return 'daily';
  }
  
  return null;
}

// Função principal
async function main() {
  console.log('🔄 Sincronizando CRONs com Mission Control...\n');
  
  try {
    // Buscar CRONs
    const crons = await getCrons();
    console.log(`📋 Encontrados ${crons.length} jobs\n`);
    
    // Sincronizar cada um
    for (const cron of crons) {
      try {
        await syncTask(cron);
      } catch (e) {
        console.log(`⚠️  Pulando ${cron.name || cron.id}`);
      }
    }
    
    console.log('\n✅ Sincronização concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executar
main();
