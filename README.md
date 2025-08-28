# iTunes Search Application - Thamanea Assignment

A full-stack application that searches iTunes API and stores results in a database.

## 🚀 Project Structure

```
Thamanea/
├── backend/          # Nest.js REST API
├── frontend/         # Next.js + Tailwind CSS
├── database/         # PostgreSQL setup scripts
├── docs/            # Documentation
└── README.md        # This file
```

## 🛠 Tech Stack

### Backend
- **Framework**: Nest.js
- **Language**: TypeScript
- **Database**: PostgreSQL with TypeORM
- **API Integration**: iTunes Search API

### Frontend
- **Framework**: Next.js
- **Styling**: Tailwind CSS
- **Language**: TypeScript

## 📋 Features

- [x] Search iTunes API for podcasts/media
- [x] Store search results in PostgreSQL database
- [x] REST API endpoint for search operations
- [x] Beautiful frontend to display search results
- [x] Responsive design with Tailwind CSS

## 🚦 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL
- npm or yarn

### Installation

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run start:dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Database Setup**
   ```bash
   cd database
   # Run PostgreSQL setup scripts
   ```

## 🔗 API Endpoints

- `GET /api/search?term={searchTerm}` - Search iTunes and return stored results

## 📝 Assignment Requirements

This project fulfills the Thamanea full-stack developer assignment requirements:
- ✅ REST API with iTunes integration
- ✅ Database storage of search results
- ✅ Frontend search interface
- ✅ Using preferred tech stack (Nest.js, Next.js, PostgreSQL, Tailwind)

---
*Built for Thamanea (ثمانية) job application*
