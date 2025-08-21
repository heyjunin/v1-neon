# Organizations Module

Este módulo fornece uma interface completa para gerenciar organizations com funcionalidades de CRUD e visualização flexível.

## Funcionalidades

### Visualização Dupla
- **Modo Grid**: Visualização em cards organizados em grade (padrão)
- **Modo Tabela**: Visualização em tabela com colunas organizadas
- **Persistência**: A preferência do usuário é salva no localStorage
- **Toggle Intuitivo**: Botões para alternar entre os modos

### Recursos
- ✅ Busca em tempo real
- ✅ Filtros por nome, descrição e slug
- ✅ Contador de resultados
- ✅ Estados de loading e erro
- ✅ Animações e transições suaves
- ✅ Responsivo (mobile-first)
- ✅ Acessibilidade com tooltips

## Componentes

### OrganizationsManager
Componente principal que gerencia o estado e coordena os subcomponentes.

```tsx
import { OrganizationsManager } from "@/components/organizations/organizations-manager";

export default function OrganizationsPage() {
  return <OrganizationsManager />;
}
```

### OrganizationsList
Lista principal com suporte a visualização dupla.

```tsx
import { OrganizationsList } from "@/components/organizations/lists/organizations-list";

<OrganizationsList
  onEdit={handleEdit}
  onCreate={handleCreate}
  onView={handleView}
/>
```

### Hooks

#### useViewMode
Hook personalizado para gerenciar o modo de visualização com persistência.

```tsx
import { useViewMode } from "@/components/organizations/hooks/use-view-mode";

const { viewMode, setViewMode, isLoaded } = useViewMode();
```

#### useOrganizationToast
Hook para exibir notificações relacionadas a organizations.

```tsx
import { useOrganizationToast } from "@/components/organizations/hooks/use-toast";

const { showSuccess, showError } = useOrganizationToast();
```

## Modos de Visualização

### Modo Grid
- Cards organizados em grade responsiva
- Informações principais visíveis
- Ações aparecem no hover
- Ideal para visualização rápida

### Modo Tabela
- Tabela organizada com colunas específicas
- Colunas: Organization, Descrição, Owner, Status, Criada em, Ações
- Melhor para comparação e análise de dados
- Ações sempre visíveis na última coluna
- Truncamento inteligente de texto longo

## Estrutura de Dados

```typescript
interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoUrl: string | null;
  ownerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  owner?: {
    id: string;
    email: string;
    fullName: string | null;
  };
}
```

## Personalização

### Estilos
Os componentes usam Tailwind CSS e podem ser personalizados através de classes:

```tsx
<OrganizationsList
  className="custom-styles"
  // ... outras props
/>
```

### Temas
O componente se adapta automaticamente ao tema claro/escuro usando as classes do Tailwind.

## Acessibilidade

- Tooltips nos botões de toggle
- Navegação por teclado
- Contraste adequado
- Estados de foco visíveis
- Textos alternativos para ícones
- Tabela semântica com headers apropriados

## Performance

- Lazy loading de dados
- Debounce na busca
- Memoização de filtros
- Transições otimizadas
- Persistência eficiente no localStorage

## Exemplo de Uso Completo

```tsx
"use client";

import { useState } from "react";
import { OrganizationsManager } from "@/components/organizations/organizations-manager";
import type { Organization } from "@/components/organizations/types";

export default function OrganizationsPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Gerenciar Organizations</h1>
      <OrganizationsManager />
    </div>
  );
}
```

## Roteamento

O módulo está configurado para funcionar com a rota:
```
/organizations
```

## Dependências

- `@v1/ui` - Componentes de UI (incluindo Table)
- `@v1/database` - Tipos e queries
- `lucide-react` - Ícones
- `next-international` - Internacionalização
