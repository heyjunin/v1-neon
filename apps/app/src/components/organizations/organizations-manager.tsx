"use client";

import { useState } from "react";
import { OrganizationForm } from "./forms";
import { useOrganizationToast } from "./hooks/use-toast";
import { OrganizationsList } from "./lists";
import type { Organization } from "./types";
import { OrganizationView } from "./views";

export function OrganizationsManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrganization, setEditingOrganization] =
    useState<Organization | null>(null);
  const [viewingOrganization, setViewingOrganization] =
    useState<Organization | null>(null);
  const { showSuccess } = useOrganizationToast();

  const handleCreate = () => {
    setEditingOrganization(null);
    setIsFormOpen(true);
  };

  const handleEdit = (organization: Organization) => {
    setEditingOrganization(organization);
    setIsFormOpen(true);
  };

  const handleView = (organization: Organization) => {
    setViewingOrganization(organization);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrganization(null);
  };

  const handleCloseView = () => {
    setViewingOrganization(null);
  };

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
