import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
import os
import shutil
from typing import AsyncGenerator
from app.schemas import DocumentFormat, DocumentType


@pytest.fixture(scope="session", autouse=True)
def setup_test_env():
    """Setup test environment, ensuring temp directory exists and is clean."""
    if not os.path.exists("temp"):
        os.makedirs("temp")
    yield
    # Cleanup after tests if needed, though we might want to inspect artifacts
    # shutil.rmtree("temp", ignore_errors=True)


@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    """Async client for testing FastAPI endpoints."""
    async with AsyncClient(
        transport=ASGITransport(app=app), base_url="http://test"
    ) as ac:
        yield ac


@pytest.fixture
def sample_invoice_payload():
    """Provides a valid sample invoice payload for document generation tests."""
    return {
        "documentType": DocumentType.NORMAL_INVOICE.value,
        "format": DocumentFormat.PDF.value,
        "invoiceNumber": "FT 2024/001",
        "invoiceDate": "2024-01-20T10:00:00",
        "dueDate": "2024-02-20T10:00:00",
        "company": {
            "id": "comp_123",
            "name": "MindGest Demo",
            "taxNumber": "500123456",
            "address": "Rua Principal 123, Luanda",
            "email": "info@mindgest.com",
            "phone": "+244 923 000 000",
        },
        "client": {
            "name": "Cliente Exemplo",
            "taxNumber": "123456789",
            "address": "Av. Secundaria 456, Luanda",
            "email": "cliente@email.com",
            "phone": "+244 923 111 222",
        },
        "items": [
            {
                "description": "Serviço de Consultoria",
                "quantity": 10.0,
                "unitPrice": 5000.0,
                "totalPrice": 50000.0,
                "tax": 14.0,
            },
            {
                "description": "Licença Software",
                "quantity": 1.0,
                "unitPrice": 25000.0,
                "totalPrice": 25000.0,
                "tax": 14.0,
            },
        ],
        "taxDetails": [
            {
                "taxRate": 14.0,
                "taxableAmount": 75000.0,
                "taxAmount": 10500.0,
            }
        ],
        "subtotal": 75000.0,
        "tax": 10500.0,
        "total": 85500.0,
        "notes": "Obrigado pela preferência.",
        "paymentTerms": "Pronto Pagamento",
    }
