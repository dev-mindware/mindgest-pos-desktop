import type { BankData, BankResponse } from "@/types";
import api from "./api";

export const banksService = {
  addBank: async (data: BankData) => {
    return api.post<BankResponse>("/bank-accounts", {
      bankName: data.bankName,
      accountNumber: data.accountNumber,
      iban: "AO06" + data.iban,
      phone: data.phone,
      isDefault: data.isDefault,
    });
  },
  updateBank: async (id: string, data: Partial<BankData>) => {
    return api.patch<BankResponse>(`/bank-accounts/${id}`, data);
  },
  deleteBank: async (id: string) => {
    return api.delete<void>(`/bank-accounts/${id}`);
  },
  getBanks: async () => {
    return api.get("/bank-accounts");
  },
};
