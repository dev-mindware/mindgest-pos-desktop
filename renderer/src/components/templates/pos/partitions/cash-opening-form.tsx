"use client";
import React, { useState } from "react";
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Button,
  Avatar,
  AvatarFallback,
} from "@/components";
import DatePickerInput from "@/components/custom/date-picker-input";
import TimeInput from "@/components/custom/time-input";
import PriceInput from "@/components/custom/price-input";
import { CashOpeningFormProps } from "@/types/cashier";

export const CashOpeningForm: React.FC<CashOpeningFormProps> = ({
  openCashRegisters,
  onRemove,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    capital: "",
    shiftTime: "",
    openingTime: "",
    openingDate: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObj = new FormData();
    formDataObj.append("capital", formData.capital);
    formDataObj.append("shiftTime", formData.shiftTime);
    formDataObj.append("openingTime", formData.openingTime);
    formDataObj.append("openingDate", formData.openingDate.toISOString());
    onSubmit(formDataObj);
    setFormData({
      capital: "",
      shiftTime: "",
      openingTime: "",
      openingDate: new Date(),
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Abertura de Caixa</CardTitle>
        <p className="text-sm text-muted-foreground">
          Faça a abertura de caixa aqui e controle o fluxo de vendas dos seus
          funcionários. Clique nos cards dos caixas para adicioná-los.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label htmlFor="capital">Capital Inicial</Label>
            <PriceInput />
          </div>
          <div className="space-y-2">
            <Label htmlFor="expediente">Tempo de Expediente</Label>
            <TimeInput />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hora">Hora de Abertura</Label>
            <TimeInput />
          </div>
          <div className="space-y-2">
            <Label htmlFor="data">Data de Abertura</Label>
            <DatePickerInput id="data" />
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h3 className="text-sm font-medium">
            Caixas Selecionados ({openCashRegisters.length})
          </h3>
          {openCashRegisters.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              <p>Nenhum caixa selecionado</p>
              <p className="mt-1 text-xs">
                Clique nos cards dos caixas para adicioná-los
              </p>
            </div>
          ) : (
            openCashRegisters.map((cashier) => (
              <div
                key={cashier.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">
                      {cashier.name
                        .split(" ")
                        .map((value: string) => value[0])
                        .join("")
                        .substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-sm font-semibold">
                      Caixa nº{cashier.cashNumber}
                    </h3>
                    <p className="text-sm text-primary">{cashier.name}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-red-500 hover:text-red-700"
                  onClick={() => onRemove(cashier.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            className="flex-1"
            disabled={openCashRegisters.length === 0}
            onClick={handleSubmit}
          >
            Salvar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
