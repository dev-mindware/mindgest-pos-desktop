"use client";

import { PageWrapper } from "@/components/common/page-wrapper";
import { useGetClients } from "@/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { RouteProtector } from "@/contexts";

export default function ClientsPage() {
  const { clients, isLoading } = useGetClients();

  return (
    <RouteProtector allowed={["OWNER", "MANAGER", "CASHIER"]}>
      <PageWrapper subRoute="Clientes" routeLabel="Gestão">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Gestão de Clientes</h1>
              <p className="text-muted-foreground">
                Clientes sincronizados localmente para facturação offline.
              </p>
            </div>
          </div>

          <div className="border rounded-test-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NIF</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-test-full" /></TableCell>
                    </TableRow>
                  ))
                ) : clients.length > 0 ? (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-mono text-xs">{client.taxNumber || "Consumidor Final"}</TableCell>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.email || "---"}</TableCell>
                      <TableCell>{client.phone || "---"}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {client.type || "Geral"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhum cliente encontrado no banco de dados local.
                      <br /> Use o botão "Sincronizar Cloud" na barra lateral.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </PageWrapper>
    </RouteProtector>
  );
}
