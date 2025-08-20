'use client';

import { useDeletePost, usePosts } from '@/lib/trpc';
import { Badge } from '@v1/ui/badge';
import { Button } from '@v1/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Input } from '@v1/ui/input';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar, Edit, Plus, Search, Trash2, User } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from './confirmation-dialog';
import { Notification } from './notification';
import { Post } from './types';
import { useConfirmation } from './use-confirmation';
import { useNotification } from './use-notification';

interface PostsListProps {
  onEdit: (post: Post) => void;
  onCreate: () => void;
}

export function PostsList({ onEdit, onCreate }: PostsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentLimit] = useState(10);

  const { data, isLoading, error } = usePosts({
    search: searchTerm || undefined,
    page: currentPage,
    limit: currentLimit,
  });

  const deletePostMutation = useDeletePost();
  const { confirmation, openConfirmation, closeConfirmation, confirmAction } = useConfirmation();
  const { notification, showNotification, hideNotification } = useNotification();

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (data?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const handleDeleteClick = (post: Post) => {
    openConfirmation(post.id, post.title, 'delete');
  };

  const handleDeleteConfirm = async () => {
    try {
      await confirmAction(async (id: string) => {
        await deletePostMutation.mutateAsync({ id });
        showNotification('success', 'Post excluído com sucesso!');
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      showNotification('error', 'Erro ao excluir post. Tente novamente.');
    }
  };

  const truncateContent = (content: string, maxLength = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (error) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="text-destructive text-center">
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar posts</h3>
            <p>{error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const posts = data?.data || [];
  const total = data?.total || 0;
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Posts</h1>
          <p className="text-muted-foreground">
            {total} post{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={onCreate} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Post
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Buscar posts..."
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
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
          ))
        ) : posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-muted-foreground text-center">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Nenhum post encontrado</h3>
                <p className="mb-4">
                  {searchTerm ? 'Tente ajustar sua busca ou criar um novo post.' : 'Crie seu primeiro post para começar.'}
                </p>
                {!searchTerm && (
                  <Button onClick={onCreate}>
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Post
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          posts.map((post: Post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(post.createdAt), {
                          addSuffix: true,
                          locale: ptBR
                        })}
                      </div>
                      {post.user && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.user.fullName || post.user.email}
                        </div>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(post)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-3 w-3" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(post)}
                      disabled={deletePostMutation.isPending}
                      className="flex items-center gap-1 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {truncateContent(post.content)}
                </p>
                {post.updatedAt !== post.createdAt && (
                  <Badge variant="secondary" className="mt-2">
                    Editado {formatDistanceToNow(new Date(post.updatedAt), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
              if (pageNumber > totalPages) return null;
              
              return (
                <Button
                  key={pageNumber}
                  variant={pageNumber === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNumber)}
                  className="w-8 h-8 p-0"
                >
                  {pageNumber}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </Button>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleDeleteConfirm}
        title="Confirmar exclusão"
        description={`Tem certeza que deseja excluir o post "${confirmation.itemTitle}"? Esta ação não pode ser desfeita.`}
        isLoading={deletePostMutation.isPending}
        actionType="delete"
      />

      {/* Notification */}
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
}
