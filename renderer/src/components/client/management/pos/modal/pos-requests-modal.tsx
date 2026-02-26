"use client";

import React from "react";
import {
  GlobalModal,
  Button,
  Icon,
  RequestError,
  PosRequestsSkeleton,
} from "@/components";
import { useModal } from "@/stores/modal/use-modal-store";
import { formatDateTime } from "@/utils";
import { useGetOpeningRequests } from "@/hooks/cash-session/use-cash-sessions";
import { CashSessionRequest } from "@/types/cash-session";

export function PosRequestsModal() {
  const { closeModal, open } = useModal();
  const isOpen = open["pos-requests"];

  const {
    data: openingRequests,
    isLoading,
    isError,
    refetch,
  } = useGetOpeningRequests({ status: "PENDING" });

  const handleClose = () => {
    closeModal("pos-requests");
  };

  if (!isOpen) return null;

  return (
    <GlobalModal
      id="pos-requests"
      title="Solicitações de Abertura"
      description="Gerencie os pedidos de abertura de caixa dos seus funcionários"
      canClose
      className="sm:max-w-[500px]"
    >
      <div className="pt-4 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <PosRequestsSkeleton />
          </div>
        ) : isError ? (
          <RequestError refetch={refetch} message="Erro ao carregar solicitações" />
        ) : (
          <>
            <div className="space-y-3">
              {openingRequests?.map((request: CashSessionRequest) => (
                <div
                  key={request.id}
                  className={`p-4 flex items-start gap-4 hover:bg-muted/10 transition-colors cursor-pointer rounded-xl border border-muted-foreground/10`}
                >
                  <div className="flex items-center justify-center shrink-0 w-10 h-10 border rounded-lg bg-primary/10 border-primary/5">
                    <Icon name="LayoutGrid" className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-semibold text-foreground">
                          {request.userName}
                        </h4>
                        <p className="text-[12px] font-medium leading-tight text-muted-foreground line-clamp-2">
                          {request.message}
                        </p>
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground whitespace-nowrap pt-0.5">
                        {formatDateTime(request.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="text-xs">
                        Aprovar
                      </Button>
                      <Button size="sm" variant="ghost" className="text-xs">
                        Recusar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {(!openingRequests || openingRequests.length === 0) && (
              <div className="py-12 space-y-3 text-center">
                <div className="flex items-center justify-center w-12 h-12 mx-auto rounded-full bg-muted opacity-20">
                  <Icon name="Inbox" className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">
                  Nenhuma solicitação pendente
                </p>
              </div>
            )}
          </>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={handleClose}>
            Fechar
          </Button>
        </div>
      </div>
    </GlobalModal>
  );
}
