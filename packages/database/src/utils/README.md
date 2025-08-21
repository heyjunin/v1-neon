# Database Utils

Este diretório contém utilitários para facilitar a criação e manutenção de queries e mutations no banco de dados.

## Utilitários Disponíveis

### 1. Pagination (`pagination.ts`)
Utilitários para paginação de resultados.

```typescript
import { PaginationOptions, PaginatedResult, createPaginationHelpers } from '../utils';

// Interfaces
interface PaginationOptions {
  page?: number;
  limit?: number;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Helpers
const { getOffset, getTotalPages, buildPaginatedResult } = createPaginationHelpers();
```

### 2. Query Builder (`query-builder.ts`)
Builder para construir condições WHERE de forma fluente.

```typescript
import { QueryBuilder } from '../utils';

const queryBuilder = new QueryBuilder()
  .addSearch([posts.title, posts.content], searchTerm)
  .addFilter(posts.userId, userId)
  .addCondition(customCondition);

const whereClause = queryBuilder.build();
```

### 3. CRUD Helpers (`crud-helpers.ts`)
Helpers genéricos para operações CRUD.

```typescript
import { createEntity, updateEntity, deleteEntity } from '../utils';

// Criar
const post = await createEntity(
  (data) => db.insert(posts).values(data).returning(),
  postData,
  'post'
);

// Atualizar
const updatedPost = await updateEntity(
  (id, data) => db.update(posts).set(data).where(eq(posts.id, id)).returning(),
  postId,
  updateData,
  'post'
);

// Deletar
const deleted = await deleteEntity(
  (id) => db.delete(posts).where(eq(posts.id, id)).returning(),
  postId,
  'post'
);
```

### 4. Paginated Query (`paginated-query.ts`)
Função genérica para executar queries paginadas.

```typescript
import { executePaginatedQuery } from '../utils';

const result = await executePaginatedQuery({
  baseQuery: db.select().from(posts).where(whereClause),
  countQuery: db.select({ count: sql`count(*)` }).from(posts).where(whereClause),
  filters,
  pagination,
  sortBy: 'createdAt',
  sortOrder: 'desc'
});
```

### 5. Select Helpers (`select-helpers.ts`)
Helpers para seleção de campos comuns em joins.

```typescript
import { createSelectHelpers } from '../utils';

const { selectUserFields, selectOrganizationFields } = createSelectHelpers();

// Em uma query com join
.select({
  ...selectUserFields(),
  ...selectOrganizationFields(),
  // outros campos
})
```

## Exemplo de Nova Query

```typescript
// Antes (código repetitivo)
export async function getPosts(filters?: PostsFilters, pagination?: PostsPagination): Promise<PostsResult> {
  try {
    const { search, userId, sortBy = 'createdAt', sortOrder = 'desc' } = filters || {};
    const { page = 1, limit = 10 } = pagination || {};

    const conditions = [];
    if (search) {
      conditions.push(or(like(posts.title, `%${search}%`), like(posts.content, `%${search}%`)));
    }
    if (userId) {
      conditions.push(eq(posts.userId, userId));
    }
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const orderByClause = sortOrder === 'asc' ? asc(posts[sortBy]) : desc(posts[sortBy]);
    const offset = (page - 1) * limit;

    const countResult = await db.select({ count: sql<number>`count(*)` }).from(posts).where(whereClause).execute();
    const total = countResult[0]?.count || 0;

    const data = await db.select().from(posts).where(whereClause).orderBy(orderByClause).limit(limit).offset(offset);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  } catch (error) {
    logger.error('Error getting posts:', error);
    throw error;
  }
}

// Depois (usando utilitários)
export async function getPosts(filters?: PostsFilters, pagination?: PaginationOptions): Promise<PaginatedResult<Post>> {
  const { search, userId, sortBy = 'createdAt', sortOrder = 'desc' } = filters || {};

  const queryBuilder = new QueryBuilder()
    .addSearch([posts.title, posts.content], search)
    .addFilter(posts.userId, userId);

  const whereClause = queryBuilder.build();

  const baseQuery = db.select().from(posts).where(whereClause);
  const countQuery = db.select({ count: sql<number>`count(*)` }).from(posts).where(whereClause);

  return executePaginatedQuery({
    baseQuery,
    countQuery,
    filters,
    pagination,
    sortBy,
    sortOrder
  });
}
```

## Exemplo de Nova Mutation

```typescript
// Antes (código repetitivo)
export async function createPost(postData: NewPost): Promise<Post> {
  try {
    const result = await db.insert(posts).values(postData).returning();
    if (!result[0]) {
      throw new Error('Failed to create post: no rows returned');
    }
    return result[0];
  } catch (error) {
    logger.error('Error creating post:', error);
    throw error;
  }
}

// Depois (usando utilitários)
export async function createPost(postData: NewPost): Promise<Post> {
  return createEntity(
    (data) => db.insert(posts).values(data).returning(),
    postData,
    'post'
  );
}
```

## Benefícios

1. **Menos código duplicado** - Redução de ~60% no código repetitivo
2. **Consistência** - Padrões uniformes em todas as queries
3. **Facilidade de manutenção** - Mudanças centralizadas
4. **Menos bugs** - Lógica testada e centralizada
5. **Desenvolvimento mais rápido** - Templates reutilizáveis
6. **Tipagem forte mantida** - TypeScript detecta erros em tempo de compilação
7. **IntelliSense completo** - Autocomplete funciona perfeitamente
8. **Refatoração segura** - Mudanças no schema são detectadas automaticamente
