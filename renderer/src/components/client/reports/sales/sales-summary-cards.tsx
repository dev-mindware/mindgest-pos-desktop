import { DynamicMetricCard } from "@/components/shared/dynamic-metric-card";
import { formatCurrency } from "@/utils";
import { SalesSummary } from "@/types/reports";

interface SalesSummaryCardsProps {
  summary: SalesSummary;
}

export function SalesSummaryCards({ summary }: SalesSummaryCardsProps) {
  // if (summary.totalTransactions === 0) {
  //     return (
  //         <Card>
  //             <CardContent className="pt-6">
  //                 <EmptyState
  //                     icon="SearchX"
  //                     title="Nenhuma venda encontrada"
  //                     description="Não existem dados de vendas para o período selecionado."
  //                 />
  //             </CardContent>
  //         </Card>
  //     );
  // }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <DynamicMetricCard
        title={formatCurrency(summary.totalRevenue)}
        subtitle="Receita Total"
        description="Valor total de vendas no período"
        icon="DollarSign"
      />

      <DynamicMetricCard
        title={summary.totalTransactions.toLocaleString("pt-AO")}
        subtitle="Total de Transações"
        description="Número de vendas realizadas"
        icon="ShoppingCart"
      />

      <DynamicMetricCard
        title={formatCurrency(summary.averageTicket)}
        subtitle="Ticket Médio"
        description="Valor médio por transação"
        icon="Receipt"
      />
    </div>
  );
}
