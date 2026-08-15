import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import QRCode from 'qrcode';
import { prisma } from './prisma';
import { getHardwareFingerprint } from './security';

export const DEFAULT_AGT_SOFTWARE_VALIDATION = process.env.AGT_SOFTWARE_VALIDATION_NUMBER || 'FE/241/AGT/2026';
export const DEFAULT_COMPANY_NIF = process.env.COMPANY_NIF || '999999999';

// Chave mestra de derivação baseada no hardware do POS
function deriveEncryptionKey(hwid: string): Buffer {
  return crypto.scryptSync(hwid, 'mindgest-fiscal-vault-salt', 32);
}

function encryptWithHwid(plaintext: string, hwid: string): string {
  const key = deriveEncryptionKey(hwid);
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(plaintext, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

function decryptWithHwid(payload: string, hwid: string): string {
  const parts = payload.split(':');
  if (parts.length !== 3) throw new Error('Cifra de chave corrompida.');
  const [ivHex, tagHex, encryptedHex] = parts;
  const key = deriveEncryptionKey(hwid);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export class FiscalSignatureService {
  private static cachedPrivateKey: string | null = null;
  private static cachedPublicKey: string | null = null;

  /**
   * Constrói a string canónica para o cálculo do Hash Fiscal AGT
   * Formato: DataFatura;DataSistema;NumeroDoc;TotalBruto;HashAnterior
   */
  static buildHashBase(data: {
    invoiceDate: string;       // Formato YYYY-MM-DD
    systemEntryDate: string;   // Formato YYYY-MM-DDTHH:mm:ss
    invoiceNo: string;         // Ex: FR FT2026/1
    grossTotal: number;        // Ex: 15450.00
    previousHash: string;      // Hash anterior ou vazio no primeiro doc da série
  }): string {
    const grossTotalFormatted = Number(data.grossTotal || 0).toFixed(2);
    const prevHash = (data.previousHash || '').trim();
    return `${data.invoiceDate};${data.systemEntryDate};${data.invoiceNo};${grossTotalFormatted};${prevHash}`;
  }

  /**
   * Assina o HashBase usando RSA-SHA1 (Norma AGT Angola)
   */
  static sign(hashBase: string, privateKeyPem: string): string {
    if (!privateKeyPem) {
      throw new Error('Chave privada RSA não fornecida para assinatura fiscal.');
    }
    const signer = crypto.createSign('RSA-SHA1');
    signer.update(hashBase);
    return signer.sign(privateKeyPem, 'base64');
  }

  /**
   * Extrai os 4 caracteres de controlo do Hash Base64 (posições 1, 11, 21, 31)
   */
  static extractHashControl(hash: string): string {
    if (!hash || hash.length < 31) {
      return '0000';
    }
    return hash[0] + hash[10] + hash[20] + hash[30];
  }

  /**
   * Gera o QR Code oficial da AGT (Modelo 2 Versão 4)
   * Estrutura: 4;NumeroDoc;Data;TotalBruto;TotalImposto;4CharsHash;NIF;NumValidacaoSoftware
   */
  static async generateAgtQrCode(data: {
    nif: string;
    docNo: string;
    date: string;
    grossTotal: number;
    taxTotal: number;
    hash: string;
    swValidationNumber: string;
  }): Promise<string> {
    const fourChars = this.extractHashControl(data.hash);
    const content = [
      '4',
      data.docNo,
      data.date,
      Number(data.grossTotal || 0).toFixed(2),
      Number(data.taxTotal || 0).toFixed(2),
      fourChars,
      data.nif || DEFAULT_COMPANY_NIF,
      data.swValidationNumber || DEFAULT_AGT_SOFTWARE_VALIDATION,
    ].join(';');

    return await QRCode.toDataURL(content, {
      errorCorrectionLevel: 'M',
      margin: 2,
      scale: 4,
    });
  }

  /**
   * Obtém ou inicializa a chave RSA da empresa de forma segura no SQLite
   */
  static async getOrInitializeKeys(): Promise<{
    privateKey: string;
    publicKey: string;
    swValidationNumber: string;
    companyNif: string;
    companyName: string;
  }> {
    if (this.cachedPrivateKey && this.cachedPublicKey) {
      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
      return {
        privateKey: this.cachedPrivateKey,
        publicKey: this.cachedPublicKey,
        swValidationNumber: settings?.softwareValidationNumber || DEFAULT_AGT_SOFTWARE_VALIDATION,
        companyNif: settings?.companyNif || DEFAULT_COMPANY_NIF,
        companyName: settings?.companyName || 'MINDGEST',
      };
    }

    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
    const hwid = getHardwareFingerprint();

    // 1. Tentar ler do Settings criptografado
    if (settings?.encryptedPrivateKey) {
      try {
        const decryptedKey = decryptWithHwid(settings.encryptedPrivateKey, hwid);
        this.cachedPrivateKey = decryptedKey;
        this.cachedPublicKey = settings.publicKey || '';
        return {
          privateKey: decryptedKey,
          publicKey: settings.publicKey || '',
          swValidationNumber: settings.softwareValidationNumber || DEFAULT_AGT_SOFTWARE_VALIDATION,
          companyNif: settings.companyNif || DEFAULT_COMPANY_NIF,
          companyName: settings.companyName || 'MINDGEST',
        };
      } catch (err) {
        console.warn('⚠️ [FiscalSignature] Falha ao desencriptar chave RSA guardada. Gerando novo par local...');
      }
    }

    // 2. Tentar ler de variável de ambiente ou arquivo físico
    if (process.env.PRIVATE_KEY || process.env.AGT_PRIVATE_KEY) {
      let envKey = (process.env.PRIVATE_KEY || process.env.AGT_PRIVATE_KEY) as string;
      if (envKey && !envKey.trim().startsWith('-----BEGIN')) {
        envKey = Buffer.from(envKey.trim(), 'base64').toString('utf8');
      }
      this.cachedPrivateKey = envKey.replace(/\\n/g, '\n');
      return {
        privateKey: this.cachedPrivateKey,
        publicKey: '',
        swValidationNumber: settings?.softwareValidationNumber || DEFAULT_AGT_SOFTWARE_VALIDATION,
        companyNif: settings?.companyNif || DEFAULT_COMPANY_NIF,
        companyName: settings?.companyName || 'MINDGEST',
      };
    }

    // 3. Se ainda não existir chave, gerar um par RSA 2048-bit local e guardar encriptado
    console.log('🔐 [FiscalSignature] Gerando par de chaves RSA 2048-bit para emissão fiscal offline...');
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const encrypted = encryptWithHwid(privateKey, hwid);

    await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: {
        encryptedPrivateKey: encrypted,
        publicKey,
        softwareValidationNumber: settings?.softwareValidationNumber || DEFAULT_AGT_SOFTWARE_VALIDATION,
        companyNif: settings?.companyNif || DEFAULT_COMPANY_NIF,
        companyName: settings?.companyName || 'MINDGEST',
      },
      create: {
        id: 'singleton',
        encryptedPrivateKey: encrypted,
        publicKey,
        softwareValidationNumber: DEFAULT_AGT_SOFTWARE_VALIDATION,
        companyNif: DEFAULT_COMPANY_NIF,
        companyName: 'MINDGEST',
      },
    });

    this.cachedPrivateKey = privateKey;
    this.cachedPublicKey = publicKey;

    return {
      privateKey,
      publicKey,
      swValidationNumber: settings?.softwareValidationNumber || DEFAULT_AGT_SOFTWARE_VALIDATION,
      companyNif: settings?.companyNif || DEFAULT_COMPANY_NIF,
      companyName: settings?.companyName || 'MINDGEST',
    };
  }

  /**
   * Executa o processo completo de assinatura fiscal de uma fatura
   */
  static async signInvoice(params: {
    docNo: string;
    issueDate: Date;
    systemEntryDate?: Date;
    grossTotal: number;
    taxTotal: number;
    previousHash?: string | null;
    companyNif?: string;
    swValidationNumber?: string;
  }): Promise<{
    hash: string;
    hashControl: string;
    hashBase: string;
    qrCode: string;
    previousHash: string;
    systemEntryDate: Date;
    swValidationNumber: string;
  }> {
    const keys = await this.getOrInitializeKeys();
    const swValidationNumber = params.swValidationNumber || keys.swValidationNumber || DEFAULT_AGT_SOFTWARE_VALIDATION;
    const companyNif = params.companyNif || keys.companyNif || DEFAULT_COMPANY_NIF;

    const systemEntryDate = params.systemEntryDate || new Date();
    const invoiceDateStr = params.issueDate.toISOString().split('T')[0];
    const systemEntryDateStr = systemEntryDate.toISOString().split('.')[0]; // YYYY-MM-DDTHH:mm:ss
    const prevHash = (params.previousHash || '').trim();

    const hashBase = this.buildHashBase({
      invoiceDate: invoiceDateStr,
      systemEntryDate: systemEntryDateStr,
      invoiceNo: params.docNo,
      grossTotal: params.grossTotal,
      previousHash: prevHash,
    });

    const hash = this.sign(hashBase, keys.privateKey);
    const hashControl = this.extractHashControl(hash);

    const qrCode = await this.generateAgtQrCode({
      nif: companyNif,
      docNo: params.docNo,
      date: invoiceDateStr,
      grossTotal: params.grossTotal,
      taxTotal: params.taxTotal,
      hash,
      swValidationNumber,
    });

    return {
      hash,
      hashControl,
      hashBase,
      qrCode,
      previousHash: prevHash,
      systemEntryDate,
      swValidationNumber,
    };
  }
}
