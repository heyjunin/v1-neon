import { faker } from "@faker-js/faker";
import { logger } from "@v1/logger";
import { db } from "../drizzle";
import {
  organizationInvites,
  organizationMembers,
  organizations,
} from "../schema/organizations";
import { users } from "../schema/users";

export async function seedOrganizations() {
  try {
    logger.info("🌱 Seeding organizations...");

    // Get existing users to use as owners and members
    const existingUsers = await db.select().from(users).limit(10);

    if (existingUsers.length === 0) {
      logger.warn("No users found. Please seed users first.");
      return;
    }

    // Create sample organizations
    const sampleOrganizations = [
      {
        name: "Acme Corporation",
        slug: "acme-corp",
        description: "Leading technology solutions provider",
        logoUrl: "https://via.placeholder.com/150/4F46E5/FFFFFF?text=ACME",
        ownerId: existingUsers[0]!.id,
      },
      {
        name: "TechStart Inc",
        slug: "techstart",
        description: "Innovative startup focused on AI and machine learning",
        logoUrl: "https://via.placeholder.com/150/10B981/FFFFFF?text=TS",
        ownerId: existingUsers[1]?.id || existingUsers[0]!.id,
      },
      {
        name: "Global Solutions",
        slug: "global-solutions",
        description: "International consulting and advisory services",
        logoUrl: "https://via.placeholder.com/150/F59E0B/FFFFFF?text=GS",
        ownerId: existingUsers[2]?.id || existingUsers[0]!.id,
      },
      {
        name: "Creative Agency",
        slug: "creative-agency",
        description: "Full-service digital marketing and design agency",
        logoUrl: "https://via.placeholder.com/150/EF4444/FFFFFF?text=CA",
        ownerId: existingUsers[3]?.id || existingUsers[0]!.id,
      },
      {
        name: "Data Analytics Pro",
        slug: "data-analytics-pro",
        description: "Advanced analytics and business intelligence solutions",
        logoUrl: "https://via.placeholder.com/150/8B5CF6/FFFFFF?text=DAP",
        ownerId: existingUsers[4]?.id || existingUsers[0]!.id,
      },
    ];

    // Insert organizations
    const createdOrganizations = await db
      .insert(organizations)
      .values(sampleOrganizations)
      .returning();
    logger.info(`✅ Created ${createdOrganizations.length} organizations`);

    // Create organization members
    const membersToInsert = [];

    for (const org of createdOrganizations) {
      // Add owner as member with owner role
      membersToInsert.push({
        organizationId: org.id,
        userId: org.ownerId,
        role: "owner",
        status: "active",
        joinedAt: new Date(),
      });

      // Add some random members to each organization
      const availableUsers = existingUsers.filter(
        (user) => user.id !== org.ownerId,
      );
      const numMembers = Math.min(
        faker.number.int({ min: 1, max: 3 }),
        availableUsers.length,
      );

      for (let i = 0; i < numMembers; i++) {
        const user = availableUsers[i];
        if (user) {
          membersToInsert.push({
            organizationId: org.id,
            userId: user.id,
            role: faker.helpers.arrayElement(["admin", "member"]),
            status: "active",
            invitedBy: org.ownerId,
            invitedAt: faker.date.past(),
            joinedAt: faker.date.recent(),
          });
        }
      }
    }

    if (membersToInsert.length > 0) {
      await db.insert(organizationMembers).values(membersToInsert);
      logger.info(`✅ Added ${membersToInsert.length} organization members`);
    }

    // Create some sample invites
    const invitesToInsert = [];

    for (const org of createdOrganizations.slice(0, 3)) {
      // Only for first 3 organizations
      const numInvites = faker.number.int({ min: 1, max: 2 });

      for (let i = 0; i < numInvites; i++) {
        invitesToInsert.push({
          organizationId: org.id,
          email: faker.internet.email(),
          role: faker.helpers.arrayElement(["admin", "member"]),
          invitedBy: org.ownerId,
          token: faker.string.uuid(),
          expiresAt: faker.date.future(),
          status: faker.helpers.arrayElement([
            "pending",
            "accepted",
            "expired",
          ]),
        });
      }
    }

    if (invitesToInsert.length > 0) {
      await db.insert(organizationInvites).values(invitesToInsert);
      logger.info(`✅ Created ${invitesToInsert.length} organization invites`);
    }

    logger.info("✅ Organizations seeding completed");
  } catch (error) {
    logger.error("❌ Error seeding organizations:", error);
    throw error;
  }
}

export async function clearOrganizations() {
  try {
    logger.info("🧹 Clearing organizations data...");

    await db.delete(organizationInvites);
    await db.delete(organizationMembers);
    await db.delete(organizations);

    logger.info("✅ Organizations data cleared");
  } catch (error) {
    logger.error("❌ Error clearing organizations:", error);
    throw error;
  }
}
