"use client";

import { PageWrapper } from "@/components/common/page-wrapper";
import { useGetItems } from "@/hooks";
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

export default function ItemsPage() {
  const { items, isLoading } = useGetItems({ limit: 100 });

  return (
    <RouteProtector allowed={["ADMIN", "OWNER", "MANAGER"]}>
      <PageWrapper subRoute="Itens" routeLabel="Gestão">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Produtos & Serviços</h1>
              <p className="text-muted-foreground">
                Lista de itens sincronizados localmente para venda offline.
              </p>
            </div>
          </div>

          <div className="border rounded-test-lg bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referência / SKU</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-10" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-16 rounded-test-full" /></TableCell>
                    </TableRow>
                  ))
                ) : items.length > 0 ? (
                  items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono text-xs">{item.sku || item.code || "---"}</TableCell>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(item.price || 0)}</TableCell>
                      <TableCell>{item.quantity || 0}</TableCell>
                      <TableCell>
                        <Badge variant={item.isActive ? "default" : "secondary"}>
                          {item.isActive ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nenhum produto encontrado no banco de dados local. 
                      <br/> Use o botão "Sincronizar Cloud" na barra lateral.
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
