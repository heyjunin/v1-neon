import { trpc } from "../client";

// Hook para listar LMS da organização atual
export const useLMS = (input?: {
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}) => {
  return trpc.lms.getLMS.useQuery(input || {}, {
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar LMS por ID
export const useLMSById = (id: string) => {
  return trpc.lms.getLMSById.useQuery({ id }, {
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para buscar LMS por organização
export const useLMSByOrganization = (organizationId: string, input?: {
  page?: number;
  limit?: number;
}) => {
  return trpc.lms.getLMSByOrganization.useQuery(
    { organizationId, ...input },
    {
      enabled: !!organizationId,
      staleTime: 5 * 60 * 1000, // 5 minutos
    }
  );
};

// Hook para buscar LMS por domínio
export const useLMSByDomain = (domain: string) => {
  return trpc.lms.getLMSByDomain.useQuery({ domain }, {
    enabled: !!domain,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para obter timezones
export const useTimezones = () => {
  return trpc.lms.getTimezones.useQuery(undefined, {
    staleTime: 60 * 60 * 1000, // 1 hora
  });
};

// Mutations
export const useCreateLMS = () => {
  const utils = trpc.useUtils();
  
  return trpc.lms.createLMS.useMutation({
    onSuccess: () => {
      utils.lms.getLMS.invalidate();
    },
  });
};

export const useUpdateLMS = () => {
  const utils = trpc.useUtils();
  
  return trpc.lms.updateLMS.useMutation({
    onSuccess: (data: { id: string }) => {
      utils.lms.getLMS.invalidate();
      utils.lms.getLMSById.invalidate({ id: data.id });
    },
  });
};

export const useDeleteLMS = () => {
  const utils = trpc.useUtils();
  
  return trpc.lms.deleteLMS.useMutation({
    onSuccess: () => {
      utils.lms.getLMS.invalidate();
    },
  });
};
