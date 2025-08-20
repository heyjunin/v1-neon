"use server";

import { authActionClient } from "@/actions/safe-action";
import { updateUserSchema } from "./schema";

export const updateUserAction = authActionClient
  .schema(updateUserSchema)
  .metadata({
    name: "update-user",
  })
  .action(async ({ parsedInput: input, ctx: { adapter, user } }) => {
    const result = await adapter.updateUser(user.id, input);

    return result;
  });
