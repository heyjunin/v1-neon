import { faker } from "@faker-js/faker";
import { logger } from "@v1/logger";
import { createLMS } from "../mutations";
import { getOrganizations } from "../queries";

export async function seedLMS() {
  try {
    logger.info("🌱 Seeding LMS...");

    // Buscar organizações existentes
    const organizations = await getOrganizations({ isActive: true });
    
    if (organizations.data.length === 0) {
      logger.warn("No organizations found. Skipping LMS seeding.");
      return;
    }

    const lmsToCreate = [];

    // Criar 1-3 LMS por organização
    for (const organization of organizations.data) {
      const numLMS = faker.number.int({ min: 1, max: 3 });
      
      for (let i = 0; i < numLMS; i++) {
        const isMultiLanguage = faker.datatype.boolean();
        const primaryLanguage = faker.helpers.arrayElement(["en", "pt", "es", "fr"]);
        const secondaryLanguage = isMultiLanguage 
          ? faker.helpers.arrayElement(["en", "pt", "es", "fr"].filter(lang => lang !== primaryLanguage))
          : null;

        lmsToCreate.push({
          organizationId: organization.id,
          name: `${faker.company.name()} Learning Platform`,
          shortDescription: faker.lorem.sentence(),
          longDescription: faker.lorem.paragraphs(3),
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
          isActive: faker.datatype.boolean({ probability: 0.9 }), // 90% chance de estar ativo
        });
      }
    }

    // Criar LMS em lotes
    const batchSize = 10;
    for (let i = 0; i < lmsToCreate.length; i += batchSize) {
      const batch = lmsToCreate.slice(i, i + batchSize);
      
      await Promise.all(
        batch.map(async (lmsData) => {
          try {
            await createLMS(lmsData);
          } catch (error) {
            logger.error(`Failed to create LMS: ${error}`);
          }
        })
      );
    }

    logger.info(`✅ Successfully seeded ${lmsToCreate.length} LMS`);
  } catch (error) {
    logger.error("❌ Error seeding LMS:", error);
    throw error;
  }
}
