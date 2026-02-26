"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";
import { api } from "@/services/api";
import { ErrorMessage, SucessMessage } from "@/utils/messages";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function SaftExportCard() {
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState<string>(
    (new Date().getMonth() + 1).toString()
  );
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );
  const [isExporting, setIsExporting] = useState(false);

  const years = Array.from({ length: 5 }, (_, i) =>
    (currentYear - i).toString()
  );
  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(2024, i, 1);
    return {
      value: (i + 1).toString(),
      label: format(date, "MMMM", { locale: ptBR }),
    };
  });

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await api.get("/saft", {
        params: {
          year: parseInt(selectedYear),
          month: parseInt(selectedMonth),
        },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `SAFT_${selectedYear}_${selectedMonth.padStart(2, "0")}.xml`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      SucessMessage("Ficheiro SAFT exportado com sucesso!");
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(error?.response?.data?.message);
      } else {
        ErrorMessage("Erro ao exportar ficheiro SAFT");
      }

    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Card className="h-max">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">Exportar SAFT</CardTitle>
          <CardDescription className="mt-1">
            Ficheiro para Autoridade Tributária
          </CardDescription>
        </div>
        <Download className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Mês
            </label>
            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
              <SelectTrigger>
                <SelectValue placeholder="Mês" />
              </SelectTrigger>
              <SelectContent>
                {months.map((month) => (
                  <SelectItem
                    key={month.value}
                    value={month.value}
                    className="capitalize"
                  >
                    {month.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Ano
            </label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Ano" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full"
        >
          {isExporting ? (
            <>
              <Download className="mr-2 h-4 w-4 animate-pulse" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exportar SAFT
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
