@echo off
echo ========================================
echo Warehouse Management System - Setup
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found: 
node --version
echo.

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not installed!
    pause
    exit /b 1
)

echo npm found: 
npm --version
echo.

REM Create data directory if not exists
if not exist "data" (
    echo Creating data directory...
    mkdir data
    echo Data directory created.
    echo.
)

REM Install dependencies
echo Installing dependencies...
echo This may take a few minutes...
echo.
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)
echo Dependencies installed successfully.
echo.

REM Run database migrations and seed
echo Setting up database and seeding initial data...
echo.
call npm run db:migrate
if %errorlevel% neq 0 (
    echo WARNING: Database migration had issues, continuing...
)

call npm run db:seed
if %errorlevel% neq 0 (
    echo WARNING: Database seeding had issues, continuing...
)
echo Database setup complete.
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo Database location: ./data/inventory.db
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo To build for production, run:
echo   npm run build
echo   npm run start
echo.
pause
