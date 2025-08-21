# Utils Package

Este pacote contém utilitários compartilhados para o projeto V1.

## Date Utils

O módulo de datas fornece funções utilitárias para manipulação e formatação de datas de forma consistente em todo o projeto.

### Instalação

```bash
# O pacote já está incluído no workspace
import { formatDate, formatRelativeDate, areDatesEqual } from "@v1/utils";
```

### Funções Disponíveis

#### `formatDate(date, options?)`

Formata uma data para o formato brasileiro (dd/mm/yyyy).

**Parâmetros:**
- `date`: `string | Date | null | undefined` - Data a ser formatada
- `options`: Objeto opcional com:
  - `includeTime`: `boolean` - Incluir hora na formatação (padrão: `false`)
  - `fallback`: `string` - Texto de fallback para datas inválidas (padrão: "Data não disponível")
  - `locale`: `string` - Locale para formatação (padrão: "pt-BR")

**Retorna:** `string`

**Exemplo:**
```typescript
import { formatDate } from "@v1/utils";

// Formatação básica
formatDate("2024-01-15T10:30:00Z"); // "15/01/2024"

// Com hora
formatDate("2024-01-15T10:30:00Z", { includeTime: true }); // "15/01/2024 10:30"

// Com fallback personalizado
formatDate(null, { fallback: "Data não informada" }); // "Data não informada"
```

#### `formatRelativeDate(date, options?)`

Formata uma data para exibição relativa (ex: "há 2 horas", "ontem").

**Parâmetros:**
- `date`: `string | Date | null | undefined` - Data a ser formatada
- `options`: Objeto opcional com:
  - `fallback`: `string` - Texto de fallback para datas inválidas
  - `locale`: `string` - Locale para formatação

**Retorna:** `string`

**Exemplo:**
```typescript
import { formatRelativeDate } from "@v1/utils";

const agora = new Date();
const umaHoraAtras = new Date(agora.getTime() - 60 * 60 * 1000);

formatRelativeDate(umaHoraAtras); // "há 1 hora"
formatRelativeDate(null); // "Data não disponível"
```

#### `areDatesEqual(date1, date2)`

Compara duas datas, retornando true se forem iguais.

**Parâmetros:**
- `date1`: `string | Date | null | undefined` - Primeira data
- `date2`: `string | Date | null | undefined` - Segunda data

**Retorna:** `boolean`

**Exemplo:**
```typescript
import { areDatesEqual } from "@v1/utils";

const data1 = "2024-01-15T10:30:00Z";
const data2 = "2024-01-15T10:30:00Z";

areDatesEqual(data1, data2); // true
areDatesEqual(data1, null); // false
```

#### `isValidDate(date)`

Verifica se uma data é válida.

**Parâmetros:**
- `date`: `string | Date | null | undefined` - Data a ser verificada

**Retorna:** `boolean`

**Exemplo:**
```typescript
import { isValidDate } from "@v1/utils";

isValidDate("2024-01-15T10:30:00Z"); // true
isValidDate("data-invalida"); // false
isValidDate(null); // false
```

#### `parseDate(date)`

Converte uma data (string, Date ou null/undefined) para um objeto Date.

**Parâmetros:**
- `date`: `string | Date | null | undefined` - Data a ser convertida

**Retorna:** `Date | null`

**Exemplo:**
```typescript
import { parseDate } from "@v1/utils";

parseDate("2024-01-15T10:30:00Z"); // Date object
parseDate(null); // null
parseDate("data-invalida"); // null
```

#### `getCurrentDate(options?)`

Obtém a data atual formatada.

**Parâmetros:**
- `options`: Objeto opcional com:
  - `includeTime`: `boolean` - Incluir hora na formatação
  - `locale`: `string` - Locale para formatação

**Retorna:** `string`

**Exemplo:**
```typescript
import { getCurrentDate } from "@v1/utils";

getCurrentDate(); // "15/01/2024"
getCurrentDate({ includeTime: true }); // "15/01/2024 14:30"
```

#### `toISOString(date)`

Converte uma data para timestamp ISO.

**Parâmetros:**
- `date`: `string | Date | null | undefined` - Data a ser convertida

**Retorna:** `string | null`

**Exemplo:**
```typescript
import { toISOString } from "@v1/utils";

toISOString("2024-01-15T10:30:00Z"); // "2024-01-15T10:30:00.000Z"
toISOString(null); // null
```

### Casos de Uso Comuns

#### 1. Componentes React

```typescript
import { formatDate, areDatesEqual } from "@v1/utils";

function PostDetail({ post }) {
  const foiAtualizado = !areDatesEqual(post.createdAt, post.updatedAt);
  
  return (
    <div>
      <p>Criado em: {formatDate(post.createdAt, { includeTime: true })}</p>
      {foiAtualizado && (
        <p>Atualizado em: {formatDate(post.updatedAt, { includeTime: true })}</p>
      )}
    </div>
  );
}
```

#### 2. Listas e Tabelas

```typescript
import { formatDate, formatRelativeDate } from "@v1/utils";

function PostsList({ posts }) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>Criado: {formatDate(post.createdAt)}</p>
          <p>Última atualização: {formatRelativeDate(post.updatedAt)}</p>
        </li>
      ))}
    </ul>
  );
}
```

#### 3. Formulários

```typescript
import { isValidDate, toISOString } from "@v1/utils";

function EventForm({ onSubmit }) {
  const handleSubmit = (formData) => {
    // Validar datas antes de enviar
    if (!isValidDate(formData.startDate)) {
      alert("Data de início inválida");
      return;
    }
    
    // Converter para ISO
    const dataToSend = {
      ...formData,
      startDate: toISOString(formData.startDate),
      endDate: toISOString(formData.endDate)
    };
    
    onSubmit(dataToSend);
  };
}
```

### Vantagens

1. **Consistência**: Todas as datas são formatadas da mesma forma em todo o projeto
2. **Robustez**: Trata automaticamente casos de datas inválidas ou null
3. **Flexibilidade**: Suporta diferentes opções de formatação
4. **Type Safety**: Totalmente tipado com TypeScript
5. **Reutilização**: Evita duplicação de código de formatação de datas

### Migração

Para migrar código existente que usa formatação manual de datas:

**Antes:**
```typescript
const formatDate = (date) => {
  if (!date) return "Data não disponível";
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
};
```

**Depois:**
```typescript
import { formatDate } from "@v1/utils";

// Usar diretamente
formatDate(date);
```
