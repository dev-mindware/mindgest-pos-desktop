# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime, timezone
from enum import Enum


class DocumentFormat(str, Enum):
    PDF = "pdf"
    XML = "xml"
    DOCX = "docx"
    XLSX = "xlsx"


class DocumentType(str, Enum):
    NORMAL_INVOICE = "NORMAL_INVOICE"
    INVOICE_RECEIPT = "INVOICE_RECEIPT"
    RECEIPT = "RECEIPT"
    PROFORMA_INVOICE = "PROFORMA_INVOICE"
    CREDIT_NOTE = "CREDIT_NOTE"
    SUBSCRIPTION_INVOICE = "SUBSCRIPTION_INVOICE"
    GLOBAL_INVOICE = "GLOBAL_INVOICE"


class InvoiceItem(BaseModel):
    description: str
    quantity: float
    unitPrice: float
    totalPrice: float
    tax: Optional[float] = 0.0
    taxType: Optional[str] = "IVA"


class TaxDetail(BaseModel):
    taxRate: float  # taxa de imposto
    taxableAmount: float  # valor sobre o qual o imposto é calculado
    taxAmount: float  # valor do imposto
    taxCode: Optional[str] = "NOR"
    exemptionReason: Optional[str] = None
    taxType: Optional[str] = "IVA"


class Company(BaseModel):
    id: Optional[str] = None
    name: str
    address: Optional[str] = None
    taxNumber: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    website: Optional[str] = None
    logo: Optional[str] = None


class Client(BaseModel):
    name: str
    taxNumber: Optional[str] = None
    address: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None


class GenerateDocumentRequest(BaseModel):
    documentType: DocumentType
    format: DocumentFormat
    invoiceNumber: str
    invoiceDate: datetime
    dueDate: Optional[datetime] = None
    company: Company
    client: Client
    items: List[InvoiceItem]
    taxDetails: List[TaxDetail]
    subtotal: float
    tax: float
    total: float
    notes: Optional[str] = None
    paymentTerms: Optional[str] = None
    retentionAmount: Optional[float] = None
    discountAmount: Optional[float] = None
    metadata: Optional[dict] = Field(default_factory=dict)
    verificationToken: Optional[str] = None
    hash: Optional[str] = None
    period: Optional[int] = None
    status: Optional[str] = None  # Added to support watermark logic
    currencyCode: Optional[str] = "AOA"
    exchangeRate: Optional[float] = 1.0
    currencyTotal: Optional[float] = None
    qrCode: Optional[str] = None
    operatorName: Optional[str] = None


def utc_now():
    return datetime.now(timezone.utc)


class GenerateDocumentResponse(BaseModel):
    success: bool
    message: str
    documentUrl: Optional[str] = None
    fileName: Optional[str] = None
    size: Optional[int] = None
    format: Optional[str] = None
    generatedAt: datetime = Field(default_factory=utc_now)


class HealthCheckResponse(BaseModel):
    status: str
    version: str
    timestamp: datetime = Field(default_factory=utc_now)


class GenerateReportRequest(BaseModel):
    title: str
    columns: List[str]
    data: List[List[Any]]
    companyName: Optional[str] = None
    reportType: str  # SALES, BILLING, STOCK
    metadata: Optional[dict] = Field(default_factory=dict)
