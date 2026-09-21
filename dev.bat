@echo off
echo ========================================
echo Warehouse Management System - Dev Server
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Dependencies not installed!
    echo Please run setup.bat first
    pause
    exit /b 1
)

REM Check if data directory exists
if not exist "data" (
    echo Creating data directory...
    mkdir data
)

echo Starting development server...
echo.
echo Open your browser at: http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
