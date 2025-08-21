"use client";

import { useState } from "react";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CrudManagerState<T> {
  isFormOpen: boolean;
  editingItem: T | null;
  viewingItem: T | null;
}

export interface CrudManagerActions<T> {
  handleCreate: () => void;
  handleEdit: (item: T) => void;
  handleView: (item: T) => void;
  handleCloseForm: () => void;
  handleCloseView: () => void;
}

export function useCrudManager<T extends BaseEntity>(): CrudManagerState<T> & CrudManagerActions<T> {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [viewingItem, setViewingItem] = useState<T | null>(null);

  const handleCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const handleView = (item: T) => {
    setViewingItem(item);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleCloseView = () => {
    setViewingItem(null);
  };

  return {
    isFormOpen,
    editingItem,
    viewingItem,
    handleCreate,
    handleEdit,
    handleView,
    handleCloseForm,
    handleCloseView,
  };
}
