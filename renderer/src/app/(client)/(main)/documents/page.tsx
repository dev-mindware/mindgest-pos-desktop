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
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { currentStoreStore } from "@/stores";

export default function DocumentsPage() {
  const { currentStore } = currentStoreStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("invoices");

  useEffect(() => {
    async function loadInvoices() {
      setIsLoading(true);
      if (typeof window !== "undefined" && window.ipc?.sync?.searchInvoices) {
        try {
          const result = await window.ipc.sync.searchInvoices({
            storeId: currentStore?.id
          });
          setInvoices(result || []);
        } catch (e) {
          console.error("Erro ao carregar faturas locais:", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
    loadInvoices();
  }, [currentStore?.id]);

  return (
    <PageWrapper subRoute="Documentos" routeLabel="Gestão">
      <div className="flex flex-col gap-6 p-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-outfit font-black tracking-tight">Movimentos de Caixa</h1>
          <p className="text-muted-foreground font-medium">
            Gerencie faturas-recibo e notas de crédito emitidas nesta loja.
          </p>
        </div>

        <Tabs defaultValue="invoices" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-[600px] grid-cols-3 bg-muted/50 p-1">
            <TabsTrigger value="invoices" className="font-bold">Faturas-Recibo</TabsTrigger>
            <TabsTrigger value="proformas" className="font-bold">Faturas Proforma</TabsTrigger>
            <TabsTrigger value="notes" className="font-bold">Notas de Crédito</TabsTrigger>
          </TabsList>

          <div className="mt-8 space-y-4">
            {/* Filtros Simplificados (Estilo Imagem) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input 
                  className="w-full bg-muted/30 border-none rounded-test-xl h-11 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Pesquise por cliente ou nº da Fatura"
                />
              </div>
              <div className="bg-muted/30 rounded-test-xl h-11 flex items-center px-4 text-sm text-muted-foreground border-none">
                Cliente
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted/30 rounded-test-xl h-11 flex items-center px-4 text-sm text-muted-foreground">Data Início</div>
                <div className="bg-muted/30 rounded-test-xl h-11 flex items-center px-4 text-sm text-muted-foreground">Data Fim</div>
              </div>
            </div>

            <div className="border rounded-test-2xl bg-card/50 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-muted/20">
                  <TableRow className="hover:bg-transparent border-muted/20">
                    <TableHead className="font-bold py-5">Nº da Fatura</TableHead>
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
                  ) : invoices.length > 0 ? (
                    invoices.map((inv) => (
                      <TableRow key={inv.id} className="border-muted/10 hover:bg-muted/5 transition-colors">
                        <TableCell className="font-mono font-bold text-primary/80 py-4">{inv.agtNo || inv.localNo}</TableCell>
                        <TableCell className="font-bold uppercase text-xs tracking-wider">{inv.client?.name || "CONSUMIDOR FINAL"}</TableCell>
                        <TableCell className="font-bold">{inv.grossTotal.toLocaleString()} Kz</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-none rounded-test-full px-4 py-1 text-[10px] font-black uppercase">
                            {inv.status === "VALID" ? "Paga" : inv.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground font-medium text-xs">
                          {format(new Date(inv.issueDate), "dd/MM/yyyy, HH:mm")}
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
