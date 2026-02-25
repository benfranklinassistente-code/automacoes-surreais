# 📚 Lições Aprendidas - Ben

Sessão diária de aprendizagem às 19:00 (Brasília)

---

## 📅 23/02/2026 - Sessão das 19:00

### ✅ O que funcionou bem hoje:
- Newsletter 60maisNews com 30 temas implementada e funcionando
- Imagens hospedadas no Imgur (HTTP 200)
- WhatsApp CTA atualizado para 11 95354-5939
- CRON Newsletter 06:06 funcionando
- CRON Dicas WhatsApp 08:00 funcionando
- ID do grupo WhatsApp correto identificado: 120363375518105627@g.us
- Testes de envio confirmados pelo usuário
- Sistema de aprendizagem diária ativado

### ❌ O que pode melhorar:
- Gateway com timeout às vezes
- 2 CRONs com erro (Relatório Telegram, Lembrete MVP)
- Formato de target WhatsApp precisa ser consistente

### 💡 Insights importantes:
- Grupo WhatsApp correto é "Curso Smartphone Inteligência Artificial 60+"
- ID: 120363375518105627@g.us (NÃO usar @c.us)
- Imgur funciona bem para hospedar imagens de newsletter
- Cache de 30 temas evita repetição por 30 dias

### 📋 Próximas ações:
- [ ] Corrigir CRON Relatório Telegram (timeout)
- [ ] Corrigir CRON Lembrete MVP (target incorreto)
- [ ] Implementar webhooks para tempo real
- [ ] MVP WhatsApp para escalar

---

## 📅 20/02/2026

### 🔍 Sempre Pesquisar Antes de Perguntar
- **Situação:** Ben pediu para registrar gasto, disse que tinha uma planilha
- **Erro:** Perguntei onde estava a planilha em vez de pesquisar
- **Lição:** Sempre fazer busca exaustiva nos registros antes de perguntar ao usuário
- **Arquivos verificados:** `memory/`, `*.js`, `*.json` na workspace

### 💰 Sistema de Finanças
- **Descoberta:** Arquivo `financas.js` com integração Google Sheets
- **Spreadsheet ID:** `1VhY95rXzg9UjVnjr21nuOVpxhEuM3N8HN1TeeFrX7X8`
- **Uso:** `registrarTransacao(tipo, categoria, descricao, valor, formaPagamento, status, clienteFornecedor, observacoes)`

### 🖼️ Ler Comprovantes com Atenção
- **Erro:** Li comprovante e registrei "Barbeiro" quando era "Prestação do Carro"
- **Causa:** Assumi pelo nome "Cleber Augusto" sem ler o contexto correto
- **Lição:** Sempre ler comprovantes COM ATENÇÃO e confirmar a descrição correta com o usuário antes de registrar

### 📷 OCR para Ler Comprovantes (Imagens)
- **Situação:** Usuário enviou comprovantes em imagem e não conseguia ler
- **Erro:** A função `read` de imagens não faz OCR automaticamente
- **Solução:** Usar **Tesseract OCR** instalado no sistema
- **Comando:** `tesseract [arquivo.jpg] stdout -l por`
- **Exemplo:** `tesseract /root/.openclaw/media/inbound/arquivo.jpg stdout -l por`
- **Resultado:** Extrai texto de comprovantes, notas fiscais, etc.
- **Data:** 20/02/2026

### 📚 OCR para Capas de Livros
- **Situação:** Capas de livros com texto artístico não são lidas corretamente
- **Erro:** OCR padrão não funciona bem com fontes estilizadas
- **Solução:** Usar parâmetros avançados do Tesseract
- **Comando melhorado:** `tesseract [arquivo.jpg] stdout -l por --psm 11 --oem 1`
- **Parâmetros:**
  - `--psm 11` - Sparse text (texto esparso)
  - `--oem 1` - Neural net LSTM engine only
- **Alternativa:** Pedir ao usuário o nome do livro quando OCR falhar
- **Data:** 21/02/2026

### 📱 Formatos de Target WhatsApp para message
- **Situação:** Jobs falhando ao enviar mensagens WhatsApp
- **Erro:** `Delivering to WhatsApp requires target <E.164|group JID>`
- **Causa:** Formato incorreto do target
- **Correção:**
  - **Grupos:** `120363375518105627@g.us` ✅
  - **Números individuais:** `5511953545939@s.whatsapp.net` ✅
  - **NUNCA usar:** `@c.us` ❌ (não funciona)
- **Data:** 21/02/2026

### ⚠️ Jobs Profissionais - Zero Tolerância a Erros
- **Situação:** Erros em automações profissionais (newsletter, bot, relatórios)
- **Impacto:** Perda de credibilidade e falha em processos críticos
- **Regras:**
  1. Sempre testar job após criar/editar
  2. Sempre usar formato correto de target
  3. Timeout realista (60s para simples, 90s para complexos)
  4. Mensagens curtas e diretas nos jobs
  5. Documentar cada erro e sua solução
- **Data:** 21/02/2026

---

## 📅 21/02/2026

### 📚 Sessão de Aprendizagem - 21/02/2026

✅ **O que funcionou bem:**
- Newsletter enviada com sucesso às 06:06
- Bot WhatsApp operacional sem erros
- Jobs corrigidos e testados

⚠️ **O que pode melhorar:**
- Gateway com lentidão/timeout
- Rate limit em requisições frequentes

💡 **Insights:**
- Precisa implementar webhooks para tempo real
- MVP WhatsApp é prioridade para escalar

---

*Próxima sessão: 24/02/2026 às 19:00*


---

## 📅 24/02/2026 - Sessão das 16:00

### ✅ O que funcionou bem hoje:
- [Registre aqui]

### ❌ O que pode melhorar:
- [Registre aqui]

### 💡 Insights importantes:
- [Registre aqui]

### 📋 Próximas ações:
- [Registre aqui]

