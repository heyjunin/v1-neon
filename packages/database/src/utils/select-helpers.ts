import { users } from "../schema/users";
import { organizations } from "../schema/organizations";
import { posts } from "../schema/posts";

export function createSelectHelpers() {
  return {
    selectUserFields: () => ({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
    }),

    selectOrganizationFields: () => ({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
    }),

    selectPostFields: () => ({
      id: posts.id,
      title: posts.title,
    }),
  };
}
