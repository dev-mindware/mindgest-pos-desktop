# SAF-T XML Generator for Angola
from pathlib import Path
from datetime import datetime, date
from typing import Dict, Any, List
import hashlib
import base64
import os

try:
    from cryptography.hazmat.primitives import hashes
    from cryptography.hazmat.primitives.asymmetric import padding
    from cryptography.hazmat.primitives import serialization

    HAS_CRYPTO = True
except ImportError:
    HAS_CRYPTO = False
from app.modules.common.document_base import BaseDocumentGenerator
from app.modules.common.logger import get_logger
from app.schemas import GenerateDocumentRequest
from xml.etree.ElementTree import Element, SubElement, tostring, register_namespace
from xml.dom.minidom import parseString

logger = get_logger(__name__)


class SAFTGenerator(BaseDocumentGenerator):
    """
    SAF-T (Standard Audit File for Tax) generator for Angola (AGT).
    Generates XML files compliant with Angolan tax requirements.
    Version: 1.0
    """

    async def generate(self, request: GenerateDocumentRequest) -> Path:
        """
        Generate SAF-T XML file.
        Note: This is a simplified version. For production, integrate with real data from NestJS backend.
        """
        try:
            logger.info(f"Generating SAF-T XML from document: {request.invoiceNumber}")

            # Build SAF-T structure
            xml_content = self._build_saft_xml(request)

            # Save to file
            filename = f"SAFT_AGT_{request.invoiceNumber}.xml"
            filepath = self.temp_dir / filename
            filepath.write_text(xml_content, encoding="utf-8")

            logger.info(f"SAF-T XML generated successfully: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating SAF-T XML: {str(e)}", exc_info=True)
            raise

    def _build_saft_xml(self, request: GenerateDocumentRequest) -> str:
        """Build SAF-T XML structure for Angola (version 1.0)."""

        # Register namespaces
        register_namespace("", "")
        register_namespace("xsi", "http://www.w3.org/2001/XMLSchema-instance")

        root = Element("AuditFile")
        root.set("xmlns", "urn:OECD:StandardAuditFile-Tax:AO_1.01_01")
        root.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
        root.set(
            "xsi:schemaLocation",
            "urn:OECD:StandardAuditFile-Tax:AO_1.01_01 https://raw.githubusercontent.com/assoft-portugal/SAF-T-AO/master/XSD/SAFTAO1.01_01.xsd",
        )

        # Header
        header = SubElement(root, "Header")
        self._add_header(header, request)

        # MasterFiles
        master_files = SubElement(root, "MasterFiles")
        self._add_master_files(master_files, request)

        # SourceDocuments
        source_docs = SubElement(root, "SourceDocuments")
        self._add_source_documents(source_docs, request)

        # Pretty print
        rough_string = tostring(root, encoding="unicode")
        reparsed = parseString(rough_string)
        xml_str = reparsed.toprettyxml(indent="  ")
        # Remove duplicate XML declarations if any
        lines = xml_str.split("\n")
        if lines[0].startswith("<?xml"):
            return "\n".join(lines)
        return xml_str

    def _add_header(self, header: Element, request: GenerateDocumentRequest) -> None:
        """Add SAF-T header section."""

        self._add_element(header, "AuditFileVersion", "1.01_01")
        # Pad tax number to 10 digits (Angola requirement)
        tax_number = str(request.company.taxId or "999999999").ljust(10, "0")[:10]
        self._add_element(header, "CompanyID", tax_number)
        self._add_element(header, "TaxRegistrationNumber", tax_number)
        self._add_element(header, "TaxAccountingBasis", "F")  # F = Facturação
        self._add_element(header, "CompanyName", request.company.name)
        self._add_element(header, "BusinessName", request.company.name)

        # Company Address
        company_addr = SubElement(header, "CompanyAddress")
        self._add_element(company_addr, "BuildingNumber", "N/A")
        self._add_element(
            company_addr, "StreetName", request.company.address or "Desconhecido"
        )
        self._add_element(
            company_addr,
            "AddressDetail",
            request.company.address or "Desconhecido",
        )
        self._add_element(company_addr, "City", "Luanda")
        self._add_element(company_addr, "Province", "Luanda")
        self._add_element(company_addr, "Country", "AO")

        # Dates
        invoice_date = (
            request.invoiceDate
            if isinstance(request.invoiceDate, date)
            else datetime.fromisoformat(request.invoiceDate).date()
        )
        self._add_element(header, "FiscalYear", str(invoice_date.year))
        self._add_element(
            header,
            "StartDate",
            f"{invoice_date.year}-{invoice_date.month:02d}-01",
        )

        # FIX: EndDate cannot exceed DateCreated (now)
        now = datetime.utcnow()
        import calendar

        _, last_day_num = calendar.monthrange(invoice_date.year, invoice_date.month)
        last_day_of_month = date(invoice_date.year, invoice_date.month, last_day_num)

        end_date = min(last_day_of_month, now.date())
        self._add_element(header, "EndDate", end_date.isoformat())

        self._add_element(header, "CurrencyCode", request.currencyCode or "AOA")
        self._add_element(header, "DateCreated", now.isoformat().split(".")[0])
        self._add_element(header, "TaxEntity", "Global")
        self._add_element(header, "ProductCompanyTaxID", "5002464497")
        self._add_element(header, "SoftwareValidationNumber", "000/AGT/2024")
        self._add_element(
            header,
            "ProductID",
            "MindGest/MINDWARE - COMÉRCIO E SERVIÇOS, LDA",
        )
        self._add_element(header, "ProductVersion", "1.0")
        self._add_element(header, "HeaderComment", "MindGest/MINDWARE - COMÉRCIO E SERVIÇOS, LDA")

    def _add_master_files(
        self, master_files: Element, request: GenerateDocumentRequest
    ) -> None:
        """Add MasterFiles section (clients, products, taxes)."""

        # Customer List
        customer = SubElement(master_files, "Customer")
        # FIX: use cleaned NIF as CustomerID for absolute synchronization
        raw_nif = request.client.taxId or "999999999"
        cust_tax = self._clean_nif(raw_nif)
        # Rule: Fallback to 999999999 if invalid/short (AGT requires 9 digits)
        if len(cust_tax) < 9:
            cust_tax = "999999999"

        self._add_element(customer, "CustomerID", cust_tax)
        self._add_element(customer, "AccountID", "Desconhecido")
        self._add_element(customer, "CustomerTaxID", cust_tax)
        self._add_element(
            customer,
            "CompanyName",
            request.client.name if cust_tax != "999999999" else "Consumidor final",
        )

        # Billing Address
        bill_addr = SubElement(customer, "BillingAddress")
        self._add_element(bill_addr, "BuildingNumber", "N/A")
        self._add_element(
            bill_addr, "StreetName", request.client.address or "Desconhecido"
        )
        self._add_element(
            bill_addr, "AddressDetail", request.client.address or "Desconhecido"
        )
        self._add_element(bill_addr, "City", "Luanda")
        self._add_element(bill_addr, "PostalCode", "N/A")
        self._add_element(bill_addr, "Country", "AO")

        self._add_element(customer, "SelfBillingIndicator", "0")

        # Product/Service List
        for item in request.items:
            product = SubElement(master_files, "Product")
            self._add_element(
                product, "ProductType", "P" if item.type != "SERVICE" else "S"
            )
            self._add_element(product, "ProductCode", item.id)
            self._add_element(product, "ProductGroup", "Geral")
            self._add_element(product, "ProductDescription", item.description or "Item")
            self._add_element(product, "ProductNumberCode", item.id)

        # Tax Table
        tax_table = SubElement(master_files, "TaxTable")
        entry = SubElement(tax_table, "TaxTableEntry")
        self._add_element(entry, "TaxType", "IVA")
        self._add_element(entry, "TaxCountryRegion", "AO")
        self._add_element(entry, "TaxCode", "NOR")
        self._add_element(entry, "Description", "IVA Taxa Normal 14%")
        self._add_element(entry, "TaxPercentage", "14.000000")

    def _add_source_documents(
        self, source_docs: Element, request: GenerateDocumentRequest
    ) -> None:
        """Add SourceDocuments section (invoices)."""

        sales_invoices = SubElement(source_docs, "SalesInvoices")

        # Invoice header
        self._add_element(
            sales_invoices, "NumberOfEntries", str(request.numberOfEntries)
        )

        # Calculate totals (these are now expected to come from request)
        # net_total = sum(item.totalPrice for item in request.items)
        # tax_amount = net_total * (float(request.tax) / 100 if request.tax else 0.14)
        # gross_total = net_total + tax_amount

        self._add_element(sales_invoices, "TotalDebit", "0.000000")
        self._add_element(
            sales_invoices, "TotalCredit", f"{float(request.totalCredit):.6f}"
        )

        # Invoice
        invoice = SubElement(sales_invoices, "Invoice")
        # Format: type series/number (digits only)
        sequential_number = (
            "".join(c for c in request.invoiceNumber if c.isdigit()) or "1"
        )
        invoice_type = "FT"  # Default
        self._add_element(invoice, "InvoiceNo", f"{invoice_type} A/{sequential_number}")

        # Document Status
        doc_status = SubElement(invoice, "DocumentStatus")
        self._add_element(doc_status, "InvoiceStatus", "N")
        self._add_element(
            doc_status,
            "InvoiceStatusDate",
            datetime.utcnow().isoformat().split(".")[0],
        )
        self._add_element(doc_status, "SourceID", "Admin")
        self._add_element(doc_status, "SourceBilling", "P")

        # Consistent Hash Calculation (SHA1 Chain)
        # FIX: Strict SystemEntryDate: YYYY-MM-DDTHH:mm:ss (No 'Z' or milliseconds)
        system_entry_date = datetime.utcnow().isoformat().split(".")[0]

        # Base: InvoiceDate;SystemEntryDate;InvoiceNo;GrossTotal;PreviousHash
        # PreviousHash is assumed 0 for single document generator or handled by caller
        prev_hash = ""
        gross_total = float(request.grossTotal)
        # FIX: Total must have exactly 2 decimals
        hash_base = f"{invoice_date_str};{system_entry_date};{invoice_type} A/{sequential_number};{gross_total:.2f};{prev_hash}"

        # Note: AGT requires RSA-SHA1 (Digital Signature) in Base64 for certified software.
        # Format: DataFactura;DataHoraRegisto;NumFactura;TotalBruto;HashAnterior
        final_hash = ""
        if HAS_CRYPTO:
            try:
                # Load private key (In production, load from file src/certs/private.pem or ENV)
                key_path = Path("src/certs/private.pem")
                pem_data = None

                if key_path.exists():
                    with open(key_path, "rb") as key_file:
                        pem_data = key_file.read()
                    logger.info("SAF-T: Private key loaded from file.")
                elif os.getenv("PRIVATE_KEY"):
                    pem_data = (
                        os.getenv("PRIVATE_KEY")
                        .replace("\\n", "\n")
                        .encode("utf-8")
                    )
                    logger.info("SAF-T: Private key loaded from environment variable.")

                if pem_data:
                    private_key = serialization.load_pem_private_key(
                        pem_data,
                        password=None,
                    )
                    signature = private_key.sign(
                        hash_base.encode("utf-8"), padding.PKCS1v15(), hashes.SHA1()
                    )
                    final_hash = base64.b64encode(signature).decode("utf-8")
                else:
                    final_hash = (
                        hashlib.sha1(hash_base.encode("utf-8")).hexdigest().upper()
                    )
            except Exception as e:
                logger.error(f"Error signing SAF-T: {str(e)}")
                final_hash = hashlib.sha1(hash_base.encode("utf-8")).hexdigest().upper()
        else:
            # Fallback to SHA1 hex if cryptography is missing (Warning)
            final_hash = hashlib.sha1(hash_base.encode("utf-8")).hexdigest().upper()

        self._add_element(invoice, "Hash", final_hash)
        self._add_element(invoice, "HashControl", "1")

        invoice_date = (
            request.invoiceDate
            if isinstance(request.invoiceDate, date)
            else datetime.fromisoformat(request.invoiceDate).date()
        )
        self._add_element(invoice, "Period", f"{invoice_date.month:02d}")
        self._add_element(invoice, "InvoiceDate", invoice_date.isoformat())
        self._add_element(invoice, "InvoiceType", "FT")

        # Special Regimes
        special_regimes = SubElement(invoice, "SpecialRegimes")
        self._add_element(special_regimes, "SelfBillingIndicator", "0")
        self._add_element(special_regimes, "CashVATSchemeIndicator", "0")
        self._add_element(special_regimes, "ThirdPartiesBillingIndicator", "0")

        self._add_element(invoice, "SourceID", "Admin")
        self._add_element(
            invoice,
            "SystemEntryDate",
            datetime.utcnow().isoformat().split(".")[0],
        )
        raw_ct = request.client.taxId or "999999999"
        ct_nif = self._clean_nif(raw_ct)
        if len(ct_nif) < 9:
            ct_nif = "999999999"
        self._add_element(invoice, "CustomerID", ct_nif)

        # --- CURRENCY SUPPORT (AGT - Ponto 7) ---
        currency_code = request.currencyCode or "AOA"
        if currency_code != "AOA":
            currency = SubElement(invoice, "Currency")
            self._add_element(currency, "CurrencyCode", currency_code)
            currency_amount = (
                request.currencyTotal
                if request.currencyTotal is not None
                else request.total
            )
            self._add_element(
                currency, "CurrencyAmount", f"{float(currency_amount):.2f}"
            )
            ex_rate = request.exchangeRate or 1.0
            self._add_element(currency, "ExchangeRate", f"{float(ex_rate):.6f}")

        # ShipTo Placeholder
        ship_to = SubElement(invoice, "ShipTo")
        self._add_element(ship_to, "DeliveryDate", invoice_date.isoformat())
        ship_to_addr = SubElement(ship_to, "Address")
        self._add_element(ship_to_addr, "BuildingNumber", "N/A")
        self._add_element(ship_to_addr, "StreetName", "Endereço do cliente")
        self._add_element(ship_to_addr, "AddressDetail", "Endereço do cliente")
        self._add_element(ship_to_addr, "City", "Luanda")
        self._add_element(ship_to_addr, "PostalCode", "N/A")
        self._add_element(ship_to_addr, "Country", "AO")

        # ShipFrom Placeholder
        ship_from = SubElement(invoice, "ShipFrom")
        self._add_element(ship_from, "DeliveryDate", invoice_date.isoformat())
        self._add_element(ship_from, "WarehouseID", "Principal")
        self._add_element(ship_from, "LocationID", "Stock")
        ship_from_addr = SubElement(ship_from, "Address")
        self._add_element(ship_from_addr, "BuildingNumber", "N/A")
        self._add_element(
            ship_from_addr, "StreetName", request.company.address or "Desconhecido"
        )
        self._add_element(
            ship_from_addr, "AddressDetail", request.company.address or "Desconhecido"
        )
        self._add_element(ship_from_addr, "City", "Luanda")
        self._add_element(ship_from_addr, "PostalCode", "N/A")
        self._add_element(ship_from_addr, "Country", "AO")

        self._add_element(
            invoice,
            "MovementStartTime",
            datetime.utcnow().isoformat().split(".")[0],
        )

        # Invoice Lines (MUST come before DocumentTotals)
        for index, item in enumerate(request.items, 1):
            line = SubElement(invoice, "Line")
            self._add_element(line, "LineNumber", str(index))
            self._add_element(line, "ProductCode", item.id)
            self._add_element(line, "ProductDescription", item.description or "Item")
            self._add_element(line, "Quantity", f"{float(item.quantity):.1f}")
            self._add_element(line, "UnitOfMeasure", "un.")
            # Precision fix: 6 decimals for UnitPrice
            self._add_element(line, "UnitPrice", f"{float(item.unitPrice):.6f}")

            # Line totals
            # line_total = item.totalPrice
            self._add_element(line, "TaxBase", f"{float(item.totalPrice):.6f}")
            self._add_element(
                line,
                "TaxPointDate",
                invoice_date.isoformat(),
            )
            self._add_element(line, "Description", "Venda de Produto")
            self._add_element(line, "CreditAmount", f"{float(item.totalPrice):.6f}")

            # Tax
            tax = SubElement(line, "Tax")
            self._add_element(tax, "TaxType", "IVA")
            self._add_element(tax, "TaxCountryRegion", "AO")
            self._add_element(tax, "TaxCode", "NOR")
            self._add_element(tax, "TaxPercentage", "14.000000")

            self._add_element(line, "SettlementAmount", "0.00")

        # Invoice Totals (MUST come AFTER all Lines)
        document_totals = SubElement(invoice, "DocumentTotals")
        # self._add_element(totals, "TaxPayable", str(tax_amount))
        # self._add_element(totals, "NetTotal", str(net_total))
        # self._add_element(totals, "GrossTotal", str(gross_total))
        self._add_element(
            document_totals, "TaxPayable", f"{float(request.taxPayable):.2f}"
        )
        self._add_element(document_totals, "NetTotal", f"{float(request.netTotal):.2f}")
        self._add_element(
            document_totals, "GrossTotal", f"{float(request.grossTotal):.2f}"
        )

        # Payment details
        payment = SubElement(document_totals, "Payment")
        self._add_element(payment, "PaymentMechanism", "NU")
        self._add_element(payment, "PaymentAmount", f"{float(request.grossTotal):.6f}")
        self._add_element(payment, "PaymentDate", invoice_date.isoformat())

        # FIX: Add Payments section (Required by schema)
        payments = SubElement(source_docs, "Payments")
        self._add_element(payments, "NumberOfEntries", "0")
        self._add_element(payments, "TotalDebit", "0.000000")
        self._add_element(payments, "TotalCredit", "0.000000")

    def _add_element(self, parent: Element, tag: str, text: str) -> Element:
        """Helper to add element with text."""
        elem = SubElement(parent, tag)
        elem.text = str(text) if text is not None else ""
        return elem

    def _clean_nif(self, nif: str) -> str:
        """Keeps only digits and uppercase letters."""
        if not nif:
            return ""
        import re

        return re.sub(r"[^0-9A-Z]", "", nif.upper())
