import chalk from 'chalk';
import { Command } from 'commander';
import { advancedSeederTemplate, basicSeederTemplate, fakerSeederTemplate } from '../templates/seeder/index.js';
import { TemplateData } from '../types/index.js';
import { getSeedersPath, updateIndexFile, writeFileSafely } from '../utils/file-system.js';
import { renderTemplate } from '../utils/template-engine.js';
import { checkFileExists, getSeederFilePath, validateSeederName } from '../utils/validators.js';

export function makeSeederCommand() {
  return new Command('make:seeder')
    .description('Create a new seeder file')
    .argument('<name>', 'Name of the seeder')
    .option('-t, --table <table>', 'Related table name')
    .option('--template <template>', 'Template type (basic|faker|advanced)', 'basic')
    .option('-f, --force', 'Overwrite existing file')
    .action(async (name, options) => {
      try {
        await createSeeder(name, options);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(chalk.red('Error creating seeder:'), errorMessage);
        process.exit(1);
      }
    });
}

async function createSeeder(name: string, options: any) {
  const { table, template = 'basic', force = false } = options;
  
  // Validate and normalize the seeder name
  const seederName = validateSeederName(name);
  const SeederName = seederName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  // Get file path
  const filePath = getSeederFilePath(seederName);
  
  // Check if file already exists
  if (checkFileExists(filePath) && !force) {
    throw new Error(`Seeder file already exists: ${filePath}. Use --force to overwrite.`);
  }
  
  // Prepare template data
  const templateData: TemplateData = {
    seederName,
    SeederName,
    tableName: table,
    TableName: table ? table.charAt(0).toUpperCase() + table.slice(1) : undefined,
  };
  
  // Select template
  let selectedTemplate: string;
  switch (template) {
    case 'faker':
      selectedTemplate = fakerSeederTemplate;
      break;
    case 'advanced':
      selectedTemplate = advancedSeederTemplate;
      break;
    case 'basic':
    default:
      selectedTemplate = basicSeederTemplate;
      break;
  }
  
  // Render template
  const content = renderTemplate(selectedTemplate, templateData);
  
  // Write file
  await writeFileSafely(filePath, content, force);
  
  // Update index file
  const indexPath = `${getSeedersPath()}/index.ts`;
  const importStatement = `import { ${SeederName}Seeder } from './${seederName}.js';`;
  const exportStatement = `export { ${SeederName}Seeder };`;
  
  await updateIndexFile(indexPath, importStatement, exportStatement);
  
  // Success message
  console.log(chalk.green('✅ Seeder created successfully!'));
  console.log(chalk.blue(`📁 File: ${filePath}`));
  console.log(chalk.blue(`🔧 Template: ${template}`));
  if (table) {
    console.log(chalk.blue(`📊 Table: ${table}`));
  }
  console.log(chalk.yellow('\n💡 Next steps:'));
  console.log(chalk.yellow(`   1. Edit the seeder file to add your data`));
  console.log(chalk.yellow(`   2. Run: bun run seed:run ${seederName}`));
}
