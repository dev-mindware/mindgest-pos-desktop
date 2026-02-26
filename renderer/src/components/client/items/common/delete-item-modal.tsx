import { useDeleteItem } from "@/hooks";
import { Button, GlobalModal } from "@/components";
import { currentProductStore } from "@/stores";
import { useModal } from "@/stores/modal/use-modal-store";
import { ErrorMessage } from "@/utils/messages";

export function DeleteItemModal({ type }: { type: string }) {
  const { closeModal, open } = useModal();
  const isOpen = open["delete-item"];
  const { currentProduct } = currentProductStore();
  const { mutateAsync: deleteItemMutate, isPending } = useDeleteItem();

  async function handleDelete(id: string) {
    if (!currentProduct) return;
    try {
      await deleteItemMutate(id);
      closeModal("delete-product");
    } catch (error: any) {
      if (error?.response) {
        ErrorMessage(
          error.response.data.message || "Erro ao apagar o produto."
        );
      } else {
        ErrorMessage("Ocorreu um erro desconhecido. Tente novamente.");
      }
    }
  }

  if (!isOpen) return null;

  return (
    <GlobalModal
      warning
      canClose
      className="!w-max"
      id="delete-item"
      title={`Tem certeza que deseja apagar o ${type}?`}
      description="Lembre-se que esta ação não pode ser desfeita."
    >
      <div className="flex justify-end gap-4">
        <Button onClick={() => closeModal("delete-item")} variant="outline">
          Cancelar
        </Button>
        <Button
          disabled={isPending}
          variant="destructive"
          onClick={() => handleDelete(currentProduct?.id!)}
        >
          {isPending ? "Apagando..." : `Apagar ${type}`}
        </Button>
      </div>
    </GlobalModal>
  );
}
