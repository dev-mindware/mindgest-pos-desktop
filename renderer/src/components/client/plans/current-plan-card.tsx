import { Plan } from "@/types";
import {
  Badge,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "@/components/ui";
import { formatCurrency } from "@/utils";
import { useAuth } from "@/hooks/auth";

interface CurrentPlanCardProps {
  currentPlan: Plan;
}

export function CurrentPlanCard({ currentPlan }: CurrentPlanCardProps) {
  const { user } = useAuth();

  return (
    <Card className="border-border bg-primary-500/10">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-primary-700">
            Seu Plano Atual
          </CardTitle>
          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-foreground">Plano</p>
            <p className="font-semibold text-lg">{currentPlan.name}</p>
          </div>
          <div>
            <p className="text-sm text-foreground">Valor</p>
            <p className="font-semibold text-lg">
              {formatCurrency(currentPlan.priceMonthly)}
            </p>
          </div>
          <div>
            <p className="text-sm text-foreground">Próxima renovação</p>
            {/* <p className="font-semibold text-lg">
              {formatDate(user?.subscription?.expiresAt ?? "")}
            </p> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}