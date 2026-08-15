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


def save_base64_image(base64_string: str, prefix: str = "qr") -> Path | None:
    """Save base64 image string to temp file and return path."""
    if not base64_string:
        return None

    try:
        import base64

        # Remove data:image/png;base64, prefix if present
        if "," in base64_string:
            base64_string = base64_string.split(",")[1]

        image_data = base64.b64decode(base64_string)
        filename = f"temp_{prefix}_{uuid.uuid4()}.png"
        file_path = get_temp_file_path(filename)

        with open(file_path, "wb") as f:
            f.write(image_data)

        return file_path
    except Exception as e:
        print(f"Failed to save base64 image: {e}")
        return None


def download_image_from_url(url: str) -> Path | None:
    """Download image from URL to temp file and return path."""
    print(f"Downloading image from {url}")
    if not url:
        return None

    try:
        if not url.startswith("http://") and not url.startswith("https://"):
            url = f"https://{url}"

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
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
        if not url.startswith("http://") and not url.startswith("https://"):
            url = f"https://{url}"

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers, timeout=10)
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


def overlay_logo_on_qr(qr_image_path: Path, logo_url: str | None, company_name: str) -> bool:
    """Overlay company logo or initials in the center of an existing QR code image file."""
    try:
        from PIL import Image as PILImage, ImageDraw, ImageFont

        if not qr_image_path or not qr_image_path.exists():
            return False

        # Load the base QR image and convert to RGB
        img_qr = PILImage.open(str(qr_image_path)).convert("RGB")
        qr_width, qr_height = img_qr.size

        # Determine logo sizes
        logo_max_size = int(qr_width * 0.28)
        badge_size = logo_max_size

        logo_path = None
        if logo_url:
            logo_path = download_image_from_url(logo_url)

        if not logo_path or not logo_path.exists():
            logo_path = Path("assets/logos/mindware-logo.jpeg").resolve()

        try:
            if logo_path and logo_path.exists():
                logo = PILImage.open(str(logo_path)).convert("RGBA")
                bbox = logo.getbbox()
                if bbox:
                    logo = logo.crop(bbox)

                padding = 4
                logo_inner_size = max(1, badge_size - (padding * 2))
                logo.thumbnail((logo_inner_size, logo_inner_size), PILImage.Resampling.LANCZOS)
                logo_w, logo_h = logo.size

                logo_bg = PILImage.new("RGBA", (badge_size, badge_size), (255, 255, 255, 255))
                logo_x = (badge_size - logo_w) // 2
                logo_y = (badge_size - logo_h) // 2
                logo_mask = logo.split()[3] if len(logo.split()) == 4 else None
                logo_bg.paste(logo, (logo_x, logo_y), mask=logo_mask)
            else:
                logo_bg = PILImage.new("RGBA", (badge_size, badge_size), (255, 255, 255, 255))
                draw_text = ImageDraw.Draw(logo_bg)
                words = [w for w in company_name.strip().split() if w]
                initials = ""
                if len(words) >= 2:
                    initials = (words[0][0] + words[1][0]).upper()
                elif len(words) == 1:
                    initials = words[0][:2].upper()
                else:
                    initials = "MG"

                font_size = int(badge_size * 0.45)
                font = None
                standard_paths = [
                    "arial.ttf",
                    "calibri.ttf",
                    "DejaVuSans.ttf",
                    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
                    "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
                    "/usr/share/fonts/TTF/DejaVuSans.ttf",
                ]
                for font_name in standard_paths:
                    try:
                        font = ImageFont.truetype(font_name, font_size)
                        break
                    except Exception:
                        continue
                if not font:
                    font = ImageFont.load_default()

                try:
                    bbox = draw_text.textbbox((0, 0), initials, font=font)
                    text_w = bbox[2] - bbox[0]
                    text_h = bbox[3] - bbox[1]
                except AttributeError:
                    text_w, text_h = draw_text.textsize(initials, font=font)

                text_x = (badge_size - text_w) // 2
                text_y = (badge_size - text_h) // 2 - int(text_h * 0.15) if font else (badge_size - text_h) // 2
                draw_text.text((text_x, text_y), initials, fill=(113, 36, 103, 255), font=font)

            mask = PILImage.new("L", (badge_size, badge_size), 0)
            draw_mask = ImageDraw.Draw(mask)
            draw_mask.rounded_rectangle([(0, 0), (badge_size, badge_size)], radius=0, fill=255)

            pos = ((qr_width - badge_size) // 2, (qr_height - badge_size) // 2)
            img_qr.paste(logo_bg, pos, mask=mask)
            img_qr.save(str(qr_image_path))
            return True
        except Exception as e:
            print(f"Error overlaying logo: {e}")
            return False
    except Exception as e:
        print(f"Failed to load overlay_logo_on_qr requirements: {e}")
        return False


def get_first_and_last_name(name: str) -> str:
    """Extract and return only the first and last name from a full name string, ignoring separator tokens."""
    if not name:
        return ""
    words = [w.strip() for w in name.split() if w.strip() and w.strip() != "-"]
    if len(words) >= 2:
        return f"{words[0]} {words[-1]}"
    return name


