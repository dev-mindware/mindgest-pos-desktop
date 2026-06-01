from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import qrcode
import os
from pathlib import Path
from typing import Tuple
from app.modules.common.document_base import BaseDocumentGenerator
from app.modules.common.utils import (
    generate_filename,
    get_temp_file_path,
    download_image_from_url,
    save_base64_image,
)
from app.schemas import GenerateDocumentRequest, DocumentType
from app.config.logo_config import LogoManager
from PIL import Image as PILImage, ImageDraw
from io import BytesIO


class ThermalPDFGenerator(BaseDocumentGenerator):
    def __init__(self, width_mm: int = 80):
        super().__init__()
        self.width = width_mm * mm
        self.left_m = 6 * mm
        self.right_m = self.width - 6 * mm

    def format_currency_thermal(self, value: float) -> str:
        if value is None:
            value = 0.0
        return f"{value:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")

    def _build_qr_data(self, request: GenerateDocumentRequest) -> Tuple[Optional[str], bool, str]:
        fiscal_qr_path = save_base64_image(request.qrCode, prefix="thermal_fiscal_qr")
        if fiscal_qr_path:
            return str(fiscal_qr_path), False, ""

        base_url = os.getenv("BASE_URL", "http://localhost:3000").rstrip("/")
        document_token = getattr(request, "verificationToken", None)
        qr_data = (
            f"{base_url}/api/v1/documents/verify/{document_token}?layout=thermal"
            if document_token
            else f"ID:{request.invoiceNumber}"
        )
        return None, True, qr_data

    def _render_qr_code(self, qr_data: str, request: GenerateDocumentRequest, qr_path: str) -> str:
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=2,
        )
        qr.add_data(qr_data)
        qr.make(fit=True)

        img_qr = qr.make_image(fill_color="black", back_color="white").convert("RGB")
        logo_path = None

        if request.company.logo:
            logo_path = download_image_from_url(request.company.logo)

        if not logo_path or not logo_path.exists():
            logo_path = Path("assets/logos/mindware-logo.jpeg").resolve()

        if logo_path and logo_path.exists():
            try:
                logo = PILImage.open(str(logo_path)).convert("RGBA")
                qr_width, qr_height = img_qr.size
                logo_max_size = int(qr_width * 0.28)
                logo.thumbnail((logo_max_size, logo_max_size), PILImage.Resampling.LANCZOS)
                logo_w, logo_h = logo.size

                mask = PILImage.new("L", (logo_w, logo_h), 0)
                draw = ImageDraw.Draw(mask)
                radius = int(min(logo_w, logo_h) * 0.20)
                draw.rounded_rectangle([(0, 0), (logo_w, logo_h)], radius=radius, fill=255)

                pos = ((qr_width - logo_w) // 2, (qr_height - logo_h) // 2)
                img_qr.paste(logo, pos, mask=mask)
            except Exception as e:
                print(f"DEBUG: Failed to embed logo in thermal QR: {str(e)}")

        img_qr.save(qr_path)
        return qr_path

    def _draw_header(self, c, request: GenerateDocumentRequest, y: float) -> float:
        logo_drawn = False
        if request.company.logo:
            header_logo_path = download_image_from_url(request.company.logo)
            if header_logo_path and header_logo_path.exists():
                try:
                    c.drawImage(
                        str(header_logo_path),
                        self.left_m,
                        y - 5 * mm,
                        width=8 * mm,
                        height=8 * mm,
                        mask="auto",
                    )
                    logo_drawn = True
                except Exception as e:
                    print(f"Failed to draw header logo: {e}")

        if not logo_drawn:
            c.setFillColorRGB(0, 0, 0)
            c.rect(self.left_m, y - 5 * mm, 8 * mm, 8 * mm, fill=1)
            c.setFillColorRGB(1, 1, 1)
            c.setFont("Helvetica-Bold", 18)
            display_letter = request.company.name[0] if request.company.name else "M"
            c.drawString(self.left_m + 1.5 * mm, y - 3.5 * mm, display_letter)

        c.setFillColorRGB(0, 0, 0)
        y -= 10 * mm
        return y

    def _draw_metadata(self, c, request: GenerateDocumentRequest, y: float, titulo: str) -> float:
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(self.width / 2, y, titulo)
        y -= 6 * mm

        if request.documentType == DocumentType.PROFORMA_INVOICE:
            c.setFont("Helvetica-Oblique", 7)
            c.drawCentredString(self.width / 2, y, "Este documento não serve de factura")
            y -= 5 * mm

        y -= 2 * mm
        c.setFont("Helvetica", 8)
        c.drawString(self.left_m, y, f"{titulo} Nº: {request.invoiceNumber}")
        y -= 4 * mm
        c.drawString(
            self.left_m,
            y,
            f"Data de Emissão: {request.invoiceDate.strftime('%d/%m/%Y %H:%M:%S')}",
        )
        if request.dueDate:
            y -= 4 * mm
            c.drawString(
                self.left_m,
                y,
                f"Data de Vencimento: {request.dueDate.strftime('%d/%m/%Y')}",
            )

        y -= 4 * mm
        period = request.period if request.period else request.invoiceDate.month
        c.drawString(self.left_m, y, f"Período Contabilístico: {period}")
        y -= 8 * mm
        return y

    def _draw_party_info(self, c, request: GenerateDocumentRequest, y: float) -> float:
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.left_m, y, "DE:")
        y -= 4 * mm
        c.setFont("Helvetica", 8)
        company_details = [
            request.company.name,
            request.company.email,
            request.company.phone,
            request.company.address,
            f"NIF: {request.company.taxNumber}",
        ]
        for detail in [d for d in company_details if d]:
            c.drawString(self.left_m, y, detail)
            y -= 3.8 * mm

        y -= 4 * mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.left_m, y, "PARA:")
        y -= 4 * mm
        c.setFont("Helvetica", 8)
        client_details = [
            request.client.name,
            request.client.email,
            request.client.address,
            f"NIF: {request.client.taxNumber}",
        ]
        for detail in [d for d in client_details if d]:
            c.drawString(self.left_m, y, detail)
            y -= 3.8 * mm

        return y

    def _draw_items_table(self, c, request: GenerateDocumentRequest, y: float) -> float:
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.left_m, y, "Descrição")
        c.drawString(self.left_m + 40 * mm, y, "IVA%")
        c.drawRightString(self.right_m, y, "Total")
        y -= 2 * mm
        c.setLineWidth(0.2)
        c.line(self.left_m, y, self.right_m, y)
        y -= 5 * mm

        for item in request.items:
            c.setFont("Helvetica", 8)
            c.drawString(self.left_m, y, item.description)
            c.drawString(self.left_m + 40 * mm, y, str(int(item.tax)))
            c.drawRightString(self.right_m, y, self.format_currency_thermal(item.totalPrice))
            y -= 3.5 * mm
            c.setFont("Helvetica", 7)
            calc_line = f"({int(item.quantity)} x {self.format_currency_thermal(item.unitPrice)})"
            c.drawString(self.left_m, y, calc_line)
            y -= 3.5 * mm

        return y

    def _draw_tax_details(self, c, request: GenerateDocumentRequest, y: float) -> float:
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.left_m, y, "Taxa %")
        c.drawString(self.left_m + 20 * mm, y, "Incidência")
        c.drawRightString(self.right_m, y, "Valor IVA")
        y -= 2 * mm
        c.setLineWidth(0.2)
        y -= 2 * mm

        for tax_detail in request.taxDetails:
            c.setFont("Helvetica", 8)
            c.drawString(self.left_m, y, str(int(tax_detail.taxRate)))
            c.drawString(
                self.left_m + 20 * mm,
                y,
                self.format_currency_thermal(tax_detail.taxableAmount),
            )
            c.drawRightString(
                self.right_m,
                y,
                self.format_currency_thermal(tax_detail.taxAmount),
            )
            y -= 3.5 * mm

        return y

    def _draw_totals(self, c, request: GenerateDocumentRequest, y: float) -> float:
        c.line(self.left_m, y, self.right_m, y)
        y -= 5 * mm
        c.setFont("Helvetica", 8)
        c.drawString(self.left_m, y, "Subtotal")
        c.drawRightString(self.right_m, y, self.format_currency_thermal(request.subtotal))
        y -= 4 * mm
        c.drawString(self.left_m, y, "Impostos")
        c.drawRightString(self.right_m, y, self.format_currency_thermal(request.tax))

        if request.discountAmount and request.discountAmount > 0:
            y -= 4 * mm
            c.drawString(self.left_m, y, "Desconto")
            c.drawRightString(
                self.right_m,
                y,
                self.format_currency_thermal(request.discountAmount),
            )

        y -= 5 * mm
        c.setFont("Helvetica-Bold", 10)
        c.drawString(self.left_m, y, "TOTAL")
        c.drawRightString(self.right_m, y, self.format_currency_thermal(request.total))
        return y

    def _draw_notes(self, c, request: GenerateDocumentRequest, y: float) -> float:
        if request.paymentTerms or request.notes:
            y -= 6 * mm
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.left_m, y, "Notas/Condições de Pagamento")
            y -= 4 * mm
            c.setFont("Helvetica", 8)
            import textwrap

            notes_text = f"{request.paymentTerms or ''} {request.notes or ''}".strip()
            for line in textwrap.wrap(notes_text, width=45):
                c.drawString(self.left_m, y, line)
                y -= 3.5 * mm

        return y

    def _draw_footer(self, c, request: GenerateDocumentRequest, qr_path: str, calc_h: float) -> None:
        c.drawImage(
            qr_path, (self.width / 2) - 15 * mm, 15 * mm, width=30 * mm, height=30 * mm
        )

        y_credits = 10 * mm
        cert_no = "FE/332/AGT/2026"
        legal_msg = f"Processado por programa certificado n.º {cert_no}/AGT/2026"
        c.drawCentredString(self.width / 2, y_credits - 4 * mm, legal_msg)
        c.drawCentredString(self.width / 2, y_credits - 7 * mm, "Mindgest-API v1.0")

        c.setFont("Helvetica", 6)
        c.setFillColorRGB(0, 0, 0)
        hash_extract = self._get_hash_extract(request.hash)
        c.drawCentredString(self.width / 2, y_credits + 3 * mm, f"Hash: {hash_extract}")

        c.setFont("Helvetica-Oblique", 6)
        c.setFillColorRGB(0.3, 0.3, 0.3)
        c.drawCentredString(
            self.width / 2,
            y_credits,
            "Tel: +244 926 665 793 | minwareofficial@gmail.com",
        )

        if request.status == "CANCELLED":
            c.saveState()
            c.setFont("Helvetica-Bold", 40)
            c.setFillColorRGB(0.8, 0, 0)
            c.setFillAlpha(0.3)
            c.translate(self.width / 2, calc_h / 2)
            c.rotate(45)
            c.drawCentredString(0, 0, "ANULADO")
            c.restoreState()

    async def generate(self, request: GenerateDocumentRequest) -> Path:
        filename = generate_filename(
            request.documentType.value, request.invoiceNumber, "pdf"
        )
        output_path = get_temp_file_path(filename)

        # Cálculo de Altura Dinâmica
        # Aumentamos footer_h de 75 para 85mm para caber os créditos da Mindware com folga
        header_h = 115 * mm
        item_h = 10 * mm
        footer_h = 80 * mm
        calc_h = header_h + (len(request.items) * item_h) + footer_h

        c = canvas.Canvas(str(output_path), pagesize=(self.width, calc_h))
        y = calc_h - 15 * mm

        # Diferenciação de Título e Valor Fiscal
        is_proforma = request.documentType == DocumentType.PROFORMA_INVOICE
        titulo = "FACTURA PROFORMA" if is_proforma else "FACTURA RECIBO"

        # 2. QR Code Generation (Dynamic URL + Embedded Logo)
        safe_invoice_number = request.invoiceNumber.replace("/", "_").replace("\\", "_")
        qr_path = str(get_temp_file_path(f"temp_qr_{safe_invoice_number}.png"))

        fiscal_qr_path = save_base64_image(request.qrCode, prefix="thermal_fiscal_qr")
        if fiscal_qr_path:
            # Overwrite qr_path with the fiscal one
            qr_path = str(fiscal_qr_path)
            # Skip the generation logic below by using a flag
            generate_qr = False
        else:
            generate_qr = True
            base_url = os.getenv("BASE_URL", "http://localhost:3000").rstrip("/")
            document_token = getattr(
                request, "verificationToken", None
            )  # Using getattr just in case

            qr_data = (
                f"{base_url}/api/v1/documents/verify/{document_token}?layout=thermal"
                if document_token
                else f"ID:{request.invoiceNumber}"
            )

        if generate_qr:
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_H,
                box_size=10,
                border=2,
            )
            qr.add_data(qr_data)
            qr.make(fit=True)

            img_qr = qr.make_image(fill_color="black", back_color="white").convert("RGB")

            # Embed Logo (Priority: Company Logo > Mindware Logo)
            logo_path = None

            # 1. Try Company Logo
            if request.company.logo:
                logo_path = download_image_from_url(request.company.logo)

            # 2. Fallback to Mindware Logo
            if not logo_path or not logo_path.exists():
                logo_path = Path("assets/logos/mindware-logo.jpeg").resolve()

            if logo_path and logo_path.exists():
                try:
                    logo = PILImage.open(str(logo_path)).convert("RGBA")
                    qr_width, qr_height = img_qr.size
                    logo_max_size = int(qr_width * 0.28)
                    # Resize logo maintaining aspect ratio
                    logo.thumbnail(
                        (logo_max_size, logo_max_size), PILImage.Resampling.LANCZOS
                    )
                    logo_w, logo_h = logo.size

                    # Create rounded mask
                    mask = PILImage.new("L", (logo_w, logo_h), 0)
                    draw = ImageDraw.Draw(mask)
                    # Radius ~20% of smaller dimension
                    radius = int(min(logo_w, logo_h) * 0.20)
                    draw.rounded_rectangle(
                        [(0, 0), (logo_w, logo_h)], radius=radius, fill=255
                    )

                    pos = ((qr_width - logo_w) // 2, (qr_height - logo_h) // 2)
                    img_qr.paste(logo, pos, mask=mask)
                except Exception as e:
                    print(f"DEBUG: Failed to embed logo in thermal QR: {str(e)}")

            img_qr.save(qr_path)

        # Cabeçalho e Logo do Cliente
        logo_drawn = False
        if request.company.logo:
            # We might have downloaded it already for QR, but filename is lost unless we refactor.
            # Downloading again for simplicity (small file).
            header_logo_path = download_image_from_url(request.company.logo)
            if header_logo_path and header_logo_path.exists():
                try:
                    c.drawImage(
                        str(header_logo_path),
                        self.left_m,
                        y - 5 * mm,
                        width=8 * mm,
                        height=8 * mm,
                        mask="auto",
                    )
                    logo_drawn = True
                except Exception as e:
                    print(f"Failed to draw header logo: {e}")

        if not logo_drawn:
            c.setFillColorRGB(0, 0, 0)
            c.rect(self.left_m, y - 5 * mm, 8 * mm, 8 * mm, fill=1)
            c.setFillColorRGB(1, 1, 1)
            c.setFont("Helvetica-Bold", 18)
            # Tenta pegar a primeira letra do nome da empresa do cliente
            display_letter = request.company.name[0] if request.company.name else "M"
            c.drawString(self.left_m + 1.5 * mm, y - 3.5 * mm, display_letter)

        c.setFillColorRGB(0, 0, 0)
        y -= 10 * mm

        # Título Dinâmico
        c.setFont("Helvetica-Bold", 10)
        c.drawCentredString(self.width / 2, y, titulo)
        y -= 6 * mm

        if is_proforma:
            c.setFont("Helvetica-Oblique", 7)
            c.drawCentredString(
                self.width / 2, y, "Este documento não serve de factura"
            )
            y -= 5 * mm

        y -= 2 * mm

        # Metadados da Factura
        c.setFont("Helvetica", 8)
        c.drawString(self.left_m, y, f"{titulo} Nº: {request.invoiceNumber}")
        y -= 4 * mm
        c.drawString(
            self.left_m,
            y,
            f"Data de Emissão: {request.invoiceDate.strftime('%d/%m/%Y %H:%M:%S')}",
        )
        if request.dueDate:
            y -= 4 * mm
            c.drawString(
                self.left_m,
                y,
                f"Data de Vencimento: {request.dueDate.strftime('%d/%m/%Y')}",
            )

        # Período Contabilístico (AGT)
        y -= 4 * mm
        period = request.period if request.period else request.invoiceDate.month
        c.drawString(self.left_m, y, f"Período Contabilístico: {period}")

        # Informações do Emissor (DE:)
        y -= 8 * mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.left_m, y, "DE:")
        y -= 4 * mm
        c.setFont("Helvetica", 8)
        company_details = [
            request.company.name,
            request.company.email,
            request.company.phone,
            request.company.address,
            f"NIF: {request.company.taxNumber}",
        ]
        for detail in [d for d in company_details if d]:
            c.drawString(self.left_m, y, detail)
            y -= 3.8 * mm

        # Informações do Cliente (PARA:)
        y -= 4 * mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.left_m, y, "PARA:")
        y -= 4 * mm
        c.setFont("Helvetica", 8)
        client_details = [
            request.client.name,
            request.client.email,
            request.client.address,
            f"NIF: {request.client.taxNumber}",
        ]
        for detail in [d for d in client_details if d]:
            c.drawString(self.left_m, y, detail)
            y -= 3.8 * mm

        # Tabela de Itens
        y -= 4 * mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.left_m, y, "Descrição")
        c.drawString(self.left_m + 40 * mm, y, "IVA%")
        c.drawRightString(self.right_m, y, "Total")
        y -= 2 * mm
        c.setLineWidth(0.2)
        c.line(self.left_m, y, self.right_m, y)
        y -= 5 * mm

        for item in request.items:
            c.setFont("Helvetica", 8)
            c.drawString(self.left_m, y, item.description)
            c.drawString(self.left_m + 40 * mm, y, str(int(item.tax)))
            c.drawRightString(
                self.right_m, y, self.format_currency_thermal(item.totalPrice)
            )
            y -= 3.5 * mm
            c.setFont("Helvetica", 7)
            calc_line = f"({int(item.quantity)} x {self.format_currency_thermal(item.unitPrice)})"
            c.drawString(self.left_m, y, calc_line)
            y -= 3.5 * mm

        # Detalhes do Imposto
        y -= 4 * mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.left_m, y, "Taxa %")
        c.drawString(self.left_m + 20 * mm, y, "Incidência")
        c.drawRightString(self.right_m, y, "Valor IVA")
        y -= 2 * mm
        c.setLineWidth(0.2)
        y -= 2 * mm

        for tax_detail in request.taxDetails:
            c.setFont("Helvetica", 8)
            c.drawString(self.left_m, y, str(int(tax_detail.taxRate)))
            c.drawString(
                self.left_m + 20 * mm,
                y,
                self.format_currency_thermal(tax_detail.taxableAmount),
            )
            c.drawRightString(
                self.right_m,
                y,
                self.format_currency_thermal(tax_detail.taxAmount),
            )
            y -= 3.5 * mm

        # Totais Financeiros
        c.line(self.left_m, y, self.right_m, y)
        y -= 5 * mm
        c.setFont("Helvetica", 8)
        c.drawString(self.left_m, y, "Subtotal")
        c.drawRightString(
            self.right_m, y, self.format_currency_thermal(request.subtotal)
        )
        y -= 4 * mm
        c.drawString(self.left_m, y, "Impostos")
        c.drawRightString(self.right_m, y, self.format_currency_thermal(request.tax))

        if request.discountAmount and request.discountAmount > 0:
            y -= 4 * mm
            c.drawString(self.left_m, y, "Desconto")
            c.drawRightString(
                self.right_m, y, self.format_currency_thermal(request.discountAmount)
            )

        y -= 5 * mm
        c.setFont("Helvetica-Bold", 10)
        c.drawString(self.left_m, y, "TOTAL")
        c.drawRightString(self.right_m, y, self.format_currency_thermal(request.total))

        # Detalhes de Pagamento e Notas
        if request.paymentTerms or request.notes:
            y -= 6 * mm
            c.setFont("Helvetica-Bold", 8)
            c.drawString(self.left_m, y, "Notas/Condições de Pagamento")
            y -= 4 * mm
            c.setFont("Helvetica", 8)
            import textwrap

            notes_text = f"{request.paymentTerms or ''} {request.notes or ''}".strip()
            for line in textwrap.wrap(notes_text, width=45):
                c.drawString(self.left_m, y, line)
                y -= 3.5 * mm

        # Ajuste do y para o QR Code (garante que não sobreponha)
        y -= 35 * mm

        # QR Code de Verificação
        c.drawImage(
            qr_path, (self.width / 2) - 15 * mm, 15 * mm, width=30 * mm, height=30 * mm
        )

        # Legal Message
        y_credits = 10 * mm
        cert_no = "FE/332/AGT/2026"  # TODO: Substituir pelo número real quando disponível
        legal_msg = f"Processado por programa certificado n.º {cert_no}/AGT/2026"
        c.drawCentredString(self.width / 2, y_credits - 4 * mm, legal_msg)
        c.drawCentredString(self.width / 2, y_credits - 7 * mm, "Mindgest-API v1.0")
       

        # --- AGT CERTIFICAÇÃO (Footer Legal) ---
        y_agt = y_credits - 4 * mm
        c.setFont("Helvetica", 6)
        c.setFillColorRGB(0, 0, 0)

        # Hash Extract (4 chars)
        hash_extract = self._get_hash_extract(request.hash)
        c.drawCentredString(self.width / 2, y_credits + 3 * mm, f"Hash: {hash_extract}")

        # --- MARCA MINDWARE (Créditos do Software) ---
        # Posicionado bem no fim, de forma discreta e elegante
        c.setFont("Helvetica-Oblique", 6)
        c.setFillColorRGB(0.3, 0.3, 0.3)  # Cinza escuro para ser discreto
        c.drawCentredString(
            self.width / 2,
            y_credits,
            "Tel: +244 926 665 793 | minwareofficial@gmail.com",
        )

        # --- MARCA D'ÁGUA "ANULADO" ---
        if request.status == "CANCELLED":
            c.saveState()
            c.setFont("Helvetica-Bold", 40)
            c.setFillColorRGB(0.8, 0, 0)  # Vermelho
            c.setFillAlpha(0.3)
            c.translate(self.width / 2, calc_h / 2)
            c.rotate(45)
            c.drawCentredString(0, 0, "ANULADO")
            c.restoreState()

        c.save()
        if os.path.exists(qr_path):
            os.remove(qr_path)

        return output_path
