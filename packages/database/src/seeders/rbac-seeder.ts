/**
 * Seeder para dados RBAC (Role-Based Access Control)
 * Cria roles, permissões e associações padrão
 */

import { logger } from "@v1/logger";
import { eq } from "drizzle-orm";
import {
    organizationMembers,
    organizations,
    users
} from "../schema";
import { BaseSeeder } from "./base-seeder";

export class RBACSeeder extends BaseSeeder {
  name = "RBAC";

  async run(db: any): Promise<void> {
    logger.info("🌐 Starting RBAC seeder...");

    try {
      // 1. Verificar se já existem organizações
      const existingOrganizations = await db.select().from(organizations).limit(1);
      
      if (existingOrganizations.length === 0) {
        logger.info("No organizations found. RBAC seeder requires organizations to exist first.");
        return;
      }

      // 2. Verificar se já existem usuários
      const existingUsers = await db.select().from(users).limit(1);
      
      if (existingUsers.length === 0) {
        logger.info("No users found. RBAC seeder requires users to exist first.");
        return;
      }

      // 3. Verificar se já existem membros de organização
      const existingMembers = await db.select().from(organizationMembers).limit(1);
      
      if (existingMembers.length > 0) {
        logger.info("Organization members already exist. Skipping RBAC seeder.");
        return;
      }

      // 4. Criar membros de organização com roles apropriados
      await this.createOrganizationMembers(db);

      logger.info("✅ RBAC seeder completed successfully");
    } catch (error) {
      logger.error("❌ Error in RBAC seeder:", error);
      throw error;
    }
  }

  private async createOrganizationMembers(db: any): Promise<void> {
    logger.info("Creating organization members with RBAC roles...");

    // Buscar todas as organizações
    const allOrganizations = await db.select().from(organizations);
    
    // Buscar todos os usuários
    const allUsers = await db.select().from(users);

    if (allOrganizations.length === 0 || allUsers.length === 0) {
      logger.info("No organizations or users found for RBAC setup");
      return;
    }

    const membersToInsert = [];

    // Para cada organização, criar membros com diferentes roles
    for (const organization of allOrganizations) {
      // 1. Owner - primeiro usuário como owner
      if (allUsers.length > 0) {
        membersToInsert.push({
          organizationId: organization.id,
          userId: allUsers[0].id,
          role: "owner",
          status: "active",
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 2. Admin - segundo usuário como admin (se existir)
      if (allUsers.length > 1) {
        membersToInsert.push({
          organizationId: organization.id,
          userId: allUsers[1].id,
          role: "admin",
          status: "active",
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 3. Members - terceiro e quarto usuários como members (se existirem)
      if (allUsers.length > 2) {
        membersToInsert.push({
          organizationId: organization.id,
          userId: allUsers[2].id,
          role: "member",
          status: "active",
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      if (allUsers.length > 3) {
        membersToInsert.push({
          organizationId: organization.id,
          userId: allUsers[3].id,
          role: "member",
          status: "active",
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 4. Viewer - quinto usuário como viewer (se existir)
      if (allUsers.length > 4) {
        membersToInsert.push({
          organizationId: organization.id,
          userId: allUsers[4].id,
          role: "viewer",
          status: "active",
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 5. Suspended member - sexto usuário como suspended (se existir)
      if (allUsers.length > 5) {
        membersToInsert.push({
          organizationId: organization.id,
          userId: allUsers[5].id,
          role: "member",
          status: "suspended",
          joinedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }

    // Inserir membros em lotes
    if (membersToInsert.length > 0) {
      await this.batchInsert(db, organizationMembers, membersToInsert, 50);
      logger.info(`Created ${membersToInsert.length} organization members with RBAC roles`);
    }

    // Log detalhado das associações criadas
    for (const organization of allOrganizations) {
      const orgMembers = await db
        .select()
        .from(organizationMembers)
        .where(eq(organizationMembers.organizationId, organization.id));

      logger.info(`Organization "${organization.name}" (${organization.slug}):`);
      for (const member of orgMembers) {
        const user = allUsers.find((u: any) => u.id === member.userId);
        logger.info(`  - ${user?.email || member.userId}: ${member.role} (${member.status})`);
      }
    }
  }
}
