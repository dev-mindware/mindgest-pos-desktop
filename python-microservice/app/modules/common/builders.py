# Document content builders for different document types
from typing import Dict, List, Any, Optional
from app.schemas import GenerateDocumentRequest, DocumentType
from datetime import datetime, timezone


class DocumentBuilder:
    """Builds structured document content from request data."""

    @staticmethod
    def build_document_context(request: GenerateDocumentRequest) -> Dict[str, Any]:
        """Build complete document context with all necessary data."""
        return {
            "metadata": DocumentBuilder._build_metadata(request),
            "header": DocumentBuilder._build_header(request),
            "company": DocumentBuilder._build_company(request),
            "client": DocumentBuilder._build_client(request),
            "items": DocumentBuilder._build_items(request),
            "summary": DocumentBuilder._build_summary(request),
            "footer": DocumentBuilder._build_footer(request),
        }

    @staticmethod
    def _build_metadata(request: GenerateDocumentRequest) -> Dict[str, Any]:
        """Build document metadata."""
        return {
            "documentType": request.documentType.value,
            "documentNumber": request.invoiceNumber,
            "format": request.format.value,
            "generatedAt": datetime.now(timezone.utc).isoformat(),
        }

    # ... (I should be careful with context, splitting into multiple replacements sounds safer)

    @staticmethod
    def _build_header(request: GenerateDocumentRequest) -> Dict[str, Any]:
        """Build document header information."""
        doc_type_names = {
            DocumentType.NORMAL_INVOICE: "FACTURA",
            DocumentType.INVOICE_RECEIPT: "FACTURA/RECIBO",
            DocumentType.RECEIPT: "RECIBO",
            DocumentType.PROFORMA_INVOICE: "FACTURA PROFORMA",
            DocumentType.CREDIT_NOTE: "NOTA DE CRÉDITO",
            DocumentType.SUBSCRIPTION_INVOICE: "FACTURA DE SUBSCRIPÇÃO",
        }

        return {
            "documentTitle": doc_type_names.get(request.documentType, "DOCUMENTO"),
            "documentType": request.documentType.value,
            "documentNumber": request.invoiceNumber,
            "issueDate": (
                request.invoiceDate.strftime("%d/%m/%Y %H:%M:%S")
                if hasattr(request.invoiceDate, "strftime")
                else str(request.invoiceDate)
            ),
            "dueDate": (
                request.dueDate.strftime("%d/%m/%Y")
                if request.dueDate and hasattr(request.dueDate, "strftime")
                else (str(request.dueDate) if request.dueDate else None)
            ),
            "verificationToken": request.verificationToken,
            "total": request.total,
        }

    @staticmethod
    def _build_company(request: GenerateDocumentRequest) -> Dict[str, Any]:
        """Build company information section."""
        return {
            "id": request.company.id,
            "name": request.company.name,
            "address": request.company.address or request.company.name,
            "taxNumber": request.company.taxNumber or request.company.name,
            "email": request.company.email,
            "phone": request.company.phone,
            "website": request.company.website,
            # Optional: paths to company logo and QR code can be passed via request.metadata
            "logoPath": (request.metadata or {}).get("logoPath"),
            "qrPath": (request.metadata or {}).get("qrPath"),
        }

    @staticmethod
    def _build_client(request: GenerateDocumentRequest) -> Dict[str, Any]:
        """Build client information section."""
        return {
            "name": request.client.name,
            "address": request.client.address or request.client.name,
            "taxNumber": request.client.taxNumber or request.client.name,
            "email": request.client.email,
            "phone": request.client.phone,
        }

    @staticmethod
    def _build_items(request: GenerateDocumentRequest) -> List[Dict[str, Any]]:
        """Build items/lines section."""
        return [
            {
                "description": item.description or "Item",
                "quantity": item.quantity,
                "unitPrice": item.unitPrice,
                "totalPrice": item.totalPrice,
                "tax": item.tax,
            }
            for item in request.items
        ]

    @staticmethod
    def _build_tax_details(request: GenerateDocumentRequest) -> List[Dict[str, Any]]:
        """Build tax details section."""
        return [
            {
                "taxRate": taxDetail.taxRate,
                "taxableAmount": taxDetail.taxableAmount,
                "taxAmount": taxDetail.taxAmount,
            }
            for taxDetail in request.taxDetails
        ]

    @staticmethod
    def _build_summary(request: GenerateDocumentRequest) -> Dict[str, Any]:
        """Build financial summary section."""
        return {
            "subtotal": round(request.subtotal, 2),
            "discountAmount": round(request.discountAmount or 0, 2),
            "tax": round(request.tax, 2),
            "retentionAmount": round(request.retentionAmount or 0, 2),
            "total": round(request.total, 2),
            "paymentTerms": request.paymentTerms,
        }

    @staticmethod
    def _build_footer(request: GenerateDocumentRequest) -> Dict[str, Any]:
        """Build document footer."""
        payment_details = {}
        if request.metadata:
            payment_details = request.metadata.get("paymentDetails", {})

        return {
            "notes": request.notes,
            "paymentDetails": payment_details,
            "generatedDate": datetime.now(timezone.utc).strftime("%d/%m/%Y %H:%M:%S"),
            "softwareName": "MindGest",
        }


class XMLBuilder:
    """Builds XML structure for documents."""

    @staticmethod
    def build_invoice_xml_structure(context: Dict[str, Any]) -> Dict[str, Any]:
        """Build invoice-specific XML structure."""
        return {
            "root": "Factura",
            "sections": {
                "Header": context["header"],
                "Company": context["company"],
                "Client": context["client"],
                "Items": context["items"],
                "TaxDetails": context["taxDetails"],
                "Summary": context["summary"],
                "Footer": context["footer"],
            },
        }

    @staticmethod
    def build_receipt_xml_structure(context: Dict[str, Any]) -> Dict[str, Any]:
        """Build receipt-specific XML structure."""
        return {
            "root": "Recibo",
            "sections": {
                "Header": context["header"],
                "Company": context["company"],
                "Client": context["client"],
                "Items": context["items"],
                "TaxDetails": context["taxDetails"],
                "Summary": context["summary"],
                "Footer": context["footer"],
            },
        }

    @staticmethod
    def build_proforma_xml_structure(context: Dict[str, Any]) -> Dict[str, Any]:
        """Build proforma-specific XML structure."""
        return {
            "root": "Proforma",
            "sections": {
                "Header": context["header"],
                "Company": context["company"],
                "Client": context["client"],
                "Items": context["items"],
                "TaxDetails": context["taxDetails"],
                "Summary": context["summary"],
                "Footer": context["footer"],
            },
        }

    @staticmethod
    def build_credit_note_xml_structure(context: Dict[str, Any]) -> Dict[str, Any]:
        """Build credit note-specific XML structure."""
        return {
            "root": "NotaDeCredito",
            "sections": {
                "Header": context["header"],
                "Company": context["company"],
                "Client": context["client"],
                "Items": context["items"],
                "TaxDetails": context["taxDetails"],
                "Summary": context["summary"],
                "Footer": context["footer"],
            },
        }
