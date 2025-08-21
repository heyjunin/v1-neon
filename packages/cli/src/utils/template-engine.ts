import { TemplateData } from '../types/index.js';

export function renderTemplate(template: string, data: TemplateData): string {
  let result = template;
  
  // Replace simple placeholders
  const replacements: Record<string, string> = {
    '{{seederName}}': data.seederName,
    '{{SeederName}}': data.SeederName,
    '{{tableName}}': data.tableName || 'table',
    '{{TableName}}': data.TableName || 'Table',
    '{{modelName}}': data.modelName || 'model',
    '{{ModelName}}': data.ModelName || 'Model',
  };
  
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(placeholder, 'g'), value);
  }
  
  // Handle conditional blocks
  result = handleConditionalBlocks(result, data);
  
  return result;
}

function handleConditionalBlocks(template: string, data: TemplateData): string {
  // Handle {{#if fields}}...{{/if}} blocks
  template = template.replace(
    /\{\{#if fields\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (match, content) => {
      if (data.fields && data.fields.length > 0) {
        return renderFieldsBlock(content, data.fields);
      }
      return '';
    }
  );
  
  // Handle {{#if relations}}...{{/if}} blocks
  template = template.replace(
    /\{\{#if relations\}\}([\s\S]*?)\{\{\/if\}\}/g,
    (match, content) => {
      if (data.relations && data.relations.length > 0) {
        return renderRelationsBlock(content, data.relations);
      }
      return '';
    }
  );
  
  return template;
}

function renderFieldsBlock(template: string, fields: TemplateData['fields']): string {
  if (!fields) return '';
  
  return fields.map(field => {
    let fieldTemplate = template;
    
    fieldTemplate = fieldTemplate.replace(/\{\{field\.name\}\}/g, field.name);
    fieldTemplate = fieldTemplate.replace(/\{\{field\.type\}\}/g, field.type);
    fieldTemplate = fieldTemplate.replace(/\{\{field\.nullable\}\}/g, field.nullable ? 'true' : 'false');
    fieldTemplate = fieldTemplate.replace(/\{\{field\.hasDefault\}\}/g, field.hasDefault ? 'true' : 'false');
    
    return fieldTemplate;
  }).join('\n');
}

function renderRelationsBlock(template: string, relations: TemplateData['relations']): string {
  if (!relations) return '';
  
  return relations.map(relation => {
    let relationTemplate = template;
    
    relationTemplate = relationTemplate.replace(/\{\{relation\.name\}\}/g, relation.name);
    relationTemplate = relationTemplate.replace(/\{\{relation\.type\}\}/g, relation.type);
    relationTemplate = relationTemplate.replace(/\{\{relation\.table\}\}/g, relation.table);
    
    return relationTemplate;
  }).join('\n');
}
