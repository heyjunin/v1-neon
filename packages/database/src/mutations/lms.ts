import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { lms, type LMS, type NewLMS } from "../schema/lms";
import { createEntity, deleteEntity, updateEntity } from "../utils";

export async function createLMS(lmsData: NewLMS): Promise<LMS> {
  return createEntity(
    (data) => db.insert(lms).values(data).returning(),
    lmsData,
    "lms",
  );
}

export async function updateLMS(
  lmsId: string,
  lmsData: Partial<Omit<NewLMS, "id" | "createdAt">>,
): Promise<LMS | null> {
  return updateEntity(
    (id, data) =>
      db
        .update(lms)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(lms.id, id))
        .returning(),
    lmsId,
    lmsData,
    "lms",
  );
}

export async function deleteLMS(lmsId: string): Promise<boolean> {
  return deleteEntity(
    (id) => db.delete(lms).where(eq(lms.id, id)).returning(),
    lmsId,
    "lms",
  );
}

export async function deleteLMSByOrganizationId(organizationId: string): Promise<number> {
  const result = await db
    .delete(lms)
    .where(eq(lms.organizationId, organizationId))
    .returning();
  return result.length;
}
