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

export const useOfflineStore = create<OfflineState>((set) => ({
  queue: [],
  isSyncing: false,
  products: [],
  clients: [],
  lastCacheUpdate: null,

  initialize: async (userId: string) => {
    if (typeof window === "undefined") return;

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

    // Criar uma fila mockada reativa com base no tamanho real do Outbox do Prisma
    const mockQueue = Array.from({ length: queueLength }, (_, index) => ({
      internalId: `mock-${index}`,
      type: "invoice-receipt" as any,
      payload: {} as any,
      createdAt: new Date().toISOString(),
    }));

    set({
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
    set((state) => ({
      queue: state.queue.filter((d) => d.internalId !== internalId),
    }));

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
    set({ queue: [] });
    if (window.ipc?.db) {
      await window.ipc.db.clearDocuments(userId);
    }
  },
}));
