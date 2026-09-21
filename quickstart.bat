@echo off
echo ========================================
echo Warehouse Management System - Quick Start
echo ========================================
echo.
echo This script will:
echo   1. Install dependencies
echo   2. Setup database
echo   3. Seed initial data
echo   4. Build the project
echo   5. Start the production server
echo.
pause

REM Run setup
call setup.bat
if %errorlevel% neq 0 (
    echo ERROR: Setup failed!
    pause
    exit /b 1
)

REM Build for production
call build.bat
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

REM Start production server
call start.bat
