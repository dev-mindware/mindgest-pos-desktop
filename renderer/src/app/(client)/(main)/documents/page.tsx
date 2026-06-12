"use client";

import { PageWrapper } from "@/components/common/page-wrapper";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components";
import { useState } from "react";
import { format } from "date-fns";
import { currentStoreStore } from "@/stores";
import { usePagination } from "@/hooks/common/use-pagination";
import { useDebounce } from "use-debounce";

export default function DocumentsPage() {
  const { currentStore } = currentStoreStore();
  const [searchText, setSearchText] = useState("");
  const [debounceSearch] = useDebounce(searchText, 300);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState("invoices");

  // Determine endpoint and queryKey/params based on activeTab
  const getEndpointAndQueryKey = () => {
    switch (activeTab) {
      case "proformas":
        return {
          endpoint: "/invoice/proforma",
          queryKey: "proforma"
        };
      case "notes":
        return {
          endpoint: "/credit-note",
          queryKey: "credit-note"
        };
      case "invoices":
      default:
        return {
          endpoint: "/invoice/invoice-receipt",
          queryKey: "invoice-receipt"
        };
    }
  };

  const { endpoint, queryKey } = getEndpointAndQueryKey();

  const {
    data: documents,
    isLoading
  } = usePagination<any>({
    endpoint,
    queryKey: [queryKey, currentStore?.id || ""],
    queryParams: {
      storeId: currentStore?.id,
      search: debounceSearch,
      startDate: startDate || undefined,
      endDate: endDate || undefined
    }
  });

  return (
    <PageWrapper subRoute="Documentos" routeLabel="Gestão">
      <div className="flex flex-col gap-6 p-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-outfit font-black tracking-tight">Movimentos de Caixa</h1>
          <p className="text-muted-foreground font-medium">
            Gerencie facturas-recibo, proformas e notas de crédito emitidas nesta loja.
          </p>
        </div>

        <Tabs defaultValue="invoices" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-[600px] grid-cols-3 bg-muted/50 p-1">
            <TabsTrigger value="invoices" className="font-bold">Faturas-Recibo</TabsTrigger>
            <TabsTrigger value="proformas" className="font-bold">Faturas Proforma</TabsTrigger>
            <TabsTrigger value="notes" className="font-bold">Notas de Crédito</TabsTrigger>
          </TabsList>

          <div className="mt-8 space-y-4">
            {/* Filtros Ativos */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative md:col-span-1">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  className="w-full bg-muted/30 border-none rounded-test-xl h-11 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                  placeholder="Pesquise por cliente ou nº do documento"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="date"
                  className="w-full bg-muted/30 rounded-test-xl h-11 px-4 text-sm text-foreground border-none outline-none focus:ring-2 focus:ring-primary/20"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="date"
                  className="w-full bg-muted/30 rounded-test-xl h-11 px-4 text-sm text-foreground border-none outline-none focus:ring-2 focus:ring-primary/20"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="border rounded-test-2xl bg-card/50 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow className="hover:bg-transparent border-muted/20">
                    <TableHead className="font-bold py-5">Nº do Documento</TableHead>
                    <TableHead className="font-bold">Cliente</TableHead>
                    <TableHead className="font-bold">Valor</TableHead>
                    <TableHead className="font-bold">Estado</TableHead>
                    <TableHead className="font-bold">Criado em</TableHead>
                    <TableHead className="text-right font-bold pr-6">Ação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i} className="animate-pulse border-muted/10">
                        <TableCell colSpan={6} className="h-16 bg-muted/5" />
                      </TableRow>
                    ))
                  ) : documents.length > 0 ? (
                    documents.map((doc: any) => (
                      <TableRow key={doc.id} className="border-muted/10 hover:bg-muted/5 transition-colors">
                        <TableCell className="font-mono font-bold text-primary/80 py-4">
                          {doc.agtNo || doc.localNo || doc.number || doc.proformaNumber || doc.invoiceNumber}
                        </TableCell>
                        <TableCell className="font-bold uppercase text-xs tracking-wider">
                          {doc.client?.name || "CONSUMIDOR FINAL"}
                        </TableCell>
                        <TableCell className="font-bold">
                          {(doc.grossTotal ?? doc.total ?? 0).toLocaleString()} Kz
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none rounded-full px-4 py-1 text-[10px] font-black uppercase">
                            {doc.status === "VALID" ? "Paga" : (doc.status === "PENDING_SYNC" ? "Pendente" : doc.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium text-xs">
                          {format(new Date(doc.issueDate || doc.createdAt), "dd/MM/yyyy, HH:mm")}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button variant="ghost" size="icon" className="rounded-test-full hover:bg-primary/10">
                            <Icon name="Ellipsis" className="h-5 w-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-40 text-center text-muted-foreground font-medium italic">
                        Nenhum documento encontrado nesta categoria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Tabs>
      </div>
    </PageWrapper>
  );
}
