'use client';

import { trpc } from './client';

// Hook para buscar posts
export function usePosts(options?: {
  search?: string;
  page?: number;
  limit?: number;
  userId?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}) {
  return trpc.posts.getPosts.useQuery(
    {
      search: options?.search,
      page: options?.page || 1,
      limit: options?.limit || 10,
      userId: options?.userId,
      sortBy: options?.sortBy,
      sortOrder: options?.sortOrder,
    },
    {
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );
}

// Hook para buscar post por ID
export function usePost(id: string) {
  return trpc.posts.getPostById.useQuery(
    { id },
    {
      enabled: !!id,
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );
}

// Hook para buscar posts por usuário
export function usePostsByUser(userId: string) {
  return trpc.posts.getPostsByUserId.useQuery(
    { userId },
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5, // 5 minutos
    }
  );
}

// Hook para criar post
export function useCreatePost() {
  const utils = trpc.useUtils();
  
  return trpc.posts.createPost.useMutation({
    onSuccess: () => {
      // Invalidate queries relacionadas a posts
      utils.posts.getPosts.invalidate();
      utils.posts.getPostsByUserId.invalidate();
    },
  });
}

// Hook para atualizar post
export function useUpdatePost() {
  const utils = trpc.useUtils();
  
  return trpc.posts.updatePost.useMutation({
    onSuccess: (data) => {
      // Invalidate queries relacionadas a posts
      utils.posts.getPosts.invalidate();
      utils.posts.getPostById.invalidate({ id: data.id });
      utils.posts.getPostsByUserId.invalidate();
    },
  });
}

// Hook para deletar post
export function useDeletePost() {
  const utils = trpc.useUtils();
  
  return trpc.posts.deletePost.useMutation({
    onSuccess: () => {
      // Invalidate queries relacionadas a posts
      utils.posts.getPosts.invalidate();
      utils.posts.getPostsByUserId.invalidate();
    },
  });
}
