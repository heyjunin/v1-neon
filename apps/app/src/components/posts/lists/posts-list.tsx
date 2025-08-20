'use client';

import { useDeletePost, usePosts } from '@/lib/trpc';
import { Button } from '@v1/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Input } from '@v1/ui/input';
import { Calendar, Edit, Plus, Search, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from '../components/dialogs';
import { PostNotification } from '../components/notification';
import { useConfirmation } from '../hooks/use-confirmation';
import { useNotification } from '../hooks/use-notification';
import { Post } from '../types';

interface PostsListProps {
  onEdit: (post: Post) => void;
  onCreate: () => void;
}

export function PostsList({ onEdit, onCreate }: PostsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: posts = [], isLoading, refetch } = usePosts();
  const deletePostMutation = useDeletePost();
  const { notification, showNotification, hideNotification } = useNotification();
  const { confirmation, openConfirmation, closeConfirmation, confirmAction } = useConfirmation();

  const filteredPosts = posts.filter((post: Post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    try {
      await deletePostMutation.mutateAsync({ id });
      await refetch();
      showNotification('success', 'Post excluído com sucesso!');
    } catch (error) {
      showNotification('error', 'Erro ao excluir post. Tente novamente.');
    }
  };

  const handleDeleteClick = (post: Post) => {
    openConfirmation(post.id, post.title, 'delete');
  };

  const handleConfirmDelete = async () => {
    await confirmAction(handleDelete);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Posts</h2>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </div>
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Post
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchTerm ? 'Nenhum post encontrado para sua busca.' : 'Nenhum post criado ainda.'}
          </div>
          {!searchTerm && (
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Post
            </Button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post: Post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.content}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(post)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(post)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.user?.fullName || post.user?.email || 'Usuário'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(post.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Notification */}
      <PostNotification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
        variant="toast"
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmDelete}
        title="Excluir Post"
        description={`Tem certeza que deseja excluir o post "${confirmation.itemTitle}"? Esta ação não pode ser desfeita.`}
        isLoading={deletePostMutation.isPending}
        actionType="delete"
      />
    </div>
  );
}
