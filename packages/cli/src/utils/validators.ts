import fs from "fs-extra";
import path from "path";

export function validateName(name: string): string {
  if (!name || name.trim().length === 0) {
    throw new Error("Name is required");
  }

  // Remove spaces and convert to kebab-case
  const cleanName = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  if (cleanName.length === 0) {
    throw new Error("Invalid name format");
  }

  return cleanName;
}

export function validateSeederName(name: string): string {
  const cleanName = validateName(name);

  // Ensure it ends with 'seeder' if not already
  if (!cleanName.endsWith("-seeder")) {
    return `${cleanName}-seeder`;
  }

  return cleanName;
}

export function validateTableName(name: string): string {
  if (!name || name.trim().length === 0) {
    throw new Error("Table name is required");
  }

  // Convert to snake_case
  const cleanName = name
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  if (cleanName.length === 0) {
    throw new Error("Invalid table name format");
  }

  return cleanName;
}

export function checkFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function getSeederFilePath(seederName: string): string {
  const projectRoot = process.cwd();
  return path.join(
    projectRoot,
    "packages/database/src/seeders",
    `${seederName}.ts`,
  );
}

export function getMigrationFilePath(migrationName: string): string {
  const projectRoot = process.cwd();
  return path.join(
    projectRoot,
    "packages/database/src/migrations",
    `${migrationName}.sql`,
  );
}

export function getSchemaFilePath(tableName: string): string {
  const projectRoot = process.cwd();
  return path.join(
    projectRoot,
    "packages/database/src/schema",
    `${tableName}.ts`,
  );
}
