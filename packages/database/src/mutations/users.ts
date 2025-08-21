import { eq } from "drizzle-orm";
import { db } from "../drizzle";
import { users, type NewUser, type User } from "../schema/users";
import { createEntity, deleteEntity, updateEntity } from "../utils";

export async function createUser(userData: NewUser): Promise<User> {
  return createEntity(
    (data) => db.insert(users).values(data).returning(),
    userData,
    "user",
  );
}

export async function updateUser(
  userId: string,
  userData: Partial<Omit<NewUser, "id" | "createdAt">>,
): Promise<User | null> {
  return updateEntity(
    (id, data) =>
      db
        .update(users)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(users.id, id))
        .returning(),
    userId,
    userData,
    "user",
  );
}

export async function deleteUser(userId: string): Promise<boolean> {
  return deleteEntity(
    (id) => db.delete(users).where(eq(users.id, id)).returning(),
    userId,
    "user",
  );
}
