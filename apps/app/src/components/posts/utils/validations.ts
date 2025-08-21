import type { PostFormData } from "../types";

export function requiredField(value: string, fieldName: string): string | undefined {
  if (!value || value.trim().length === 0) {
    return `${fieldName} é obrigatório`;
  }
  return undefined;
}

export function minLength(value: string, min: number, fieldName: string): string | undefined {
  if (value && value.length < min) {
    return `${fieldName} deve ter pelo menos ${min} caracteres`;
  }
  return undefined;
}

export function maxLength(value: string, max: number, fieldName: string): string | undefined {
  if (value && value.length > max) {
    return `${fieldName} deve ter no máximo ${max} caracteres`;
  }
  return undefined;
}

export function postValidation(values: PostFormData): Partial<Record<keyof PostFormData, string>> {
  const errors: Partial<Record<keyof PostFormData, string>> = {};

  // Title validation
  const titleError = requiredField(values.title, "Título") ||
    minLength(values.title, 3, "Título") ||
    maxLength(values.title, 100, "Título");
  
  if (titleError) {
    errors.title = titleError;
  }

  // Content validation
  const contentError = requiredField(values.content, "Conteúdo") ||
    minLength(values.content, 10, "Conteúdo");
  
  if (contentError) {
    errors.content = contentError;
  }

  return errors;
}
