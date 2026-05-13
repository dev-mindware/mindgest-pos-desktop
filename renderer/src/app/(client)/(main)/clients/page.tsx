"use client";

import { PageWrapper } from "@/components/common/page-wrapper";
import { useGetClients, useClientActions, useAuth } from "@/hooks";
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
import { useState } from "react";
import { ClientModal } from "@/components/shared/modals/client-modal";

export default function ClientsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);

  const { clients, isLoading, refetch } = useGetClients();
  const { deleteClient } = useClientActions();
  const { user } = useAuth();

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  return (
    <PageWrapper subRoute="Clientes" routeLabel="Gestão">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Gestão de Clientes</h1>
            <p className="text-muted-foreground">
              Clientes sincronizados localmente para faturação offline.
            </p>
          </div>
          <Button size="sm" onClick={handleAdd}>
            <Icon name="UserPlus" className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
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
                <TableHead className="text-right">Ações</TableHead>
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
                    <TableCell className="font-mono text-xs">{client.nif || "Consumidor Final"}</TableCell>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.email || "---"}</TableCell>
                    <TableCell>{client.phone || "---"}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {client.type || "Geral"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEdit(client)}
                        >
                          <Icon name="Pencil" className="h-4 w-4" />
                        </Button>
                        {user?.role === 'OWNER' && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => deleteClient(client.id)}
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
                    Nenhum cliente encontrado no banco de dados local. 
                    <br/> Use o botão "Sincronizar Cloud" na barra lateral.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <ClientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        client={selectedClient} 
        onSuccess={refetch}
      />
    </PageWrapper>
  );
}
