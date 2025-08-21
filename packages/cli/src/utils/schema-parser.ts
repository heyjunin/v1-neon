import fs from "fs-extra";
import path from "path";
import { getSchemaPath } from "./file-system.js";

export interface SchemaField {
  name: string;
  type: string;
  nullable: boolean;
  hasDefault: boolean;
  isPrimary?: boolean;
  isUnique?: boolean;
  references?: {
    table: string;
    column: string;
  };
}

export interface SchemaInfo {
  tableName: string;
  fields: SchemaField[];
  relations: Array<{
    name: string;
    type: "belongsTo" | "hasMany" | "hasOne" | "manyToMany";
    table: string;
    foreignKey?: string;
  }>;
}

export async function parseSchemaFile(
  tableName: string,
): Promise<SchemaInfo | null> {
  const schemaPath = path.join(getSchemaPath(), `${tableName}.ts`);

  if (!fs.existsSync(schemaPath)) {
    return null;
  }

  try {
    const content = await fs.readFile(schemaPath, "utf8");
    return parseSchemaContent(content, tableName);
  } catch (error) {
    console.warn(`Could not parse schema file for ${tableName}:`, error);
    return null;
  }
}

function parseSchemaContent(content: string, tableName: string): SchemaInfo {
  const fields: SchemaField[] = [];
  const relations: SchemaInfo["relations"] = [];

  // Extract field definitions - simplified parser
  const fieldRegex = /(\w+):\s*(\w+)\(['"`](\w+)['"`]\)([^,\n]*)/g;
  let match;

  while ((match = fieldRegex.exec(content)) !== null) {
    const [, fieldName, drizzleType, columnName, modifiers] = match;

    if (!fieldName || !drizzleType) continue;

    const safeModifiers = modifiers || "";

    fields.push({
      name: fieldName,
      type: mapDrizzleTypeToTSType(drizzleType),
      nullable:
        safeModifiers.includes(".nullable()") ||
        !safeModifiers.includes(".notNull()"),
      hasDefault: safeModifiers.includes(".default"),
      isPrimary: safeModifiers.includes(".primaryKey()"),
      isUnique: safeModifiers.includes(".unique()"),
      references: extractReferences(safeModifiers),
    });
  }

  // Extract relations (simplified)
  const relationRegex = /\.references\(\(\)\s*=>\s*(\w+)\.(\w+)/g;
  while ((match = relationRegex.exec(content)) !== null) {
    const [, referencedTable, referencedColumn] = match;

    if (!referencedTable) continue;

    relations.push({
      name: `${referencedTable}`,
      type: "belongsTo",
      table: referencedTable,
      foreignKey: referencedColumn,
    });
  }

  return {
    tableName,
    fields,
    relations,
  };
}

function mapDrizzleTypeToTSType(drizzleType: string): string {
  const typeMap: Record<string, string> = {
    text: "string",
    varchar: "string",
    uuid: "string",
    integer: "number",
    serial: "number",
    boolean: "boolean",
    timestamp: "Date",
    date: "Date",
    jsonb: "object",
    json: "object",
    decimal: "number",
    real: "number",
    doublePrecision: "number",
  };

  return typeMap[drizzleType] || "any";
}

function extractReferences(modifiers: string): SchemaField["references"] {
  const refMatch = modifiers.match(/\.references\(\(\)\s*=>\s*(\w+)\.(\w+)/);
  if (refMatch && refMatch[1] && refMatch[2]) {
    return {
      table: refMatch[1],
      column: refMatch[2],
    };
  }
  return undefined;
}

export function generateFakerDataFromSchema(fields: SchemaField[]): string {
  const fakerFields = fields
    .filter(
      (field) =>
        !field.isPrimary &&
        field.name !== "createdAt" &&
        field.name !== "updatedAt",
    )
    .map((field) => {
      const fakerValue = generateFakerValue(field);
      return `      ${field.name}: ${fakerValue},`;
    });

  return fakerFields.join("\n");
}

function generateFakerValue(field: SchemaField): string {
  // Handle references first
  if (field.references) {
    return `fakerUtils.string.uuid() // TODO: Replace with actual ${field.references.table} ID`;
  }

  // Handle by field name patterns
  if (field.name.toLowerCase().includes("email")) {
    return "fakerUtils.internet.email()";
  }
  if (field.name.toLowerCase().includes("name")) {
    return "fakerUtils.person.fullName()";
  }
  if (field.name.toLowerCase().includes("title")) {
    return "fakerUtils.lorem.words(3)";
  }
  if (field.name.toLowerCase().includes("description")) {
    return "fakerUtils.lorem.paragraph()";
  }
  if (field.name.toLowerCase().includes("price")) {
    return "fakerUtils.number.float({ min: 10, max: 1000 })";
  }
  if (field.name.toLowerCase().includes("url")) {
    return "fakerUtils.internet.url()";
  }

  // Handle by type
  switch (field.type) {
    case "string":
      return "fakerUtils.lorem.words(2)";
    case "number":
      return "fakerUtils.number.int({ min: 1, max: 100 })";
    case "boolean":
      return "fakerUtils.datatype.boolean()";
    case "Date":
      return "fakerUtils.date.past()";
    case "object":
      return "{}";
    default:
      return `'${field.name}_value'`;
  }
}
