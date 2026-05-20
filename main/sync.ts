import { prisma } from "./prisma";
import axios from "axios";

// Configurações da API Cloud (Poderia vir de variáveis de ambiente)
const CLOUD_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api" //"https://mindgest.mindware-vps.cloud/api";

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
  /**
   * Processa a fila de saída (Outbox) - Local -> Cloud
   */
  processOutbox: async (token: string, userId: string) => {
    try {
      // 1. Procurar registos no prisma.syncOutbox com status PENDING
      const pendingDocs = await prisma.syncOutbox.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: 'asc' }
      });

      if (pendingDocs.length === 0) return { processed: 0 };

      console.log(`🔄 [SyncWorker] Processando ${pendingDocs.length} documentos pendentes do Outbox...`);
      let processed = 0;

      for (const doc of pendingDocs) {
        try {
          const payload = typeof doc.payload === 'string' ? JSON.parse(doc.payload) : doc.payload;
          
          let endpoint = "";
          let method: "post" | "put" = "post";

          if (doc.entityType === "CLIENT") {
            endpoint = doc.action === "CREATE" ? "/clients" : `/clients/${doc.entityId}`;
            method = doc.action === "CREATE" ? "post" : "put";
          } else if (doc.entityType === "INVOICE") {
            endpoint = "/invoice/invoice-receipt";
            method = "post";

            // Resolver FKs locais com cloudId para o cliente se aplicável
            const localInvoice = await prisma.invoice.findUnique({
              where: { id: doc.entityId },
              include: { client: true }
            });

            if (localInvoice && localInvoice.client && localInvoice.client.cloudId) {
              if (payload.client) {
                payload.client.id = localInvoice.client.cloudId;
              }
            }
          } else if (doc.entityType === "PROFORMA") {
            endpoint = "/invoice/proforma";
            method = "post";
          }

          if (!endpoint) continue;

          console.log(`📡 [SyncWorker] Enviando ${doc.entityType} ${doc.entityId} para ${endpoint}...`);
          
          const response = await axios({
            method,
            url: `${CLOUD_API_URL}${endpoint}`,
            data: payload,
            headers: { Authorization: `Bearer ${token}` }
          });

          const responseData = response.data?.data || response.data;

          // Se for sucesso, atualizar base de dados local
          if (doc.entityType === "CLIENT") {
            const cloudId = responseData?.id;
            if (cloudId) {
              await prisma.client.update({
                where: { id: doc.entityId },
                data: { cloudId }
              });
              console.log(`✅ [SyncWorker] Cliente ${doc.entityId} associado ao cloudId ${cloudId}`);
            }
          } else if (doc.entityType === "INVOICE") {
            const cloudId = responseData?.id;
            const agtNo = responseData?.agtNo;
            const hash = responseData?.hash;
            const hashControl = responseData?.hashControl;
            
            await prisma.invoice.update({
              where: { id: doc.entityId },
              data: {
                status: "VALID",
                // Note: some schema/Prisma clients might not have a separate 'cloudId' column 
                // in Invoice, but we saw 'cloudId' is not present in Invoice model in schema.prisma!
                // Ah, let's verify if cloudId exists in Invoice in schema.prisma:
                // Lines 97-123 in schema.prisma has:
                // model Invoice { id, localNo, agtNo, status, issueDate, netTotal, taxTotal, grossTotal, hash, hashControl, userId, clientId, storeId
                // Wait! Invoice in schema.prisma does NOT have a cloudId field!
                // It only has id, localNo, agtNo, status...
                // So the Invoice ID itself (uuid) is either the cloudId or we just map it.
                // Wait, if id is a uuid, we don't need a separate cloudId in Invoice because it uses the same id!
                // Yes, createdInvoice was created with a local uuid, and when POSTed to the Cloud,
                // wait, if we send payload without an ID, the Cloud generates a CUID/UUID.
                // But in Electron, we should send the invoice ID (which is the local uuid) as the ID, or let the cloud return the ID.
                // Yes, so we can store the returned agtNo, hash, and hashControl.
                // We do NOT need to update cloudId since the Invoice model does not have a cloudId!
                // Let's look at the schema.prisma for Invoice again:
                // model Invoice { id, localNo, agtNo, status, ... }
                // So there is NO cloudId field in Invoice!
                // That's fine, we will just update agtNo, status, hash, and hashControl!
                agtNo,
                hash,
                hashControl
              }
            });
            console.log(`✅ [SyncWorker] Fatura ${doc.entityId} sincronizada com sucesso na cloud.`);
          }

          // Marcar outbox como SYNCED
          await prisma.syncOutbox.update({
            where: { id: doc.id },
            data: { status: "SYNCED" }
          });

          processed++;
        } catch (err: any) {
          console.error(`❌ [SyncWorker] Erro ao sincronizar documento ${doc.id}:`, err.message);
          
          if (err.response && (err.response.status === 400 || err.response.status === 422)) {
            const errorMsg = JSON.stringify(err.response.data || err.message);
            await prisma.syncOutbox.update({
              where: { id: doc.id },
              data: { status: "ERROR", errorMsg }
            });
          } else {
            // Se for erro de rede/servidor, interrompemos o loop para tentar de novo mais tarde
            break;
          }
        }
      }

      return { processed };
    } catch (error: any) {
      console.error("❌ [SyncWorker] Falha crítica no processamento do outbox:", error.message);
      return { processed: 0, error: error.message };
    }
  }
};
