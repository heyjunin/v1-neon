"use client";

import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import {
  Edit,
  Eye,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { 
  useActionToast, 
  useConfirmation, 
  useViewMode,
  ConfirmationDialog,
  ViewToggle,
  SearchBar
} from "@v1/ui";
import type { Module } from "../types";

interface ModuleListProps {
  onEdit: (item: Module) => void;
  onCreate: () => void;
  onView?: (item: Module) => void;
}

export function ModuleList({ onEdit, onCreate, onView }: ModuleListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { viewMode, setViewMode, isLoaded } = useViewMode("module-view-mode");
  const { showSuccess, showError } = useActionToast();
  const { confirmation, openConfirmation, closeConfirmation, confirmAction } =
    useConfirmation();

  // Mock data - substituir por dados reais
  const items: Module[] = [];
  const isLoading = false;
  const error = null;

  const filteredItems = items.filter((item: Module) => {
    if (!item || typeof item !== "object") return false;

    const name = item.name || "";
    const description = item.description || "";

    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async (id: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [id]: true }));
      // Implementar delete real
      showSuccess("Item excluído com sucesso!");
    } catch (error) {
      showError("Erro ao excluir item. Tente novamente.");
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteClick = (item: Module) => {
    openConfirmation(item.id, item.name, "delete");
  };

  const handleConfirmDelete = async () => {
    await confirmAction(handleDelete);
  };

  const isDeleting = loadingStates[confirmation.itemId || ""] || false;

  const handleViewClick = (item: Module) => {
    if (onView) {
      onView(item);
    }
  };

  const handleEditClick = (item: Module) => {
    onEdit(item);
  };

  // Handle error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Modules</h2>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            Erro ao carregar items
          </div>
          <Button onClick={() => {}}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Modules</h2>
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

      {/* Results count */}
      {!isLoading && filteredItems.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} encontrado{filteredItems.length !== 1 ? 's' : ''}
          {searchTerm && ` para "${searchTerm}"`}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredItems.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchTerm
              ? "Nenhum item encontrado para sua busca."
              : "Nenhum item criado ainda."}
          </div>
          {!searchTerm && (
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Item
            </Button>
          )}
        </div>
      )}

      {/* Items Grid View */}
      {!isLoading && filteredItems.length > 0 && viewMode === "grid" && (
        <div className="grid gap-4">
          {filteredItems.map((item: Module) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{item.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {onView && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewClick(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(item)}
                      disabled={loadingStates[item.id]}
                    >
                      {loadingStates[item.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Items Table View */}
      {!isLoading && filteredItems.length > 0 && viewMode === "list" && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Item</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item: Module) => (
                <TableRow
                  key={item.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onView && handleViewClick(item)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {item.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate" title={item.description}>
                      {item.description}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClick(item);
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
                          handleEditClick(item);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item);
                        }}
                        disabled={loadingStates[item.id]}
                      >
                        {loadingStates[item.id] ? (
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
        title="Excluir Item"
        description={`Tem certeza que deseja excluir o item "${confirmation.itemTitle}"? Esta ação não pode ser desfeita.`}
        actionType="delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
