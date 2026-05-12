"use client";

import { PageWrapper } from "@/components/common/page-wrapper";
import { useAuth } from "@/hooks/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <PageWrapper subRoute="Dashboard" routeLabel="Principal">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo, {user?.name}!</h1>
          <p className="text-muted-foreground">
            Este é o painel de controlo offline do MindGest POS.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vendas de Hoje</CardTitle>
              <Icon name="DollarSign" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">AOA 0,00</div>
              <p className="text-xs text-muted-foreground">
                Sincronização pendente: 0 faturas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Estado do Sistema</CardTitle>
              <Icon name="Cpu" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-500">Operacional</div>
              <p className="text-xs text-muted-foreground">
                Base de dados SQLite: OK
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Último Backup</CardTitle>
              <Icon name="Cloud" className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Agora</div>
              <p className="text-xs text-muted-foreground">
                Dados sincronizados localmente.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-test-xl border bg-card p-8 text-center border-dashed">
          <div className="flex flex-col items-center gap-2">
            <Icon name="Activity" className="h-10 w-10 text-primary opacity-20" />
            <h3 className="text-lg font-semibold">Resumo Analítico</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              As métricas detalhadas de vendas e desempenho serão habilitadas assim que as faturas offline forem processadas.
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
