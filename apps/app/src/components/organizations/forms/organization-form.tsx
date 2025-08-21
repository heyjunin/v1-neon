"use client";

import { useCreateOrganization, useUpdateOrganization } from "@/lib/trpc";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Textarea } from "@v1/ui/textarea";
import { Loader2, Save, X } from "lucide-react";
import { useState } from "react";
import type { Organization, OrganizationFormData } from "../types";

interface OrganizationFormProps {
  organization?: Organization | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function OrganizationForm({
  organization,
  isOpen,
  onClose,
  onSuccess,
}: OrganizationFormProps) {
  const createOrganizationMutation = useCreateOrganization();
  const updateOrganizationMutation = useUpdateOrganization();

  const isEditing = !!organization;
  const isLoading =
    createOrganizationMutation.isPending ||
    updateOrganizationMutation.isPending;

  const [formData, setFormData] = useState<OrganizationFormData>({
    name: organization?.name || "",
    slug: organization?.slug || "",
    description: organization?.description || "",
    logoUrl: organization?.logoUrl || "",
  });

  const [errors, setErrors] = useState<Partial<OrganizationFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<OrganizationFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug é obrigatório";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug =
        "Slug deve conter apenas letras minúsculas, números e hífens";
    }

    if (formData.logoUrl && !isValidUrl(formData.logoUrl)) {
      newErrors.logoUrl = "URL inválida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (isEditing && organization) {
        await updateOrganizationMutation.mutateAsync({
          id: organization.id,
          ...formData,
        });
      } else {
        await createOrganizationMutation.mutateAsync(formData);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error saving organization:", error);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Organization" : "Criar Nova Organization"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edite as informações da sua organization abaixo."
              : "Preencha as informações para criar uma nova organization."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Digite o nome da organization..."
              disabled={isLoading}
              maxLength={100}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value.toLowerCase() })
              }
              placeholder="digite-o-slug-da-organization"
              disabled={isLoading}
              maxLength={50}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug}</p>
            )}
            <p className="text-xs text-gray-500">
              O slug será usado na URL da organization
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Digite uma descrição para a organization..."
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">URL do Logo</Label>
            <Input
              id="logoUrl"
              type="url"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              placeholder="https://exemplo.com/logo.png"
              disabled={isLoading}
            />
            {errors.logoUrl && (
              <p className="text-sm text-red-500">{errors.logoUrl}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? "Atualizar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
