from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
    PageBreak,
    Image,
    Flowable,
)
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT, TA_LEFT, TA_CENTER, TA_JUSTIFY
from pathlib import Path
from datetime import datetime
import qrcode
from io import BytesIO
from app.schemas import GenerateDocumentRequest, DocumentType
from app.modules.common.document_base import BaseDocumentGenerator
from app.modules.common.builders import DocumentBuilder
from app.modules.common.logger import get_logger
from app.modules.common.utils import generate_filename, get_temp_file_path, save_base64_image
from app.config.logo_config import LogoManager
from PIL import Image as PILImage, ImageDraw
import os

logger = get_logger(__name__)


def safe_str(value: any, default: str = "") -> str:
    """Safely convert value to string, handling None values."""
    if value is None:
        return default
    if isinstance(value, str):
        return value
    return str(value)


# Cor principal escura (preto/cinzento escuro)
PRIMARY_COLOR = colors.HexColor("#1a1a1a")
# Cor de fundo para logo
LOGO_BACKGROUND_COLOR = colors.HexColor("#EEEEEE")
# Cor secundária (para texto menos importante)
SECONDARY_COLOR = colors.HexColor("#131313")
# Cor de fundo para o total destacado
TOTAL_BACKGROUND_COLOR = colors.white


class CenteredLogoBox(Flowable):
    """A simple square box with a centered character (visual vertical centering)."""

    def __init__(
        self, text, size, bg_color, text_color, font_name="Courier-Bold", font_size=28
    ):
        Flowable.__init__(self)
        self.text = text
        self.size = size
        self.bg_color = bg_color
        self.text_color = text_color
        self.font_name = font_name
        self.font_size = font_size
        self.width = size
        self.height = size

    def wrap(self, availWidth, availHeight):
        return self.size, self.size

    def draw(self):
        self.canv.saveState()
        self.canv.setFillColor(self.bg_color)
        self.canv.rect(0, 0, self.width, self.height, fill=1, stroke=0)

        self.canv.setFillColor(self.text_color)
        self.canv.setFont(self.font_name, self.font_size)

        # Heuristic for visual vertical centering of uppercase letters:
        # Move baseline down from center by approx 0.35 * font_size
        text_y = (self.height / 2.0) - (self.font_size * 0.35)

        self.canv.drawCentredString(self.width / 2.0, text_y, self.text)
        self.canv.restoreState()


class BottomAlignedFooter(Flowable):
    """
    A container that forces its content to sit at the bottom of the current page.
    If the content fits in the remaining space, it consumes all that space
    and draws the content at the very bottom (y=0 relative to the frame).
    If it doesn't fit, it triggers a page break.
    """

    def __init__(self, content):
        Flowable.__init__(self)
        self.content = content
        self.width = 0
        self.height = 0

    def wrap(self, availWidth, availHeight):
        # Measure the content
        self.width, self.height = self.content.wrap(availWidth, availHeight)

        # If content fits in the remaining height of the page
        if self.height <= availHeight:
            # We claim ALL available height. This ensures no other flowables
            # can be drawn on this page, and defines our drawing area
            # as extending to the bottom margin.
            return availWidth, availHeight
        else:
            # If it doesn't fit, return actual height.
            # ReportLab will trigger a page break.
            return self.width, self.height

    def draw(self):
        # Draw the content at (0,0).
        # Since we claimed all vertical space down to the margin,
        # (0,0) represents the bottom-left corner of the printable area.
        self.content.drawOn(self.canv, 0, 0)


# ----------------------------


class PDFGenerator(BaseDocumentGenerator):
    """Generate PDF documents with professional default template."""

    def __init__(self):
        super().__init__()
        self.page_width, self.page_height = A4
        self.margin = 18 * mm
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()
        # AGT Certification Message
        self.agt_certification = "Processado por programa certificado n.º FE/332/AGT/2026"
        # Ensure logos directory exists
        LogoManager.ensure_logos_dir_exists()

    def _setup_custom_styles(self):
        """Setup custom paragraph styles for professional template."""

        # Estilo para o título do documento
        self.styles.add(
            ParagraphStyle(
                name="CustomDocTitle",
                parent=self.styles["Heading1"],
                fontSize=28,
                textColor=PRIMARY_COLOR,
                spaceAfter=8,
                alignment=TA_CENTER,
                fontName="Courier",
            )
        )

        # Estilo para Cabeçalhos/Secções
        self.styles.add(
            ParagraphStyle(
                name="CustomSectionHead",
                parent=self.styles["Normal"],
                fontSize=9,
                textColor=PRIMARY_COLOR,
                spaceAfter=4,
                spaceBefore=4,
                fontName="Courier",
            )
        )

        # Estilo para a informação principal
        self.styles.add(
            ParagraphStyle(
                name="CustomBodyBold",
                parent=self.styles["Normal"],
                fontSize=9,
                textColor=PRIMARY_COLOR,
                spaceAfter=2,
                fontName="Courier",
                leading=11,
            )
        )

        # Estilo para o corpo de texto normal
        self.styles.add(
            ParagraphStyle(
                name="CustomBody",
                parent=self.styles["Normal"],
                fontSize=9,
                fontName="Courier",
                textColor=SECONDARY_COLOR,
                spaceAfter=2,
                leading=11,
            )
        )

        # Estilo para a Tabela de Itens (cabeçalho)
        self.styles.add(
            ParagraphStyle(
                name="CustomTableHead",
                parent=self.styles["Normal"],
                fontSize=9,
                textColor=PRIMARY_COLOR,
                fontName="Courier",
                alignment=TA_LEFT,
            )
        )

        # Estilos de cabeçalho para colunas numéricas
        self.styles.add(
            ParagraphStyle(
                name="CustomTableHeadCenter",
                parent=self.styles["CustomTableHead"],
                alignment=TA_CENTER,
            )
        )
        self.styles.add(
            ParagraphStyle(
                name="CustomTableHeadRight",
                parent=self.styles["CustomTableHead"],
                fontSize=10,
                alignment=2,  # RIGHT
                leading=12,
            )
        )

        # Estilo para a Tabela de Itens (dados)
        self.styles.add(
            ParagraphStyle(
                name="CustomTableData",
                parent=self.styles["Normal"],
                fontSize=9,
                fontName="Courier",
                textColor=PRIMARY_COLOR,
                alignment=TA_RIGHT,
            )
        )

        # Estilo para o Valor Total
        self.styles.add(
            ParagraphStyle(
                name="CustomTotal",
                parent=self.styles["Normal"],
                fontSize=20,
                textColor=PRIMARY_COLOR,
                fontName="Courier-Bold",
                alignment=2,  # RIGHT
                leading=24,
                spaceBefore=0,
                spaceAfter=0,
            )
        )

        # Estilo para o Valor Total Pequeno
        self.styles.add(
            ParagraphStyle(
                name="CustomTotalSmall",
                fontSize=10,
                alignment=2,
                leading=12,
                fontName="Courier",
            )
        )

        # Valor pequeno (IVA)
        self.styles.add(
            ParagraphStyle(
                name="CustomValueSmall",
                fontSize=10,
                alignment=2,  # RIGHT
                leading=12,
                fontName="Courier",
            )
        )

        # Estilo para labels alinhados à direita
        self.styles.add(
            ParagraphStyle(
                name="CustomLabelRight",
                fontSize=10,
                alignment=TA_LEFT,
                leading=12,
                fontName="Courier",
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="CustomValueLarge",
                fontSize=20,
                alignment=2,  # RIGHT
                leading=24,
                fontName="Courier-Bold",
                spaceBefore=0,
                spaceAfter=0,
            )
        )

        # Estilo para Metadados
        self.styles.add(
            ParagraphStyle(
                name="CustomMetadata",
                parent=self.styles["Normal"],
                fontName="Courier",
                fontSize=9,
                textColor=PRIMARY_COLOR,
                alignment=TA_LEFT,
            )
        )

        # Estilo para os rodapés
        self.styles.add(
            ParagraphStyle(
                name="CustomFooterHead",
                parent=self.styles["Normal"],
                fontSize=12,
                textColor=PRIMARY_COLOR,
                spaceAfter=2,
                fontName="Courier",
            )
        )

        # ADICIONAR ESTE ESTILO PARA O CRÉDITO DO SOFTWARE
        self.styles.add(
            ParagraphStyle(
                name="MindwareCredit",
                parent=self.styles["Normal"],
                fontSize=7,
                textColor=colors.HexColor("#7f8c8d"),  # Cinza profissional
                alignment=TA_CENTER,
                fontName="Courier-Oblique",
                leading=8,
            )
        )

    async def generate(self, request: GenerateDocumentRequest) -> Path:
        """Generate a PDF document based on document type."""
        with open("temp/generator_type.txt", "w") as f:
            f.write("standard")
        print(
            f"DEBUG: Standard PDFGenerator.generate called for {request.invoiceNumber}"
        )
        try:
            logger.info(
                f"Generating PDF for {request.documentType.value}: {request.invoiceNumber}"
            )
            context = DocumentBuilder.build_document_context(request)

            filepath = await self._generate_invoice_pdf(request, context)

            logger.info(f"PDF generated successfully: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating PDF: {str(e)}", exc_info=True)
            raise

    async def _generate_invoice_pdf(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        """Generate invoice-specific PDF."""
        filename = generate_filename(
            request.documentType.value, request.invoiceNumber, "pdf"
        )
        filepath = get_temp_file_path(filename)

        doc = SimpleDocTemplate(
            str(filepath),
            pagesize=A4,
            rightMargin=self.margin,
            leftMargin=self.margin,
            topMargin=self.margin,
            bottomMargin=self.margin,
        )

        # Pass metadata to doc for canvas drawing
        doc._invoice_hash = getattr(request, "hash", None)
        doc._invoice_status = getattr(request, "status", None)

        story = []

        # 1. Header (Logo)
        story.extend(self._build_section_logo(context["company"], context["header"]))
        story.append(Spacer(1, 10 * mm))

        # 1.5 AGT Period (Novos Requisitos do Ofício)
        if request.period:
            period_style = ParagraphStyle(
                name="PeriodStyle",
                parent=self.styles["CustomMetadata"],
                alignment=TA_RIGHT,
                fontSize=10,
                fontName="Courier-Bold",
            )
            story.append(
                Paragraph(f"Período Contabilístico: {request.period}", period_style)
            )
            story.append(Spacer(1, 5 * mm))

        # 2. Invoice Metadata (Invoice no, Issue date, Due date)
        story.extend(self._build_section_invoice_details(context["header"]))
        story.append(Spacer(1, 8 * mm))

        # 3. Client/Company Info (From/To)
        story.extend(self._build_section_client(context["company"], context["client"]))
        story.append(Spacer(1, 4 * mm))

        # 4. Items table
        story.extend(self._build_section_items(context["items"]))
        story.append(Spacer(1, 2 * mm))

        # 5. Tax Details
        if request.taxDetails:
            story.extend(self._build_section_tax_details(request.taxDetails))
            story.append(Spacer(1, 1 * mm))

        # 6. Totals
        story.extend(self._build_section_totals(context["summary"]))

        # 6. Notes / Payment Details (Footer)
        # --- MODIFIED SECTION START ---

        # We get the list of flowables (the Table) from the build method
        footer_content_list = self._build_section_notes(
            context["footer"], context["header"], context["company"]
        )

        if footer_content_list:
            # We assume the list contains the main table at index 0
            footer_table = footer_content_list[0]

            # Wrap it in our BottomAlignedFooter.
            # It will automatically push itself to the bottom of the page.
            # If it doesn't fit, it moves to the next page and sits at the bottom there.
            story.append(BottomAlignedFooter(footer_table))

        # --- MODIFIED SECTION END ---

        doc.build(
            story,
            onFirstPage=self._draw_page_decorations,
            onLaterPages=self._draw_page_decorations,
        )
        return filepath

    async def _generate_receipt_pdf(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        return await self._generate_invoice_pdf(request, context)

    async def _generate_proforma_pdf(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        return await self._generate_invoice_pdf(request, context)

    async def _generate_credit_note_pdf(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        return await self._generate_invoice_pdf(request, context)

    async def _generate_generic_pdf(
        self, request: GenerateDocumentRequest, context: dict
    ) -> Path:
        return await self._generate_invoice_pdf(request, context)

    def _build_section_logo(self, company: dict, header: dict) -> list:
        """Build logo section with company name and details on the right."""
        logo_size = 15 * mm

        company_id = company.get("id")

        # 1. Try URL from company data (Google Drive)
        logo_url = company.get("logo")
        logo_path = None

        if logo_url:
            logo_path = download_image_from_url(logo_url)

        # 2. If no URL, try legacy local path
        if not logo_path:
            local_path = LogoManager.get_logo_path(company_id)
            if local_path and Path(local_path).exists():
                logo_path = local_path

        logo_element = None
        if logo_path and Path(logo_path).exists():
            try:
                logo_element = Image(str(logo_path), width=logo_size, height=logo_size)
                # logger.info(f"Loaded logo from: {logo_path}")
            except Exception as e:
                logger.warning(f"Failed to load logo from {logo_path}: {str(e)}")
                logo_element = self._create_fallback_logo_box_image(
                    company["name"], logo_size
                )
        else:
            # logger.debug(f"No logo found for company_id={company_id}, using fallback")
            logo_element = self._create_fallback_logo_box_image(
                company["name"], logo_size
            )

        doc_title = header.get("documentTitle", "").upper()

        company_info = []
        company_info.append(
            Paragraph(
                f"<b>{doc_title}</b>",
                self.styles["CustomBodyBold"],
            )
        )
        if company.get("name"):
            company_info.append(
                Paragraph(
                    f"<b>{safe_str(company.get('name'))}</b>",
                    self.styles["CustomBodyBold"],
                )
            )
        if company.get("email"):
            company_info.append(
                Paragraph(safe_str(company.get("email")), self.styles["CustomBody"])
            )
        if company.get("phone"):
            company_info.append(
                Paragraph(safe_str(company.get("phone")), self.styles["CustomBody"])
            )

        usable_width = self.page_width - (self.margin * 2)
        logo_table = Table(
            [[logo_element, company_info]],
            colWidths=[logo_size + 4 * mm, usable_width - logo_size - 2 * mm],
            rowHeights=[logo_size + 5 * mm],
        )
        logo_table.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (0, 0), LOGO_BACKGROUND_COLOR),
                    ("VALIGN", (0, 0), (0, 0), "CENTER"),
                    ("ALIGN", (0, 0), (0, 0), "CENTER"),
                    ("LEFTPADDING", (0, 0), (0, 0), 5),
                    ("RIGHTPADDING", (0, 0), (0, 0), 5),
                    ("TOPPADDING", (0, 0), (0, 0), 5),
                    ("BOTTOMPADDING", (0, 0), (0, 0), 5),
                    ("VALIGN", (1, 0), (1, 0), "CENTER"),
                    ("ALIGN", (1, 0), (1, 0), "LEFT"),
                    ("LEFTPADDING", (1, 0), (1, 0), 10),
                    ("RIGHTPADDING", (1, 0), (1, 0), 0),
                    ("TOPPADDING", (1, 0), (1, 0), 0),
                    ("BOTTOMPADDING", (1, 0), (1, 0), 0),
                ]
            )
        )

        return [logo_table]

    def _create_fallback_logo_box_image(self, company_name: str, logo_size: float):
        """Create a simple boxed initial using proper graphic centering."""
        initial_text = company_name[0].upper() if company_name else "D"

        return CenteredLogoBox(
            text=initial_text,
            size=logo_size,
            bg_color=LOGO_BACKGROUND_COLOR,
            text_color=colors.black,
            font_name="Courier",  # Using standard font to match document
            font_size=28,
        )

    def _build_section_invoice_details(self, header: dict) -> list:
        usable_width = self.page_width - (self.margin * 2)
        style_metadata = self.styles["CustomMetadata"]
        font_name = style_metadata.fontName
        font_size = style_metadata.fontSize

        def get_block_width(label, value):
            w1 = stringWidth(label, font_name, font_size)
            w2 = stringWidth(str(value), font_name, font_size)
            return max(w1, w2) + (2 * mm)  # Small buffer

        # 1. Left Item (Width auto is fine for left, but let's be consistent)
        lbl_1 = "Nº da Factura:"
        val_1 = header["documentNumber"]
        p_left = Paragraph(f"{lbl_1}<br/>{val_1}", style_metadata)

        # 2. Center Item
        lbl_2 = "Data de Emissão:"
        val_2 = header["issueDate"]
        width_2 = get_block_width(lbl_2, val_2)

        p_center = Paragraph(f"{lbl_2}<br/>{val_2}", style_metadata)
        t_center = Table([[p_center]], colWidths=[width_2])
        t_center.hAlign = "CENTER"
        t_center.setStyle(
            TableStyle(
                [
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]
            )
        )

        # 3. Right Item
        lbl_3 = "Data de Vencimento:"
        val_3 = header.get("dueDate") or "N/A"
        width_3 = get_block_width(lbl_3, val_3)

        p_right = Paragraph(f"{lbl_3}<br/>{val_3}", style_metadata)
        t_right = Table([[p_right]], colWidths=[width_3])
        t_right.hAlign = "RIGHT"
        t_right.setStyle(
            TableStyle(
                [
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]
            )
        )

        data_row = [p_left, t_center]
        col_widths = [usable_width * 0.33, usable_width * 0.34]

        if header.get("dueDate"):
            data_row.append(t_right)
            col_widths.append(usable_width * 0.33)
        else:
            # Distribute remaining width to left and center if right is missing
            col_widths[0] += usable_width * 0.16
            col_widths[1] += usable_width * 0.17

        data = [data_row]

        table = Table(
            data,
            colWidths=col_widths,
        )

        table.setStyle(
            TableStyle(
                [
                    ("ALIGN", (0, 0), (0, 0), "LEFT"),
                    ("ALIGN", (1, 0), (1, 0), "CENTER"),
                    (
                        ("ALIGN", (2, 0), (2, 0), "RIGHT")
                        if len(data_row) > 2
                        else ("ALIGN", (1, 0), (1, 0), "RIGHT")
                    ),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("TOPPADDING", (0, 0), (-1, -1), 0),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
                ]
            )
        )

        return [table]

    def _build_section_client(self, company: dict, client: dict) -> list:
        """Build client information section with From/To layout."""

        # Prepare filtered lists
        from_details = []
        if company.get("name"):
            from_details.append(
                Paragraph(
                    f"<b>{safe_str(company.get('name'))}</b>",
                    self.styles["CustomBodyBold"],
                )
            )
        if company.get("email"):
            from_details.append(
                Paragraph(
                    f"Email: {safe_str(company.get('email'))}",
                    self.styles["CustomBody"],
                )
            )
        if company.get("phone"):
            from_details.append(
                Paragraph(
                    f"Telefone: {safe_str(company.get('phone'))}",
                    self.styles["CustomBody"],
                )
            )
        if company.get("address"):
            from_details.append(
                Paragraph(
                    f"Endereço: {safe_str(company.get('address'))}",
                    self.styles["CustomBody"],
                )
            )
        if company.get("taxNumber"):
            from_details.append(
                Paragraph(
                    f"NIF: {safe_str(company.get('taxNumber'))}",
                    self.styles["CustomBody"],
                )
            )

        to_details = []
        if client.get("name"):
            to_details.append(
                Paragraph(
                    f"<b>{safe_str(client.get('name'))}</b>",
                    self.styles["CustomBodyBold"],
                )
            )
        if client.get("email"):
            to_details.append(
                Paragraph(
                    f"Email: {safe_str(client.get('email'))}",
                    self.styles["CustomBody"],
                )
            )
        if client.get("phone"):
            to_details.append(
                Paragraph(
                    f"Telefone: {safe_str(client.get('phone'))}",
                    self.styles["CustomBody"],
                )
            )
        if client.get("address"):
            to_details.append(
                Paragraph(
                    f"Endereço: {safe_str(client.get('address'))}",
                    self.styles["CustomBody"],
                )
            )
        if client.get("taxNumber"):
            to_details.append(
                Paragraph(
                    f"NIF: {safe_str(client.get('taxNumber'))}",
                    self.styles["CustomBody"],
                )
            )

        # Build table data pairing details with spacers
        from_final = []
        for i, item in enumerate(from_details):
            from_final.append(item)
            if i < len(from_details) - 1:
                from_final.append(Spacer(1, 1 * mm))

        to_final = []
        for i, item in enumerate(to_details):
            to_final.append(item)
            if i < len(to_details) - 1:
                to_final.append(Spacer(1, 1 * mm))

        data_formatted = [
            [
                Paragraph("De", self.styles["CustomSectionHead"]),
                Paragraph("Para", self.styles["CustomSectionHead"]),
            ],
            [from_final, to_final],
        ]

        table = Table(
            data_formatted,
            colWidths=[
                self.page_width * 0.51 - self.margin,
                self.page_width * 0.51 - self.margin,
            ],
        )

        table.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ]
            )
        )

        return [table]

    def _build_section_items(self, items: list) -> list:
        usable_width = self.page_width - (self.margin * 2)

        data = [
            [
                Paragraph("Descrição", self.styles["CustomTableHead"]),
                Paragraph(
                    "Taxa %", self.styles["CustomTableHead"]
                ),  # Alinhado à esquerda/centro
                Paragraph("Qtd.", self.styles["CustomTableHeadRight"]),  # Abreviado
                Paragraph("Preço", self.styles["CustomTableHeadRight"]),
                Paragraph("Total", self.styles["CustomTableHeadRight"]),
            ]
        ]

        for item in items:
            data.append(
                [
                    Paragraph(item["description"], self.styles["CustomBody"]),
                    Paragraph(str(item["tax"]), self.styles["CustomBody"]),  # Taxa
                    Paragraph(
                        str(int(item["quantity"])), self.styles["CustomTableData"]
                    ),
                    Paragraph(
                        self.format_currency(item["unitPrice"]),
                        self.styles["CustomTableData"],
                    ),
                    Paragraph(
                        self.format_currency(item["totalPrice"]),
                        self.styles["CustomTableData"],
                    ),
                ]
            )

        table = Table(
            data,
            colWidths=[
                usable_width * 0.40,  # Description reduced
                usable_width * 0.10,  # Tax
                usable_width * 0.10,  # Qty
                usable_width * 0.20,  # Price
                usable_width * 0.20,  # Total
            ],
        )

        table.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LINEBELOW", (0, 0), (-1, 0), 0.6, SECONDARY_COLOR),
                    ("TOPPADDING", (0, 0), (-1, 0), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
                    ("TOPPADDING", (0, 1), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 1), (-1, -1), 6),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                    ("ALIGN", (0, 0), (0, -1), "LEFT"),  # Description
                    ("ALIGN", (1, 0), (1, -1), "LEFT"),  # Tax
                    ("ALIGN", (2, 0), (2, -1), "RIGHT"),  # Qty
                    ("ALIGN", (3, 0), (3, -1), "RIGHT"),  # Price
                    ("ALIGN", (4, 0), (4, -1), "RIGHT"),  # Total
                ]
            )
        )

        return [table]

    def _build_section_totals(self, summary: dict) -> list:
        usable_width = self.page_width - (self.margin * 1)

        data = []

        # Desconto
        if summary.get("discountAmount", 0) > 0:
            data.append(
                [
                    Paragraph("Desconto", self.styles["CustomLabelRight"]),
                    Paragraph(
                        self.format_currency(summary["discountAmount"], "AOA"),
                        self.styles["CustomValueSmall"],
                    ),
                ]
            )

        # Subtotal
        data.append(
            [
                Paragraph("Subtotal", self.styles["CustomLabelRight"]),
                Paragraph(
                    self.format_currency(summary["subtotal"], "AOA"),
                    self.styles["CustomValueSmall"],
                ),
            ]
        )

        # IVA
        data.append(
            [
                Paragraph("IVA", self.styles["CustomLabelRight"]),
                Paragraph(
                    self.format_currency(summary["tax"], "AOA"),
                    self.styles["CustomValueSmall"],
                ),
            ]
        )

        currency_code = summary.get("currencyCode", "AOA")
        if currency_code != "AOA":
            # Total in Base Currency (Kz)
            data.append(
                [
                    Paragraph("Total (Kz)", self.styles["CustomLabelRight"]),
                    Paragraph(
                        self.format_currency(summary["total"], "AOA"),
                        self.styles["CustomValueSmall"],
                    ),
                ]
            )

            # Gross Total in Foreign Currency
            data.append(
                [
                    Paragraph(
                        f"Total ({currency_code})", self.styles["CustomLabelRight"]
                    ),
                    Paragraph(
                        self.format_currency(summary["currencyTotal"], currency_code),
                        self.styles["CustomValueLarge"],
                    ),
                ]
            )

            # Exchange Rate
            exchange_rate = summary.get("exchangeRate", 1.0)
            data.append(
                [
                    Paragraph("Câmbio", self.styles["CustomLabelRight"]),
                    Paragraph(
                        f"1 {currency_code} = {self.format_currency(exchange_rate, 'AOA')}",
                        self.styles["CustomValueSmall"],
                    ),
                ]
            )
        else:
            # Standard Total
            data.append(
                [
                    Paragraph("Total", self.styles["CustomLabelRight"]),
                    Paragraph(
                        self.format_currency(summary["total"], "AOA"),
                        self.styles["CustomValueLarge"],
                    ),
                ]
            )

        table = Table(
            data,
            colWidths=[
                usable_width * 0.15,
                usable_width * 0.35,
            ],
        )

        table.hAlign = "RIGHT"

        table.setStyle(
            TableStyle(
                [
                    ("ALIGN", (0, 0), (0, -1), "RIGHT"),
                    ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                    ("FONTSIZE", (0, 0), (1, 0), 10),
                    ("FONTNAME", (0, 0), (1, 0), "Courier"),
                    ("TOPPADDING", (0, 0), (1, 0), 20),
                    ("BOTTOMPADDING", (0, 0), (1, 0), 6),
                    ("FONTSIZE", (0, 1), (1, 1), 20),
                    ("FONTNAME", (0, 1), (1, 1), "Courier-Bold"),
                    ("TOPPADDING", (0, 1), (1, 1), 6),
                    ("BOTTOMPADDING", (0, 1), (1, 1), 6),
                    ("LINEABOVE", (0, 1), (1, 1), 1, colors.black),
                    ("GRID", (0, 0), (-1, -1), 0, colors.transparent),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 0),
                ]
            )
        )

        return [table]

    def _generate_qr_code(
        self, data: str, size: int = 25, company_id: str = None
    ) -> Image:
        """Generate QR code with optional logo overlay."""
        try:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,  # High correction for logo overlay
                box_size=10,
                border=2,
            )
            qr.add_data(data)
            qr.make(fit=True)

            # Generate base QR code as RGB for manipulation
            img_qr = qr.make_image(fill_color="black", back_color="white").convert(
                "RGB"
            )

            # Embed logo if provided
            # Embed Mindware logo
            logo_path = Path("assets/logos/mindware-logo.jpeg").resolve()
            if logo_path.exists():
                try:
                    logo = PILImage.open(str(logo_path)).convert("RGBA")

                    # Calculate logo size (max 20-25% of QR code area)
                    qr_width, qr_height = img_qr.size
                    logo_max_size = int(qr_width * 0.28)

                    # Resize logo maintaining aspect ratio
                    logo.thumbnail(
                        (logo_max_size, logo_max_size), PILImage.Resampling.LANCZOS
                    )
                    logo_w, logo_h = logo.size

                    # Create rounded mask
                    mask = PILImage.new("M", (logo_w, logo_h), 0)
                    draw = ImageDraw.Draw(mask)
                    # Radius ~20% of smaller dimension for "small round" look
                    radius = int(min(logo_w, logo_h) * 0.20)
                    draw.rounded_rectangle(
                        [(0, 0), (logo_w, logo_h)], radius=radius, fill=255
                    )

                    # Calculate position (exactly center)
                    pos = ((qr_width - logo_w) // 2, (qr_height - logo_h) // 2)

                    # Paste logo onto QR code using the rounded mask
                    img_qr.paste(logo, pos, mask=mask)
                    logger.debug(f"Logo embedded in QR code for company {company_id}")
                except Exception as logo_err:
                    logger.warning(
                        f"Failed to overlay logo on QR code: {str(logo_err)}"
                    )

            img_bytes = BytesIO()
            img_qr.save(img_bytes, format="PNG")
            img_bytes.seek(0)

            return Image(img_bytes, width=size * mm, height=size * mm)
        except Exception as e:
            logger.error(f"Error generating QR code: {str(e)}")
            return None

    def _build_section_notes(self, footer: dict, header: dict, company: dict) -> list:
        """Build notes and payment details section with QR code for payment information."""

        qr_data = self._prepare_qr_code_data(header, company, footer)

        left_col_content = []
        payment_details = footer.get("paymentDetails", {})
        bank_name = payment_details.get("bankName")
        iban = payment_details.get("iban")
        account_number = payment_details.get("accountNumber")
        phone = payment_details.get("phone")
        reference = payment_details.get("reference") or header.get("documentNumber")

        # Check if we have any payment info to show
        has_bank_info = any([bank_name, iban, account_number, phone])

        if has_bank_info or reference:
            left_col_content.append(
                Paragraph("Detalhes do Pagamento", self.styles["CustomFooterHead"])
            )

            if has_bank_info:
                details_parts = []
                if bank_name:
                    details_parts.append(f"<b>{safe_str(bank_name)}</b>")
                if account_number:
                    details_parts.append(f"Conta: {account_number}")
                if iban:
                    details_parts.append(f"IBAN: {iban}")
                if phone:
                    details_parts.append(f"Express: {phone}")

                details_html = "<br/>".join(details_parts)
                left_col_content.append(
                    Paragraph(
                        f"<font size=9>{details_html}</font>", self.styles["CustomBody"]
                    )
                )

            if reference:
                padding = "<br/>" if has_bank_info else ""
                left_col_content.append(
                    Paragraph(
                        f"<font size=9>{padding}Referência: {reference}</font>",
                        self.styles["CustomBody"],
                    )
                )

        right_col_content = []
        notes = footer.get("notes")
        if notes:
            right_col_content.append(Paragraph("Nota", self.styles["CustomFooterHead"]))
            right_col_content.append(Paragraph(notes, self.styles["CustomBody"]))
        elif not left_col_content:
            # Fallback if both are empty? Maybe show default note?
            right_col_content.append(Paragraph("Nota", self.styles["CustomFooterHead"]))
            right_col_content.append(
                Paragraph(
                    "Observe que este é um documento gerado eletronicamente e não requer assinatura.",
                    self.styles["CustomBody"],
                )
            )

        fiscal_qr_path = save_base64_image(header.get("qrCode"), prefix="fiscal_qr")
        if fiscal_qr_path:
            qr_img = Image(str(fiscal_qr_path), width=25 * mm, height=25 * mm)
            qr_label = "QR Code de Validação AGT"
            qr_hint = "Digitalize para confirmar a submissão fiscal deste documento."
        else:
            qr_img = self._generate_qr_code(qr_data, size=25, company_id=company.get("id"))
            qr_label = "QR Code de Verificação"
            qr_hint = "Digitalize para verificar a autenticidade deste documento no portal oficial."

        data = []

        # Build rows conditionally
        headers = []
        if left_col_content:
            headers.append(left_col_content[0])
        else:
            headers.append(Paragraph("", self.styles["CustomBody"]))

        if right_col_content:
            headers.append(right_col_content[0])
        else:
            headers.append(Paragraph("", self.styles["CustomBody"]))
        data.append(headers)

        content_row = []
        if left_col_content:
            content_row.append(left_col_content[1:])
        else:
            content_row.append(Paragraph("", self.styles["CustomBody"]))

        if right_col_content:
            content_row.append(right_col_content[1:])
        else:
            content_row.append(Paragraph("", self.styles["CustomBody"]))
        data.append(content_row)

        if qr_img is not None:
            qr_container = [
                Paragraph(
                    f"<b>{qr_label}</b>",
                    self.styles["CustomBody"],
                ),
                Spacer(1, 2 * mm),
                qr_img,
                Spacer(1, 1 * mm),
                Paragraph(
                    f"<font size=7><i>{qr_hint}</i></font>",
                    self.styles["CustomBody"],
                ),
            ]
            data.append([qr_container, Paragraph("", self.styles["CustomBody"])])

        table = Table(
            data,
            colWidths=[
                self.page_width * 0.5 - self.margin,
                self.page_width * 0.5 - self.margin,
            ],
        )

        table.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "BOTTOM"),
                    ("TOPPADDING", (0, 0), (-1, 0), 20),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 4),
                    ("BOTTOMPADDING", (0, 1), (-1, 1), 8),
                    ("TOPPADDING", (0, -1), (-1, -1), 4),
                ]
            )
        )

        return [table]

    def _build_section_tax_details(self, tax_details: list) -> list:
        """Build tax breakdown table."""
        usable_width = self.page_width - (self.margin * 2)

        # Prepare currency labels
        currency_code = "Kz"
        # We can try to get currency code from summary if needed, but for tax details Kz is usually standard for reporting

        data = [
            [
                Paragraph("Taxa %", self.styles["CustomTableHead"]),
                Paragraph(
                    f"Base de Incidência ({currency_code})",
                    self.styles["CustomTableHeadRight"],
                ),
                Paragraph(
                    f"Valor do IVA ({currency_code})",
                    self.styles["CustomTableHeadRight"],
                ),
            ]
        ]

        for detail in tax_details:
            # Determine label (Code or Exemption)
            tax_label = str(detail.taxRate)
            if hasattr(detail, "taxCode") and detail.taxCode:
                tax_label = f"{detail.taxCode} ({detail.taxRate}%)"

            row = [
                Paragraph(tax_label, self.styles["CustomBody"]),
                Paragraph(
                    self.format_currency(detail.taxableAmount),
                    self.styles["CustomTableData"],
                ),
                Paragraph(
                    self.format_currency(detail.taxAmount),
                    self.styles["CustomTableData"],
                ),
            ]

            data.append(row)

            # If there's an exemption reason, add a sub-row or smaller text
            if (
                hasattr(detail, "exemptionReason")
                and detail.exemptionReason
                and detail.taxRate == 0
            ):
                data.append(
                    [
                        Paragraph(
                            f"<font size=8 color=gray>Motivo: {detail.exemptionReason}</font>",
                            self.styles["CustomBody"],
                        ),
                        Paragraph("", self.styles["CustomBody"]),
                        Paragraph("", self.styles["CustomBody"]),
                    ]
                )

        # Use full width but with specific ratios to align with totals if possible,
        # or just visually distinct.
        # 20% Tax Rate, 40% Base, 40% Amount
        table = Table(
            data,
            colWidths=[
                usable_width * 0.20,
                usable_width * 0.40,
                usable_width * 0.40,
            ],
        )

        table.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LINEBELOW", (0, 0), (-1, 0), 0.5, SECONDARY_COLOR),
                    ("TOPPADDING", (0, 0), (-1, 0), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 6),
                    # Data rows
                    ("TOPPADDING", (0, 1), (-1, -1), 4),
                    ("BOTTOMPADDING", (0, 1), (-1, -1), 4),
                    ("ALIGN", (0, 0), (0, -1), "LEFT"),
                    ("ALIGN", (1, 0), (1, -1), "RIGHT"),
                    ("ALIGN", (2, 0), (2, -1), "RIGHT"),
                ]
            )
        )

        return [table]

    def _prepare_qr_code_data(self, header: dict, company: dict, footer: dict) -> str:
        """Prepare document verification URL for QR code."""
        try:
            base_url = os.getenv("BASE_URL", "http://localhost:3000")
            # Remove trailing slash if exists
            base_url = base_url.rstrip("/")

            document_token = header.get("verificationToken")

            if document_token:
                # Dynamic verification URL
                return f"{base_url}/api/v1/documents/verify/{document_token}?layout=a4"

            # Fallback to plain text data if no token
            return f"Doc: {header.get('documentNumber', 'N/A')} | Data: {header.get('issueDate', 'N/A')} | Total: {header.get('total', 'N/A')} | Emissor: {company.get('name', '')}"
        except Exception as e:
            logger.error(f"Error preparing QR code data: {str(e)}")
            return f"Factura: {header.get('documentNumber', 'Desconhecido')}"

    def _draw_page_decorations(self, canvas, doc):
        """Draw footer brand, AGT certification, and 'ANULADO' watermark."""
        self._draw_footer_brand(canvas, doc)
        self._draw_watermark(canvas, doc)

    def _draw_footer_brand(self, canvas, doc):
        """Draw the fixed software brand footer and AGT certification on every page."""
        canvas.saveState()
        canvas.setFont("Courier-Oblique", 7)
        canvas.setFillColorRGB(0.5, 0.5, 0.5)

        # Horizontal line
        canvas.setLineWidth(0.3)
        canvas.setStrokeColorRGB(0.5, 0.5, 0.5)
        canvas.line(18 * mm, 12 * mm, 192 * mm, 12 * mm)

        # Centered text - SOFTWARE BRAND
        footer_text = "Software de Gestão MINDGEST | Tel: +244 943 100 922 | E-mail: geral@mindware.ao"
        canvas.drawCentredString(self.page_width / 2.0, 8 * mm, footer_text)

        # AGT CERTIFICATION - MANDATORY FORMAT
        # Format: [Extracto] - Processado por programa válido n31.1/AGT/20
        hash_val = getattr(doc, "_invoice_hash", None)
        hash_extract = self._get_hash_extract(hash_val)

        agt_msg = f"{hash_extract} - {self.agt_certification}"
        canvas.setFont("Courier-Bold", 8)
        canvas.setFillColor(colors.black)
        canvas.drawCentredString(self.page_width / 2.0, 14 * mm, agt_msg)

        canvas.restoreState()

    def _draw_watermark(self, canvas, doc):
        """Draw 'ANULADO' watermark if applicable."""
        status = getattr(doc, "_invoice_status", None)
        if status == "CANCELLED":
            canvas.saveState()
            canvas.setFont("Courier-Bold", 60)
            canvas.setFillColorRGB(0.9, 0.2, 0.2, alpha=0.3)  # Light transparent red
            canvas.translate(self.page_width / 2, self.page_height / 2)
            canvas.rotate(45)
            canvas.drawCentredString(0, 0, "ANULADO")
            canvas.restoreState()

    # Adicionado helper para evitar erro se não estiver na BaseClass
    def format_currency(self, value: any, currency_code: str = "AOA") -> str:
        if value is None:
            value = 0.0
        formatted = (
            f"{value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
        )

        if currency_code == "AOA":
            return f"{formatted} Kz"
        elif currency_code:
            return f"{formatted} {currency_code}"
        return formatted
