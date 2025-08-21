/**
 * Utilitários para manipulação e formatação de datas
 */

/**
 * Converte uma data (string, Date ou null/undefined) para um objeto Date
 * @param date - Data a ser convertida
 * @returns Date ou null se a data for inválida
 */
export function parseDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  
  try {
    return new Date(date);
  } catch {
    return null;
  }
}

/**
 * Formata uma data para o formato brasileiro (dd/mm/yyyy)
 * @param date - Data a ser formatada
 * @param options - Opções de formatação
 * @returns String formatada ou fallback se a data for inválida
 */
export function formatDate(
  date: string | Date | null | undefined,
  options?: {
    includeTime?: boolean;
    fallback?: string;
    locale?: string;
  }
): string {
  const {
    includeTime = false,
    fallback = "Data não disponível",
    locale = "pt-BR"
  } = options || {};

  const parsedDate = parseDate(date);
  if (!parsedDate) return fallback;

  const formatOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  };

  if (includeTime) {
    formatOptions.hour = "2-digit";
    formatOptions.minute = "2-digit";
  }

  return parsedDate.toLocaleDateString(locale, formatOptions);
}

/**
 * Formata uma data para exibição relativa (ex: "há 2 horas", "ontem")
 * @param date - Data a ser formatada
 * @param options - Opções de formatação
 * @returns String formatada ou fallback se a data for inválida
 */
export function formatRelativeDate(
  date: string | Date | null | undefined,
  options?: {
    fallback?: string;
    locale?: string;
  }
): string {
  const { fallback = "Data não disponível", locale = "pt-BR" } = options || {};

  const parsedDate = parseDate(date);
  if (!parsedDate) return fallback;

  const now = new Date();
  const diffInMs = now.getTime() - parsedDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return "agora mesmo";
  } else if (diffInMinutes < 60) {
    return `há ${diffInMinutes} ${diffInMinutes === 1 ? "minuto" : "minutos"}`;
  } else if (diffInHours < 24) {
    return `há ${diffInHours} ${diffInHours === 1 ? "hora" : "horas"}`;
  } else if (diffInDays === 1) {
    return "ontem";
  } else if (diffInDays < 7) {
    return `há ${diffInDays} ${diffInDays === 1 ? "dia" : "dias"}`;
  } else {
    return formatDate(parsedDate, { locale });
  }
}

/**
 * Verifica se uma data é válida
 * @param date - Data a ser verificada
 * @returns true se a data for válida
 */
export function isValidDate(date: string | Date | null | undefined): boolean {
  return parseDate(date) !== null;
}

/**
 * Compara duas datas, retornando true se forem iguais
 * @param date1 - Primeira data
 * @param date2 - Segunda data
 * @returns true se as datas forem iguais
 */
export function areDatesEqual(
  date1: string | Date | null | undefined,
  date2: string | Date | null | undefined
): boolean {
  const parsed1 = parseDate(date1);
  const parsed2 = parseDate(date2);
  
  if (!parsed1 && !parsed2) return true;
  if (!parsed1 || !parsed2) return false;
  
  return parsed1.getTime() === parsed2.getTime();
}

/**
 * Obtém a data atual formatada
 * @param options - Opções de formatação
 * @returns Data atual formatada
 */
export function getCurrentDate(options?: {
  includeTime?: boolean;
  locale?: string;
}): string {
  return formatDate(new Date(), options);
}

/**
 * Converte uma data para timestamp ISO
 * @param date - Data a ser convertida
 * @returns Timestamp ISO ou null se a data for inválida
 */
export function toISOString(date: string | Date | null | undefined): string | null {
  const parsedDate = parseDate(date);
  return parsedDate ? parsedDate.toISOString() : null;
}
