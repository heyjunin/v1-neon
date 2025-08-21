import { logger } from "@v1/logger";
import { randomUUID } from "crypto";
import { and, eq, sql } from "drizzle-orm";
import { db } from "../drizzle";
import {
  organizationInvites,
  organizationMembers,
  organizations,
  type NewOrganization,
  type NewOrganizationInvite,
  type NewOrganizationMember,
  type Organization,
  type OrganizationInvite,
  type OrganizationMember,
} from "../schema/organizations";

// Organization mutations
export async function createOrganization(
  organizationData: NewOrganization,
): Promise<Organization> {
  try {
    const result = await db
      .insert(organizations)
      .values(organizationData)
      .returning();
    if (!result[0]) {
      throw new Error("Failed to create organization: no rows returned");
    }
    return result[0];
  } catch (error) {
    logger.error("Error creating organization:", error);
    throw error;
  }
}

export async function updateOrganization(
  organizationId: string,
  organizationData: Partial<Omit<NewOrganization, "id" | "createdAt">>,
): Promise<Organization | null> {
  try {
    const result = await db
      .update(organizations)
      .set({ ...organizationData, updatedAt: new Date() })
      .where(eq(organizations.id, organizationId))
      .returning();
    return result[0] || null;
  } catch (error) {
    logger.error("Error updating organization:", error);
    throw error;
  }
}

export async function deleteOrganization(
  organizationId: string,
): Promise<boolean> {
  try {
    const result = await db
      .delete(organizations)
      .where(eq(organizations.id, organizationId))
      .returning();
    return result.length > 0;
  } catch (error) {
    logger.error("Error deleting organization:", error);
    throw error;
  }
}

export async function deactivateOrganization(
  organizationId: string,
): Promise<boolean> {
  try {
    const result = await db
      .update(organizations)
      .set({ isActive: false, updatedAt: new Date() })
      .where(eq(organizations.id, organizationId))
      .returning();
    return result.length > 0;
  } catch (error) {
    logger.error("Error deactivating organization:", error);
    throw error;
  }
}

export async function activateOrganization(
  organizationId: string,
): Promise<boolean> {
  try {
    const result = await db
      .update(organizations)
      .set({ isActive: true, updatedAt: new Date() })
      .where(eq(organizations.id, organizationId))
      .returning();
    return result.length > 0;
  } catch (error) {
    logger.error("Error activating organization:", error);
    throw error;
  }
}

// Member mutations
export async function addMemberToOrganization(
  memberData: NewOrganizationMember,
): Promise<OrganizationMember> {
  try {
    const result = await db
      .insert(organizationMembers)
      .values(memberData)
      .returning();
    if (!result[0]) {
      throw new Error("Failed to add member to organization: no rows returned");
    }
    return result[0];
  } catch (error) {
    logger.error("Error adding member to organization:", error);
    throw error;
  }
}

export async function updateMemberRole(
  organizationId: string,
  userId: string,
  role: string,
): Promise<OrganizationMember | null> {
  try {
    const result = await db
      .update(organizationMembers)
      .set({ role, updatedAt: new Date() })
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId),
        ),
      )
      .returning();
    return result[0] || null;
  } catch (error) {
    logger.error("Error updating member role:", error);
    throw error;
  }
}

export async function removeMemberFromOrganization(
  organizationId: string,
  userId: string,
): Promise<boolean> {
  try {
    const result = await db
      .delete(organizationMembers)
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId),
        ),
      )
      .returning();
    return result.length > 0;
  } catch (error) {
    logger.error("Error removing member from organization:", error);
    throw error;
  }
}

export async function suspendMember(
  organizationId: string,
  userId: string,
): Promise<boolean> {
  try {
    const result = await db
      .update(organizationMembers)
      .set({ status: "suspended", updatedAt: new Date() })
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId),
        ),
      )
      .returning();
    return result.length > 0;
  } catch (error) {
    logger.error("Error suspending member:", error);
    throw error;
  }
}

export async function activateMember(
  organizationId: string,
  userId: string,
): Promise<boolean> {
  try {
    const result = await db
      .update(organizationMembers)
      .set({ status: "active", updatedAt: new Date() })
      .where(
        and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId),
        ),
      )
      .returning();
    return result.length > 0;
  } catch (error) {
    logger.error("Error activating member:", error);
    throw error;
  }
}

// Invite mutations
export async function createInvite(
  inviteData: Omit<NewOrganizationInvite, "token" | "expiresAt">,
): Promise<OrganizationInvite> {
  try {
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const result = await db
      .insert(organizationInvites)
      .values({
        ...inviteData,
        token,
        expiresAt,
      })
      .returning();

    if (!result[0]) {
      throw new Error("Failed to create invite: no rows returned");
    }
    return result[0];
  } catch (error) {
    logger.error("Error creating invite:", error);
    throw error;
  }
}

export async function acceptInvite(
  token: string,
  acceptedBy: string,
): Promise<{ invite: OrganizationInvite; member: OrganizationMember } | null> {
  try {
    // Start a transaction
    return await db.transaction(async (tx) => {
      // Get the invite
      const inviteResult = await tx
        .select()
        .from(organizationInvites)
        .where(
          and(
            eq(organizationInvites.token, token),
            eq(organizationInvites.status, "pending"),
            sql`${organizationInvites.expiresAt} > now()`,
          ),
        )
        .limit(1);

      if (!inviteResult[0]) {
        throw new Error("Invalid or expired invite");
      }

      const invite = inviteResult[0];

      // Update invite status
      const updatedInvite = await tx
        .update(organizationInvites)
        .set({
          status: "accepted",
          acceptedAt: new Date(),
          acceptedBy,
          updatedAt: new Date(),
        })
        .where(eq(organizationInvites.id, invite.id))
        .returning();

      // Add member to organization
      const member = await tx
        .insert(organizationMembers)
        .values({
          organizationId: invite.organizationId,
          userId: acceptedBy,
          role: invite.role,
          status: "active",
          invitedBy: invite.invitedBy,
          invitedAt: invite.createdAt,
          joinedAt: new Date(),
        })
        .returning();

      if (!updatedInvite[0] || !member[0]) {
        throw new Error("Failed to accept invite: transaction failed");
      }

      return {
        invite: updatedInvite[0],
        member: member[0],
      };
    });
  } catch (error) {
    logger.error("Error accepting invite:", error);
    throw error;
  }
}

export async function cancelInvite(inviteId: string): Promise<boolean> {
  try {
    const result = await db
      .update(organizationInvites)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(eq(organizationInvites.id, inviteId))
      .returning();
    return result.length > 0;
  } catch (error) {
    logger.error("Error cancelling invite:", error);
    throw error;
  }
}

export async function resendInvite(
  inviteId: string,
): Promise<OrganizationInvite | null> {
  try {
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

    const result = await db
      .update(organizationInvites)
      .set({
        expiresAt: newExpiresAt,
        updatedAt: new Date(),
      })
      .where(eq(organizationInvites.id, inviteId))
      .returning();
    return result[0] || null;
  } catch (error) {
    logger.error("Error resending invite:", error);
    throw error;
  }
}

// Utility mutations
export async function transferOwnership(
  organizationId: string,
  newOwnerId: string,
): Promise<boolean> {
  try {
    return await db.transaction(async (tx) => {
      // Update organization owner
      const orgResult = await tx
        .update(organizations)
        .set({ ownerId: newOwnerId, updatedAt: new Date() })
        .where(eq(organizations.id, organizationId))
        .returning();

      if (!orgResult[0]) {
        throw new Error("Organization not found");
      }

      // Update member role to owner
      const memberResult = await tx
        .update(organizationMembers)
        .set({ role: "owner", updatedAt: new Date() })
        .where(
          and(
            eq(organizationMembers.organizationId, organizationId),
            eq(organizationMembers.userId, newOwnerId),
          ),
        )
        .returning();

      return memberResult.length > 0;
    });
  } catch (error) {
    logger.error("Error transferring ownership:", error);
    throw error;
  }
}

export async function bulkAddMembers(
  organizationId: string,
  members: Array<{ userId: string; role: string; invitedBy: string }>,
): Promise<OrganizationMember[]> {
  try {
    const memberData = members.map((member) => ({
      organizationId,
      userId: member.userId,
      role: member.role,
      status: "active" as const,
      invitedBy: member.invitedBy,
      joinedAt: new Date(),
    }));

    const result = await db
      .insert(organizationMembers)
      .values(memberData)
      .returning();
    return result;
  } catch (error) {
    logger.error("Error bulk adding members:", error);
    throw error;
  }
}

export async function cleanupExpiredInvites(): Promise<number> {
  try {
    const result = await db
      .delete(organizationInvites)
      .where(
        and(
          eq(organizationInvites.status, "pending"),
          sql`${organizationInvites.expiresAt} <= now()`,
        ),
      )
      .returning();
    return result.length;
  } catch (error) {
    logger.error("Error cleaning up expired invites:", error);
    throw error;
  }
}
