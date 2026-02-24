#!/bin/bash

# ===================================================
# Vehicle Repair Management System - Setup Script
# Mac/Linux
# ===================================================

echo ""
echo "========================================"
echo "Vehicle Repair Management System Setup"
echo "========================================"
echo ""

# Check if Node.js is installed
echo "Checking if Node.js is installed..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please download from: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js is installed ($(node --version))"

# Check if MySQL is installed
echo "Checking if MySQL is installed..."
if ! command -v mysql &> /dev/null; then
    echo "WARNING: MySQL not found in PATH"
    echo "Ensure MySQL server is running"
fi

# Setup Backend
echo ""
echo "========================================"
echo "Setting up Backend..."
echo "========================================"
cd backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install backend dependencies"
        exit 1
    fi
fi
echo "✓ Backend ready"

# Setup Frontend
echo ""
cd ..
echo "========================================"
echo "Setting up Frontend..."
echo "========================================"
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install frontend dependencies"
        exit 1
    fi
fi
echo "✓ Frontend ready"

# Success message
cd ..
echo ""
echo "========================================"
echo "✓ Setup Complete!"
echo "========================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Import the database:"
echo "   mysql -u root -p < vehicle_repair_system.sql"
echo ""
echo "2. Start Backend (in new terminal):"
echo "   cd backend"
echo "   node server.js"
echo ""
echo "3. Start Frontend (in another terminal):"
echo "   cd frontend"
echo "   npm start"
echo ""
echo "4. Open in browser: http://localhost:3000"
echo ""
echo "Test Logins:"
echo "   engineer@hospital.com / password123"
echo "   officer@rdhs.com / password123"
echo "   rdhs@health.gov / password123"
echo "   admin@system.com / admin123"
echo ""
