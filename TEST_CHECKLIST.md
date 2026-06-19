# Teste Manual - Álbum 2026

**Data:** 2026-06-18
**Versão:** 1.0
**Status:** Pronto para Teste

---

## 1. PREPARAÇÃO DO AMBIENTE

### 1.1 Verificação de Arquivos
- [ ] Verificar que todos os arquivos existem:
  - `index.html` - Aplicação principal
  - `seed.html` - Script de seed do banco de dados
  - `js/app.js` - Inicialização da app
  - `js/supabase.js` - Conexão com Supabase
  - `js/ui.js` - Renderização de UI
  - `js/handlers.js` - Event handlers
  - `js/utils.js` - Funções utilitárias
  - `css/main.css` - Estilos principais
  - `css/header.css` - Estilos do header
  - `css/grid.css` - Estilos do grid
  - `data/figurinhas.json` - Dados estáticos

### 1.2 Verificação de Configuração
- [ ] Verificar que `js/supabase.js` tem URLs válidas:
  - `SUPABASE_URL` configurado
  - `SUPABASE_ANON_KEY` configurado
- [ ] Verificar que o servidor HTTP está rodando (XAMPP)
- [ ] Verificar que Supabase está acessível

### 1.3 Limpeza de Dados Anteriores (opcional)
- [ ] Limpar banco de dados Supabase (deletar linhas das tabelas):
  - `figurinhas`
  - `paises`
  - `grupos`

---

## 2. TESTE DE SEED (Passo crítico)

### 2.1 Abrir Seed
- [ ] Abrir browser e navegar para `http://localhost/figurinhas-album-2026/seed.html`
- [ ] Verificar que página carrega sem erros
- [ ] Ver botão "Start Seed" visível
- [ ] Ver área de log vazia

### 2.2 Executar Seed
- [ ] Clique em "Start Seed"
- [ ] Digitar `SUPABASE_URL` quando solicitado
- [ ] Digitar `SUPABASE_ANON_KEY` quando solicitado
- [ ] Aguardar a execução (pode levar 30-60 segundos)

### 2.3 Verificar Logs de Seed
- [ ] Ver mensagens de progresso:
  - `🌱 Starting seed...`
  - `📋 Seeding grupos...`
  - `✓ X grupos seeded` (deve ser 8 grupos: A-H)
  - `🌍 Seeding paises...`
  - `✓ X países seeded` (deve ser 32 países)
  - `🖼️  Seeding figurinhas...`
  - `✓ Seeded XXX/980 figurinhas` (progressivo até 980)
  - `✅ Seed complete!` (sucesso em verde)

### 2.4 Verificação de Erros
- [ ] Não deve haver mensagens de erro em vermelho
- [ ] Não deve haver logs de erro no console (F12)
- [ ] Se houver erros, anotar qual erro ocorreu

---

## 3. TESTE DE INICIALIZAÇÃO DA APP (index.html)

### 3.1 Abrir Aplicação
- [ ] Abrir browser em nova aba
- [ ] Navegar para `http://localhost/figurinhas-album-2026/index.html`
- [ ] Aguardar o carregamento (10-15 segundos max)
- [ ] Não deve haver erro de conexão

### 3.2 Verificar Header
- [ ] Deve mostrar título "🏆 Álbum 2026"
- [ ] Deve mostrar estatísticas "0 / 980" (inicialmente 0)
- [ ] Deve mostrar percentual "(0%)"
- [ ] Deve ter barra de progresso visível (vazia inicialmente)
- [ ] Deve ter botão de menu "☰" no canto superior direito

### 3.3 Verificar Abas de Grupos
- [ ] Deve mostrar 8 abas: "Grupo A", "Grupo B", "Grupo C", "Grupo D", "Grupo E", "Grupo F", "Grupo G", "Grupo H"
- [ ] Abas devem ter cores diferentes
- [ ] Primeira aba ("Grupo A") deve estar ativa (destaque visual)

### 3.4 Verificar Conteúdo Inicial
- [ ] Deve mostrar 4 cards de países no Grupo A:
  - Brasil (BRA)
  - México (MEX)
  - Uruguai (URY)
  - Paraguai (PAR)
- [ ] Cada card deve ter:
  - Flag do país (emoji)
  - Nome do país
  - Estatísticas "0 / X figurinhas"
  - Percentual "0%"
  - Gradiente de cor de fundo
  - Grid com figurinhas (cada país tem 20 figurinhas)
  - Botões de ação "➕ Duplicata" e "🔴 Ver Duplicatas"

### 3.5 Verificar Grid de Figurinhas
- [ ] Grid deve mostrar 20 stickers por país
- [ ] Stickers devem estar vazios (cinza claro)
- [ ] Stickers devem ser clicáveis (cursor pointer)
- [ ] Deve haver número abaixo de cada sticker ou title ao passar mouse

---

## 4. TESTE DE INTERATIVIDADE

### 4.1 Marcar Figurinhas como "Tenho"
- [ ] Clicar em 3 stickers diferentes (ex: primeira de cada país)
- [ ] Cada sticker deve:
  - Mudar de cor para verde (✓ check)
  - Mostrar alteração imediata na UI
  - Mostrar notificação de sucesso (toast)
- [ ] Header deve atualizar:
  - Estatísticas mudam de "0 / 980" para "3 / 980"
  - Percentual atualiza para "(0%)" ou "(1%)"
  - Barra de progresso aumenta ligeiramente
- [ ] Cards de país devem atualizar suas estatísticas

### 4.2 Desmarcar Figurinhas
- [ ] Clicar novamente em um dos stickers marcados
- [ ] Sticker deve:
  - Voltar para cinza (vazio)
  - Mostrar notificação de desmarcação
- [ ] Estatísticas devem voltar (ex: "2 / 980")

### 4.3 Adicionar Duplicatas
- [ ] Clicar em "➕ Duplicata" de um país qualquer
- [ ] Deve aparecer prompt perguntando código (ex: "BRA1")
- [ ] Entrar código de uma figurinha (ex: "BRA1")
- [ ] Deve mostrar notificação de sucesso
- [ ] Figurinha deve mostrar pequeno badge com número
- [ ] Clicar novamente e adicionar mais duplicatas ao mesmo código
- [ ] Badge deve atualizar o número

### 4.4 Navegação entre Grupos
- [ ] Clicar em diferentes abas de grupo:
  - Grupo B, Grupo C, Grupo H, etc
- [ ] Cada clique deve:
  - Destacar a aba ativa
  - Carregar os 4 países do grupo
  - Mostrar figurinhas vazias (não marcadas)
  - Atualizar conteúdo suavemente
- [ ] Voltar ao Grupo A:
  - As figurinhas marcadas antes devem estar ainda marcadas
  - Estatísticas devem estar corretas

### 4.5 Menu de Opções
- [ ] Clicar no botão "☰" (menu)
- [ ] Deve abrir painel lateral com opções:
  - "📊 Dashboard"
  - "🔴 Duplicatas"
  - "⚙️ Configurações"
- [ ] Botão "×" (fechar) deve fechar o menu
- [ ] Clicar fora do menu deve fechar
- [ ] Menu deve ter fundo escuro (overlay)

---

## 5. TESTE DE ESTATÍSTICAS

### 5.1 Marcar Stickers para Teste
- [ ] Marcar ~15-20 stickers em diferentes países
- [ ] Distribuir em 2-3 grupos diferentes
- [ ] Anotar quantidade total

### 5.2 Verificar Atualização em Tempo Real
- [ ] Header deve mostrar:
  - Total correto (ex: "15 / 980")
  - Percentual correto (ex: "(2%)")
  - Barra de progresso correta
- [ ] Cada card de país deve mostrar:
  - Número de stickers marcados vs total
  - Percentual correto para aquele país

### 5.3 Teste de Dashboard
- [ ] Clicar "☰" → "📊 Dashboard"
- [ ] Deve aparecer alerta/modal com:
  - Total geral: "X / 980"
  - Percentual geral
  - Breakdown por grupo:
    - "Grupo A: X / 80"
    - "Grupo B: X / 80"
    - ... (8 grupos)
- [ ] Fechar dashboard

### 5.4 Teste de Duplicatas
- [ ] Clicar em "➕ Duplicata" em vários países
- [ ] Adicionar duplicatas para mesmos códigos múltiplas vezes
- [ ] Clicar em "🔴 Ver Duplicatas"
- [ ] Deve listar:
  - Código da figurinha
  - Nome da figurinha
  - Número de duplicatas (ex: "2x", "3x")
- [ ] Se não houver duplicatas, deve mostrar mensagem apropriada

---

## 6. TESTE DO CONSOLE (Debugging)

### 6.1 Abrir Developer Tools
- [ ] Pressionar F12 para abrir Console
- [ ] Ir para aba "Console"

### 6.2 Verificar Logs
- [ ] Deve haver logs de inicialização:
  - `🚀 Initializing Álbum 2026...`
  - `📋 Rendering UI...`
  - `🎯 Setting up handlers...`
  - `✅ App initialized successfully`

### 6.3 Verificar Erros
- [ ] Não deve haver mensagens vermelhas de erro
- [ ] Não deve haver mensagens de "undefined" ou "null"
- [ ] Não deve haver erros de CORS

### 6.4 Testar Network (aba Network)
- [ ] Abrir aba "Network"
- [ ] Clicar em um sticker
- [ ] Verificar requisição HTTP:
  - POST para Supabase deve ser sucesso (status 200)
- [ ] Clicar em "📊 Dashboard"
- [ ] Deve haver 9 requisições GET (1 para stats gerais + 8 para grupos)

---

## 7. TESTE DE RESPONSIVIDADE (Mobile)

### 7.1 Redimensionar Browser (Desktop)
- [ ] Redimensionar janela para 375px de largura
- [ ] Verificar que:
  - Header se adapta
  - Abas de grupo ficam scrolláveis ou empilhadas
  - Cards se reorganizam
  - Grid de stickers se adapta

### 7.2 Teste em Dispositivo Mobile (opcional)
- [ ] Se disponível, testar em celular/tablet:
  - App deve carregar
  - Interações devem funcionar com touch
  - Layout deve ser responsivo

---

## 8. TESTE DE PERFORMANCE

### 8.1 Tempo de Carregamento
- [ ] index.html deve carregar em < 3 segundos (primeira vez)
- [ ] Mudança de grupo deve ser < 1 segundo
- [ ] Clique em sticker deve ser instantâneo (< 500ms)

### 8.2 Consumo de Dados
- [ ] Abrir Network tab
- [ ] Cada requisição deve ser < 100KB
- [ ] Total de dados deve ser < 2MB

---

## 9. TESTE DE PERSISTÊNCIA

### 9.1 Marcar Stickers
- [ ] Marcar 10 stickers
- [ ] Anotar quais foram marcados
- [ ] F5 para recarregar a página

### 9.2 Verificar Persistência
- [ ] Após reload, os mesmos stickers devem estar marcados
- [ ] Estatísticas devem estar corretas
- [ ] Duplicatas devem estar presentes

---

## 10. CASOS DE ERRO

### 10.1 Sem Conexão com Supabase
- [ ] Desligar internet (ou bloquear em Developer Tools)
- [ ] Recarregar página
- [ ] Deve mostrar erro amigável: "❌ Erro de Conexão"

### 10.2 Banco de Dados Vazio
- [ ] Limpar tabelas do Supabase
- [ ] Recarregar index.html
- [ ] Deve mostrar: "⚠️ Base de dados vazia"
- [ ] Deve oferecer link para seed.html

### 10.3 Credenciais Inválidas
- [ ] Editar js/supabase.js com URLs inválidas
- [ ] Recarregar index.html
- [ ] Deve mostrar erro de conexão

---

## 11. RESUMO DE VERIFICAÇÃO

### Checklist Final
- [ ] Seed executa e popula 980 figurinhas
- [ ] Página carrega sem erros de conexão
- [ ] Header mostra título e estatísticas
- [ ] 8 grupos com 4 países cada (32 países total)
- [ ] 980 stickers visíveis no grid
- [ ] Clicar em sticker marca/desmarca (verde/cinza)
- [ ] Estatísticas atualizam em tempo real
- [ ] Menu funciona (abrir/fechar)
- [ ] Dashboard mostra breakdown por grupo
- [ ] Duplicatas podem ser adicionadas e listadas
- [ ] Mudança de grupo funciona corretamente
- [ ] Console não mostra erros críticos
- [ ] Page persiste dados após reload
- [ ] Comportamento é responsivo em dispositivos menores

---

## 12. PROBLEMAS ENCONTRADOS

Use esta seção para documentar qualquer problema:

```
Data: _______________
Problema: ___________________________________________________
Passos para reproduzir: _____________________________________
Resultado esperado: ________________________________________
Resultado real: ____________________________________________
Nível: [ ] Crítico [ ] Alto [ ] Médio [ ] Baixo
Solução: __________________________________________________
```

---

## 13. ASSINATURA

**Testador:** _____________________
**Data do Teste:** ________________
**Status Final:** [ ] PASSOU [ ] FALHOU COM ISSUES

**Notas Finais:**
_______________________________________________________________________________
_______________________________________________________________________________

---

## Referência Rápida de URLs

- **Seed:** http://localhost/figurinhas-album-2026/seed.html
- **App:** http://localhost/figurinhas-album-2026/index.html
- **Dev Tools:** F12 (ou Ctrl+Shift+I)
- **Console:** F12 → Console tab

## Códigos de Teste Úteis

Alguns códigos para usar ao testar duplicatas:
- BRA1, BRA2, BRA3 (Brasil)
- MEX1, MEX2 (México)
- URY1 (Uruguai)
- PAR1 (Paraguai)

Ao adicionar duplicata, usar exatamente esses códigos (maiúscula/minúscula importa).
