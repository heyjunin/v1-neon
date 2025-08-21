"use client";

import { useCrudManager, useActionToast } from "@v1/ui";
import { ModuleForm } from "./components";
import { ModuleList } from "./components";
import type { Module } from "./types";
import { ModuleView } from "./components";

export function ModuleManager() {
  const {
    isFormOpen,
    editingItem: editingModule,
    viewingItem: viewingModule,
    handleCreate,
    handleEdit,
    handleView,
    handleCloseForm,
    handleCloseView,
  } = useCrudManager<Module>();
  
  const { showSuccess } = useActionToast();

  const handleFormSuccess = () => {
    showSuccess(
      editingModule ? "Item atualizado com sucesso!" : "Item criado com sucesso!",
    );
  };

  return (
    <div className="space-y-6">
      <ModuleList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
      />

      <ModuleForm
        item={editingModule}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />

      {viewingModule && (
        <ModuleView
          item={viewingModule}
          isOpen={!!viewingModule}
          onClose={handleCloseView}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
