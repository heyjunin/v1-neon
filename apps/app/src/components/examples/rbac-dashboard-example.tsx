/**
 * Exemplo de Dashboard com RBAC implementado
 * Demonstra como usar o sistema RBAC na interface
 */

import React from 'react';
import { Button } from '@v1/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Badge } from '@v1/ui/badge';
import { Separator } from '@v1/ui/separator';
import {
  OrganizationProtectedByPermission,
  OrganizationProtectedByRole,
  OrganizationProtectedByOwner,
  OrganizationProtectedByAdminOrOwner,
  OrganizationRoleBasedContent,
  UserPermissionsSummary,
} from '@/components/rbac/organization-protected';
import {
  useOrganizationRBAC,
  useOrganizationPermission,
  useIsOrganizationOwner,
  useOrganizationPermissionsSummary,
} from '@/hooks/use-organization-rbac';
import { PERMISSIONS } from '@v1/auth/rbac';

/**
 * Dashboard principal com RBAC
 */
export function RBACDashboardExample() {
  const rbac = useOrganizationRBAC();
  const permissionsSummary = useOrganizationPermissionsSummary();
  const isOwner = useIsOrganizationOwner();
  
  // Verificar permissões específicas
  const canManageMembers = useOrganizationPermission(PERMISSIONS.MEMBER_INVITE);
  const canUpdateOrganization = useOrganizationPermission(PERMISSIONS.ORGANIZATION_UPDATE);
  const canDeleteOrganization = useIsOrganizationOwner();
  const canViewAnalytics = useOrganizationPermission(PERMISSIONS.ANALYTICS_VIEW);

  return (
    <div className="space-y-6 p-6">
      {/* Header com informações do usuário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Dashboard RBAC</span>
            <div className="flex items-center gap-2">
              <Badge variant={isOwner ? "default" : "secondary"}>
                {permissionsSummary.role?.toUpperCase() || 'NO ROLE'}
              </Badge>
              {permissionsSummary.isOwner && (
                <Badge variant="outline">OWNER</Badge>
              )}
              {permissionsSummary.isAdminOrOwner && !permissionsSummary.isOwner && (
                <Badge variant="outline">ADMIN</Badge>
              )}
            </div>
          </CardTitle>
          <CardDescription>
            Sistema de controle de acesso baseado em roles (RBAC)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserPermissionsSummary />
        </CardContent>
      </Card>

      {/* Seção de Gerenciamento de Organização */}
      <OrganizationProtectedByPermission permission={PERMISSIONS.ORGANIZATION_VIEW}>
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento da Organização</CardTitle>
            <CardDescription>
              Configurações e informações da organização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Botão para editar organização */}
              <OrganizationProtectedByPermission 
                permission={PERMISSIONS.ORGANIZATION_UPDATE}
                fallback={
                  <Button disabled className="w-full">
                    Editar Organização (Sem Permissão)
                  </Button>
                }
              >
                <Button className="w-full">
                  Editar Organização
                </Button>
              </OrganizationProtectedByPermission>

              {/* Botão para deletar organização - apenas owners */}
              <OrganizationProtectedByOwner
                fallback={
                  <Button variant="destructive" disabled className="w-full">
                    Deletar Organização (Apenas Owner)
                  </Button>
                }
              >
                <Button variant="destructive" className="w-full">
                  Deletar Organização
                </Button>
              </OrganizationProtectedByOwner>
            </div>

            {/* Transferir ownership - apenas owners */}
            <OrganizationProtectedByOwner>
              <Button variant="outline" className="w-full">
                Transferir Ownership
              </Button>
            </OrganizationProtectedByOwner>
          </CardContent>
        </Card>
      </OrganizationProtectedByPermission>

      {/* Seção de Gerenciamento de Membros */}
      <OrganizationProtectedByPermission permission={PERMISSIONS.MEMBER_VIEW}>
        <Card>
          <CardHeader>
            <CardTitle>Gerenciamento de Membros</CardTitle>
            <CardDescription>
              Convidar, gerenciar e remover membros da organização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Convidar membros */}
              <OrganizationProtectedByPermission 
                permission={PERMISSIONS.MEMBER_INVITE}
                fallback={
                  <Button disabled className="w-full">
                    Convidar Membros (Sem Permissão)
                  </Button>
                }
              >
                <Button className="w-full">
                  Convidar Membros
                </Button>
              </OrganizationProtectedByPermission>

              {/* Gerenciar roles - admins e owners */}
              <OrganizationProtectedByAdminOrOwner
                fallback={
                  <Button disabled className="w-full">
                    Gerenciar Roles (Admin/Owner Apenas)
                  </Button>
                }
              >
                <Button variant="outline" className="w-full">
                  Gerenciar Roles
                </Button>
              </OrganizationProtectedByAdminOrOwner>
            </div>

            {/* Remover membros */}
            <OrganizationProtectedByPermission 
              permission={PERMISSIONS.MEMBER_REMOVE}
              fallback={
                <Button variant="destructive" disabled className="w-full">
                  Remover Membros (Sem Permissão)
                </Button>
              }
            >
              <Button variant="destructive" className="w-full">
                Remover Membros
              </Button>
            </OrganizationProtectedByPermission>
          </CardContent>
        </Card>
      </OrganizationProtectedByPermission>

      {/* Seção de Conteúdo */}
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Conteúdo</CardTitle>
          <CardDescription>
            Criar e gerenciar posts e conteúdo da organização
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Criar posts */}
            <OrganizationProtectedByPermission 
              permission={PERMISSIONS.POST_CREATE}
              fallback={
                <Button disabled className="w-full">
                  Criar Post (Sem Permissão)
                </Button>
              }
            >
              <Button className="w-full">
                Criar Novo Post
              </Button>
            </OrganizationProtectedByPermission>

            {/* Gerenciar posts */}
            <OrganizationProtectedByPermission 
              permission={PERMISSIONS.POST_DELETE}
              fallback={
                <Button variant="outline" disabled className="w-full">
                  Gerenciar Posts (Sem Permissão)
                </Button>
              }
            >
              <Button variant="outline" className="w-full">
                Gerenciar Posts
              </Button>
            </OrganizationProtectedByPermission>
          </div>
        </CardContent>
      </Card>

      {/* Seção de Analytics */}
      <OrganizationProtectedByPermission permission={PERMISSIONS.ANALYTICS_VIEW}>
        <Card>
          <CardHeader>
            <CardTitle>Analytics e Relatórios</CardTitle>
            <CardDescription>
              Visualizar estatísticas e relatórios da organização
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full">
                Ver Analytics
              </Button>
              
              <OrganizationProtectedByPermission 
                permission={PERMISSIONS.REPORTS_EXPORT}
                fallback={
                  <Button disabled className="w-full">
                    Exportar Relatórios (Sem Permissão)
                  </Button>
                }
              >
                <Button className="w-full">
                  Exportar Relatórios
                </Button>
              </OrganizationProtectedByPermission>
            </div>
          </CardContent>
        </Card>
      </OrganizationProtectedByPermission>

      {/* Conteúdo baseado no Role */}
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo Específico por Role</CardTitle>
          <CardDescription>
            Diferentes funcionalidades baseadas no seu papel na organização
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationRoleBasedContent
            ownerContent={
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Painel do Owner</h4>
                <p className="text-blue-700 mb-4">
                  Você tem controle total sobre esta organização. Pode gerenciar todos os aspectos
                  incluindo billing, membros, configurações e deletar a organização.
                </p>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    Configurações Avançadas
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Gerenciar Billing
                  </Button>
                  <Button size="sm" variant="destructive" className="w-full">
                    Deletar Organização
                  </Button>
                </div>
              </div>
            }
            adminContent={
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-semibold text-green-900 mb-2">Painel do Admin</h4>
                <p className="text-green-700 mb-4">
                  Você pode gerenciar membros, conteúdo e a maioria das configurações da organização.
                  Algumas funcionalidades exclusivas do owner não estão disponíveis.
                </p>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    Gerenciar Membros
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Configurações da Organização
                  </Button>
                </div>
              </div>
            }
            memberContent={
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">Painel do Member</h4>
                <p className="text-yellow-700 mb-4">
                  Você pode criar e gerenciar seu próprio conteúdo, e participar das
                  atividades da organização.
                </p>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full">
                    Criar Conteúdo
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Ver Atividades
                  </Button>
                </div>
              </div>
            }
            viewerContent={
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">Painel do Viewer</h4>
                <p className="text-gray-700 mb-4">
                  Você tem acesso somente leitura ao conteúdo e informações da organização.
                </p>
                <div className="space-y-2">
                  <Button size="sm" variant="outline" className="w-full" disabled>
                    Apenas Visualização
                  </Button>
                </div>
              </div>
            }
            fallback={
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">Sem Acesso</h4>
                <p className="text-red-700">
                  Você não tem acesso a esta organização ou não está ativo como membro.
                </p>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Seção de Debug/Informações */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Debug RBAC</CardTitle>
          <CardDescription>
            Informações detalhadas sobre permissões e roles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Permissões Atuais:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className={canManageMembers.hasPermission ? "text-green-600" : "text-red-600"}>
                    {canManageMembers.hasPermission ? "✓" : "✗"}
                  </span>
                  <span>Gerenciar Membros</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={canUpdateOrganization.hasPermission ? "text-green-600" : "text-red-600"}>
                    {canUpdateOrganization.hasPermission ? "✓" : "✗"}
                  </span>
                  <span>Atualizar Org</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={canDeleteOrganization ? "text-green-600" : "text-red-600"}>
                    {canDeleteOrganization ? "✓" : "✗"}
                  </span>
                  <span>Deletar Org</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={canViewAnalytics.hasPermission ? "text-green-600" : "text-red-600"}>
                    {canViewAnalytics.hasPermission ? "✓" : "✗"}
                  </span>
                  <span>Ver Analytics</span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h4 className="font-semibold mb-2">Status do Usuário:</h4>
              <div className="space-y-1 text-sm">
                <div><strong>Role:</strong> {permissionsSummary.role || 'N/A'}</div>
                <div><strong>Status:</strong> {permissionsSummary.isActive ? 'Ativo' : 'Inativo'}</div>
                <div><strong>É Owner:</strong> {permissionsSummary.isOwner ? 'Sim' : 'Não'}</div>
                <div><strong>É Admin/Owner:</strong> {permissionsSummary.isAdminOrOwner ? 'Sim' : 'Não'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
