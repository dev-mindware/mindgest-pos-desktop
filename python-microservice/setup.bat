@echo off
REM Setup script for Python Microservice on Windows

echo ========================================
echo MindGest Python Microservice Setup
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo.
    echo Please install Python from: https://www.python.org/downloads/
    echo Make sure to check "Add Python to PATH" during installation
    echo.
    pause
    exit /b 1
)

echo [1/4] Detected Python:
python --version
echo.

REM Create virtual environment
echo [2/4] Creating Virtual Environment...
if exist venv (
    echo Virtual environment already exists. Skipping...
) else (
    python -m venv venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment
        pause
        exit /b 1
    )
    echo Virtual environment created successfully
)
echo.

REM Activate virtual environment
echo [3/4] Activating Virtual Environment...
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)
echo Virtual environment activated
echo.

REM Install dependencies
echo [4/4] Installing Dependencies...
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully
echo.

echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the microservice, run:
echo   python -m uvicorn app.main:app --reload --port 3002
echo.
echo To activate virtual environment in the future:
echo   venv\Scripts\activate.bat
echo.
echo Open http://localhost:3002/docs in your browser
echo.
pause
