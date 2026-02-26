"use client";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PaymentTerms } from "./payment-terms";
import { SubscriptionFormData } from "@/schemas";
import { PaymentUserInfo } from "./payment-user-info";
import {
  Icon,
  Button,
  Card,
  FileUpload,
  SubscriptionSucessModal,
  SubscriptionSummary,
} from "@/components";
import { ErrorMessage } from "@/utils/messages";
import { PaymentInstruction } from "./payment-insctrutions";
import { PaymentMethodInformation } from "./payment-method-information";
import { paymentMethods } from "./payment-method";

interface PaymentFormProps {
  form: UseFormReturn<SubscriptionFormData>;
  onBack: () => void;
  onSubmit: (data: SubscriptionFormData) => Promise<void>;
  isPending: boolean;
}

export function PaymentForm({ form, onBack, onSubmit, isPending }: PaymentFormProps) {
  const { control, handleSubmit, watch } = form;
  const subscriptionData = watch();
  const [paymentMethod, setPaymentMethod] = useState<"Express" | "Kwik">("Express");
  const frequency = subscriptionData.frequency || "MONTHLY";
  const currentMethod = paymentMethods[paymentMethod];

  async function handleFormSubmit(data: SubscriptionFormData) {
    if (!data.proofPayment) {
      ErrorMessage("Por favor, envie o comprovativo de pagamento");
      return;
    }

    await onSubmit(data);
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col gap-4">
            <button
              onClick={onBack}
              className="w-max flex hover:text-primary transition-colors duration-300 items-center cursor-pointer gap-2"
            >
              <Icon name="ArrowLeft" className="w-4 h-4" />
              Voltar
            </button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Finalizar Pagamento
              </h1>
              <p className="text-foreground">
                Escolha sua forma de pagamento para poder prosseguir
              </p>
            </div>
          </div>

          <Card className="p-6 border-border shadow-none">
            <h2 className="text-lg font-semibold">Método de Pagamento</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(paymentMethods).map(([key, method]) => {
                return (
                  <button
                    key={key}
                    onClick={() => setPaymentMethod(key as any)}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${paymentMethod === key
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700"
                      }`}
                  >
                    <div className="h-16 w-full relative flex items-center justify-center p-2 mb-2">
                      <img
                        src={`/${method.icon}`}
                        alt={method.name}
                        className="h-full w-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                      Taxa: 0
                    </div>
                  </button>
                );
              })}
            </div>

            <PaymentMethodInformation currentMethod={currentMethod} />

            <form
              onSubmit={handleSubmit(handleFormSubmit, (errors) => {
                console.log("Validation Errors:", errors);
              })}
              className="space-y-6"
            >
              <FileUpload
                control={control}
                name="proofPayment"
                accept={[".pdf", ".jpg", ".jpeg", ".png"]}
                label="Comprovativo de Pagamento"
              />

              <PaymentInstruction
                currentMethod={currentMethod}
              />

              <Button
                size="lg"
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3"
                disabled={isPending}
              >
                {isPending ? (
                  <Icon name="LoaderCircle" className="animate-spin" />
                ) : (
                  "Finalizar Pagamento"
                )}
              </Button>
            </form>
          </Card>
        </div>

        <div className="space-y-6">
          <SubscriptionSummary
            selectedPlan={subscriptionData.plan}
            months={frequency === "ANNUAL" ? 12 : 1}
            frequency={frequency}
          />
          <PaymentUserInfo subscriptionData={subscriptionData} />
          <PaymentTerms />
        </div>
      </div>
      <SubscriptionSucessModal />
    </div>
  );
}
