"use client";

import { useCreatePost, useUpdatePost } from "@/lib/trpc";
import { Button } from "@v1/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@v1/ui/dialog";
import { Loader2, Save, X } from "lucide-react";
import { FormField } from "../components/form-field";
import { LoadingOverlay } from "../components/loading-card";
import type { Post, PostFormData } from "../types";
import { postValidation, useForm } from "../utils/index";

interface PostFormProps {
  post?: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function PostForm({ post, isOpen, onClose, onSuccess }: PostFormProps) {
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();

  const isEditing = !!post;
  const isLoading =
    createPostMutation.isPending || updatePostMutation.isPending;

  const initialValues: PostFormData = {
    title: post?.title || "",
    content: post?.content || "",
  };

  const handleSubmit = async (values: PostFormData) => {
    if (isEditing && post) {
      await updatePostMutation.mutateAsync({
        id: post.id,
        ...values,
      });
    } else {
      await createPostMutation.mutateAsync(values);
    }
  };

  const {
    values,
    errors,
    isLoading: formLoading,
    setValue,
    handleSubmit: handleFormSubmit,
  } = useForm({
    initialValues,
    onSubmit: handleSubmit,
    validation: postValidation,
    onSuccess: () => {
      onClose();
      onSuccess?.();
    },
  });

  const handleClose = () => {
    if (!isLoading && !formLoading) {
      onClose();
    }
  };

  const isFormDisabled = isLoading || formLoading;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <LoadingOverlay isLoading={isFormDisabled}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Editar Post" : "Criar Novo Post"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Edite as informações do seu post abaixo."
                : "Preencha as informações para criar um novo post."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFormSubmit} className="space-y-4">
          <FormField
            id="title"
            label="Título"
            value={values.title}
            onChange={(value) => setValue("title", value)}
            error={errors.title}
            disabled={isFormDisabled}
            required
            type="text"
            placeholder="Digite o título do post..."
            maxLength={100}
            minLength={3}
          />

          <FormField
            id="content"
            label="Conteúdo"
            value={values.content}
            onChange={(value) => setValue("content", value)}
            error={errors.content}
            disabled={isFormDisabled}
            required
            type="textarea"
            placeholder="Digite o conteúdo do post..."
            maxLength={10000}
            minLength={10}
          />

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isFormDisabled}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isFormDisabled}>
              {isFormDisabled ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
        </LoadingOverlay>
      </DialogContent>
    </Dialog>
  );
}
