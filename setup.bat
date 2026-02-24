@echo off
REM ===================================================
REM Vehicle Repair Management System - Setup Script
REM Windows
REM ===================================================

echo.
echo ========================================
echo Vehicle Repair Management System Setup
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking if Node.js is installed...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed!
    echo Please download from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js is installed

REM Check if MySQL is installed
echo Checking if MySQL is installed...
mysql --version >nul 2>&1
if errorlevel 1 (
    echo WARNING: MySQL is not found in PATH
    echo Please ensure MySQL server is running and accessible
)

REM Setup Backend
echo.
echo ========================================
echo Setting up Backend...
echo ========================================
cd backend
if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install backend dependencies
        pause
        exit /b 1
    )
)
echo ✓ Backend ready

REM Setup Frontend
echo.
cd ..
echo ========================================
echo Setting up Frontend...
echo ========================================
cd frontend
if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install frontend dependencies
        pause
        exit /b 1
    )
)
echo ✓ Frontend ready

REM Success message
cd ..
echo.
echo ========================================
echo ✓ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo.
echo 1. Import the database:
echo    mysql -u root -p ^< vehicle_repair_system.sql
echo.
echo 2. Start Backend (open new PowerShell/CMD):
echo    cd backend
echo    node server.js
echo.
echo 3. Start Frontend (open another PowerShell/CMD):
echo    cd frontend
echo    npm start
echo.
echo 4. Open in browser: http://localhost:3000
echo.
echo Test Logins:
echo   engineer@hospital.com / password123
echo   officer@rdhs.com / password123
echo   rdhs@health.gov / password123
echo   admin@system.com / admin123
echo.
pause
