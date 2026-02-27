import pytest
import os
from app.modules.pdf.generator import PDFGenerator
from app.modules.pdf.thermal_generator import ThermalPDFGenerator
from app.schemas import GenerateDocumentRequest


@pytest.mark.asyncio
async def test_pdf_generator_a4(sample_invoice_payload):
    request = GenerateDocumentRequest(**sample_invoice_payload)
    generator = PDFGenerator()
    try:
        filepath = await generator.generate(request)
        assert os.path.exists(filepath)
        assert str(filepath).endswith(".pdf")
        assert os.path.getsize(filepath) > 0
    except Exception as e:
        pytest.fail(f"PDF Generation failed: {e}")


@pytest.mark.asyncio
async def test_thermal_pdf_generator(sample_invoice_payload):
    request = GenerateDocumentRequest(**sample_invoice_payload)
    generator = ThermalPDFGenerator()
    try:
        filepath = await generator.generate(request)
        assert os.path.exists(filepath)
        assert str(filepath).endswith(".pdf")
        assert os.path.getsize(filepath) > 0
    except Exception as e:
        pytest.fail(f"Thermal PDF Generation failed: {e}")
