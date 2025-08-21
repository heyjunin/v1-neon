import { logger } from "@v1/logger";
import { createClient } from "@v1/supabase/server";
import type { User } from "@supabase/supabase-js";

export interface GetUserResult {
  data: {
    user: User | null;
  } | null;
  error: any;
}

export async function getUser(): Promise<GetUserResult> {
  const supabase = createClient();

  try {
    const result = await supabase.auth.getUser();

    return result;
  } catch (error) {
    logger.error(error);

    throw error;
  }
}
