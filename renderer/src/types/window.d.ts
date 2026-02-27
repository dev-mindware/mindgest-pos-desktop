export interface IpcBridge {
  send: (channel: string, data: any) => void;
  on: (channel: string, func: (...args: any[]) => void) => void;
  // SQLite Database Bridge
  db: {
    saveDocument: (doc: any) => Promise<any>;
    getAllDocuments: () => Promise<any[]>;
    deleteDocument: (id: string) => Promise<any>;
    updateProductsCache: (products: any[]) => Promise<any>;
    updateClientsCache: (clients: any[]) => Promise<any>;
    getCachedProducts: () => Promise<any[]>;
    getCachedClients: () => Promise<any[]>;
  };
}

declare global {
  interface Window {
    ipc: IpcBridge;
  }
}
