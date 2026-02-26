
export type storesFilters = {
  sortBy: string | null;
  status: string | null;
  sortOrder: string | null;
  search: string | null;
};

export type StoreData = {
  name: string;
  email?: string;
  phone?: string;
  address: string;
  companyId?: string;
};

export type StoreResponse = StoreData & {
  id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StoreList = StoreData[];
