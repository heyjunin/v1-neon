import { trpc } from "../client";

// Hook para listar blogs da organização atual
export const useBlogs = (input?: {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}) => {
  return trpc.blogs.getBlogs.useQuery(input || {}, {
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar blog por ID
export const useBlogById = (id: string) => {
  return trpc.blogs.getBlogById.useQuery({ id }, {
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar blogs por organização
export const useBlogsByOrganization = (organizationId: string, input?: {
  page?: number;
  limit?: number;
}) => {
  return trpc.blogs.getBlogsByOrganization.useQuery(
    { organizationId, ...input },
    {
      enabled: !!organizationId,
      staleTime: 5 * 60 * 1000, // 5 minutos
    }
  );
};

// Hook para buscar blog por domínio
export const useBlogByDomain = (domain: string) => {
  return trpc.blogs.getBlogByDomain.useQuery({ domain }, {
    enabled: !!domain,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter timezones
export const useTimezones = () => {
  return trpc.blogs.getTimezones.useQuery(undefined, {
    staleTime: 60 * 60 * 1000, // 1 hora
  });
};

// Mutations
export const useCreateBlog = () => {
  const utils = trpc.useUtils();
  
  return trpc.blogs.createBlog.useMutation({
    onSuccess: () => {
      utils.blogs.getBlogs.invalidate();
    },
  });
};

export const useUpdateBlog = () => {
  const utils = trpc.useUtils();
  
  return trpc.blogs.updateBlog.useMutation({
    onSuccess: (data: { id: string }) => {
      utils.blogs.getBlogs.invalidate();
      utils.blogs.getBlogById.invalidate({ id: data.id });
    },
  });
};

export const useDeleteBlog = () => {
  const utils = trpc.useUtils();
  
  return trpc.blogs.deleteBlog.useMutation({
    onSuccess: () => {
      utils.blogs.getBlogs.invalidate();
    },
  });
};
