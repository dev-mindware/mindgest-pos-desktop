"use client";
import { currentProductStore } from "@/stores";
import { useModal } from "@/stores/modal/use-modal-store";
import { formatDateTime, formatPrice } from "@/utils";
import {
  Button,
  DetailRow,
  GlobalModal,
  Icon,
  ItemStatusBadge,
} from "@/components";

export function DetailsProductModal() {
  const { closeModal, open } = useModal();
  const isOpen = open["view-product"];
  const { currentProduct } = currentProductStore();

  if (!currentProduct || !isOpen) return null;

  return (
    <GlobalModal
      canClose
      id="view-product"
      title={
        <>
          <div className="flex items-center justify-center w-20 h-20 mx-auto rounded-full bg-primary/10">
            <Icon name="Package" className="w-10 h-10 text-primary" />
          </div>

          <div className="mt-4 space-y-1 text-center">
            <h2 className="text-2xl font-bold">{currentProduct.name}</h2>
            <div className="flex items-center justify-center gap-2">
              {currentProduct.sku && (
                <span className="text-xs text-muted-foreground">
                  SKU: {currentProduct.sku}
                </span>
              )}
              <ItemStatusBadge status={currentProduct.status} />
            </div>
          </div>
        </>
      }
      className="!max-h-[85vh] w-full max-w-md"
      footer={
        <div className="flex justify-end">
          <Button variant="outline" onClick={() => closeModal("view-product")}>
            Fechar
          </Button>
        </div>
      }
    >
      <div className="space-y-6 text-sm">
        {(currentProduct.description ||
          currentProduct.barcode ||
          currentProduct.category ||
          currentProduct.unit ||
          currentProduct.type) && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">
              Informações Gerais
            </h3>
            <DetailRow label="Descrição" value={currentProduct.description} />
            <DetailRow
              label="Código de Barras"
              value={currentProduct.barcode}
            />
            <DetailRow label="Categoria" value={currentProduct.category} />
            <DetailRow label="Unidade" value={currentProduct.unit} />
            <DetailRow
              label="Tipo"
              value={currentProduct.type == "PRODUCT" ? "Produto" : "Serviço"}
            />
          </section>
        )}

        {(currentProduct.price || currentProduct.cost) && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">Valores</h3>
            <DetailRow
              label="Preço de Venda"
              value={
                currentProduct.price
                  ? formatPrice(currentProduct.price)
                  : undefined
              }
            />
            <DetailRow
              label="Preço de Compra"
              value={
                currentProduct.cost
                  ? formatPrice(currentProduct.cost)
                  : undefined
              }
            />
          </section>
        )}

        {(currentProduct.minStock || currentProduct.maxStock) && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">Estoque</h3>
            <DetailRow label="Estoque Mínimo" value={currentProduct.minStock} />
            <DetailRow label="Estoque Máximo" value={currentProduct.maxStock} />
          </section>
        )}

        {(currentProduct.weight || currentProduct.dimensions) && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">Medidas</h3>
            <DetailRow label="Peso" value={currentProduct.weight} />
            <DetailRow label="Dimensões" value={currentProduct.dimensions} />
          </section>
        )}

        {currentProduct.hasExpiry && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">Validade</h3>
            <DetailRow
              label="Data de Expiração"
              value={currentProduct.expiryDate}
            />
            <DetailRow
              label="Dias até expirar"
              value={currentProduct.daysToExpiry}
            />
          </section>
        )}

        {(currentProduct.company ||
          currentProduct.storeId ||
          currentProduct.createdAt ||
          currentProduct.updatedAt) && (
          <section className="space-y-2">
            <h3 className="font-semibold text-foreground">
              Informações Técnicas
            </h3>
            <DetailRow label="Loja" value={currentProduct.storeId} />
            <DetailRow
              label="Criado em"
              value={formatDateTime(currentProduct.createdAt)}
            />
          </section>
        )}
      </div>
    </GlobalModal>
  );
}
