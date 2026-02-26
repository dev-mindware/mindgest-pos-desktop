import { Badge } from "@/components/ui/badge";

interface DocumentoStatusBadgeProps {
  status: "DRAFT" | "CANCELLED" | "PAID" | string;
}

export function DocumentStatusBadge({ status }: DocumentoStatusBadgeProps) {
  const labelMap: Record<string, string> = {
    DRAFT: "Pendente",
    CANCELLED: "Cancelada",
    PAID: "Paga",
    CORRECTION: "Correção",
    CANCELLATION: "Anulação",
  };

  const variantMap: Record<string, "default" | "success" | "destructive" | "outline" | "pending"> = {
    DRAFT: "pending",
    CANCELLED: "destructive",
    PAID: "success",
    CORRECTION: "outline",
    CANCELLATION: "destructive",
  };

  const currentStatus = status ?? "DRAFT";

  return (
    <Badge variant={variantMap[currentStatus] ?? "outline"}>
      {labelMap[currentStatus] || currentStatus}
    </Badge>
  );
}