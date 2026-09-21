@echo off
echo ========================================
echo Warehouse Management System - Database Reset
echo ========================================
echo.

REM Warn user about data loss
echo WARNING: This will DELETE ALL DATA in the database!
echo.
set /p confirm="Are you sure you want to continue? (y/n): "
if /i not "%confirm%"=="y" (
    echo Operation cancelled.
    pause
    exit /b 0
)

echo.
echo Deleting database file...
if exist "data\inventory.db" (
    del "data\inventory.db"
    echo Database deleted.
) else (
    echo Database file not found.
)

echo.
echo Running migrations...
call npm run db:migrate

echo.
echo Seeding initial data...
call npm run db:seed

echo.
echo ========================================
echo Database reset completed successfully!
echo ========================================
echo.
echo New database location: ./data/inventory.db
echo.
pause
