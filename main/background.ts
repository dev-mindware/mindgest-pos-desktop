import path from "path";
import { app, BrowserWindow, ipcMain } from "electron";
import serve from "electron-serve";
import { database } from "./database";
import { getHardwareFingerprint } from "./security";
import { prisma } from "./prisma";

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
