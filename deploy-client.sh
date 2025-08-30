#!/bin/bash

# 🌐 Thamanea Client Deployment Script
# Deploy to production for client sharing

set -e

echo "🌐 Deploying Thamanea for Client Sharing..."
echo "=========================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Check if CLI tools are installed
check_tools() {
    print_status "Checking deployment tools..."
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not installed. Installing..."
        npm install -g vercel
    fi
    
    if ! command -v railway &> /dev/null; then
        print_warning "Railway CLI not installed. Installing..."
        npm install -g @railway/cli
    fi
    
    print_success "Deployment tools ready"
}

# Deploy backend to Railway
deploy_backend() {
    print_status "Deploying Backend to Railway..."
    
    cd backend
    
    # Check if railway is initialized
    if [ ! -f "railway.json" ]; then
        print_status "Initializing Railway project..."
        railway init
    fi
    
    # Deploy backend
    print_status "Deploying backend..."
    railway up
    
    # Get backend URL
    BACKEND_URL=$(railway status --json | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    print_success "Backend deployed to: $BACKEND_URL"
    
    cd ..
    echo "$BACKEND_URL" > .backend-url
}

# Deploy frontend to Vercel
deploy_frontend() {
    print_status "Deploying Frontend to Vercel..."
    
    cd frontend
    
    # Check if backend URL exists
    if [ -f "../.backend-url" ]; then
        BACKEND_URL=$(cat ../.backend-url)
        print_status "Using backend URL: $BACKEND_URL"
        
        # Update environment variable
        echo "NEXT_PUBLIC_API_URL=${BACKEND_URL}/api" > .env.local
    fi
    
    # Deploy to Vercel
    print_status "Deploying frontend..."
    vercel --prod --yes
    
    # Get frontend URL
    FRONTEND_URL=$(vercel --prod --yes 2>&1 | grep -o 'https://[^ ]*' | tail -1)
    print_success "Frontend deployed to: $FRONTEND_URL"
    
    cd ..
    echo "$FRONTEND_URL" > .frontend-url
}

# Show deployment summary
show_summary() {
    echo ""
    echo "🎉 Deployment Complete!"
    echo "======================"
    
    if [ -f ".frontend-url" ]; then
        FRONTEND_URL=$(cat .frontend-url)
        echo "🌐 Client URL: $FRONTEND_URL"
    fi
    
    if [ -f ".backend-url" ]; then
        BACKEND_URL=$(cat .backend-url)
        echo "🔌 API URL: $BACKEND_URL/api"
    fi
    
    echo ""
    echo "📋 Share with Client:"
    echo "===================="
    echo "✨ Live Demo: $FRONTEND_URL"
    echo "📱 Mobile Ready: Works on all devices"
    echo "🔍 Search Function: Try searching for 'فنجان'"
    echo "⚡ Fast Loading: Global CDN enabled"
    echo "🔒 Secure: HTTPS encrypted"
    echo ""
    echo "📞 Client Presentation Points:"
    echo "• Responsive design for all devices"
    echo "• Real-time podcast search"
    echo "• Multiple layout options"
    echo "• Arabic language support"
    echo "• Professional UI/UX"
}

# Main deployment
main() {
    echo "Starting client deployment..."
    echo "Time: $(date)"
    echo ""
    
    # Check tools
    check_tools
    echo ""
    
    # Deploy backend
    deploy_backend
    echo ""
    
    # Deploy frontend
    deploy_frontend
    echo ""
    
    # Show summary
    show_summary
    
    # Cleanup temp files
    rm -f .backend-url .frontend-url
}

# Parse arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "frontend")
        deploy_frontend
        ;;
    "backend")
        deploy_backend
        ;;
    "check")
        check_tools
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy    Deploy both frontend and backend (default)"
        echo "  frontend  Deploy only frontend to Vercel"
        echo "  backend   Deploy only backend to Railway"
        echo "  check     Check if deployment tools are installed"
        echo "  help      Show this help"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage"
        exit 1
        ;;
esac
