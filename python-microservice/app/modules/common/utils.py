import os
import uuid
from datetime import datetime
from pathlib import Path
import requests
from config.settings import TEMP_DIR


def generate_filename(document_type: str, invoice_number: str, format: str) -> str:
    """Generate a unique filename for the document."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    safe_invoice_number = invoice_number.replace("/", "_").replace("\\", "_")
    return f"{document_type}_{safe_invoice_number}_{timestamp}.{format.lower()}"


def get_temp_file_path(filename: str) -> Path:
    """Get the full path for a temporary file."""
    return TEMP_DIR / filename


def get_unique_id() -> str:
    """Generate a unique ID."""
    return str(uuid.uuid4())


def format_currency(value: float, currency: str = "EUR") -> str:
    """Format a value as currency."""
    if currency == "EUR":
        return f"€ {value:,.2f}"
    return f"{value:,.2f} {currency}"


def format_date(date: datetime, format: str = "%d/%m/%Y") -> str:
    """Format a date."""
    return date.strftime(format)


def ensure_temp_dir_exists():
    """Ensure the temp directory exists."""
    TEMP_DIR.mkdir(parents=True, exist_ok=True)


def cleanup_old_files(days: int = 7):
    """Remove temporary files older than specified days."""
    import time

    current_time = time.time()
    for file_path in TEMP_DIR.glob("*"):
        if os.path.isfile(file_path):
            file_age = current_time - os.path.getmtime(file_path)
            if file_age > days * 86400:  # 86400 seconds in a day
                try:
                    os.remove(file_path)
                except Exception as e:
                    print(f"Error removing file {file_path}: {e}")


def download_image_from_url(url: str) -> Path | None:
    """Download image from URL to temp file and return path."""
    print(f"Downloading image from {url}")
    if not url:
        return None

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            # Try to guess extension or default to .jpg
            content_type = response.headers.get("content-type", "")
            ext = ".jpg"
            if "png" in content_type:
                ext = ".png"
            elif "jpeg" in content_type:
                ext = ".jpg"

            filename = f"temp_logo_{uuid.uuid4()}{ext}"
            file_path = get_temp_file_path(filename)

            with open(file_path, "wb") as f:
                f.write(response.content)

            return file_path
    except Exception as e:
        print(f"Failed to download image from {url}: {e}")

    return None
    """Download image from URL to temp file and return path."""
    if not url:
        return None

    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            # Try to guess extension or default to .jpg
            # Google Drive links often don't have extension in URL
            content_type = response.headers.get("content-type", "")
            ext = ".jpg"
            if "png" in content_type:
                ext = ".png"
            elif "jpeg" in content_type:
                ext = ".jpg"

            filename = f"temp_logo_{uuid.uuid4()}{ext}"
            file_path = get_temp_file_path(filename)

            with open(file_path, "wb") as f:
                f.write(response.content)

            return file_path
    except Exception as e:
        print(f"Failed to download image from {url}: {e}")

    return None
