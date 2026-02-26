"use client"
import { cn } from "@/lib/utils";
import { Input } from "@/components";
import { RegisterFormData } from "@/schemas";
import { useFormContext } from "react-hook-form";
import { StepsHeader } from "./steps-header";

export function SecondStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegisterFormData>();

  return (
    <div className={cn("flex flex-col gap-6")}>
      <div className="flex flex-col items-center mt-4 gap-2 text-center">
        <StepsHeader title="Insira os dados da empresa" />
      </div>
      <div className="grid gap-6">
        <Input
          label="Nif da empresa"
          startIcon="IdCard"
          placeholder="Insira seu NIF"
          {...register("step2.company.taxNumber")}
          error={
            errors?.step2?.company?.taxNumber &&
            errors?.step2?.company?.taxNumber?.message
          }
        />
        <Input
          startIcon="User"
          label="Nome da empresa"
          placeholder="Insira o nome da empresa"
          {...register("step2.company.name")}
          error={
            errors?.step2?.company?.name &&
            errors?.step2?.company?.name?.message
          }
        />
        <Input
          type="email"
          label="E-mail"
          startIcon="Mail"
          placeholder="Insira o email da empresa"
          {...register("step2.company.email")}
          error={
            errors?.step2?.company?.email &&
            errors?.step2?.company?.email?.message
          }
        />
        <Input
          label="Telefone"
          startIcon="Phone"
          placeholder="Insira seu telefone"
          {...register("step2.company.phone")}
          error={
            errors?.step2?.company?.phone &&
            errors?.step2?.company?.phone?.message
          }
        />
        <Input
          label="Endereço"
          startIcon="MapPin"
          placeholder="Insira seu endereço"
          {...register("step2.company.address")}
          error={
            errors?.step2?.company?.address &&
            errors?.step2?.company?.address?.message
          }
        />
      </div>     
    </div>
  );
}
