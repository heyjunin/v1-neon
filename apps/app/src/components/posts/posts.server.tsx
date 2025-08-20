'use client';

import { usePosts } from '@/lib/trpc';

export function PostsClient() {
  const { data, isLoading, error } = usePosts();

  if (isLoading) {
    return <div>Loading posts...</div>;
  }

  if (error) {
    return <div>Error loading posts: {error.message}</div>;
  }

  if (!data?.data || data.data.length === 0) {
    return <div>No posts found</div>;
  }

  return (
    <div>
      {data.data.map((post: any) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
