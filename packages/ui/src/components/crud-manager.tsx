"use client";

import { useActionToast } from "../hooks/use-action-toast";
import type { BaseEntity } from "../hooks/use-crud-manager";
import type { CrudManagerProps } from "../types/crud";

export function CrudManager<T extends BaseEntity>({
  entity,
  listComponent: ListComponent,
  formComponent: FormComponent,
  viewComponent: ViewComponent,
  onFormSuccess,
}: CrudManagerProps<T>) {
  const { showSuccess } = useActionToast();

  const handleFormSuccess = () => {
    const message = onFormSuccess 
      ? onFormSuccess(entity)
      : `${entity} salvo com sucesso!`;
    showSuccess(message);
  };

  return (
    <div className="space-y-6">
      {/* List Component */}
      <ListComponent
        items={[]}
        loading={false}
        searchTerm=""
        viewMode="grid"
        onSearchChange={() => {}}
        onViewModeChange={() => {}}
        actions={{
          onEdit: () => {},
          onCreate: () => {},
        }}
      />

      {/* Form Component */}
      <FormComponent
        item={null}
        isOpen={false}
        onClose={() => {}}
        onSuccess={handleFormSuccess}
      />

      {/* View Component */}
      {ViewComponent && (
        <ViewComponent
          item={{} as T}
          isOpen={false}
          onClose={() => {}}
          onEdit={() => {}}
        />
      )}
    </div>
  );
}
