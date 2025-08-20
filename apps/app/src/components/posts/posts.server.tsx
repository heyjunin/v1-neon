import { createDatabaseAdapter } from "@v1/database/adapters";

export async function PostsServer() {
  const adapter = createDatabaseAdapter();
  const { data, error } = await adapter.getPosts();

  if (error) {
    return <div>Error loading posts</div>;
  }

  return (
    <div>
      {data?.data?.map((post: any) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  );
}
