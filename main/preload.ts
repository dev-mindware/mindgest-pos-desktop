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
  }
});
