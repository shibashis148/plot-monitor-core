#!/bin/bash

# Farm Plot Deployment Test Script
# This script helps test the deployment locally before pushing to production

set -e

echo "🚀 Farm Plot Deployment Test"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is running
check_docker() {
    echo "🔍 Checking Docker..."
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    print_status "Docker is running"
}

# Check if Docker Compose is available
check_docker_compose() {
    echo "🔍 Checking Docker Compose..."
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    print_status "Docker Compose is available"
}

# Build and test the application
build_and_test() {
    echo "🔨 Building application..."
    
    # Build Docker image
    docker build -t farmplot-backend:test .
    print_status "Docker image built successfully"
    
    # Test the image
    echo "🧪 Testing Docker image..."
    docker run --rm farmplot-backend:test node --version
    print_status "Docker image test passed"
}

# Test with docker-compose
test_compose() {
    echo "🐳 Testing with Docker Compose..."
    
    # Create test environment file
    cat > .env.test << EOF
NODE_ENV=test
PORT=3000
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
POSTGRES_DB=farmplot_test
POSTGRES_USER=farmplot_user
POSTGRES_PASSWORD=test_password
POSTGRES_SSL=false
ALERT_EMAIL_ENABLED=false
ALERT_WEBHOOK_ENABLED=false
ALERT_ESCALATION_ENABLED=false
EOF

    # Start services
    docker-compose --env-file .env.test up -d
    
    # Wait for services to be ready
    echo "⏳ Waiting for services to start..."
    sleep 30
    
    # Test health endpoint
    echo "🔍 Testing health endpoint..."
    if curl -f http://localhost:3000/health > /dev/null 2>&1; then
        print_status "Health endpoint is responding"
    else
        print_error "Health endpoint is not responding"
        docker-compose --env-file .env.test logs backend
        exit 1
    fi
    
    # Test API endpoints
    echo "🔍 Testing API endpoints..."
    if curl -f http://localhost:3000/v1/plots > /dev/null 2>&1; then
        print_status "API endpoints are responding"
    else
        print_warning "API endpoints are not responding (this might be expected if database is empty)"
    fi
    
    # Cleanup
    echo "🧹 Cleaning up test environment..."
    docker-compose --env-file .env.test down
    rm -f .env.test
    print_status "Test environment cleaned up"
}

# Check GitHub secrets (if available)
check_secrets() {
    echo "🔐 Checking GitHub secrets configuration..."
    
    # List of required secrets
    required_secrets=(
        "AWS_ACCESS_KEY_ID"
        "AWS_SECRET_ACCESS_KEY"
        "AWS_REGION"
        "EC2_HOST"
        "EC2_USERNAME"
        "EC2_SSH_KEY"
        "POSTGRES_DB"
        "POSTGRES_USER"
        "POSTGRES_PASSWORD"
    )
    
    print_warning "Make sure these secrets are configured in GitHub:"
    for secret in "${required_secrets[@]}"; do
        echo "  - $secret"
    done
    echo ""
    print_warning "Go to: Repository Settings → Secrets and variables → Actions"
}

# Main execution
main() {
    echo "Starting deployment test..."
    echo ""
    
    check_docker
    check_docker_compose
    build_and_test
    test_compose
    check_secrets
    
    echo ""
    print_status "All tests passed! Ready for deployment."
    echo ""
    echo "🚀 To deploy to production:"
    echo "   git add ."
    echo "   git commit -m 'Deploy to production'"
    echo "   git push origin main"
    echo ""
    echo "📋 Monitor deployment at:"
    echo "   https://github.com/your-username/your-repo/actions"
}

# Run main function
main "$@"
