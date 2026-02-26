"use client";
import {
  Card,
  Input,
  Button,
  Label,
  CardTitle,
  AlertError,
  CardHeader,
  CardContent,
  CardDescription,
  RequestError,
  SubscriptionSkeleton,
  SubscriptionSummary,
  RadioGroup,
  RadioGroupItem,
} from "@/components";
import { Controller } from "react-hook-form";
import { Plan } from "@/types";
import { usePlans } from "@/hooks";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { PlanCard } from "./plan-card";
import { useCurrentPlanStore } from "@/stores";
import { ErrorMessage } from "@/utils/messages";
import { SubscriptionFormData } from "@/schemas";
import { useAuth } from "@/hooks/auth";

interface SubscriptionFormProps {
  form: UseFormReturn<SubscriptionFormData>;
  onNext: () => void;
}

export function SubscriptionForm({ form, onNext }: SubscriptionFormProps) {
  const { user } = useAuth();
  const { plans, error, isLoading, refetch } = usePlans();
  const { currentPlanSelected, setCurrentPlanSelected } = useCurrentPlanStore();

  const {
    control,
    register,
    formState: { errors },
    setValue,
  } = form;

  useEffect(() => {
    if (plans.length > 0) {
      if (currentPlanSelected) {
        setValue("plan", currentPlanSelected);
        setValue("planId", currentPlanSelected.id)

      } else {
        setValue("plan", plans[0]);
        setValue("planId", plans[0].id)
        setCurrentPlanSelected(plans[0]);
      }

      setValue("companyId", user?.company?.id || "");
      setValue("name", user?.name || "");
      setValue("email", user?.email || "");
      setValue("company", user?.company?.name || "");
      setValue("phone", user?.company?.phone || "");
    }
  }, [plans, currentPlanSelected, setValue, setCurrentPlanSelected, user]);

  if (isLoading) return <SubscriptionSkeleton />;
  if (error) return <RequestError refetch={refetch} />;

  const handleNext = () => {
    if (!currentPlanSelected) {
      ErrorMessage("Por favor, selecione um plano.");
      return;
    }

    setValue("planId", currentPlanSelected.id);
    setValue("status", "PENDING_PAYMENT");

    onNext();
  };

  const handlePlanSelect = (plan: Plan) => {
    const activePlanId = user?.company?.subscription?.plan.id;

    if (plan.id === activePlanId) {
      ErrorMessage("Você já possui este plano ativo.");
      return;
    }

    setCurrentPlanSelected(plan);
    setValue("plan", plan);
  };

  const frequency = form.watch("frequency") || "MONTHLY";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="border-border shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl text-primary-500">
              Dados para Subscrição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-foreground">
                Tipo de Subscrição
              </h3>

              <div className="space-y-3">
                <Controller
                  control={control}
                  name="frequency"
                  render={({ field }) => (
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value || "MONTHLY"}
                      value={field.value || "MONTHLY"}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="MONTHLY" id="MONTHLY" />
                        <Label htmlFor="MONTHLY" className="cursor-pointer">Mensal</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="ANNUAL" id="ANNUAL" />
                        <Label htmlFor="ANNUAL" className="cursor-pointer">Anual</Label>
                      </div>
                    </RadioGroup>
                  )}
                />
                {errors.frequency && (
                  <AlertError errorMessage={errors.frequency.message} />
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Escolha seu Plano
                </h3>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <PlanCard
                      plan={plan}
                      key={plan.id}
                      isSelected={currentPlanSelected?.id === plan.id}
                      onSelect={() => handlePlanSelect(plan)}
                    />
                  ))}
                </div>
                {errors.plan && (
                  <AlertError errorMessage={errors?.plan?.message?.toString()} />
                )}
              </div>

              <Button
                type="button"
                onClick={handleNext}
                className="w-full bg-primary-500 hover:bg-primary-600 text-white text-sm py-3 font-semibold"
              >
                Avançar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-1">
        <SubscriptionSummary
          months={frequency === "ANNUAL" ? 12 : 1}
          frequency={frequency}
          selectedPlan={currentPlanSelected}
        />
      </div>
    </div>
  );
}