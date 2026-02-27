# Document configuration and templates
from enum import Enum
from typing import TypedDict, Optional

class DocumentStyle(TypedDict):
    """Document styling configuration."""
    primary_color: str
    secondary_color: str
    font_family: str
    font_size_title: int
    font_size_body: int
    margin_top: float
    margin_bottom: float
    margin_left: float
    margin_right: float

class LogoConfig(TypedDict):
    """Logo configuration."""
    path: Optional[str]
    width: float
    height: float
    position: str  # 'top-left', 'center', 'top-right'

class CompanyHeaderConfig(TypedDict):
    """Company header configuration."""
    show_logo: bool
    show_contact: bool
    show_tax_id: bool
    sections: list

class DocumentConfig:
    """Central document configuration."""
    
    # Default styles
    DEFAULT_STYLE: DocumentStyle = {
        'primary_color': '#1a1a1a',
        'secondary_color': '#666666',
        'font_family': 'Helvetica',
        'font_size_title': 24,
        'font_size_body': 10,
        'margin_top': 20,
        'margin_bottom': 20,
        'margin_left': 20,
        'margin_right': 20,
    }
    
    # Logo configuration
    DEFAULT_LOGO_CONFIG: LogoConfig = {
        'path': None,
        'width': 80,
        'height': 60,
        'position': 'top-left',
    }
    
    # Company header configuration
    DEFAULT_HEADER_CONFIG: CompanyHeaderConfig = {
        'show_logo': True,
        'show_contact': True,
        'show_tax_id': True,
        'sections': ['name', 'address', 'contact'],
    }
    
    # Page sizes
    PAGE_SIZES = {
        'A4': (210, 297),
        'LETTER': (216, 280),
    }
    
    # Font sizes
    FONT_SIZES = {
        'title': 24,
        'heading': 14,
        'subheading': 12,
        'body': 10,
        'small': 8,
    }
    
    @staticmethod
    def get_style() -> DocumentStyle:
        """Get default style configuration."""
        return DocumentConfig.DEFAULT_STYLE.copy()
    
    @staticmethod
    def get_logo_config() -> LogoConfig:
        """Get default logo configuration."""
        return DocumentConfig.DEFAULT_LOGO_CONFIG.copy()
    
    @staticmethod
    def get_header_config() -> CompanyHeaderConfig:
        """Get default company header configuration."""
        return DocumentConfig.DEFAULT_HEADER_CONFIG.copy()
    
    @staticmethod
    def merge_style(custom_style: dict) -> DocumentStyle:
        """Merge custom style with defaults."""
        style = DocumentConfig.get_style()
        style.update(custom_style)
        return style
