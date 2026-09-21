@echo off
echo ========================================
echo Warehouse Management System - Build
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo ERROR: Dependencies not installed!
    echo Please run setup.bat first
    pause
    exit /b 1
)

echo Building for production...
echo This may take a few minutes...
echo.

call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build completed successfully!
echo ========================================
echo.
echo To start the production server, run:
echo   start.bat
echo.
pause
