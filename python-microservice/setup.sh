#!/bin/bash

# Setup script for Python Microservice on Linux/macOS

echo "========================================"
echo "MindGest Python Microservice Setup"
echo "========================================"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "ERROR: Python 3 is not installed"
    echo ""
    echo "Install Python using:"
    echo "  macOS: brew install python3"
    echo "  Ubuntu/Debian: sudo apt install python3 python3-venv"
    echo "  Fedora: sudo dnf install python3"
    echo ""
    exit 1
fi

echo "[1/4] Detected Python:"
python3 --version
echo ""

# Create virtual environment
echo "[2/4] Creating Virtual Environment..."
if [ -d "venv" ]; then
    echo "Virtual environment already exists. Skipping..."
else
    python3 -m venv venv
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to create virtual environment"
        exit 1
    fi
    echo "Virtual environment created successfully"
fi
echo ""

# Activate virtual environment
echo "[3/4] Activating Virtual Environment..."
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to activate virtual environment"
    exit 1
fi
echo "Virtual environment activated"
echo ""

# Install dependencies
echo "[4/4] Installing Dependencies..."
pip install -r requirements.txt
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo "Dependencies installed successfully"
echo ""

echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "To start the microservice, run:"
echo "  python -m uvicorn app.main:app --reload --port 3002"
echo ""
echo "To activate virtual environment in the future:"
echo "  source venv/bin/activate"
echo ""
echo "Open http://localhost:3002/docs in your browser"
echo ""
