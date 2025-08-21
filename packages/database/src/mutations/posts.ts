import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { posts, type NewPost, type Post } from "../schema/posts";
import { createEntity, deleteEntity, updateEntity } from "../utils";

export async function createPost(postData: NewPost): Promise<Post> {
  return createEntity(
    (data) => db.insert(posts).values(data).returning(),
    postData,
    "post",
  );
}

export async function updatePost(
  postId: string,
  postData: Partial<Omit<NewPost, "id" | "createdAt">>,
): Promise<Post | null> {
  return updateEntity(
    (id, data) =>
      db
        .update(posts)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(posts.id, id))
        .returning(),
    postId,
    postData,
    "post",
  );
}

export async function deletePost(postId: string): Promise<boolean> {
  return deleteEntity(
    (id) => db.delete(posts).where(eq(posts.id, id)).returning(),
    postId,
    "post",
  );
}

export async function deletePostsByUserId(userId: string): Promise<number> {
  const result = await db
    .delete(posts)
    .where(eq(posts.userId, userId))
    .returning();
  return result.length;
}

export async function deletePostsByOrganizationId(organizationId: string): Promise<number> {
  const result = await db
    .delete(posts)
    .where(eq(posts.organizationId, organizationId))
    .returning();
  return result.length;
}
