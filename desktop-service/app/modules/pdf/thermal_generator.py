from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.units import mm
import qrcode
import os
from pathlib import Path
from app.modules.common.document_base import BaseDocumentGenerator
from app.modules.common.utils import (
    generate_filename,
    get_temp_file_path,
    download_image_from_url,
    save_base64_image,
    overlay_logo_on_qr,
    get_first_and_last_name,
)
from app.schemas import GenerateDocumentRequest, DocumentType
from app.config.logo_config import LogoManager
# pyrefly: ignore [missing-import]
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

    async def generate(self, request: GenerateDocumentRequest) -> Path:
        filename = generate_filename(
            request.documentType.value, request.invoiceNumber, "pdf"
        )
        output_path = get_temp_file_path(filename)

        # Cálculo de Altura Dinâmica
        is_proforma = request.documentType == DocumentType.PROFORMA_INVOICE
        titulo = "FACTURA PROFORMA" if is_proforma else "FACTURA RECIBO"

        company_details_count = len([d for d in [
            request.company.name,
            request.company.email,
            request.company.phone,
            request.company.address,
            f"NIF: {request.company.taxNumber}"
        ] if d])
        client_details_count = len([d for d in [
            request.client.name,
            request.client.email,
            request.client.address,
            f"NIF: {request.client.taxNumber}"
        ] if d])

        header_height = (
            25 * mm # Logo & Title
            + (12 * mm if is_proforma else 9 * mm) # Metadata & Period
            + 8 * mm + (company_details_count * 3.0 * mm) # Issuer DE
            + 6 * mm + (client_details_count * 3.0 * mm) # Client PARA
            + 8 * mm # Items header
        )

        items_height = len(request.items) * 5.6 * mm

        tax_details_height = 0
        if request.taxDetails:
            tax_details_height = 5 * mm + (len(request.taxDetails) * 2.8 * mm)

        totals_height = 12 * mm
        if request.discountAmount and request.discountAmount > 0:
            totals_height += 3 * mm
        if request.retentionAmount and request.retentionAmount > 0:
            totals_height += 3 * mm

        notes_height = 0
        if request.paymentTerms or request.notes:
            notes_text = f"{request.paymentTerms or ''} {request.notes or ''}".strip()
            import textwrap
            notes_lines = len(textwrap.wrap(notes_text, width=55))
            # +3mm for the extra gap above the notes heading
            notes_height = 9 * mm + (notes_lines * 2.8 * mm)

        qr_height = 28 * mm   # y-descent used before drawing the 22mm QR
        legal_height = 15 * mm  # 4mm gap + ~10.5mm for 4 legal credit lines

        calc_h = header_height + items_height + tax_details_height + totals_height + notes_height + qr_height + legal_height

        c = canvas.Canvas(str(output_path), pagesize=(self.width, calc_h))
        y = calc_h - 10 * mm

        # 2. QR Code Generation (Dynamic URL + Embedded Logo)
        safe_invoice_number = request.invoiceNumber.replace("/", "_").replace("\\", "_")
        qr_path = str(get_temp_file_path(f"temp_qr_{safe_invoice_number}.png"))

        fiscal_qr_path = save_base64_image(request.qrCode, prefix="thermal_fiscal_qr")
        if fiscal_qr_path:
            # Overwrite qr_path with the fiscal one
            qr_path = str(fiscal_qr_path)
            # Center the company logo/initials inside the fiscal QR code
            overlay_logo_on_qr(fiscal_qr_path, request.company.logo, request.company.name)
            # Skip the generation logic below by using a flag
            generate_qr = False
        else:
            generate_qr = True
            base_url = os.getenv("BASE_URL", "0https://mindgest.mindware-vps.cloud").rstrip("/")
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

            qr_width, qr_height = img_qr.size
            logo_max_size = int(qr_width * 0.28)
            badge_size = logo_max_size
            radius = 0

            try:
                if logo_path and logo_path.exists():
                    logo = PILImage.open(str(logo_path)).convert("RGBA")
                    # Trim transparent margins/borders if any
                    bbox = logo.getbbox()
                    if bbox:
                        logo = logo.crop(bbox)

                    # Add 4px padding inside the white rounded badge
                    padding = 4
                    logo_inner_size = max(1, badge_size - (padding * 2))
                    
                    # Resize logo maintaining aspect ratio
                    logo.thumbnail(
                        (logo_inner_size, logo_inner_size), PILImage.Resampling.LANCZOS
                    )
                    logo_w, logo_h = logo.size

                    # Create a white background of a perfect square shape
                    logo_bg = PILImage.new("RGBA", (badge_size, badge_size), (255, 255, 255, 255))
                    
                    # Center the logo inside the square badge
                    logo_x = (badge_size - logo_w) // 2
                    logo_y = (badge_size - logo_h) // 2
                    
                    # Use logo's own alpha channel as mask if it exists
                    logo_mask = logo.split()[3] if len(logo.split()) == 4 else None
                    logo_bg.paste(logo, (logo_x, logo_y), mask=logo_mask)
                else:
                    # Fallback: Draw company initials on a square white background
                    logo_bg = PILImage.new("RGBA", (badge_size, badge_size), (255, 255, 255, 255))
                    draw_text = ImageDraw.Draw(logo_bg)
                    
                    # Extract initials
                    company_name = request.company.name or "MindGest"
                    words = [w for w in company_name.strip().split() if w]
                    initials = ""
                    if len(words) >= 2:
                        initials = (words[0][0] + words[1][0]).upper()
                    elif len(words) == 1:
                        initials = words[0][:2].upper()
                    else:
                        initials = "MG"
                        
                    # Load a nice system font
                    # pyrefly: ignore [missing-import]
                    from PIL import ImageFont
                    font_size = int(badge_size * 0.45)
                    font = None
                    standard_paths = [
                        "arial.ttf",
                        "calibri.ttf",
                        "DejaVuSans.ttf",
                        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
                        "/usr/share/fonts/TTF/DejaVuSans.ttf",
                    ]
                    for font_name in standard_paths:
                        try:
                            font = ImageFont.truetype(font_name, font_size)
                            break
                        except Exception:
                            continue
                    if not font:
                        font = ImageFont.load_default()
                        
                    # Center text
                    try:
                        bbox = draw_text.textbbox((0, 0), initials, font=font)
                        text_w = bbox[2] - bbox[0]
                        text_h = bbox[3] - bbox[1]
                    except AttributeError:
                        text_w, text_h = draw_text.textsize(initials, font=font)
                        
                    text_x = (badge_size - text_w) // 2
                    text_y = (badge_size - text_h) // 2 - int(text_h * 0.15) if font else (badge_size - text_h) // 2
                    
                    # Draw text in premium brand color (#712467)
                    draw_text.text((text_x, text_y), initials, fill=(113, 36, 103, 255), font=font)

                # Create rounded mask of badge size
                mask = PILImage.new("L", (badge_size, badge_size), 0)
                draw = ImageDraw.Draw(mask)
                draw.rounded_rectangle(
                    [(0, 0), (badge_size, badge_size)], radius=radius, fill=255
                )

                pos = ((qr_width - badge_size) // 2, (qr_height - badge_size) // 2)
                img_qr.paste(logo_bg, pos, mask=mask)
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
                        width=12 * mm,
                        height=12 * mm,
                        mask="auto",
                    )
                    logo_drawn = True
                except Exception as e:
                    print(f"Failed to draw header logo: {e}")

        if not logo_drawn:
            c.setFillColorRGB(0, 0, 0)
            c.rect(self.left_m, y - 5 * mm, 8 * mm, 8 * mm, fill=1)
            c.setFillColorRGB(1, 1, 1)
            c.setFont("Helvetica-Bold", 14)
            # Tenta pegar a primeira letra do nome da empresa do cliente
            display_letter = request.company.name[0] if request.company.name else "M"
            c.drawString(self.left_m + 1.5 * mm, y - 3.5 * mm, display_letter)

        c.setFillColorRGB(0, 0, 0)
        y -= 6 * mm

        # Título Dinâmico
        c.setFont("Helvetica-Bold", 8)
        c.drawCentredString(self.width / 2, y, titulo)
        y -= 4 * mm

        if is_proforma:
            c.setFont("Helvetica-Oblique", 6)
            c.drawCentredString(
                self.width / 2, y, "Este documento não serve de factura"
            )
            y -= 3 * mm

        y -= 1.5 * mm

        # Metadados da Factura
        c.setFont("Helvetica", 6.5)
        c.drawString(self.left_m, y, f"{titulo} Nº: {request.invoiceNumber}")
        y -= 3 * mm
        c.drawString(
            self.left_m,
            y,
            f"Data de Emissão: {request.invoiceDate.strftime('%d/%m/%Y %H:%M:%S')}",
        )
        if request.dueDate:
            y -= 3 * mm
            c.drawString(
                self.left_m,
                y,
                f"Data de Vencimento: {request.dueDate.strftime('%d/%m/%Y')}",
            )

        # Período Contabilístico (AGT)
        y -= 3 * mm
        period = request.period if request.period else request.invoiceDate.month
        c.drawString(self.left_m, y, f"Período Contabilístico: {period}")

        # Informações do Emissor (DE:)
        y -= 5 * mm
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(self.left_m, y, "DE:")
        y -= 3 * mm
        c.setFont("Helvetica", 6.5)
        company_details = [
            request.company.name,
            request.company.email,
            request.company.phone,
            request.company.address,
            f"NIF: {request.company.taxNumber}",
        ]
        for detail in [d for d in company_details if d]:
            c.drawString(self.left_m, y, detail)
            y -= 3.0 * mm

        # Informações do Cliente (PARA:)
        y -= 3 * mm
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(self.left_m, y, "PARA:")
        y -= 3 * mm
        c.setFont("Helvetica", 6.5)
        client_details = [
            request.client.name,
            request.client.email,
            request.client.address,
            f"NIF: {request.client.taxNumber}",
        ]
        for detail in [d for d in client_details if d]:
            c.drawString(self.left_m, y, detail)
            y -= 3.0 * mm

        # Tabela de Itens
        y -= 3 * mm
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(self.left_m, y, "Descrição")
        c.drawString(self.left_m + 40 * mm, y, "Taxa/Imp")
        c.drawRightString(self.right_m, y, "Total")
        y -= 1.5 * mm
        c.setLineWidth(0.2)
        c.line(self.left_m, y, self.right_m, y)
        y -= 3 * mm

        for item in request.items:
            c.setFont("Helvetica", 6.5)
            c.drawString(self.left_m, y, item.description)
            tax_type = getattr(item, "taxType", "IVA")
            tax_str = f"{tax_type} {int(item.tax)}%"
            c.drawString(self.left_m + 40 * mm, y, tax_str)
            c.drawRightString(
                self.right_m, y, self.format_currency_thermal(item.totalPrice)
            )
            y -= 2.8 * mm
            c.setFont("Helvetica", 5.5)
            calc_line = f"({int(item.quantity)} x {self.format_currency_thermal(item.unitPrice)})"
            c.drawString(self.left_m, y, calc_line)
            y -= 2.8 * mm

        # Detalhes do Imposto
        y -= 3 * mm
        c.setFont("Helvetica-Bold", 6.5)
        c.drawString(self.left_m, y, "Imposto/Taxa")
        c.drawString(self.left_m + 28 * mm, y, "Incidência")
        c.drawRightString(self.right_m, y, "Valor Imp.")
        y -= 1.5 * mm
        c.setLineWidth(0.2)
        y -= 1.5 * mm

        for tax_detail in request.taxDetails:
            c.setFont("Helvetica", 6.5)
            tax_type = getattr(tax_detail, "taxType", "IVA")
            tax_label = f"{tax_type} {int(tax_detail.taxRate)}%"
            if getattr(tax_detail, "taxCode", None):
                tax_label = f"{tax_detail.taxCode} - {tax_type} {int(tax_detail.taxRate)}%"
            c.drawString(self.left_m, y, tax_label)
            c.drawString(
                self.left_m + 28 * mm,
                y,
                self.format_currency_thermal(tax_detail.taxableAmount),
            )
            c.drawRightString(
                self.right_m,
                y,
                self.format_currency_thermal(tax_detail.taxAmount),
            )
            y -= 2.8 * mm

        # Totais Financeiros
        c.line(self.left_m, y, self.right_m, y)
        y -= 3.5 * mm
        c.setFont("Helvetica", 6.5)
        c.drawString(self.left_m, y, "Subtotal")
        c.drawRightString(
            self.right_m, y, self.format_currency_thermal(request.subtotal)
        )
        y -= 3 * mm
        c.drawString(self.left_m, y, "Impostos")
        c.drawRightString(self.right_m, y, self.format_currency_thermal(request.tax))

        if request.discountAmount and request.discountAmount > 0:
            y -= 3 * mm
            c.drawString(self.left_m, y, "Desconto")
            c.drawRightString(
                self.right_m, y, self.format_currency_thermal(request.discountAmount)
            )

        if request.retentionAmount and request.retentionAmount > 0:
            y -= 3 * mm
            percent_str = ""
            if request.subtotal and request.subtotal > 0:
                pct = round((request.retentionAmount / request.subtotal) * 100, 1)
                if pct.is_integer():
                    percent_str = f" ({int(pct)}%)"
                else:
                    percent_str = f" ({pct}%)"
            c.drawString(self.left_m, y, f"Retenção na Fonte{percent_str}")
            c.drawRightString(
                self.right_m, y, self.format_currency_thermal(request.retentionAmount)
            )

        y -= 3.5 * mm
        c.setFont("Helvetica-Bold", 8)
        c.drawString(self.left_m, y, "TOTAL")
        c.drawRightString(self.right_m, y, self.format_currency_thermal(request.total))

        if request.operatorName:
            y -= 3.5 * mm
            c.setFont("Helvetica-Bold", 6.5)
            short_operator = get_first_and_last_name(request.operatorName)
            c.drawRightString(self.right_m, y, f"Emitido por: {short_operator}")

        # Detalhes de Pagamento e Notas
        if request.paymentTerms or request.notes:
            y -= 7 * mm
            c.setFont("Helvetica-Bold", 6.5)
            c.drawString(self.left_m, y, "Notas/Condições de Pagamento")
            y -= 3 * mm
            c.setFont("Helvetica", 6.5)
            import textwrap

            notes_text = f"{request.paymentTerms or ''} {request.notes or ''}".strip()
            for line in textwrap.wrap(notes_text, width=55):
                c.drawString(self.left_m, y, line)
                y -= 2.8 * mm

        # Ajuste do y para o QR Code (garante que não sobreponha)
        y -= 26 * mm

        # QR Code de Verificação (22mm)
        c.drawImage(
            qr_path, (self.width / 2) - 11 * mm, y, width=22 * mm, height=22 * mm
        )

        # --- FOOTER LEGAL & CREDITS ---
        y_credits = y - 4 * mm
        
        # 1. AGT Certificação (Footer Legal)
        c.setFillColorRGB(0, 0, 0)
        
        # Hash Extract (4 chars)
        c.setFont("Helvetica", 5.7)
        hash_extract = self._get_hash_extract(request.hash)
        c.drawCentredString(self.width / 2, y_credits, f"Hash: {hash_extract}")

        # Legal Message
        cert_no = "FE/241/AGT/2026"
        legal_msg = f"Processado por programa certificado n.º {cert_no}"
        c.drawCentredString(self.width / 2, y_credits - 3.5 * mm, legal_msg)
        c.drawCentredString(self.width / 2, y_credits - 7 * mm, "Mindgest")

        # 2. Marca Mindware (Créditos do Software)
        c.setFont("Helvetica-Oblique", 5.7)
        c.setFillColorRGB(0.3, 0.3, 0.3)  # Cinza escuro para ser discreto
        c.drawCentredString(
            self.width / 2,
            y_credits - 10.5 * mm,
            "Tel: +244 943 100 922 | geral@mindware.ao",
        )

        # --- MARCA D'ÁGUA ---
        is_trial = request.metadata.get("isTrial", False) if request.metadata else False
        if request.status == "CANCELLED" and is_trial:
            c.saveState()
            c.setFont("Helvetica-Bold", 40)
            c.translate(self.width / 2, calc_h / 2)
            c.rotate(45)
            
            c.setFillColorRGB(0.8, 0, 0)
            c.setFillAlpha(0.25)
            c.drawCentredString(0, 25, "ANULADO")
            
            # Using primary brand color #712467: R=113/255=0.443, G=36/255=0.141, B=103/255=0.404
            c.setFillColorRGB(0.443, 0.141, 0.404)
            c.setFillAlpha(0.08)
            c.drawCentredString(0, -25, "TESTE TESTE")
            c.restoreState()
        elif request.status == "CANCELLED":
            c.saveState()
            c.setFont("Helvetica-Bold", 40)
            c.setFillColorRGB(0.8, 0, 0)  # Vermelho
            c.setFillAlpha(0.3)
            c.translate(self.width / 2, calc_h / 2)
            c.rotate(45)
            c.drawCentredString(0, 0, "ANULADO")
            c.restoreState()
        elif is_trial:
            c.saveState()
            c.setFont("Helvetica-Bold", 40)
            # Using primary brand color #712467: R=113/255=0.443, G=36/255=0.141, B=103/255=0.404
            c.setFillColorRGB(0.443, 0.141, 0.404)
            c.setFillAlpha(0.08)
            c.translate(self.width / 2, calc_h / 2)
            c.rotate(45)
            c.drawCentredString(0, 0, "TESTE TESTE")
            c.restoreState()

        c.save()
        if os.path.exists(qr_path):
            os.remove(qr_path)

        return output_path
