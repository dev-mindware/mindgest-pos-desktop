import path from "path";
import { app, BrowserWindow, ipcMain, shell, Menu, Notification } from "electron";
import { autoUpdater } from "electron-updater";
import serve from "electron-serve";
import { database } from "./database";
import { getHardwareFingerprint, validateMonotonicClock, validateOfflineLicense } from "./security";
import { prisma } from "./prisma";
import { syncService } from "./sync";
import { syncManager } from "./sync-manager";
import { FiscalSignatureService } from "./fiscal-signature";
import { SidecarManager } from "./sidecar-manager";
import { LocalDocumentService } from "./document-service";
import { PrinterService } from "./printer-service";
import { CustomerDisplayService } from "./customer-display-service";
import { SafeVault } from "./storage-key";
import crypto from "crypto";
import { spawn, ChildProcess } from "child_process";
import fs from "fs";

// Definir nome da aplicação e AppUserModelId para notificações nativas do Windows com logótipo Mindgest
app.name = "Mindgest POS";
if (process.platform === "win32") {
  app.setAppUserModelId("com.mindware.mindgest.pos");
}

const isProd: boolean = process.env.NODE_ENV === "production" || app.isPackaged;

/**
 * Validador de remetente IPC para proteção contra injeções ou frames maliciosos
 */
function validateIpcSender(event: Electron.IpcMainInvokeEvent): boolean {
  try {
    const senderUrl = event.senderFrame?.url || "";
    if (!isProd && senderUrl.startsWith("http://localhost:")) return true;
    if (isProd && senderUrl.startsWith("app://")) return true;
    console.warn(`⛔ [Security] Chamada IPC bloqueada de remetente não confiável: ${senderUrl}`);
    return false;
  } catch {
    return false;
  }
}

// ==========================================
// Security & Anti-Tampering IPC Handlers
// ==========================================
ipcMain.handle("security:get-hwid", (event) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  return getHardwareFingerprint();
});

ipcMain.handle("security:get-fiscal-status", async () => {
  try {
    const keys = await FiscalSignatureService.getOrInitializeKeys();
    return {
      hasKeys: !!keys.privateKey,
      swValidationNumber: keys.swValidationNumber,
      companyNif: keys.companyNif,
      companyName: keys.companyName,
      publicKey: keys.publicKey,
    };
  } catch (err: any) {
    return { error: err.message };
  }
});

ipcMain.handle("security:save-license", async (_, { licenseJwt, storeId }) => {
  const encryptedLicense = SafeVault.encrypt(licenseJwt);
  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: { offlineLicense: encryptedLicense, storeId },
    create: { id: 'singleton', offlineLicense: encryptedLicense, storeId }
  });
  return true;
});

ipcMain.handle("security:check-clock", async () => {
  return validateMonotonicClock();
});

ipcMain.handle("security:save-credentials", async (event, { email, password }) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  if (!email || !password) return false;
  try {
    const payload = JSON.stringify({ email, password, savedAt: Date.now() });
    const encrypted = SafeVault.encrypt(payload);
    const credPath = path.join(app.getPath("userData"), ".credentials.enc");
    await fs.promises.writeFile(credPath, encrypted, "utf8");
    return true;
  } catch (err) {
    console.error("❌ [Security] Erro ao guardar credenciais:", err);
    return false;
  }
});

ipcMain.handle("security:get-saved-credentials", async (event) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  try {
    const credPath = path.join(app.getPath("userData"), ".credentials.enc");
    if (!fs.existsSync(credPath)) return null;
    const raw = await fs.promises.readFile(credPath, "utf8");
    const decrypted = SafeVault.decrypt(raw);
    const parsed = JSON.parse(decrypted);
    return { email: parsed.email, password: parsed.password };
  } catch (err) {
    console.warn("⚠️ [Security] Falha ao recuperar credenciais guardadas:", err);
    return null;
  }
});

ipcMain.handle("security:clear-saved-credentials", async (event) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  try {
    const credPath = path.join(app.getPath("userData"), ".credentials.enc");
    if (fs.existsSync(credPath)) {
      await fs.promises.unlink(credPath);
    }
    return true;
  } catch (err) {
    console.warn("⚠️ [Security] Falha ao limpar credenciais guardadas:", err);
    return false;
  }
});


// ==========================================
// LAN Configuration IPC Handlers
// ==========================================
import os from "os";

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

ipcMain.handle("lan:get-local-ip", () => {
  return getLocalIpAddress();
});

ipcMain.handle("lan:get-config", async () => {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
    return {
      enabled: settings?.terminalMode ? true : false,
      terminalMode: settings?.terminalMode || 'MASTER',
      masterIp: settings?.masterIp || null,
      lanSecret: settings?.lanSecret || null,
      port: 3333,
      localIp: getLocalIpAddress(),
    };
  } catch (error) {
    console.error("❌ [LAN] Erro ao buscar config LAN:", error);
    return { enabled: false, terminalMode: 'MASTER', masterIp: null, lanSecret: null, port: 3333, localIp: getLocalIpAddress() };
  }
});

ipcMain.handle("lan:set-config", async (_, config) => {
  try {
    await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: { 
        terminalMode: config.terminalMode,
        masterIp: config.masterIp,
        lanSecret: config.lanSecret
      },
      create: { 
        id: 'singleton',
        terminalMode: config.terminalMode,
        masterIp: config.masterIp,
        lanSecret: config.lanSecret
      }
    });
    return true;
  } catch (error) {
    console.error("❌ [LAN] Erro ao guardar config LAN:", error);
    throw error;
  }
});

ipcMain.handle("lan:rotate-secret", async () => {
  try {
    const newSecret = crypto.randomBytes(16).toString('hex').toUpperCase();
    await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: { lanSecret: newSecret },
      create: { id: 'singleton', lanSecret: newSecret, terminalMode: 'MASTER' }
    });
    const { setRotatedSecret } = await import("./server");
    setRotatedSecret(newSecret);
    return newSecret;
  } catch (error) {
    console.error("❌ [LAN] Erro ao gerar novo segredo LAN:", error);
    throw error;
  }
});

ipcMain.handle("lan:get-connected-terminals", async () => {
  try {
    const { getConnectedTerminalsList } = await import("./server");
    return getConnectedTerminalsList();
  } catch (error) {
    return [];
  }
});

ipcMain.handle("lan:revoke-terminal", async (_, { terminalId }) => {
  try {
    const { revokeConnectedTerminal } = await import("./server");
    return revokeConnectedTerminal(terminalId);
  } catch (error) {
    return false;
  }
});

ipcMain.handle("lan:test-connection", async (_, { targetIp, lanSecret }) => {
  const startTime = Date.now();
  try {
    const cleanIp = targetIp.trim().replace(/^http:\/\//, '').replace(/\/$/, '');
    const url = `http://${cleanIp}:3333/api/health`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      method: "GET",
      headers: lanSecret ? { "x-lan-secret": lanSecret } : {},
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Date.now() - startTime;
    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        latencyMs,
        serverTime: data.timestamp,
        connectedCount: data.connectedCount,
        message: "Conexão bem sucedida com o Master LAN!"
      };
    } else {
      return {
        success: false,
        latencyMs,
        message: `Servidor respondeu com status ${res.status}: ${res.statusText}`
      };
    }
  } catch (err: any) {
    return {
      success: false,
      latencyMs: Date.now() - startTime,
      message: err.name === "AbortError" ? "Tempo limite excedido (4s). Verifique o IP ou Firewall." : (err.message || "Não foi possível conectar ao Master.")
    };
  }
});

ipcMain.handle("lan:send-heartbeat", async (_, { masterIp, lanSecret, terminalName }) => {
  try {
    const cleanIp = masterIp.trim().replace(/^http:\/\//, '').replace(/\/$/, '');
    const url = `http://${cleanIp}:3333/api/lan/heartbeat`;
    const hwid = getHardwareFingerprint();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(lanSecret ? { "x-lan-secret": lanSecret } : {})
      },
      body: JSON.stringify({
        terminalId: hwid,
        terminalName: terminalName || os.hostname(),
        appVersion: app.getVersion(),
        clientTime: new Date().toISOString()
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    return null;
  }
});

ipcMain.handle("lan:check-system-capability", () => {
  const totalMemBytes = os.totalmem();
  const freeMemBytes = os.freemem();
  const totalMemoryGB = Math.round((totalMemBytes / (1024 * 1024 * 1024)) * 10) / 10;
  const freeMemoryGB = Math.round((freeMemBytes / (1024 * 1024 * 1024)) * 10) / 10;
  const cpuCores = os.cpus().length;
  const arch = os.arch();
  const platform = os.platform();

  // Requisitos mínimos: 4GB para Slave, 8GB recomendado para Master com múltiplos terminais
  const isMasterEligible = totalMemoryGB >= 4 && cpuCores >= 2;
  const isOptimalMaster = totalMemoryGB >= 8 && cpuCores >= 4;

  let recommendation = "Adequado para Terminal de Venda (Slave).";
  if (isOptimalMaster) {
    recommendation = "Excelente capacidade para Servidor Central (Master Multi-Terminal).";
  } else if (isMasterEligible) {
    recommendation = "Adequado para Servidor Central (Master com até 3 terminais).";
  }

  return {
    totalMemoryGB,
    freeMemoryGB,
    cpuCores,
    arch,
    platform,
    isMasterEligible,
    isOptimalMaster,
    recommendation,
  };
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

ipcMain.handle("sync:start-auto-sync", async (_, params) => {
  return syncManager.start(params);
});

ipcMain.handle("sync:stop-auto-sync", async () => {
  return syncManager.stop();
});

ipcMain.handle("sync:trigger-sync", async (_, params) => {
  return syncManager.triggerSync(params);
});

ipcMain.handle("sync:get-sync-status", async () => {
  return syncManager.getStatus();
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
    // ✅ VALIDAÇÃO DE SEGURANÇA - Relógio Monotónico
    const clockValidation = await validateMonotonicClock();
    if (!clockValidation.valid) {
      console.error(`🚫 [sync:upsert-item] Operação bloqueada: ${clockValidation.reason}`);
      throw new Error(`Operação bloqueada por segurança: ${clockValidation.reason}`);
    }

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
    // ✅ VALIDAÇÃO DE SEGURANÇA - Relógio Monotónico
    const clockValidation = await validateMonotonicClock();
    if (!clockValidation.valid) {
      console.error(`🚫 [sync:upsert-client] Operação bloqueada: ${clockValidation.reason}`);
      throw new Error(`Operação bloqueada por segurança: ${clockValidation.reason}`);
    }

    const isNew = !client.id;
    const clientUuid = client.id || crypto.randomUUID();

    const result = await prisma.client.upsert({
      where: { id: clientUuid },
      update: { ...client, id: clientUuid, storeId },
      create: { ...client, id: clientUuid, storeId, offlineId: clientUuid }
    });

    const finalPayload = {
      ...result,
      offlineId: result.offlineId || result.id
    };
    console.log("📤 [sync:upsert-client] Cliente salvo localmente, preparando payload para outbox:", finalPayload);
    // Registar no Outbox local para sincronizar com a cloud
    await prisma.syncOutbox.create({
      data: {
        entityType: "CLIENT",
        entityId: result.id,
        action: isNew ? "CREATE" : "UPDATE",
        payload: JSON.stringify(finalPayload),
        storeId
      }
    });

    return finalPayload;
  } catch (error) {
    console.error("❌ [DB] Erro ao salvar cliente localmente:", error);
    throw error;
  }
});

ipcMain.handle("sync:create-invoice", async (_, { invoiceData, storeId, userId, user }) => {
  try {
    // ✅ VALIDAÇÃO DE SEGURANÇA - Relógio Monotónico (ANTES DE QUALQUER OPERAÇÃO)
    const clockValidation = await validateMonotonicClock();
    if (!clockValidation.valid) {
      console.error(`🚫 [sync:create-invoice] Criação de fatura bloqueada: ${clockValidation.reason}`);
      throw new Error(`Operação bloqueada por segurança: ${clockValidation.reason}`);
    }

    if (!userId) {
      throw new Error("userId obrigatório para criar a fatura localmente.");
    }

    const invoiceId = crypto.randomUUID();
    const localNo = `FT-DRAFT-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const issueDate = invoiceData.issueDate ? new Date(invoiceData.issueDate) : new Date();

    let localUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!localUser) {
      if (!user?.email || !user?.name) {
        throw new Error(`Usuário local não encontrado para userId=${userId} e faltam dados de usuário para criá-lo.`);
      }

      localUser = await prisma.user.create({
        data: {
          id: userId,
          email: user.email,
          name: user.name,
          role: user.role || "CASHIER",
          storeId: storeId || user.storeId || "unknown",
        }
      });
      console.log(`✅ [sync:create-invoice] Local user criado automaticamente: ${localUser.id}`);
    } else {
      console.log(`✅ [sync:create-invoice] Local user encontrado: ${localUser.id}`);
    }

    console.log(
      `[sync:create-invoice] Criar fatura para userId=${userId}, storeId=${storeId}, itemIds=${invoiceData.items?.map((item: any) => item.id).join(",")}`,
    );

    // 1. Processar cliente se fornecido no payload
    let clientId = null;
    if (invoiceData.client) {
      const isNewClient = !invoiceData.client.id || invoiceData.client.id.includes('-new-') || invoiceData.client.__isNew__;
      if (isNewClient) {
        const clientUuid = crypto.randomUUID();
        const clientResult = await prisma.client.create({
          data: {
            id: clientUuid,
            name: invoiceData.client.name,
            nif: invoiceData.client.taxNumber || invoiceData.client.nif || null,
            email: invoiceData.client.email || null,
            phone: invoiceData.client.phone || null,
            address: invoiceData.client.address || null,
            storeId,
            offlineId: clientUuid
          }
        });
        clientId = clientResult.id;

        // Não registrar cliente como um documento separado no outbox.
        // O cliente novo será enviado dentro do payload da própria fatura.
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
    const itemsForCloud = [];
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

      // Guardar na fatura local com referência ao ID local do item
      linesData.push({
        id: crypto.randomUUID(),
        itemId: localItem.id,
        quantity: qty,
        unitPrice,
        taxPercent,
        netTotal,
        grossTotal
      });

      // Preparar item para envio à cloud usando cloudId quando disponível
      itemsForCloud.push({
        id: localItem.cloudId || localItem.id,
        name: localItem.name,
        quantity: qty,
        unitPrice,
        taxPercent
      });
    }

    const calculatedGrossTotal = calculatedNetTotal + calculatedTaxTotal;

    // 3. Resolução Atómica e Encadeamento de Séries Fiscais AGT Oficiais
    const documentType = (invoiceData.documentType || invoiceData.type || 'FR').toString().toUpperCase();
    const currentYear = new Date().getFullYear().toString();
    const storeIdLocal = storeId || invoiceData.storeId || 'DEFAULT_STORE';
    const establishmentNumber = invoiceData.establishmentNumber || 'SEDE';
    const companyId = invoiceData.companyId || 'DEFAULT_COMPANY';

    let seriesRow = await prisma.agtSeries.findFirst({
      where: {
        documentType,
        seriesYear: currentYear,
        isActive: true,
        OR: [
          { storeId: storeIdLocal },
          { storeId: null },
          { establishmentNumber: establishmentNumber },
        ]
      },
      orderBy: { updatedAt: "desc" },
    });

    if (!seriesRow) {
      seriesRow = await prisma.agtSeries.findFirst({
        where: {
          documentType,
          isActive: true,
        },
        orderBy: { updatedAt: "desc" },
      });
    }

    // Regra estrita da AGT: Se não houver série oficial disponibilizada pela AGT (sincronizada da Cloud), NÃO pode ocorrer faturação
    if (!seriesRow || !seriesRow.seriesCode) {
      console.error(`🚫 [sync:create-invoice] Faturação bloqueada: Nenhuma série fiscal oficial da AGT encontrada para ${documentType}/${currentYear}.`);
      throw new Error(`Não é possível emitir a fatura: Nenhuma série fiscal oficial da AGT (${documentType}) encontrada. Sincronize as séries com a Cloud antes de faturar.`);
    }

    console.log(`📄 [sync:create-invoice] Série fiscal AGT oficial encontrada: ${seriesRow.seriesCode} (Seq atual: ${seriesRow.currentSequence})`);

    const nextSequence = (seriesRow.currentSequence || 0) + 1;
    const seriesCode = seriesRow.seriesCode;
    const localAgtNo = `${documentType} ${seriesCode}/${nextSequence}`;
    const previousHash = seriesRow.lastHash || '';

    // 4. Assinatura Digital Fiscal AGT (RSA-SHA1 + QR Code Modelo 2 v4)
    let signatureResult: {
      hash: string;
      hashControl: string;
      hashBase: string;
      qrCode: string;
      previousHash: string;
      systemEntryDate: Date;
      swValidationNumber: string;
    };

    try {
      signatureResult = await FiscalSignatureService.signInvoice({
        docNo: localAgtNo,
        issueDate,
        grossTotal: calculatedGrossTotal,
        taxTotal: calculatedTaxTotal,
        previousHash,
      });
      console.log(`🔐 [sync:create-invoice] Fatura ${localAgtNo} assinada com sucesso! HashControl: [${signatureResult.hashControl}]`);
    } catch (sigError: any) {
      console.error(`❌ [sync:create-invoice] Erro crítico na assinatura fiscal:`, sigError);
      throw new Error(`Falha na assinatura fiscal do documento: ${sigError.message}`);
    }

    // Atualizar a série AGT atómica com o novo número e o hash encadeado
    await prisma.agtSeries.update({
      where: { id: seriesRow.id },
      data: {
        currentSequence: nextSequence,
        lastDocumentNo: localAgtNo,
        lastHash: signatureResult.hash,
      },
    });

    // 5. Criar a Fatura no SQLite com assinatura fiscal completa
    const createdInvoice = await prisma.invoice.create({
      data: {
        id: invoiceId,
        localNo,
        agtNo: localAgtNo,
        status: "VALID",
        issueDate,
        systemEntryDate: signatureResult.systemEntryDate,
        netTotal: calculatedNetTotal,
        taxTotal: calculatedTaxTotal,
        grossTotal: calculatedGrossTotal,
        hash: signatureResult.hash,
        hashControl: signatureResult.hashControl,
        previousHash: signatureResult.previousHash,
        qrCode: signatureResult.qrCode,
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

    // 6. Preparar payload de sincronização da fatura para a Cloud
    const cloudClient: any = {};
    const clientName = createdInvoice.client?.name?.trim();
    if (clientName) {
      if (createdInvoice.client?.cloudId) {
        cloudClient.id = createdInvoice.client.cloudId;
      } else {
        cloudClient.name = clientName;
        if (createdInvoice.client?.id) cloudClient.offlineId = createdInvoice.client.id;
        if (createdInvoice.client?.nif) cloudClient.nif = createdInvoice.client.nif;
        if (createdInvoice.client?.email) cloudClient.email = createdInvoice.client.email;
        if (createdInvoice.client?.phone) cloudClient.phone = createdInvoice.client.phone;
        if (createdInvoice.client?.address) cloudClient.address = createdInvoice.client.address;
      }
    }

    const cloudPayload = {
      ...invoiceData,
      agtNo: localAgtNo,
      offline: true,
      hash: signatureResult.hash,
      hashControl: signatureResult.hashControl,
      previousHash: signatureResult.previousHash,
      systemEntryDate: signatureResult.systemEntryDate.toISOString(),
      qrCode: signatureResult.qrCode,
      swValidationNumber: signatureResult.swValidationNumber,
      items: itemsForCloud,
      establishmentNumber: invoiceData.establishmentNumber || establishmentNumber,
      client: Object.keys(cloudClient).length > 0 ? cloudClient : undefined,
    };

    console.log("📤 [sync:create-invoice] Payload assinado guardado no outbox:", JSON.stringify(cloudPayload, null, 2));

    await prisma.syncOutbox.create({
      data: {
        entityType: "INVOICE",
        entityId: createdInvoice.id,
        action: "CREATE",
        payload: JSON.stringify(cloudPayload),
        storeId
      }
    });

    // Retorna a resposta completa e assinada para a UI (para exibição e impressão imediata)
    return {
      data: {
        id: createdInvoice.id,
        localNo: createdInvoice.agtNo,
        agtNo: createdInvoice.agtNo,
        hash: signatureResult.hash,
        hashControl: signatureResult.hashControl,
        qrCode: signatureResult.qrCode,
        swValidationNumber: signatureResult.swValidationNumber,
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
      where: { status: { in: ["PENDING", "PENDING_DEPENDENCIES"] } }
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
    // ✅ VALIDAÇÃO DE SEGURANÇA - Relógio Monotónico
    const clockValidation = await validateMonotonicClock();
    if (!clockValidation.valid) {
      console.error(`🚫 [sync:open-cash-session] Abertura de sessão bloqueada: ${clockValidation.reason}`);
      throw new Error(`Operação bloqueada por segurança: ${clockValidation.reason}`);
    }

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
    // ✅ VALIDAÇÃO DE SEGURANÇA - Relógio Monotónico
    const clockValidation = await validateMonotonicClock();
    if (!clockValidation.valid) {
      console.error(`🚫 [sync:close-cash-session] Fecho de sessão bloqueado: ${clockValidation.reason}`);
      throw new Error(`Operação bloqueada por segurança: ${clockValidation.reason}`);
    }

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
    // ✅ VALIDAÇÃO DE SEGURANÇA - Relógio Monotónico
    const clockValidation = await validateMonotonicClock();
    if (!clockValidation.valid) {
      console.error(`🚫 [sync:add-cash-movement] Movimento de caixa bloqueado: ${clockValidation.reason}`);
      throw new Error(`Operação bloqueada por segurança: ${clockValidation.reason}`);
    }

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

function getMainWindow(): BrowserWindow | null {
  const mainWindow = (global as any).__mainWindow;
  return mainWindow && !mainWindow.isDestroyed() ? mainWindow : null;
}

function sendUpdateEvent(channel: string, payload?: any) {
  const mainWindow = getMainWindow();
  if (!mainWindow) {
    console.warn(`[Updater] Nenhuma janela disponível para enviar evento ${channel}`);
    return;
  }
  mainWindow.webContents.send(channel, payload);
}

const isUpdateEnabled = isProd;

if (isUpdateEnabled) {
  autoUpdater.autoDownload = false;
  autoUpdater.allowPrerelease = false;

  autoUpdater.on("error", (error: Error | null) => {
    console.error("❌ [Updater] error:", error);
    sendUpdateEvent("update:error", {
      message: error?.message || "Erro desconhecido ao verificar atualizações.",
    });
  });

  autoUpdater.on("update-available", (info: any) => {
    console.log("✅ [Updater] update available:", info);
    sendUpdateEvent("update:available", info);
  });

  autoUpdater.on("update-not-available", (info: any) => {
    console.log("ℹ️ [Updater] update not available:", info);
    sendUpdateEvent("update:not-available", info);
  });

  autoUpdater.on("download-progress", (progress: any) => {
    sendUpdateEvent("update:download-progress", progress);
  });

  autoUpdater.on("update-downloaded", (info: any) => {
    console.log("✅ [Updater] update downloaded:", info);
    sendUpdateEvent("update:downloaded", info);
  });
}

ipcMain.handle("update:check-for-updates", async () => {
  if (!isUpdateEnabled) {
    return { success: false, message: "Atualizações só funcionam em produção." };
  }

  try {
    const result = await autoUpdater.checkForUpdates();
    return { success: true, result };
  } catch (error: any) {
    console.error("❌ [Updater] check-for-updates failed:", error?.message || error);
    return { success: false, message: error?.message || "Falha ao verificar atualizações." };
  }
});

ipcMain.handle("update:download-update", async () => {
  if (!isUpdateEnabled) {
    return { success: false, message: "Atualizações só funcionam em produção." };
  }

  try {
    const result = await autoUpdater.downloadUpdate();
    return { success: true, result };
  } catch (error: any) {
    console.error("❌ [Updater] download-update failed:", error?.message || error);
    return { success: false, message: error?.message || "Falha ao descarregar atualização." };
  }
});

ipcMain.handle("update:install-update", async () => {
  if (!isUpdateEnabled) {
    return { success: false, message: "Atualizações só funcionam em produção." };
  }

  try {
    autoUpdater.quitAndInstall(true, true);
    return { success: true };
  } catch (error: any) {
    console.error("❌ [Updater] install-update failed:", error?.message || error);
    return { success: false, message: error?.message || "Falha ao instalar atualização." };
  }
});

ipcMain.handle("app:get-version", () => {
  return app.getVersion();
});

// ==========================================
// Native Notifications IPC Handler
// ==========================================
ipcMain.handle("notification:show", async (event, { title, body, silent }: { title: string; body: string; silent?: boolean }) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  try {
    const iconCandidates = [
      path.join(process.resourcesPath || "", "resources", "icon.png"),
      path.join(__dirname, "..", "resources", "icon.png"),
      path.join(__dirname, "..", "renderer", "public", "mindgest.png"),
    ];

    const foundIcon = iconCandidates.find((p) => fs.existsSync(p));

    const notification = new Notification({
      title: title || "Mindgest POS",
      body: body || "",
      icon: foundIcon,
      silent: silent ?? true,
    });

    notification.on("click", () => {
      const mainWindow = getMainWindow();
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    });

    notification.show();
    return true;
  } catch (err) {
    console.error("❌ [Notification] Erro ao disparar notificação nativa:", err);
    return false;
  }
});

// ==========================================
// Hardware & Cash Drawer IPC Handlers
// ==========================================
ipcMain.handle("printer:open-cash-drawer", async (event, { options, auditEntry }: { options?: any; auditEntry?: any }) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  return await PrinterService.openCashDrawer(options || { transport: 'spooler' }, auditEntry);
});

ipcMain.handle("printer:test-connection", async (event, { options }: { options?: any }) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  return await PrinterService.testConnection(options || { transport: 'spooler' });
});

ipcMain.handle("printer:get-system-printers", async (event) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  const mainWindow = getMainWindow();
  if (!mainWindow) return [];
  try {
    return await mainWindow.webContents.getPrintersAsync();
  } catch (err) {
    console.warn("Falha ao listar impressoras do sistema:", err);
    return [];
  }
});

// ==========================================
// Customer Display IPC Handlers
// ==========================================
ipcMain.handle("customer-display:toggle", async (event) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  const port = process.argv[2] || '8888';
  return CustomerDisplayService.toggle(port);
});

ipcMain.handle("customer-display:open", async (event) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  const port = process.argv[2] || '8888';
  return CustomerDisplayService.open(port);
});

ipcMain.handle("customer-display:close", async (event) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  CustomerDisplayService.close();
  return true;
});

ipcMain.handle("customer-display:is-open", async (event) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  return CustomerDisplayService.isOpen();
});

ipcMain.handle("customer-display:request-state", async (event) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  return CustomerDisplayService.getState();
});

ipcMain.handle("customer-display:update", async (event, partialState: any) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  CustomerDisplayService.updateState(partialState || {});
  return true;
});

ipcMain.handle("customer-display:clear", async (event, storeName?: string) => {
  if (!validateIpcSender(event)) throw new Error("Acesso IPC não autorizado.");
  CustomerDisplayService.clear(storeName);
  return true;
});

// ==========================================
// Document Generation & Print IPC Handlers
// ==========================================
ipcMain.handle("document:generate-local-pdf", async (_, { invoiceId, layout }: { invoiceId: string; layout?: 'a4' | 'thermal' }) => {
  try {
    return await LocalDocumentService.generateInvoicePdf(invoiceId, { layout });
  } catch (error: any) {
    console.error("❌ [IPC document:generate-local-pdf] Erro ao gerar PDF local:", error);
    throw error;
  }
});

ipcMain.handle("document:is-sidecar-healthy", async () => {
  return await SidecarManager.isHealthy();
});

console.log("--- Electron Main Process Log ---");
console.log("Environment:", isProd ? "production" : "development");

// Prevent multiple app instances (defensive for dev hot-reload scenarios)
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  console.warn('⚠️ Outra instância detectada. A aplicação principal vai sair para evitar múltiplas janelas.');
  app.quit();
  process.exit(0);
}

app.on('second-instance', () => {
  // Someone tried to run a second instance, focus existing window instead
  try {
    const existing: any = (global as any).__mainWindow;
    if (existing && !existing.isDestroyed()) {
      if (existing.isMinimized()) existing.restore();
      existing.focus();
    }
  } catch (e) {
    console.warn('Falha ao focar janela existente no evento second-instance:', e);
  }
});

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

async function createWindow() {
  console.log("Attempting to create window...");
  // Trace caller for debugging repeated invocations in dev
  try {
    const st = new Error().stack;
    console.log('📌 [createWindow] Call stack:', st);
  } catch (e) {
    /* ignore */
  }
  // Prevent creating multiple windows during hot-reload or repeated calls
  if ((global as any).__mainWindow && !(global as any).__mainWindow.isDestroyed()) {
    try {
      const existing: any = (global as any).__mainWindow;
      existing.focus();
      console.log("⚠️ [createWindow] Janela existente encontrada — focando em vez de criar outra.");
      return existing;
    } catch (e) {
      console.warn("[createWindow] Falha ao focar na janela existente:", e);
    }
  }

  if (isProd) {
    Menu.setApplicationMenu(null);
  }

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      devTools: !isProd,
    },
  });

  // Store a global reference so subsequent calls reuse this window
  try {
    (global as any).__mainWindow = mainWindow;
  } catch (e) {
    console.warn('Falha ao armazenar referência global da janela:', e);
  }

  // Abre links externos no navegador padrão e bloqueia abertura arbitrária de janelas
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http:") || url.startsWith("https:")) {
      shell.openExternal(url);
    }
    return { action: "deny" };
  });

  // Nextron passes the port as the first argument in development
  const port = process.argv[2];

  // Bloqueia navegação interna para URLs arbitrárias fora da app
  mainWindow.webContents.on("will-navigate", (event, navigationUrl) => {
    try {
      const parsed = new URL(navigationUrl);
      if (!isProd && parsed.origin === `http://localhost:${port}`) return;
      if (isProd && parsed.protocol === "app:") return;
    } catch {}
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });

  // ==========================================
  // VALIDAÇÃO DE SEGURANÇA (Anti-Tampering)
  // ==========================================
  const securityCheck = await validateOfflineLicense();
  let entryPath = "/pos/counter"; // Por defeito vai para o POS

  if (!securityCheck.valid) {
    console.warn(`🔒 [Lockdown] Acesso Offline Bloqueado: ${securityCheck.reason}`);
    entryPath = "/auth/login"; // Redireciona para o ecrã de Login Online
  }

  const cleanEntryPath = entryPath.replace(/^\/+/, '');
  const url = isProd
    ? `app://./${cleanEntryPath}`
    : `http://localhost:${port}/${cleanEntryPath}`;

  console.log(`Target URL: ${url}`);

  try {
    await mainWindow.loadURL(url);
    console.log("Window loaded successfully");

    if (isUpdateEnabled) {
      autoUpdater.checkForUpdates().catch((error: any) => {
        console.error("❌ [Updater] initial check failed:", error);
      });
    }
  } catch (err) {
    console.error("CRITICAL: Failed to load URL:", err);
  }

  if (!isProd) {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    try {
      (global as any).__mainWindow = null;
      console.log('🗙 [createWindow] Janela principal fechada; referência global limpa.');
    } catch (e) {
      console.warn('Falha ao limpar referência global da janela:', e);
    }
  });
}

import { testPrismaConnection } from "./prisma";
import { startLocalServer } from "./server";

// ====================================================
// Subprocesso do Microserviço MIND AI (Ciclo de Vida)
// ====================================================
let pySubprocess: ChildProcess | null = null;

// ====================================================
// Subprocesso do Microserviço de Documentos (Python) - Document Generator
// ====================================================
let docGenSubprocess: ChildProcess | null = null;
function startPythonSubprocess() {
  let pyPath = "";
  let pyArgs: string[] = [];

  if (isProd) {
    // 1. Em Produção: Executa o .exe que está embutido na pasta de recursos
    pyPath = path.join(process.resourcesPath, "bin", "mind-ai", "mind-ai.exe");
  } else {
    // 2. Em Desenvolvimento: Corre via interpretador da nossa venv local
    const venvPython = path.join(app.getAppPath(), "mind-microservice", "venv", "Scripts", "python.exe");
    const localMainPy = path.join(app.getAppPath(), "mind-microservice", "main.py");

    if (fs.existsSync(venvPython)) {
      pyPath = venvPython;
      pyArgs = [localMainPy];
    } else {
      // Fallback para comando global python se não houver venv configurada
      pyPath = "python";
      pyArgs = [localMainPy];
    }
  }

  console.log(`🚀 [Launcher] A tentar iniciar serviço MIND AI em: ${pyPath}`);

  try {
    pySubprocess = spawn(pyPath, pyArgs, {
      stdio: "ignore",     // Esconde logs do stdout para manter limpo
      windowsHide: true   // Garante que NENHUMA janela preta cmd pisca no Windows
    });

    pySubprocess.on("error", (err) => {
      console.error("❌ [Launcher] Erro ao iniciar subprocesso MIND:", err);
    });

    pySubprocess.on("close", (code) => {
      console.log(`🔌 [Launcher] Subprocesso MIND AI fechado com código: ${code}`);
    });
  } catch (err) {
    console.error("❌ [Launcher] Erro crítico ao fazer spawn do subprocesso MIND:", err);
  }
}

function killPythonSubprocess() {
  if (pySubprocess) {
    console.log("🔌 [Launcher] A encerrar serviço MIND AI em background...");
    pySubprocess.kill();
    pySubprocess = null;
  }
}

app.on("ready", async () => {
  console.log("Main process READY EVENT triggered");
  await testPrismaConnection();

  try {
    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
    if (!settings || settings.terminalMode === 'MASTER') {
      await startLocalServer();
    } else {
      console.log("🖥️ [Terminal Mode] Servidor local desativado. Este PC é um terminal slave.");
    }
  } catch (error) {
    console.error("⚠️ [Aviso] Não foi possível iniciar o servidor local. A porta pode estar ocupada:", error);
  }

  // Iniciar automaticamente o microserviço de IA da MIND
  startPythonSubprocess();
  
  // Iniciar o microserviço local de Impressão e Geração de Documentos (Sidecar)
  SidecarManager.start();

  // Inicializar listeners de ecrãs para o Ecrã de Cliente
  CustomerDisplayService.initDisplayListeners((event) => {
    const mainWindow = getMainWindow();
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send("customer-display:hardware-change", { event });
    }
  });

  createWindow();
});

app.on("window-all-closed", () => {
  console.log("Shutdown: All windows closed");
  killPythonSubprocess();
  SidecarManager.stop();
  app.quit();
});

process.on("exit", () => {
  killPythonSubprocess();
  SidecarManager.stop();
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
  killPythonSubprocess();
  SidecarManager.stop();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION at:", promise, "reason:", reason);
  SidecarManager.stop();
});
