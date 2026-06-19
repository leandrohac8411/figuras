# Design Specification: Álbum de Figurinhas Copa 2026

**Data:** 2026-06-18  
**Versão:** 1.0  
**Status:** Aprovado  

---

## 1. Visão Geral

Sistema web para rastreamento de figurinhas do álbum Panini FIFA World Cup 2026. Interface responsiva otimizada para mobile, armazenamento em Supabase (banco de dados), deploy no Vercel.

**Stack:**
- Frontend: Vanilla JS + HTML/CSS
- Backend: Supabase (PostgreSQL)
- Hospedagem: Vercel
- Versionamento: Git

---

## 2. Estrutura de Dados

### 2.1 Modelo de Dados

#### Tabela: `figurinhas`
```sql
id (UUID, PK)
codigo (TEXT, UNIQUE) - ex: "BRA1", "MEX5"
nome (TEXT) - ex: "Neymar Jr"
pais_sigla (TEXT, FK) - ex: "BRA", "MEX"
grupo (TEXT) - ex: "A", "B", "C"
categoria (TEXT) - ex: "Jogador", "Logo", "Mascote"
tem (BOOLEAN) - true/false
duplicatas (INTEGER) - quantidade de duplicatas (0, 1, 2...)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

#### Tabela: `grupos`
```sql
id (UUID, PK)
grupo (TEXT, UNIQUE) - "A", "B", "C"... "L"
created_at (TIMESTAMP)
```

#### Tabela: `paises`
```sql
id (UUID, PK)
sigla (TEXT, UNIQUE) - "BRA", "MEX", "ARG"
nome (TEXT) - "Brasil", "México", "Argentina"
grupo (TEXT, FK para grupos.grupo)
created_at (TIMESTAMP)
```

### 2.2 Dados Iniciais

- **12 Grupos:** A, B, C, D, E, F, G, H, I, J, K, L
- **48 Países:** 4 por grupo
- **980 Figurinhas:** ~20 por país (alguns tem variações)
- **Pré-carregamento:** Arquivo JSON com todas as figurinhas será importado ao inicializar Supabase

---

## 3. Arquitetura de Pastas

```
figurinhas-album-2026/
├── index.html                    # Página principal
├── css/
│   ├── main.css                 # Estilos globais
│   ├── header.css               # Header e navegação
│   └── grid.css                 # Grid de figurinhas
├── js/
│   ├── app.js                   # Inicialização principal
│   ├── supabase.js              # Conexão com banco de dados
│   ├── ui.js                    # Renderização de UI
│   ├── handlers.js              # Event listeners
│   └── utils.js                 # Funções utilitárias
├── data/
│   └── figurinhas.json          # Dados pré-carregados (980 items)
├── assets/
│   └── (ícones, se necessário)
├── docs/
│   ├── DESIGN.md                # Este arquivo
│   ├── DEPLOYMENT.md            # Deploy guide
│   └── API.md                   # Documentação Supabase
├── .gitignore
├── .env.local (não versionar)   # SUPABASE_KEY
└── README.md
```

---

## 4. Fluxo de Interface

### 4.1 Layout Principal

```
┌─────────────────────────────────────────┐
│  Header: Álbum 2026 | 450/980 (45%)     │
│  [Progresso Visual]              [Menu] │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│ Grupo A | Grupo B | Grupo C | ...       │ ← Abas (scroll)
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🇲🇽 México          12/20  [60%] │  │
│  ├──────────────────────────────────┤  │
│  │ Grid de 20 figurinhas (8 cols)   │  │
│  │ ✓ ◻ ✓ ◻ ✓ ✓ ◻ ✓                  │  │
│  │ ✓ ◻ ◻ ✓ ◻ ✓ ✓ ◻                  │  │
│  │ ◻ ✓ ◻ ✓                          │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🇿🇦 Áfr. Sul        8/20   [40%] │  │
│  ├──────────────────────────────────┤  │
│  │ Grid de 20 figurinhas (8 cols)   │  │
│  │ ✓ ◻ ✓ ◻ ◻ ✓ ◻ ✓                  │  │
│  │ ✓ ◻ ◻ ◻ ◻ ◻ ✓ ✓                  │  │
│  │ ◻ ✓ ◻ ◻                          │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🇰🇷 Coreia do Sul   5/20   [25%] │  │
│  │ ... Grid ...                     │  │
│  └──────────────────────────────────┘  │
│                                         │
│  ┌──────────────────────────────────┐  │
│  │ 🇨🇿 Rep. Tcheca     3/20   [15%] │  │
│  │ ... Grid ...                     │  │
│  └──────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

### 4.2 Interações Principais

**Clique em figurinha:**
- Se vazia → marca como "tem" (verde ✓)
- Se marcada → desmarcar (volta vazia)

**Botão "+ Duplicata":**
- Cada figurinha tem um botão "+ Duplicata" fixo (ao lado ou embaixo do checkbox)
- Clique incrementa `duplicatas` contador
- Acumula quantas cópias você tem (BRA1 x1, BRA1 x2, etc)
- Acesso via aba "Duplicatas" para remover quando trocar

**Aba de Duplicatas:** (acessível via menu)
- Lista figurinhas com duplicatas
- Mostra quantidade
- Botão "Remover" para quando trocar

**Dashboard:** (acessível via menu)
- Progresso geral (450/980)
- Progresso por grupo
- Progresso por país
- Figurinhas faltando por país

---

## 5. Especificação Técnica

### 5.1 Frontend

**Responsividade:**
- Mobile-first (telas 320px+)
- Grid 8 colunas (figurinhas)
- Abas com scroll horizontal
- Layout fluido

**Cores (Paleta):**
- Header: Gradiente roxo (#667eea → #764ba2)
- Figurinha "tem": Verde (#4CAF50)
- Figurinha "não tem": Branco com borda tracejada
- Backgrounds: Cinzento (#f5f5f5, #fafafa)
- Países: Gradientes diferentes (vermelho, verde, azul, etc)

**Performance:**
- Lazy loading de imagens (se houver)
- Debounce em cliques múltiplos
- Cache local do localStorage (opcional)

### 5.2 Backend (Supabase)

**Autenticação:**
- Sem autenticação (uso pessoal)
- RLS (Row Level Security) desabilitado

**Queries Principais:**
1. `GET /figurinhas?grupo=A` → todas as figurinhas do grupo
2. `PUT /figurinhas/BRA1` → atualizar status (tem/não tem)
3. `GET /figurinhas?duplicatas>0` → lista de duplicatas
4. `GET /figurinhas?grupo=A&pais=BRA` → figurinhas de um país

**Índices:**
- `figurinhas(codigo)` - busca rápida por código
- `figurinhas(grupo, pais_sigla)` - filtros por grupo e país
- `figurinhas(duplicatas)` - filter de duplicatas

### 5.3 Sincronização

**Sync Strategy (MVP):**
- Cada clique atualiza Supabase **em tempo real**
- Se offline → tela exibe aviso, mas permite cliques (fila local em localStorage)
- Ao voltar online → sincroniza automaticamente
- **Nota:** localStorage (5-10MB) é suficiente para ~100 mudanças offline

**Future (v2):** Considerar IndexedDB para suporte melhor a offline

---

## 6. Fluxo de Dados

```
┌──────────────────┐
│  app.js (init)   │
└────────┬─────────┘
         │
         ├─→ supabase.js (conecta ao banco)
         │
         ├─→ ui.js (carrega grupos/países)
         │
         └─→ handlers.js (add event listeners)

User Action (clique em figurinha)
         │
         ├─→ handlers.js (interpreta ação)
         │
         ├─→ supabase.js (atualiza banco)
         │
         └─→ ui.js (atualiza tela)
```

---

## 7. Recursos Principais (MVP)

### 7.1 v1.0 (MVP)

✓ Visualizar álbum por grupo (12 grupos, 4 países cada)  
✓ Marcar/desmarcar figurinhas  
✓ Rastrear duplicatas (botão "+ Duplicata")  
✓ Aba de duplicatas (listar e remover)  
✓ Dashboard com estatísticas básicas  
✓ Sincronização com Supabase  
✓ Responsivo para mobile  

### 7.2 v2.0 (Future)

- [ ] Upload de fotos das figurinhas
- [ ] Compartilhamento de lista com amigos
- [ ] Trocas (negociação entre usuários)
- [ ] Notificações de novos cromos
- [ ] Histórico de trocas
- [ ] Modo offline completo

---

## 8. Considerações de Segurança

- Sem dados sensíveis (não há login)
- HTTPS em produção (Vercel)
- CORS configurado para Vercel
- SQL Injection prevento via parameterized queries

---

## 9. Testes

**Manual:**
- [ ] Marcar/desmarcar figurinhas
- [ ] Adicionar/remover duplicatas
- [ ] Sincronização com banco
- [ ] Responsividade em 5+ resoluções
- [ ] Offline → Online sync

**Automatizado:**
- TBD (considerar playwright para E2E)

---

## 10. Deploy

**Plataforma:** Vercel  
**Banco:** Supabase (PostgreSQL)  
**CI/CD:** GitHub Actions (TBD)  
**Domínio:** TBD  

**Checklist pré-deploy:**
- [ ] .env local configurado
- [ ] Figuras pré-carregadas no Supabase
- [ ] Testes manuais passando
- [ ] Lighthouse score > 90
- [ ] HTTPS ativo

---

## 11. Inicialização de Dados

**Carregamento das 980 figurinhas (JSON Seed):**

1. **`data/figurinhas.json`** contém array com 980 objetos:
   ```json
   [
     { "codigo": "BRA1", "nome": "Neymar Jr", "pais_sigla": "BRA", "grupo": "C", "categoria": "Jogador" },
     { "codigo": "BRA2", "nome": "Vinícius Jr", "pais_sigla": "BRA", "grupo": "C", "categoria": "Jogador" },
     ...
   ]
   ```

2. **Script: `scripts/seed.js`** lê JSON e insere no Supabase
   ```bash
   npm run seed
   ```

3. **Idempotência:** Script verifica se dados já existem antes de inserir
   - Se rodar 2x, não duplica
   - Seguro para re-deploy

4. **Tabelas:** `grupos` e `paises` também são seedadas do JSON

---

## 12. Observações Importantes

1. **Backup:** Supabase tem backup automático
2. **Performance:** Grid com 20 figurinhas é leve (sem imagens = rápido)
3. **Mobile-First:** Todo design começa em mobile, depois escala
4. **Offline:** Se IndexedDB for implementado, usar like `idb` library (não nativo por compatibilidade)

---

**Aprovado por:** Usuário (2026-06-18)  
**Próximo passo:** Implementação (writing-plans skill)
