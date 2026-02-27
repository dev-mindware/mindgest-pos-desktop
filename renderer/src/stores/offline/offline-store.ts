import { create } from "zustand";
import { InvoiceReceiptPayload, DocumentType } from "@/types/documents";
import { ProformData } from "@/types/invoice-proforma";
import { Product } from "@/types/products";
import { Client } from "@/types/clients";

export type OfflineDocument = {
  internalId: string;
  type: DocumentType;
  payload: InvoiceReceiptPayload | ProformData;
  createdAt: string;
};

interface OfflineState {
  queue: OfflineDocument[];
  isSyncing: boolean;

  // Cache for offline search
  products: Product[];
  clients: Client[];
  lastCacheUpdate: string | null;

  // Actions
  initialize: () => Promise<void>;
  addDocument: (
    doc: Omit<OfflineDocument, "internalId" | "createdAt">,
  ) => Promise<string>;
  removeFromQueue: (internalId: string) => Promise<void>;
  setSyncing: (isSyncing: boolean) => void;

  // Cache Actions
  updateProductsCache: (products: Product[]) => Promise<void>;
  updateClientsCache: (clients: Client[]) => Promise<void>;
  clearQueue: () => void;
}

export const useOfflineStore = create<OfflineState>((set) => ({
  queue: [],
  isSyncing: false,
  products: [],
  clients: [],
  lastCacheUpdate: null,

  initialize: async () => {
    if (typeof window === "undefined" || !window.ipc?.db) return;
    const [queue, products, clients] = await Promise.all([
      window.ipc.db.getAllDocuments(),
      window.ipc.db.getCachedProducts(),
      window.ipc.db.getCachedClients(),
    ]);

    set({
      queue: queue.map((d: any) => ({
        internalId: d.id,
        type: d.type,
        payload: d.payload,
        createdAt: d.created_at,
      })),
      products: products as any,
      clients: clients as any,
    });
  },

  addDocument: async (doc) => {
    const internalId = crypto.randomUUID();
    const newDoc: OfflineDocument = {
      ...doc,
      internalId,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      queue: [...state.queue, newDoc],
    }));

    // Persist to SQLite
    if (window.ipc?.db) {
      await window.ipc.db.saveDocument({
        id: internalId,
        type: doc.type,
        payload: doc.payload,
      });
    }

    return internalId;
  },

  removeFromQueue: async (internalId) => {
    set((state) => ({
      queue: state.queue.filter((d) => d.internalId !== internalId),
    }));

    // Delete from SQLite
    if (window.ipc?.db) {
      await window.ipc.db.deleteDocument(internalId);
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

  clearQueue: () => set({ queue: [] }),
}));
