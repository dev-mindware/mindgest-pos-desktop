import asyncio
import os
from datetime import datetime
from pathlib import Path
import sys

# Add the app directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.schemas import (
    GenerateDocumentRequest,
    DocumentType,
    DocumentFormat,
    Company,
    Client,
    InvoiceItem,
)
from app.modules.pdf.thermal_generator import ThermalPDFGenerator


async def test_thermal_generation():
    generator = ThermalPDFGenerator()

    company = Company(
        id="comp-1",
        name="MindGest Test Company",
        taxNumber="123456789",
        address="Test Address",
        email="test@company.com",
        phone="123456789",
    )

    client = Client(
        name="John Doe",
        taxNumber="987654321",
        address="Client Address",
        email="john@doe.com",
    )

    items = [
        InvoiceItem(
            description="Item 1",
            quantity=2.0,
            unitPrice=100.0,
            totalPrice=200.0,
            tax=14.0,
        ),
        InvoiceItem(
            description="Item 2",
            quantity=1.0,
            unitPrice=50.0,
            totalPrice=50.0,
            tax=14.0,
        ),
    ]

    from app.schemas import TaxDetail

    tax_details = [TaxDetail(taxRate=14.0, taxableAmount=250.0, taxAmount=35.0)]

    # Test INVOICE_RECEIPT
    request_receipt = GenerateDocumentRequest(
        documentType=DocumentType.INVOICE_RECEIPT,
        format=DocumentFormat.PDF,
        invoiceNumber="FT-2024-001",
        invoiceDate=datetime.now(),
        company=company,
        client=client,
        items=items,
        taxDetails=tax_details,
        subtotal=250.0,
        tax=42.5,
        total=292.5,
    )

    print("Testing INVOICE_RECEIPT...")
    path_receipt = await generator.generate(request_receipt)
    print(f"Generated: {path_receipt}")

    # Test PROFORMA_INVOICE
    request_proforma = GenerateDocumentRequest(
        documentType=DocumentType.PROFORMA_INVOICE,
        format=DocumentFormat.PDF,
        invoiceNumber="PF-2024-001",
        invoiceDate=datetime.now(),
        company=company,
        client=client,
        items=items,
        taxDetails=tax_details,
        subtotal=250.0,
        tax=42.5,
        total=292.5,
    )

    print("Testing PROFORMA_INVOICE...")
    path_proforma = await generator.generate(request_proforma)
    print(f"Generated: {path_proforma}")

    return path_receipt, path_proforma


if __name__ == "__main__":
    if not os.path.exists("temp"):
        os.makedirs("temp")
    asyncio.run(test_thermal_generation())
