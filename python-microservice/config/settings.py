import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directories
BASE_DIR = Path(__file__).resolve().parent.parent
APP_DIR = BASE_DIR / "app"
TEMPLATES_DIR = BASE_DIR / "templates"
FONTS_DIR = BASE_DIR / "fonts"
LOGS_DIR = BASE_DIR / "logs"

# Ensure logs directory exists
LOGS_DIR.mkdir(exist_ok=True)

# FastAPI Configuration
APP_NAME = "MindGest Document Generator"
APP_VERSION = "1.0.0"
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Service Configuration
SERVICE_HOST = os.getenv("SERVICE_HOST", "0.0.0.0")
SERVICE_PORT = int(os.getenv("SERVICE_PORT", 3002))

# NestJS API Configuration (for reference/callbacks)
NESTJS_API_URL = os.getenv("NESTJS_API_URL", "http://api:3000")

# Document Generation Settings
PDF_PAGE_SIZE = (210, 297)  # A4 in mm
PDF_MARGIN = 10
PDF_ENCODING = "utf-8"

# Temporary files
TEMP_DIR = BASE_DIR / "temp"
TEMP_DIR.mkdir(exist_ok=True)

# File upload limits
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Logging
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
LOG_FILE = LOGS_DIR / "mindgest-doc-generator.log"

# CORS
ALLOWED_ORIGINS = os.getenv(
    "ALLOWED_ORIGINS", "http://localhost:3000,http://api:3000"
).split(",")

# Output formats
SUPPORTED_FORMATS = ["pdf", "xml", "docx", "xlsx"]
