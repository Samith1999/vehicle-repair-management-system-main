@echo off
echo Opening firewall ports for Vehicle Repair System...

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Please run this as Administrator!
    pause
    exit /b 1
)

REM Open port 3000 for frontend
netsh advfirewall firewall delete rule name="React Frontend 3000" >nul 2>&1
netsh advfirewall firewall add rule name="React Frontend 3000" dir=in action=allow protocol=tcp localport=3000 enable=yes
echo ✓ Port 3000 (Frontend) opened

REM Open port 5000 for backend
netsh advfirewall firewall delete rule name="Node Backend 5000" >nul 2>&1
netsh advfirewall firewall add rule name="Node Backend 5000" dir=in action=allow protocol=tcp localport=5000 enable=yes
echo ✓ Port 5000 (Backend) opened

echo.
echo Firewall ports are now open!
echo Access the application at: http://192.168.1.20:3000
pause
