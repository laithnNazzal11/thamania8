# 🚀 Thamanea Project - Complete Build & Deployment Guide

## 📋 Project Overview
This is a full-stack podcast search application with:
- **Frontend**: Next.js 15 with TypeScript & Tailwind CSS
- **Backend**: NestJS with TypeORM & PostgreSQL
- **Database**: PostgreSQL with TypeORM migrations

## 🔧 Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn
- Docker (optional for containerized deployment)

## 📁 Project Structure
```
Thamanea/
├── frontend/          # Next.js application
├── backend/           # NestJS API
├── database/          # SQL setup files
├── docs/             # Documentation
└── BUILD_GUIDE.md    # This file
```

## 🗄️ 1. Database Setup

### Local PostgreSQL Setup
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Or use Docker
docker run --name postgres-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Create database
psql -U postgres -c "CREATE DATABASE itunes_search;"
```

### Environment Variables
Create `.env` files:

**Backend** (`backend/.env`):
```env
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=itunes_search

# Application
PORT=3001
NODE_ENV=development

# iTunes API
ITUNES_API_BASE_URL=https://itunes.apple.com
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 🏗️ 2. Backend Build & Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Build the application
npm run build

# Start in development
npm run start:dev

# Start in production
npm run start:prod
```

### Production Backend Build
```bash
# Build for production
npm run build

# Install only production dependencies
npm ci --only=production

# Start production server
NODE_ENV=production npm run start:prod
```

## 🎨 3. Frontend Build & Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Or development
npm run dev
```

### Frontend Production Build
```bash
# Create optimized production build
npm run build

# Test production build locally
npm start

# The build creates:
# - .next/static/ (static assets)
# - .next/server/ (server files)
```

## 🐳 4. Docker Deployment (Recommended)

### Create Docker Files

**Backend Dockerfile** (`backend/Dockerfile`):
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY dist/ ./dist/
COPY src/ ./src/

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
```

**Frontend Dockerfile** (`frontend/Dockerfile`):
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

RUN npm ci --only=production

EXPOSE 3000

CMD ["npm", "start"]
```

**Docker Compose** (`docker-compose.yml`):
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: itunes_search
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/setup.sql:/docker-entrypoint-initdb.d/setup.sql

  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USERNAME: postgres
      DATABASE_PASSWORD: password
      DATABASE_NAME: itunes_search
      NODE_ENV: production
    depends_on:
      - postgres

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api
    depends_on:
      - backend

volumes:
  postgres_data:
```

## 🚀 5. Deployment Commands

### Local Development
```bash
# Start all services
docker-compose up -d

# Or manually:
# Terminal 1: Database
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15

# Terminal 2: Backend
cd backend && npm run start:dev

# Terminal 3: Frontend  
cd frontend && npm run dev
```

### Production Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d --build

# Or manual production build:
cd backend && npm run build && npm run start:prod
cd frontend && npm run build && npm start
```

## ⚙️ 6. Environment-Specific Builds

### Development
```bash
# Backend development with hot reload
cd backend && npm run start:dev

# Frontend development with hot reload
cd frontend && npm run dev
```

### Staging
```bash
# Use staging environment variables
cp .env.staging .env
npm run build
npm start
```

### Production
```bash
# Production optimized builds
NODE_ENV=production npm run build
NODE_ENV=production npm run start:prod
```

## 🔍 7. Build Verification

### Backend Health Check
```bash
curl http://localhost:3001/api/health
```

### Frontend Build Check
```bash
# Check if build completed successfully
ls -la frontend/.next/

# Test production build
cd frontend && npm run build && npm start
```

### Database Connection Test
```bash
# Connect to database
psql -h localhost -U postgres -d itunes_search -c "SELECT 1;"
```

## 📊 8. Performance Optimization

### Frontend Optimization
```bash
# Analyze bundle size
cd frontend && npm run build -- --analyze

# Enable caching
# Add to next.config.js:
module.exports = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false
}
```

### Backend Optimization
```bash
# Enable production logging
# Add to main.ts:
app.use(compression());
app.enableCors();
```

## 🛠️ 9. Troubleshooting

### Common Issues
1. **Port conflicts**: Change ports in docker-compose.yml
2. **Database connection**: Check PostgreSQL is running
3. **Environment variables**: Verify all .env files are present
4. **Build failures**: Clear node_modules and reinstall

### Debug Commands
```bash
# Check running services
docker-compose ps

# View logs
docker-compose logs backend
docker-compose logs frontend

# Database logs
docker-compose logs postgres
```

## 📝 10. Deployment Checklist

- [ ] Database is running and accessible
- [ ] Environment variables are set
- [ ] Backend builds successfully (`npm run build`)
- [ ] Frontend builds successfully (`npm run build`) 
- [ ] All services start without errors
- [ ] API endpoints respond correctly
- [ ] Frontend can communicate with backend
- [ ] Search functionality works end-to-end

## 🎯 Quick Start Commands

```bash
# Clone and setup
git clone <repo>
cd Thamanea

# Start everything with Docker
docker-compose up -d

# Or manual setup
cd backend && npm install && npm run start:dev
cd frontend && npm install && npm run dev

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:3001/api
```

---

## 🚀 Ready for Production!

Your Thamanea podcast search application is now ready for deployment with:
- ✅ Optimized builds
- ✅ Database setup
- ✅ Docker configuration
- ✅ Environment management
- ✅ Performance optimization

**Happy Deploying! 🎉**
