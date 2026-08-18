"use client";

import { useAuth } from "@/hooks/auth/use-auth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Icon,
} from "@/components";
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
import { useState } from "react";
import { format } from "date-fns";
import { currentStoreStore, useModal } from "@/stores";
import { useGetCurrentSession } from "@/hooks";
import { formatCurrency } from "@/utils";
import { 
  PosRegisterExpenseModal, 
  MODAL_POS_REGISTER_EXPENSE_ID 
} from "@/components/client/pos/modal";

import { CashSessionsList } from "./cash-sessions-list";

export function MovementsContent() {
  const { user } = useAuth();
  const { currentStore } = currentStoreStore();
  const [activeTab, setActiveTab] = useState("sessions");
  const { openModal } = useModal();

  const { data: currentSession } = useGetCurrentSession(currentStore?.id, user?.id);

  // Filtrar apenas movimentos do tipo "OUT" (Despesas/Sangrias)
  const expenses = currentSession?.movements?.filter((m: any) => m.type === "OUT") || [];

  return (
    <div className="flex flex-col gap-6 p-2">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-outfit font-black tracking-tight">Movimentações</h1>
        <p className="text-muted-foreground font-medium">
          Controle os turnos de caixa, entradas e saídas de valores do terminal.
        </p>
      </div>

      <Tabs defaultValue="sessions" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-[400px] grid-cols-2 bg-muted/50 p-1">
          <TabsTrigger value="sessions" className="font-bold">Sessões de Caixa</TabsTrigger>
          <TabsTrigger value="expenses" className="font-bold">Despesas/Sangrias</TabsTrigger>
        </TabsList>

        <div className="mt-8">
          <TabsContent value="sessions">
            <CashSessionsList />
          </TabsContent>
          <TabsContent value="expenses">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-card p-4 rounded-xl border shadow-sm">
                <div>
                  <h3 className="text-lg font-bold">Saídas de Caixa Recentes</h3>
                  <p className="text-sm text-muted-foreground">
                    Total nesta sessão: <span className="font-bold text-red-600">-{formatCurrency(currentSession?.totalExpenses || 0)}</span>
                  </p>
                </div>
                <Button
                  onClick={() => openModal(MODAL_POS_REGISTER_EXPENSE_ID)}
                  disabled={!currentSession || currentSession.status !== "OPEN"}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg cursor-pointer"
                >
                  <Icon name="Plus" className="mr-2 h-4 w-4" /> Registar Saída (Despesa/Sangria)
                </Button>
              </div>

              {!currentSession ? (
                <div className="h-40 flex items-center justify-center border rounded-2xl border-dashed text-muted-foreground italic">
                  Abra uma sessão de caixa para gerir despesas e sangrias.
                </div>
              ) : expenses.length > 0 ? (
                <div className="border rounded-2xl bg-card/50 overflow-hidden shadow-sm">
                  <Table>
                    <TableHeader className="bg-muted/20">
                      <TableRow className="hover:bg-transparent border-muted/20">
                        <TableHead className="font-bold py-5">Hora</TableHead>
                        <TableHead className="font-bold">Descrição</TableHead>
                        <TableHead className="font-bold">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {expenses.map((mov: any) => (
                        <TableRow key={mov.id} className="border-muted/10 hover:bg-muted/5 transition-colors">
                          <TableCell className="text-xs font-medium py-4">
                            {format(new Date(mov.createdAt), "HH:mm")}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {mov.description}
                          </TableCell>
                          <TableCell className="font-bold text-red-600">
                            -{formatCurrency(mov.amount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center border rounded-2xl border-dashed text-muted-foreground italic">
                  Nenhuma despesa ou sangria registada nesta sessão.
                </div>
              )}
            </div>
          </TabsContent>
        </div>
      </Tabs>

      <PosRegisterExpenseModal currentSession={currentSession || undefined} />
    </div>
  );
}

