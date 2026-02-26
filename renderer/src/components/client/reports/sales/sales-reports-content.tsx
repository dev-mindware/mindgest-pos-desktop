"use client";
import { TitleList, RequestError, SalesSkeleton } from "@/components/common";
import { SalesAreaChart } from "./sales-area-chart";
import { SalesSummaryCards } from "./sales-summary-cards";
import { SaftExportCard } from "./saft-export-card";
import { ReportFilters } from "../common";
import { useSalesReports } from "@/hooks/reports";
import { SalesPeriod } from "@/types/reports";
import { RequestSalesError } from "./request-sales-error";

export function SalesReportsContent() {
  const {
    data,
    isLoading,
    isError,
    refetch,
    period,
    setPeriod,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useSalesReports();

  if (isLoading) return <SalesSkeleton />;

  if (isError || !data) 
    return <RequestSalesError refetch={refetch} />;

  return (
    <div className="space-y-6">
      <TitleList
        title="Relatórios de Vendas"
        suTitle="Analise receitas, volume e evolução por período de forma clara."
      />

      <ReportFilters
        filters={[
          {
            type: "select",
            label: "Período",
            value: period,
            onChange: (value) => setPeriod(value as SalesPeriod),
            options: [
              { value: "daily", label: "Diário" },
              { value: "weekly", label: "Semanal" },
              { value: "monthly", label: "Mensal" },
              { value: "quarterly", label: "Trimestral" },
              { value: "yearly", label: "Anual" },
            ],
            placeholder: "Selecione o período",
          },
          {
            type: "date",
            label: "Data Início",
            value: startDate,
            onChange: setStartDate,
          },
          {
            type: "date",
            label: "Data Fim",
            value: endDate,
            onChange: setEndDate,
            disabledDates: (date) => (startDate ? date < startDate : false),
          },
        ]}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-6 md:col-span-3">
          <SalesSummaryCards summary={data.summary} />
          <SalesAreaChart data={data.data} period={period} />
        </div>
        <SaftExportCard />
      </div>
    </div>
  );
}