"use client";

import { PageWrapper } from "@/components/common/page-wrapper";
import { useGetItems, useItemActions, useAuth } from "@/hooks";
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
import { Button } from "@/components/ui/button";
import { Icon } from "@/components";

export default function ItemsPage() {
  const { items, isLoading } = useGetItems({ limit: 100 });
  const { deleteItem } = useItemActions();
  const { user } = useAuth();

  return (
    <PageWrapper subRoute="Itens" routeLabel="Gestão">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Produtos & Serviços</h1>
            <p className="text-muted-foreground">
              Lista de itens sincronizados localmente para venda offline.
            </p>
          </div>
          <Button size="sm">
            <Icon name="Plus" className="mr-2 h-4 w-4" />
            Novo Item
          </Button>
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
                <TableHead className="text-right">Ações</TableHead>
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
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Icon name="Pencil" className="h-4 w-4" />
                        </Button>
                        {user?.role === 'OWNER' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteItem(item.id)}
                          >
                            <Icon name="Trash2" className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
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
  );
}
