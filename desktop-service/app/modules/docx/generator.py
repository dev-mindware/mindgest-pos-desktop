from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from pathlib import Path
from app.schemas import GenerateDocumentRequest, DocumentType
from app.modules.common.document_base import BaseDocumentGenerator
from app.modules.common.builders import DocumentBuilder
from app.modules.common.logger import get_logger
from app.modules.common.utils import generate_filename, get_temp_file_path

logger = get_logger(__name__)


class DOCXGenerator(BaseDocumentGenerator):
    """Generate DOCX documents using new clean architecture."""

    async def generate(self, request: GenerateDocumentRequest) -> Path:
        """Generate a DOCX document based on document type."""
        try:
            logger.info(
                f"Generating DOCX for {request.documentType.value}: {request.invoiceNumber}"
            )

            # Build document context using DocumentBuilder
            context = DocumentBuilder.build_document_context(request)

            # Route to specific generator based on document type
            if request.documentType == DocumentType.INVOICE:
                filepath = await self._generate_invoice_docx(request, context)
            elif request.documentType == DocumentType.RECEIPT:
                filepath = await self._generate_receipt_docx(request, context)
            elif request.documentType == DocumentType.PROFORMA:
                filepath = await self._generate_proforma_docx(request, context)
            elif request.documentType == DocumentType.CREDIT_NOTE:
                filepath = await self._generate_credit_note_docx(request, context)
            else:
                filepath = await self._generate_generic_docx(request, context)

            logger.info(f"DOCX generated successfully: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating DOCX: {str(e)}", exc_info=True)
            raise

    async def _generate_invoice_docx(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        """Generate invoice-specific DOCX."""
        filename = generate_filename(
            request.documentType.value, request.invoiceNumber, "docx"
        )
        filepath = get_temp_file_path(filename)

        doc = Document()

        # Header
        self._add_section_header(doc, context["company"])
        doc.add_paragraph()

        # Title
        title = doc.add_heading(context["header"]["documentTitle"], level=1)
        title.alignment = WD_ALIGN_PARAGRAPH.CENTER

        # Invoice details
        self._add_section_invoice_details(doc, context["header"])
        doc.add_paragraph()

        # Client info
        self._add_section_client(doc, context["client"])
        doc.add_paragraph()

        # Items table
        self._add_section_items(doc, context["items"])
        doc.add_paragraph()

        # Totals
        self._add_section_totals(doc, context["summary"])

        # Notes
        if context["footer"]["notes"]:
            doc.add_paragraph()
            self._add_section_notes(doc, context["footer"])

        doc.save(str(filepath))
        return filepath

    async def _generate_receipt_docx(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        """Generate receipt-specific DOCX."""
        # Similar to invoice, but with receipt-specific formatting
        return await self._generate_invoice_docx(request, context)

    async def _generate_proforma_docx(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        """Generate proforma-specific DOCX."""
        # Similar to invoice, but with proforma-specific formatting
        return await self._generate_invoice_docx(request, context)

    async def _generate_credit_note_docx(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        """Generate credit note-specific DOCX."""
        # Similar to invoice, but with credit note-specific formatting
        return await self._generate_invoice_docx(request, context)

    async def _generate_generic_docx(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        """Generate generic DOCX for unknown document types."""
        return await self._generate_invoice_docx(request, context)

    def _add_section_header(self, doc: Document, company: dict) -> None:
        """Add company header information."""
        p = doc.add_paragraph()
        run = p.add_run(f"{company['name']}\n")
        run.bold = True
        run.font.size = Pt(14)

        p.add_run(f"{company['address']}\n")
        p.add_run(f"NIF: {company['taxId']}")

        p.alignment = WD_ALIGN_PARAGRAPH.LEFT

    def _add_section_invoice_details(self, doc: Document, header: dict) -> None:
        """Add invoice number and dates."""
        table = doc.add_table(rows=2, cols=2)
        table.style = "Light Grid Accent 1"

        # Row 1
        table.rows[0].cells[0].text = f"Nº Factura: {header['documentNumber']}"
        table.rows[0].cells[1].text = f"Data: {header['issueDate']}"

        # Row 2
        if header["dueDate"]:
            table.rows[1].cells[0].text = ""
            table.rows[1].cells[1].text = f"Data Vencimento: {header['dueDate']}"

    def _add_section_client(self, doc: Document, client: dict) -> None:
        """Add client information."""
        heading = doc.add_heading("CLIENTE:", level=2)

        p = doc.add_paragraph()
        p.add_run(f"{client['name']}\n")
        p.add_run(f"{client['address']}\n")
        p.add_run(f"NIF: {client['taxId']}")

    def _add_section_items(self, doc: Document, items: list) -> None:
        """Add items table."""
        table = doc.add_table(rows=len(items) + 1, cols=5)
        table.style = "Light Grid Accent 1"

        # Header
        header_cells = table.rows[0].cells
        header_cells[0].text = "Descrição"
        header_cells[1].text = "Qtd"
        header_cells[2].text = "Preço Unit."
        header_cells[3].text = "Imposto"
        header_cells[4].text = "Total"

        # Make header bold
        for cell in header_cells:
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.bold = True

        # Items
        for idx, item in enumerate(items):
            row = table.rows[idx + 1]
            row.cells[0].text = item["description"]
            row.cells[1].text = str(item["quantity"])
            row.cells[2].text = self.format_currency(item["unitPrice"])
            row.cells[3].text = self.format_currency(item["tax"])
            row.cells[4].text = self.format_currency(item["totalPrice"])

    def _add_section_totals(self, doc: Document, summary: dict) -> None:
        """Add totals section."""
        rows = 2
        if summary["retentionAmount"] and summary["retentionAmount"] > 0:
            rows = 3
        rows += 1  # For total line

        table = doc.add_table(rows=rows, cols=2)
        table.style = "Light Grid Accent 1"

        row_idx = 0
        table.rows[row_idx].cells[0].text = "Subtotal:"
        table.rows[row_idx].cells[1].text = self.format_currency(summary["subtotal"])

        row_idx += 1
        table.rows[row_idx].cells[0].text = "IVA/Imposto:"
        table.rows[row_idx].cells[1].text = self.format_currency(summary["tax"])

        if summary.get("retentionAmount") and summary["retentionAmount"] > 0:
            row_idx += 1
            retention_val = summary["retentionAmount"]
            subtotal_val = summary.get("subtotal", 0)
            percent_str = ""
            if subtotal_val > 0 and retention_val > 0:
                pct = round((retention_val / subtotal_val) * 100, 1)
                if pct.is_integer():
                    percent_str = f" ({int(pct)}%)"
                else:
                    percent_str = f" ({pct}%)"
            table.rows[row_idx].cells[0].text = f"Retenção na Fonte{percent_str}:"
            table.rows[row_idx].cells[1].text = self.format_currency(retention_val)

        row_idx += 1
        total_row = table.rows[row_idx]
        for cell in total_row.cells:
            for paragraph in cell.paragraphs:
                for run in paragraph.runs:
                    run.bold = True

        total_row.cells[0].text = "TOTAL:"
        total_row.cells[1].text = self.format_currency(summary["total"])

    def _add_section_notes(self, doc: Document, footer: dict) -> None:
        """Add notes section."""
        doc.add_heading("Notas:", level=2)
        doc.add_paragraph(footer["notes"])
