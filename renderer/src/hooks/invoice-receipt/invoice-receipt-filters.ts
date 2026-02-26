"use client";
import { InvoiceFilters } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

export function useInvoiceFilters() {
  const router = useRouter();
  const query = useSearchParams();

  const filters: InvoiceFilters = {
    status: query.get("status") || null,
    sortBy: query.get("sortBy") || null,
    sortOrder: query.get("sortOrder") || null,
    invoiceNumber: query.get("invoiceNumber") || null,
    clientName: query.get("clientName") || null,
    startDate: query.get("startDate") || null,
    endDate: query.get("endDate") || null,
  };

  function setFilters(newFilters: Partial<InvoiceFilters>) {
    const updated = { ...filters, ...newFilters };
    const searchParams = new URLSearchParams();

    if (updated.status) searchParams.set("status", updated.status);
    if (updated.sortBy) searchParams.set("sortBy", updated.sortBy);
    if (updated.sortOrder) searchParams.set("sortOrder", updated.sortOrder);
    searchParams.set("page", "1"); // reset page ao trocar filtro

    router.push(`?${searchParams.toString()}`);
  }

  function setPage(page: number) {
    const searchParams = new URLSearchParams(query.toString());
    searchParams.set("page", String(page));
    router.push(`?${searchParams.toString()}`);
  }

  const page = Number(query.get("page")) || 1;

  return { filters, setFilters, page, setPage };
}