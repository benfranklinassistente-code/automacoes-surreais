# 🚀 Projeto: 60maisNews - Newsletter Autônoma

## 📋 Visão Geral

**Objetivo**: Criar um sistema de newsletter automatizado que funcione como "carta de vendas disfarçada" usando a técnica StorySelling.

**Público**: Idosos 60+ interessados em tecnologia
**Frequência**: Diária às 06:06
**Envio**: Brevo (API configurada - 102 contatos)

---

## 🏗️ Arquitetura do Sistema

```
┌─────────────────────────────────────────────────────────────────┐
│                    🎭 ORQUESTRADOR                               │
│         (Agente principal que coordena tudo)                    │
└───────────────────────────┬─────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌───────────────┐   ┌───────────────┐   ┌───────────────┐
│ 📅 GANCHOS    │   │ ✍️ CONTEÚDO   │   │ 💰 VENDAS     │
│               │   │               │   │               │
│ • Calendário  │   │ • StorySelling│   │ • CTAs        │
│ • Datas espec.│   │ • Narrativa   │   │ • Ofertas     │
│ • Sazonalidade│   │ • Dicas 60+   │   │ • Produtos    │
└───────────────┘   └───────────────┘   └───────────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            ▼
                   ┌─────────────────┐
                   │ 📧 ENVIO        │
                   │                 │
                   │ • Beehiiv API   │
                   │ • Agendamento   │
                   │ • Métricas      │
                   └─────────────────┘
```

---

## 🤖 Agentes Autônomos

### 1. Agente Ganchos 📅
**Função**: Identificar oportunidades de conteúdo baseadas em datas

**Fontes**:
- Calendário Comercial 60maisPlay 2026 (36 eventos)
- Datas comemorativas gerais
- Tendências de busca

**Output**: Sugestões de temas com gancho comercial

---

### 2. Agente Storyteller ✍️
**Função**: Criar conteúdo usando técnica StorySelling

**Estrutura**:
1. **Headline** - Chamativa, curiosa
2. **Story opener** - Conexão emocional
3. **Conteúdo útil** - Dica prática
4. **Bridge** - Transição sutil para oferta
5. **CTA** - Chamada para ação

**Fontes**:
- Manual de Email StorySelling (aguardando)
- Cursos 60maisPlay existentes
- FAQ dos alunos

---

### 3. Agente Vendas 💰
**Função**: Inserir ofertas de forma natural

**Catálogo de Produtos**:
- Cursos Pílula (18 cursos)
- Workshops (R$ 47-97)
- Aulas particulares (R$ 197/h)
- E-books e materiais

**Regras**:
- Não ser agressivo
- Relevância com o tema
- Urgência/escassez quando apropriado

---

### 4. Agente Envio 📧
**Função**: Publicar na Beehiiv

**Tarefas**:
- Format HTML responsivo
- Agendar horário (06:06)
- Testar links
- Monitorar métricas

---

## 📊 Fluxo de Trabalho

```
1. [Diário 05:00] Agente Ganchos verifica eventos do dia
                    ↓
2. Agente Storyteller cria conteúdo baseado no gancho
                    ↓
3. Agente Vendas insere oferta relevante
                    ↓
4. Revisão humana (opcional)
                    ↓
5. Agente Envio agenda para 06:06
                    ↓
6. [06:06] Newsletter enviada
                    ↓
7. Coleta de métricas (abertura, cliques)
```

---

## 📁 Arquivos do Projeto

| Arquivo | Descrição |
|---------|-----------|
| `calendario-comercial-60mais-2026.json` | 36 eventos para ganchos |
| `storyselling-manual.md` | Técnica de escrita (aguardando) |
| `catalogo-produtos.json` | Produtos para oferta |
| `agente-ganchos.js` | Script do agente de ganchos |
| `agente-storyteller.js` | Script do agente de conteúdo |
| `agente-vendas.js` | Script do agente de vendas |
| `agente-envio.js` | Script para Beehiiv API |
| `orquestrador.js` | Coordena todos os agentes |

---

## 🔌 Integrações Necessárias

| Serviço | API | Status |
|---------|-----|--------|
| Beehiiv | Newsletter | ✅ Ativo |
| Google Sheets | Calendário | ✅ Configurado |
| OpenAI/Claude | Geração de texto | ⏳ Configurar |
| Trello | Gestão de tarefas | ✅ Ativo |

---

## ✅ Próximos Passos

1. [ ] Receber Manual de Email StorySelling
2. [ ] Configurar API Beehiiv
3. [ ] Criar catálogo de produtos
4. [ ] Desenvolver agente de ganchos
5. [ ] Desenvolver agente storyteller
6. [ ] Testar primeiro ciclo completo

---

---

## 🔀 Fusão: S.L.P.C. + Essência 60maisNews

### O Desafio
Manter o tom afetuoso, metáforas familiares e linguagem simples **DENTRO** da estrutura StorySelling.

### Estrutura Híbrida

```
┌─────────────────────────────────────────────────────────────┐
│  🌟 REFLEXÃO DO DIA (manter como hook inicial)             │
├─────────────────────────────────────────────────────────────┤
│  📖 STORY (S)                                               │
│  • História pessoal ou observação                           │
│  • Tom: "Outro dia eu estava..." ou "Sabe o que aconteceu?" │
│  • Manter: metáforas familiares, emojis, afeto             │
│  • 100-250 palavras                                         │
├─────────────────────────────────────────────────────────────┤
│  💭 LESSON (L)                                               │
│  • "O que isso me ensinou?"                                 │
│  • Conexão emocional com o público 60+                      │
│  • 25-50 palavras                                           │
├─────────────────────────────────────────────────────────────┤
│  💡 PIVOT + DICAS PRÁTICAS (P)                              │
│  • "Isso me fez pensar em vocês..."                         │
│  • Dica passo a passo (como já fazemos)                     │
│  • Dicas de segurança (manter!)                             │
│  • 50-100 palavras + tutorial                               │
├─────────────────────────────────────────────────────────────┤
│  🎯 CTA (C)                                                  │
│  • Oferta casual no final                                   │
│  • "Se quiser aprender mais..."                             │
│  • Sem pressão, como já fazemos                            │
│  • 25-75 palavras                                           │
└─────────────────────────────────────────────────────────────┘
```

### Exemplo Prático

---

**🌟 Reflexão do Dia:**
> "Cada momento com a família é um tesouro que guardamos no coração."

---

**📖 STORY (S):**
> Outro dia, liguei para minha mãe e ela disse: "Filho, não consigo ver suas fotos, meu celular está muito lento!"
>
> Fui visitá-la e descobri que ela tinha **3.000 fotos** no celular, cada álbum duplicado, e o WhatsApp guardava vídeos que ela nem lembrava de ter recebido. 😅
>
> O celular dela estava "engasgado" - parece aquele armário que a gente enche de coisas e depois não consegue encontrar nada!

---

**💭 LESSON (L):**
> Isso me ensinou que **organizar o celular é como organizar a casa**: um pouco de manutenção faz toda a diferença no dia a dia.

---

**💡 PIVOT + DICAS (P):**
> E pensei comigo: quantos de vocês estão com o celular "cansado" também? Então vou ensinar uma faxina rápida:

**1. Limpe o WhatsApp:**
> Configurações → Armazenamento → Gerenciar armazenamento
> Apague vídeos e fotos antigas das conversas maiores.

**2. Desinstale apps que não usa:**
> Toque e segure → "Desinstalar"

**🛡️ Dica de Segurança:**
> Antes de apagar fotos, faça backup no Google Fotos!

---

**🎯 CTA (C):**
> Se quiser aprender mais dicas como essa com calma e carinho, nosso **Curso 60+ Presencial** é o lugar certo!
>
> 📱 Chame no WhatsApp: (11) 95354-5939

---

### O que Mudou vs O que Ficou

| Elemento | Antes | Depois (S.L.P.C.) |
|----------|-------|-------------------|
| Abertura | Reflexão direta | Reflexão + História pessoal |
| Dicas | Diretas | Conectadas à história |
| Tom | Afetuoso | ✅ Manteve |
| Emojis | Presentes | ✅ Manteve |
| Metáforas | Familiares | ✅ Manteve |
| CTA | Casual | ✅ Manteve |
| **Diferença** | Educativo puro | Educativo + Conexão emocional |

---

## 🎨 Tom e Estilo da 60maisNews

### Características Identificadas:

**1. Linguagem Afetuosa e Acolhedora**
- "Queridos amigos", "com carinho", "com todo carinho"
- Proximidade: "Estamos juntos nessa jornada"

**2. Metáforas do Dia a Dia**
- Memória do celular = "armário que enche"
- Limpeza de dados = "faxina digital"
- WhatsApp = "ponte mágica", "abraço em forma digital"

**3. Emojis Frequentes**
- 🌟 💪 📞 🎉 ❤️ 🔒 🛡️ 🎓 🤝

**4. Estrutura Típica**
- Reflexão do dia (frase inspiradora)
- Identificação do problema/situação
- Dica prática com passo a passo
- Dicas de segurança
- CTA para curso/WhatsApp (casual)

**5. Ofertas Casuais**
- Aparecem no final, de forma leve
- Sem pressão, sem urgência agressiva

**6. Evita Jargões Técnicos**
- Linguagem simples e acessível
- Explica como se estivesse conversando

### Exemplos de Headlines:
- "💊 Não Esqueça Seus Medicamentos!"
- "WhatsApp para Idosos: Conectando Corações com Carinho e Segurança!"
- "Faxina no Celular: Deixe seu Aparelho Mais Rápido e Leve!"

---

*Projeto iniciado: 16/02/2026*
*Versão: 1.0*
