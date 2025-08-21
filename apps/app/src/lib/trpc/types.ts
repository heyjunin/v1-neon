// Tipos que podem ser importados no cliente
export interface User {
  id: string;
  email: string;
}

export interface CreateContextOptions {
  req?: any;
  user?: User | null;
  organizationId?: string | null;
  userRole?: string | null;
}
