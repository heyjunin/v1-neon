'use client';

import { Button } from '@v1/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@v1/ui/dialog';
import { Input } from '@v1/ui/input';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Post {
  id: string;
  title: string;
  content: string;
  userId: string;
}

interface PostFormProps {
  post?: Post | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; content: string }) => Promise<void>;
  isLoading?: boolean;
}

export function PostForm({ post, isOpen, onClose, onSubmit, isLoading = false }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const isEditing = !!post;

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
    } else {
      setTitle('');
      setContent('');
    }
    setErrors({});
  }, [post, isOpen]);

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'O título é obrigatório';
    } else if (title.length < 3) {
      newErrors.title = 'O título deve ter pelo menos 3 caracteres';
    } else if (title.length > 100) {
      newErrors.title = 'O título deve ter no máximo 100 caracteres';
    }

    if (!content.trim()) {
      newErrors.content = 'O conteúdo é obrigatório';
    } else if (content.length < 10) {
      newErrors.content = 'O conteúdo deve ter pelo menos 10 caracteres';
    } else if (content.length > 10000) {
      newErrors.content = 'O conteúdo deve ter no máximo 10.000 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({ title: title.trim(), content: content.trim() });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar post:', error);
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
            {isEditing ? 'Editar Post' : 'Criar Novo Post'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite as informações do seu post abaixo.'
              : 'Preencha as informações para criar um novo post.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Título *
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título do post..."
              className={errors.title ? 'border-destructive' : ''}
              disabled={isLoading}
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
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Digite o conteúdo do post..."
              className={`min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical ${
                errors.content ? 'border-destructive' : ''
              }`}
              disabled={isLoading}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
            <div className="text-xs text-muted-foreground">
              {content.length}/10.000 caracteres
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
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
              {isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
