import { api } from "./api";

export const creditNoteService = {
  updateCreditNote: async (id: string, data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { storeId, ...rest } = data;
    return api.put(`/invoice/normal/${id}`, rest);
  },
};
