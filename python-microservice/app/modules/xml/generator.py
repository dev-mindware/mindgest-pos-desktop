import xml.etree.ElementTree as ET
from xml.dom import minidom
from pathlib import Path
from datetime import datetime
from app.schemas import GenerateDocumentRequest
from app.modules.common.logger import get_logger
from app.modules.common.utils import generate_filename, get_temp_file_path

logger = get_logger(__name__)


class XMLGenerator:
    """Generate XML documents from invoice data."""

    async def generate(self, request: GenerateDocumentRequest) -> Path:
        """Generate an XML document."""
        try:
            filename = generate_filename(
                request.documentType.value, request.invoiceNumber, "xml"
            )
            filepath = get_temp_file_path(filename)

            logger.info(f"Generating XML for invoice {request.invoiceNumber}")

            root = self._build_document(request)

            # Pretty print
            xml_str = minidom.parseString(ET.tostring(root)).toprettyxml(indent="  ")

            # Write to file
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(xml_str)

            logger.info(f"XML generated successfully: {filepath}")
            return filepath

        except Exception as e:
            logger.error(f"Error generating XML: {str(e)}", exc_info=True)
            raise

    def _build_document(self, request: GenerateDocumentRequest) -> ET.Element:
        """Build the XML document structure."""
        root = ET.Element("Document")
        root.set("type", request.documentType.value)
        root.set("generatedAt", datetime.now().isoformat())

        # Company info
        company_elem = ET.SubElement(root, "Company")
        self._add_element(company_elem, "Id", request.company.id)
        self._add_element(company_elem, "Name", request.company.name)
        self._add_element(company_elem, "TaxNumber", request.company.taxNumber)
        self._add_element(company_elem, "Address", request.company.address)
        if request.company.email:
            self._add_element(company_elem, "Email", request.company.email)
        if request.company.phone:
            self._add_element(company_elem, "Phone", request.company.phone)

        # Invoice info
        invoice_elem = ET.SubElement(root, "Invoice")
        self._add_element(invoice_elem, "Number", request.invoiceNumber)
        self._add_element(invoice_elem, "Date", request.invoiceDate.isoformat())
        if request.dueDate:
            self._add_element(invoice_elem, "DueDate", request.dueDate.isoformat())

        # Client info
        client_elem = ET.SubElement(root, "Client")
        # self._add_element(
        #     client_elem, "Id", request.client.id
        # )  # Client id removed from schema? No, it's missing in conftest but present in schema as optional? Schema says Client has no ID field anymore?
        # Checking schema: class Client(BaseModel): name: str, taxNumber, address, email, phone. NO ID.
        # So request.client.id is likely failing too if accessed, but the error was on company.taxId first.

        self._add_element(client_elem, "Name", request.client.name)
        self._add_element(client_elem, "TaxNumber", request.client.taxNumber)
        if request.client.address:
            self._add_element(client_elem, "Address", request.client.address)
        if request.client.email:
            self._add_element(client_elem, "Email", request.client.email)

        # Items
        items_elem = ET.SubElement(root, "Items")
        for item in request.items:
            item_elem = ET.SubElement(items_elem, "Item")
            # self._add_element(item_elem, "Id", item.id) # InvoiceItem has no ID in schema
            self._add_element(item_elem, "Description", item.description)
            self._add_element(item_elem, "Quantity", str(item.quantity))
            self._add_element(item_elem, "UnitPrice", str(item.unitPrice))
            self._add_element(item_elem, "Tax", str(item.tax or 0))
            self._add_element(item_elem, "TotalPrice", str(item.totalPrice))

        # Totals
        totals_elem = ET.SubElement(root, "Totals")
        self._add_element(totals_elem, "Subtotal", str(request.subtotal))
        self._add_element(totals_elem, "Tax", str(request.tax))
        if request.retentionAmount and request.retentionAmount > 0:
            self._add_element(
                totals_elem, "RetentionAmount", str(request.retentionAmount)
            )
        self._add_element(totals_elem, "Total", str(request.total))

        # Notes
        if request.notes:
            self._add_element(root, "Notes", request.notes)

        # Metadata
        if request.metadata:
            metadata_elem = ET.SubElement(root, "Metadata")
            for key, value in request.metadata.items():
                self._add_element(metadata_elem, key, str(value))

        return root

    def _add_element(self, parent: ET.Element, tag: str, text: str) -> None:
        """Add a text element to parent."""
        elem = ET.SubElement(parent, tag)
        if text:
            elem.text = str(text)
