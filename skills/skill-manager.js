#!/usr/bin/env node
/**
 * Problem Solver - Skill Manager
 * Busca skills existentes ou cria novas para resolver problemas
 * 
 * Uso: node skill-manager.js <problema> [--create]
 */

const fs = require('fs');
const path = require('path');

const SKILLS_DIR = '/root/.openclaw/workspace/skills';
const MEMORY_DIR = '/root/.openclaw/workspace/memory';

function listSkills() {
  const files = fs.readdirSync(SKILLS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.js'));
  return files.map(f => ({
    name: f,
    path: path.join(SKILLS_DIR, f),
    type: f.endsWith('.js') ? 'script' : 'doc'
  }));
}

function searchSkills(keyword) {
  const skills = listSkills();
  const results = [];
  
  for (const skill of skills) {
    try {
      const content = fs.readFileSync(skill.path, 'utf-8').toLowerCase();
      if (content.includes(keyword.toLowerCase())) {
        results.push(skill);
      }
    } catch (e) {}
  }
  
  return results;
}

function createSkill(name, description, code = '') {
  const skillPath = path.join(SKILLS_DIR, `${name}.md`);
  
  const template = `# ${name}

## Descrição
${description}

## Criado em
${new Date().toLocaleDateString('pt-BR')}

---

${code}
`;
  
  fs.writeFileSync(skillPath, template);
  return skillPath;
}

function updateMemory(content) {
  const today = new Date().toISOString().split('T')[0];
  const memoryPath = path.join(MEMORY_DIR, `${today}.md`);
  
  let existing = '';
  try {
    existing = fs.readFileSync(memoryPath, 'utf-8');
  } catch (e) {}
  
  if (!existing.includes(content.substring(0, 50))) {
    fs.appendFileSync(memoryPath, '\n\n' + content);
  }
  
  return memoryPath;
}

// CLI
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('\n📚 Skills Disponíveis:\n');
  const skills = listSkills();
  skills.forEach(s => console.log(`  • ${s.name} (${s.type})`));
  console.log('\nUso: node skill-manager.js <busca> [--create "descrição"]');
  process.exit(0);
}

const keyword = args[0];
const createMode = args.includes('--create');

if (createMode) {
  const descIdx = args.indexOf('--create') + 1;
  const description = args[descIdx] || 'Nova skill';
  const skillName = keyword.replace(/\s+/g, '-').toLowerCase();
  
  const skillPath = createSkill(skillName, description);
  console.log(`✅ Skill criada: ${skillPath}`);
  
  updateMemory(`## 🆕 Nova Skill: ${skillName}\n\n${description}`);
} else {
  console.log(`\n🔍 Buscando: "${keyword}"\n`);
  const results = searchSkills(keyword);
  
  if (results.length === 0) {
    console.log('❌ Nenhuma skill encontrada.');
    console.log('\n💡 Para criar: node skill-manager.js "${keyword}" --create "descrição"');
  } else {
    console.log('✅ Skills encontradas:\n');
    results.forEach(r => console.log(`  • ${r.name} (${r.type})`));
  }
}
