@echo off
REM This script adds firewall rules for ports 3000 and 5000
REM Run this as Administrator

netsh advfirewall firewall add rule name="React Frontend Port 3000" dir=in action=allow protocol=tcp localport=3000
netsh advfirewall firewall add rule name="Node.js Backend Port 5000" dir=in action=allow protocol=tcp localport=5000

echo.
echo Firewall rules added successfully!
echo.
pause
