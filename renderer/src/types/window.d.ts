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
  };
  security: {
    getHardwareId: () => Promise<string>;
    saveOfflineLicense: (licenseJwt: string, storeId: string) => Promise<boolean>;
  };
  sync: {
    products: (token: string, storeId: string) => Promise<{ success: boolean; count: number }>;
    clients: (token: string, storeId: string) => Promise<{ success: boolean; count: number }>;
    searchItems: (params: { search?: string; categoryId?: string; storeId?: string }) => Promise<any[]>;
  };
}

declare global {
  interface Window {
    ipc: IpcBridge;
  }
}
