export interface IpcBridge {
  send: (channel: string, data: any) => void;
  on: (channel: string, func: (...args: any[]) => void) => void;
  off: (channel: string, func: (...args: any[]) => void) => void;
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
    getClientCloudId: (params: { id?: string; taxNumber?: string; email?: string }) => Promise<string | null>;
  };
  security: {
    getHardwareId: () => Promise<string>;
    saveOfflineLicense: (licenseJwt: string, storeId: string) => Promise<boolean>;
    checkClock: () => Promise<{ valid: boolean; reason?: string }>;
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
    createInvoice: (params: { invoiceData: InvoiceReceiptPayload; storeId: string; userId: string; user?: { id: string; email: string; name: string; role: string; storeId?: string } }) => Promise<any>;
    createProforma: (params: { proformaData: any; storeId: string; userId: string }) => Promise<any>;
    getPendingOutboxCount: () => Promise<number>;

    // Sessões de Caixa
    searchCashSessions: (params: { storeId?: string }) => Promise<any[]>;
    getCurrentSession: (params: { storeId?: string, userId?: string }) => Promise<any>;
    openCashSession: (params: { storeId: string, userId: string, openingBalance: number }) => Promise<any>;
    closeCashSession: (params: { sessionId: string, closingBalance: number, totalSales: number, totalExpenses: number }) => Promise<any>;
    addCashMovement: (params: { sessionId: string, type: string, description: string, amount: number }) => Promise<any>;

    // Métodos para persistência de dados quando offline
    persistCashSession: (params: { session: any }) => Promise<any>;
    processOutbox: (params: { token: string, userId: string }) => Promise<{ processed: number; error?: string }>;
    startAutoSync: (params: { token: string, storeId: string, userId: string, intervalMs?: number }) => Promise<{ started: true; intervalMs: number }>;
    stopAutoSync: () => Promise<{ stopped: true }>;
    triggerSync: (params: { token: string, storeId: string, userId: string }) => Promise<any>;
    getSyncStatus: () => Promise<{ running: boolean; lastSyncAt?: string; nextSyncAt?: string; lastResult?: any }>;
  };
  app: {
    getVersion: () => Promise<string>;
  };
  update: {
    checkForUpdates: () => Promise<any>;
    downloadUpdate: () => Promise<any>;
    installUpdate: () => Promise<any>;
  };
}

declare global {
  interface Window {
    ipc: IpcBridge;
  }
}
