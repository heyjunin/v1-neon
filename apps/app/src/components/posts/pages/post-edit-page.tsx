"use client";

import { usePost, useUpdatePost } from "@/lib/trpc";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import { Textarea } from "@v1/ui/textarea";
import { ArrowLeft, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePostToast } from "../hooks/use-toast";
import { PostFormData } from "../types";

interface PostEditPageProps {
  postId: string;
}

export function PostEditPage({ postId }: PostEditPageProps) {
  const router = useRouter();
  const { data: post, isLoading, error } = usePost(postId);
  const updatePostMutation = useUpdatePost();
  const { showSuccess, showError } = usePostToast();

  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    content: "",
  });

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        content: post.content,
      });
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!post) return;

    try {
      await updatePostMutation.mutateAsync({
        id: post.id,
        title: formData.title,
        content: formData.content,
      });

      showSuccess("Post atualizado com sucesso!");
      router.push(`/posts/${post.id}`);
    } catch (error) {
      showError("Erro ao atualizar post. Tente novamente.");
    }
  };

  const handleInputChange = (field: keyof PostFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            {error
              ? `Erro ao carregar post: ${error.message}`
              : "Post não encontrado"}
          </div>
          <Button onClick={() => router.push("/posts")}>
            Voltar para Posts
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Editar Post</h1>
            <p className="text-gray-500">Atualizando informações do post</p>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Formulário de Edição</CardTitle>
          <CardDescription>
            Atualize as informações do post abaixo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Título
              </label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Digite o título do post"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Conteúdo
              </label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Digite o conteúdo do post"
                rows={10}
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <Button type="submit" disabled={updatePostMutation.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {updatePostMutation.isPending
                  ? "Salvando..."
                  : "Salvar Alterações"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
