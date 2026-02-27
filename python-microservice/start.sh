#!/bin/bash

# Start script for Python Microservice on Linux/macOS

echo "========================================"
echo "Starting MindGest Python Microservice"
echo "========================================"
echo ""

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "ERROR: Virtual environment not found."
    echo "Please run setup.sh first."
    exit 1
fi

# Activate virtual environment
source venv/bin/activate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to activate virtual environment"
    exit 1
fi

# Start uvicorn
echo "Starting Uvicorn server..."
python -m uvicorn app.main:app --reload --port 3002
