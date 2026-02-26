export function parseCurrency(value: string): number {
  const numericValue = value.replace(/\D/g, "");
  return numericValue ? parseFloat(numericValue) / 100 : 0;
}

export function formatCurrency(value: string | number): string {
  if (value === undefined || value === null || value === "") return "";
  // Convert to number directly - parseCurrency is only for formatted user input
  const number =
    typeof value === "number" ? value : parseFloat(value.toString());
  return (
    new Intl.NumberFormat("pt-BR", {
      style: "decimal",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number) + " Kz"
  );
}
