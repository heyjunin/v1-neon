'use client';

import { useCreatePost, useUpdatePost } from '@/lib/trpc';
import { Button } from '@v1/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@v1/ui/dialog';
import { Input } from '@v1/ui/input';
import { Loader2, Save, X } from 'lucide-react';
import type { Post, PostFormData } from './types';
import { useForm } from './use-form';
import { postValidation } from './validations';

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
  const isLoading = createPostMutation.isPending || updatePostMutation.isPending;

  const initialValues: PostFormData = {
    title: post?.title || '',
    content: post?.content || '',
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Post' : 'Criar Novo Post'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do seu post abaixo.'
              : 'Preencha as informações para criar um novo post.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título *
            </label>
            <Input
              id="title"
              value={values.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue('title', e.target.value)}
              placeholder="Digite o título do post..."
              className={errors.title ? 'border-destructive' : ''}
              disabled={isLoading || formLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="content" className="text-sm font-medium">
              Conteúdo *
            </label>
            <textarea
              id="content"
              value={values.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue('content', e.target.value)}
              placeholder="Digite o conteúdo do post..."
              className={`min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical ${
                errors.content ? 'border-destructive' : ''
              }`}
              disabled={isLoading || formLoading}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
            <div className="text-xs text-muted-foreground">
              {values.content.length}/10.000 caracteres
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading || formLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || formLoading}>
              {isLoading || formLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
