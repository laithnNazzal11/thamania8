#!/bin/bash

# iTunes Search Application Startup Script
# This script starts both backend and frontend services

set -e

echo "🚀 Starting iTunes Search Application..."
echo "==========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "Node.js version: $(node --version)"
print_status "npm version: $(npm --version)"

# Function to check if port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null; then
        return 0  # Port is in use
    else
        return 1  # Port is free
    fi
}

# Check if required ports are available
if check_port 3001; then
    print_warning "Port 3001 is already in use. Backend might already be running."
    print_status "If you want to restart, please kill the process on port 3001 first."
else
    print_success "Port 3001 is available for backend"
fi

if check_port 3000; then
    print_warning "Port 3000 is already in use. Frontend might already be running."
    print_status "If you want to restart, please kill the process on port 3000 first."
else
    print_success "Port 3000 is available for frontend"
fi

# Install backend dependencies if needed
print_status "Checking backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    print_status "Installing backend dependencies..."
    npm install
    print_success "Backend dependencies installed"
else
    print_success "Backend dependencies already installed"
fi

# Install frontend dependencies if needed
print_status "Checking frontend dependencies..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    print_status "Installing frontend dependencies..."
    npm install
    print_success "Frontend dependencies installed"
else
    print_success "Frontend dependencies already installed"
fi

cd ..

# Create environment files if they don't exist
print_status "Setting up environment configuration..."

if [ ! -f "backend/.env" ]; then
    print_status "Creating backend .env file..."
    cp backend/env.example backend/.env
    print_success "Backend .env created. Please update with your database credentials."
fi

if [ ! -f "frontend/.env.local" ]; then
    print_status "Creating frontend .env.local file..."
    cp frontend/env.local.example frontend/.env.local
    print_success "Frontend .env.local created"
fi

# Database setup reminder
print_warning "IMPORTANT: Make sure PostgreSQL is running and database 'itunes_search' is created"
print_status "Run the setup script in database/setup.sql if you haven't already"

echo ""
print_status "Starting services..."
echo "==========================================="

# Start backend in background
print_status "Starting backend server on port 3001..."
cd backend
npm run start:dev &
BACKEND_PID=$!
print_success "Backend started with PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

# Start frontend in background
print_status "Starting frontend server on port 3000..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!
print_success "Frontend started with PID: $FRONTEND_PID"

# Save PIDs for cleanup
echo $BACKEND_PID > ../backend.pid
echo $FRONTEND_PID > ../frontend.pid

echo ""
print_success "🎉 Application is starting up!"
echo "==========================================="
print_status "Backend API: http://localhost:3001/api"
print_status "Frontend App: http://localhost:3000"
print_status "Health Check: http://localhost:3001/api/health"
echo ""
print_status "To stop the application, run: ./stop-app.sh"
print_status "Or manually kill processes:"
print_status "  Backend PID: $BACKEND_PID"
print_status "  Frontend PID: $FRONTEND_PID"

# Wait for user interrupt
trap 'print_status "Received interrupt signal. Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; rm -f backend.pid frontend.pid; exit 0' INT

print_status "Press Ctrl+C to stop all services"
wait
