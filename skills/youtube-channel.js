#!/usr/bin/env node
/**
 * YouTube Channel Videos - Skill
 * Lista vídeos de um canal do YouTube usando yt-dlp
 * 
 * Uso: node youtube-channel.js <url_do_canal> [limite]
 */

const { execSync } = require('child_process');

const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('❌ Uso: node youtube-channel.js <url_do_canal> [limite]');
  console.log('   Exemplo: node youtube-channel.js https://youtube.com/@aiprogbr 10');
  process.exit(1);
}

const channelUrl = args[0].replace(/\/?$/, '/videos');
const limit = parseInt(args[1]) || 20;

try {
  const cmd = `yt-dlp --flat-playlist --print "%(title)s|||%(url)s|||%(duration_string)s|||%(view_count)s" "${channelUrl}" 2>/dev/null | head -${limit}`;
  const output = execSync(cmd, { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  
  const videos = output.trim().split('\n').map(line => {
    const [title, url, duration, views] = line.split('|||');
    return { title, url, duration, views: views || 'N/A' };
  });

  console.log(`\n## 📺 ${videos.length} Vídeos Encontrados:\n`);
  console.log('| # | Título | Duração | Link |');
  console.log('|---|--------|---------|------|');
  
  videos.forEach((v, i) => {
    const titleShort = v.title.length > 50 ? v.title.substring(0, 47) + '...' : v.title;
    console.log(`| ${i + 1} | ${titleShort} | ${v.duration || 'N/A'} | [▶️](${v.url}) |`);
  });

} catch (error) {
  console.log('❌ Erro ao listar vídeos:', error.message);
  process.exit(1);
}
