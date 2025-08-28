# iTunes Search Application - Setup Guide

This guide will help you set up and run the iTunes Search application on your local machine.

## 📋 **Prerequisites**

### **Required Software**
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

### **Verify Installation**
```bash
node --version    # Should show v18.x.x or higher
npm --version     # Should show 8.x.x or higher
psql --version    # Should show PostgreSQL 13.x or higher
```

---

## 🚀 **Quick Start**

### **1. Clone the Repository**
```bash
git clone https://github.com/laithnNazzal11/thamania8.git
cd thamania8
```

### **2. Database Setup**
```bash
# Start PostgreSQL service (if not running)
# macOS with Homebrew:
brew services start postgresql

# Ubuntu/Debian:
sudo systemctl start postgresql

# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE itunes_search;

# Exit psql
\q
```

### **3. Environment Configuration**
```bash
# Backend environment
cp backend/env.example backend/.env

# Frontend environment  
cp frontend/env.local.example frontend/.env.local
```

**Edit `backend/.env`** with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=itunes_search
PORT=3001
NODE_ENV=development
```

### **4. Install Dependencies & Start**
```bash
# Use the automated startup script
chmod +x start-app.sh
./start-app.sh
```

**Or manually:**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start backend (in one terminal)
cd ../backend
npm run start:dev

# Start frontend (in another terminal)
cd ../frontend
npm run dev
```

### **5. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/api/health

---

## 🔧 **Detailed Setup**

### **Backend Setup**

#### **1. Install Dependencies**
```bash
cd backend
npm install
```

#### **2. Database Configuration**
The application uses PostgreSQL with TypeORM. The database schema will be automatically created when you start the backend (thanks to `synchronize: true` in development).

#### **3. Environment Variables**
Create `backend/.env` from the example:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=itunes_search

# Application Configuration
PORT=3001
NODE_ENV=development

# iTunes API Configuration (optional)
ITUNES_API_BASE_URL=https://itunes.apple.com/search
```

#### **4. Start Backend**
```bash
# Development mode (with hot reload)
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

### **Frontend Setup**

#### **1. Install Dependencies**
```bash
cd frontend
npm install
```

#### **2. Environment Variables**
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### **3. Start Frontend**
```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

---

## 🧪 **Testing**

### **API Testing**
Use the included test script to verify the backend:
```bash
# Install axios for testing (if not already installed)
npm install axios

# Run API tests
node test-api.js
```

### **Manual Testing Flow**
1. **Start both services** (backend on 3001, frontend on 3000)
2. **Open frontend** at http://localhost:3000
3. **Perform a search** (e.g., "Joe Rogan", "Technology", "Comedy")
4. **Verify results** are displayed and stored in database
5. **Check API endpoints** directly:
   - http://localhost:3001/api/health
   - http://localhost:3001/api/search?term=podcast

### **Database Verification**
```bash
# Connect to database
psql -U postgres -d itunes_search

# Check if tables were created
\dt

# Check podcast data
SELECT track_name, artist_name, search_term FROM podcasts LIMIT 5;

# Exit
\q
```

---

## 🛠️ **Scripts**

### **Startup Scripts**
```bash
# Start both frontend and backend
./start-app.sh

# Stop all services
./stop-app.sh

# Test API functionality
node test-api.js
```

### **Backend Scripts**
```bash
cd backend

# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Linting
npm run lint
```

### **Frontend Scripts**
```bash
cd frontend

# Development
npm run dev

# Production build
npm run build
npm run start

# Linting
npm run lint
```

---

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. Port Already in Use**
```bash
# Check what's using the port
lsof -i :3001  # Backend port
lsof -i :3000  # Frontend port

# Kill the process
kill -9 <PID>
```

#### **2. Database Connection Failed**
- Verify PostgreSQL is running: `brew services list | grep postgresql`
- Check database exists: `psql -U postgres -l | grep itunes_search`
- Verify credentials in `.env` file
- Check firewall settings

#### **3. iTunes API Errors**
- Check internet connection
- Verify the iTunes API is accessible: `curl "https://itunes.apple.com/search?term=test"`
- Check for rate limiting (try again later)

#### **4. Module Not Found Errors**
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
cd frontend
rm -rf .next
npm run dev
```

#### **5. TypeScript Errors**
```bash
# Check TypeScript configuration
npx tsc --noEmit

# Update TypeScript if needed
npm update typescript
```

### **Environment Issues**

#### **Development vs Production**
- Development: Database auto-creates tables, detailed errors shown
- Production: Manual database setup required, errors are sanitized

#### **CORS Issues**
If frontend can't reach backend:
1. Check backend CORS configuration in `main.ts`
2. Verify frontend URL is whitelisted
3. Ensure both services are running

### **Performance Issues**

#### **Slow Database Queries**
```sql
-- Check for missing indexes
EXPLAIN ANALYZE SELECT * FROM podcasts WHERE search_term ILIKE '%test%';

-- Add indexes if needed (already included in schema)
CREATE INDEX IF NOT EXISTS idx_podcasts_search_term ON podcasts(search_term);
```

#### **Slow iTunes API**
- The iTunes API can be slow (2-5 seconds)
- This is normal and handled with loading states
- Results are cached in database for faster subsequent access

---

## 📝 **Configuration Options**

### **Backend Configuration**
| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | localhost | PostgreSQL host |
| `DB_PORT` | 5432 | PostgreSQL port |
| `DB_USERNAME` | postgres | Database username |
| `DB_PASSWORD` | password | Database password |
| `DB_NAME` | itunes_search | Database name |
| `PORT` | 3001 | Backend server port |
| `NODE_ENV` | development | Environment mode |

### **Frontend Configuration**
| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | http://localhost:3001/api | Backend API URL |

### **Feature Flags**
In `backend/src/app.module.ts`:
- `synchronize: true` - Auto-create database tables (development only)
- `logging: true` - Enable SQL query logging (development only)

---

## 🔄 **Updates & Maintenance**

### **Updating Dependencies**
```bash
# Check for outdated packages
npm outdated

# Update packages
npm update

# Update to latest versions (careful!)
npx npm-check-updates -u
npm install
```

### **Database Migrations**
For production, disable `synchronize` and use proper migrations:
```bash
# Generate migration
npx typeorm migration:generate -n UpdatePodcastSchema

# Run migrations
npx typeorm migration:run
```

---

## 📞 **Support**

If you encounter issues:

1. **Check this documentation** for common solutions
2. **Review the logs** in terminal for error details
3. **Check GitHub Issues** for similar problems
4. **Verify system requirements** are met

For development questions about the assignment:
- Review the solution documentation in `docs/SOLUTION.md`
- Check the code comments for implementation details
- Examine the test script for expected behavior

---

**Happy coding! 🚀**
