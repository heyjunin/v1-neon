/**
 * Sistema RBAC para Organizações
 * Define todas as permissões disponíveis no sistema
 */

// Definição de todas as permissões do sistema
export const PERMISSIONS = {
  // Permissões de Organização
  ORGANIZATION_VIEW: 'organization:view',
  ORGANIZATION_UPDATE: 'organization:update',
  ORGANIZATION_DELETE: 'organization:delete',
  ORGANIZATION_TRANSFER: 'organization:transfer',
  ORGANIZATION_SETTINGS: 'organization:settings',

  // Permissões de Membros
  MEMBER_VIEW: 'member:view',
  MEMBER_INVITE: 'member:invite',
  MEMBER_UPDATE_ROLE: 'member:update_role',
  MEMBER_REMOVE: 'member:remove',
  MEMBER_SUSPEND: 'member:suspend',
  MEMBER_ACTIVATE: 'member:activate',

  // Permissões de Convites
  INVITE_VIEW: 'invite:view',
  INVITE_CREATE: 'invite:create',
  INVITE_CANCEL: 'invite:cancel',
  INVITE_RESEND: 'invite:resend',

  // Permissões de Posts/Conteúdo
  POST_VIEW: 'post:view',
  POST_CREATE: 'post:create',
  POST_UPDATE: 'post:update',
  POST_DELETE: 'post:delete',
  POST_PUBLISH: 'post:publish',

  // Permissões de Projetos
  PROJECT_VIEW: 'project:view',
  PROJECT_CREATE: 'project:create',
  PROJECT_UPDATE: 'project:update',
  PROJECT_DELETE: 'project:delete',
  PROJECT_MANAGE: 'project:manage',

  // Permissões de Relatórios/Analytics
  ANALYTICS_VIEW: 'analytics:view',
  REPORTS_VIEW: 'reports:view',
  REPORTS_EXPORT: 'reports:export',
} as const;

// Tipo para as permissões
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Definição dos roles e suas permissões
export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  owner: [
    // Owners têm todas as permissões
    ...Object.values(PERMISSIONS),
  ],
  
  admin: [
    // Administradores têm quase todas as permissões, exceto transferir organização
    PERMISSIONS.ORGANIZATION_VIEW,
    PERMISSIONS.ORGANIZATION_UPDATE,
    PERMISSIONS.ORGANIZATION_SETTINGS,
    
    PERMISSIONS.MEMBER_VIEW,
    PERMISSIONS.MEMBER_INVITE,
    PERMISSIONS.MEMBER_UPDATE_ROLE,
    PERMISSIONS.MEMBER_REMOVE,
    PERMISSIONS.MEMBER_SUSPEND,
    PERMISSIONS.MEMBER_ACTIVATE,
    
    PERMISSIONS.INVITE_VIEW,
    PERMISSIONS.INVITE_CREATE,
    PERMISSIONS.INVITE_CANCEL,
    PERMISSIONS.INVITE_RESEND,
    
    PERMISSIONS.POST_VIEW,
    PERMISSIONS.POST_CREATE,
    PERMISSIONS.POST_UPDATE,
    PERMISSIONS.POST_DELETE,
    PERMISSIONS.POST_PUBLISH,
    
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_UPDATE,
    PERMISSIONS.PROJECT_DELETE,
    PERMISSIONS.PROJECT_MANAGE,
    
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
  ],
  
  member: [
    // Membros têm permissões básicas
    PERMISSIONS.ORGANIZATION_VIEW,
    
    PERMISSIONS.MEMBER_VIEW,
    
    PERMISSIONS.INVITE_VIEW,
    
    PERMISSIONS.POST_VIEW,
    PERMISSIONS.POST_CREATE,
    PERMISSIONS.POST_UPDATE, // Apenas seus próprios posts
    
    PERMISSIONS.PROJECT_VIEW,
    PERMISSIONS.PROJECT_CREATE,
    PERMISSIONS.PROJECT_UPDATE, // Apenas projetos onde é colaborador
    
    PERMISSIONS.ANALYTICS_VIEW, // Vista limitada
  ],
  
  viewer: [
    // Visualizadores têm apenas permissões de leitura
    PERMISSIONS.ORGANIZATION_VIEW,
    PERMISSIONS.MEMBER_VIEW,
    PERMISSIONS.POST_VIEW,
    PERMISSIONS.PROJECT_VIEW,
  ],
};

// Roles disponíveis
export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MEMBER: 'member',
  VIEWER: 'viewer',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

// Hierarquia de roles (para verificações de nível)
export const ROLE_HIERARCHY: Record<Role, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

// Função para verificar se um role tem uma permissão específica
export function hasPermission(role: string, permission: Permission): boolean {
  const rolePermissions = ROLE_PERMISSIONS[role];
  return rolePermissions ? rolePermissions.includes(permission) : false;
}

// Função para verificar se um role tem nível suficiente
export function hasRoleLevel(userRole: string, requiredRole: Role): boolean {
  const userLevel = ROLE_HIERARCHY[userRole as Role] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  return userLevel >= requiredLevel;
}

// Função para obter todas as permissões de um role
export function getRolePermissions(role: string): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

// Função para verificar múltiplas permissões (AND)
export function hasAllPermissions(role: string, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

// Função para verificar múltiplas permissões (OR)
export function hasAnyPermission(role: string, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}
