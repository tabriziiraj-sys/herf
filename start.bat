@echo off
echo ========================================
echo Warehouse Management System - Production
echo ========================================
echo.

REM Check if .next directory exists (build output)
if not exist ".next" (
    echo ERROR: Project not built yet!
    echo Please run build.bat first
    pause
    exit /b 1
)

REM Check if data directory exists
if not exist "data" (
    echo Creating data directory...
    mkdir data
)

echo Starting production server...
echo.
echo Open your browser at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run start
