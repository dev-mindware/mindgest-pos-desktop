import pytest
import os
from app.modules.xml.generator import XMLGenerator
from app.schemas import GenerateDocumentRequest, DocumentFormat


@pytest.mark.asyncio
async def test_xml_generator(sample_invoice_payload):
    sample_invoice_payload["format"] = DocumentFormat.XML.value
    request = GenerateDocumentRequest(**sample_invoice_payload)
    generator = XMLGenerator()
    try:
        filepath = await generator.generate(request)
        assert os.path.exists(filepath)
        assert str(filepath).endswith(".xml")
        assert os.path.getsize(filepath) > 0

        # specific content check
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
            assert "AuditFile" in content or "Invoice" in content

    except Exception as e:
        pytest.fail(f"XML Generation failed: {e}")
