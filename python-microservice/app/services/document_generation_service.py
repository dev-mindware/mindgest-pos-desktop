from typing import Protocol, Optional, Tuple
from pathlib import Path

from app.schemas import GenerateDocumentRequest, DocumentFormat, DocumentType
from app.modules.common.document_base import BaseDocumentGenerator
from app.modules.pdf.generator import PDFGenerator
from app.modules.pdf.subscription_invoice_generator import SubscriptionInvoiceGenerator
from app.modules.pdf.thermal_generator import ThermalPDFGenerator
from app.modules.xml.generator_v2 import XMLGeneratorV2
from app.modules.docx.generator import DOCXGenerator
from app.modules.xlsx.generator import XLSXGenerator


class DocumentGeneratorProtocol(Protocol):
    async def generate(self, request: GenerateDocumentRequest) -> Path:
        ...


class DocumentGenerationService:
    def __init__(
        self,
        pdf_generator: PDFGenerator,
        thermal_generator: ThermalPDFGenerator,
        subscription_invoice_generator: SubscriptionInvoiceGenerator,
        xml_generator: XMLGeneratorV2,
        docx_generator: DOCXGenerator,
        xlsx_generator: XLSXGenerator,
    ):
        self.pdf_generator = pdf_generator
        self.thermal_generator = thermal_generator
        self.subscription_invoice_generator = subscription_invoice_generator
        self.xml_generator = xml_generator
        self.docx_generator = docx_generator
        self.xlsx_generator = xlsx_generator

    async def generate(self, request: GenerateDocumentRequest) -> Path:
        """Generate a document and return the generated file path."""
        generator = self._select_generator(request)
        return await generator.generate(request)

    async def generate_with_media_type(
        self, request: GenerateDocumentRequest
    ) -> Tuple[Path, str]:
        """Generate a document and return its path with the correct media type."""
        filepath = await self.generate(request)
        return filepath, self._get_media_type(request.format)

    def _select_generator(
        self, request: GenerateDocumentRequest
    ) -> DocumentGeneratorProtocol:
        if request.format == DocumentFormat.PDF:
            return self._select_pdf_generator(request)

        if request.format == DocumentFormat.XML:
            return self.xml_generator

        if request.format == DocumentFormat.DOCX:
            return self.docx_generator

        if request.format == DocumentFormat.XLSX:
            return self.xlsx_generator

        raise ValueError(f"Unsupported document format: {request.format}")

    def _select_pdf_generator(
        self, request: GenerateDocumentRequest
    ) -> DocumentGeneratorProtocol:
        if request.documentType == DocumentType.SUBSCRIPTION_INVOICE:
            return self.subscription_invoice_generator

        layout = self._extract_layout(request)
        if layout == "thermal":
            return self.thermal_generator

        return self.pdf_generator

    def _extract_layout(self, request: GenerateDocumentRequest) -> Optional[str]:
        if request.metadata and isinstance(request.metadata, dict):
            return request.metadata.get("layout")
        return None

    @staticmethod
    def _get_media_type(format: DocumentFormat) -> str:
        if format == DocumentFormat.PDF:
            return "application/pdf"
        if format == DocumentFormat.XML:
            return "application/xml"
        if format == DocumentFormat.DOCX:
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        if format == DocumentFormat.XLSX:
            return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        return "application/octet-stream"
