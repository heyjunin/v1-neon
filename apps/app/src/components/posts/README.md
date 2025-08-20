# Posts Components

Esta pasta contém todos os componentes relacionados ao gerenciamento de posts, organizados seguindo princípios DRY (Don't Repeat Yourself).

## Estrutura

```
posts/
├── components/           # Componentes reutilizáveis
│   ├── form-field.tsx   # Campo de formulário genérico
│   ├── notification.tsx # Componente de notificação unificado
│   └── index.ts         # Exportações dos componentes
├── hooks/               # Hooks customizados
│   ├── use-notification.ts # Hook para gerenciar notificações
│   └── index.ts         # Exportações dos hooks
├── post-form.tsx        # Formulário de criação/edição de posts
├── posts-list.tsx       # Lista de posts
├── posts-manager.tsx    # Componente principal que gerencia posts
├── use-form.ts          # Hook genérico para formulários
├── use-confirmation.ts  # Hook para diálogos de confirmação
├── validations.ts       # Funções de validação
├── types.ts             # Tipos TypeScript
└── index.ts             # Exportações principais
```

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

### useForm
Hook genérico para formulários com validação:

```typescript
import { useForm } from './use-form';

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

Funções de validação reutilizáveis em `validations.ts`:

- `postValidation`: Validação específica para posts
- `requiredField`: Validação de campo obrigatório
- `minLength`: Validação de comprimento mínimo
- `maxLength`: Validação de comprimento máximo

## Princípios DRY Aplicados

1. **Componente de Notificação Unificado**: Elimina duplicação entre `Notification` e `InlineNotification`
2. **FormField Reutilizável**: Componente genérico para campos de formulário
3. **Hooks Centralizados**: Lógica reutilizável em hooks customizados
4. **Tipos Organizados**: Todos os tipos em um local centralizado
5. **Validações Reutilizáveis**: Funções de validação genéricas
6. **Estrutura Modular**: Componentes organizados em pastas por responsabilidade

## Como Usar

```typescript
import {
  PostForm,
  PostsList,
  PostsManager,
  PostNotification,
  FormField,
  useNotification,
  useForm,
  type Post,
  type PostFormData,
} from './posts';
```
