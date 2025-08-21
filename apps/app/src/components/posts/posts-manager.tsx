"use client";

import { useState } from "react";
import { PostForm } from "./forms";
import { usePostToast } from "./hooks/use-toast";
import { PostsList } from "./lists";
import type { Post } from "./types";
import { PostView } from "./views";

export function PostsManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [viewingPost, setViewingPost] = useState<Post | null>(null);
  const { showSuccess } = usePostToast();

  const handleCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleView = (post: Post) => {
    setViewingPost(post);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const handleCloseView = () => {
    setViewingPost(null);
  };

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
