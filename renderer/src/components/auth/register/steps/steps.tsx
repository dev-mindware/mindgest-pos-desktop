"use client";
import { useState, useTransition } from "react";
import { FirstStep } from "./first-step";
import { SecondStep } from "./second-step";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperSeparator,
  StepperIndicator,
  AccountCreatedModal,
} from "@/components";
import { NavigationButtons } from "./navigation-buttons";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/schemas";
import { ThirdStep } from "./third-step";
import { HeroImageSide } from "../../_components";
import { useAddCompany } from "@/hooks";
import { ErrorMessage } from "@/utils/messages";
import Link from "next/link";

export function RegisterForm() {
  const steps = [1, 2, 3];
  const [currentStep, setCurrentStep] = useState(1);
  const { mutateAsync: addCompany, isPending } = useAddCompany();
  const [isLoading, startTransition] = useTransition();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  const validateCurrentStep = async () => {
    switch (currentStep) {
      case 1:
        return await form.trigger("step1");
      case 2:
        return await form.trigger("step2");
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    const isValid = await validateCurrentStep();
    if (!isValid) return;
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = async () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderCurrentForm = () => {
    switch (currentStep) {
      case 1:
        return <FirstStep />;
      case 2:
        return <SecondStep />;
      case 3:
        return <ThirdStep />;
      default:
        return null;
    }
  };

  function onSubmit(data: RegisterFormData) {
    startTransition(async () => {
      try {
        const { passwordConfirmation, ...rest } = data.step1;
        const finalData = { ...rest, ...data.step2 };

        await addCompany(finalData);
      } catch (error: any) {
        if (error?.response?.data) {
          ErrorMessage(
            error?.response?.data?.message ||
              "Ocorreu um erro ao criar a conta",
          );
        } else {
          ErrorMessage("Ocorreu um erro desconhecido.Tente novamente");
        }
      }
    });
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="relative grid min-h-svh lg:grid-cols-2">
          <HeroImageSide source="/register.svg" />

          <div className="relative z-20 flex flex-col p-6 md:p-10">
            <div className="max-w-xl mx-auto space-y-8 text-center md:w-[25rem] w-50">
              <Stepper value={currentStep} onValueChange={setCurrentStep}>
                {steps.map((step) => (
                  <StepperItem
                    key={step}
                    step={step}
                    className="not-last:flex-1"
                    loading={isLoading}
                  >
                    <StepperTrigger asChild>
                      <StepperIndicator />
                    </StepperTrigger>
                    {step < steps.length && <StepperSeparator />}
                  </StepperItem>
                ))}
              </Stepper>
            </div>

            <div className="flex flex-col gap-8 items-center justify-center flex-1">
              <div className="w-full max-w-md">{renderCurrentForm()}</div>

              <NavigationButtons
                currentStep={currentStep}
                totalSteps={steps.length}
                handlePrevStep={handlePrevStep}
                handleNextStep={handleNextStep}
                isLoading={isLoading || isPending}
              />

              <div className="text-sm text-center">
                Já tens uma conta?{" "}
                <Link
                  href="/auth/login"
                  className="font-medium text-primary hover:underline underline-offset-4"
                >
                  Entrar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
      <AccountCreatedModal />
    </FormProvider>
  );
}
