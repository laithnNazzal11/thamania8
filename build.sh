#!/bin/bash

# 🚀 Thamanea Project Build Script
# This script builds the entire application for production

set -e  # Exit on any error

echo "🏗️  Building Thamanea Podcast Search Application..."
echo "=================================================="

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

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm"
        exit 1
    fi
    
    # Check Node.js version
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Requirements check passed"
}

# Build Backend
build_backend() {
    print_status "Building Backend (NestJS)..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm ci
    
    # Build the application
    print_status "Building backend application..."
    npm run build
    
    print_success "Backend build completed"
    cd ..
}

# Build Frontend
build_frontend() {
    print_status "Building Frontend (Next.js)..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm ci
    
    # Build the application
    print_status "Building frontend application..."
    npm run build
    
    print_success "Frontend build completed"
    cd ..
}

# Create environment files if they don't exist
setup_environment() {
    print_status "Setting up environment files..."
    
    # Backend environment
    if [ ! -f "backend/.env" ]; then
        print_warning "Creating backend/.env from template..."
        cat > backend/.env << EOF
# Database Configuration
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=itunes_search

# Application Configuration
PORT=3001
NODE_ENV=production

# iTunes API
ITUNES_API_BASE_URL=https://itunes.apple.com
EOF
        print_success "Backend .env file created"
    else
        print_success "Backend .env file already exists"
    fi
    
    # Frontend environment
    if [ ! -f "frontend/.env.local" ]; then
        print_warning "Creating frontend/.env.local from template..."
        cat > frontend/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
EOF
        print_success "Frontend .env.local file created"
    else
        print_success "Frontend .env.local file already exists"
    fi
}

# Main build function
main() {
    echo "Starting build process..."
    echo "Time: $(date)"
    echo ""
    
    # Check requirements
    check_requirements
    echo ""
    
    # Setup environment
    setup_environment
    echo ""
    
    # Build backend
    build_backend
    echo ""
    
    # Build frontend
    build_frontend
    echo ""
    
    print_success "🎉 Build completed successfully!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Set up PostgreSQL database"
    echo "2. Update environment variables in .env files"
    echo "3. Run database migrations (if any)"
    echo "4. Start the application:"
    echo "   - Backend: cd backend && npm run start:prod"
    echo "   - Frontend: cd frontend && npm start"
    echo ""
    echo "🐳 Or use Docker:"
    echo "   docker-compose up -d"
    echo ""
    echo "📖 For more details, see BUILD_GUIDE.md"
}

# Parse command line arguments
case "${1:-all}" in
    "backend")
        check_requirements
        build_backend
        ;;
    "frontend") 
        check_requirements
        build_frontend
        ;;
    "env")
        setup_environment
        ;;
    "all"|"")
        main
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [option]"
        echo ""
        echo "Options:"
        echo "  all       Build both backend and frontend (default)"
        echo "  backend   Build only backend"
        echo "  frontend  Build only frontend"
        echo "  env       Setup environment files only"
        echo "  help      Show this help message"
        echo ""
        exit 0
        ;;
    *)
        print_error "Unknown option: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
