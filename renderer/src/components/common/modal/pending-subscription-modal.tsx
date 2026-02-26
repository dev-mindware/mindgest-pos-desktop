"use client";

import { GlobalModal, Button, Icon } from "@/components";
import { useModal } from "@/stores/modal/use-modal-store";
import { useRouter } from "next/navigation";

export const PENDING_SUBSCRIPTION_MODAL_ID = "pending-subscription-modal";

export function PendingSubscriptionModal() {
  const { closeModal } = useModal();
  const router = useRouter();

  const handleCheckStatus = () => {
    closeModal(PENDING_SUBSCRIPTION_MODAL_ID);
    router.push("/settings?tab=subscription");
  };

  return (
    <GlobalModal
      id={PENDING_SUBSCRIPTION_MODAL_ID}
      title={
        <div className="flex items-center gap-2 text-yellow-600">
          <Icon name="Clock" className="w-5 h-5" />
          <span>Subscrição Pendente</span>
        </div>
      }
      description="Sua subscrição está em processo de verificação."
      canClose
      className="sm:max-w-md"
    >
      <div className="space-y-4 pt-2">
        <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 space-y-3">
          <div className="space-y-2 text-sm text-yellow-800 dark:text-yellow-200">
            <p>
              Sua subscrição actual está aguardando confirmação de pagamento ou aprovação administrativa.
            </p>
            <p>
              Enquanto isso, algumas funcionalidades do sistema podem estar limitadas.
              Assim que o processo for concluído, você receberá uma notificação e o acesso total será liberado.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => closeModal(PENDING_SUBSCRIPTION_MODAL_ID)}
            className="border-yellow-200 hover:bg-yellow-50 dark:border-yellow-800 dark:hover:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300"
          >
            Entendi
          </Button>
          <Button
            onClick={handleCheckStatus}
            className="gap-2 bg-yellow-600 hover:bg-yellow-700 text-white border-none"
          >
            <Icon name="FileText" className="w-4 h-4" />
            Ver Estado
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}
