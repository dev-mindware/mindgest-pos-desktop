import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipc", {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  // SQLite Database Bridge — all document operations are user-scoped
  db: {
    saveDocument: (doc: any) => ipcRenderer.invoke("db:save-document", doc),
    getAllDocuments: (userId: string) =>
      ipcRenderer.invoke("db:get-all-documents", userId),
    deleteDocument: (id: string, userId: string) =>
      ipcRenderer.invoke("db:delete-document", { id, userId }),
    clearDocuments: (userId: string) =>
      ipcRenderer.invoke("db:clear-documents", userId),
    updateProductsCache: (products: any[]) =>
      ipcRenderer.invoke("db:update-products-cache", products),
    updateClientsCache: (clients: any[]) =>
      ipcRenderer.invoke("db:update-clients-cache", clients),
    getCachedProducts: () => ipcRenderer.invoke("db:get-cached-products"),
    getCachedClients: () => ipcRenderer.invoke("db:get-cached-clients"),
  },
  // Security Bridge (Anti-Tampering)
  security: {
    getHardwareId: () => ipcRenderer.invoke("security:get-hwid"),
    saveOfflineLicense: (licenseJwt: string, storeId: string) => 
      ipcRenderer.invoke("security:save-license", { licenseJwt, storeId }),
  },
  // Sync Bridge (Cloud to Local)
  sync: {
    products: (token: string, storeId: string) => 
      ipcRenderer.invoke("sync:products", { token, storeId }),
    clients: (token: string, storeId: string) => 
      ipcRenderer.invoke("sync:clients", { token, storeId }),
    searchItems: (params: { search?: string, categoryId?: string, storeId?: string }) =>
      ipcRenderer.invoke("sync:search-items", params),
    searchClients: (params: { search?: string, storeId?: string }) =>
      ipcRenderer.invoke("sync:search-clients", params),
    upsertItem: (item: any, storeId: string) =>
      ipcRenderer.invoke("sync:upsert-item", { item, storeId }),
    deleteItem: (id: string, role: string) =>
      ipcRenderer.invoke("sync:delete-item", { id, role }),
    upsertClient: (client: any, storeId: string) =>
      ipcRenderer.invoke("sync:upsert-client", { client, storeId }),
    deleteClient: (id: string, role: string) =>
      ipcRenderer.invoke("sync:delete-client", { id, role }),
    searchInvoices: (params: { storeId?: string }) =>
      ipcRenderer.invoke("sync:search-invoices", params),
    
    // Sessões de Caixa
    searchCashSessions: (params: { storeId?: string }) =>
      ipcRenderer.invoke("sync:search-cash-sessions", params),
    getCurrentSession: (params: { storeId?: string, userId?: string }) =>
      ipcRenderer.invoke("sync:get-current-session", params),
    openCashSession: (params: { storeId: string, userId: string, openingBalance: number }) =>
      ipcRenderer.invoke("sync:open-cash-session", params),
    closeCashSession: (params: { sessionId: string, closingBalance: number, totalSales: number, totalExpenses: number }) =>
      ipcRenderer.invoke("sync:close-cash-session", params),
    addCashMovement: (params: { sessionId: string, type: string, description: string, amount: number }) =>
      ipcRenderer.invoke("sync:add-cash-movement", params),
  }
});
