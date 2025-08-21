"use client";

import { useActionToast, useCrudManager } from "@v1/ui";
import { PostForm } from "./forms";
import { PostsList } from "./lists";
import type { Post } from "./types";
import { PostView } from "./views";

export function PostsManager() {
  const {
    isFormOpen,
    editingItem: editingPost,
    viewingItem: viewingPost,
    handleCreate,
    handleEdit,
    handleView,
    handleCloseForm,
    handleCloseView,
  } = useCrudManager<Post>();
  
  const { showSuccess } = useActionToast();

  const handleFormSuccess = () => {
    showSuccess(
      editingPost ? "Post atualizado com sucesso!" : "Post criado com sucesso!",
    );
  };

  return (
    <div className="space-y-6">
      {/* Posts List */}
      <PostsList
        onEdit={handleEdit}
        onCreate={handleCreate}
        onView={handleView}
      />

      {/* Post Form */}
      <PostForm
        post={editingPost}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />

      {/* Post View */}
      {viewingPost && (
        <PostView
          post={viewingPost}
          isOpen={!!viewingPost}
          onClose={handleCloseView}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}
