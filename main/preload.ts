import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipc", {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, func: (...args: any[]) => void) => {
    // Attach listener directly so the renderer can remove it with the same function reference
    ipcRenderer.on(channel, func as any);
  },
  off: (channel: string, func: (...args: any[]) => void) => {
    // Remove a specific listener previously registered with `on`
    ipcRenderer.removeListener(channel, func as any);
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
    getItemCloudId: (id: string) => ipcRenderer.invoke("db:get-item-cloud-id", id),
    getClientCloudId: (params: { id?: string; nif?: string; email?: string }) => ipcRenderer.invoke("db:get-client-cloud-id", params),
  },
  // Security Bridge (Anti-Tampering)
  security: {
    getHardwareId: () => ipcRenderer.invoke("security:get-hwid"),
    saveOfflineLicense: (licenseJwt: string, storeId: string) => 
      ipcRenderer.invoke("security:save-license", { licenseJwt, storeId }),
    checkClock: () => ipcRenderer.invoke("security:check-clock"),
  },
  // LAN Configuration Bridge
  lan: {
    getLocalIp: () => ipcRenderer.invoke("lan:get-local-ip"),
    getConfig: () => ipcRenderer.invoke("lan:get-config"),
    setConfig: (config: any) => ipcRenderer.invoke("lan:set-config", config),
  },
  // Sync Bridge (Cloud to Local)
  sync: {
    products: (token: string, storeId: string) => 
      ipcRenderer.invoke("sync:products", { token, storeId }),
    categories: (token: string, storeId: string) => 
      ipcRenderer.invoke("sync:categories", { token, storeId }),
    clients: (token: string, storeId: string) => 
      ipcRenderer.invoke("sync:clients", { token, storeId }),
    getCategories: (params: { storeId?: string }) =>
      ipcRenderer.invoke("sync:get-categories", params),
    searchItems: (params: { search?: string, categoryId?: string, storeId?: string }) =>
      ipcRenderer.invoke("sync:search-items", params),
    searchClients: (params: { search?: string, storeId?: string }) =>
      ipcRenderer.invoke("sync:search-clients", params),
    upsertItem: (item: any, storeId: string) =>
      ipcRenderer.invoke("sync:upsert-item", { item, storeId }),
    reduceLocalStock: (items: { id: string; quantity: number }[]) =>
      ipcRenderer.invoke("sync:reduce-local-stock", items),
    deleteItem: (id: string, role: string) =>
      ipcRenderer.invoke("sync:delete-item", { id, role }),
    upsertClient: (client: any, storeId: string) =>
      ipcRenderer.invoke("sync:upsert-client", { client, storeId }),
    deleteClient: (id: string, role: string) =>
      ipcRenderer.invoke("sync:delete-client", { id, role }),
    searchInvoices: (params: { storeId?: string }) =>
      ipcRenderer.invoke("sync:search-invoices", params),
    createInvoice: (params: { invoiceData: any, storeId: string, userId: string }) =>
      ipcRenderer.invoke("sync:create-invoice", params),
    createProforma: (params: { proformaData: any, storeId: string, userId: string }) =>
      ipcRenderer.invoke("sync:create-proforma", params),
    getPendingOutboxCount: () =>
      ipcRenderer.invoke("sync:get-pending-outbox-count"),
    
    // Sessões de Caixa
    searchCashSessions: (params: { storeId?: string }) =>
      ipcRenderer.invoke("sync:search-cash-sessions", params),
    getCurrentSession: (params: { storeId?: string, userId?: string }) =>
      ipcRenderer.invoke("sync:get-current-session", params),
    openCashSession: (params: { storeId: string, userId: string, openingBalance: number }) =>
      ipcRenderer.invoke("sync:open-cash-session", params),
    persistCashSession: (params: { session: any }) =>
      ipcRenderer.invoke("sync:persist-cash-session", params),
    closeCashSession: (params: { sessionId: string, closingBalance: number, totalSales: number, totalExpenses: number }) =>
      ipcRenderer.invoke("sync:close-cash-session", params),
    addCashMovement: (params: { sessionId: string, type: string, description: string, amount: number }) =>
      ipcRenderer.invoke("sync:add-cash-movement", params),
    processOutbox: (params: { token: string, userId: string }) =>
      ipcRenderer.invoke("sync:process-outbox", params),
    startAutoSync: (params: { token: string, storeId: string, userId: string, intervalMs?: number }) =>
      ipcRenderer.invoke("sync:start-auto-sync", params),
    stopAutoSync: () => ipcRenderer.invoke("sync:stop-auto-sync"),
    triggerSync: (params: { token: string, storeId: string, userId: string }) =>
      ipcRenderer.invoke("sync:trigger-sync", params),
    getSyncStatus: () => ipcRenderer.invoke("sync:get-sync-status")
  }
});
