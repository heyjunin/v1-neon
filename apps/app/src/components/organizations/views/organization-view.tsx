"use client";

import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { formatDate } from "@v1/utils";
import { Building2, Calendar, Edit, User } from "lucide-react";
import type { Organization } from "../types";

interface OrganizationViewProps {
  organization: Organization;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (organization: Organization) => void;
}

export function OrganizationView({
  organization,
  isOpen,
  onClose,
  onEdit,
}: OrganizationViewProps) {
  const handleEdit = () => {
    onEdit(organization);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-gray-500" />
            <DialogTitle>{organization.name}</DialogTitle>
          </div>
          <DialogDescription>Detalhes da organization</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Organization Info */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Informações Gerais</h3>
              <Badge variant={organization.isActive ? "default" : "secondary"}>
                {organization.isActive ? "Ativa" : "Inativa"}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Slug
                </label>
                <p className="text-sm text-gray-900 font-mono bg-gray-50 px-2 py-1 rounded">
                  {organization.slug}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="text-sm text-gray-900">
                  {organization.isActive ? "Ativa" : "Inativa"}
                </p>
              </div>
            </div>

            {organization.description && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Descrição
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {organization.description}
                </p>
              </div>
            )}

            {organization.logoUrl && (
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Logo
                </label>
                <div className="mt-1">
                  <img
                    src={organization.logoUrl}
                    alt={`Logo da ${organization.name}`}
                    className="h-16 w-16 object-cover rounded border"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Owner Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Proprietário</h3>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <User className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {organization.owner?.fullName || "Nome não informado"}
                </p>
                <p className="text-sm text-gray-500">
                  {organization.owner?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Timestamps */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Datas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Criada em</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(organization.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Atualizada em
                  </p>
                  <p className="text-sm text-gray-900">
                    {formatDate(organization.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Fechar
            </Button>
            <Button onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
