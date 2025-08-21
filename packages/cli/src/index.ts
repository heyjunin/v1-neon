#!/usr/bin/env node

import chalk from 'chalk';
import { Command } from 'commander';
import { makeMigrationCommand, makeModelCommand, makeSeederCommand } from './commands/index.js';

const program = new Command();

program
  .name('v1')
  .description('V1 CLI - Development tools for the V1 project')
  .version('1.0.0');

// Add commands
program.addCommand(makeSeederCommand());
program.addCommand(makeModelCommand());
program.addCommand(makeMigrationCommand());

// Global error handler
try {
  program.parse();
} catch (err) {
  const error = err as Error;
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
}
