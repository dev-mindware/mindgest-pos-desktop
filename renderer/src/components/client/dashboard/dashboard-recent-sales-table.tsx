"use client";

import { GenericTable, Column, Badge } from "@/components";
import type { RecentSale } from "@/types";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DashboardRecentSalesTableProps {
    data: RecentSale[];
}

export function DashboardRecentSalesTable({ data }: DashboardRecentSalesTableProps) {
    const columns: Column<RecentSale>[] = [
        {
            key: "customerName",
            header: "Cliente",
            render: (value) => <span className="font-medium">{value}</span>,
        },
        {
            key: "date",
            header: "Data",
            render: (value) => format(new Date(value), "dd MMM yyyy, HH:mm", { locale: ptBR }),
        },
        {
            key: "amount",
            header: "Valor",
            render: (value) => new Intl.NumberFormat("pt-AO", { style: "currency", currency: "AOA" }).format(value).replace("AOA", "Kz"),
        },
        {
            key: "status",
            header: "Status",
            render: (value) => (
                <Badge variant={value === "completed" ? "outline" : "destructive"}>
                    {value === "completed" ? "Concluído" : value}
                </Badge>
            ),
        },
    ];

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold">Vendas Recentes</h3>
                <p className="text-sm text-muted-foreground">Últimas transações em todas as lojas</p>
            </div>
            <GenericTable
                columns={columns}
                data={data}
                page={1}
                total={data.length}
                totalPages={1}
                setPage={() => { }}
                goToNextPage={() => { }}
                goToPreviousPage={() => { }}
            />
        </div>
    );
}
