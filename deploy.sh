#!/bin/bash

# 🚀 Thamanea Project Deployment Script
# This script deploys the entire application using Docker

set -e  # Exit on any error

echo "🐳 Deploying Thamanea Podcast Search Application..."
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

# Check if Docker is installed and running
check_docker() {
    print_status "Checking Docker installation..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker Desktop"
        exit 1
    fi
    
    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker Desktop"
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose"
        exit 1
    fi
    
    print_success "Docker is ready"
}

# Stop existing containers
stop_containers() {
    print_status "Stopping existing containers..."
    
    if docker-compose ps | grep -q "Up"; then
        docker-compose down
        print_success "Existing containers stopped"
    else
        print_status "No running containers found"
    fi
}

# Build and start containers
deploy_application() {
    print_status "Building and starting application containers..."
    
    # Build and start all services
    docker-compose up -d --build
    
    print_success "Application containers started"
}

# Wait for services to be healthy
wait_for_services() {
    print_status "Waiting for services to be ready..."
    
    # Wait for database
    print_status "Waiting for PostgreSQL..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
            print_success "PostgreSQL is ready"
            break
        fi
        sleep 2
        timeout=$((timeout-2))
    done
    
    if [ $timeout -le 0 ]; then
        print_error "PostgreSQL failed to start within 60 seconds"
        return 1
    fi
    
    # Wait for backend
    print_status "Waiting for Backend API..."
    timeout=120
    while [ $timeout -gt 0 ]; do
        if curl -sf http://localhost:3001/api/health &> /dev/null; then
            print_success "Backend API is ready"
            break
        fi
        sleep 3
        timeout=$((timeout-3))
    done
    
    if [ $timeout -le 0 ]; then
        print_warning "Backend API might not be ready yet"
    fi
    
    # Wait for frontend
    print_status "Waiting for Frontend..."
    timeout=60
    while [ $timeout -gt 0 ]; do
        if curl -sf http://localhost:3000 &> /dev/null; then
            print_success "Frontend is ready"
            break
        fi
        sleep 3
        timeout=$((timeout-3))
    done
    
    if [ $timeout -le 0 ]; then
        print_warning "Frontend might not be ready yet"
    fi
}

# Show application status
show_status() {
    echo ""
    print_status "Application Status:"
    docker-compose ps
    echo ""
    
    print_status "Application URLs:"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔌 Backend API: http://localhost:3001/api"
    echo "🗄️  Database: localhost:5432"
    echo ""
    
    print_status "Useful Commands:"
    echo "📊 View logs: docker-compose logs -f [service]"
    echo "🛑 Stop app: docker-compose down"
    echo "🔄 Restart: docker-compose restart [service]"
    echo "🐚 Shell access: docker-compose exec [service] sh"
}

# Show logs
show_logs() {
    echo ""
    print_status "Recent logs:"
    docker-compose logs --tail=20
}

# Main deployment function
deploy() {
    echo "Starting deployment process..."
    echo "Time: $(date)"
    echo ""
    
    # Check Docker
    check_docker
    echo ""
    
    # Stop existing containers
    stop_containers
    echo ""
    
    # Deploy application
    deploy_application
    echo ""
    
    # Wait for services
    wait_for_services
    echo ""
    
    # Show status
    show_status
    
    print_success "🎉 Deployment completed successfully!"
    echo ""
    print_status "Your Thamanea application is now running!"
    echo "Visit http://localhost:3000 to start searching for podcasts 🎧"
}

# Parse command line arguments
case "${1:-deploy}" in
    "deploy"|"up")
        deploy
        ;;
    "down"|"stop")
        print_status "Stopping application..."
        docker-compose down
        print_success "Application stopped"
        ;;
    "restart")
        print_status "Restarting application..."
        docker-compose restart
        print_success "Application restarted"
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        docker-compose ps
        ;;
    "clean")
        print_warning "This will remove all containers, volumes, and images!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v --rmi all
            print_success "Cleanup completed"
        else
            print_status "Cleanup cancelled"
        fi
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy    Deploy the application (default)"
        echo "  up        Same as deploy"
        echo "  down      Stop the application"
        echo "  stop      Same as down"
        echo "  restart   Restart the application"
        echo "  logs      Show live logs"
        echo "  status    Show container status"
        echo "  clean     Remove all containers and images"
        echo "  help      Show this help message"
        echo ""
        exit 0
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac
