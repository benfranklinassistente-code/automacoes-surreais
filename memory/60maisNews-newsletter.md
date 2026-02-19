# 📰 60maisNews - Newsletter

## 📋 Informações Básicas

| Item | Valor |
|------|-------|
| **Nome** | 60maisNews |
| **Público** | Idosos 60+ interessados em tecnologia |
| **Frequência** | Diária às 06:06 |
| **Envio** | Brevo (API configurada) |
| **Blog** | WordPress (https://60maiscursos.com.br/blog/) |
| **Técnica** | StorySelling (S.L.P.C.) |

### WordPress - Configuração

| Info | Valor |
|------|-------|
| **URL** | https://60maiscursos.com.br/blog/ |
| **API** | REST API WordPress |
| **Credenciais** | Salvas em `wordpress-config.json` |
| **Módulo** | `wordpress.js` |

### Categorias do Blog

| ID | Categoria |
|----|-----------|
| 3 | Bancos Digitais |
| 6 | Inteligência Artificial |
| 2 | Segurança Digital |
| 5 | Tecnologia Básica |
| 1 | Uncategorized |

### Brevo - Configuração

| Info | Valor |
|------|-------|
| **Conta** | Luis Canabarra |
| **Email** | benfranklinassistente@gmail.com |
| **Contatos** | 102 assinantes |
| **Campanhas** | 8 criadas |
| **API Key** | Salva em `brevo-config.json` |
| **Módulo** | `brevo.js` |

### Funções Disponíveis

- `enviarEmail()` - Email transacional
- `listarContatos()` - Ver assinantes
- `criarContato()` - Adicionar contato
- `listarCampanhas()` - Ver campanhas
- `enviarTemplate()` - Email com template
- `estatisticasEmails()` - Métricas

---

## 📚 Manual de Email StorySelling (Lido em 16/02/2026)

### Fórmula S.L.P.C.

```
S → L → P → C

Story → Lesson → Pivot → Call to Action
História → Lição → Conexão → Chamada para Ação
```

### Estrutura de Palavras

| Seção | Palavras |
|-------|----------|
| Story (História) | 100-250 |
| Lesson (Lição) | 25-50 |
| Pivot (Conexão) | 50-100 |
| CTA (Ação) | 25-75 |
| **TOTAL** | **250-450** |

### 7 Princípios do Storytelling

1. **Mostre, não apenas fale** — histórias em ação
2. **Entretenimento + Educação = $$$**
3. **Deixe espiar por cima do muro** — voyeurismo
4. **Revele o "O quê", não o "Como"** — gratuito vs pago
5. **O problema é a razão para comprar**
6. **Ofertas casuais vendem mais**
7. **Frequência = Mais dinheiro** — enviar diariamente

### Newsletter vs Lista de E-mail

| Newsletter | Lista de E-mail |
|------------|-----------------|
| Comunicação contínua | Sequência promocional |
| Relacionamento | Leads frios |
| Silêncio = não | Silêncio depois = sim |

---

## 📖 Newsletters Analisadas (16/02/2026)

### 1. "💊 Não Esqueça Seus Medicamentos!" (19/09/2025)
- Reflexão inicial sobre saúde
- Promoção da plataforma 60maisPlay (23 vagas restantes)
- Dica: configurar lembretes de medicamentos
- Passo a passo Android e iPhone
- Apps: Medisafe, MyTherapy
- Dicas de segurança

### 2. "WhatsApp para Idosos: Conectando Corações com Carinho e Segurança!" (26/08/2025)
- Reflexão afetuosa sobre tecnologia
- Dicas: mensagens, chamadas, grupos
- Dicas de segurança (verificação em duas etapas)
- CTA para curso presencial

### 3. "Faxina no Celular: Deixe seu Aparelho Mais Rápido e Leve!" (20/08/2025)
- Metáfora: memória = armário
- Dicas: limpar WhatsApp, desinstalar apps, Google Fotos
- CTA casual para curso presencial

---

## 🎨 Tom e Estilo Identificados

### Características da 60maisNews

| Característica | Exemplos |
|----------------|----------|
| **Afetuoso** | "Queridos amigos", "com carinho", "com todo carinho" |
| **Proximidade** | "Estamos juntos nessa jornada" |
| **Metáforas familiares** | "Memória = armário", "Faxina digital", "ponte mágica" |
| **Emojis frequentes** | 🌟 💪 📞 🎉 ❤️ 🔒 🛡️ 🎓 🤝 |
| **Linguagem simples** | Sem jargões técnicos |
| **Ofertas casuais** | No final, sem pressão agressiva |

### Estrutura Atual

```
1. Reflexão do dia (frase inspiradora)
2. Identificação do problema/situação
3. Dica prática passo a passo
4. Dicas de segurança
5. CTA para curso/WhatsApp (casual)
```

---

## 🔀 Estrutura Híbrida: S.L.P.C. + Essência 60maisNews

### O Desafio
Manter o tom afetuoso, metáforas familiares e linguagem simples **DENTRO** da estrutura StorySelling.

### Nova Estrutura

```
┌─────────────────────────────────────────────────────────────┐
│  🌟 REFLEXÃO DO DIA (hook inicial - manter)                │
├─────────────────────────────────────────────────────────────┤
│  📖 STORY (S) - 100-250 palavras                           │
│  • História pessoal ou observação                           │
│  • Tom: "Outro dia eu estava..." ou "Sabe o que aconteceu?" │
│  • Manter: metáforas familiares, emojis, afeto             │
├─────────────────────────────────────────────────────────────┤
│  💭 LESSON (L) - 25-50 palavras                             │
│  • "O que isso me ensinou?"                                 │
│  • Conexão emocional com o público 60+                      │
├─────────────────────────────────────────────────────────────┤
│  💡 PIVOT + DICAS PRÁTICAS (P) - 50-100 palavras + tutorial │
│  • "Isso me fez pensar em vocês..."                         │
│  • Dica passo a passo (como já fazemos)                     │
│  • Dicas de segurança (manter!)                             │
├─────────────────────────────────────────────────────────────┤
│  🎯 CTA (C) - 25-75 palavras                                │
│  • Oferta casual no final                                   │
│  • "Se quiser aprender mais..."                             │
│  • Sem pressão, como já fazemos                            │
└─────────────────────────────────────────────────────────────┘
```

### Exemplo Prático Criado

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

## 📊 Resumo: O que Mudou vs O que Ficou

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

## 🔗 Arquivos Relacionados

| Arquivo | Descrição |
|---------|-----------|
| `manual-storyselling.md` | Manual completo de StorySelling |
| `projeto-newsletter-60mais.md` | Documentação do projeto |
| `orquestrador-newsletter.js` | Script do orquestrador |
| `calendario-comercial-60mais-2026.json` | 36 eventos para ganchos |

---

## ✅ Próximos Passos

1. [ ] Configurar API Beehiiv
2. [ ] Criar catálogo de produtos para ofertas
3. [ ] Desenvolver agente de ganchos (calendário)
4. [ ] Desenvolver agente storyteller (S.L.P.C.)
5. [ ] Desenvolver agente de vendas (CTAs casuais)
6. [ ] Testar primeiro ciclo completo

---

*Memória criada em: 16/02/2026*
*Última atualização: 16/02/2026*
