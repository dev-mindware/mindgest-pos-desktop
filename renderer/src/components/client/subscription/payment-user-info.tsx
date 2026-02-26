import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { SubscriptionFormData } from "@/schemas";

type FieldProps = {
  label: string;
  value: string;
};

function Field({ label, value }: FieldProps) {
  return (
    <div className="flex space-x-2">
      <strong>{label}:</strong>
      <span>{value}</span>
    </div>
  );
}

type Props = {
  subscriptionData: SubscriptionFormData;
}

export function PaymentUserInfo({ subscriptionData }: Props) {
  return (
    <Card className="border-border shadow-none">
      <CardHeader>
        <CardTitle className="text-xl text-foreground">
          Dados do Cliente
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <Field label="Nome" value={subscriptionData.name || ""} />
        <Field label="Email" value={subscriptionData.email || ""} />
        <Field label="Empresa" value={subscriptionData.company || ""} />
        <Field label="Telefone" value={subscriptionData.phone || ""} />
      </CardContent>
    </Card>
  );
}
