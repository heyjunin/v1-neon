import { PostDetailPage } from '@/components/posts/pages/post-detail-page';

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  return <PostDetailPage postId={params.id} />;
}
