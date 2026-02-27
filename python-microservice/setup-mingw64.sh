#!/bin/bash

# Setup script specifically for MINGW64

echo "========================================"
echo "MindGest Python - MINGW64 Setup"
echo "========================================"
echo ""

# Try python3 first (more reliable on MINGW64)
if command -v python3 &> /dev/null; then
    PYTHON_CMD="python3"
    echo "[✓] Found python3"
elif command -v python &> /dev/null; then
    PYTHON_CMD="python"
    echo "[✓] Found python"
else
    # Try full path for Windows installation
    if [ -f "/c/Users/$(whoami)/AppData/Local/Programs/Python/Python312/python.exe" ]; then
        PYTHON_CMD="/c/Users/$(whoami)/AppData/Local/Programs/Python/Python312/python.exe"
        echo "[✓] Found Python at: $PYTHON_CMD"
    elif [ -f "/c/Users/$(whoami)/AppData/Local/Programs/Python/Python311/python.exe" ]; then
        PYTHON_CMD="/c/Users/$(whoami)/AppData/Local/Programs/Python/Python311/python.exe"
        echo "[✓] Found Python at: $PYTHON_CMD"
    else
        echo "[✗] ERROR: Python not found"
        echo ""
        echo "Python was not found in standard locations."
        echo "Please ensure Python is installed and added to PATH."
        echo ""
        echo "Download from: https://www.python.org/downloads/"
        exit 1
    fi
fi

echo "Python: $($PYTHON_CMD --version)"
echo ""

# Create virtual environment
echo "[1/4] Creating Virtual Environment..."
if [ -d "venv" ]; then
    echo "       Virtual environment already exists. Skipping..."
else
    $PYTHON_CMD -m venv venv
    if [ $? -ne 0 ]; then
        echo "[✗] ERROR: Failed to create virtual environment"
        exit 1
    fi
    echo "[✓] Virtual environment created"
fi
echo ""

# Activate virtual environment
echo "[2/4] Activating Virtual Environment..."
source venv/Scripts/activate
if [ $? -ne 0 ]; then
    echo "[✗] ERROR: Failed to activate virtual environment"
    exit 1
fi
echo "[✓] Virtual environment activated"
echo ""

# Upgrade pip
echo "[3/4] Upgrading pip..."
python -m pip install --upgrade pip
if [ $? -ne 0 ]; then
    echo "[✗] ERROR: Failed to upgrade pip"
    exit 1
fi
echo "[✓] pip upgraded"
echo ""

# Install dependencies
echo "[4/4] Installing Dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "[✗] ERROR: Failed to install dependencies"
    echo ""
    echo "Try running manually:"
    echo "  pip install fastapi uvicorn pydantic reportlab lxml python-docx python-dotenv requests pillow"
    exit 1
fi
echo "[✓] Dependencies installed"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "  1. Activate virtual environment:"
echo "     source venv/Scripts/activate"
echo ""
echo "  2. Start the microservice:"
echo "     python -m uvicorn app.main:app --reload --port 3002"
echo ""
echo "  3. Open in browser:"
echo "     http://localhost:3002/docs"
echo ""
