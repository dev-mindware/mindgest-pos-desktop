import { SucessMessage } from "@/utils/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { receiptService } from "@/services/receipt-service";
import { ReceiptFormData } from "@/schemas";

type Data = {
  data: ReceiptFormData;
};

export function useGenerateReceipt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: Data) => receiptService.generateReceipt(data),
    onSuccess: () => {
      SucessMessage("Recibo gerado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invoice-normal"] });
      queryClient.invalidateQueries({ queryKey: ["receipts"] });
    },
  });
}
