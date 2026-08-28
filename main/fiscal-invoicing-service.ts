import crypto from "crypto";
import { prisma } from "./prisma";
import { FiscalSignatureService } from "./fiscal-signature";

export interface CreateInvoiceParams {
  invoiceData: {
    id?: string;
    items: Array<{
      id: string;
      name?: string;
      quantity?: number;
      qty?: number;
      price?: number;
      unitPrice?: number;
      discount?: number;
      taxRate?: number;
      tax?: number;
    }>;
    documentType?: string;
    storeId?: string;
    clientId?: string;
    issueDate?: string | Date;
    idempotencyKey?: string;
    [key: string]: any;
  };
  storeId?: string;
  userId?: string;
  terminalId?: string;
  terminalName?: string;
  idempotencyKey?: string;
}

export interface InvoicingResult {
  id: string;
  localNo: string;
  agtNo: string;
  hash: string;
  hashControl: string;
  qrCode: string;
  swValidationNumber?: string;
  netTotal: number;
  taxTotal: number;
  grossTotal: number;
  offline: boolean;
  source: string;
  idempotentReplay?: boolean;
}

// FIFO Mutex Promise Queue for Interleaved Single-Series Invoicing with Busy Retry
let invoiceQueue = Promise.resolve();

export async function enqueueInvoiceTask<T>(task: () => Promise<T>, maxRetries = 3): Promise<T> {
  const executeWithRetry = async (): Promise<T> => {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await task();
      } catch (err: any) {
        attempt++;
        const isBusy =
          err?.message?.includes('SQLITE_BUSY') ||
          err?.code === 'P2034' ||
          err?.message?.includes('database is locked');
        if (isBusy && attempt < maxRetries) {
          const jitter = Math.floor(Math.random() * 150) + 150 * attempt;
          console.warn(
            `⏳ [SQLite WAL] Base de dados ocupada (SQLITE_BUSY). Tentativa ${attempt}/${maxRetries} em ${jitter}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, jitter));
        } else {
          throw err;
        }
      }
    }
    throw new Error('Tempo limite excedido na fila de faturação (SQLITE_BUSY).');
  };

  const currentTask = invoiceQueue.then(executeWithRetry, executeWithRetry);
  invoiceQueue = currentTask.then(
    () => {},
    () => {}
  );
  return currentTask;
}

export class FiscalInvoicingService {
  /**
   * Processa a criação atómica e encadeada de fatura fiscal AGT
   */
  static async processInvoice(params: CreateInvoiceParams): Promise<InvoicingResult> {
    const { invoiceData, storeId, userId, terminalId, terminalName } = params;

    if (!invoiceData || !invoiceData.items || !invoiceData.items.length) {
      throw new Error('Dados da fatura ou itens inválidos.');
    }

    const documentType = invoiceData.documentType || 'FT';
    const storeIdLocal = storeId || invoiceData.storeId || 'DEFAULT_STORE';
    const idempotencyKey = params.idempotencyKey || invoiceData.idempotencyKey;

    // 🛡️ 1. Idempotência: Verificar se a fatura já foi processada
    if (idempotencyKey) {
      const existingInvoice = await prisma.invoice.findUnique({
        where: { idempotencyKey },
      });

      if (existingInvoice) {
        console.log(`⚡ [Idempotency] Fatura já processada para idempotencyKey: ${idempotencyKey}`);
        return {
          id: existingInvoice.id,
          localNo: existingInvoice.localNo,
          agtNo: existingInvoice.agtNo || "",
          hash: existingInvoice.hash || "",
          hashControl: existingInvoice.hashControl || "",
          qrCode: existingInvoice.qrCode || "",
          netTotal: existingInvoice.netTotal,
          taxTotal: existingInvoice.taxTotal,
          grossTotal: existingInvoice.grossTotal,
          idempotentReplay: true,
          offline: true,
          source: 'LAN_MASTER',
        };
      }
    }

    // 2. Obter série ativa para o tipo de documento
    const seriesRow = await prisma.agtSeries.findFirst({
      where: {
        storeId: storeIdLocal,
        documentType,
        isActive: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!seriesRow) {
      throw new Error(`Não existe série fiscal ativa no Master para o tipo de documento ${documentType}.`);
    }

    // 3. Fila Serializada FIFO de Faturação
    return await enqueueInvoiceTask(async () => {
      // Ativar PRAGMA synchronous = FULL no início da transação fiscal para proteção contra cortes
      try {
        await prisma.$executeRawUnsafe(`PRAGMA synchronous = FULL;`);
      } catch {}

      try {
        return await prisma.$transaction(async (tx) => {
          // A. Validar stock de todos os itens antes de abater
          for (const item of invoiceData.items) {
            const dbItem = await tx.item.findUnique({ where: { id: item.id } });
            if (!dbItem) {
              throw new Error(`Item ${item.name || item.id} não encontrado na base de dados do Master.`);
            }
            const requestedQty = Number(item.quantity || item.qty || 1);
            if (dbItem.stock < requestedQty) {
              throw new Error(
                `Stock insuficiente para o artigo "${dbItem.name}". Disponível: ${dbItem.stock}, Solicitado: ${requestedQty}`
              );
            }
          }

          // B. Calcular Totais
          let calculatedNetTotal = 0;
          let calculatedTaxTotal = 0;

          for (const item of invoiceData.items) {
            const qty = Number(item.quantity || item.qty || 1);
            const price = Number(item.price || item.unitPrice || 0);
            const discount = Number(item.discount || 0);
            const itemNet = price * qty - discount;
            const taxRate = Number(item.taxRate || item.tax || 0.14);
            const itemTax = itemNet * taxRate;

            calculatedNetTotal += itemNet;
            calculatedTaxTotal += itemTax;
          }

          const calculatedGrossTotal = calculatedNetTotal + calculatedTaxTotal;
          const nextSequence = (seriesRow.currentSequence || 0) + 1;
          const seriesCode = seriesRow.seriesCode;
          const localAgtNo = `${documentType} ${seriesCode}/${nextSequence}`;
          const issueDate = invoiceData.issueDate ? new Date(invoiceData.issueDate) : new Date();

          // 🛡️ REQUISITO AGT: lastHash SEMPRE lido do disco SQLite
          const lastConfirmedInvoice = await tx.invoice.findFirst({
            where: { storeId: storeIdLocal, status: "VALID" },
            orderBy: { createdAt: 'desc' },
            select: { hash: true },
          });
          const previousHash = lastConfirmedInvoice?.hash || seriesRow.lastHash || '';

          // C. Assinatura Digital RSA-SHA1 AGT
          const signatureResult = await FiscalSignatureService.signInvoice({
            docNo: localAgtNo,
            issueDate,
            grossTotal: calculatedGrossTotal,
            taxTotal: calculatedTaxTotal,
            previousHash,
          });

          // D. Atualizar a série AGT atómica com o novo número e o hash encadeado
          await tx.agtSeries.update({
            where: { id: seriesRow.id },
            data: {
              currentSequence: nextSequence,
              lastDocumentNo: localAgtNo,
              lastHash: signatureResult.hash,
            },
          });

          // E. Abater Stock
          for (const item of invoiceData.items) {
            const requestedQty = Number(item.quantity || item.qty || 1);
            await tx.item.update({
              where: { id: item.id },
              data: { stock: { decrement: requestedQty } },
            });
          }

          const invoiceId = invoiceData.id || crypto.randomUUID();
          const localNo = `LOCAL-${Date.now()}`;

          // F. Inserir Fatura
          const createdInvoice = await tx.invoice.create({
            data: {
              id: invoiceId,
              localNo,
              agtNo: localAgtNo,
              idempotencyKey: idempotencyKey || null,
              terminalId: terminalId || null,
              terminalName: terminalName || null,
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
              userId: userId || 'MASTER_USER',
              clientId: invoiceData.clientId || null,
              storeId: storeIdLocal,
            },
          });

          // G. Inserir Linhas da Fatura
          for (let i = 0; i < invoiceData.items.length; i++) {
            const item = invoiceData.items[i];
            const qty = Number(item.quantity || item.qty || 1);
            const price = Number(item.price || item.unitPrice || 0);
            const discount = Number(item.discount || 0);
            const net = price * qty - discount;
            const taxRate = Number(item.taxRate || item.tax || 0.14);
            const tax = net * taxRate;

            await tx.invoiceLine.create({
              data: {
                id: crypto.randomUUID(),
                invoiceId: createdInvoice.id,
                itemId: item.id || crypto.randomUUID(),
                quantity: qty,
                unitPrice: price,
                discount,
                taxPercent: taxRate * 100,
                netTotal: net,
                grossTotal: net + tax,
              },
            });
          }

          // H. Inserir no Outbox do Master para envio posterior à Cloud
          await tx.syncOutbox.create({
            data: {
              entityType: "INVOICE",
              entityId: createdInvoice.id,
              action: "CREATE",
              storeId: storeIdLocal,
              payload: JSON.stringify({
                ...invoiceData,
                id: createdInvoice.id,
                agtNo: localAgtNo,
                idempotencyKey,
                hash: signatureResult.hash,
                hashControl: signatureResult.hashControl,
                qrCode: signatureResult.qrCode,
                swValidationNumber: signatureResult.swValidationNumber,
                systemEntryDate: signatureResult.systemEntryDate,
                netTotal: calculatedNetTotal,
                taxTotal: calculatedTaxTotal,
                grossTotal: calculatedGrossTotal,
              }),
              status: "PENDING",
            },
          });

          return {
            id: createdInvoice.id,
            localNo: createdInvoice.localNo,
            agtNo: localAgtNo,
            hash: signatureResult.hash,
            hashControl: signatureResult.hashControl,
            qrCode: signatureResult.qrCode,
            swValidationNumber: signatureResult.swValidationNumber,
            netTotal: calculatedNetTotal,
            taxTotal: calculatedTaxTotal,
            grossTotal: calculatedGrossTotal,
            offline: true,
            source: 'LAN_MASTER',
          };
        });
      } finally {
        // Restaurar modo síncrono NORMAL para as leituras subsequentes
        try {
          await prisma.$executeRawUnsafe(`PRAGMA synchronous = NORMAL;`);
        } catch {}
      }
    });
  }
}
