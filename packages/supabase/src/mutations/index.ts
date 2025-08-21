import { logger } from "@v1/logger";
import { createClient } from "@v1/supabase/server";
import type { Tables, TablesUpdate } from "../types";

export interface UpdateUserResult {
  data: Tables<"users"> | null;
  error: unknown;
}

export async function updateUser(
  userId: string,
  data: TablesUpdate<"users">,
): Promise<UpdateUserResult> {
  const supabase = createClient();

  try {
    const result = await supabase.from("users").update(data).eq("id", userId);

    return result;
  } catch (error) {
    logger.error(error);

    throw error;
  }
}
