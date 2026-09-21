import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import QRCode from 'qrcode';
import { prisma } from './prisma';
import { getHardwareFingerprint, validateOfflineLicense, LicenseValidationResult } from './security';
import { SafeVault } from './storage-key';
import { database } from './database';

export const DEFAULT_AGT_SOFTWARE_VALIDATION = process.env.AGT_SOFTWARE_VALIDATION_NUMBER || 'FE/241/AGT/2026';
export const DEFAULT_COMPANY_NIF = process.env.COMPANY_NIF || '999999999';

export class FiscalSignatureService {
  private static cachedPrivateKey: string | null = null;
  private static cachedPublicKey: string | null = null;
  private static lastLicenseCheck: { result: LicenseValidationResult; ts: number } | null = null;
  private static readonly LICENSE_CHECK_TTL_MS = 60 * 1000; // 60 segundos

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
    if (!privateKeyPem || typeof privateKeyPem !== 'string' || !privateKeyPem.includes('PRIVATE KEY')) {
      const err: any = new Error('Falha Fiscal Crítica: Chave privada RSA não encontrada ou inválida para assinatura AGT.');
      err.code = 'ERR_FISCAL_PRIVATE_KEY_MISSING';
      throw err;
    }
    try {
      const signer = crypto.createSign('RSA-SHA1');
      signer.update(hashBase);
      return signer.sign(privateKeyPem, 'base64');
    } catch (cryptoErr: any) {
      const err: any = new Error(`Falha Fiscal Crítica ao assinar documento com RSA-SHA1: ${cryptoErr.message}`);
      err.code = 'ERR_FISCAL_SIGNATURE_FAILED';
      throw err;
    }
  }

  /**
   * Valida a assinatura de um documento contra a chave pública adequada (suporta histórico de rotação)
   */
  static async verifyDocumentSignature(
    hashBase: string,
    signatureBase64: string,
    signingDate?: Date
  ): Promise<{ valid: boolean; publicKeyUsed: string }> {
    try {
      const publicKey = signingDate
        ? await this.getPublicKeyForDate(signingDate)
        : (await this.getOrInitializeKeys()).publicKey;

      if (!publicKey) {
        return { valid: false, publicKeyUsed: '' };
      }

      const verifier = crypto.createVerify('RSA-SHA1');
      verifier.update(hashBase);
      const valid = verifier.verify(publicKey, signatureBase64, 'base64');
      return { valid, publicKeyUsed: publicKey };
    } catch (err) {
      console.error('❌ [FiscalSignature] Falha ao verificar assinatura:', err);
      return { valid: false, publicKeyUsed: '' };
    }
  }

  /**
   * Retorna a chave pública válida para a data de emissão especificada (consultando FiscalKeyHistory)
   */
  static async getPublicKeyForDate(signingDate: Date): Promise<string> {
    try {
      // Procurar no histórico se esta assinatura foi feita numa janela de chave anterior
      const historyRecord = await prisma.fiscalKeyHistory.findFirst({
        where: {
          createdAt: { lte: signingDate },
          rotatedAt: { gt: signingDate }
        },
        orderBy: { rotatedAt: 'asc' }
      });

      if (historyRecord) {
        return historyRecord.publicKey;
      }

      // Se não encontrou no histórico, usar a chave ativa atual
      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
      return settings?.publicKey || '';
    } catch (err) {
      console.warn('⚠️ [FiscalSignature] Erro ao consultar histórico de chaves para data:', err);
      const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
      return settings?.publicKey || '';
    }
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

    // 1. Tentar ler do Settings criptografado
    if (settings?.encryptedPrivateKey) {
      try {
        const decryptedKey = SafeVault.decrypt(settings.encryptedPrivateKey);
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

    // 3. Se ainda não existir chave, gerar um par RSA 2048-bit local e guardar encriptado no SafeVault
    console.log('🔐 [FiscalSignature] Gerando par de chaves RSA 2048-bit para emissão fiscal offline...');
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const encrypted = SafeVault.encrypt(privateKey);

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

    database.logAuditEvent('INITIAL_KEY_GENERATION', 'SYSTEM', { publicKey });

    return {
      privateKey,
      publicKey,
      swValidationNumber: settings?.softwareValidationNumber || DEFAULT_AGT_SOFTWARE_VALIDATION,
      companyNif: settings?.companyNif || DEFAULT_COMPANY_NIF,
      companyName: settings?.companyName || 'MINDGEST',
    };
  }

  /**
   * Rotação de Chaves RSA com persistência no histórico FiscalKeyHistory
   */
  static async rotateKeys(actorId?: string, reason?: string): Promise<{
    newPublicKey: string;
    rotatedAt: Date;
    previousPublicKey?: string;
  }> {
    console.log(`🔐 [FiscalSignature] Iniciando rotação de chaves RSA autorizada por ${actorId || 'SYSTEM'}...`);

    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
    const now = new Date();

    // 1. Guardar a chave pública atual no histórico
    if (settings?.publicKey) {
      await prisma.fiscalKeyHistory.create({
        data: {
          publicKey: settings.publicKey,
          createdAt: settings.lastSync || now,
          rotatedAt: now,
          rotatedBy: actorId || null,
          reason: reason || 'Rotação autorizada de chaves fiscais'
        }
      });
    }

    // 2. Gerar novo par RSA 2048-bit
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    const encryptedPrivateKey = SafeVault.encrypt(privateKey);

    // 3. Persistir nova chave em Settings
    await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: {
        encryptedPrivateKey,
        publicKey,
        lastSync: now
      },
      create: {
        id: 'singleton',
        encryptedPrivateKey,
        publicKey,
        lastSync: now
      }
    });

    // 4. Atualizar cache em memória
    this.cachedPrivateKey = privateKey;
    this.cachedPublicKey = publicKey;

    // 5. Registar evento de rotação no audit_log
    database.logAuditEvent('KEY_ROTATION', actorId || 'SYSTEM', {
      previousPublicKey: settings?.publicKey,
      newPublicKey: publicKey,
      reason
    });

    console.log('✅ [FiscalSignature] Rotação de chaves concluída com sucesso.');

    return {
      newPublicKey: publicKey,
      rotatedAt: now,
      previousPublicKey: settings?.publicKey || undefined
    };
  }

  /**
   * Executa o processo completo de assinatura fiscal de uma fatura com verificação redundante de licença
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
    // 1. Verificação redundante de licença com cache TTL de 60 segundos
    const now = Date.now();
    let licenseResult: LicenseValidationResult;
    if (this.lastLicenseCheck && (now - this.lastLicenseCheck.ts) < this.LICENSE_CHECK_TTL_MS) {
      licenseResult = this.lastLicenseCheck.result;
    } else {
      licenseResult = await validateOfflineLicense();
      this.lastLicenseCheck = { result: licenseResult, ts: now };
    }

    if (!licenseResult.valid) {
      const err: any = new Error(`Falha Fiscal Crítica: Emissão bloqueada por licença offline inválida (${licenseResult.reason || 'Não autorizada'}).`);
      err.code = 'ERR_LICENSE_INVALID';
      throw err;
    }

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
