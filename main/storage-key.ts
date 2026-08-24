import { safeStorage } from 'electron';
import * as crypto from 'crypto';
import { getHardwareFingerprint } from './security';

/**
 * Módulo de Cifra e Cofre Seguro (Electron safeStorage / DPAPI / Keychain)
 */
export class SafeVault {
  private static deriveHwidKey(): Buffer {
    const hwid = getHardwareFingerprint();
    return crypto.scryptSync(hwid, 'mindgest-safe-vault-salt-2026', 32);
  }

  /**
   * Cifra um texto ou chave privada com DPAPI (safeStorage) se disponível,
   * ou com AES-256-GCM derivado do HWID caso o safeStorage não esteja pronto.
   */
  static encrypt(plaintext: string): string {
    if (!plaintext) return '';

    if (safeStorage && safeStorage.isEncryptionAvailable()) {
      try {
        const encryptedBuffer = safeStorage.encryptString(plaintext);
        return `dpapi:${encryptedBuffer.toString('base64')}`;
      } catch (err) {
        console.warn('⚠️ [SafeVault] safeStorage falhou, usando fallback HWID GCM:', err);
      }
    }

    // Fallback HWID AES-256-GCM
    const key = this.deriveHwidKey();
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag().toString('hex');
    return `hwid:${iv.toString('hex')}:${tag}:${encrypted}`;
  }

  /**
   * Decifra um texto ou chave privada previamente encriptado pelo SafeVault
   */
  static decrypt(ciphertext: string): string {
    if (!ciphertext) return '';

    if (ciphertext.startsWith('dpapi:')) {
      const base64Data = ciphertext.substring(6);
      if (safeStorage && safeStorage.isEncryptionAvailable()) {
        try {
          return safeStorage.decryptString(Buffer.from(base64Data, 'base64'));
        } catch (err) {
          console.error('❌ [SafeVault] Falha ao desencriptar com safeStorage:', err);
          throw new Error('Falha ao decifrar credencial segura.');
        }
      }
    }

    if (ciphertext.startsWith('hwid:')) {
      const parts = ciphertext.split(':');
      if (parts.length !== 4) throw new Error('Cifra corrompida.');
      const [, ivHex, tagHex, encryptedHex] = parts;
      const key = this.deriveHwidKey();
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
      decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }

    // Suporte a formato legado sem prefixo (iv:tag:encrypted)
    const legacyParts = ciphertext.split(':');
    if (legacyParts.length === 3) {
      const [ivHex, tagHex, encryptedHex] = legacyParts;
      const key = this.deriveHwidKey();
      const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
      decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
      let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    }

    return ciphertext;
  }
}
