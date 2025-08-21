import { and, eq, like, or } from "drizzle-orm";

export class QueryBuilder {
  private conditions: any[] = [];

  addSearch(fields: any[], searchTerm?: string): this {
    if (searchTerm) {
      this.conditions.push(
        or(...fields.map((field) => like(field, `%${searchTerm}%`))),
      );
    }
    return this;
  }

  addFilter(field: any, value: any): this {
    if (value !== undefined && value !== null) {
      this.conditions.push(eq(field, value));
    }
    return this;
  }

  addCondition(condition: any): this {
    if (condition) {
      this.conditions.push(condition);
    }
    return this;
  }

  build(): any {
    return this.conditions.length > 0 ? and(...this.conditions) : undefined;
  }

  reset(): this {
    this.conditions = [];
    return this;
  }
}
