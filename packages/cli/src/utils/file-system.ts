import fs from 'fs-extra';
import path from 'path';

export async function writeFileSafely(filePath: string, content: string, force = false): Promise<void> {
  const dir = path.dirname(filePath);
  
  // Ensure directory exists
  await fs.ensureDir(dir);
  
  // Check if file exists
  if (await fs.pathExists(filePath) && !force) {
    throw new Error(`File already exists: ${filePath}. Use --force to overwrite.`);
  }
  
  await fs.writeFile(filePath, content, 'utf8');
}

export async function readFileSafely(filePath: string): Promise<string> {
  if (!(await fs.pathExists(filePath))) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  return await fs.readFile(filePath, 'utf8');
}

export async function updateIndexFile(indexPath: string, importStatement: string, exportStatement: string): Promise<void> {
  let content = '';
  
  try {
    content = await readFileSafely(indexPath);
  } catch (error) {
    // File doesn't exist, create it
    content = '';
  }
  
  // Add import if not exists
  if (!content.includes(importStatement)) {
    content += `\n${importStatement}`;
  }
  
  // Add export if not exists
  if (!content.includes(exportStatement)) {
    content += `\n${exportStatement}`;
  }
  
  // Clean up multiple newlines
  content = content.replace(/\n{3,}/g, '\n\n').trim() + '\n';
  
  await writeFileSafely(indexPath, content, true);
}

export function getProjectRoot(): string {
  return process.cwd();
}

export function getDatabasePackagePath(): string {
  return path.join(getProjectRoot(), 'packages/database');
}

export function getSeedersPath(): string {
  return path.join(getDatabasePackagePath(), 'src/seeders');
}

export function getMigrationsPath(): string {
  return path.join(getDatabasePackagePath(), 'src/migrations');
}

export function getSchemaPath(): string {
  return path.join(getDatabasePackagePath(), 'src/schema');
}
