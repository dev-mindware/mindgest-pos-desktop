import { Button } from "@/components/ui";
import { useModal } from "@/stores";

export function ButtonAddClient() {
  const { openModal } = useModal();

  return (
    <Button
      onClick={() => openModal("add-client")}
      variant="default"
      className="w-full sm:w-auto text-sm sm:text-base"
    >
      Novo Cliente
    </Button>
  );
}
