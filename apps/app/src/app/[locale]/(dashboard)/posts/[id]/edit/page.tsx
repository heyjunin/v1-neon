import { PostEditPage } from '@/components/posts/pages/post-edit-page';

interface PostEditPageProps {
  params: {
    id: string;
  };
}

export default function PostEditPageWrapper({ params }: PostEditPageProps) {
  return <PostEditPage postId={params.id} />;
}
