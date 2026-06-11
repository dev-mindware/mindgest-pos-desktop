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
import { useAuthStore } from "@/stores/auth/auth-store";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function DocumentsPage() {
  const { currentStore } = currentStoreStore();
  const { user } = useAuthStore();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [creditNotes, setCreditNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("invoices");

  // Modal State
  const [isAnnulModalOpen, setIsAnnulModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [annulReason, setAnnulReason] = useState("");
  const [annulNotes, setAnnulNotes] = useState("");
  const [managerBarcode, setManagerBarcode] = useState("");
  const [isAnnulling, setIsAnnulling] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    if (typeof window !== "undefined" && window.ipc?.sync?.searchInvoices) {
      try {
        const result = await window.ipc.sync.searchInvoices({
          storeId: currentStore?.id,
          userId: user?.id,
          role: user?.role
        });
        setInvoices(result || []);

        if (window.ipc.sync.searchCreditNotes) {
          const notes = await window.ipc.sync.searchCreditNotes({
            storeId: currentStore?.id,
            userId: user?.id,
            role: user?.role
          });
          setCreditNotes(notes || []);
        }
      } catch (e) {
        console.error("Erro ao carregar documentos:", e);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (currentStore?.id) {
      loadData();
    }
  }, [currentStore?.id, user?.id, user?.role]);

  const handleAnnulSubmit = async () => {
    if (!annulReason) {
      toast.error("O motivo é obrigatório.");
      return;
    }
    if (user?.role === "CASHIER" && !managerBarcode) {
      toast.error("O código de barras do manager é obrigatório para anular.");
      return;
    }

    setIsAnnulling(true);
    try {
      await window.ipc.sync.annulInvoice({
        invoiceId: selectedInvoice.id,
        storeId: currentStore?.id,
        reason: annulReason,
        notes: annulNotes,
        managerBarcode: user?.role === "CASHIER" ? managerBarcode : undefined
      });
      toast.success("Pedido de anulação registado com sucesso.");
      setIsAnnulModalOpen(false);
      setSelectedInvoice(null);
      setAnnulReason("");
      setAnnulNotes("");
      setManagerBarcode("");
      loadData();
    } catch (e: any) {
      toast.error(e.message || "Erro ao anular factura.");
    } finally {
      setIsAnnulling(false);
    }
  };

  return (
    <PageWrapper subRoute="Documentos" routeLabel="Gestão">
      <div className="flex flex-col gap-6 p-2">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-outfit font-black tracking-tight">Movimentos de Caixa</h1>
          <p className="text-muted-foreground font-medium">
            Gerencie facturas-recibo e notas de crédito emitidas nesta loja.
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
                  placeholder="Pesquise por cliente ou nº da Factura"
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

            {activeTab === "invoices" && (
              <div className="border rounded-test-2xl bg-card/50 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow className="hover:bg-transparent border-muted/20">
                      <TableHead className="font-bold py-5">Nº da Factura</TableHead>
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
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="rounded-test-full hover:bg-primary/10">
                                  <Icon name="Ellipsis" className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  className="text-destructive focus:text-destructive font-medium cursor-pointer"
                                  disabled={inv.status === "CANCELED"}
                                  onClick={() => {
                                    setSelectedInvoice(inv);
                                    setIsAnnulModalOpen(true);
                                  }}
                                >
                                  <Icon name="Ban" className="w-4 h-4 mr-2" />
                                  Anular Factura
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
            )}

            {activeTab === "notes" && (
              <div className="border rounded-test-2xl bg-card/50 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-muted/20">
                    <TableRow className="hover:bg-transparent border-muted/20">
                      <TableHead className="font-bold py-5">Fatura Associada</TableHead>
                      <TableHead className="font-bold">Cliente</TableHead>
                      <TableHead className="font-bold">Valor</TableHead>
                      <TableHead className="font-bold">Motivo</TableHead>
                      <TableHead className="font-bold">Sincronização</TableHead>
                      <TableHead className="font-bold">Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                       <TableRow className="animate-pulse border-muted/10">
                         <TableCell colSpan={6} className="h-16 bg-muted/5" />
                       </TableRow>
                    ) : creditNotes.length > 0 ? (
                      creditNotes.map((note) => (
                        <TableRow key={note.id} className="border-muted/10 hover:bg-muted/5 transition-colors">
                          <TableCell className="font-mono font-bold text-primary/80 py-4">{note.invoiceNumber}</TableCell>
                          <TableCell className="font-bold uppercase text-xs tracking-wider">{note.clientName}</TableCell>
                          <TableCell className="font-bold">{note.grossTotal.toLocaleString()} Kz</TableCell>
                          <TableCell>{note.reason}</TableCell>
                          <TableCell>
                            <Badge className={note.syncStatus === "SYNCED" ? "bg-emerald-500/10 text-emerald-500 border-none rounded-test-full px-4 py-1 text-[10px] font-black uppercase" : note.syncStatus === "FAILED" ? "bg-red-500/10 text-red-500 border-none rounded-test-full px-4 py-1 text-[10px] font-black uppercase" : "bg-amber-500/10 text-amber-500 border-none rounded-test-full px-4 py-1 text-[10px] font-black uppercase"}>
                              {note.syncStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground font-medium text-xs">
                            {format(new Date(note.createdAt), "dd/MM/yyyy, HH:mm")}
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
            )}
          </div>
        </Tabs>
      </div>

      <Dialog open={isAnnulModalOpen} onOpenChange={setIsAnnulModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Anular Factura</DialogTitle>
            <DialogDescription>
              {user?.role === "CASHIER" 
                ? "Preencha os dados e peça ao Manager para autorizar lendo o seu código de barras."
                : "Confirme os dados para anular esta factura."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reason">Motivo (Obrigatório)</Label>
              <Input 
                id="reason" 
                value={annulReason} 
                onChange={(e) => setAnnulReason(e.target.value)} 
                placeholder="Ex: Erro de lançamento" 
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notas adicionais</Label>
              <Textarea 
                id="notes" 
                value={annulNotes} 
                onChange={(e) => setAnnulNotes(e.target.value)} 
                placeholder="Detalhes adicionais (opcional)" 
              />
            </div>
            {user?.role === "CASHIER" && (
              <div className="grid gap-2">
                <Label htmlFor="barcode">Código de Barras do Manager</Label>
                <Input 
                  id="barcode" 
                  value={managerBarcode} 
                  onChange={(e) => setManagerBarcode(e.target.value)} 
                  placeholder="Ler código..." 
                  type="password"
                  autoFocus
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAnnulModalOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleAnnulSubmit} disabled={isAnnulling || !annulReason || (user?.role === "CASHIER" && !managerBarcode)}>
              {isAnnulling ? "A anular..." : "Confirmar Anulação"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
