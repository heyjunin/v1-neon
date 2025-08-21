"use client";

import { SignOut } from "@/components/sign-out";
import { useCurrentOrganization } from "@/hooks/use-current-organization";
import { Badge } from "@v1/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";
import { Building2, Loader2, User } from "lucide-react";

export default function Page() {
  const { currentOrganization, isLoading, hasOrganizations } = useCurrentOrganization();

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p>Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Bem-vindo ao seu painel de controle
          </p>
        </div>
        <SignOut />
      </div>

      {/* Organization Info */}
      {hasOrganizations && currentOrganization ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Atual
            </CardTitle>
            <CardDescription>
              Você está trabalhando na organization selecionada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">{currentOrganization.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {currentOrganization.slug}
                </p>
                {currentOrganization.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {currentOrganization.description}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={currentOrganization.role === "owner" ? "default" : "secondary"}>
                  {currentOrganization.role === "owner" ? "Owner" : 
                   currentOrganization.role === "admin" ? "Admin" : "Member"}
                </Badge>
                {currentOrganization.role === "owner" && (
                  <Badge variant="outline">Padrão</Badge>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>ID: {currentOrganization.id}</span>
              </div>
              <div>
                <span>Criada em: {new Date(currentOrganization.createdAt || "").toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Nenhuma Organization
            </CardTitle>
            <CardDescription>
              Você ainda não tem organizations. Crie uma para começar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use o seletor de organization na barra de navegação para criar sua primeira organization.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Posts</CardTitle>
            <CardDescription>
              Gerencie seus posts e conteúdo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crie, edite e organize seus posts.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organizations</CardTitle>
            <CardDescription>
              Gerencie suas organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crie e gerencie suas organizations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>
              Configure sua conta e preferências
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Ajuste suas configurações pessoais.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
