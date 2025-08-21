# Template de Módulo CRUD

Este template fornece uma estrutura padronizada para criar novos módulos CRUD seguindo os padrões estabelecidos no projeto.

## Estrutura do Template

```
module-template/
├── components/
│   ├── module-list.tsx      # Lista específica do módulo
│   ├── module-form.tsx      # Formulário específico
│   ├── module-view.tsx      # Visualização específica
│   └── index.ts
├── hooks/
│   ├── use-module.ts        # Hooks específicos do módulo
│   └── index.ts
├── types.ts                 # Tipos específicos do módulo
├── module-manager.tsx       # Manager principal
└── README.md
```

## Como Usar

### 1. Copiar o Template

```bash
cp -r apps/app/src/components/module-template apps/app/src/components/your-module
```

### 2. Renomear Arquivos

```bash
cd apps/app/src/components/your-module
mv module-manager.tsx your-module-manager.tsx
mv components/module-list.tsx components/your-module-list.tsx
mv components/module-form.tsx components/your-module-form.tsx
mv components/module-view.tsx components/your-module-view.tsx
```

### 3. Atualizar Imports e Nomes

Substitua todas as ocorrências de:
- `Module` → `YourModule`
- `module` → `yourModule`
- `Module` → `YourModule` (em tipos)

### 4. Implementar Funcionalidades Específicas

- **types.ts**: Definir interface da entidade
- **hooks/use-module.ts**: Hooks específicos do módulo
- **components/**: Componentes específicos da UI

## Exemplo de Implementação

### types.ts
```typescript
export interface YourModule {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface YourModuleFormData {
  name: string;
  description?: string;
}
```

### your-module-manager.tsx
```typescript
"use client";

import { useCrudManager, useActionToast } from "@v1/ui";
import { YourModuleForm } from "./components";
import { YourModuleList } from "./components";
import type { YourModule } from "./types";
import { YourModuleView } from "./components";

export function YourModuleManager() {
  const {
    isFormOpen,
    editingItem: editingYourModule,
    viewingItem: viewingYourModule,
    handleCreate,
    handleEdit,
    handleView,
    handleCloseForm,
    handleCloseView,
  } = useCrudManager<YourModule>();
  
  const { showSuccess } = useActionToast();

  const handleFormSuccess = () => {
    showSuccess(
      editingYourModule ? "Item atualizado com sucesso!" : "Item criado com sucesso!",
    );
  };

  return (
    <div className="space-y-6">
      <YourModuleList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
      />

      <YourModuleForm
        item={editingYourModule}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />

      {viewingYourModule && (
        <YourModuleView
          item={viewingYourModule}
          isOpen={!!viewingYourModule}
          onClose={handleCloseView}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
```

### components/your-module-list.tsx
```typescript
"use client";

import { useYourModule, useDeleteYourModule } from "@/lib/trpc";
import { 
  useActionToast, 
  useConfirmation, 
  useViewMode,
  ConfirmationDialog,
  ViewToggle,
  SearchBar
} from "@v1/ui";
import type { YourModule } from "../types";

interface YourModuleListProps {
  onEdit: (item: YourModule) => void;
  onCreate: () => void;
  onView?: (item: YourModule) => void;
}

export function YourModuleList({ onEdit, onCreate, onView }: YourModuleListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { viewMode, setViewMode, isLoaded } = useViewMode("your-module-view-mode");
  const { data: items, isLoading, error, refetch } = useYourModule();
  const deleteMutation = useDeleteYourModule();
  const { showSuccess, showError } = useActionToast();
  const { confirmation, openConfirmation, closeConfirmation, confirmAction } =
    useConfirmation();

  // Implementar lógica específica do módulo...

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Modules</h2>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Item
        </Button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <SearchBar
          placeholder="Buscar items..."
          value={searchTerm}
          onChange={setSearchTerm}
          className="flex-1"
        />
        
        <ViewToggle
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          isLoaded={isLoaded}
        />
      </div>

      {/* Implementar visualizações grid e tabela */}
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmDelete}
        title="Excluir Item"
        description={`Tem certeza que deseja excluir o item "${confirmation.itemTitle}"?`}
        actionType="delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
```

## Hooks Globais Disponíveis

### useCrudManager
Gerencia o estado CRUD básico (form, view, edit).

### useViewMode
Gerencia o modo de visualização (grid/table) com persistência.

### useConfirmation
Gerencia modais de confirmação para ações destrutivas.

### useActionToast
Fornece notificações toast padronizadas.

## Componentes Globais Disponíveis

### ConfirmationDialog
Modal de confirmação reutilizável.

### ViewToggle
Toggle entre visualizações grid e tabela.

### SearchBar
Barra de busca padronizada.

## Padrões a Seguir

1. **Nomenclatura**: Use nomes descritivos e consistentes
2. **Tipos**: Defina interfaces claras para suas entidades
3. **Hooks**: Reutilize hooks globais quando possível
4. **Componentes**: Use componentes globais para funcionalidades comuns
5. **Error Handling**: Implemente tratamento de erros consistente
6. **Loading States**: Forneça feedback visual durante operações
7. **Responsividade**: Mantenha design responsivo
8. **Acessibilidade**: Siga boas práticas de acessibilidade

## Benefícios

- **Consistência**: Padrões uniformes em toda aplicação
- **Produtividade**: Criação rápida de novos módulos
- **Manutenibilidade**: Código organizado e reutilizável
- **Qualidade**: Padrões testados e validados
- **Escalabilidade**: Fácil adição de novos módulos
