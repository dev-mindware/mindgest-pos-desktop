import { SucessMessage } from "@/utils/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { proformaService } from "@/services";
import { EditProformaFormData, ProformaFormData } from "@/schemas";
import { ProformData } from "@/types";
import { useNetworkStatus } from "../common/use-network-status";
import { useAuth } from "../auth/use-auth";
import { currentStoreStore } from "@/stores";

async function resolveClientCloudId(client: any): Promise<string | null> {
  if (
    !client?.id ||
    typeof window === "undefined" ||
    !window.ipc?.db?.getClientCloudId
  ) {
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
    console.warn("⚠️ [Proforma] Falha ao resolver cloudId do cliente:", error);
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

async function buildCloudProformaPayload(data: ProformData) {
  const clientCloudId = data.client
    ? await resolveClientCloudId(data.client as any)
    : null;
  const client = data.client
    ? buildCloudClientPayload(data.client as any, clientCloudId)
    : undefined;

  const items = await Promise.all(
    (data.items || []).map(async (item: any) => {
      let id = item.id;
      if (
        typeof window !== "undefined" &&
        window.ipc?.db?.getItemCloudId &&
        item.id
      ) {
        try {
          id = await window.ipc.db.getItemCloudId(item.id);
        } catch (error) {
          console.warn(
            "⚠️ [Proforma] Falha ao resolver cloudId do item:",
            error,
          );
        }
      }
      return { ...item, id };
    }),
  );

  const { documentType, ...restData } = data as any;

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

export function useDeleteProforma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => proformaService.deleteProforma(id),
    onSuccess: () => {
      SucessMessage("Proforma deletada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
    },
  });
}

export function useCreateProforma() {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkStatus();
  const { user } = useAuth();
  const { currentStore } = currentStoreStore();

  return useMutation({
    mutationFn: async (data: ProformData) => {
      if (!isOnline) {
        if (typeof window !== "undefined" && window.ipc?.sync?.createProforma) {
          const store = data.store?.id || (user as any)?.store || currentStore;
          const proformaResult = await window.ipc.sync.createProforma({
            proformaData: data,
            store,
            user: user || null,
          });

          console.log(proformaResult);

          // Extract proforma number from response (cloud-synchronized format: "FP {seriesCode}/{sequence}")
          const proformaNumber =
            proformaResult?.data?.proformaNumber ||
            proformaResult?.data?.number ||
            "PENDENTE OFFLINE";

          return {
            offline: true,
            data: { invoiceNumber: proformaNumber, proformaNumber, ...data },
            localId: proformaResult?.data?.id || proformaResult?.id,
          };
        }
        throw new Error("Sistema offline não inicializado.");
      }
      // When online, build payload with resolved cloudIds (same as invoice receipt)
      const cloudPayload = await buildCloudProformaPayload(data);
      console.log("🌐 [Proforma] Creating proforma online with data:");
      console.log(cloudPayload);
      const axiosResponse = await proformaService.createProforma(cloudPayload);

      // Log full response for debugging
      console.log(
        "🌐 [Proforma] Full axios response:",
        JSON.stringify(axiosResponse, null, 2),
      );
      console.log(
        "🌐 [Proforma] Response.data:",
        JSON.stringify(axiosResponse?.data, null, 2),
      );

      // Return in same format as offline for consistency
      return {
        offline: false,
        data: axiosResponse?.data,
        status: axiosResponse?.status,
        statusText: axiosResponse?.statusText,
      };
    },
    onSuccess: (response) => {
      const isOffline = (response as any)?.offline;
      SucessMessage(
        isOffline
          ? "Proforma salva localmente com sucesso!"
          : "Proforma criada com sucesso!",
      );
      queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
    },
  });
}

export function useEditProforma() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: EditProformaFormData }) =>
      proformaService.updateProforma(id, data),
    onSuccess: () => {
      SucessMessage("Proforma editada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-proforma"] });
    },
  });
}
