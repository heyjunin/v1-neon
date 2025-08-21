import { logger } from "@v1/logger";
import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "../drizzle";
import {
    blogs,
    type Blog,
} from "../schema/blogs";
import { organizations } from "../schema/organizations";

export interface BlogsFilters {
  search?: string;
  organizationId?: string;
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}

export interface BlogsPagination {
  page: number;
  limit: number;
}

export interface BlogsResult {
  data: Blog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getBlogs(
  filters?: BlogsFilters,
  pagination?: BlogsPagination,
): Promise<BlogsResult> {
  try {
    const {
      search,
      organizationId,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters || {};
    const { page = 1, limit = 10 } = pagination || {};

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(blogs.name, `%${search}%`),
          like(blogs.shortDescription, `%${search}%`),
          like(blogs.longDescription, `%${search}%`),
          like(blogs.domain, `%${search}%`),
        ),
      );
    }

    if (organizationId) {
      conditions.push(eq(blogs.organizationId, organizationId));
    }

    if (isActive !== undefined) {
      conditions.push(eq(blogs.isActive, isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    const orderByClause =
      sortOrder === "asc"
        ? asc(blogs[sortBy])
        : desc(blogs[sortBy]);

    // Get total count
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(blogs)
      .where(whereClause);

    const countResult = await countQuery.execute();
    const total = countResult[0]?.count || 0;

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataQuery = db
      .select()
      .from(blogs)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const data = await dataQuery;

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    logger.error("Error getting blogs:", error);
    throw error;
  }
}

export async function getBlogsWithOrganization(
  filters?: BlogsFilters,
  pagination?: BlogsPagination,
): Promise<
  BlogsResult & {
    data: (Blog & {
      organization: { id: string; name: string; slug: string };
    })[];
  }
> {
  try {
    const {
      search,
      organizationId,
      isActive,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = filters || {};
    const { page = 1, limit = 10 } = pagination || {};

    // Build where conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(blogs.name, `%${search}%`),
          like(blogs.shortDescription, `%${search}%`),
          like(blogs.longDescription, `%${search}%`),
          like(blogs.domain, `%${search}%`),
        ),
      );
    }

    if (organizationId) {
      conditions.push(eq(blogs.organizationId, organizationId));
    }

    if (isActive !== undefined) {
      conditions.push(eq(blogs.isActive, isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    const orderByClause =
      sortOrder === "asc"
        ? asc(blogs[sortBy])
        : desc(blogs[sortBy]);

    // Get total count
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(blogs)
      .where(whereClause);

    const countResult = await countQuery.execute();
    const total = countResult[0]?.count || 0;

    // Get paginated data with organization
    const offset = (page - 1) * limit;
    const dataQuery = db
      .select({
        id: blogs.id,
        organizationId: blogs.organizationId,
        name: blogs.name,
        shortDescription: blogs.shortDescription,
        longDescription: blogs.longDescription,
        ogMetaTags: blogs.ogMetaTags,
        seoMetaTags: blogs.seoMetaTags,
        domain: blogs.domain,
        isMultiLanguage: blogs.isMultiLanguage,
        primaryLanguage: blogs.primaryLanguage,
        secondaryLanguage: blogs.secondaryLanguage,
        primaryTimezone: blogs.primaryTimezone,
        secondaryTimezone: blogs.secondaryTimezone,
        isActive: blogs.isActive,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        organization: {
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
        },
      })
      .from(blogs)
      .innerJoin(organizations, eq(blogs.organizationId, organizations.id))
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    const data = await dataQuery;

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  } catch (error) {
    logger.error("Error getting blogs with organization:", error);
    throw error;
  }
}

export async function getBlogById(blogId: string): Promise<Blog | null> {
  try {
    const result = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, blogId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error("Error getting blog by ID:", error);
    throw error;
  }
}

export async function getBlogByIdWithOrganization(blogId: string): Promise<(Blog & {
  organization: { id: string; name: string; slug: string };
}) | null> {
  try {
    const result = await db
      .select({
        id: blogs.id,
        organizationId: blogs.organizationId,
        name: blogs.name,
        shortDescription: blogs.shortDescription,
        longDescription: blogs.longDescription,
        ogMetaTags: blogs.ogMetaTags,
        seoMetaTags: blogs.seoMetaTags,
        domain: blogs.domain,
        isMultiLanguage: blogs.isMultiLanguage,
        primaryLanguage: blogs.primaryLanguage,
        secondaryLanguage: blogs.secondaryLanguage,
        primaryTimezone: blogs.primaryTimezone,
        secondaryTimezone: blogs.secondaryTimezone,
        isActive: blogs.isActive,
        createdAt: blogs.createdAt,
        updatedAt: blogs.updatedAt,
        organization: {
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
        },
      })
      .from(blogs)
      .innerJoin(organizations, eq(blogs.organizationId, organizations.id))
      .where(eq(blogs.id, blogId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error("Error getting blog by ID with organization:", error);
    throw error;
  }
}

export async function getBlogsByOrganizationId(organizationId: string): Promise<Blog[]> {
  try {
    return await db
      .select()
      .from(blogs)
      .where(eq(blogs.organizationId, organizationId))
      .orderBy(desc(blogs.createdAt));
  } catch (error) {
    logger.error("Error getting blogs by organization ID:", error);
    throw error;
  }
}

export async function getBlogByDomain(domain: string, organizationId?: string): Promise<Blog | null> {
  try {
    const conditions = [eq(blogs.domain, domain)];
    
    if (organizationId) {
      conditions.push(eq(blogs.organizationId, organizationId));
    }

    const result = await db
      .select()
      .from(blogs)
      .where(and(...conditions))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error("Error getting blog by domain:", error);
    throw error;
  }
}
