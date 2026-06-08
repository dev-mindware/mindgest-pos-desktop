import { SucessMessage } from "@/utils/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { invoiceReceiptService } from "@/services/invoice-receipt-service";
import { InvoiceReceiptPayload } from "@/types";
import { useNetworkStatus } from "../common/use-network-status";
import { useAuth } from "../auth/use-auth";

type CreateInvoiceReceiptResult =
  | {
    offline: false;
    data: any;
    status: number;
    statusText: string;
    localId?: string;
    localPayload?: any;
  }
  | {
    offline: true;
    syncPending: true;
    localId?: string;
    localPayload?: any;
    data?: any; // Allow data to include invoiceNumber for PDF generation
    error?: string;
    status?: undefined;
    statusText?: undefined;
  };

async function resolveClientCloudId(client: any): Promise<string | null> {
  if (!client?.id || typeof window === "undefined" || !window.ipc?.db?.getClientCloudId) {
    return null;
  }

  try {
    const cloudId = await window.ipc.db.getClientCloudId({
      id: client.id,
      taxNumber: client.taxNumber || client.taxNumber,
      email: client.email,
    });
    return cloudId || null;
  } catch (error) {
    console.warn("⚠️ [Receipt] Falha ao resolver cloudId do cliente:", error);
    return null;
  }
}

function buildCloudClientPayload(client: any, cloudId: string | null) {
  const name = client?.name?.trim();
  const hasCloudId = Boolean(cloudId);
  if (!hasCloudId && !name) {
    return undefined;
  }

  const payload: any = {};
  if (hasCloudId) payload.id = cloudId;
  if (name) payload.name = name;
  if (client.phone?.trim()) payload.phone = client.phone.trim();
  if (client.email?.trim()) payload.email = client.email.trim();
  if (client.address?.trim()) payload.address = client.address.trim();
  const taxNumber = client.taxNumber?.trim() || client.taxNumber?.trim();
  if (taxNumber) payload.taxNumber = taxNumber;
  return payload;
}

async function buildCloudInvoicePayload(data: InvoiceReceiptPayload) {
  const clientCloudId = data.client ? await resolveClientCloudId(data.client as any) : null;
  const client = data.client ? buildCloudClientPayload(data.client as any, clientCloudId) : undefined;

  const items = await Promise.all(
    (data.items || []).map(async (item: any) => {
      let id = item.id;
      if (typeof window !== "undefined" && window.ipc?.db?.getItemCloudId && item.id) {
        try {
          id = await window.ipc.db.getItemCloudId(item.id);
        } catch (error) {
          console.warn("⚠️ [Receipt] Falha ao resolver cloudId do item:", error);
        }
      }
      return { ...item, id };
    }),
  );

  const { documentType, ...restData } = data as any; // Exclude documentType if it exists, as cloud API might not expect it

  const payload: any = {
    ...restData,
    items,
  };

  if (client) {
    payload.client = client;
  } else {
    delete payload.client;
  }

  return payload;
}

export function useCreateInvoiceReceipt() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { isOnline } = useNetworkStatus();

  return useMutation<CreateInvoiceReceiptResult, unknown, InvoiceReceiptPayload>({
    mutationFn: async (data: InvoiceReceiptPayload) => {
      if (!user?.id) {
        throw new Error("Usuário não autenticado para criar a factura.");
      }

      console.log("📝 [Receipt] Criar factura recibo. Online:", isOnline);
      console.log("📝 [Receipt] Payload items:", data.items?.map((i: any) => ({ id: i.id, cloudId: i.cloudId, qty: i.quantity })));

      if (isOnline) {
        // 1. When online, send directly to cloud first
        try {
          const cloudPayload = await buildCloudInvoicePayload(data);
          console.log("🌐 [Receipt] Enviando para cloud...", JSON.stringify(cloudPayload, null, 2));
          const cloudResponse = await invoiceReceiptService.createInvoiceReceipt(cloudPayload);
          console.log("✅ [Receipt] Factura enviada para cloud com sucesso");

          return {
            offline: false,
            data: cloudResponse.data,
            status: cloudResponse.status,
            statusText: cloudResponse.statusText,
          };
        } catch (cloudError: any) {
          console.error("❌ [Receipt] Erro ao criar factura na cloud:", cloudError);
          const message = cloudError?.response?.data?.message || cloudError?.message || "Falha ao criar factura online.";
          throw new Error(message);
        }
      }

      // 2. Offline path: save locally and keep pending sync
      if (typeof window !== "undefined" && window.ipc?.sync?.createInvoice) {
        const storeId = data.storeId || (user as any)?.store?.id || (user as any)?.storeId || "";
        try {
          const localSaveResult = await window.ipc.sync.createInvoice({
            invoiceData: data,
            storeId,
            userId: user.id,
            user: {
              id: user.id,
              name: user.name,
              email: user.email,
              role: user.role,
              storeId: user.storeId || (user as any)?.store?.id,
            },
          });

          const localId = localSaveResult?.data?.id || localSaveResult?.id;
          console.log(localSaveResult)
          console.log("📱 [Receipt] Offline - factura salva localmente", { localId });

          return {
            offline: true,
            syncPending: true,
            localId,
            data: { invoiceNumber: localSaveResult.data.localNo || localSaveResult.data.invoice.agtNo, ...data },
          };
        } catch (localError: any) {
          console.error("❌ [Receipt] Erro ao salvar localmente offline:", localError);
          const message = localError?.message || "Falha ao salvar factura localmente.";
          throw new Error(message);
        }
      }

      throw new Error("Não foi possível salvar a factura localmente em modo offline.");
    },
    onSuccess: (response) => {
      const isOffline = (response as any)?.offline;
      const isSyncPending = (response as any)?.syncPending;

      if (isOffline && isSyncPending) {
        SucessMessage("Factura Recibo salva localmente e será sincronizada quando online!");
      } else if (isOffline) {
        SucessMessage("Factura Recibo salva localmente!");
      } else {
        SucessMessage("Factura Recibo criada e enviada com sucesso!");
      }

      queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
    },
  });
}
