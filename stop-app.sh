#!/bin/bash

# iTunes Search Application Stop Script
# This script stops both backend and frontend services

echo "🛑 Stopping iTunes Search Application..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to kill process if running
kill_process() {
    local pid=$1
    local name=$2
    
    if [ -n "$pid" ] && ps -p $pid > /dev/null 2>&1; then
        print_status "Stopping $name (PID: $pid)..."
        kill $pid
        sleep 2
        
        # Force kill if still running
        if ps -p $pid > /dev/null 2>&1; then
            print_status "Force stopping $name..."
            kill -9 $pid
        fi
        
        print_success "$name stopped"
    else
        print_status "$name was not running"
    fi
}

# Kill processes by PID files
if [ -f "backend.pid" ]; then
    BACKEND_PID=$(cat backend.pid)
    kill_process $BACKEND_PID "Backend"
    rm -f backend.pid
fi

if [ -f "frontend.pid" ]; then
    FRONTEND_PID=$(cat frontend.pid)
    kill_process $FRONTEND_PID "Frontend"
    rm -f frontend.pid
fi

# Kill by port (backup method)
print_status "Checking for processes on default ports..."

# Kill process on port 3001 (backend)
BACKEND_PORT_PID=$(lsof -ti:3001)
if [ -n "$BACKEND_PORT_PID" ]; then
    print_status "Found process on port 3001: $BACKEND_PORT_PID"
    kill_process $BACKEND_PORT_PID "Backend (port 3001)"
fi

# Kill process on port 3000 (frontend)
FRONTEND_PORT_PID=$(lsof -ti:3000)
if [ -n "$FRONTEND_PORT_PID" ]; then
    print_status "Found process on port 3000: $FRONTEND_PORT_PID"
    kill_process $FRONTEND_PORT_PID "Frontend (port 3000)"
fi

print_success "🎉 All services stopped successfully!"
print_status "Ports 3000 and 3001 are now available"
