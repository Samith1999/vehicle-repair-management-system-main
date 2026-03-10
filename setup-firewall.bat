@echo off
REM Run this as Administrator to open firewall ports

echo Checking for administrator privileges...
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo.
    echo Please:
    echo 1. Right-click on the Command Prompt
    echo 2. Select "Run as administrator"
    echo 3. Then run this script again
    pause
    exit /b 1
)

echo.
echo Removing old firewall rules...
netsh advfirewall firewall delete rule name="React Frontend Port 3000" >nul 2>&1
netsh advfirewall firewall delete rule name="Node.js Backend Port 5000" >nul 2>&1
netsh advfirewall firewall delete rule name="React Port 3000" >nul 2>&1
netsh advfirewall firewall delete rule name="Node Port 5000" >nul 2>&1
netsh advfirewall firewall delete rule name="React Frontend 3000" >nul 2>&1
netsh advfirewall firewall delete rule name="Node Backend 5000" >nul 2>&1

echo.
echo Adding new firewall rules...

netsh advfirewall firewall add rule name="Vehicle Repair Port 3000" dir=in action=allow protocol=tcp localport=3000 enable=yes profile=public,private
if %errorLevel% equ 0 (
    echo ✓ Port 3000 (Frontend) - OPEN
) else (
    echo ✗ Port 3000 - FAILED
)

netsh advfirewall firewall add rule name="Vehicle Repair Port 5000" dir=in action=allow protocol=tcp localport=5000 enable=yes profile=public,private
if %errorLevel% equ 0 (
    echo ✓ Port 5000 (Backend) - OPEN
) else (
    echo ✗ Port 5000 - FAILED
)

echo.
echo ============================================
echo Firewall configuration complete!
echo ============================================
echo.
echo You can now access the application at:
echo   http://192.168.1.20:3000
echo.
echo From your office PC (192.168.1.38)
echo ============================================
echo.
pause
