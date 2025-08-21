export interface SeederOptions {
  table?: string;
  template?: 'basic' | 'faker' | 'advanced';
  force?: boolean;
}

export interface MigrationOptions {
  table?: string;
  template?: 'basic' | 'create' | 'alter' | 'drop';
  force?: boolean;
}

export interface ModelOptions {
  table?: string;
  template?: 'basic' | 'with-relations' | 'full';
  force?: boolean;
}

export interface SetupOptions {
  force?: boolean;
  interactive?: boolean;
}

export interface DatabaseOptions {
  force?: boolean;
  verbose?: boolean;
  specific?: string[];
}

export interface TemplateData {
  seederName: string;
  SeederName: string;
  tableName?: string;
  TableName?: string;
  modelName?: string;
  ModelName?: string;
  fields?: Array<{
    name: string;
    type: string;
    nullable: boolean;
    hasDefault: boolean;
  }>;
  relations?: Array<{
    name: string;
    type: string;
    table: string;
  }>;
}
