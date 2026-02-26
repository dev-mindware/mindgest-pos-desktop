import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Label } from "@/components/ui";
import { currentBankStore, useModal } from "@/stores";

export function BankDetailsModal() {
    const { closeModal, open } = useModal();
    const { currentBank: bank } = currentBankStore();
    const isOpen = open["details-bank"];

    if (!bank) return null;

    return (
        <Dialog open={isOpen} onOpenChange={() => closeModal("details-bank")}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Detalhes do Banco</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label>Nome do Banco</Label>
                        <Input readOnly value={bank.bankName} />
                    </div>

                    <div className="space-y-2">
                        <Label>Número da Conta</Label>
                        <Input readOnly value={bank.accountNumber} />
                    </div>

                    <div className="space-y-2">
                        <Label>IBAN</Label>
                        <Input readOnly value={bank.iban} />
                    </div>

                    <div className="space-y-2">
                        <Label>Telefone</Label>
                        <Input readOnly value={bank.phone || "Não informado"} />
                    </div>

                    <div className="space-y-2">
                        <Label>Status</Label>
                        <Input
                            readOnly
                            value={bank.isDefault ? "Padrão" : "Normal"}
                            className={bank.isDefault ? "text-green-600 font-medium" : ""}
                        />
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button onClick={() => closeModal("details-bank")}>Fechar</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
