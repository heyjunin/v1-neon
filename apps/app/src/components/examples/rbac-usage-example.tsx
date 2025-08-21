/**
 * Exemplos de uso do sistema RBAC na interface
 */

import React from 'react';
import { Button } from '@v1/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@v1/ui/card';
import { Badge } from '@v1/ui/badge';
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

/**
 * Exemplo de dashboard com proteções RBAC
 */
export function RBACDashboardExample() {
  const rbac = useOrganizationRBAC();
  const permissionsSummary = useOrganizationPermissionsSummary();
  const isOwner = useIsOrganizationOwner();

  return (
    <div className="space-y-6">
      {/* Informações do usuário */}
      <Card>
        <CardHeader>
          <CardTitle>Your Role & Permissions</CardTitle>
          <CardDescription>
            Your current role and permissions in this organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
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
          
          <UserPermissionsSummary />
        </CardContent>
      </Card>

      {/* Seção de Gerenciamento de Organização */}
      <OrganizationProtectedByPermission permission="organization:view">
        <Card>
          <CardHeader>
            <CardTitle>Organization Management</CardTitle>
            <CardDescription>
              Manage your organization settings and information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Botão para editar organização */}
            <OrganizationProtectedByPermission 
              permission="organization:update"
              fallback={
                <Button disabled>
                  Edit Organization (No Permission)
                </Button>
              }
            >
              <Button>Edit Organization</Button>
            </OrganizationProtectedByPermission>

            {/* Botão para deletar organização - apenas owners */}
            <OrganizationProtectedByOwner
              fallback={
                <Button variant="destructive" disabled>
                  Delete Organization (Owner Only)
                </Button>
              }
            >
              <Button variant="destructive">Delete Organization</Button>
            </OrganizationProtectedByOwner>

            {/* Transferir ownership - apenas owners */}
            <OrganizationProtectedByOwner>
              <Button variant="outline">Transfer Ownership</Button>
            </OrganizationProtectedByOwner>
          </CardContent>
        </Card>
      </OrganizationProtectedByPermission>

      {/* Seção de Gerenciamento de Membros */}
      <OrganizationProtectedByPermission permission="member:view">
        <Card>
          <CardHeader>
            <CardTitle>Member Management</CardTitle>
            <CardDescription>
              Manage organization members and their roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Convidar membros */}
            <OrganizationProtectedByPermission 
              permission="member:invite"
              fallback={
                <Button disabled>
                  Invite Members (No Permission)
                </Button>
              }
            >
              <Button>Invite Members</Button>
            </OrganizationProtectedByPermission>

            {/* Gerenciar roles - admins e owners */}
            <OrganizationProtectedByAdminOrOwner
              fallback={
                <Button disabled>
                  Manage Roles (Admin/Owner Only)
                </Button>
              }
            >
              <Button variant="outline">Manage Member Roles</Button>
            </OrganizationProtectedByAdminOrOwner>

            {/* Remover membros */}
            <OrganizationProtectedByPermission 
              permission="member:remove"
              fallback={
                <Button variant="destructive" disabled>
                  Remove Members (No Permission)
                </Button>
              }
            >
              <Button variant="destructive">Remove Members</Button>
            </OrganizationProtectedByPermission>
          </CardContent>
        </Card>
      </OrganizationProtectedByPermission>

      {/* Seção de Conteúdo baseada no Role */}
      <Card>
        <CardHeader>
          <CardTitle>Role-Based Content</CardTitle>
          <CardDescription>
            Different content based on your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <OrganizationRoleBasedContent
            ownerContent={
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900">Owner Dashboard</h4>
                <p className="text-blue-700">
                  You have full control over this organization. You can manage all aspects
                  including billing, member management, and organization settings.
                </p>
              </div>
            }
            adminContent={
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-900">Admin Dashboard</h4>
                <p className="text-green-700">
                  You can manage members, content, and most organization settings.
                  Some owner-only features are not available.
                </p>
              </div>
            }
            memberContent={
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-yellow-900">Member Dashboard</h4>
                <p className="text-yellow-700">
                  You can create and manage your own content, and participate in
                  organization activities.
                </p>
              </div>
            }
            viewerContent={
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">Viewer Dashboard</h4>
                <p className="text-gray-700">
                  You have read-only access to organization content and information.
                </p>
              </div>
            }
            fallback={
              <div className="p-4 bg-red-50 rounded-lg">
                <h4 className="font-semibold text-red-900">No Access</h4>
                <p className="text-red-700">
                  You don't have access to this organization.
                </p>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Seção de Projetos */}
      <OrganizationProtectedByPermission permission="project:view">
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
            <CardDescription>
              Manage organization projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <OrganizationProtectedByPermission 
              permission="project:create"
              fallback={
                <Button disabled>
                  Create Project (No Permission)
                </Button>
              }
            >
              <Button>Create New Project</Button>
            </OrganizationProtectedByPermission>

            <OrganizationProtectedByPermission 
              permission="project:manage"
              fallback={
                <Button variant="outline" disabled>
                  Manage Projects (No Permission)
                </Button>
              }
            >
              <Button variant="outline">Manage All Projects</Button>
            </OrganizationProtectedByPermission>
          </CardContent>
        </Card>
      </OrganizationProtectedByPermission>

      {/* Seção de Analytics */}
      <OrganizationProtectedByPermission permission="analytics:view">
        <Card>
          <CardHeader>
            <CardTitle>Analytics & Reports</CardTitle>
            <CardDescription>
              View organization analytics and generate reports
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline">View Analytics</Button>
            
            <OrganizationProtectedByPermission 
              permission="reports:export"
              fallback={
                <Button disabled>
                  Export Reports (No Permission)
                </Button>
              }
            >
              <Button>Export Reports</Button>
            </OrganizationProtectedByPermission>
          </CardContent>
        </Card>
      </OrganizationProtectedByPermission>
    </div>
  );
}

/**
 * Exemplo de lista de membros com controles baseados em permissões
 */
interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'suspended';
}

export function MemberListExample({ members }: { members: Member[] }) {
  const rbac = useOrganizationRBAC();

  return (
    <div className="space-y-4">
      {members.map((member) => (
        <Card key={member.id}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h4 className="font-semibold">{member.name}</h4>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                </div>
                <Badge variant={member.role === 'owner' ? 'default' : 'secondary'}>
                  {member.role.toUpperCase()}
                </Badge>
                <Badge variant={member.status === 'active' ? 'outline' : 'destructive'}>
                  {member.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Botão para alterar role */}
                <OrganizationProtectedByPermission
                  permission="member:update_role"
                  fallback={
                    <Button size="sm" disabled>
                      Change Role
                    </Button>
                  }
                >
                  {rbac.canManageUser(member.role).hasPermission ? (
                    <Button size="sm" variant="outline">
                      Change Role
                    </Button>
                  ) : (
                    <Button size="sm" disabled>
                      Cannot Manage
                    </Button>
                  )}
                </OrganizationProtectedByPermission>

                {/* Botão para suspender */}
                <OrganizationProtectedByPermission
                  permission="member:suspend"
                >
                  {rbac.canManageUser(member.role).hasPermission && (
                    <Button size="sm" variant="destructive">
                      {member.status === 'active' ? 'Suspend' : 'Activate'}
                    </Button>
                  )}
                </OrganizationProtectedByPermission>

                {/* Botão para remover */}
                <OrganizationProtectedByPermission
                  permission="member:remove"
                >
                  {rbac.canManageUser(member.role).hasPermission && (
                    <Button size="sm" variant="destructive">
                      Remove
                    </Button>
                  )}
                </OrganizationProtectedByPermission>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
