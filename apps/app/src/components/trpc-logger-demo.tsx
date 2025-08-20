'use client';

import { useCreatePost, useDeletePost, usePost, usePosts, useUpdatePost } from '@/lib/trpc/hooks';
import { Button } from '@v1/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Input } from '@v1/ui/input';
import { useState } from 'react';

export function TRPCLoggerDemo() {
  const [postId, setPostId] = useState('');
  const [title, setTitle] = useState('Test Post');
  const [content, setContent] = useState('This is a test post for logger demonstration');

  // Hooks tRPC
  const { data: posts, isLoading: postsLoading, error: postsError } = usePosts({ limit: 5 });
  const { data: post, isLoading: postLoading, error: postError } = usePost(postId);
  const createPostMutation = useCreatePost();
  const updatePostMutation = useUpdatePost();
  const deletePostMutation = useDeletePost();

  const handleCreatePost = async () => {
    try {
      await createPostMutation.mutateAsync({
        title,
        content,
      });
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async () => {
    if (!postId) return;
    
    try {
      await updatePostMutation.mutateAsync({
        id: postId,
        title,
        content,
      });
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!postId) return;
    
    try {
      await deletePostMutation.mutateAsync({ id: postId });
      setPostId('');
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>tRPC Logger Demo</CardTitle>
          <CardDescription>
            Teste as funcionalidades do loggerLink. Abra o console do navegador para ver os logs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Query Demo */}
            <div className="space-y-2">
              <div className="font-medium">Teste de Query (getPosts)</div>
              <div className="text-sm text-gray-600">
                {postsLoading ? 'Carregando...' : 
                 postsError ? `Erro: ${postsError.message}` :
                 `Posts encontrados: ${posts?.data?.length || 0}`
                }
              </div>
            </div>

            {/* Query by ID Demo */}
            <div className="space-y-2">
              <div className="font-medium">Teste de Query por ID</div>
              <div className="flex gap-2">
                <Input
                  placeholder="ID do post"
                  value={postId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostId(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-600">
                {postLoading ? 'Carregando...' : 
                 postError ? `Erro: ${postError.message}` :
                 post ? `Post: ${post.title}` : 'Nenhum post selecionado'
                }
              </div>
            </div>
          </div>

          {/* Mutation Demo */}
          <div className="space-y-4">
            <div className="font-medium">Teste de Mutations</div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-medium">Título</div>
                <Input
                  value={title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
                  placeholder="Título do post"
                />
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Conteúdo</div>
                <textarea
                  value={content}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
                  placeholder="Conteúdo do post"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleCreatePost}
                disabled={createPostMutation.isPending}
              >
                {createPostMutation.isPending ? 'Criando...' : 'Criar Post'}
              </Button>

              <Button
                onClick={handleUpdatePost}
                disabled={updatePostMutation.isPending || !postId}
                variant="outline"
              >
                {updatePostMutation.isPending ? 'Atualizando...' : 'Atualizar Post'}
              </Button>

              <Button
                onClick={handleDeletePost}
                disabled={deletePostMutation.isPending || !postId}
                variant="destructive"
              >
                {deletePostMutation.isPending ? 'Deletando...' : 'Deletar Post'}
              </Button>
            </div>
          </div>

          {/* Logs Info */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="font-medium text-blue-900 mb-2">Logs Esperados:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <code>[tRPC Client] → posts.getPosts</code> - Início da query</li>
              <li>• <code>[tRPC Server] QUERY posts.getPosts started</code> - Servidor recebeu</li>
              <li>• <code>[tRPC Server] QUERY posts.getPosts completed</code> - Servidor processou</li>
              <li>• <code>[tRPC Client] ← posts.getPosts (XXXms)</code> - Cliente recebeu resposta</li>
              <li>• <code>[tRPC Client] → posts.createPost</code> - Início da mutation</li>
              <li>• <code>[tRPC Server] MUTATION posts.createPost started</code> - Servidor processando</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
