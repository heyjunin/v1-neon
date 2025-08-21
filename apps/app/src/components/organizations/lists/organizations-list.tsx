"use client";

import { useDeleteOrganization, useOrganizations } from "@/lib/trpc";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import {
  Building2,
  Calendar,
  Edit,
  Eye,
  Grid3X3,
  List,
  Loader2,
  Plus,
  Search,
  Trash2,
  User
} from "lucide-react";
import React, { useState } from "react";
import { ConfirmationDialog } from "../components/dialogs";
import { useConfirmation } from "../hooks/use-confirmation";
import { useOrganizationToast } from "../hooks/use-toast";
import { useViewMode } from "../hooks/use-view-mode";
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
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { viewMode, setViewMode, isLoaded } = useViewMode();
  const { data: organizations, isLoading, error, refetch } = useOrganizations();
  const deleteOrganizationMutation = useDeleteOrganization();
  const { showSuccess, showError } = useOrganizationToast();
  const { confirmation, openConfirmation, closeConfirmation, confirmAction } =
    useConfirmation();

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

  const handleDelete = async (id: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [id]: true }));
      await deleteOrganizationMutation.mutateAsync({ id });
      await refetch();
      showSuccess("Organization excluída com sucesso!");
    } catch (error) {
      showError("Erro ao excluir organization. Tente novamente.");
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteClick = (organization: Organization) => {
    openConfirmation(organization.id, organization.name, "delete");
  };

  const handleConfirmDelete = async () => {
    await confirmAction(handleDelete);
  };

  const isDeleting = loadingStates[confirmation.itemId || ""] || false;

  const handleViewClick = (organization: Organization) => {
    if (onView) {
      onView(organization);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
          <Button onClick={() => refetch()}>
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

      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar organizations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* View Mode Toggle */}
        {isLoaded && (
          <div className="flex items-center border rounded-md bg-background">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none border-r"
              title="Visualização em grade"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
              title="Visualização em tabela"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      {!isLoading && filteredOrganizations.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {filteredOrganizations.length} organization{filteredOrganizations.length !== 1 ? 's' : ''} encontrada{filteredOrganizations.length !== 1 ? 's' : ''}
          {searchTerm && ` para "${searchTerm}"`}
        </div>
      )}

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

      {/* Organizations Grid View */}
      {!isLoading && filteredOrganizations.length > 0 && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrganizations.map((organization: Organization) => (
            <Card
              key={organization.id}
              className="hover:shadow-md transition-all duration-200 cursor-pointer group border-border hover:border-primary/20"
              onClick={() => onView && handleViewClick(organization)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-gray-500 group-hover:text-primary transition-colors" />
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {organization.name}
                    </CardTitle>
                  </div>
                  <Badge
                    variant={organization.isActive ? "default" : "secondary"}
                    className="transition-colors"
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

                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewClick(organization);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(organization);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(organization);
                      }}
                      disabled={loadingStates[organization.id]}
                    >
                      {loadingStates[organization.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Organizations Table View */}
      {!isLoading && filteredOrganizations.length > 0 && viewMode === "list" && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Organization</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Criada em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrganizations.map((organization: Organization) => (
                <TableRow
                  key={organization.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onView && handleViewClick(organization)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{organization.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {organization.slug}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {organization.description ? (
                      <div className="max-w-[200px] truncate" title={organization.description}>
                        {organization.description}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Sem descrição</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {organization.owner?.fullName || organization.owner?.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={organization.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {organization.isActive ? "Ativa" : "Inativa"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(organization.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClick(organization);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(organization);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(organization);
                        }}
                        disabled={loadingStates[organization.id]}
                      >
                        {loadingStates[organization.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmDelete}
        title="Excluir Organization"
        description={`Tem certeza que deseja excluir a organization "${confirmation.itemTitle}"? Esta ação não pode ser desfeita.`}
        actionType="delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
