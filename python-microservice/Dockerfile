# ============================================
# Python Document Generator Microservice
# ============================================
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install system dependencies (minimal for slim image)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --timeout 100 --retries 10 -r requirements.txt


# Copy application code
COPY . .

# Create necessary directories with proper permissions
RUN mkdir -p logs temp uploads
RUN mkdir -p assets/logos/company
RUN chmod 755 logs temp uploads assets assets/logos assets/logos/company

# Create non-root user for security
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3002/health || exit 1

# Run application
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
CMD python -m uvicorn app.main:app --host 0.0.0.0 --port ${SERVICE_PORT:-3002} --log-level info
