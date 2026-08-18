from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
)
from reportlab.lib import colors
from reportlab.lib.enums import TA_RIGHT, TA_LEFT, TA_CENTER
from app.schemas import GenerateDocumentRequest
from app.modules.common.document_base import BaseDocumentGenerator
from app.modules.common.builders import DocumentBuilder
from app.modules.common.logger import get_logger
from app.modules.common.utils import generate_filename, get_temp_file_path

logger = get_logger(__name__)

# Brand Colors (MindGest)
PRIMARY_PURPLE = colors.HexColor("#712467")
SECONDARY_PURPLE = colors.HexColor("#A855F7")
TEXT_DARK = colors.HexColor("#1e293b")
TEXT_LIGHT = colors.HexColor("#64748b")
BG_LIGHT = colors.HexColor("#f8fafc")


class SubscriptionInvoiceGenerator(BaseDocumentGenerator):
    """
    Generator specifically for Subscription Invoices (Proof of Payment).
    Uses a cleaner, modern layout with brand colors.
    """

    def __init__(self):
        super().__init__()
        self.page_width, self.page_height = A4
        self.margin = 20 * mm
        self.styles = getSampleStyleSheet()
        self._setup_custom_styles()

    def _setup_custom_styles(self):
        """Setup custom paragraph styles using Helvetica (Cleaner than Courier)."""

        # Base Font
        font_name = "Helvetica"
        font_bold = "Helvetica-Bold"

        self.styles.add(
            ParagraphStyle(
                name="BrandTitle",
                parent=self.styles["Heading1"],
                fontSize=24,
                textColor=PRIMARY_PURPLE,
                fontName=font_bold,
                spaceAfter=12,
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="SectionTitle",
                parent=self.styles["Heading2"],
                fontSize=12,
                textColor=TEXT_LIGHT,
                fontName=font_bold,
                spaceBefore=12,
                spaceAfter=6,
                textTransform="uppercase",
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="NormalText",
                parent=self.styles["Normal"],
                fontSize=10,
                textColor=TEXT_DARK,
                fontName=font_name,
                leading=14,
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="BoldText",
                parent=self.styles["NormalText"],
                fontName=font_bold,
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="TableHeader",
                parent=self.styles["Normal"],
                fontSize=9,
                textColor=colors.white,
                fontName=font_bold,
                alignment=TA_LEFT,
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="TableData",
                parent=self.styles["Normal"],
                fontSize=10,
                textColor=TEXT_DARK,
                fontName=font_name,
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="TotalLabel",
                parent=self.styles["Normal"],
                fontSize=12,
                textColor=TEXT_LIGHT,
                fontName=font_name,
                alignment=TA_RIGHT,
            )
        )

        self.styles.add(
            ParagraphStyle(
                name="TotalValue",
                parent=self.styles["Normal"],
                fontSize=16,
                textColor=PRIMARY_PURPLE,
                fontName=font_bold,
                alignment=TA_RIGHT,
            )
        )

    async def generate(self, request: GenerateDocumentRequest) -> Path:
        """Generate Subscription Invoice PDF."""
        try:
            context = DocumentBuilder.build_document_context(request)
            filename = generate_filename("SUB_INV", request.invoiceNumber, "pdf")
            filepath = get_temp_file_path(filename)

            doc = SimpleDocTemplate(
                str(filepath),
                pagesize=A4,
                rightMargin=self.margin,
                leftMargin=self.margin,
                topMargin=self.margin,
                bottomMargin=self.margin,
            )

            story = []

            # 1. Header (Brand Title & Invoice Info)
            story.append(Paragraph("MindGest", self.styles["BrandTitle"]))
            story.append(Spacer(1, 5 * mm))

            # Invoice Info Table (Right aligned technically, but simple Layout)
            story.extend(self._build_header_info(request))
            story.append(Spacer(1, 10 * mm))

            # 2. Billed To (Company)
            story.append(Paragraph("Faturado a:", self.styles["SectionTitle"]))
            story.extend(self._build_company_info(context["company"]))
            story.append(Spacer(1, 10 * mm))

            # 3. Items Table
            story.extend(self._build_items_table(context["items"]))
            story.append(Spacer(1, 5 * mm))

            # 4. Totals
            story.extend(self._build_totals(context["summary"]))
            story.append(Spacer(1, 15 * mm))

            # 5. Footer / Payment Proof Note
            story.append(
                Paragraph("Comprovativo de Pagamento", self.styles["SectionTitle"])
            )
            story.append(
                Paragraph(
                    "Este documento serve como comprovativo de subscrição e pagamento do serviço MindGest. "
                    "Obrigado pela sua preferência.",
                    self.styles["NormalText"],
                )
            )

            doc.build(story)
            return filepath

        except Exception as e:
            logger.error(
                f"Error generating Subscription Invoice: {str(e)}", exc_info=True
            )
            raise

    def _build_header_info(self, request: GenerateDocumentRequest):
        data = [
            [
                Paragraph("Factura Nº:", self.styles["BoldText"]),
                Paragraph(request.invoiceNumber, self.styles["NormalText"]),
            ],
            [
                Paragraph("Data:", self.styles["BoldText"]),
                Paragraph(
                    request.invoiceDate.strftime("%d/%m/%Y"), self.styles["NormalText"]
                ),
            ],
            [
                Paragraph("Vencimento:", self.styles["BoldText"]),
                Paragraph(
                    request.dueDate.strftime("%d/%m/%Y") if request.dueDate else "-",
                    self.styles["NormalText"],
                ),
            ],
        ]
        t = Table(data, colWidths=[30 * mm, 50 * mm], hAlign="LEFT")
        t.setStyle(
            TableStyle(
                [
                    ("VALIGN", (0, 0), (-1, -1), "TOP"),
                    ("LEFTPADDING", (0, 0), (-1, -1), 0),
                ]
            )
        )
        return [t]

    def _build_company_info(self, company: dict):
        info = []
        if company.get("name"):
            info.append(Paragraph(company.get("name"), self.styles["BoldText"]))
        if company.get("taxNumber"):
            info.append(
                Paragraph(f"NIF: {company.get('taxNumber')}", self.styles["NormalText"])
            )
        if company.get("address"):
            info.append(Paragraph(company.get("address"), self.styles["NormalText"]))
        return info

    def _build_items_table(self, items: list):
        # Header
        data = [
            [
                Paragraph("Descrição", self.styles["TableHeader"]),
                Paragraph("Período", self.styles["TableHeader"]),
                Paragraph("Total", self.styles["TableHeader"]),
            ]
        ]

        for item in items:
            data.append(
                [
                    Paragraph(item["description"], self.styles["TableData"]),
                    Paragraph(f"{item['quantity']} Meses", self.styles["TableData"]),
                    Paragraph(
                        f"{item['totalPrice']:.2f} AOA", self.styles["TableData"]
                    ),
                ]
            )

        t = Table(data, colWidths=[90 * mm, 40 * mm, 40 * mm])
        t.setStyle(
            TableStyle(
                [
                    ("BACKGROUND", (0, 0), (-1, 0), PRIMARY_PURPLE),
                    ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                    ("BOTTOMPADDING", (0, 0), (-1, 0), 8),
                    ("TOPPADDING", (0, 0), (-1, 0), 8),
                    ("ALIGN", (0, 0), (-1, -1), "LEFT"),
                    ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
                ]
            )
        )
        return [t]

    def _build_totals(self, summary: dict):
        total = summary.get("total", 0)
        data = [
            [
                Paragraph("Total a Pagar:", self.styles["TotalLabel"]),
                Paragraph(f"{total:.2f} AOA", self.styles["TotalValue"]),
            ]
        ]
        t = Table(data, colWidths=[130 * mm, 40 * mm])
        t.setStyle(
            TableStyle(
                [
                    ("ALIGN", (0, 0), (-1, -1), "RIGHT"),
                    ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ]
            )
        )
        return [t]
