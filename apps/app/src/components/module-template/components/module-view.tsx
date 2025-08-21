"use client";

import { Button } from "@v1/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@v1/ui/dialog";
import { Edit } from "lucide-react";
import type { Module } from "../types";

interface ModuleViewProps {
  item: Module;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (item: Module) => void;
}

export function ModuleView({ item, isOpen, onClose, onEdit }: ModuleViewProps) {
  const handleEdit = () => {
    onEdit(item);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Detalhes do Item</DialogTitle>
          <DialogDescription>
            Visualize as informações completas do item.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-sm text-gray-500">Nome</h3>
            <p className="text-sm">{item.name}</p>
          </div>

          {item.description && (
            <div>
              <h3 className="font-medium text-sm text-gray-500">Descrição</h3>
              <p className="text-sm">{item.description}</p>
            </div>
          )}

          <div>
            <h3 className="font-medium text-sm text-gray-500">ID</h3>
            <p className="text-sm font-mono">{item.id}</p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">Criado em</h3>
            <p className="text-sm">
              {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm text-gray-500">Atualizado em</h3>
            <p className="text-sm">
              {new Date(item.updatedAt).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
