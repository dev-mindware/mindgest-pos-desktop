"use client";

import { useState, useEffect } from "react";
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
import { format } from "date-fns";
import { currentStoreStore } from "@/stores";

export function CashSessionsList() {
  const { currentStore } = currentStoreStore();
  const [sessions, setSessions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSessions() {
      setIsLoading(true);
      if (typeof window !== "undefined" && window.ipc?.sync?.searchCashSessions) {
        try {
          const result = await window.ipc.sync.searchCashSessions({
            storeId: currentStore?.id
          });
          setSessions(result || []);
        } catch (e) {
          console.error("Erro ao carregar sessões de caixa:", e);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }
    loadSessions();
  }, [currentStore?.id]);

  return (
    <div className="space-y-4">
      <div className="border rounded-test-2xl bg-card/50 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow className="hover:bg-transparent border-muted/20">
              <TableHead className="font-bold py-5">Sessão</TableHead>
              <TableHead className="font-bold">Abertura</TableHead>
              <TableHead className="font-bold">Fecho</TableHead>
              <TableHead className="font-bold">Saldo Inicial</TableHead>
              <TableHead className="font-bold">Vendas</TableHead>
              <TableHead className="font-bold">Despesas</TableHead>
              <TableHead className="font-bold">Estado</TableHead>
              <TableHead className="text-right font-bold pr-6">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i} className="animate-pulse border-muted/10">
                  <TableCell colSpan={8} className="h-16 bg-muted/5" />
                </TableRow>
              ))
            ) : sessions.length > 0 ? (
              sessions.map((session) => (
                <TableRow key={session.id} className="border-muted/10 hover:bg-muted/5 transition-colors">
                  <TableCell className="font-bold text-primary/80 py-4">#{session.id.slice(0, 8)}</TableCell>
                  <TableCell className="text-xs font-medium">
                    {format(new Date(session.openingDate), "dd/MM/yyyy, HH:mm")}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-muted-foreground">
                    {session.closingDate ? format(new Date(session.closingDate), "dd/MM/yyyy, HH:mm") : "-"}
                  </TableCell>
                  <TableCell className="font-bold">{session.openingBalance.toLocaleString()} Kz</TableCell>
                  <TableCell className="font-bold text-emerald-600">+{session.totalSales.toLocaleString()} Kz</TableCell>
                  <TableCell className="font-bold text-red-600">-{session.totalExpenses.toLocaleString()} Kz</TableCell>
                  <TableCell>
                    <Badge className={`${
                      session.status === "OPEN" 
                        ? "bg-emerald-500/10 text-emerald-500" 
                        : "bg-muted/50 text-muted-foreground"
                    } border-none rounded-test-full px-4 py-1 text-[10px] font-black uppercase`}>
                      {session.status === "OPEN" ? "Aberta" : "Fechada"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="icon" className="rounded-test-full hover:bg-primary/10">
                      <Icon name="Eye" className="h-5 w-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-40 text-center text-muted-foreground font-medium italic">
                  Nenhuma sessão de caixa encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
