import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Award, Mail, Calendar as CalendarIconLucide } from "lucide-react";
import { ClientAnalyticsResponse } from "@/types";
import { formatCurrency } from "@/utils";
import { Separator } from "@/components/ui";

interface TopClientCardProps {
  client: ClientAnalyticsResponse["clients"][0] | undefined;
}

export function TopClientCard({ client }: TopClientCardProps) {
    if (!client) return null;
       const formatDate = (dateString: string) => {
        return new Intl.DateTimeFormat("pt-PT", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }).format(new Date(dateString));
    };

return (
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5">
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-2xl">
                                {client.clientName}
                            </CardTitle>
                            <Badge variant="default" className="text-xs">
                                Top Cliente
                            </Badge>
                        </div>
                        <CardDescription className="flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {client.clientEmail}
                        </CardDescription>
                    </div>
                    <Award className="h-8 w-8 text-primary" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Receita Total</p>
                            <p className="text-xl font-bold text-primary">
                                {formatCurrency(client.totalRevenue)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Nº de Facturas</p>
                            <p className="text-xl font-bold">{client.totalInvoices}</p>
                        </div>
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Valor Médio</p>
                            <p className="text-xl font-bold">
                                {formatCurrency(client.averageOrderValue)}
                            </p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                                <CalendarIconLucide className="h-3 w-3" />
                                Última Compra
                            </p>
                            <p className="text-xl font-bold">
                                {formatDate(client.lastPurchaseDate)}
                            </p>
                        </div>
                    </div>
                </div>
                 <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">Score de Fidelização</p>
                        <Badge variant="success" className="text-sm">
                            {client.loyaltyScore}%
                        </Badge>
                    </div>
                    <Progress value={client.loyaltyScore} className="h-3" />
                </div>
            </CardContent>
        </Card>
    );
}