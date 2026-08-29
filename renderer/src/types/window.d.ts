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
    getFiscalStatus: () => Promise<any>;
    saveSavedCredentials: (credentials: { email: string; password: string }) => Promise<boolean>;
    getSavedCredentials: () => Promise<{ email: string; password: string } | null>;
    clearSavedCredentials: () => Promise<boolean>;
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
    searchInvoices: (params: { storeId?: string; userId?: string; role?: string }) => Promise<any[]>;
    searchCreditNotes: (params: { storeId?: string; userId?: string; role?: string }) => Promise<any[]>;
    annulInvoice: (params: { invoiceId: string; storeId?: string; reason: string; notes?: string; managerBarcode?: string }) => Promise<any>;
    createInvoice: (params: { invoiceData: InvoiceReceiptPayload; storeId: string; userId: string; user?: { id: string; email: string; name: string; role: string; storeId?: string } }) => Promise<any>;
    createProforma: (params: { proformaData: any; store: any; user: any | null }) => Promise<any>;
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
  notification: {
    show: (params: { title: string; body: string; silent?: boolean }) => Promise<boolean>;
  };
  printer: {
    openCashDrawer: (params?: { options?: any; auditEntry?: any }) => Promise<{ success: boolean; message: string }>;
    testConnection: (params?: { options?: any }) => Promise<{ success: boolean; message: string }>;
    getSystemPrinters: () => Promise<Array<{ name: string; isDefault?: boolean; description?: string }>>;
  };
  customerDisplay: {
    toggle: () => Promise<boolean>;
    open: () => Promise<boolean>;
    close: () => Promise<boolean>;
    isOpen: () => Promise<boolean>;
    requestState: () => Promise<any>;
    update: (partialState: any) => Promise<boolean>;
    clear: (storeName?: string) => Promise<boolean>;
    onUpdate: (callback: (state: any) => void) => () => void;
    onHardwareChange: (callback: (data: { event: 'added' | 'removed' }) => void) => () => void;
  };
  lan: {
    getLocalIp: () => Promise<string>;
    getConfig: () => Promise<{
      enabled: boolean;
      terminalMode: 'MASTER' | 'SLAVE';
      masterIp: string | null;
      lanSecret: string | null;
      port: number;
      localIp: string;
      isServerRunning?: boolean;
      serverError?: string | null;
      connectedCount?: number;
    }>;
    getServerStatus: () => Promise<{
      isRunning: boolean;
      port: number;
      connectedCount: number;
      error: string | null;
      localIp: string;
    }>;
    setConfig: (config: {
      terminalMode: 'MASTER' | 'SLAVE';
      masterIp?: string | null;
      lanSecret?: string | null;
      enabled?: boolean;
    }) => Promise<boolean>;
    rotateSecret: () => Promise<string>;
    getConnectedTerminals: () => Promise<Array<{
      id: string;
      name: string;
      ip: string;
      lastSeen: string;
      status: 'ACTIVE' | 'IDLE' | 'DISCONNECTED';
      latencyMs?: number;
      totalSales?: number;
      appVersion?: string;
    }>>;
    revokeTerminal: (params: { terminalId: string }) => Promise<boolean>;
    testConnection: (params: { targetIp: string; lanSecret?: string }) => Promise<{
      success: boolean;
      latencyMs?: number;
      serverTime?: string;
      message?: string;
      connectedCount?: number;
    }>;
    sendHeartbeat: (params: { masterIp: string; lanSecret?: string; terminalName?: string }) => Promise<any>;
    checkSystemCapability: () => Promise<{
      totalMemoryGB: number;
      freeMemoryGB: number;
      cpuCores: number;
      isMasterEligible: boolean;
      platform: string;
      arch: string;
    }>;
    getPairingCode: () => Promise<{
      code: string;
      expiresAt: string;
      ttlSeconds: number;
      error?: string;
    }>;
    pairTerminal: (params: { targetIp: string; code: string; terminalName?: string }) => Promise<{
      success: boolean;
      lanSecret?: string;
      serverTime?: string;
      companyNif?: string;
      companyName?: string;
      error?: string;
    }>;
    startDiscovery: (params?: { lastKnownMasterIp?: string }) => Promise<boolean>;
    stopDiscovery: () => Promise<boolean>;
    getDiscoveredMasters: () => Promise<Array<{
      id: string;
      name: string;
      host: string;
      ip: string;
      port: number;
      protocolVersion: string;
      storeId?: string;
      storeName?: string;
      discoveryLayer: 'DIRECT_IP' | 'MDNS' | 'UDP_BROADCAST' | 'MANUAL';
      lastSeen: number;
    }>>;
    diagnoseSwitch: (params: { targetIp: string; port?: number }) => Promise<{
      success: boolean;
      isTcpReachable: boolean;
      isMdnsReachable: boolean;
      possibleIgmpSnooping: boolean;
      latencyMs?: number;
      message: string;
      error?: string;
    }>;
    verifyHashChain: () => Promise<{
      isValid: boolean;
      lastInvoice?: any;
      error?: string;
    }>;
    promoteBackupMaster: (params: {
      authorizedByUserId: string;
      reason: string;
      previousMasterIp?: string;
    }) => Promise<{
      success: boolean;
      message: string;
      failoverLog?: any;
      error?: string;
    }>;
  };
}

declare global {
  interface Window {
    ipc: IpcBridge;
  }
}
