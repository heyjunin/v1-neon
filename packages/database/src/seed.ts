#!/usr/bin/env bun

import { logger } from '@v1/logger';
import { db } from './drizzle';
import { SeederOrchestrator, seeders } from './seeders';

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  const orchestrator = new SeederOrchestrator(db);
  orchestrator.registerMany(seeders);

  switch (command) {
    case 'run':
      const options = parseOptions(args.slice(1));
      await orchestrator.run(options);
      break;

    case 'list':
      const availableSeeders = orchestrator.list();
      logger.info('Available seeders:');
      availableSeeders.forEach(name => logger.info(`  - ${name}`));
      break;

    case 'help':
    case '--help':
    case '-h':
      showHelp();
      break;

    default:
      logger.error('Unknown command. Use "help" to see available commands.');
      process.exit(1);
  }
}

function parseOptions(args: string[]) {
  const options: any = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--force':
      case '-f':
        options.force = true;
        break;
        
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
        
      case '--specific':
      case '-s':
        if (i + 1 < args.length) {
          const nextArg = args[i + 1];
          if (nextArg) {
            options.specific = nextArg.split(',');
            i++; // Skip next argument
          }
        }
        break;
        
      default:
        if (arg && !arg.startsWith('-')) {
          // Treat as specific seeder names
          options.specific = [arg];
        }
    }
  }
  
  return options;
}

function showHelp() {
  console.log(`
Database Seeder - Laravel-inspired seeding system

Usage:
  bun run seed run [options]           Run all seeders
  bun run seed run <seeder> [options]  Run specific seeder(s)
  bun run seed list                    List available seeders
  bun run seed help                    Show this help

Options:
  --force, -f        Force run even if data already exists
  --verbose, -v      Show detailed output
  --specific, -s     Run specific seeders (comma-separated)

Examples:
  bun run seed run                    # Run all seeders
  bun run seed run users              # Run only users seeder
  bun run seed run users,posts        # Run users and posts seeders
  bun run seed run --force            # Force run all seeders
  bun run seed run users --verbose    # Run users seeder with verbose output
`);
}

main().catch((error) => {
  logger.error('Seeder failed:', error);
  process.exit(1);
});
