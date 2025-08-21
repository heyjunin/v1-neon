import chalk from 'chalk';
import { Command } from 'commander';
import {
    alterMigrationTemplate,
    basicMigrationTemplate,
    createMigrationTemplate,
    dropMigrationTemplate
} from '../templates/migration/index.js';
import { TemplateData } from '../types/index.js';
import { writeFileSafely } from '../utils/file-system.js';
import { renderTemplate } from '../utils/template-engine.js';
import { checkFileExists, getMigrationFilePath, validateName } from '../utils/validators.js';

export function makeMigrationCommand() {
  return new Command('make:migration')
    .description('Create a new migration file')
    .argument('<name>', 'Name of the migration')
    .option('-t, --table <table>', 'Related table name')
    .option('--template <template>', 'Template type (basic|create|alter|drop)', 'basic')
    .option('-f, --force', 'Overwrite existing file')
    .action(async (name, options) => {
      try {
        await createMigration(name, options);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(chalk.red('Error creating migration:'), errorMessage);
        process.exit(1);
      }
    });
}

async function createMigration(name: string, options: any) {
  const { table, template = 'basic', force = false } = options;
  
  // Validate and normalize the migration name
  const migrationName = validateName(name);
  const now = new Date();
  const datePart = now.toISOString().split('T')[0];
  const timePart = now.toISOString().split('T')[1]?.split('.')[0]?.replace(/:/g, '') || '000000';
  const timestamp = `${datePart}_${timePart}`;
  const fileName = `${timestamp}_${migrationName}`;
  
  // Get file path
  const filePath = getMigrationFilePath(fileName);
  
  // Check if file already exists
  if (checkFileExists(filePath) && !force) {
    throw new Error(`Migration file already exists: ${filePath}. Use --force to overwrite.`);
  }
  
  // Prepare template data
  const templateData: TemplateData = {
    seederName: migrationName,
    SeederName: migrationName.charAt(0).toUpperCase() + migrationName.slice(1),
    tableName: table || 'table_name',
    TableName: table ? table.charAt(0).toUpperCase() + table.slice(1) : 'TableName',
    modelName: migrationName,
    ModelName: migrationName.charAt(0).toUpperCase() + migrationName.slice(1),
  };
  
  // Add migration-specific data
  const migrationData = {
    ...templateData,
    migrationName,
    timestamp: new Date().toISOString(),
  };
  
  // Select template
  let selectedTemplate: string;
  switch (template) {
    case 'create':
      selectedTemplate = createMigrationTemplate;
      break;
    case 'alter':
      selectedTemplate = alterMigrationTemplate;
      break;
    case 'drop':
      selectedTemplate = dropMigrationTemplate;
      break;
    case 'basic':
    default:
      selectedTemplate = basicMigrationTemplate;
      break;
  }
  
  // Render template with migration-specific replacements
  let content = renderTemplate(selectedTemplate, migrationData);
  content = content.replace(/\{\{migrationName\}\}/g, migrationName);
  content = content.replace(/\{\{timestamp\}\}/g, new Date().toISOString());
  
  // Write file
  await writeFileSafely(filePath, content, force);
  
  // Success message
  console.log(chalk.green('✅ Migration created successfully!'));
  console.log(chalk.blue(`📁 File: ${filePath}`));
  console.log(chalk.blue(`🔧 Template: ${template}`));
  if (table) {
    console.log(chalk.blue(`📊 Table: ${table}`));
  }
  console.log(chalk.yellow('\n💡 Next steps:'));
  console.log(chalk.yellow(`   1. Edit the migration file to add your changes`));
  console.log(chalk.yellow(`   2. Run: bun run db:migrate to apply the migration`));
  console.log(chalk.yellow(`   3. Or use Drizzle Kit: bun run db:push for development`));
}
