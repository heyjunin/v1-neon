'use client';

import { Button } from '@v1/ui/button';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { PostForm } from './post-form';
import { PostsList } from './posts-list';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

interface PostsResult {
  data: Post[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function PostsManager() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });
      
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/posts?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar posts');
      }

      const result = await response.json();
      
      if (result) {
        setPosts(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      showNotification('error', 'Erro ao carregar posts');
    } finally {
      setIsLoading(false);
    }
  }, [search, page, limit]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1); // Reset to first page when searching
  };

  const handleCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Tem certeza que deseja excluir este post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Erro ao excluir post');
      }

      showNotification('success', 'Post excluído com sucesso');
      loadPosts(); // Reload posts
    } catch (error) {
      console.error('Erro ao excluir post:', error);
      showNotification('error', 'Erro ao excluir post');
    }
  };

  const handleSubmit = async (data: { title: string; content: string }) => {
    try {
      setIsSubmitting(true);

      if (editingPost) {
        // Update existing post
        const response = await fetch(`/api/posts/${editingPost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Erro ao atualizar post');
        }

        showNotification('success', 'Post atualizado com sucesso');
      } else {
        // Create new post
        const response = await fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (!response.ok) {
          throw new Error('Erro ao criar post');
        }

        showNotification('success', 'Post criado com sucesso');
      }

      setIsFormOpen(false);
      loadPosts(); // Reload posts
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      showNotification('error', 'Erro ao salvar post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`flex items-center gap-2 p-4 rounded-md ${
          notification.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {notification.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setNotification(null)}
            className="ml-auto h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>
      )}

      {/* Posts List */}
      <PostsList
        posts={posts}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isLoading={isLoading}
      />

      {/* Post Form */}
      <PostForm
        post={editingPost}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
