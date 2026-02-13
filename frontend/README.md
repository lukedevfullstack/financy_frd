# 💰 Financy - Frontend

Aplicação frontend para gerenciamento financeiro pessoal construída com React, TypeScript, Apollo Client e React Query.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool
- **Apollo Client** - Cliente GraphQL
- **React Query (TanStack Query)** - Gerenciamento de estado assíncrono
- **React Router** - Roteamento
- **Tailwind CSS** - Estilização
- **Lucide React** - Ícones
- **Sonner** - Toast notifications
- **Zustand** - State management (Auth)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ui/             # Componentes base (Button, Card, etc)
│   ├── category-badge/ # Badge de categorias
│   ├── category-icon/  # Ícones de categorias
│   └── ...
├── hooks/              # Custom hooks React Query
│   ├── useLogin.ts
│   ├── useRegister.ts
│   ├── useDashboard.ts
│   ├── useTransactions.ts
│   ├── useCategories.ts
│   └── ... (13 hooks no total)
├── lib/
│   ├── graphql/
│   │   ├── apollo.ts       # Apollo Client config
│   │   ├── queries/        # GraphQL queries
│   │   └── mutations/      # GraphQL mutations
│   └── utils/              # Funções utilitárias
├── pages/              # Páginas da aplicação
│   ├── auth/          # Login e Registro
│   ├── dashboard/     # Dashboard principal
│   └── ...
├── stores/            # Zustand stores
│   └── auth.ts        # Store de autenticação
├── types/             # TypeScript types
│   └── index.ts
└── utils/             # Utilitários
    ├── badge-colors.ts     # Sistema de cores
    └── category-icons.ts   # Sistema de ícones
```

## 🎯 Hooks Disponíveis

### Autenticação
- `useLogin` - Realiza login
- `useRegister` - Cria nova conta

### Dashboard
- `useDashboard` - Busca dados do dashboard (saldo, transações recentes, top categorias)

### Transações
- `useTransactions` - Lista todas as transações
- `useTransactionsPaginated` - Lista com filtros e paginação
- `useTransaction` - Busca uma transação por ID
- `useCreateTransaction` - Cria nova transação
- `useUpdateTransaction` - Atualiza transação existente
- `useDeleteTransaction` - Deleta transação

### Categorias
- `useCategories` - Lista todas as categorias
- `useCategory` - Busca uma categoria por ID
- `useCategoryStats` - Estatísticas das categorias
- `useCreateCategory` - Cria nova categoria
- `useUpdateCategory` - Atualiza categoria existente
- `useDeleteCategory` - Deleta categoria

## 🚀 Como Usar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## 💡 Exemplos de Uso

### Criar uma Transação

```typescript
import { useCreateTransaction, useCategories } from '@/hooks';

function TransactionForm() {
  const { mutate: createTransaction, isPending } = useCreateTransaction();
  const { data: categories } = useCategories();

  const handleSubmit = (formData) => {
    createTransaction({
      description: formData.description,
      amount: parseFloat(formData.amount),
      type: formData.type, // 'INCOME' ou 'EXPENSE'
      categoryId: formData.categoryId,
      date: formData.date
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* campos do formulário */}
      <button disabled={isPending}>Criar</button>
    </form>
  );
}
```

### Listar Transações com Filtros

```typescript
import { useTransactionsPaginated } from '@/hooks';

function TransactionsList() {
  const { data, isLoading } = useTransactionsPaginated({
    filters: {
      type: 'EXPENSE',
      month: 12,
      year: 2024,
      categoryId: 'cat-123'
    },
    pagination: {
      page: 1,
      limit: 20
    }
  });

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      <p>Total: {data.total} transações</p>
      <ul>
        {data.transactions.map(t => (
          <li key={t.id}>
            {t.description} - R$ {t.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Buscar Dados do Dashboard

```typescript
import { useDashboard } from '@/hooks';

function Dashboard() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) return <div>Carregando...</div>;
  if (isError) return <div>Erro ao carregar dados</div>;

  return (
    <div>
      <h1>Saldo Total: R$ {data.balance.total}</h1>
      <p>Receitas: R$ {data.balance.income}</p>
      <p>Despesas: R$ {data.balance.expense}</p>
      
      <h2>Transações Recentes</h2>
      {data.recentTransactions.map(t => (
        <div key={t.id}>{t.description}</div>
      ))}
      
      <h2>Top Categorias</h2>
      {data.topCategories.map(c => (
        <div key={c.category.id}>
          {c.category.name} - {c.transactionCount} transações
        </div>
      ))}
    </div>
  );
}
```

## 🎨 Sistema de Cores

O projeto usa um sistema de cores consistente para categorias:

- `blue` - Azul
- `purple` - Roxo
- `pink` - Rosa
- `red` - Vermelho
- `orange` - Laranja
- `yellow` - Amarelo
- `green` - Verde

**Importante:** O backend deve salvar o **nome da cor** (ex: `"green"`), não valores hexadecimais.

## 🎯 Sistema de Ícones

Usa ícones do Lucide React salvos como identificadores kebab-case:

- `shopping-cart` - Carrinho de compras
- `coffee` - Café
- `home` - Casa
- `car` - Carro
- `utensils` - Utensílios
- `plane` - Avião
- E mais 10 opções...

**Importante:** O backend deve salvar o **identificador do ícone** (ex: `"shopping-cart"`), não emojis.

## 🔐 Autenticação

A autenticação é gerenciada via:
- **JWT tokens** armazenados no localStorage
- **Zustand store** para estado de autenticação
- **Apollo Auth Link** para enviar tokens nas requisições
- **AuthGuard** para proteção de rotas

## 🔄 Cache e Invalidação

React Query gerencia o cache automaticamente:
- Queries são invalidadas quando mutations relacionadas são executadas
- Toast notifications informam sucesso/erro de operações
- Estados de loading são gerenciados automaticamente

### Exemplo de Invalidação

```typescript
// Após criar transação, invalida:
queryClient.invalidateQueries({ queryKey: ["transactions"] });
queryClient.invalidateQueries({ queryKey: ["dashboard"] });
```

## 📝 TypeScript

Todos os tipos estão definidos em `src/types/index.ts`:

- `User`, `LoginInput`, `RegisterInput`
- `Transaction`, `CreateTransactionInput`, `UpdateTransactionInput`
- `Category`, `CreateCategoryInput`, `UpdateCategoryInput`
- `DashboardData`, `BalanceData`, `CategoryStats`
- E mais...

## 🧪 Próximos Passos
- [ ] Adicionar testes unitários
- [ ] Adicionar testes E2E
- [ ] Implementar exportação de dados (CSV, PDF)
- [ ] Adicionar gráficos e relatórios
- [ ] Implementar dark mode

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Envie um pull request

## 📄 Licença

MIT License

---

**Desenvolvido com ❤️ por Gabriela Liz**
