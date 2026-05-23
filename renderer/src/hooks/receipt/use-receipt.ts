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
    }
  | {
      offline: true;
      syncPending: true;
      error?: string;
      data?: undefined;
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
      nif: client.taxNumber || client.nif,
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
  const taxNumber = client.taxNumber?.trim() || client.nif?.trim();
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

  const payload: any = {
    ...data,
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
        throw new Error("Usuário não autenticado para criar a fatura.");
      }

      console.log("📝 [Receipt] Criar fatura recibo. Online:", isOnline);
      console.log("📝 [Receipt] Payload items:", data.items?.map((i: any) => ({ id: i.id, cloudId: i.cloudId, qty: i.quantity })));

      // 1. Always save locally first (online or offline)
      if (typeof window !== "undefined" && window.ipc?.sync?.createInvoice) {
        const storeId = data.storeId || (user as any)?.store?.id || (user as any)?.storeId || "";
        try {
          await window.ipc.sync.createInvoice({
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
          console.log("✅ [Receipt] Fatura salva localmente");
        } catch (localError) {
          console.error("❌ [Receipt] Erro ao salvar localmente:", localError);
          throw localError;
        }
      }

      // 2. If online, send immediately to cloud
      if (isOnline) {
        try {
          const cloudPayload = await buildCloudInvoicePayload(data);
          console.log("🌐 [Receipt] Enviando para cloud...", JSON.stringify(cloudPayload, null, 2));
          const cloudResponse = await invoiceReceiptService.createInvoiceReceipt(cloudPayload);
          console.log("✅ [Receipt] Fatura enviada para cloud com sucesso");
          return {
            offline: false,
            data: cloudResponse.data,
            status: cloudResponse.status,
            statusText: cloudResponse.statusText,
          };
        } catch (cloudError: any) {
          console.warn("⚠️ [Receipt] Falha ao enviar para cloud, mas fatura foi salva localmente:", cloudError?.message);
          // Continue even if cloud fails - invoice is local and will sync later
          return { offline: true, syncPending: true, error: cloudError?.message };
        }
      } else {
        console.log("📱 [Receipt] Offline - fatura salva localmente, será sincronizada depois");
        return { offline: true, syncPending: true };
      }
    },
    onSuccess: (response) => {
      const isOffline = (response as any)?.offline;
      const isSyncPending = (response as any)?.syncPending;
      
      if (isOffline && isSyncPending) {
        SucessMessage("Fatura Recibo salva localmente e será sincronizada quando online!");
      } else if (isOffline) {
        SucessMessage("Fatura Recibo salva localmente!");
      } else {
        SucessMessage("Fatura Recibo criada e enviada com sucesso!");
      }
      
      queryClient.invalidateQueries({ queryKey: ["invoice-receipt"] });
    },
  });
}
