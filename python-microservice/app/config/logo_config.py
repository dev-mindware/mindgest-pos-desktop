# Logo configuration and management
from pathlib import Path
from typing import Optional
import sys

class LogoManager:
    """Manage logo loading and configuration for PDF generation."""
    
    # Default logo directory
    LOGOS_DIR = Path(__file__).parent.parent.parent / 'assets' / 'logos'
    
    # Logo paths
    DEFAULT_LOGO = LOGOS_DIR / 'mindware_logo_black.png' 
    COMPANY_LOGOS = LOGOS_DIR / 'company'  # For company-specific logos
    
    # Logo dimensions (in mm)
    LOGO_WIDTH = 30  # mm
    LOGO_HEIGHT = 20  # mm
    
    @staticmethod
    def ensure_logos_dir_exists():
        """Create logos directory if it doesn't exist."""
        try:
            LogoManager.LOGOS_DIR.mkdir(parents=True, exist_ok=True)
            LogoManager.COMPANY_LOGOS.mkdir(parents=True, exist_ok=True)
            return True
        except Exception as e:
            print(f"[ERROR] Failed to create logo directories: {str(e)}", file=sys.stderr)
            return False
    
    @staticmethod
    def get_logo_path(company_id: Optional[str] = None) -> Optional[Path]:
        """
        Get logo path for a company.
        
        Args:
            company_id: Optional company ID for company-specific logo
            
        Returns:
            Path to logo file if it exists, None otherwise
        """
        # Check for company-specific logo first
        if company_id:
            company_logo = LogoManager.COMPANY_LOGOS / f"{company_id}.png"
            if company_logo.exists():
                return company_logo
        
        # Fall back to default logo
        if LogoManager.DEFAULT_LOGO.exists():
            return LogoManager.DEFAULT_LOGO
        
        # Log warning if no logo found
        default_path = str(LogoManager.DEFAULT_LOGO)
        company_path = str(LogoManager.COMPANY_LOGOS / f"{company_id}.png") if company_id else "N/A"
        print(
            f"[WARNING] No logo found for company_id={company_id}\n"
            f"  Checked: {company_path}\n"
            f"  Checked: {default_path}\n"
            f"  Using fallback (company initial box)",
            file=sys.stderr
        )
        
        return None
    
    @staticmethod
    def logo_exists(company_id: Optional[str] = None) -> bool:
        """Check if a logo exists for the company."""
        return LogoManager.get_logo_path(company_id) is not None
    
    @staticmethod
    def get_logos_dir() -> Path:
        """Get the logos directory path."""
        return LogoManager.LOGOS_DIR
    
    @staticmethod
    def get_default_logo_path() -> Path:
        """Get the default logo path."""
        return LogoManager.DEFAULT_LOGO
    
    @staticmethod
    def get_company_logos_dir() -> Path:
        """Get the company logos directory path."""
        return LogoManager.COMPANY_LOGOS
