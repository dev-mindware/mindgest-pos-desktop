import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ipc", {
  send: (channel: string, data: any) => {
    ipcRenderer.send(channel, data);
  },
  on: (channel: string, func: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  // SQLite Database Bridge
  db: {
    saveDocument: (doc: any) => ipcRenderer.invoke("db:save-document", doc),
    getAllDocuments: () => ipcRenderer.invoke("db:get-all-documents"),
    deleteDocument: (id: string) =>
      ipcRenderer.invoke("db:delete-document", id),
    updateProductsCache: (products: any[]) =>
      ipcRenderer.invoke("db:update-products-cache", products),
    updateClientsCache: (clients: any[]) =>
      ipcRenderer.invoke("db:update-clients-cache", clients),
    getCachedProducts: () => ipcRenderer.invoke("db:get-cached-products"),
    getCachedClients: () => ipcRenderer.invoke("db:get-cached-clients"),
  },
});
