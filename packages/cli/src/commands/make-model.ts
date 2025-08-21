import chalk from 'chalk';
import { Command } from 'commander';
import { basicModelTemplate, fullModelTemplate, withRelationsModelTemplate } from '../templates/model/index.js';
import { TemplateData } from '../types/index.js';
import { getSchemaPath, updateIndexFile, writeFileSafely } from '../utils/file-system.js';
import { renderTemplate } from '../utils/template-engine.js';
import { checkFileExists, getSchemaFilePath, validateTableName } from '../utils/validators.js';
import { createSeeder } from './make-seeder.js';

export function makeModelCommand() {
  return new Command('make:model')
    .description('Create a new model (schema) file')
    .argument('<name>', 'Name of the model/table')
    .option('-t, --template <template>', 'Template type (basic|with-relations|full)', 'basic')
    .option('-s, --seed', 'Also create a seeder for this model')
    .option('-m, --migration', 'Also create a migration for this model')
    .option('-f, --force', 'Overwrite existing file')
    .action(async (name, options) => {
      try {
        await createModel(name, options);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(chalk.red('Error creating model:'), errorMessage);
        process.exit(1);
      }
    });
}

async function createModel(name: string, options: any) {
  const { template = 'basic', seed = false, migration = false, force = false } = options;
  
  // Validate and normalize the table name
  const tableName = validateTableName(name);
  const ModelName = tableName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  // Get file path
  const filePath = getSchemaFilePath(tableName);
  
  // Check if file already exists
  if (checkFileExists(filePath) && !force) {
    throw new Error(`Model file already exists: ${filePath}. Use --force to overwrite.`);
  }
  
  // Prepare template data
  const templateData: TemplateData = {
    seederName: `${tableName}-seeder`,
    SeederName: `${ModelName}Seeder`,
    tableName,
    TableName: ModelName,
    modelName: tableName,
    ModelName,
  };
  
  // Select template
  let selectedTemplate: string;
  switch (template) {
    case 'with-relations':
      selectedTemplate = withRelationsModelTemplate;
      break;
    case 'full':
      selectedTemplate = fullModelTemplate;
      break;
    case 'basic':
    default:
      selectedTemplate = basicModelTemplate;
      break;
  }
  
  // Render template
  const content = renderTemplate(selectedTemplate, templateData);
  
  // Write file
  await writeFileSafely(filePath, content, force);
  
  // Update index file
  const indexPath = `${getSchemaPath()}/index.ts`;
  const exportStatement = `export * from './${tableName}.js';`;
  
  await updateIndexFile(indexPath, '', exportStatement);
  
  // Success message
  console.log(chalk.green('✅ Model created successfully!'));
  console.log(chalk.blue(`📁 File: ${filePath}`));
  console.log(chalk.blue(`🔧 Template: ${template}`));
  console.log(chalk.blue(`📊 Table: ${tableName}`));
  
  // Create seeder if requested
  if (seed) {
    console.log(chalk.yellow('\n🌱 Creating seeder...'));
    try {
      await createSeeder(tableName, {
        table: tableName,
        template: 'faker',
        force: force
      });
    } catch (error) {
      console.log(chalk.yellow('⚠️  Could not create seeder automatically. You can create it manually with:'));
      console.log(chalk.yellow(`   bun run make:seeder ${tableName} --table=${tableName} --template=faker`));
    }
  }
  
  // Create migration if requested
  if (migration) {
    console.log(chalk.yellow('\n📝 Creating migration...'));
    console.log(chalk.yellow('⚠️  Migration creation not implemented yet. You can create it manually with:'));
    console.log(chalk.yellow(`   bun run make:migration create_${tableName}_table --table=${tableName} --template=create`));
  }
  
  console.log(chalk.yellow('\n💡 Next steps:'));
  console.log(chalk.yellow(`   1. Edit the model file to define your schema`));
  console.log(chalk.yellow(`   2. Run: bun run db:generate to generate migrations`));
  console.log(chalk.yellow(`   3. Run: bun run db:migrate to apply migrations`));
  if (seed) {
    console.log(chalk.yellow(`   4. Edit the seeder and run: bun run seed:run ${tableName}-seeder`));
  }
}
