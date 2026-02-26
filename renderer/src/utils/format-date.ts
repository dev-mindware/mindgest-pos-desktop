import { format, isValid } from "date-fns";
import { pt } from "date-fns/locale";

/**
 * Formata uma data no padrão dd/MM/yyyy HH:mm com locale pt
 * @param date Date ou string no formato ISO
 */
export function formatDateTime(date: Date | string): string {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return "Data inválida";
  return format(dateObj, "dd/MM/yyyy, HH:mm", { locale: pt });
}

export function formatDate(date: Date | string): string {
  if (!date) return "N/A";
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return "Data inválida";
  return format(dateObj, "dd/MM/yyyy", { locale: pt });
}
