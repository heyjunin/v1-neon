import { db } from '../drizzle';
import { SeederOrchestrator, seeders, fakerUtils } from './index';

// Example of programmatic seeder usage with faker
export async function seedWithCustomData() {
  const orchestrator = new SeederOrchestrator(db);
  orchestrator.registerMany(seeders);
  
  // Initialize faker with a specific seed for reproducible results
  fakerUtils.initialize({ seed: 42 });
  
  try {
    // Run specific seeders with custom options
    const results = await orchestrator.run({
      specific: ['users', 'posts'],
      verbose: true,
      force: false
    });
    
    console.log('✅ Custom seeding completed!');
    console.log('Results:', results);
    
    return results;
  } catch (error) {
    console.error('❌ Custom seeding failed:', error);
    throw error;
  }
}

// Example of generating custom data without running seeders
export function generateCustomData() {
  fakerUtils.initialize({ seed: 999 });
  
  // Generate custom user data
  const customUsers = fakerUtils.array(() => ({
    ...fakerUtils.user(),
    role: fakerUtils.random().element(['admin', 'user', 'moderator']),
    isActive: fakerUtils.random().boolean(),
    lastLoginAt: fakerUtils.date().recent(7)
  }), 10);
  
  // Generate custom post data with specific categories
  const categories = ['tech', 'design', 'business', 'lifestyle', 'travel'];
  const customPosts = fakerUtils.array(() => ({
    ...fakerUtils.post(),
    category: fakerUtils.random().element(categories),
    isPublished: fakerUtils.random().boolean(),
    viewCount: fakerUtils.random().number(0, 10000),
    publishedAt: fakerUtils.date().recent(30)
  }), 25);
  
  return {
    users: customUsers,
    posts: customPosts
  };
}

// Example of conditional seeding based on environment
export async function conditionalSeeding() {
  const orchestrator = new SeederOrchestrator(db);
  orchestrator.registerMany(seeders);
  
  const environment = process.env.NODE_ENV || 'development';
  
  const options = {
    verbose: environment === 'development',
    force: environment === 'test',
    specific: environment === 'production' ? ['users'] : undefined // Only seed users in production
  };
  
  console.log(`🌍 Running seeders for environment: ${environment}`);
  console.log('Options:', options);
  
  return await orchestrator.run(options);
}

// Example of seeding with custom faker configuration
export async function seedWithCustomFaker() {
  // Custom faker configuration for specific use cases
  fakerUtils.initialize({ seed: 123 });
  
  // Generate data with specific patterns
  const techUsers = fakerUtils.array(() => ({
    ...fakerUtils.user(),
    skills: fakerUtils.random().elements([
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Go', 'Rust'
    ], 3),
    experience: fakerUtils.random().number(1, 15),
    company: fakerUtils.company().name
  }), 15);
  
  const techPosts = fakerUtils.array(() => ({
    ...fakerUtils.post(),
    difficulty: fakerUtils.random().element(['beginner', 'intermediate', 'advanced']),
    readingTime: fakerUtils.random().number(2, 20),
    techStack: fakerUtils.random().elements([
      'React', 'Vue', 'Angular', 'Next.js', 'Express', 'FastAPI', 'Django'
    ], 2)
  }), 30);
  
  console.log('💻 Generated tech-focused data:');
  console.log(`  - Tech users: ${techUsers.length}`);
  console.log(`  - Tech posts: ${techPosts.length}`);
  
  return { users: techUsers, posts: techPosts };
}
