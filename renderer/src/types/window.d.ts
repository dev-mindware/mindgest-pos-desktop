export interface IpcBridge {
  send: (channel: string, data: any) => void;
  on: (channel: string, func: (...args: any[]) => void) => void;
  // SQLite Database Bridge — all document operations are user-scoped
  db: {
    saveDocument: (doc: {
      id: string;
      userId: string;
      type: string;
      payload: any;
    }) => Promise<any>;
    getAllDocuments: (userId: string) => Promise<any[]>;
    deleteDocument: (id: string, userId: string) => Promise<any>;
    clearDocuments: (userId: string) => Promise<any>;
    updateProductsCache: (products: any[]) => Promise<any>;
    updateClientsCache: (clients: any[]) => Promise<any>;
    getCachedProducts: () => Promise<any[]>;
    getCachedClients: () => Promise<any[]>;
    getItemCloudId: (id: string) => Promise<string>;
    getClientCloudId: (params: { id?: string; nif?: string; email?: string }) => Promise<string | null>;
  };
  security: {
    getHardwareId: () => Promise<string>;
    saveOfflineLicense: (licenseJwt: string, storeId: string) => Promise<boolean>;
  };
  sync: {
    products: (token: string, storeId: string) => Promise<{ success: boolean; count: number }>;
    categories: (token: string, storeId: string) => Promise<{ success: boolean; count: number }>;
    clients: (token: string, storeId: string) => Promise<{ success: boolean; count: number }>;
    getCategories: (params: { storeId?: string }) => Promise<any[]>;
    searchItems: (params: { search?: string; categoryId?: string; storeId?: string }) => Promise<any[]>;
    searchClients: (params: { search?: string; storeId?: string }) => Promise<any[]>;
    upsertItem: (item: any, storeId: string) => Promise<any>;
    reduceLocalStock: (items: { id: string; quantity: number }[]) => Promise<boolean>;
    deleteItem: (id: string, role: string) => Promise<any>;
    upsertClient: (client: any, storeId: string) => Promise<any>;
    deleteClient: (id: string, role: string) => Promise<any>;
    searchInvoices: (params: { storeId?: string }) => Promise<any[]>;
    
    // Sessões de Caixa
    searchCashSessions: (params: { storeId?: string }) => Promise<any[]>;
    getCurrentSession: (params: { storeId?: string, userId?: string }) => Promise<any>;
    openCashSession: (params: { storeId: string, userId: string, openingBalance: number }) => Promise<any>;
    closeCashSession: (params: { sessionId: string, closingBalance: number, totalSales: number, totalExpenses: number }) => Promise<any>;
    addCashMovement: (params: { sessionId: string, type: string, description: string, amount: number }) => Promise<any>;
    
    // Métodos para persistência de dados quando offline
    persistCashSession: (params: { session: any }) => Promise<any>;
    processOutbox: (params: { token: string, userId: string }) => Promise<{ processed: number; error?: string }>;
  };
}

declare global {
  interface Window {
    ipc: IpcBridge;
  }
}
