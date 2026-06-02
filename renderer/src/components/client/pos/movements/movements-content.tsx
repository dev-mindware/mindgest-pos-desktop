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
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { currentStoreStore } from "@/stores";

import { CashSessionsList } from "./cash-sessions-list";

export function MovementsContent() {
  const { user } = useAuth();
  const { currentStore } = currentStoreStore();
  const [activeTab, setActiveTab] = useState("sessions");

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
            <div className="h-40 flex items-center justify-center border rounded-test-2xl border-dashed text-muted-foreground italic">
              Registo de despesas e sangrias local em breve...
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
