export { alterMigrationTemplate } from './alter.js';
export { basicMigrationTemplate } from './basic.js';
export { createMigrationTemplate } from './create.js';
export { dropMigrationTemplate } from './drop.js';

export const migrationTemplates = {
  basic: 'basicMigrationTemplate',
  create: 'createMigrationTemplate',
  alter: 'alterMigrationTemplate',
  drop: 'dropMigrationTemplate',
} as const;
