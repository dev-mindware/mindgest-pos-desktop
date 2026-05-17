import { prisma } from "./prisma";
import axios from "axios";

// Configurações da API Cloud (Poderia vir de variáveis de ambiente)
const CLOUD_API_URL = process.env.NEXT_PUBLIC_API_URL || "https://mindgest.mindware-vps.cloud/api";

export const syncService = {
  /**
   * Sincroniza todos os produtos da Cloud para o SQLite Local
   */
  syncProducts: async (token: string, storeId: string) => {
    try {
      console.log("🔄 [Sync] A iniciar sincronização de produtos...");

      const response = await axios.get(`${CLOUD_API_URL}/items`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000, storeId } // Tentamos buscar todos de uma vez para o POS
      });

      const cloudItems = response.data.data;

      for (const item of cloudItems) {
        try {
          // Prevenir erro de Unique Constraint no barcode
          if (item.barcode) {
            const existingWithBarcode = await prisma.item.findUnique({
              where: { barcode: item.barcode }
            });
            
            if (existingWithBarcode && existingWithBarcode.cloudId !== item.id) {
              await prisma.item.update({
                where: { id: existingWithBarcode.id },
                data: { barcode: null }
              });
            }
          }

          // Prevenir erro de Unique Constraint no code (SKU)
          if (item.sku) {
            const existingWithCode = await prisma.item.findUnique({
              where: { code: item.sku }
            });
            
            if (existingWithCode && existingWithCode.cloudId !== item.id) {
              await prisma.item.update({
                where: { id: existingWithCode.id },
                data: { code: null }
              });
            }
          }

          await prisma.item.upsert({
            where: { cloudId: item.id },
            update: {
              name: item.name,
              description: item.description,
              code: item.sku,
              barcode: item.barcode || null,
              price: item.price,
              stock: item.quantity || 0,
              taxPercent: item.tax?.rate || 14.0,
              categoryId: item.categoryId,
              storeId: storeId,
              isActive: item.status === 'ACTIVE'
            },
            create: {
              cloudId: item.id,
              name: item.name,
              description: item.description,
              code: item.sku,
              barcode: item.barcode || null,
              price: item.price,
              stock: item.quantity || 0,
              taxPercent: item.tax?.rate || 14.0,
              categoryId: item.categoryId,
              storeId: storeId,
              isActive: item.status === 'ACTIVE'
            }
          });
        } catch (itemError: any) {
          console.error(`⚠️ [Sync] Falha ao sincronizar item ${item.name} (${item.id}):`, itemError.message);
          // Continua para o próximo item
        }
      }

      console.log(`✅ [Sync] ${cloudItems.length} produtos sincronizados.`);
      return { success: true, count: cloudItems.length };
    } catch (error: any) {
      console.error("❌ [Sync] Erro ao sincronizar produtos:", error.message);
      throw error;
    }
  },

  /**
   * Sincroniza categorias da Cloud para Local
   */
  syncCategories: async (token: string, storeId: string) => {
    try {
      console.log("🔄 [Sync] A iniciar sincronização de categorias...");

      const response = await axios.get(`${CLOUD_API_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000, storeId }
      });

      const cloudCategories = response.data.data;

      if (!(prisma as any).category) {
        console.error("❌ [Sync] O modelo 'Category' não foi encontrado no Prisma Client. Execute 'npx prisma generate'.");
        throw new Error("Prisma Client desatualizado. Execute 'npx prisma generate'.");
      }

      for (const cat of cloudCategories) {
        await prisma.category.upsert({
          where: { cloudId: cat.id },
          update: {
            name: cat.name,
            description: cat.description,
            storeId: storeId,
            isActive: cat.isActive !== false
          },
          create: {
            cloudId: cat.id,
            id: cat.id, // Usamos o mesmo ID da cloud para facilitar relações
            name: cat.name,
            description: cat.description,
            storeId: storeId,
            isActive: cat.isActive !== false
          }
        });
      }

      console.log(`✅ [Sync] ${cloudCategories.length} categorias sincronizadas.`);
      return { success: true, count: cloudCategories.length };
    } catch (error: any) {
      console.error("❌ [Sync] Erro ao sincronizar categorias:", error.message);
      throw error;
    }
  },

  /**
   * Sincroniza clientes da Cloud para Local
   */
  syncClients: async (token: string, storeId: string) => {
    try {
      console.log("🔄 [Sync] A iniciar sincronização de clientes...");

      const response = await axios.get(`${CLOUD_API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 1000 }
      });

      const cloudClients = response.data.data;

      for (const client of cloudClients) {
        await prisma.client.upsert({
          where: { cloudId: client.id },
          update: {
            name: client.name,
            nif: client.nif,
            email: client.email,
            phone: client.phone,
            address: client.address,
            storeId: storeId
          },
          create: {
            cloudId: client.id,
            name: client.name,
            nif: client.nif,
            email: client.email,
            phone: client.phone,
            address: client.address,
            storeId: storeId
          }
        });
      }

      console.log(`✅ [Sync] ${cloudClients.length} clientes sincronizados.`);
      return { success: true, count: cloudClients.length };
    } catch (error: any) {
      console.error("❌ [Sync] Erro ao sincronizar clientes:", error.message);
      throw error;
    }
  },

  /**
   * Processa a fila de saída (Outbox) - Local -> Cloud
   */
  processOutbox: async (token: string, userId: string) => {
    try {
      // Usando o database.ts legado para buscar documentos offline
      const { database } = await import("./database");
      const pendingDocs = await database.getAllDocuments(userId);

      if (pendingDocs.length === 0) return { processed: 0 };

      console.log(`🔄 [SyncWorker] Processando ${pendingDocs.length} documentos pendentes...`);
      let processed = 0;

      for (const doc of pendingDocs) {
        try {
          const payload = typeof doc.payload === 'string' ? JSON.parse(doc.payload) : doc.payload;
          
          let endpoint = "/items";
          if (doc.type === "invoice-receipt") endpoint = "/invoice-receipts";
          if (doc.type === "invoice") endpoint = "/invoices";

          await axios.post(`${CLOUD_API_URL}${endpoint}`, payload, {
            headers: { Authorization: `Bearer ${token}` }
          });

          // Se teve sucesso, remove da fila local
          await database.deleteDocument(doc.id, userId);
          processed++;
          console.log(`✅ [SyncWorker] Documento ${doc.id} sincronizado.`);
        } catch (err: any) {
          console.error(`❌ [SyncWorker] Erro ao sincronizar documento ${doc.id}:`, err.message);
          // Continua para o próximo
        }
      }

      return { processed };
    } catch (error: any) {
      console.error("❌ [SyncWorker] Falha crítica no processamento do outbox:", error.message);
      return { processed: 0, error: error.message };
    }
  }
};
