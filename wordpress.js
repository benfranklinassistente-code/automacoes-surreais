/**
 * WordPress REST API - Blog 60maisPlay
 * Módulo para publicar posts automaticamente
 */

const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, 'wordpress-config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

const WP_URL = config.apiUrl;
const WP_USER = config.username;
const WP_PASS = config.password;

// Auth Basic (Base64)
const auth = 'Basic ' + Buffer.from(`${WP_USER}:${WP_PASS}`).toString('base64');

/**
 * Criar post no WordPress
 */
async function criarPost({ title, content, status = 'draft', categories = [], tags = [] }) {
  const response = await fetch(`${WP_URL}/posts`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': auth
    },
    body: JSON.stringify({
      title: title,
      content: content,
      status: status,
      categories: categories,
      tags: tags
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao criar post');
  }
  
  return data;
}

/**
 * Listar posts
 */
async function listarPosts(page = 1, perPage = 10) {
  const response = await fetch(`${WP_URL}/posts?page=${page}&per_page=${perPage}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'authorization': auth
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao listar posts');
  }
  
  return data;
}

/**
 * Obter categorias
 */
async function listarCategorias() {
  const response = await fetch(`${WP_URL}/categories`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'authorization': auth
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao listar categorias');
  }
  
  return data;
}

/**
 * Obter tags
 */
async function listarTags() {
  const response = await fetch(`${WP_URL}/tags`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      'authorization': auth
    }
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'Erro ao listar tags');
  }
  
  return data;
}

/**
 * Publicar newsletter como post
 */
async function publicarNewsletter({ title, content }) {
  return await criarPost({
    title: title,
    content: content,
    status: 'publish'
  });
}

module.exports = {
  criarPost,
  listarPosts,
  listarCategorias,
  listarTags,
  publicarNewsletter
};
