import { prisma } from "./prisma";
import axios from "axios";

// Configurações da API Cloud (Poderia vir de variáveis de ambiente)
const CLOUD_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"; // VPS

async function normalizeInvoicePayload(payload: any) {
  const invoice = typeof payload === "string" ? JSON.parse(payload) : { ...payload };

  if (invoice.client) {
    const clientId = invoice.client.id;
    let clientCloudId: string | null = null;
    let localClient: any = null;

    if (clientId) {
      localClient = await prisma.client.findFirst({
        where: {
          OR: [
            { id: clientId },
            { cloudId: clientId }
          ]
        },
        select: { cloudId: true }
      });
      clientCloudId = localClient?.cloudId || null;
    }

    const normalizedClient: any = {};
    if (clientCloudId) {
      normalizedClient.id = clientCloudId;
    }

    const clientName = invoice.client.name?.trim();
    if (!clientCloudId && clientName) {
      normalizedClient.name = clientName;
      if (invoice.client.phone?.trim()) normalizedClient.phone = invoice.client.phone.trim();
      if (invoice.client.email?.trim()) normalizedClient.email = invoice.client.email.trim();
      if (invoice.client.address?.trim()) normalizedClient.address = invoice.client.address.trim();
      const taxNumber = invoice.client.taxNumber?.trim() || invoice.client.nif?.trim();
      if (taxNumber) normalizedClient.taxNumber = taxNumber;
    }

    if (Object.keys(normalizedClient).length === 0) {
      delete invoice.client;
    } else {
      invoice.client = normalizedClient;
    }
  }

  if (Array.isArray(invoice.items)) {
    const normalizedItems = [];
    for (const item of invoice.items) {
      if (!item || typeof item !== "object") {
        normalizedItems.push(item);
        continue;
      }

      let itemId = item.id;
      if (itemId) {
        const localItem = await prisma.item.findFirst({
          where: {
            OR: [
              { id: itemId },
              { cloudId: itemId }
            ]
          },
          select: { cloudId: true }
        });
        if (localItem?.cloudId) {
          itemId = localItem.cloudId;
        }
      }

      normalizedItems.push({
        ...item,
        id: itemId
      });
    }
    invoice.items = normalizedItems;
  }

  return invoice;
}

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
      console.log("🔄🔄🔄 [Sync] A iniciar sincronização de categorias...");

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
    const makeRequest = async (params: Record<string, any>) => {
      console.log(`🔄 [Sync] Solicitando clientes Cloud com params: ${JSON.stringify(params)}`);
      return await axios.get(`${CLOUD_API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
    };

    try {
      console.log("🔄 [Sync] A iniciar sincronização de clientes...");

      let response;
      try {
        response = await makeRequest({ limit: 1000, storeId });
      } catch (error: any) {
        const status = error?.response?.status;
        console.warn(`⚠️ [Sync] Falha ao buscar clientes com storeId: ${status} ${error?.message}`);
        if (status === 400) {
          console.log("🔄 [Sync] Re-tentando busca de clientes sem storeId...");
          response = await makeRequest({ limit: 1000 });
        } else {
          throw error;
        }
      }

      console.log("🔄 [Sync] Resposta clientes Cloud:", response.data);

      const cloudClients = response.data.data || [];

      for (const client of cloudClients) {
        await prisma.client.upsert({
          where: { cloudId: client.id },
          update: {
            name: client.name,
            nif: client.nif,
            email: client.email,
            phone: client.phone,
            address: client.address,
            storeId: storeId,
          },
          create: {
            cloudId: client.id,
            name: client.name,
            nif: client.nif,
            email: client.email,
            phone: client.phone,
            address: client.address,
            storeId: storeId,
          },
        });
      }

      console.log(`✅ [Sync] ${cloudClients.length} clientes sincronizados.`);
      return { success: true, count: cloudClients.length };
    } catch (error: any) {
      console.error("❌ [Sync] Erro ao sincronizar clientes:", error.message, error?.response?.data || "");
      throw error;
    }
  },

  syncAll: async function (token: string, storeId: string, userId: string) {
    console.log("🔄 [Sync] Iniciando sincronização completa (upload + download)...");
    const uploadResult = await this.processOutbox(token, userId);
    const categoryResult = await this.syncCategories(token, storeId);
    const clientResult = await this.syncClients(token, storeId);
    const productResult = await this.syncProducts(token, storeId);

    return {
      success: true,
      upload: uploadResult,
      categories: categoryResult,
      clients: clientResult,
      products: productResult
    };
  },

  /**
   * Processa a fila de saída (Outbox) - Local -> Cloud
   */
  processOutbox: async (token: string, userId: string) => {
    try {
      // Buscar pendentes (inclui PENDING_DEPENDENCIES)
      const pendingDocs = await prisma.syncOutbox.findMany({
        where: { status: { in: ["PENDING", "PENDING_DEPENDENCIES"] } },
        orderBy: { createdAt: "asc" }
      });

      if (pendingDocs.length === 0) return { processed: 0 };

      // Prioridade por tipo: CLIENT -> ITEM -> INVOICE -> PROFORMA -> CASH_MOVEMENT
      const priority: Record<string, number> = {
        CLIENT: 0,
        ITEM: 1,
        INVOICE: 2,
        PROFORMA: 3,
        CASH_MOVEMENT: 4
      };

      const sortedDocs = pendingDocs.sort((a, b) => (priority[a.entityType] ?? 99) - (priority[b.entityType] ?? 99));

      console.log(`🔄 [SyncWorker] Processando ${sortedDocs.length} documentos (ordenados por dependências)...`);
      let processed = 0;

      for (const doc of sortedDocs) {
        try {
          // 1. Verificação de Dependências mais tolerante
          if (doc.dependsOnType && doc.dependsOnId) {
            const dep = await prisma.syncOutbox.findFirst({
              where: {
                entityType: doc.dependsOnType,
                entityId: doc.dependsOnId,
              }
            });

            let dependencySatisfied = false;
            if (dep && !["PENDING", "PENDING_DEPENDENCIES", "FAILED"].includes(dep.status)) {
              dependencySatisfied = true;
            }

            if (!dependencySatisfied) {
              if (doc.dependsOnType === "CLIENT") {
                const clientDependency = await prisma.client.findUnique({
                  where: { id: doc.dependsOnId },
                  select: { cloudId: true }
                });
                if (clientDependency?.cloudId) {
                  dependencySatisfied = true;
                }
              }
            }

            if (!dependencySatisfied) {
              console.warn(`⏳ [SyncWorker] ${doc.entityType} ${doc.entityId} aguardando ${doc.dependsOnType} (Status atual: ${dep?.status})`);
              await prisma.syncOutbox.update({ where: { id: doc.id }, data: { status: "PENDING_DEPENDENCIES" } });
              continue; // Passa para o próximo documento no batch
            }
          }

          const rawPayload = typeof doc.payload === "string" ? JSON.parse(doc.payload) : doc.payload;
          let payload = rawPayload;
          let endpoint = "";
          let method: "post" | "put" = "post";

          if (doc.entityType === "CLIENT") {
            endpoint = doc.action === "CREATE" ? "/clients" : `/clients/${doc.entityId}`;
            method = doc.action === "CREATE" ? "post" : "put";
            if (doc.action === "CREATE" && payload && typeof payload === "object") {
              delete payload.id;
            }
          } else if (doc.entityType === "INVOICE") {
            endpoint = "/invoice/invoice-receipt"; // Corrigido o endpoint!
            method = "post";
            payload = await normalizeInvoicePayload(rawPayload);
          } else if (doc.entityType === "PROFORMA") {
            endpoint = "/invoice/proforma";
            method = "post";
          }

          if (!endpoint) continue;

          console.log(`📡 [SyncWorker] A enviar ${doc.entityType} ${doc.entityId} -> ${endpoint}`);
          console.log(`📡 [SyncWorker] Payload final para envio (${doc.entityType} ${doc.entityId}):`, JSON.stringify(payload, null, 2));
          const response = await axios({
            method,
            url: `${CLOUD_API_URL}${endpoint}`,
            data: payload,
            headers: { Authorization: `Bearer ${token}` }
          });

          const responseData = response.data?.data || response.data;

          // Atualizações locais pós-success
          if (doc.entityType === "CLIENT") {
            const cloudId = responseData?.id || responseData?.cloudId;
            if (cloudId) {
              await prisma.client.update({ where: { id: doc.entityId }, data: { cloudId } });
            }
          } else if (doc.entityType === "INVOICE") {
            await prisma.invoice.update({
              where: { id: doc.entityId },
              data: {
                status: "VALID",
                agtNo: responseData?.agtNo,
                hash: responseData?.hash,
                hashControl: responseData?.hashControl
              }
            });
          }

          await prisma.syncOutbox.update({ where: { id: doc.id }, data: { status: "SYNCED", syncedAt: new Date(), retryCount: 0 } });
          processed++;

        } catch (err: any) {
          // Extração profunda do erro da API
          const apiError = err.response?.data ? JSON.stringify(err.response.data) : (err?.message || "Erro desconhecido");
          console.error(`❌ [SyncWorker] Erro na API ao sincronizar ${doc.entityType} ${doc.id}:`, apiError);

          const newRetry = (doc.retryCount ?? 0) + 1;
          const maxRetries = 5;

          if (newRetry >= maxRetries) {
            await prisma.syncOutbox.update({
              where: { id: doc.id },
              data: { status: "FAILED", errorMsg: apiError, lastErrorTime: new Date(), retryCount: newRetry }
            });
          } else {
            await prisma.syncOutbox.update({
              where: { id: doc.id },
              data: { status: "PENDING", errorMsg: apiError, lastErrorTime: new Date(), retryCount: newRetry }
            });
          }
          // Removido o 'break;' para permitir que o ciclo continue a processar outros documentos!
        }
      }

      return { processed };
    } catch (error: any) {
      console.error("❌ [SyncWorker] Falha crítica no processamento do outbox:", error?.message || error);
      return { processed: 0, error: error?.message || String(error) };
    }
  }
};
