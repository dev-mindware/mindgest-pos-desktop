"use client";
import { useModal } from "@/stores/modal/use-modal-store";
import {
  Icon,
  Button,
  DetailRow,
  GlobalModal,
  ItemStatusBadge,
} from "@/components";
import { currentServiceStore } from "@/stores";
import { formatDateTime, formatPrice } from "@/utils";

export function DetailsServiceModal() {
  const { closeModal, open } = useModal();
  const isOpen = open["view-service"];
  const { currentService } = currentServiceStore();

  if (!currentService || !isOpen) return null;

  return (
    <GlobalModal
      canClose
      id="view-service"
      title={
        <>
          <div className="flex items-center justify-center mx-auto rounded-full w-20 h-20 bg-primary/10">
            <Icon name="Store" className="w-10 h-10 text-primary" />
          </div>

          <div className="text-center space-y-1 mt-4">
            <h2 className="text-2xl font-bold">{currentService.name}</h2>
            <div className="flex items-center justify-center gap-2">
              {currentService.category && (
                <span className="text-xs text-muted-foreground">
                  SKU: {currentService.sku}
                </span>
              )}
              <ItemStatusBadge status={currentService.status} />
            </div>
          </div>
        </>
      }
      className="!max-h-[85vh] w-full max-w-md"
      footer={
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => closeModal("view-service")}>
            Fechar
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        {(currentService.description || currentService.category) && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">
              Informações Gerais
            </h3>
            <DetailRow label="Descrição" value={currentService.description} />
            <DetailRow
              label="Código de Barras"
              value={currentService.barcode}
            />
            <DetailRow label="Categoria" value={currentService.category} />
            <DetailRow label="Tipo" value="Serviço" />
          </section>
        )}

        {(currentService.price || currentService.cost) && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">Valores</h3>
            <DetailRow
              label="Preço de Venda"
              value={
                currentService.price
                  ? formatPrice(currentService.price)
                  : undefined
              }
            />
            <DetailRow
              label="Preço de Compra"
              value={
                currentService.cost
                  ? formatPrice(currentService.cost)
                  : undefined
              }
            />
          </section>
        )}

        {(currentService.company ||
          currentService.createdAt ||
          currentService.updatedAt) && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">
              Informações Técnicas
            </h3>
            <DetailRow label="Loja" value={currentService.storeId} />
            <DetailRow
              label="Criado em"
              value={formatDateTime(currentService.createdAt)}
            />
          </section>
        )}
      </div>
    </GlobalModal>
  );
}
