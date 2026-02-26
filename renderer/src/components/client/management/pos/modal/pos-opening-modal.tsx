"use client";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GlobalModal,
  Input,
  Button,
  Icon,
  RHFSelect,
  Label,
  RequestError,
  TimeField,
  DateInput,
} from "@/components";
import { useModal } from "@/stores";
import { useGetStoresPaginated } from "@/hooks/entities";
import { useGetCashiersPaginated } from "@/hooks/collaborators/cashier";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { PosOpeningFormData, posOpeningSchema } from "@/schemas/pos-opening";
import { useCurrentCashierStore } from "@/stores/pos/current-cashier-store";
import { useOpenCashSession, useUpdateCashSession } from "@/hooks/entities";
import { SucessMessage, ErrorMessage, formatCurrency, parseCurrency } from "@/utils";
import { PaginatedSelect } from "@/components/shared/filters/paginated-select";
import { MultiSelect } from "@/components/common/input-fetch/async-multi-select";
import { parseTime } from "@internationalized/date";

function safeParseTime(timeStr: string) {
  try {
    if (!timeStr || timeStr.length < 5) return parseTime("08:00");
    return parseTime(timeStr.slice(0, 5));
  } catch (e) {
    return parseTime("08:00");
  }
}

export function PosOpeningModal() {
  const { closeModal } = useModal();
  const { currentCashier, setCurrentCashier } = useCurrentCashierStore();
  const [storePage, setStorePage] = useState(1);

  const {
    data: storesData,
    isLoading: isLoadingStores,
    isError: storesError,
    totalPages: storeTotalPages,
    refetch: refetchStores,
  } = useGetStoresPaginated(storePage, 10, "OWNER");

  const { mutateAsync: openSession, isPending: isOpening } = useOpenCashSession();
  const { mutateAsync: updateSession, isPending: isUpdating } = useUpdateCashSession();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PosOpeningFormData>({
    resolver: zodResolver(posOpeningSchema),
    defaultValues: {
      initialCapital: "",
      workTime: "06:00",
      storeId: "",
      cashierIds: [],
      fundType: "Coin",
    },
  });

  const selectedStoreId = watch("storeId");

  const {
    data: allCashiers,
    isLoading: isLoadingCashiers,
  } = useGetCashiersPaginated(1, 100, "", selectedStoreId);

  const isEdit = !!currentCashier;

  useEffect(() => {
    if (isEdit && currentCashier) {
      // Normalize fundType from API (e.g. "COIN" -> "Coin", "NOTE" -> "Note")
      const normalizedFundType = currentCashier.fundType
        ? currentCashier.fundType.charAt(0).toUpperCase() + currentCashier.fundType.slice(1).toLowerCase()
        : "Coin";

      reset({
        initialCapital: (currentCashier.openingCash || 0).toString(),
        workTime: currentCashier.workTime || "06:00",
        storeId: currentCashier.storeId || "",
        cashierIds: currentCashier.userId ? [currentCashier.userId] : [],
        fundType: normalizedFundType,
      });
    } else {
      reset({
        initialCapital: "",
        workTime: "06:00",
        storeId: "",
        cashierIds: [],
        fundType: "Coin",
      });
    }
  }, [isEdit, currentCashier, reset]);

  const selectedCashierIds = watch("cashierIds") || [];

  const handleClose = () => {
    reset();
    setCurrentCashier(null);
    closeModal("opening-cashier");
  };

  const onSubmit = async (data: PosOpeningFormData) => {
    try {
      if (isEdit && currentCashier) {
        await updateSession({ id: currentCashier.id.toString(), data });
      } else {
        await openSession(data);
      }
      handleClose();
    } catch (error: any) {
      // Errors are handled by the mutation's onError
    }
  };

  if (isLoadingStores) {
    return (
      <GlobalModal id="opening-cashier" title="Abertura de Caixa" canClose>
        <div className="p-8 text-center flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground font-medium">
            Carregando lojas...
          </p>
        </div>
      </GlobalModal>
    );
  }

  if (storesError) {
    return (
      <GlobalModal id="opening-cashier" title="Abertura de Caixa" canClose className="!w-max">
        <div className="p-4">
          <RequestError
            refetch={refetchStores}
            message="Ocorreu um erro ao carregar as lojas"
          />
        </div>
      </GlobalModal>
    );
  }

  return (
    <GlobalModal
      id="opening-cashier"
      title={isEdit ? "Editar Configuração de Caixa" : "Abertura de Caixa"}
      description={
        isEdit
          ? "Edite as configurações da sessão deste caixa"
          : "Faça a abertura de caixa aqui e controle o fluxo de vendas dos seu funcionários"
      }
      canClose
      className="sm:max-w-[600px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-1">
            <Controller
              name="initialCapital"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Capital Inicial"
                  placeholder="0.00 Kz"
                  startIcon="CircleDollarSign"
                  value={formatCurrency(value || 0)}
                  onChange={(e) => onChange(parseCurrency(e.target.value).toString())}
                  error={errors.initialCapital?.message}
                />
              )}
            />
          </div>
          <div className="space-y-2 col-span-1">
            <Controller
              name="workTime"
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  <Label>Tempo de Expediente</Label>
                  <TimeField
                    aria-label="Tempo de Expediente"
                    hourCycle={24}
                    className="w-full"
                    value={safeParseTime(field.value)}
                    onChange={(time) => {
                      if (time) field.onChange(time.toString().slice(0, 5));
                    }}
                  >
                    <div className="relative">
                      <DateInput id="work-time-input" className="bg-background" />
                      <Icon name="Clock" className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    </div>
                  </TimeField>
                  {errors.workTime && (
                    <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mt-1">
                      {errors.workTime.message}
                    </p>
                  )}
                </div>
              )}
            />
          </div>

          <div className="space-y-2 col-span-1">
            <RHFSelect
              name="fundType"
              control={control}
              label="Tipo de Fundo"
              placeholder="Selecione o tipo"
              options={[
                { label: "Moeda", value: "Coin" },
                { label: "Nota", value: "Note" },
              ]}
            />
          </div>

          <div className="col-span-1">
            <Controller
              name="storeId"
              control={control}
              render={({ field }) => (
                <PaginatedSelect
                  label="Loja"
                  placeholder="Selecione a loja"
                  options={storesData.map((s) => ({ label: s.name, value: s.id }))}
                  value={field.value}
                  onChange={field.onChange}
                  isLoading={isLoadingStores}
                  pagination={{ page: storePage, totalPages: storeTotalPages }}
                  onPageChange={setStorePage}
                  className="w-full"
                />
              )}
            />
            {errors.storeId && (
              <p className="text-[10px] font-bold text-destructive uppercase tracking-widest mt-1">
                {errors.storeId.message}
              </p>
            )}
          </div>

          <div className="col-span-1 md:col-span-2">
            <Controller
              name="cashierIds"
              control={control}
              render={({ field }) => (
                <MultiSelect
                  label="Caixas Disponíveis para Abertura"
                  placeholder="Escolha os caixas"
                  options={allCashiers.map((c) => ({
                    label: `${c.name} (${c.email})`,
                    value: c.id,
                  }))}
                  value={allCashiers
                    .filter((c) => field.value?.includes(c.id))
                    .map((c) => ({ label: c.name, value: c.id }))}
                  onChange={(options) =>
                    field.onChange(options.map((opt) => opt.value))
                  }
                  isLoading={isLoadingCashiers}
                  error={errors.cashierIds?.message}
                />
              )}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-muted-foreground/5">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            loading={isOpening || isUpdating}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {isEdit ? "Salvar Alterações" : "Abrir Caixa"}
          </Button>
        </div>
      </form>
    </GlobalModal>
  );
}
