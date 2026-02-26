"use client";

import { useState } from "react";
import {
  Button,
  Icon,
} from "@/components";
import { formatCurrency } from "@/utils";
import { cn } from "@/lib/utils";
import { useModal } from "@/stores";
import { PosRequestsModal, PosOpeningModal, PosDeleteModal } from "./modal";
import { PosCashierList } from "./pos-cashier-list";
import { summaryCards } from "./data";
import { DynamicMetricCard } from "@/components";
import { useCurrentCashierStore } from "@/stores/pos/current-cashier-store";
import { PosFilters } from "./pos-filters";
import { useGetCashSessions, useCashSessionFilters, useGetOpeningRequests } from "@/hooks/entities";
import { currentStoreStore } from "@/stores/store/current-store-store";
import { CashSession } from "@/types/cash-session";

export function PosManagementContent() {
  const { openModal } = useModal();
  const { setCurrentCashier } = useCurrentCashierStore();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const { currentStore } = currentStoreStore();
  const { filters, page, setPage } = useCashSessionFilters();

  const {
    data: sessions,
    isLoading,
    total,
    totalPages,
    goToNextPage,
    goToPreviousPage,
  } = useGetCashSessions({
    ...filters,
    storeId: currentStore?.id,
    page,
  });

  const { data: requests } = useGetOpeningRequests({
    status: "PENDING",
  });

  const totalSales = sessions.reduce((acc: number, s: CashSession) => acc + (s.totalSales || 0), 0);
  const requestsCount = Array.isArray(requests) ? requests.length : 0;

  const dynamicSummaryCards = summaryCards.map((card) => {
    if (card.title === "Receitas") {
      return { ...card, value: totalSales };
    }
    if (card.modalId === "pos-requests") {
      return { ...card, value: requestsCount };
    }
    if (card.modalId === "opening-cashier") {
      return { ...card, value: total || 0 };
    }
    return card;
  });

  return (
    <div>
      <div className="space-y-8">
        <section className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {dynamicSummaryCards.map((card, idx) => (
              <DynamicMetricCard
                key={idx}
                variant={card.type}
                icon={card.icon}
                title={
                  card.type === "default"
                    ? (formatCurrency((card.value as number) ?? 0).split(",")[0] || "0")
                    : (card.value ?? "0")
                }
                subtitle={card.title}
                description={card.description || ""}
                onClick={() => {
                  if (card.type === "interactive" || card.type === "action") {
                    if (card.modalId === "opening-cashier") {
                      setCurrentCashier(null);
                    }
                    openModal(card.modalId as string);
                  }
                }}
              />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <PosFilters />
            <div className="flex items-center bg-muted/30 p-1 rounded-md border border-muted-foreground/10 gap-1 ml-auto">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                className={cn(
                  viewMode === "grid"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Icon name="LayoutGrid" size={30} />
              </Button>
              <Button
                variant={viewMode === "table" ? "secondary" : "ghost"}
                className={cn(
                  viewMode === "table"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                size="icon"
                onClick={() => setViewMode("table")}
              >
                <Icon name="TableProperties" size={30} />
              </Button>
            </div>
          </div>

          <PosCashierList
            viewMode={viewMode}
            data={sessions}
            isLoading={isLoading}
            total={total}
            totalPages={totalPages}
            goToNextPage={goToNextPage}
            goToPreviousPage={goToPreviousPage}
            page={page}
            setPage={setPage}
          />
        </section>
      </div>

      {/* Modals */}
      <PosOpeningModal />
      <PosRequestsModal />
      <PosDeleteModal />
    </div>
  );
}
