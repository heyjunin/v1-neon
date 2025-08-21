"use client";

import { useActionToast, useCrudManager } from "@v1/ui";
import { OrganizationForm } from "./forms";
import { OrganizationsList } from "./lists";
import type { Organization } from "./types";
import { OrganizationView } from "./views";

export function OrganizationsManager() {
  const {
    isFormOpen,
    editingItem: editingOrganization,
    viewingItem: viewingOrganization,
    handleCreate,
    handleEdit,
    handleView,
    handleCloseForm,
    handleCloseView,
  } = useCrudManager<Organization>();
  
  const { showSuccess } = useActionToast();

  const handleFormSuccess = () => {
    showSuccess(
      editingOrganization
        ? "Organization atualizada com sucesso!"
        : "Organization criada com sucesso!",
    );
  };

  return (
    <div className="space-y-6">
      {/* Organizations List */}
      <OrganizationsList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
      />

      {/* Organization Form */}
      <OrganizationForm
        organization={editingOrganization}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />

      {/* Organization View */}
      {viewingOrganization && (
        <OrganizationView
          organization={viewingOrganization}
          isOpen={!!viewingOrganization}
          onClose={handleCloseView}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
