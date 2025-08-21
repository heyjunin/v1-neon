import { faker } from "@faker-js/faker";
import { logger } from "@v1/logger";
import { createBlog } from "../mutations";
import { getOrganizations } from "../queries";

export async function seedBlogs() {
  try {
    logger.info("🌱 Seeding blogs...");

    // Buscar organizações existentes
    const organizations = await getOrganizations({ isActive: true });
    
    if (organizations.data.length === 0) {
      logger.warn("No organizations found. Skipping blogs seeding.");
      return;
    }

    const blogsToCreate = [];

    // Criar 2-5 blogs por organização
    for (const organization of organizations.data) {
      const numBlogs = faker.number.int({ min: 2, max: 5 });
      
      for (let i = 0; i < numBlogs; i++) {
        const isMultiLanguage = faker.datatype.boolean();
        const primaryLanguage = faker.helpers.arrayElement(["en", "pt", "es", "fr"]);
        const secondaryLanguage = isMultiLanguage 
          ? faker.helpers.arrayElement(["en", "pt", "es", "fr"].filter(lang => lang !== primaryLanguage))
          : null;

        blogsToCreate.push({
          organizationId: organization.id,
          name: faker.company.name(),
          shortDescription: faker.lorem.sentence(),
          longDescription: faker.lorem.paragraphs(2),
          ogMetaTags: {
            title: faker.lorem.sentence(),
            description: faker.lorem.sentence(),
            image: faker.image.url(),
            url: faker.internet.url(),
          },
          seoMetaTags: {
            title: faker.lorem.sentence(),
            description: faker.lorem.sentence(),
            keywords: faker.lorem.words(5).split(" ").join(", "),
            author: faker.person.fullName(),
          },
          domain: faker.internet.domainName(),
          isMultiLanguage,
          primaryLanguage,
          secondaryLanguage,
          primaryTimezone: faker.helpers.arrayElement([
            "America/New_York",
            "America/Sao_Paulo", 
            "Europe/London",
            "Europe/Paris",
            "Asia/Tokyo",
            "Australia/Sydney"
          ]),
          secondaryTimezone: isMultiLanguage 
            ? faker.helpers.arrayElement([
                "America/New_York",
                "America/Sao_Paulo", 
                "Europe/London",
                "Europe/Paris",
                "Asia/Tokyo",
                "Australia/Sydney"
              ])
            : null,
          isActive: faker.datatype.boolean({ probability: 0.8 }), // 80% chance de estar ativo
        });
      }
    }

    // Criar blogs em lotes
    const batchSize = 10;
    for (let i = 0; i < blogsToCreate.length; i += batchSize) {
      const batch = blogsToCreate.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (blogData) => {
          try {
            await createBlog(blogData);
          } catch (error) {
            logger.error(`Failed to create blog: ${error}`);
          }
        })
      );
    }

    logger.info(`✅ Successfully seeded ${blogsToCreate.length} blogs`);
  } catch (error) {
    logger.error("❌ Error seeding blogs:", error);
    throw error;
  }
}
