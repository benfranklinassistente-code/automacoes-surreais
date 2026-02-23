/**
 * 60maisPlay - Cliente da Plataforma de Cursos
 * Acesso automatizado à plataforma
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://60maiscursos.com.br';

// Armazenar cookies de sessão
let cookies = '';

async function request(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/html, */*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    };

    if (cookies) {
      options.headers['Cookie'] = cookies;
    }

    if (data) {
      const postData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(postData);
    }

    const req = https.request(options, (res) => {
      let responseData = '';
      
      // Capturar cookies da resposta
      const setCookies = res.headers['set-cookie'];
      if (setCookies) {
        cookies = setCookies.map(c => c.split(';')[0]).join('; ');
      }
      
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          // Tentar parsear como JSON
          const json = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          // Retornar como texto
          resolve({ status: res.statusCode, data: responseData, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function login(email, password) {
  console.log('🔐 Fazendo login...');
  
  // Tentar diferentes endpoints de login
  const endpoints = [
    '/api/login',
    '/login',
    '/auth/login',
    '/api/auth/login'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await request(endpoint, 'POST', { email, password });
      
      if (response.status === 200 || response.status === 302) {
        console.log(`✅ Login via ${endpoint}`);
        return true;
      }
    } catch (e) {
      // Tentar próximo
    }
  }
  
  console.log('⚠️ Não foi possível fazer login via API');
  return false;
}

async function listarCursos() {
  console.log('\n📚 Listando cursos...\n');
  
  const endpoints = [
    '/api/cursos',
    '/api/courses',
    '/cursos',
    '/api/aluno/cursos'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await request(endpoint);
      
      if (response.status === 200 && response.data) {
        console.log(`✅ Encontrado em: ${endpoint}`);
        return response.data;
      }
    } catch (e) {
      // Tentar próximo
    }
  }
  
  return null;
}

async function getInfoConta() {
  console.log('\n👤 Verificando informações da conta...\n');
  
  const endpoints = [
    '/api/user',
    '/api/perfil',
    '/api/aluno/perfil',
    '/perfil'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await request(endpoint);
      
      if (response.status === 200) {
        console.log(`✅ Perfil encontrado em: ${endpoint}`);
        return response.data;
      }
    } catch (e) {
      // Tentar próximo
    }
  }
  
  return null;
}

async function main() {
  console.log('🚀 Iniciando acesso à 60maisPlay...\n');
  
  const email = process.env.EMAIL || 'luis7nico@gmail.com';
  const password = process.env.PASSWORD || '123456';
  
  // Fazer login
  await login(email, password);
  
  // Buscar informações
  const cursos = await listarCursos();
  const perfil = await getInfoConta();
  
  console.log('\n📊 Resultado:');
  console.log(JSON.stringify({ cursos, perfil }, null, 2));
}

module.exports = { login, listarCursos, getInfoConta, request };

if (require.main === module) {
  main();
}
