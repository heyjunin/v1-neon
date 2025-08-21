import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { blogs, type NewBlog, type Blog } from "../schema/blogs";
import { createEntity, deleteEntity, updateEntity } from "../utils";

export async function createBlog(blogData: NewBlog): Promise<Blog> {
  return createEntity(
    (data) => db.insert(blogs).values(data).returning(),
    blogData,
    "blog",
  );
}

export async function updateBlog(
  blogId: string,
  blogData: Partial<Omit<NewBlog, "id" | "createdAt">>,
): Promise<Blog | null> {
  return updateEntity(
    (id, data) =>
      db
        .update(blogs)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(blogs.id, id))
        .returning(),
    blogId,
    blogData,
    "blog",
  );
}

export async function deleteBlog(blogId: string): Promise<boolean> {
  return deleteEntity(
    (id) => db.delete(blogs).where(eq(blogs.id, id)).returning(),
    blogId,
    "blog",
  );
}

export async function deleteBlogsByOrganizationId(organizationId: string): Promise<number> {
  const result = await db
    .delete(blogs)
    .where(eq(blogs.organizationId, organizationId))
    .returning();
  return result.length;
}
