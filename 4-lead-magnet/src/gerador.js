const fs = require('fs');
const path = require('path');

class GeradorLeadMagnet {
    constructor() {
        this.outputDir = path.join(__dirname, '../output');
    }

    // Gerar ebook completo
    async gerarEbook(dados) {
        console.log('📚 Gerando ebook...');
        
        const { titulo, subtitulo, paginas, tema } = dados;
        
        // Template de ebook
        const conteudo = this.criarConteudoEbook(titulo, subtitulo, tema);
        
        // Salvar como Markdown (pode converter para PDF depois)
        const filename = `${this.slugify(titulo)}.md`;
        const filepath = path.join(this.outputDir, filename);
        
        fs.writeFileSync(filepath, conteudo);
        
        console.log(`✅ Ebook gerado: ${filename}`);
        
        return {
            tipo: 'ebook',
            titulo,
            arquivo: filename,
            caminho: filepath,
            paginas: this.contarPaginas(conteudo),
            tamanho: fs.statSync(filepath).size
        };
    }

    // Gerar checklist
    async gerarChecklist(dados) {
        console.log('✅ Gerando checklist...');
        
        const { titulo, subtitulo, items } = dados;
        
        const conteudo = this.criarConteudoChecklist(titulo, subtitulo, items);
        
        const filename = `${this.slugify(titulo)}-checklist.md`;
        const filepath = path.join(this.outputDir, filename);
        
        fs.writeFileSync(filepath, conteudo);
        
        console.log(`✅ Checklist gerado: ${filename}`);
        
        return {
            tipo: 'checklist',
            titulo,
            arquivo: filename,
            caminho: filepath,
            items: items.length
        };
    }

    // Criar conteúdo do ebook
    criarConteudoEbook(titulo, subtitulo, tema) {
        const data = new Date().toLocaleDateString('pt-BR');
        
        return `# ${titulo}
## ${subtitulo}

**Guia prático para idosos 60+**  
*Por 60maisPlay - ${data}*

---

## 📋 Sumário

1. [Introdução](#introdução)
2. [O Problema](#o-problema)
3. [Solução Passo a Passo](#solução-passo-a-passo)
4. [Checklist de Prevenção](#checklist-de-prevenção)
5. [Recursos Adicionais](#recursos-adicionais)

---

## Introdução

Olá! Se você está lendo este guia, provavelmente já passou por ${tema} ou conhece alguém que passou.

A boa notícia é que **existe solução** e ela é mais simples do que parece.

Neste guia prático, você vai aprender:
- ✅ Como identificar o problema rapidamente
- ✅ Os 5 passos para resolver
- ✅ Como prevenir que aconteça de novo

**Tempo estimado de leitura:** 10 minutos  
**Tempo para aplicar:** 15 minutos

---

## O Problema

${this.gerarDescricaoProblema(tema)}

### Sinais de Alerta

Fique atento a estes sinais:

- [ ] Sinal 1: Descrição do alerta
- [ ] Sinal 2: Descrição do alerta
- [ ] Sinal 3: Descrição do alerta

---

## Solução Passo a Passo

### Passo 1: [Título do Passo]

**O que fazer:**
Descrição detalhada do passo com instruções claras.

**Dica do Vovô:**
💡 "Insira aqui uma dica prática e simples"

---

### Passo 2: [Título do Passo]

**O que fazer:**
Descrição detalhada do passo.

**Print de Tela:**
*(Em versão final, incluir imagens ilustrativas)*

---

### Passo 3: [Título do Passo]

**O que fazer:**
Descrição detalhada do passo.

---

### Passo 4: [Título do Passo]

**O que fazer:**
Descrição detalhada do passo.

---

### Passo 5: [Título do Passo]

**O que fazer:**
Descrição detalhada do passo.

**Verificação:**
✅ Item verificado  
✅ Outro item verificado

---

## Checklist de Prevenção

Imprima esta página e deixe na geladeira:

### Antes de Qualquer Transação
- [ ] Verificação 1
- [ ] Verificação 2
- [ ] Verificação 3

### Configurações de Segurança
- [ ] Config 1
- [ ] Config 2
- [ ] Config 3

---

## Recursos Adicionais

### 🎥 Vídeo Tutorial
Assista o passo a passo em vídeo: [LINK]

### 📞 Suporte
Dúvidas? Fale conosco:
- WhatsApp: (11) 95354-5939
- Email: benjamin@60maiscursos.com.br

### 🎓 Curso Completo
Quer dominar o assunto? Conheça nosso curso completo:
**[NOME DO CURSO]** - R$ 47,00

---

## Sobre o 60maisPlay

Somos a plataforma de tecnologia para idosos 60+. Nossa missão é tornar a tecnologia acessível, segura e descomplicada para você.

**Já ajudamos mais de 500 idosos** a usarem tecnologia com confiança.

---

*© 2026 60maisPlay. Todos os direitos reservados.*

*Este material é gratuito. Sinta-se à vontade para compartilhar com amigos e familiares.*
`;
    }

    // Criar conteúdo do checklist
    criarConteudoChecklist(titulo, subtitulo, items) {
        const data = new Date().toLocaleDateString('pt-BR');
        
        let itemsTexto = items.map((item, index) => 
            `${index + 1}. [ ] ${item}`
        ).join('\n');
        
        return `# ${titulo}
## ${subtitulo}

**Imprima e deixe na geladeira!** 🧲  
*60maisPlay - ${data}*

---

## ✅ CHECKLIST

${itemsTexto}

---

## 🚨 EM CASO DE DÚVIDA

**NÃO PROSSIGA** antes de confirmar:

1. Ligue para a pessoa em número salvo
2. Pergunte se realmente solicitou
3. Desconfie de urgência excessiva

**Telefone de Emergência:**  
60maisPlay: (11) 95354-5939

---

## 💡 LEMBRE-SE

> "Segurança primeiro. Pressa é inimiga da certeza."

**Quando em dúvida, NÃO FAÇA.**

---

*© 2026 60maisPlay*  
*Cole na geladeira. Compartilhe com a família.*
`;
    }

    // Gerar descrição do problema baseada no tema
    gerarDescricaoProblema(tema) {
        const descricoes = {
            'conta hackeada': 'Ter a conta clonada ou hackeada é uma experiência estressante. Muitas pessoas sentem vergonha e não sabem por onde começar.',
            'golpe pix': 'Os golpes por PIX aumentaram 400% em 2025. Idosos são o principal alvo por serem menos familiarizados com tecnologia.',
            'segurança': 'O mundo digital pode ser assustador, mas com as proteções certas, você navega com tranquilidade.'
        };
        
        return descricoes[tema] || 'Este problema afeta milhares de idosos todos os dias. A boa notícia é que existe solução simples.';
    }

    // Utilitários
    slugify(texto) {
        return texto
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    }

    contarPaginas(conteudo) {
        // Estimativa: ~3000 caracteres por página
        return Math.ceil(conteudo.length / 3000);
    }
}

module.exports = GeradorLeadMagnet;
