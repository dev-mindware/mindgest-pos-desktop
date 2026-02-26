import { create } from "zustand";
import { StockResponse } from "@/types/stock";

type CurrentStockStore = {
  currentStock: StockResponse | null;
  setCurrentStock: (stock: StockResponse | null) => void;
};

export const currentStockStore = create<CurrentStockStore>((set) => ({
  currentStock: null,
  setCurrentStock: (stock) => set({ currentStock: stock }),
}));
