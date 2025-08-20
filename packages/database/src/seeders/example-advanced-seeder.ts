import { type NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { BaseSeeder } from './base-seeder';
import { fakerUtils } from './utils/faker';

// Example of an advanced seeder that demonstrates various faker features
export class ExampleAdvancedSeeder extends BaseSeeder {
  name = 'example-advanced';

  async run(db: NeonHttpDatabase): Promise<void> {
    // Initialize faker with a seed for consistent results
    fakerUtils.initialize({ seed: 99999 });

    console.log('🎲 Generating advanced fake data...');

    // Generate different types of fake data
    const fakeUsers = fakerUtils.array(() => fakerUtils.user(), 5);
    const fakeCompanies = fakerUtils.array(() => fakerUtils.company(), 3);
    const fakeAddresses = fakerUtils.array(() => fakerUtils.address(), 10);
    const fakePosts = fakerUtils.array(() => fakerUtils.post(), 15);

    // Generate random data
    const randomNumbers = fakerUtils.array(() => fakerUtils.random().number(1, 100), 20);
    const randomBooleans = fakerUtils.array(() => fakerUtils.random().boolean(), 10);
    const randomUuids = fakerUtils.array(() => fakerUtils.random().uuid(), 5);

    // Generate dates
    const recentDates = fakerUtils.array(() => fakerUtils.date().recent(30), 10);
    const futureDates = fakerUtils.array(() => fakerUtils.date().future(1), 5);

    // Generate images
    const avatars = fakerUtils.array(() => fakerUtils.image().avatar(), 8);
    const placeholderImages = fakerUtils.array(() => fakerUtils.image().urlPlaceholder(300, 200), 5);

    // Generate lorem text
    const sentences = fakerUtils.array(() => fakerUtils.lorem().sentence(), 20);
    const paragraphs = fakerUtils.array(() => fakerUtils.lorem().paragraph(), 10);

    console.log('📊 Generated data summary:');
    console.log(`  - Users: ${fakeUsers.length}`);
    console.log(`  - Companies: ${fakeCompanies.length}`);
    console.log(`  - Addresses: ${fakeAddresses.length}`);
    console.log(`  - Posts: ${fakePosts.length}`);
    console.log(`  - Random numbers: ${randomNumbers.length}`);
    console.log(`  - Random booleans: ${randomBooleans.length}`);
    console.log(`  - Random UUIDs: ${randomUuids.length}`);
    console.log(`  - Recent dates: ${recentDates.length}`);
    console.log(`  - Future dates: ${futureDates.length}`);
    console.log(`  - Avatars: ${avatars.length}`);
    console.log(`  - Placeholder images: ${placeholderImages.length}`);
    console.log(`  - Sentences: ${sentences.length}`);
    console.log(`  - Paragraphs: ${paragraphs.length}`);

    // Example of using the data
    console.log('\n📝 Sample generated data:');
    console.log('User:', fakeUsers[0]);
    console.log('Company:', fakeCompanies[0]);
    console.log('Address:', fakeAddresses[0]);
    console.log('Post:', fakePosts[0]);
    console.log('Random number:', randomNumbers[0]);
    console.log('Random boolean:', randomBooleans[0]);
    console.log('Random UUID:', randomUuids[0]);
    console.log('Recent date:', recentDates[0]);
    console.log('Avatar URL:', avatars[0]);
    console.log('Sample sentence:', sentences[0]);

    console.log('\n✅ Advanced seeder completed successfully!');
  }
}
