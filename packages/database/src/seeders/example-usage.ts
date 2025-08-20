import { db } from '../drizzle';
import { SeederOrchestrator, seeders } from './index';

// Example of how to use the seeder system programmatically
export async function seedDatabase() {
  const orchestrator = new SeederOrchestrator(db);
  
  // Register all seeders
  orchestrator.registerMany(seeders);
  
  try {
    // Run all seeders
    const results = await orchestrator.run({
      verbose: true,
      force: false
    });
    
    console.log('Seeding completed successfully!');
    console.log('Results:', results);
    
    return results;
  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  }
}

// Example of running specific seeders
export async function seedUsersOnly() {
  const orchestrator = new SeederOrchestrator(db);
  orchestrator.registerMany(seeders);
  
  return await orchestrator.run({
    specific: ['users'],
    verbose: true
  });
}

// Example of running seeders with force mode
export async function forceSeedDatabase() {
  const orchestrator = new SeederOrchestrator(db);
  orchestrator.registerMany(seeders);
  
  return await orchestrator.run({
    force: true,
    verbose: true
  });
}
