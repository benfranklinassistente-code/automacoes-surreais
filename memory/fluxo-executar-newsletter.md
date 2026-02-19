# 🤖 FLUXO EXECUTAR NEWSLETTER 60maisNews

Este documento descreve o fluxo para executar a newsletter usando as ferramentas nativas do OpenClaw.

## COMO EXECUTAR

Basta pedir: "Execute a newsletter 60maisNews em modo teste"

## FLUXO

### PASSO 1: Descobrir Tema (web_search)
Usar `web_search` para buscar tendências no Brasil:
- Query: "tendências google brasil hoje tecnologia idosos"
- Query: "golpe pix whatsapp segurança celular notícias 2026"

Analisar resultados e escolher o tema mais relevante.

### PASSO 2: Pesquisar sobre o Tema (web_search)
- Query: "{tema} dicas tutorial idosos como fazer"
- Capturar informações relevantes

### PASSO 3: Gerar Conteúdo (sessions_spawn)
Usar `sessions_spawn` com o prompt:

```
Você é o Professor Luis do canal 60maisPlay, especialista em ensinar tecnologia para pessoas de 60+ anos.

Tema: {tema}
Título: {titulo}
Pesquisa: {dados da pesquisa}

Crie uma NEWSLETTER COMPLETA com:

1. REFLEXÃO DO DIA (frase inspiradora)

2. STORY (história emocional de 150-200 palavras sobre alguém 60+ lidando com o problema)

3. LESSON (lição de 30-50 palavras)

4. TUTORIAL COMPLETO com 5 passos:
   - Cada passo: título, explicação, ação concreta, exemplo
   - Checklist final

5. O QUE MAIS APRENDER (bridge para produto)

6. DICA DE SEGURANÇA

Retorne JSON válido.
```

### PASSO 4: Criar CTA
Baseado no tema, criar CTA para o produto correto:
- golpe PIX → Mini Segurança Digital
- videochamada → Mini Videochamadas
- WhatsApp → Mini WhatsApp
- fotos → Mini Google Fotos
- aplicativos → Mini Apps Essenciais

### PASSO 5: Montar HTML
Usar template com logo: https://60maiscursos.com.br/blog/wp-content/uploads/2026/02/60maisnews-logo.png

### PASSO 6: Enviar Email (message ou Brevo API)
- Modo teste: luis7nico@gmail.com
- Modo real: lista Brevo ID 4

### PASSO 7: Publicar no Blog (WordPress API)
POST para https://60maiscursos.com.br/blog/wp-json/wp/v2/posts

### PASSO 8: Relatório
Retornar resumo do que foi feito.

---

## CREDENCIAIS

Ver arquivo: `/root/.openclaw/workspace/credenciais-60mais.json`

---

*Atualizado: 17/02/2026*
