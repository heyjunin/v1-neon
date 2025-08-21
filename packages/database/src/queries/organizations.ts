import { logger } from '@v1/logger';
import { and, asc, desc, eq, like, or, sql } from 'drizzle-orm';
import { db } from '../drizzle';
import { organizationInvites, organizationMembers, organizations, type Organization, type OrganizationInvite, type OrganizationMember } from '../schema/organizations';
import { users } from '../schema/users';

export interface OrganizationsFilters {
  search?: string;
  ownerId?: string;
  memberId?: string;
  isActive?: boolean;
  sortBy?: 'createdAt' | 'updatedAt' | 'name';
  sortOrder?: 'asc' | 'desc';
}

export interface OrganizationsPagination {
  page: number;
  limit: number;
}

export interface OrganizationsResult {
  data: Organization[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getOrganizations(filters?: OrganizationsFilters, pagination?: OrganizationsPagination): Promise<OrganizationsResult> {
  try {
    const { search, ownerId, memberId, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = filters || {};
    const { page = 1, limit = 10 } = pagination || {};

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(organizations.name, `%${search}%`),
          like(organizations.description, `%${search}%`),
          like(organizations.slug, `%${search}%`)
        )
      );
    }
    
    if (ownerId) {
      conditions.push(eq(organizations.ownerId, ownerId));
    }

    if (isActive !== undefined) {
      conditions.push(eq(organizations.isActive, isActive));
    }

    if (memberId) {
      // Join with members table to filter by member
      const memberConditions = and(
        eq(organizationMembers.organizationId, organizations.id),
        eq(organizationMembers.userId, memberId),
        eq(organizationMembers.status, 'active')
      );
      conditions.push(memberConditions);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    const orderByClause = sortOrder === 'asc' 
      ? asc(organizations[sortBy]) 
      : desc(organizations[sortBy]);

    // Get total count
    const countQuery = memberId 
      ? db
          .select({ count: sql<number>`count(distinct ${organizations.id})` })
          .from(organizations)
          .innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
          .where(whereClause)
      : db
          .select({ count: sql<number>`count(*)` })
          .from(organizations)
          .where(whereClause);

    const countResult = await countQuery.execute();
    const total = countResult[0]?.count || 0;

    // Get paginated data
    const offset = (page - 1) * limit;
    const dataQuery = memberId
      ? db
          .selectDistinct({
            id: organizations.id,
            name: organizations.name,
            slug: organizations.slug,
            description: organizations.description,
            logoUrl: organizations.logoUrl,
            ownerId: organizations.ownerId,
            isActive: organizations.isActive,
            createdAt: organizations.createdAt,
            updatedAt: organizations.updatedAt,
          })
          .from(organizations)
          .innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
          .where(whereClause)
          .orderBy(orderByClause)
          .limit(limit)
          .offset(offset)
      : db
          .select()
          .from(organizations)
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
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error('Error getting organizations:', error);
    throw error;
  }
}

export async function getOrganizationsWithOwner(filters?: OrganizationsFilters, pagination?: OrganizationsPagination): Promise<OrganizationsResult & { data: (Organization & { owner: { id: string; email: string; fullName: string | null } })[] }> {
  try {
    const { search, ownerId, memberId, isActive, sortBy = 'createdAt', sortOrder = 'desc' } = filters || {};
    const { page = 1, limit = 10 } = pagination || {};

    // Build where conditions
    const conditions = [];
    
    if (search) {
      conditions.push(
        or(
          like(organizations.name, `%${search}%`),
          like(organizations.description, `%${search}%`),
          like(organizations.slug, `%${search}%`)
        )
      );
    }
    
    if (ownerId) {
      conditions.push(eq(organizations.ownerId, ownerId));
    }

    if (isActive !== undefined) {
      conditions.push(eq(organizations.isActive, isActive));
    }

    if (memberId) {
      const memberConditions = and(
        eq(organizationMembers.organizationId, organizations.id),
        eq(organizationMembers.userId, memberId),
        eq(organizationMembers.status, 'active')
      );
      conditions.push(memberConditions);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Build order by
    const orderByClause = sortOrder === 'asc' 
      ? asc(organizations[sortBy]) 
      : desc(organizations[sortBy]);

    // Get total count
    const countQuery = memberId 
      ? db
          .select({ count: sql<number>`count(distinct ${organizations.id})` })
          .from(organizations)
          .innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
          .innerJoin(users, eq(organizations.ownerId, users.id))
          .where(whereClause)
      : db
          .select({ count: sql<number>`count(*)` })
          .from(organizations)
          .innerJoin(users, eq(organizations.ownerId, users.id))
          .where(whereClause);

    const countResult = await countQuery.execute();
    const total = countResult[0]?.count || 0;

    // Get paginated data with owner
    const offset = (page - 1) * limit;
    const dataQuery = memberId
      ? db
          .selectDistinct({
            id: organizations.id,
            name: organizations.name,
            slug: organizations.slug,
            description: organizations.description,
            logoUrl: organizations.logoUrl,
            ownerId: organizations.ownerId,
            isActive: organizations.isActive,
            createdAt: organizations.createdAt,
            updatedAt: organizations.updatedAt,
            owner: {
              id: users.id,
              email: users.email,
              fullName: users.fullName,
            },
          })
          .from(organizations)
          .innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
          .innerJoin(users, eq(organizations.ownerId, users.id))
          .where(whereClause)
          .orderBy(orderByClause)
          .limit(limit)
          .offset(offset)
      : db
          .select({
            id: organizations.id,
            name: organizations.name,
            slug: organizations.slug,
            description: organizations.description,
            logoUrl: organizations.logoUrl,
            ownerId: organizations.ownerId,
            isActive: organizations.isActive,
            createdAt: organizations.createdAt,
            updatedAt: organizations.updatedAt,
            owner: {
              id: users.id,
              email: users.email,
              fullName: users.fullName,
            },
          })
          .from(organizations)
          .innerJoin(users, eq(organizations.ownerId, users.id))
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
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    logger.error('Error getting organizations with owner:', error);
    throw error;
  }
}

export async function getOrganizationById(organizationId: string): Promise<Organization | null> {
  try {
    const result = await db.select().from(organizations).where(eq(organizations.id, organizationId)).limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error('Error getting organization by ID:', error);
    throw error;
  }
}

export async function getOrganizationBySlug(slug: string): Promise<Organization | null> {
  try {
    const result = await db.select().from(organizations).where(eq(organizations.slug, slug)).limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error('Error getting organization by slug:', error);
    throw error;
  }
}

export async function getOrganizationsByOwnerId(ownerId: string): Promise<Organization[]> {
  try {
    return await db.select().from(organizations).where(eq(organizations.ownerId, ownerId)).orderBy(desc(organizations.createdAt));
  } catch (error) {
    logger.error('Error getting organizations by owner ID:', error);
    throw error;
  }
}

export async function getOrganizationsByMemberId(memberId: string): Promise<Organization[]> {
  try {
    return await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        description: organizations.description,
        logoUrl: organizations.logoUrl,
        ownerId: organizations.ownerId,
        isActive: organizations.isActive,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
      })
      .from(organizations)
      .innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
      .where(and(
        eq(organizationMembers.userId, memberId),
        eq(organizationMembers.status, 'active')
      ))
      .orderBy(desc(organizations.createdAt));
  } catch (error) {
    logger.error('Error getting organizations by member ID:', error);
    throw error;
  }
}

// Member queries
export async function getOrganizationMembers(organizationId: string): Promise<(OrganizationMember & { user: { id: string; email: string; fullName: string | null } })[]> {
  try {
    return await db
      .select({
        id: organizationMembers.id,
        organizationId: organizationMembers.organizationId,
        userId: organizationMembers.userId,
        role: organizationMembers.role,
        status: organizationMembers.status,
        invitedBy: organizationMembers.invitedBy,
        invitedAt: organizationMembers.invitedAt,
        joinedAt: organizationMembers.joinedAt,
        createdAt: organizationMembers.createdAt,
        updatedAt: organizationMembers.updatedAt,
        user: {
          id: users.id,
          email: users.email,
          fullName: users.fullName,
        },
      })
      .from(organizationMembers)
      .innerJoin(users, eq(organizationMembers.userId, users.id))
      .where(eq(organizationMembers.organizationId, organizationId))
      .orderBy(asc(organizationMembers.role), asc(users.fullName));
  } catch (error) {
    logger.error('Error getting organization members:', error);
    throw error;
  }
}

export async function getOrganizationMember(organizationId: string, userId: string): Promise<OrganizationMember | null> {
  try {
    const result = await db
      .select()
      .from(organizationMembers)
      .where(and(
        eq(organizationMembers.organizationId, organizationId),
        eq(organizationMembers.userId, userId)
      ))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error('Error getting organization member:', error);
    throw error;
  }
}

export async function getUserOrganizations(userId: string): Promise<(Organization & { role: string; status: string })[]> {
  try {
    return await db
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        description: organizations.description,
        logoUrl: organizations.logoUrl,
        ownerId: organizations.ownerId,
        isActive: organizations.isActive,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
        role: organizationMembers.role,
        status: organizationMembers.status,
      })
      .from(organizations)
      .innerJoin(organizationMembers, eq(organizations.id, organizationMembers.organizationId))
      .where(and(
        eq(organizationMembers.userId, userId),
        eq(organizationMembers.status, 'active')
      ))
      .orderBy(desc(organizations.createdAt));
  } catch (error) {
    logger.error('Error getting user organizations:', error);
    throw error;
  }
}

// Invite queries
export async function getOrganizationInvites(organizationId: string): Promise<(OrganizationInvite & { invitedByUser: { id: string; email: string; fullName: string | null } })[]> {
  try {
    return await db
      .select({
        id: organizationInvites.id,
        organizationId: organizationInvites.organizationId,
        email: organizationInvites.email,
        role: organizationInvites.role,
        invitedBy: organizationInvites.invitedBy,
        token: organizationInvites.token,
        expiresAt: organizationInvites.expiresAt,
        status: organizationInvites.status,
        acceptedAt: organizationInvites.acceptedAt,
        acceptedBy: organizationInvites.acceptedBy,
        createdAt: organizationInvites.createdAt,
        updatedAt: organizationInvites.updatedAt,
        invitedByUser: {
          id: users.id,
          email: users.email,
          fullName: users.fullName,
        },
      })
      .from(organizationInvites)
      .innerJoin(users, eq(organizationInvites.invitedBy, users.id))
      .where(eq(organizationInvites.organizationId, organizationId))
      .orderBy(desc(organizationInvites.createdAt));
  } catch (error) {
    logger.error('Error getting organization invites:', error);
    throw error;
  }
}

export async function getInviteByToken(token: string): Promise<OrganizationInvite | null> {
  try {
    const result = await db
      .select()
      .from(organizationInvites)
      .where(eq(organizationInvites.token, token))
      .limit(1);
    return result[0] || null;
  } catch (error) {
    logger.error('Error getting invite by token:', error);
    throw error;
  }
}

export async function getPendingInvitesByEmail(email: string): Promise<OrganizationInvite[]> {
  try {
    return await db
      .select()
      .from(organizationInvites)
      .where(and(
        eq(organizationInvites.email, email),
        eq(organizationInvites.status, 'pending'),
        sql`${organizationInvites.expiresAt} > now()`
      ))
      .orderBy(desc(organizationInvites.createdAt));
  } catch (error) {
    logger.error('Error getting pending invites by email:', error);
    throw error;
  }
}
