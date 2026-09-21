import { create } from "zustand";
import { InvoiceReceiptPayload, DocumentType } from "@/types/documents";
import { ProformData } from "@/types/invoice-proforma";
import { Product } from "@/types/products";
import { Client } from "@/types/clients";

export type NetworkStatus = "online" | "offline" | "unknown";
export type SyncResult = "success" | "partial" | "error" | null;

export type OfflineDocument = {
  internalId: string;
  type: DocumentType;
  payload: InvoiceReceiptPayload | ProformData;
  createdAt: string;
};

interface OfflineState {
  // Sync & Network Domain States
  networkStatus: NetworkStatus;
  pendingCount: number;
  isSyncing: boolean;
  lastSyncAt: number | null;
  lastSyncResult: SyncResult;
  errorCount: number;

  // Legacy queue for backward compatibility
  queue: OfflineDocument[];

  // Cache for offline search
  products: Product[];
  clients: Client[];
  lastCacheUpdate: string | null;

  // Actions
  setNetworkStatus: (status: NetworkStatus) => void;
  setPendingCount: (count: number) => void;
  setSyncState: (state: {
    isSyncing: boolean;
    lastResult?: SyncResult;
    pendingCount?: number;
    lastSyncAt?: number;
  }) => void;
  refreshPendingCount: () => Promise<number>;
  initialize: (userId: string) => Promise<void>;
  addDocument: (
    doc: Omit<OfflineDocument, "internalId" | "createdAt">,
    userId: string,
  ) => Promise<string>;
  removeFromQueue: (internalId: string, userId: string) => Promise<void>;
  setSyncing: (isSyncing: boolean) => void;

  // Cache Actions
  updateProductsCache: (products: Product[]) => Promise<void>;
  updateClientsCache: (clients: Client[]) => Promise<void>;
  clearQueue: (userId: string) => Promise<void>;
}

let isSubscribed = false;

export const useOfflineStore = create<OfflineState>((set, get) => ({
  networkStatus: typeof window !== "undefined" && !window.navigator.onLine ? "offline" : "online",
  pendingCount: 0,
  isSyncing: false,
  lastSyncAt: null,
  lastSyncResult: null,
  errorCount: 0,

  queue: [],
  products: [],
  clients: [],
  lastCacheUpdate: null,

  setNetworkStatus: (networkStatus) => set({ networkStatus }),

  setPendingCount: (pendingCount) => {
    const mockQueue = Array.from({ length: pendingCount }, (_, index) => ({
      internalId: `mock-${index}`,
      type: "invoice-receipt" as any,
      payload: {} as any,
      createdAt: new Date().toISOString(),
    }));
    set({ pendingCount, queue: mockQueue });
  },

  setSyncState: ({ isSyncing, lastResult, pendingCount, lastSyncAt }) => {
    set((state) => {
      const updates: Partial<OfflineState> = { isSyncing };
      if (lastResult !== undefined) updates.lastSyncResult = lastResult;
      if (lastSyncAt !== undefined) updates.lastSyncAt = lastSyncAt;
      if (pendingCount !== undefined) {
        updates.pendingCount = pendingCount;
        updates.queue = Array.from({ length: pendingCount }, (_, index) => ({
          internalId: `mock-${index}`,
          type: "invoice-receipt" as any,
          payload: {} as any,
          createdAt: new Date().toISOString(),
        }));
      }
      return updates;
    });
  },

  refreshPendingCount: async () => {
    if (typeof window === "undefined" || !window.ipc?.sync?.getPendingOutboxCount) {
      return 0;
    }
    try {
      const count = await window.ipc.sync.getPendingOutboxCount();
      get().setPendingCount(count);
      return count;
    } catch {
      return get().pendingCount;
    }
  },

  initialize: async (userId: string) => {
    if (typeof window === "undefined") return;

    // Attach IPC listeners once globally
    if (!isSubscribed && window.ipc?.sync) {
      isSubscribed = true;
      if (window.ipc.sync.onStateChanged) {
        window.ipc.sync.onStateChanged((event) => {
          get().setSyncState(event);
        });
      }
      if (window.ipc.sync.onOutboxChanged) {
        window.ipc.sync.onOutboxChanged((event) => {
          if (typeof event?.pendingCount === "number") {
            get().setPendingCount(event.pendingCount);
          }
        });
      }
    }

    let queueLength = 0;
    let products: any[] = [];
    let clients: any[] = [];

    // Tentar obter a contagem do novo Prisma SyncOutbox se disponível
    if (window.ipc?.sync?.getPendingOutboxCount) {
      queueLength = await window.ipc.sync.getPendingOutboxCount();
    } else if (window.ipc?.db?.getAllDocuments) {
      const legacyQueue = await window.ipc.db.getAllDocuments(userId);
      queueLength = legacyQueue.length;
    }

    if (window.ipc?.db?.getCachedProducts) {
      products = await window.ipc.db.getCachedProducts();
    }
    if (window.ipc?.db?.getCachedClients) {
      clients = await window.ipc.db.getCachedClients();
    }

    const mockQueue = Array.from({ length: queueLength }, (_, index) => ({
      internalId: `mock-${index}`,
      type: "invoice-receipt" as any,
      payload: {} as any,
      createdAt: new Date().toISOString(),
    }));

    set({
      pendingCount: queueLength,
      queue: mockQueue,
      products: products as any,
      clients: clients as any,
    });
  },

  addDocument: async (doc, userId) => {
    const internalId = crypto.randomUUID();
    const newDoc: OfflineDocument = {
      ...doc,
      internalId,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      queue: [...state.queue, newDoc],
      pendingCount: state.pendingCount + 1,
    }));

    // Persist to SQLite with userId for isolation
    if (window.ipc?.db) {
      await window.ipc.db.saveDocument({
        id: internalId,
        userId,
        type: doc.type,
        payload: doc.payload,
      });
    }

    return internalId;
  },

  removeFromQueue: async (internalId, userId) => {
    set((state) => {
      const updatedQueue = state.queue.filter((d) => d.internalId !== internalId);
      return {
        queue: updatedQueue,
        pendingCount: updatedQueue.length,
      };
    });

    // Delete only this user's document
    if (window.ipc?.db) {
      await window.ipc.db.deleteDocument(internalId, userId);
    }
  },

  setSyncing: (isSyncing) => set({ isSyncing }),

  updateProductsCache: async (products) => {
    set({
      products,
      lastCacheUpdate: new Date().toISOString(),
    });

    if (window.ipc?.db) {
      await window.ipc.db.updateProductsCache(products);
    }
  },

  updateClientsCache: async (clients) => {
    set({
      clients,
      lastCacheUpdate: new Date().toISOString(),
    });

    if (window.ipc?.db) {
      await window.ipc.db.updateClientsCache(clients);
    }
  },

  clearQueue: async (userId) => {
    set({ queue: [], pendingCount: 0 });
    if (window.ipc?.db) {
      await window.ipc.db.clearDocuments(userId);
    }
  },
}));

