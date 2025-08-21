import type { PostFormData } from "../types";

export const postValidation = (
  values: PostFormData,
): Partial<Record<keyof PostFormData, string>> => {
  const errors: Partial<Record<keyof PostFormData, string>> = {};

  if (!values.title.trim()) {
    errors.title = "O título é obrigatório";
  } else if (values.title.length < 3) {
    errors.title = "O título deve ter pelo menos 3 caracteres";
  } else if (values.title.length > 100) {
    errors.title = "O título deve ter no máximo 100 caracteres";
  }

  if (!values.content.trim()) {
    errors.content = "O conteúdo é obrigatório";
  } else if (values.content.length < 10) {
    errors.content = "O conteúdo deve ter pelo menos 10 caracteres";
  } else if (values.content.length > 10000) {
    errors.content = "O conteúdo deve ter no máximo 10.000 caracteres";
  }

  return errors;
};

export const requiredField = (
  value: string,
  fieldName: string,
): string | undefined => {
  if (!value.trim()) {
    return `${fieldName} é obrigatório`;
  }
  return undefined;
};

export const minLength = (
  value: string,
  min: number,
  fieldName: string,
): string | undefined => {
  if (value.length < min) {
    return `${fieldName} deve ter pelo menos ${min} caracteres`;
  }
  return undefined;
};

export const maxLength = (
  value: string,
  max: number,
  fieldName: string,
): string | undefined => {
  if (value.length > max) {
    return `${fieldName} deve ter no máximo ${max} caracteres`;
  }
  return undefined;
};
