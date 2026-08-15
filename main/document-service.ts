import axios from 'axios';
import { prisma } from './prisma';
import { LOCAL_DOC_GENERATOR_URL, SidecarManager } from './sidecar-manager';
import { DEFAULT_AGT_SOFTWARE_VALIDATION, DEFAULT_COMPANY_NIF } from './fiscal-signature';

export interface LocalPdfOptions {
  layout?: 'a4' | 'thermal';
}

export class LocalDocumentService {
  /**
   * Constrói o payload completo a partir do SQLite e gera o PDF via microserviço local
   */
  static async generateInvoicePdf(
    invoiceId: string,
    options: LocalPdfOptions = { layout: 'a4' }
  ): Promise<{ buffer: Buffer; base64: string; fileName: string; contentType: string }> {
    // 1. Garantir que o microserviço local está em execução
    const isHealthy = await SidecarManager.isHealthy();
    if (!isHealthy) {
      console.log('🔄 [LocalDocService] Microserviço não está ativo. Iniciando sidecar...');
      await SidecarManager.start();
    }

    // 2. Buscar documento completo no SQLite
    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [{ id: invoiceId }, { localNo: invoiceId }, { agtNo: invoiceId }],
      },
      include: {
        client: true,
        user: true,
        lines: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!invoice) {
      throw new Error(`Fatura com ID/Número '${invoiceId}' não foi encontrada na base de dados local.`);
    }

    // 3. Obter dados da empresa / settings
    const settings = await prisma.settings.findUnique({ where: { id: 'singleton' } });
    const companyName = settings?.companyName || 'MINDGEST POS';
    const companyNif = settings?.companyNif || DEFAULT_COMPANY_NIF;
    const swValidationNumber = settings?.softwareValidationNumber || DEFAULT_AGT_SOFTWARE_VALIDATION;

    // 4. Mapear tipo de documento
    let docType = 'INVOICE_RECEIPT';
    const docNo = invoice.agtNo || invoice.localNo;
    if (docNo.startsWith('FT')) docType = 'NORMAL_INVOICE';
    else if (docNo.startsWith('PP')) docType = 'PROFORMA_INVOICE';
    else if (docNo.startsWith('NC')) docType = 'CREDIT_NOTE';
    else if (docNo.startsWith('RC')) docType = 'RECEIPT';

    // 5. Estruturar itens
    const items = invoice.lines.map((line) => ({
      description: line.item?.name || 'Artigo sem descrição',
      quantity: line.quantity,
      unitPrice: line.unitPrice,
      totalPrice: line.grossTotal,
      tax: line.taxPercent,
    }));

    // 6. Montar payload esperado pelo FastAPI ReportLab
    const payload = {
      documentType: docType,
      format: 'pdf',
      invoiceNumber: docNo,
      invoiceDate: invoice.issueDate.toISOString(),
      company: {
        name: companyName,
        address: 'Angola',
        taxNumber: companyNif,
        email: 'info@empresa.ao',
        phone: '+244 900 000 000',
        website: 'www.mindgest.ao',
      },
      client: {
        name: invoice.client?.name || 'Consumidor Final',
        address: invoice.client?.address || 'Angola',
        taxNumber: invoice.client?.nif || 'Consumidor Final',
        email: invoice.client?.email || null,
        phone: invoice.client?.phone || null,
      },
      items,
      subtotal: invoice.netTotal,
      tax: invoice.taxTotal,
      total: invoice.grossTotal,
      qrCode: invoice.qrCode || null,
      hash: invoice.hash || null,
      notes: `Processado por programa validado nº ${swValidationNumber}`,
      operatorName: invoice.user?.name || 'Operador de Caixa',
      metadata: {
        layout: options.layout || 'a4',
        swValidationNumber,
        hashControl: invoice.hashControl,
        isOffline: true,
      },
    };

    console.log(`📄 [LocalDocService] Enviando requisição para ${LOCAL_DOC_GENERATOR_URL}/generate-document/download (Layout: ${options.layout || 'a4'})...`);

    const response = await axios.post(`${LOCAL_DOC_GENERATOR_URL}/generate-document/download`, payload, {
      responseType: 'arraybuffer',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    const buffer = Buffer.from(response.data);
    const base64 = buffer.toString('base64');
    const safeDocNo = docNo.replace(/[/\\?%*:|"<>]/g, '_');
    const fileName = `${docType}_${safeDocNo}.pdf`;

    console.log(`✅ [LocalDocService] PDF gerado com sucesso! Tamanho: ${buffer.length} bytes`);

    return {
      buffer,
      base64,
      fileName,
      contentType: 'application/pdf',
    };
  }
}
