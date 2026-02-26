import { Icon, Alert, AlertDescription } from "@/components";

export function WithoutActivePlan() {
  return (
    <Alert className="mb-6 bg-card">
      <Icon name="Info" className="h-4 w-4 text-primary-600" />
      <AlertDescription className="text-primary-800 flex">
        <span className="font-medium">
          Status atual: Você não possui nenhuma Subscrição ativa.
        </span>
        <span className="text-primary-700 ml-1">
          Explore os planos disponíveis abaixo para começar.
        </span>
      </AlertDescription>
    </Alert>
  );
}