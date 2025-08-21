"use client";

import { useOrganizations } from "@/lib/trpc";
import { Badge } from "@v1/ui/badge";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import { Building2, Edit, Eye, Plus, Search, User } from "lucide-react";
import React, { useState } from "react";
import type { Organization } from "../types";

interface OrganizationsListProps {
  onEdit: (organization: Organization) => void;
  onCreate: () => void;
  onView?: (organization: Organization) => void;
}

export function OrganizationsList({
  onEdit,
  onCreate,
  onView,
}: OrganizationsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: organizations, isLoading, error } = useOrganizations();

  // Ensure organizations is always an array and handle loading/error states
  const organizationsArray = React.useMemo(() => {
    if (!organizations) return [];

    // If organizations is an object with data property (paginated response)
    if (
      typeof organizations === "object" &&
      "data" in organizations &&
      Array.isArray(organizations.data)
    ) {
      return organizations.data;
    }

    // If organizations is already an array
    if (Array.isArray(organizations)) {
      return organizations;
    }

    // Fallback to empty array
    return [];
  }, [organizations]);

  const filteredOrganizations = organizationsArray.filter(
    (organization: Organization) => {
      if (!organization || typeof organization !== "object") return false;

      const name = organization.name || "";
      const description = organization.description || "";
      const slug = organization.slug || "";

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    },
  );

  const handleViewClick = (organization: Organization) => {
    if (onView) {
      onView(organization);
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Organizations</h2>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Organization
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            Erro ao carregar organizations:{" "}
            {error.message || "Erro desconhecido"}
          </div>
          <Button onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Organizations</h2>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Organization
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar organizations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="text-gray-500">Carregando organizations...</div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredOrganizations.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma organization encontrada
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? "Tente ajustar sua busca."
              : "Crie sua primeira organization para começar."}
          </p>
          {!searchTerm && (
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Organization
            </Button>
          )}
        </div>
      )}

      {/* Organizations grid */}
      {!isLoading && filteredOrganizations.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrganizations.map((organization: Organization) => (
            <Card
              key={organization.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    <CardTitle className="text-lg">
                      {organization.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={organization.isActive ? "default" : "secondary"}
                  >
                    {organization.isActive ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-gray-600">
                  {organization.slug}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                {organization.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {organization.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <User className="h-4 w-4" />
                    <span>
                      Owner:{" "}
                      {organization.owner?.fullName ||
                        organization.owner?.email}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewClick(organization)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(organization)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
