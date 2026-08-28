import { ipcMain, app } from "electron";
import path from "path";
import fs from "fs";
import { getHardwareFingerprint, validateMonotonicClock } from "../security";
import { FiscalSignatureService } from "../fiscal-signature";
import { SafeVault } from "../storage-key";
import { prisma } from "../prisma";

type ValidatorFn = (event: Electron.IpcMainInvokeEvent) => boolean;

export function registerSecurityIpcHandlers(validateIpcSender: ValidatorFn): void {
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
}
