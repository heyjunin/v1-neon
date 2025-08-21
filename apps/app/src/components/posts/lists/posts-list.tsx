"use client";

import { useDeletePost, usePosts } from "@/lib/trpc";
import { Button } from "@v1/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@v1/ui/card";
import { Input } from "@v1/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import { formatDate } from "@v1/utils";
import {
  Calendar,
  Edit,
  ExternalLink,
  Eye,
  Grid3X3,
  List,
  Loader2,
  Plus,
  Search,
  Trash2,
  User
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useActionToast } from "../components/action-toast";
import { ConfirmationDialog } from "../components/dialogs";
import { useConfirmation } from "../hooks/use-confirmation";
import { useViewMode } from "../hooks/use-view-mode";
import { Post } from "../types";

interface PostsListProps {
  onEdit: (post: Post) => void;
  onCreate: () => void;
  onView?: (post: Post) => void;
}

export function PostsList({ onEdit, onCreate, onView }: PostsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const { data: posts, isLoading, refetch, error } = usePosts();
  const deletePostMutation = useDeletePost();
  const { showSuccess, showError } = useActionToast();
  const { confirmation, openConfirmation, closeConfirmation, confirmAction } =
    useConfirmation();
  const { viewMode, setViewMode, isLoaded } = useViewMode();

  // Ensure posts is always an array and handle loading/error states
  const postsArray = React.useMemo(() => {
    if (!posts) return [];

    // If posts is an object with data property (paginated response)
    if (
      typeof posts === "object" &&
      "data" in posts &&
      Array.isArray(posts.data)
    ) {
      return posts.data;
    }

    // If posts is already an array
    if (Array.isArray(posts)) {
      return posts;
    }

    // Fallback to empty array
    return [];
  }, [posts]);

  const filteredPosts = postsArray.filter((post: Post) => {
    if (!post || typeof post !== "object") return false;

    const title = post.title || "";
    const content = post.content || "";

    return (
      title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      content.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDelete = async (id: string) => {
    try {
      setLoadingStates(prev => ({ ...prev, [id]: true }));
      await deletePostMutation.mutateAsync({ id });
      await refetch();
      showSuccess("Post excluído com sucesso!");
    } catch (error) {
      showError("Erro ao excluir post. Tente novamente.");
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDeleteClick = (post: Post) => {
    openConfirmation(post.id, post.title, "delete");
  };

  const handleConfirmDelete = async () => {
    await confirmAction(handleDelete);
  };

  const isDeleting = loadingStates[confirmation.itemId || ""] || false;

  const handleViewClick = (post: Post) => {
    if (onView) {
      setLoadingStates(prev => ({ ...prev, [`view-${post.id}`]: true }));
      try {
        onView(post);
      } finally {
        setTimeout(() => {
          setLoadingStates(prev => ({ ...prev, [`view-${post.id}`]: false }));
        }, 500);
      }
    }
  };

  const handleEditClick = (post: Post) => {
    setLoadingStates(prev => ({ ...prev, [`edit-${post.id}`]: true }));
    try {
      onEdit(post);
    } finally {
      setTimeout(() => {
        setLoadingStates(prev => ({ ...prev, [`edit-${post.id}`]: false }));
      }, 500);
    }
  };

  // Handle error state
  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Posts</h2>
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Post
          </Button>
        </div>
        <div className="text-center py-12">
          <div className="text-red-500 mb-4">
            Erro ao carregar posts: {error.message || "Erro desconhecido"}
          </div>
          <Button onClick={() => refetch()}>Tentar novamente</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Posts</h2>
        <Button onClick={onCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Post
        </Button>
      </div>

      {/* Search and View Toggle */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* View Mode Toggle */}
        {isLoaded && (
          <div className="flex items-center border rounded-md bg-background">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none border-r"
              title="Visualização em grade"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
              title="Visualização em tabela"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Results count */}
      {!isLoading && filteredPosts.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} encontrado{filteredPosts.length !== 1 ? 's' : ''}
          {searchTerm && ` para "${searchTerm}"`}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            {searchTerm
              ? "Nenhum post encontrado para sua busca."
              : "Nenhum post criado ainda."}
          </div>
          {!searchTerm && (
            <Button onClick={onCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Post
            </Button>
          )}
        </div>
      )}

      {/* Posts Grid View */}
      {!isLoading && filteredPosts.length > 0 && viewMode === "grid" && (
        <div className="grid gap-4">
          {filteredPosts.map((post: Post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {post.content}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {onView && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewClick(post)}
                        disabled={loadingStates[`view-${post.id}`]}
                      >
                        {loadingStates[`view-${post.id}`] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                    <Link href={`/posts/${post.id}`}>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(post)}
                      disabled={loadingStates[`edit-${post.id}`]}
                    >
                      {loadingStates[`edit-${post.id}`] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Edit className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(post)}
                      disabled={loadingStates[post.id]}
                    >
                      {loadingStates[post.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>
                      {post.user?.fullName || post.user?.email || "Usuário"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {formatDate(post.createdAt)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Posts Table View */}
      {!isLoading && filteredPosts.length > 0 && viewMode === "list" && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Post</TableHead>
                <TableHead>Conteúdo</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post: Post) => (
                <TableRow
                  key={post.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => onView && handleViewClick(post)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-2">
                      <div>
                        <div className="font-medium">{post.title}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {post.id}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate" title={post.content}>
                      {post.content}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {post.user?.fullName || post.user?.email || "Usuário"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDate(post.createdAt)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {onView && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClick(post);
                          }}
                          disabled={loadingStates[`view-${post.id}`]}
                        >
                          {loadingStates[`view-${post.id}`] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Link href={`/posts/${post.id}`}>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(post);
                        }}
                        disabled={loadingStates[`edit-${post.id}`]}
                      >
                        {loadingStates[`edit-${post.id}`] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Edit className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(post);
                        }}
                        disabled={loadingStates[post.id]}
                      >
                        {loadingStates[post.id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmation.isOpen}
        onClose={closeConfirmation}
        onConfirm={handleConfirmDelete}
        title="Excluir Post"
        description={`Tem certeza que deseja excluir o post "${confirmation.itemTitle}"? Esta ação não pode ser desfeita.`}
        actionType="delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
