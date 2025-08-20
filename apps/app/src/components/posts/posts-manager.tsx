'use client';

import { useState } from 'react';
import { InlineNotification } from './inline-notification';
import { PostForm } from './post-form';
import { PostsList } from './posts-list';
import type { Post } from './types';
import { useNotification } from './use-notification';

export function PostsManager() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const { notification, showNotification, hideNotification } = useNotification();

  const handleCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingPost(null);
  };

  const handleFormSuccess = () => {
    showNotification('success', editingPost ? 'Post atualizado com sucesso!' : 'Post criado com sucesso!');
  };

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.isVisible && (
        <InlineNotification
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
        />
      )}

      {/* Posts List */}
      <PostsList
        onEdit={handleEdit}
        onCreate={handleCreate}
      />

      {/* Post Form */}
      <PostForm
        post={editingPost}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
