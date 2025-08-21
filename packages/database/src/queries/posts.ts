import { logger } from "@v1/logger";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "../drizzle";
import { posts, type Post } from "../schema/posts";
import { users } from "../schema/users";
import {
  PaginatedResult,
  PaginationOptions,
  QueryBuilder,
  executePaginatedQuery,
} from "../utils";

export interface PostsFilters {
  search?: string;
  userId?: string;
  organizationId?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export type PostsResult = PaginatedResult<Post>;

export async function getPosts(
  filters?: PostsFilters,
  pagination?: PaginationOptions,
): Promise<PostsResult> {
  try {
    const {
      search,
      userId,
      organizationId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters || {};

    const queryBuilder = new QueryBuilder()
      .addSearch([posts.title, posts.content], search)
      .addFilter(posts.userId, userId)
      .addFilter(posts.organizationId, organizationId);

    const whereClause = queryBuilder.build();

    const baseQuery = db.select().from(posts).where(whereClause);
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(whereClause);

    return executePaginatedQuery({
      baseQuery,
      countQuery,
      filters,
      pagination,
      sortBy: posts[sortBy as keyof typeof posts],
      sortOrder,
    });
  } catch (error) {
    logger.error("Error getting posts:", error);
    throw error;
  }
}

export async function getPostsWithUsers(
  filters?: PostsFilters,
  pagination?: PaginationOptions,
): Promise<
  PostsResult & {
    data: (Post & {
      user: { id: string; email: string; fullName: string | null };
    })[];
  }
> {
  try {
    const {
      search,
      userId,
      organizationId,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters || {};

    const queryBuilder = new QueryBuilder()
      .addSearch([posts.title, posts.content], search)
      .addFilter(posts.userId, userId)
      .addFilter(posts.organizationId, organizationId);

    const whereClause = queryBuilder.build();

    const baseQuery = db
      .select({
        id: posts.id,
        userId: posts.userId,
        organizationId: posts.organizationId,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(whereClause);

    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(whereClause);

    return executePaginatedQuery({
      baseQuery,
      countQuery,
      filters,
      pagination,
      sortBy: posts[sortBy as keyof typeof posts],
      sortOrder,
    });
  } catch (error) {
    logger.error("Error getting posts with users:", error);
    throw error;
  }
}

export async function getPostById(postId: string): Promise<Post | null> {
  try {
    const result = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error("Error getting post by ID:", error);
    throw error;
  }
}

export async function getPostByIdWithUser(postId: string): Promise<(Post & {
  user: { id: string; email: string; fullName: string | null };
}) | null> {
  try {
    const result = await db
      .select({
        id: posts.id,
        userId: posts.userId,
        organizationId: posts.organizationId,
        title: posts.title,
        content: posts.content,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName,
        },
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .where(eq(posts.id, postId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error("Error getting post by ID with user:", error);
    throw error;
  }
}

export async function getPostsByUserId(userId: string): Promise<Post[]> {
  try {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.userId, userId))
      .orderBy(desc(posts.createdAt));
  } catch (error) {
    logger.error("Error getting posts by user ID:", error);
    throw error;
  }
}

export async function getPostsByOrganizationId(organizationId: string): Promise<Post[]> {
  try {
    return await db
      .select()
      .from(posts)
      .where(eq(posts.organizationId, organizationId))
      .orderBy(desc(posts.createdAt));
  } catch (error) {
    logger.error("Error getting posts by organization ID:", error);
    throw error;
  }
}
