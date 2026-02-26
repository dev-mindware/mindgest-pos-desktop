import { useState } from "react";
import printJS from "print-js";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    Button,
    Icon,
} from "@/components";

interface ThermalPrintModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    pdfUrl: string;
    invoiceId: string;
}

export function ThermalPrintModal({
    open,
    onOpenChange,
    pdfUrl,
    invoiceId,
}: ThermalPrintModalProps) {
    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrint = () => {
        setIsPrinting(true);

        printJS({
            printable: pdfUrl,
            type: 'pdf',
            onPrintDialogClose: () => {
                setIsPrinting(false);
            },
            onError: (err) => {
                console.error("Erro ao imprimir:", err);
                setIsPrinting(false);
            }
        });
    };

    const handleDownload = () => {
        const link = document.createElement("a");
        link.href = pdfUrl;
        link.download = `fatura-recibo-${invoiceId}-thermal.pdf`;
        link.click();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Icon name="Printer" className="h-5 w-5" />
                        Impressão Térmica - Fatura Recibo
                    </DialogTitle>
                </DialogHeader>

                <div className="flex-1 min-h-0 border rounded-md overflow-hidden bg-muted/20">
                    <iframe
                        src={pdfUrl}
                        className="w-full h-full"
                        title="Preview de Impressão"
                    />
                </div>

                <DialogFooter className="flex gap-2">
                    <Button
                        variant="outline"
                        onClick={handleDownload}
                        className="gap-2"
                    >
                        <Icon name="Download" className="h-4 w-4" />
                        Baixar PDF
                    </Button>

                    <Button
                        onClick={handlePrint}
                        disabled={isPrinting}
                        className="gap-2"
                    >
                        <Icon name="Printer" className="h-4 w-4" />
                        {isPrinting ? "Imprimindo..." : "Imprimir"}
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                    >
                        Fechar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
