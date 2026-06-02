
from fastapi import FastAPI, HTTPException, status, BackgroundTasks
import os

# Reload triggered
from fastapi.responses import FileResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import asyncio

from config.settings import (
    APP_NAME,
    APP_VERSION,
    SERVICE_HOST,
    SERVICE_PORT,
    ALLOWED_ORIGINS,
    SUPPORTED_FORMATS,
)
from app.schemas import (
    GenerateDocumentRequest,
    GenerateDocumentResponse,
    HealthCheckResponse,
    DocumentFormat,
    GenerateReportRequest,
    DocumentType,
)
from app.modules.common.logger import setup_logging, get_logger
from app.modules.common.utils import ensure_temp_dir_exists, cleanup_old_files
from app.modules.pdf.generator import PDFGenerator
from app.modules.pdf.subscription_invoice_generator import SubscriptionInvoiceGenerator
from app.modules.pdf.thermal_generator import ThermalPDFGenerator
from app.modules.xml.generator import XMLGenerator
from app.modules.xml.generator_v2 import XMLGeneratorV2
from app.modules.docx.generator import DOCXGenerator
from app.modules.saft.saft_generator import SAFTGenerator
from app.modules.xlsx.generator import XLSXGenerator
from app.services.document_generation_service import DocumentGenerationService
# Setup logging
setup_logging()
logger = get_logger(__name__)

# Document generators
pdf_generator = PDFGenerator()
subscription_invoice_generator = SubscriptionInvoiceGenerator()
thermal_pdf_generator = ThermalPDFGenerator()
xml_generator = XMLGenerator()
xml_generator_v2 = XMLGeneratorV2()  # Enhanced XML with type-specific routing
docx_generator = DOCXGenerator()
saft_generator = SAFTGenerator()  # SAF-T (Angola tax compliance)
xlsx_generator = XLSXGenerator()

document_generation_service = DocumentGenerationService(
    pdf_generator=pdf_generator,
    thermal_generator=thermal_pdf_generator,
    subscription_invoice_generator=subscription_invoice_generator,
    xml_generator=xml_generator_v2,
    docx_generator=docx_generator,
    xlsx_generator=xlsx_generator,
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Manage application startup and shutdown."""
    logger.info(f"{APP_NAME} v{APP_VERSION} starting...")
    ensure_temp_dir_exists()
    # Cleanup old files on startup (every 1 hour)
    cleanup_task = asyncio.create_task(periodic_cleanup())
    yield
    cleanup_task.cancel()
    logger.info(f"{APP_NAME} shutting down...")


async def periodic_cleanup():
    """Periodically cleanup old temporary files."""
    while True:
        try:
            await asyncio.sleep(3600)  # 1 hour
            cleanup_old_files(days=7)
            logger.info("Cleanup task completed")
        except asyncio.CancelledError:
            break
        except Exception as e:
            logger.error(f"Error in cleanup task: {str(e)}")


# Create FastAPI app
app = FastAPI(title=APP_NAME, version=APP_VERSION, lifespan=lifespan)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ALLOWED_ORIGINS --production,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """Health check endpoint."""
    return HealthCheckResponse(status="healthy", version=APP_VERSION)


@app.post("/generate-document", response_model=GenerateDocumentResponse)
async def generate_document(request: GenerateDocumentRequest):
    """
    Generate a document in the specified format.

    Supports: PDF, XML, DOCX
    """
    try:
        logger.info(
            f"Generating {request.format.value} for invoice {request.invoiceNumber}"
        )

        # Validate format
        if request.format.value not in SUPPORTED_FORMATS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Format {request.format.value} not supported. Supported: {SUPPORTED_FORMATS}",
            )

        # Generate document based on format using the document generation service
        filepath = await document_generation_service.generate(request)
        logger.info(f"Document generated successfully: {filepath}")

        return GenerateDocumentResponse(
            success=True,
            message=f"Document generated successfully",
            documentUrl=f"/temp/{filepath.name}",  # Example URL structure if needed, or just filename
            fileName=filepath.name,
            size=os.path.getsize(filepath),
            format=request.format.value,
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating document: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating document: {str(e)}",
        )


@app.post("/generate-document/download")
async def generate_and_download_document(
    request: GenerateDocumentRequest, background_tasks: BackgroundTasks
):
    """
    Generate a document and return it as a file download.
    """
    print(f"DEBUG: Received request: {request.model_dump()}")
    with open("temp/last_layout.txt", "w") as f:
        f.write(str(request.metadata.get("layout") if request.metadata else "None"))
    try:
        logger.info(
            f"Generating and downloading {request.format.value} for invoice {request.invoiceNumber}"
        )

        filepath, media_type = await document_generation_service.generate_with_media_type(request)

        # Schedule immediate cleanup of the file after response is sent
        background_tasks.add_task(os.remove, filepath)

        return FileResponse(
            path=filepath, media_type=media_type, filename=filepath.name
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating document: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating document: {str(e)}",
        )


@app.post("/generate-saft")
async def generate_saft_document(request: GenerateDocumentRequest):
    """
    Generate SAF-T XML file for Angola (AGT format).

    SAF-T (Standard Audit File for Tax) is required for Angolan tax compliance.
    """
    try:
        logger.info(f"Generating SAF-T XML for invoice {request.invoiceNumber}")

        filepath = await saft_generator.generate(request)

        return FileResponse(
            path=filepath, media_type="application/xml", filename=filepath.name
        )

    except Exception as e:
        logger.error(f"Error generating SAF-T XML: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating SAF-T XML: {str(e)}",
        )


@app.post("/generate-report")
async def generate_report_download(
    request: GenerateReportRequest, background_tasks: BackgroundTasks
):
    """
    Generate an Excel report and return it as a download.
    """
    try:
        logger.info(f"Generating Excel report: {request.title}")

        filepath = await xlsx_generator.generate_report(request)

        # Schedule immediate cleanup of the file after response is sent
        background_tasks.add_task(os.remove, filepath)

        return FileResponse(
            path=filepath,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            filename=filepath.name,
        )

    except Exception as e:
        logger.error(f"Error generating Excel report: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generating Excel report: {str(e)}",
        )


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "service": APP_NAME,
        "version": APP_VERSION,
        "status": "running",
        "endpoints": {
            "health": "/health",
            "generate": "/generate-document",
            "download": "/generate-document/download",
            "saft": "/generate-saft",
            "report": "/generate-report",
        },
        "features": {
            "pdf": True,
            "xml": True,
            "docx": True,
            "saft": True,
            "xlsx": True,
            "document_types": ["invoice", "receipt", "proforma", "credit_note"],
            "report_types": ["SALES", "BILLING", "STOCK"],
        },
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=SERVICE_HOST, port=SERVICE_PORT, log_level="info")
