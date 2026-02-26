"use client";

import { useManagerDashboard } from "@/hooks/reports/use-manager-dashboard";
import { DashboardSkeleton, EmptyState } from "@/components";
import {
    DashboardSummaryCards,
    DashboardRevenueChart,
    DashboardSalesPie,
    DashboardRecentSalesTable
} from "../index";

export function ManagerDashboardView() {
    const { dashboardData, isLoading, isError } = useManagerDashboard();

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center h-[400px]">
                <p className="text-muted-foreground">Erro ao carregar dados do dashboard.</p>
            </div>
        );
    }

    const isEmpty = !dashboardData ||
        (dashboardData.summary.totalSales.total === 0 &&
            dashboardData.recentSales.length === 0);

    if (isEmpty) {
        return (
            <EmptyState
                title="Dashboard sem dados"
                description="Ainda não existem vendas ou movimentações registradas nesta loja para gerar o dashboard."
                icon="TrendingUp"
            />
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <DashboardSummaryCards summary={dashboardData.summary} />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <DashboardRevenueChart data={dashboardData.revenueEvolution} />
                </div>
                <div>
                    <DashboardSalesPie data={dashboardData.salesDistribution} />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <DashboardRecentSalesTable data={dashboardData.recentSales} />
            </div>
        </div>
    );
}
