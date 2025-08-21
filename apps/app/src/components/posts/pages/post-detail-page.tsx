"use client";

import { useDeletePost, usePost } from "@/lib/trpc";
import { Button } from "@v1/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@v1/ui/card";
import { ArrowLeft, Calendar, Edit, Trash2, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmationDialog } from "../components/dialogs";
import { useConfirmation } from "../hooks/use-confirmation";
import { usePostToast } from "../hooks/use-toast";
// Função utilitária para formatar datas do projeto
const formatPostDate = (date: string | null, includeTime = false) => {
  if (!date) return "Data não disponível";
  
  try {
    const dateObj = new Date(date);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    
    if (includeTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    
    return dateObj.toLocaleDateString("pt-BR", options);
  } catch {
    return "Data não disponível";
  }
};

const areDatesEqual = (date1: string | null, date2: string | null) => {
  if (!date1 && !date2) return true;
  if (!date1 || !date2) return false;
  
  try {
    return new Date(date1).getTime() === new Date(date2).getTime();
  } catch {
    return false;
  }
};

interface PostDetailPageProps {
  postId: string;
}

export function PostDetailPage({ postId }: PostDetailPageProps) {
  const router = useRouter();
  const { data: post, isLoading, error } = usePost(postId);
  const deletePostMutation = useDeletePost();
  const { showSuccess, showError } = usePostToast();
  const { confirmation, openConfirmation, closeConfirmation, confirmAction } =
    useConfirmation();

  const handleDelete = async (id: string) => {
    try {
      await deletePostMutation.mutateAsync({ id });
      showSuccess("Post excluído com sucesso!");
      router.push("/posts");
    } catch (error) {
      showError("Erro ao excluir post. Tente novamente.");
    }
  };

  const handleDeleteClick = () => {
    if (post) {
      openConfirmation(post.id, post.title, "delete");
    }
  };

  const handleConfirmDelete = async () => {
    await confirmAction(handleDelete);
  };

  const handleEdit = () => {
    if (post) {
      router.push(`/posts/${post.id}/edit`);
    }
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
            <h1 className="text-3xl font-bold">{post.title}</h1>
            <p className="text-gray-500">Visualizando detalhes do post</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" size="sm" onClick={handleDeleteClick}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Post Content */}
        <Card>
          <CardHeader>
            <CardTitle>Conteúdo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                {post.content}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Post Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Autor:</strong>{" "}
                  {post.user?.fullName || post.user?.email || "Usuário"}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  <strong>Criado em:</strong>{" "}
                  {formatPostDate(post.createdAt, true)}
                </span>
              </div>

              {post.updatedAt && !areDatesEqual(post.updatedAt, post.createdAt) && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Atualizado em:</strong>{" "}
                    {formatPostDate(post.updatedAt, true)}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmDelete}
        title="Excluir Post"
        description={`Tem certeza que deseja excluir o post "${confirmation.itemTitle}"? Esta ação não pode ser desfeita.`}
        actionType="delete"
      />
    </div>
  );
}
