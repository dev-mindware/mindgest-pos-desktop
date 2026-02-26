import type { User as CompanyResponse, CompanyData } from "@/types";
import { api } from "./api";

export const companyService = {
  addCompany: async (data: CompanyData) => {
    return api.post<CompanyResponse>("/companies", data);
  },
};
