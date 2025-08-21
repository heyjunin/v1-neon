"use client";

import { useOrganization } from "@/contexts/organization-context";
import { useCreateOrganization } from "@/lib/trpc";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import { Label } from "@v1/ui/label";
import { Textarea } from "@v1/ui/textarea";
import { Building2, Loader2, Shield, Users } from "lucide-react";
import { useState } from "react";

export function OrganizationOnboarding() {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const createOrganizationMutation = useCreateOrganization();
  const { refreshOrganizations } = useOrganization();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!formData.slug.trim()) {
      newErrors.slug = "Slug é obrigatório";
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = "Slug deve conter apenas letras minúsculas, números e hífens";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createOrganizationMutation.mutateAsync({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        description: formData.description.trim() || undefined,
      });
      
      await refreshOrganizations();
    } catch (error) {
      console.error("Erro ao criar organization:", error);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({ ...prev, name }));
    if (!formData.slug || formData.slug === generateSlug(formData.name)) {
      setFormData(prev => ({ ...prev, slug: generateSlug(name) }));
    }
  };

  const isLoading = createOrganizationMutation.isPending;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Bem-vindo ao V1!
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Para começar, você precisa criar sua primeira organização
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Criar Primeira Organização</CardTitle>
            <CardDescription>
              As organizações ajudam você a gerenciar projetos, equipes e colaborações
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Organização</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Minha Organização"
                  disabled={isLoading}
                  className="text-lg"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug da Organização</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="minha-organizacao"
                  disabled={isLoading}
                  className="text-lg"
                />
                {errors.slug && (
                  <p className="text-sm text-destructive">{errors.slug}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  O slug será usado na URL da organização (ex: v1.com/org/minha-organizacao)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição (opcional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva sua organização, projetos ou objetivos..."
                  rows={3}
                  disabled={isLoading}
                />
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  O que você pode fazer com uma organização?
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    Convidar membros da equipe
                  </li>
                  <li className="flex items-center gap-2">
                    <Building2 className="w-3 h-3" />
                    Organizar projetos e recursos
                  </li>
                  <li className="flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    Gerenciar permissões e acesso
                  </li>
                </ul>
              </div>

              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Criando Organização...
                  </>
                ) : (
                  "Criar Organização e Começar"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
