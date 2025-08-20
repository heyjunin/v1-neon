# Posts Components

Esta pasta contém todos os componentes relacionados ao gerenciamento de posts, organizados seguindo princípios DRY (Don't Repeat Yourself) e com uma estrutura modular bem definida.

## Estrutura Organizada

```
posts/
├── components/           # Componentes reutilizáveis
│   ├── dialogs/         # Diálogos modais
│   │   ├── confirmation-dialog.tsx
│   │   └── index.ts
│   ├── form-field.tsx   # Campo de formulário genérico
│   ├── notification.tsx # Componente de notificação unificado
│   └── index.ts         # Exportações dos componentes
├── forms/               # Formulários
│   ├── post-form.tsx    # Formulário de criação/edição de posts
│   └── index.ts         # Exportações dos formulários
├── hooks/               # Hooks customizados
│   ├── use-notification.ts # Hook para gerenciar notificações
│   ├── use-confirmation.ts # Hook para diálogos de confirmação
│   └── index.ts         # Exportações dos hooks
├── lists/               # Componentes de listagem
│   ├── posts-list.tsx   # Lista de posts
│   └── index.ts         # Exportações das listas
├── utils/               # Utilitários e lógica reutilizável
│   ├── use-form.ts      # Hook genérico para formulários
│   ├── validations.ts   # Funções de validação
│   └── index.ts         # Exportações dos utilitários
├── posts-manager.tsx    # Componente principal que gerencia posts
├── types.ts             # Tipos TypeScript centralizados
├── index.ts             # Exportações principais
└── README.md            # Esta documentação
```

## Organização por Responsabilidade

### 📁 components/
Componentes reutilizáveis e genéricos:

- **dialogs/**: Diálogos modais reutilizáveis
- **form-field.tsx**: Campo de formulário genérico
- **notification.tsx**: Componente de notificação unificado

### 📁 forms/
Formulários específicos da aplicação:

- **post-form.tsx**: Formulário de criação/edição de posts

### 📁 hooks/
Hooks customizados para lógica reutilizável:

- **use-notification.ts**: Gerenciamento de notificações
- **use-confirmation.ts**: Gerenciamento de diálogos de confirmação

### 📁 lists/
Componentes de listagem e exibição:

- **posts-list.tsx**: Lista de posts com busca e ações

### 📁 utils/
Utilitários e lógica reutilizável:

- **use-form.ts**: Hook genérico para formulários
- **validations.ts**: Funções de validação reutilizáveis

## Componentes Principais

### PostNotification
Componente unificado para notificações que pode ser usado como:
- **Inline**: Dentro do conteúdo da página
- **Toast**: Notificação flutuante no canto da tela

```typescript
import { PostNotification } from './components/notification';

// Como toast (auto-close)
<PostNotification
  type="success"
  message="Post criado com sucesso!"
  onClose={hideNotification}
  variant="toast"
  duration={5000}
/>

// Como inline
<PostNotification
  type="error"
  message="Erro ao criar post"
  onClose={hideNotification}
  variant="inline"
/>
```

### FormField
Componente reutilizável para campos de formulário que suporta:
- Input de texto
- Textarea
- Validação
- Contadores de caracteres
- Estados de erro

```typescript
import { FormField } from './components/form-field';

<FormField
  id="title"
  label="Título"
  value={values.title}
  onChange={(value) => setValue('title', value)}
  error={errors.title}
  required
  maxLength={100}
  minLength={3}
  placeholder="Digite o título..."
/>
```

### ConfirmationDialog
Diálogo de confirmação reutilizável com diferentes tipos de ação:

```typescript
import { ConfirmationDialog } from './components/dialogs';

<ConfirmationDialog
  isOpen={isOpen}
  onClose={onClose}
  onConfirm={onConfirm}
  title="Excluir Post"
  description="Tem certeza que deseja excluir este post?"
  actionType="delete"
  isLoading={isLoading}
/>
```

## Hooks

### useNotification
Hook para gerenciar notificações com métodos convenientes:

```typescript
import { useNotification } from './hooks/use-notification';

const { notification, showSuccess, showError, hideNotification } = useNotification();

// Uso
showSuccess('Post criado com sucesso!');
showError('Erro ao criar post');
```

### useConfirmation
Hook para gerenciar diálogos de confirmação:

```typescript
import { useConfirmation } from './hooks/use-confirmation';

const { confirmation, openConfirmation, closeConfirmation, confirmAction } = useConfirmation();

// Uso
openConfirmation(post.id, post.title, 'delete');
await confirmAction(handleDelete);
```

### useForm
Hook genérico para formulários com validação:

```typescript
import { useForm } from './utils';

const { values, errors, setValue, handleSubmit } = useForm({
  initialValues: { title: '', content: '' },
  onSubmit: async (values) => {
    // Lógica de submissão
  },
  validation: postValidation,
  onSuccess: () => {
    // Callback de sucesso
  },
});
```

## Tipos

Todos os tipos estão centralizados em `types.ts`:

- `Post`: Interface do post
- `PostFormData`: Dados do formulário
- `NotificationType`: Tipo de notificação
- `FormState`, `UseFormOptions`, `UseFormReturn`: Tipos para formulários

## Validações

Funções de validação reutilizáveis em `utils/validations.ts`:

- `postValidation`: Validação específica para posts
- `requiredField`: Validação de campo obrigatório
- `minLength`: Validação de comprimento mínimo
- `maxLength`: Validação de comprimento máximo

## Princípios DRY Aplicados

1. **Estrutura Modular**: Organização por responsabilidade em pastas específicas
2. **Componente de Notificação Unificado**: Elimina duplicação entre diferentes tipos de notificação
3. **FormField Reutilizável**: Componente genérico para campos de formulário
4. **Hooks Centralizados**: Lógica reutilizável em hooks customizados
5. **Tipos Organizados**: Todos os tipos em um local centralizado
6. **Validações Reutilizáveis**: Funções de validação genéricas
7. **Diálogos Reutilizáveis**: Componentes de diálogo genéricos

## Como Usar

```typescript
// Importação principal
import { PostsManager } from './posts';

// Ou importações específicas
import {
  PostForm,
  PostsList,
  PostNotification,
  FormField,
  ConfirmationDialog,
  useNotification,
  useConfirmation,
  useForm,
  type Post,
  type PostFormData,
} from './posts';
```

## Benefícios da Nova Estrutura

1. **Manutenibilidade**: Código organizado por responsabilidade
2. **Reutilização**: Componentes e hooks genéricos
3. **Escalabilidade**: Fácil adição de novos componentes
4. **Testabilidade**: Componentes isolados e testáveis
5. **Legibilidade**: Estrutura clara e intuitiva
6. **Performance**: Imports específicos reduzem bundle size
