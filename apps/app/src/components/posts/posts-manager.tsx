'use client';

import { useState } from 'react';
import { PostNotification } from './components/notification';
import { PostForm } from './forms';
import { useNotification } from './hooks/use-notification';
import { PostsList } from './lists';
import type { Post } from './types';

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
        <PostNotification
          type={notification.type}
          message={notification.message}
          onClose={hideNotification}
          variant="inline"
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
