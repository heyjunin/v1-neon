import { logger } from "@v1/logger";
import { and, asc, desc, eq, like, or, sql } from "drizzle-orm";
import { db } from "../drizzle";
import {
  lms,
  type LMS,
} from "../schema/lms";
import { organizations } from "../schema/organizations";

export interface LMSFilters {
  search?: string;
  organizationId?: string;
  isActive?: boolean;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}

export interface LMSPagination {
  page: number;
  limit: number;
}

export interface LMSResult {
  data: LMS[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getLMS(
  filters?: LMSFilters,
  pagination?: LMSPagination,
): Promise<LMSResult> {
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
          like(lms.name, `%${search}%`),
          like(lms.shortDescription, `%${search}%`),
          like(lms.longDescription, `%${search}%`),
          like(lms.domain, `%${search}%`),
        ),
      );
    }

    if (organizationId) {
      conditions.push(eq(lms.organizationId, organizationId));
    }

    if (isActive !== undefined) {
      conditions.push(eq(lms.isActive, isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    const orderByClause =
      sortOrder === "asc"
        ? asc(lms[sortBy])
        : desc(lms[sortBy]);

    // Get total count
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(lms)
      .where(whereClause);

    const countResult = await countQuery.execute();
    const total = countResult[0]?.count || 0;

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataQuery = db
      .select()
      .from(lms)
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
    logger.error("Error getting LMS:", error);
    throw error;
  }
}

export async function getLMSWithOrganization(
  filters?: LMSFilters,
  pagination?: LMSPagination,
): Promise<
  LMSResult & {
    data: (LMS & {
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
          like(lms.name, `%${search}%`),
          like(lms.shortDescription, `%${search}%`),
          like(lms.longDescription, `%${search}%`),
          like(lms.domain, `%${search}%`),
        ),
      );
    }

    if (organizationId) {
      conditions.push(eq(lms.organizationId, organizationId));
    }

    if (isActive !== undefined) {
      conditions.push(eq(lms.isActive, isActive));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    const orderByClause =
      sortOrder === "asc"
        ? asc(lms[sortBy])
        : desc(lms[sortBy]);

    // Get total count
    const countQuery = db
      .select({ count: sql<number>`count(*)` })
      .from(lms)
      .where(whereClause);

    const countResult = await countQuery.execute();
    const total = countResult[0]?.count || 0;

    // Get paginated data with organization
    const offset = (page - 1) * limit;
    const dataQuery = db
      .select({
        id: lms.id,
        organizationId: lms.organizationId,
        name: lms.name,
        shortDescription: lms.shortDescription,
        longDescription: lms.longDescription,
        ogMetaTags: lms.ogMetaTags,
        seoMetaTags: lms.seoMetaTags,
        domain: lms.domain,
        isMultiLanguage: lms.isMultiLanguage,
        primaryLanguage: lms.primaryLanguage,
        secondaryLanguage: lms.secondaryLanguage,
        primaryTimezone: lms.primaryTimezone,
        secondaryTimezone: lms.secondaryTimezone,
        isActive: lms.isActive,
        createdAt: lms.createdAt,
        updatedAt: lms.updatedAt,
        organization: {
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
        },
      })
      .from(lms)
      .innerJoin(organizations, eq(lms.organizationId, organizations.id))
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
    logger.error("Error getting LMS with organization:", error);
    throw error;
  }
}

export async function getLMSById(lmsId: string): Promise<LMS | null> {
  try {
    const result = await db
      .select()
      .from(lms)
      .where(eq(lms.id, lmsId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error("Error getting LMS by ID:", error);
    throw error;
  }
}

export async function getLMSByIdWithOrganization(lmsId: string): Promise<(LMS & {
  organization: { id: string; name: string; slug: string };
}) | null> {
  try {
    const result = await db
      .select({
        id: lms.id,
        organizationId: lms.organizationId,
        name: lms.name,
        shortDescription: lms.shortDescription,
        longDescription: lms.longDescription,
        ogMetaTags: lms.ogMetaTags,
        seoMetaTags: lms.seoMetaTags,
        domain: lms.domain,
        isMultiLanguage: lms.isMultiLanguage,
        primaryLanguage: lms.primaryLanguage,
        secondaryLanguage: lms.secondaryLanguage,
        primaryTimezone: lms.primaryTimezone,
        secondaryTimezone: lms.secondaryTimezone,
        isActive: lms.isActive,
        createdAt: lms.createdAt,
        updatedAt: lms.updatedAt,
        organization: {
          id: organizations.id,
          name: organizations.name,
          slug: organizations.slug,
        },
      })
      .from(lms)
      .innerJoin(organizations, eq(lms.organizationId, organizations.id))
      .where(eq(lms.id, lmsId))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error("Error getting LMS by ID with organization:", error);
    throw error;
  }
}

export async function getLMSByOrganizationId(organizationId: string): Promise<LMS[]> {
  try {
    return await db
      .select()
      .from(lms)
      .where(eq(lms.organizationId, organizationId))
      .orderBy(desc(lms.createdAt));
  } catch (error) {
    logger.error("Error getting LMS by organization ID:", error);
    throw error;
  }
}

export async function getLMSByDomain(domain: string, organizationId?: string): Promise<LMS | null> {
  try {
    const conditions = [eq(lms.domain, domain)];
    
    if (organizationId) {
      conditions.push(eq(lms.organizationId, organizationId));
    }

    const result = await db
      .select()
      .from(lms)
      .where(and(...conditions))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error("Error getting LMS by domain:", error);
    throw error;
  }
}
