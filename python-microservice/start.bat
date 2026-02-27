@echo off
REM Start script for Python Microservice on Windows

echo ========================================
echo Starting MindGest Python Microservice
echo ========================================
echo.

REM Check if venv exists
if not exist venv (
    echo ERROR: Virtual environment not found.
    echo Please run setup.bat first.
    pause
    exit /b 1
)

REM Activate virtual environment
call venv\Scripts\activate.bat
if errorlevel 1 (
    echo ERROR: Failed to activate virtual environment
    pause
    exit /b 1
)

REM Start uvicorn
echo Starting Uvicorn server...
python -m uvicorn app.main:app --reload --port 3002

pause
