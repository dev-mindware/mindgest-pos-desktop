"use client";
import { useState } from "react";
import { useModal } from "@/stores";
import { useForm } from "react-hook-form";
import { PaymentForm } from "./payment-form";
import { ErrorMessage } from "@/utils/messages";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubscriptionForm } from "./subscription-form";
import { SubscriptionFormData, subscriptionSchema } from "@/schemas";
import { useFileUpload } from "@/hooks/common/use-upload";

type CurrentStep = "subscription" | "payment";

export function SubscriptionPageContent() {
  const { openModal } = useModal();
  const [currentStep, setCurrentStep] = useState<CurrentStep>("subscription");
  const { mutateAsync: uploadFile, isPending } = useFileUpload("/subscriptions", "subscriptions", "POST");

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      status: "PENDING_PAYMENT",
      frequency: "MONTHLY",
      proofPayment: null,
    },
  });

  async function handleSubscriptionNext() {
    const isValid = await form.trigger(["planId", "frequency", "name", "email", "company", "phone"]);

    if (isValid) {
      setCurrentStep("payment");
    }
  }

  function handlePaymentBack() {
    setCurrentStep("subscription");
  }

  async function handlePaymentSubmit(data: SubscriptionFormData) {

    try {

      if (!data.proofPayment) {
        ErrorMessage("Por favor, envie o comprovativo de pagamento");
        return;
      }

      const res = await uploadFile({
        files: {
          proofPayment: data.proofPayment
        },
        extraData: {
          frequency: data.frequency,
          planId: data.planId,
        }
      });

      openModal("subscription-created");
      localStorage.removeItem("MGEST-PLAN-STORE");

    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(error?.response?.data?.message);
      } else {
        ErrorMessage("Ocorreu um erro ao criar a assinatura. Tente novamente.");
      }
    }

  }

  return (
    <div className="min-h-screen bg-background">
      {currentStep === "subscription" ? (
        <SubscriptionForm form={form} onNext={handleSubscriptionNext} />
      ) : (
        <PaymentForm
          form={form}
          onBack={handlePaymentBack}
          onSubmit={handlePaymentSubmit}
          isPending={isPending}
        />
      )}
    </div>
  );
}
