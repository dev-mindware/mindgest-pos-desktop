export type StockData = {
  quantity: number;
  reserved: number;
  available: number;
  itemsId: string;
  storeId: string;
};

export type StockResponse = StockData & {
  id: string;
  createdAt: string;
  updatedAt: string;
  stockLevel: "LOW_STOCK" | "IN_STOCK" | "OUT_OF_STOCK";
  hasReservedStock: boolean;
  isOutOfStock: boolean;
  item?: {
    id: string;
    name: string;
    sku: string | null;
    barcode: string | null;
    price: number;
    minStock: number;
    maxStock: number | null;
    unit: string;
    image: string | null;
  };
  store?: {
    id: string;
    name: string;
    companyId: string;
  };
};

export type StockCreateData = {
  quantity: number;
  itemsId: string;
  reserved?: number;
};

export type StockAdjustData = {
  adjustment: number;
  reason: string;
};

export type StockReserveData = {
  amount: number;
  reason: string;
};

export type StockUnreserveData = {
  amount: number;
  reason: string;
};

export type StockSummaryResponse = {
  totalItems: number;
  lowStockCount: number;
  outOfStockCount: number;
  adequateStockCount: number;
  totalUnits: number;
  totalAvailable: number;
  totalReserved: number;
  lowStockPercentage: number;
  outOfStockPercentage: number;
  lastUpdated: string;
};
