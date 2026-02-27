import logging
import logging.config
from config.settings import LOG_FILE, LOG_LEVEL, LOG_FORMAT

def setup_logging():
    """Configure logging for the application."""
    logging.config.dictConfig({
        "version": 1,
        "disable_existing_loggers": False,
        "formatters": {
            "standard": {
                "format": LOG_FORMAT
            },
        },
        "handlers": {
            "console": {
                "class": "logging.StreamHandler",
                "level": LOG_LEVEL,
                "formatter": "standard",
                "stream": "ext://sys.stdout"
            },
            "file": {
                "class": "logging.FileHandler",
                "level": LOG_LEVEL,
                "formatter": "standard",
                "filename": str(LOG_FILE)
            }
        },
        "root": {
            "level": LOG_LEVEL,
            "handlers": ["console", "file"]
        }
    })

def get_logger(name: str) -> logging.Logger:
    """Get a logger instance."""
    return logging.getLogger(name)
