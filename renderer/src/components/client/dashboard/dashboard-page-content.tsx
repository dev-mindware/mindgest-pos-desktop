"use client";

import {
    PageWrapper,
    OwnerDashboardView,
    ManagerDashboardView,
    TitleList,
} from "@/components";
import { useAuth } from "@/hooks/auth/use-auth";

export function DashboardPageContent() {
    const { user } = useAuth();
    const isOwner = user?.role === "OWNER";

    return (
        <PageWrapper
            routeLabel={isOwner ? "Dashboard Global" : "Dashboard Loja"}
            subRoute={isOwner ? "Visão do Proprietário" : "Visão do Gerente"}
        >
            <TitleList suTitle={isOwner ? "Painel Consolidado da Empresa" : `Painel da Loja ${user?.store?.name || ""}`} />

            <div className="mt-4">
                {isOwner ? <OwnerDashboardView /> : <ManagerDashboardView />}
            </div>
        </PageWrapper>
    );
}
