"""Simple runner that generates a sample invoice PDF using PDFGenerator.

Run with: PYTHONPATH=. python scripts/sample_generate.py
"""
from datetime import datetime
from app.schemas import GenerateDocumentRequest, DocumentFormat, DocumentType, Company, Client, InvoiceItem
from app.modules.pdf.generator import PDFGenerator
import asyncio

async def main():
    company = Company(
        id='comp1',
        name='Lost Island AB',
        taxId='SE593484848',
        address='Torgsgatan 59',
        email='pontus@lostisland.co',
        phone='+46 700 010 100',
        website='https://lostisland.co'
    )

    client = Client(
        id='client1',
        name='Klarna',
        taxId='N/A',
        address='Sveavägen 158, 113 54',
        email='test@example.com',
        phone=''
    )

    items = [
        InvoiceItem(id='1', description='Design', quantity=156, unitPrice=1100.0, totalPrice=171600.0),
        InvoiceItem(id='2', description='Development', quantity=52, unitPrice=1100.0, totalPrice=57200.0),
        InvoiceItem(id='3', description='Planning & meetings', quantity=12, unitPrice=1100.0, totalPrice=13200.0),
    ]

    req = GenerateDocumentRequest(
        documentType=DocumentType.INVOICE,
        format=DocumentFormat.PDF,
        invoiceNumber='INV-0001',
        invoiceDate=datetime.utcnow(),
        dueDate=None,
        company=company,
        client=client,
        items=items,
        subtotal=242000.0,
        tax=60500.0,
        total=302500.0,
        notes='Thank you for your business.',
        paymentTerms='30 days',
        retentionAmount=0.0,
        metadata={'logoPath': None}
    )

    gen = PDFGenerator()
    path = await gen.generate(req)
    print('Generated:', path)

if __name__ == '__main__':
    asyncio.run(main())
