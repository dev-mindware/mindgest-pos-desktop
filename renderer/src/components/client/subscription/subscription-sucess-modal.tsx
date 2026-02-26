"use client";
import { useModal } from "@/stores";
import { Button } from "@/components/ui";
import { GlobalModal } from "@/components/modal";
import { Icon } from "@/components/common";
import { useRouter } from "next/navigation";

export function SubscriptionSucessModal() {
  const router = useRouter();
  const { closeModal } = useModal();

  function handleClose() {
    closeModal("subscription-sucess");
    router.push("/settings?tab=subscription");
  }

  return (
    <GlobalModal
      sucess
      canClose={false}
      id="subscription-created"
      className="!w-lg text-center"
      title="Assinatura criada com sucesso"
      description={<>
        <span className="text-sm text-muted-foreground">
          Parabéns! Sua assinatura foi efectuada com sucesso. <br /> Você receberá
          uma notificação assim que estiver tudo liberado.
        </span>
      </>}
    >
      <div className="flex flex-col items-center justify-center pt-2 space-y-4">
        <div className="w-full">
          <Button
            onClick={handleClose}
            className="w-full bg-primary hover:bg-primary/90 font-semibold"
          >
            Fechar
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}
