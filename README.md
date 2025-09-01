# 🎵 iTunes Search Application

> **Full-Stack Assignment for Thamanea (ثمانية)**  
> A comprehensive iTunes search application with beautiful UI and robust backend

[![Tech Stack](https://img.shields.io/badge/Stack-Nest.js%20%7C%20Next.js%20%7C%20PostgreSQL-blue)](#tech-stack)
[![Status](https://img.shields.io/badge/Status-Complete-success)](#features)
[![Assignment](https://img.shields.io/badge/Assignment-Thamanea-orange)](#assignment-requirements)

## 🌟 **Live Demo**

**Frontend**: http://localhost:3000 (after setup)  
**Backend API**: http://localhost:3001/api (after setup)  
**Health Check**: http://localhost:3001/api/health

---

## 🚀 **Quick Start**

```bash
# Clone the repository
git clone https://github.com/laithnNazzal11/thamania8.git
cd thamania8

# Quick setup with automated script
./start-app.sh

# Or follow detailed setup guide
open docs/SETUP.md
```

**Prerequisites**: Node.js (v18+), PostgreSQL, npm

---

## 🎯 **Features**

### ✨ **Core Functionality**
- 🔍 **iTunes Search**: Search podcasts, music, audiobooks from iTunes API
- 💾 **Data Persistence**: Store search results in PostgreSQL database
- 📱 **Responsive UI**: Beautiful, mobile-first design with Tailwind CSS
- ⚡ **Real-time Search**: Live search with loading states and error handling
- 📊 **Search History**: View and manage previous search results

### 🛡️ **Quality Features**
- 🔒 **Comprehensive Error Handling**: Global error boundaries and API error management
- 🧪 **Testing Suite**: Automated API testing scripts
- 📚 **Documentation**: Detailed setup and solution documentation
- 🎨 **Modern UI/UX**: Loading skeletons, toast notifications, responsive design
- 🚀 **Performance**: Optimized images, caching, and database indexing

---

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   Next.js       │───▶│    Nest.js      │───▶│   PostgreSQL    │
│   Frontend      │    │    Backend      │    │   Database      │
│                 │    │                 │    │                 │
│ • Search UI     │    │ • REST API      │    │ • Podcast Data  │
│ • Results Grid  │    │ • iTunes API    │    │ • Search Terms  │
│ • Error States  │    │ • Data Storage  │    │ • Indexes       │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Tech Stack**

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 14 + TypeScript | React framework with SSR and app router |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Backend** | Nest.js + TypeScript | Enterprise-grade Node.js framework |
| **Database** | PostgreSQL + TypeORM | Relational database with ORM |
| **HTTP Client** | Axios | Promise-based HTTP client |
| **Notifications** | React Hot Toast | Beautiful toast notifications |

---

## 📂 **Project Structure**

```
Thamanea/
├── 📁 backend/                 # Nest.js API Server
│   ├── 📁 src/
│   │   ├── 📁 modules/
│   │   │   ├── 📁 search/      # Search functionality
│   │   │   └── 📁 database/    # Database configuration
│   │   ├── 📁 common/
│   │   │   ├── 📁 entities/    # TypeORM entities
│   │   │   ├── 📁 dto/         # Data transfer objects
│   │   │   └── 📁 filters/     # Exception filters
│   │   └── 📄 main.ts          # Application entry
│   └── 📄 package.json
├── 📁 frontend/                # Next.js Application
│   ├── 📁 app/                 # App router (Next.js 13+)
│   ├── 📁 components/          # UI components
│   ├── 📁 lib/                 # Utilities & API client
│   └── 📁 types/               # TypeScript definitions
├── 📁 database/                # Database setup scripts
├── 📁 docs/                    # Documentation
│   ├── 📄 SOLUTION.md          # Technical solution details
│   └── 📄 SETUP.md             # Setup instructions
├── 📄 start-app.sh             # Startup script
├── 📄 stop-app.sh              # Shutdown script
├── 📄 test-api.js              # API testing script
└── 📄 README.md                # This file
```

---

## 🔗 **API Endpoints**

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/api/search` | Search iTunes and store results | `?term={query}&media={type}&limit={count}` |
| `GET` | `/api/search/history` | Get stored search results | `?term={query}` (optional) |
| `GET` | `/api/search/popular-terms` | Get popular search terms | None |
| `GET` | `/api/health` | Health check | None |
| `GET` | `/api/` | API information | None |

### **Example Usage**
```bash
# Search for podcasts
curl "http://localhost:3001/api/search?term=technology&media=podcast&limit=10"

# Get search history
curl "http://localhost:3001/api/search/history"

# Health check
curl "http://localhost:3001/api/health"
```

---

## 🛠️ **Setup & Installation**

### **Option 1: Automated Setup (Recommended)**
```bash
git clone https://github.com/laithnNazzal11/thamania8.git
cd thamania8
./start-app.sh
```

### **Option 2: Manual Setup**
```bash
# 1. Database setup
createdb itunes_search

# 2. Backend setup
cd backend
npm install
cp env.example .env  # Edit with your database credentials
npm run start:dev

# 3. Frontend setup (new terminal)
cd frontend
npm install
cp env.local.example .env.local
npm run dev
```

### **Option 3: Detailed Guide**
For comprehensive setup instructions, see: **[📖 docs/SETUP.md](docs/SETUP.md)**

---

## 🧪 **Testing**

### **Automated API Testing**
```bash
# Test all API endpoints
node test-api.js
```

### **Manual Testing**
1. Open http://localhost:3000
2. Search for "technology podcasts"
3. Verify results display correctly
4. Check database contains data

### **Health Check**
```bash
curl http://localhost:3001/api/health
# Expected: {"status":"OK","timestamp":"..."}
```

---

## 📚 **Documentation**

| Document | Description |
|----------|-------------|
| **[📖 Setup Guide](docs/SETUP.md)** | Detailed installation and setup instructions |
| **[🔧 Technical Solution](docs/SOLUTION.md)** | Architecture, challenges, and implementation details |
| **[🚀 API Documentation](backend/src/)** | Code documentation and API specifications |

---

## 📝 **Assignment Requirements**

This project fulfills **all requirements** from the Thamanea assignment:

### ✅ **Backend Requirements**
- ✅ REST API endpoint accepting search terms
- ✅ iTunes Search API integration
- ✅ Database storage of search results
- ✅ Response with stored data
- ✅ Error handling and validation

### ✅ **Frontend Requirements**
- ✅ Search interface with input field
- ✅ Results display page
- ✅ Responsive design with Tailwind CSS
- ✅ Loading states and error handling

### ✅ **Tech Stack Requirements**
- ✅ **Backend**: Nest.js with TypeScript
- ✅ **Frontend**: Next.js with Tailwind CSS
- ✅ **Database**: PostgreSQL with TypeORM
- ✅ **Language**: TypeScript throughout

### ✅ **Additional Features**
- ✅ Comprehensive documentation
- ✅ Error handling and validation
- ✅ Testing scripts and automation
- ✅ Modern UI/UX with best practices

---

## 🎭 **Screenshots**

### 🏠 **Homepage**
Beautiful landing page with search interface and recent results

### 🔍 **Search Results**
Responsive grid layout with podcast cards and artwork

### ⚠️ **Error States**
User-friendly error handling with actionable messages

### 📱 **Mobile Design**
Fully responsive design working perfectly on all devices

---

## 🚀 **Performance & Optimization**

### **Backend Optimizations**
- 🔍 Database indexing for fast searches
- ⚡ Connection pooling for efficient database usage
- 🛡️ Request validation to prevent unnecessary processing
- 📦 Response compression for faster data transfer

### **Frontend Optimizations**
- 🖼️ Next.js Image optimization with lazy loading
- 🎨 Component memoization for expensive renders
- 📦 Automatic code splitting and tree shaking
- 💀 Skeleton loading for better perceived performance

---

## 🔮 **Future Enhancements**

### **Phase 1: Advanced Features**
- 🔍 Advanced search filters (genre, date, rating)
- 👤 User accounts and personal favorites
- 📊 Analytics dashboard and search insights
- 🔄 Real-time search suggestions

### **Phase 2: Scale & Performance**
- 🚀 Redis caching layer
- 📈 Horizontal scaling with load balancers
- 🌍 CDN integration for global performance
- 📱 Progressive Web App features

### **Phase 3: AI & ML**
- 🤖 AI-powered recommendations
- 🔊 Audio content analysis
- 📈 Predictive search analytics
- 🌟 Personalized content discovery

---

## 👨‍💻 **Author**

**Laith Nazzal**  
Full-Stack Developer | Node.js & React Specialist

---

## 📄 **License**

This project was created as part of a job application assignment for **Thamanea (ثمانية)**.

**Assignment Completion**: ✅ All requirements met  
**Code Quality**: ✅ Production-ready standards  
**Documentation**: ✅ Comprehensive and clear  
**Testing**: ✅ Automated and manual testing covered  

---

## 🙏 **Acknowledgments**

- **Thamanea (ثمانية)** for the interesting technical challenge
- **iTunes API** for providing comprehensive media data
- **Open Source Community** for the amazing tools and frameworks used

---


</div>
