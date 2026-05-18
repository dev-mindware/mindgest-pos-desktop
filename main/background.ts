import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import { database } from "./database";
import { getHardwareFingerprint } from "./security";
import { prisma } from "./prisma";
import { syncService } from "./sync";
import crypto from "crypto";

// ==========================================
// Security & Anti-Tampering IPC Handlers
// ==========================================
ipcMain.handle("security:get-hwid", () => {
  return getHardwareFingerprint();
});

ipcMain.handle("security:save-license", async (_, { licenseJwt, storeId }) => {
  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: { offlineLicense: licenseJwt, storeId },
    create: { id: 'singleton', offlineLicense: licenseJwt, storeId }
  });
  return true;
});

// ==========================================
// Data Sync IPC Handlers
// ==========================================
ipcMain.handle("sync:products", async (_, { token, storeId }) => {
  return syncService.syncProducts(token, storeId);
});

ipcMain.handle("sync:categories", async (_, { token, storeId }) => {
  return syncService.syncCategories(token, storeId);
});

ipcMain.handle("sync:clients", async (_, { token, storeId }) => {
  return syncService.syncClients(token, storeId);
});

ipcMain.handle("sync:process-outbox", async (_, { token, userId }) => {
  return syncService.processOutbox(token, userId);
});

ipcMain.handle("sync:get-categories", async (_, { storeId }) => {
  try {
    return await prisma.category.findMany({
      where: { storeId, isActive: true },
      orderBy: { name: 'asc' }
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao buscar categorias locais:", error);
    return [];
  }
});

ipcMain.handle("sync:search-items", async (_, { search, categoryId, storeId }) => {
  try {
    const where: any = {
      isActive: true,
    };

    if (storeId) where.storeId = storeId;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { code: { contains: search } },
        { barcode: { contains: search } },
      ];
    }

    const items = await prisma.item.findMany({
      where,
      take: 100,
      orderBy: { name: 'asc' }
    });

    // Mapear campos do SQLite para o formato que o frontend espera (Product interface)
    return items.map(item => ({
      ...item,
      quantity: item.stock, // Frontend espera 'quantity'
      sku: item.code,      // Frontend espera 'sku'
    }));
  } catch (error) {
    console.error("❌ [DB] Erro na busca local de items:", error);
    return [];
  }
});

ipcMain.handle("sync:search-clients", async (_, { search }) => {
  try {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { nif: { contains: search } },
        { email: { contains: search } },
      ];
    }

    const clients = await prisma.client.findMany({
      where,
      take: 50,
      orderBy: { name: 'asc' }
    });

    return clients;
  } catch (error) {
    console.error("❌ [DB] Erro na busca local de clientes:", error);
    return [];
  }
});

// ==========================================
// CRUD Local Operations (Offline-First)
// ==========================================

ipcMain.handle("sync:upsert-item", async (_, { item, storeId }) => {
  try {
    return await prisma.item.upsert({
      where: { id: item.id || 'new-id' },
      update: { ...item, storeId },
      create: { ...item, storeId }
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao salvar item localmente:", error);
    throw error;
  }
});

ipcMain.handle("sync:delete-item", async (_, { id, role }) => {
  if (role !== 'OWNER') throw new Error("Apenas o OWNER pode eliminar itens.");
  try {
    return await prisma.item.update({
      where: { id },
      data: { isActive: false } // Soft delete
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao eliminar item:", error);
    throw error;
  }
});

ipcMain.handle("sync:reduce-local-stock", async (_, items: { id: string; quantity: number }[]) => {
  try {
    const operations = [];
    for (const item of items) {
      // Find the local record by matching EITHER id or cloudId
      const localItem = await prisma.item.findFirst({
        where: {
          OR: [
            { id: item.id },
            { cloudId: item.id }
          ]
        },
        select: { id: true }
      });

      if (localItem) {
        operations.push(
          prisma.item.update({
            where: { id: localItem.id },
            data: { stock: { decrement: item.quantity } }
          })
        );
      } else {
        console.warn(`⚠️ [DB] Item não encontrado para redução de stock: ${item.id}`);
      }
    }
    
    if (operations.length > 0) {
      await prisma.$transaction(operations);
    }
    return true;
  } catch (error) {
    console.error("❌ [DB] Erro ao reduzir stock local:", error);
    throw error;
  }
});

ipcMain.handle("db:get-item-cloud-id", async (_, id: string) => {
  try {
    const item = await prisma.item.findUnique({
      where: { id },
      select: { cloudId: true }
    });
    return item?.cloudId || id;
  } catch (error) {
    console.error("❌ [DB] Erro ao buscar cloudId do item:", error);
    return id;
  }
});

ipcMain.handle("db:get-client-cloud-id", async (_, params: { id?: string; nif?: string; email?: string }) => {
  try {
    const orConditions: any[] = [];
    if (params?.id) orConditions.push({ id: params.id });
    if (params?.nif) orConditions.push({ nif: params.nif });
    if (params?.email) orConditions.push({ email: params.email });

    if (orConditions.length === 0) return null;

    const client = await prisma.client.findFirst({
      where: {
        OR: orConditions
      },
      select: { cloudId: true }
    });
    return client?.cloudId || null;
  } catch (error) {
    console.error("❌ [DB] Erro ao buscar cloudId do cliente:", error);
    return null;
  }
});

ipcMain.handle("sync:upsert-client", async (_, { client, storeId }) => {
  try {
    const isNew = !client.id;
    const clientUuid = client.id || crypto.randomUUID();
    
    const result = await prisma.client.upsert({
      where: { id: clientUuid },
      update: { ...client, id: clientUuid, storeId },
      create: { ...client, id: clientUuid, storeId }
    });

    // Registar no Outbox local para sincronizar com a cloud
    await prisma.syncOutbox.create({
      data: {
        entityType: "CLIENT",
        entityId: result.id,
        action: isNew ? "CREATE" : "UPDATE",
        payload: JSON.stringify(result),
        storeId
      }
    });

    return result;
  } catch (error) {
    console.error("❌ [DB] Erro ao salvar cliente localmente:", error);
    throw error;
  }
});

ipcMain.handle("sync:create-invoice", async (_, { invoiceData, storeId, userId }) => {
  try {
    const invoiceId = crypto.randomUUID();
    const localNo = `FT-DRAFT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    // 1. Processar cliente se fornecido no payload
    let clientId = null;
    if (invoiceData.client) {
      if (!invoiceData.client.id || invoiceData.client.id.includes('-new-') || invoiceData.client.__isNew__) {
        const clientUuid = crypto.randomUUID();
        const clientResult = await prisma.client.create({
          data: {
            id: clientUuid,
            name: invoiceData.client.name,
            nif: invoiceData.client.taxNumber || invoiceData.client.nif || null,
            email: invoiceData.client.email || null,
            phone: invoiceData.client.phone || null,
            address: invoiceData.client.address || null,
            storeId
          }
        });
        clientId = clientResult.id;

        // Criar outbox para este novo cliente
        await prisma.syncOutbox.create({
          data: {
            entityType: "CLIENT",
            entityId: clientResult.id,
            action: "CREATE",
            payload: JSON.stringify(clientResult),
            storeId
          }
        });
      } else {
        const localClient = await prisma.client.findFirst({
          where: {
            OR: [
              { id: invoiceData.client.id },
              { cloudId: invoiceData.client.id }
            ]
          }
        });
        if (localClient) {
          clientId = localClient.id;
        }
      }
    }

    // 2. Calcular totais locais e preparar as linhas da fatura
    const linesData = [];
    let calculatedNetTotal = 0;
    let calculatedTaxTotal = 0;

    for (const item of invoiceData.items) {
      const localItem = await prisma.item.findFirst({
        where: {
          OR: [
            { id: item.id },
            { cloudId: item.id }
          ]
        }
      });

      if (!localItem) {
        throw new Error(`Item com ID ${item.id} não encontrado localmente.`);
      }

      const qty = item.quantity || 1;
      const unitPrice = localItem.price;
      const taxPercent = localItem.taxPercent;
      
      const netTotal = qty * unitPrice;
      const taxTotal = netTotal * (taxPercent / 100);
      const grossTotal = netTotal + taxTotal;

      calculatedNetTotal += netTotal;
      calculatedTaxTotal += taxTotal;

      linesData.push({
        id: crypto.randomUUID(),
        itemId: localItem.id,
        quantity: qty,
        unitPrice,
        taxPercent,
        netTotal,
        grossTotal
      });
    }

    const calculatedGrossTotal = calculatedNetTotal + calculatedTaxTotal;

    // 3. Criar a Fatura no SQLite
    const createdInvoice = await prisma.invoice.create({
      data: {
        id: invoiceId,
        localNo,
        status: "DRAFT",
        issueDate: new Date(),
        netTotal: calculatedNetTotal,
        taxTotal: calculatedTaxTotal,
        grossTotal: calculatedGrossTotal,
        userId,
        clientId,
        storeId,
        lines: {
          create: linesData
        }
      },
      include: {
        lines: true,
        client: true
      }
    });

    // 4. Preparar payload de sincronização da fatura para a Cloud
    const cloudPayload = {
      ...invoiceData,
      localNo,
      client: clientId ? {
        id: createdInvoice.client?.cloudId || createdInvoice.client?.id,
        name: createdInvoice.client?.name,
        nif: createdInvoice.client?.nif,
        email: createdInvoice.client?.email,
        phone: createdInvoice.client?.phone,
        address: createdInvoice.client?.address,
      } : undefined,
    };

    // 5. Adicionar ao Outbox
    await prisma.syncOutbox.create({
      data: {
        entityType: "INVOICE",
        entityId: invoiceId,
        action: "CREATE",
        payload: JSON.stringify(cloudPayload),
        storeId
      }
    });

    // Retorna uma resposta compatível para a UI (com id e offline flag)
    return {
      data: {
        id: createdInvoice.id,
        localNo: createdInvoice.localNo,
        offline: true,
        invoice: createdInvoice
      }
    };
  } catch (error) {
    console.error("❌ [DB] Erro ao criar fatura localmente:", error);
    throw error;
  }
});

ipcMain.handle("sync:create-proforma", async (_, { proformaData, storeId, userId }) => {
  try {
    const proformaId = crypto.randomUUID();
    
    // Proformas não necessitam de representação estruturada offline de imediato no SQLite
    // Apenas guardamos o payload no outbox para sincronizar mais tarde
    await prisma.syncOutbox.create({
      data: {
        entityType: "PROFORMA",
        entityId: proformaId,
        action: "CREATE",
        payload: JSON.stringify(proformaData),
        storeId
      }
    });

    return {
      data: {
        id: proformaId,
        offline: true
      }
    };
  } catch (error) {
    console.error("❌ [DB] Erro ao criar proforma localmente:", error);
    throw error;
  }
});

ipcMain.handle("sync:get-pending-outbox-count", async () => {
  try {
    return await prisma.syncOutbox.count({
      where: { status: "PENDING" }
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao contar outbox pendente:", error);
    return 0;
  }
});

ipcMain.handle("sync:delete-client", async (_, { id, role }) => {
  if (role !== 'OWNER') throw new Error("Apenas o OWNER pode eliminar clientes.");
  try {
    return await prisma.client.delete({ where: { id } });
  } catch (error) {
    console.error("❌ [DB] Erro ao eliminar cliente:", error);
    throw error;
  }
});

ipcMain.handle("sync:search-invoices", async (_, { storeId }) => {
  try {
    const where: any = {};
    if (storeId) where.storeId = storeId;

    return await prisma.invoice.findMany({
      where,
      include: {
        client: true,
        user: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao buscar faturas locais:", error);
    return [];
  }
});

// ==========================================
// Handlers de Sessão de Caixa (Offline)
// ==========================================

ipcMain.handle("sync:search-cash-sessions", async (_, { storeId }) => {
  try {
    return await prisma.cashSession.findMany({
      where: { storeId },
      orderBy: { openingDate: 'desc' },
      include: { movements: true }
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao buscar sessões de caixa:", error);
    return [];
  }
});

ipcMain.handle("sync:get-current-session", async (_, { storeId, userId }) => {
  try {
    return await prisma.cashSession.findFirst({
      where: { 
        storeId, 
        userId,
        status: "OPEN" 
      },
      include: { movements: true }
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao buscar sessão atual:", error);
    return null;
  }
});

ipcMain.handle("sync:open-cash-session", async (_, { storeId, userId, openingBalance }) => {
  try {
    return await prisma.cashSession.create({
      data: {
        storeId,
        userId,
        openingBalance,
        status: "OPEN",
        openingDate: new Date()
      }
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao abrir sessão local:", error);
    throw error;
  }
});

ipcMain.handle("sync:persist-cash-session", async (_, { session }) => {
  try {
    return await prisma.cashSession.upsert({
      where: { id: session.id },
      update: {
        status: session.status || (session.isOpen ? "OPEN" : "CLOSED"),
        openingBalance: session.openingBalance || session.openingCash || 0,
        totalSales: session.totalSales || 0,
        totalExpenses: session.totalExpenses || 0,
        openingDate: new Date(session.openingDate || session.openedAt),
        closingDate: session.closingDate ? new Date(session.closingDate) : null,
      },
      create: {
        id: session.id,
        cloudId: session.id,
        storeId: session.storeId,
        userId: session.userId,
        status: session.status || (session.isOpen ? "OPEN" : "CLOSED"),
        openingBalance: session.openingBalance || session.openingCash || 0,
        totalSales: session.totalSales || 0,
        totalExpenses: session.totalExpenses || 0,
        openingDate: new Date(session.openingDate || session.openedAt),
      }
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao persistir sessão localmente:", error);
    throw error;
  }
});

ipcMain.handle("sync:close-cash-session", async (_, { sessionId, closingBalance, totalSales, totalExpenses }) => {
  try {
    return await prisma.cashSession.update({
      where: { id: sessionId },
      data: {
        closingBalance,
        totalSales,
        totalExpenses,
        status: "CLOSED",
        closingDate: new Date()
      }
    });
  } catch (error) {
    console.error("❌ [DB] Erro ao fechar sessão local:", error);
    throw error;
  }
});

ipcMain.handle("sync:add-cash-movement", async (_, { sessionId, type, description, amount }) => {
  try {
    return await prisma.$transaction([
      prisma.cashMovement.create({
        data: {
          cashSessionId: sessionId,
          type,
          description,
          amount
        }
      }),
      // Atualizar totais na sessão
      prisma.cashSession.update({
        where: { id: sessionId },
        data: {
          totalSales: type === 'SALE' ? { increment: amount } : undefined,
          totalExpenses: type === 'OUT' ? { increment: amount } : undefined,
        }
      })
    ]);
  } catch (error) {
    console.error("❌ [DB] Erro ao registar movimento local:", error);
    throw error;
  }
});

// ==========================================
// Old SQLite Cache Handlers (Deprecated soon)
// ========================================== — all document operations now require userId for isolation
ipcMain.handle("db:save-document", async (_, doc) => {
  return database.saveDocument(doc.id, doc.userId, doc.type, doc.payload);
});

ipcMain.handle("db:get-all-documents", async (_, userId: string) => {
  return database.getAllDocuments(userId);
});

ipcMain.handle(
  "db:delete-document",
  async (_, { id, userId }: { id: string; userId: string }) => {
    return database.deleteDocument(id, userId);
  },
);

ipcMain.handle("db:clear-documents", async (_, userId: string) => {
  return database.clearAllDocuments(userId);
});

ipcMain.handle("db:update-products-cache", async (_, products) => {
  return database.updateProductsCache(products);
});

ipcMain.handle("db:update-clients-cache", async (_, clients) => {
  return database.updateClientsCache(clients);
});

ipcMain.handle("db:get-cached-products", async () => {
  return database.getCachedProducts();
});

ipcMain.handle("db:get-cached-clients", async () => {
  return database.getCachedClients();
});

const isProd: boolean = process.env.NODE_ENV === "production";

console.log("--- Electron Main Process Log ---");
console.log("Environment:", isProd ? "production" : "development");

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

import { validateOfflineLicense } from "./security";

async function createWindow() {
  console.log("Attempting to create window...");
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Nextron passes the port as the first argument in development
  const port = process.argv[2];
  
  // ==========================================
  // VALIDAÇÃO DE SEGURANÇA (Anti-Tampering)
  // ==========================================
  const securityCheck = await validateOfflineLicense();
  let entryPath = "/pos/counter"; // Por defeito vai para o POS

  if (!securityCheck.valid) {
    console.warn(`🔒 [Lockdown] Acesso Offline Bloqueado: ${securityCheck.reason}`);
    entryPath = "/auth/login"; // Redireciona para o ecrã de Login Online
  }

  const url = isProd
    ? `app://./${entryPath}`
    : `http://localhost:${port}/${entryPath}`;

  console.log(`Target URL: ${url}`);

  try {
    await mainWindow.loadURL(url);
    console.log("Window loaded successfully");
  } catch (err) {
    console.error("CRITICAL: Failed to load URL:", err);
  }

  if (!isProd) {
    mainWindow.webContents.openDevTools();
  }
}

import { testPrismaConnection } from "./prisma";
import { startLocalServer } from "./server";

app.on("ready", async () => {
  console.log("Main process READY EVENT triggered");
  await testPrismaConnection();
  
  try {
    await startLocalServer();
  } catch (error) {
    console.error("⚠️ [Aviso] Não foi possível iniciar o servidor local. A porta pode estar ocupada:", error);
  }
  
  createWindow();
});

app.on("window-all-closed", () => {
  console.log("Shutdown: All windows closed");
  app.quit();
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
});
