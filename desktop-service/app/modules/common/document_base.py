# Base document generator class with common functionality
from abc import ABC, abstractmethod
from typing import Optional
from pathlib import Path
from app.schemas import GenerateDocumentRequest, DocumentType
from app.config.document_config import (
    DocumentConfig,
    DocumentStyle,
    LogoConfig,
    CompanyHeaderConfig,
)
from app.modules.common.logger import get_logger

logger = get_logger(__name__)

 
class BaseDocumentGenerator(ABC):
    """Base class for all document generators."""

    def __init__(self):
        self.config = DocumentConfig()
        self.temp_dir = Path(__file__).parent.parent.parent.parent / "temp"
        self.temp_dir.mkdir(exist_ok=True)

    @abstractmethod
    async def generate(self, request: GenerateDocumentRequest) -> Path:
        """Generate document. Must be implemented by subclasses."""
        pass

    def get_style(self) -> DocumentStyle:
        """Get document style configuration."""
        return self.config.get_style()

    def get_logo_config(self) -> LogoConfig:
        """Get logo configuration."""
        return self.config.get_logo_config()

    def get_header_config(self) -> CompanyHeaderConfig:
        """Get company header configuration."""
        return self.config.get_header_config()

    def get_document_type_name(self, doc_type: DocumentType) -> str:
        """Get human-readable document type name."""
        type_map = {
            DocumentType.INVOICE: "Factura",
            DocumentType.RECEIPT: "Recibo",
            DocumentType.PROFORMA: "Proforma",
            DocumentType.CREDIT_NOTE: "Nota de Crédito",
        }
        return type_map.get(doc_type, doc_type.value)

    def format_currency(self, amount: float, currency: str = "AOA") -> str:
        """Format amount as currency."""
        return f"{amount:,.2f} {currency}"

    def format_date(self, date) -> str:
        """Format date for display."""
        if hasattr(date, "strftime"):
            return date.strftime("%d/%m/%Y")
        return str(date)

    def safe_string(self, value: Optional[str], default: str = "N/A") -> str:
        """Safely convert value to string, handling None and empty strings."""
        if value is None or (isinstance(value, str) and value.strip() == ""):
            return default
        return str(value).strip()

    def _get_hash_extract(self, hash_str: Optional[str]) -> str:
        """Extract characters at positions 1, 11, 21, 31 (0-indexed: 0, 10, 20, 30)."""
        if not hash_str or len(hash_str) < 31:
            return "****"
        try:
            return f"{hash_str[0]}{hash_str[10]}{hash_str[20]}{hash_str[30]}".upper()
        except IndexError:
            return "****"
