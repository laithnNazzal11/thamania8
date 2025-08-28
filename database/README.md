# Database Setup

## PostgreSQL Setup Instructions

### 1. Install PostgreSQL
```bash
# macOS
brew install postgresql
brew services start postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Windows
# Download from https://www.postgresql.org/download/windows/
```

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Run the setup script
\i setup.sql

# Or manually:
CREATE DATABASE itunes_search;
```

### 3. Environment Configuration
Copy the `env.example` file in the backend directory and update with your database credentials:

```bash
cd ../backend
cp env.example .env
```

Update the `.env` file:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=itunes_search
```

### 4. Test Connection
The Nest.js application will automatically create tables using TypeORM when you start the server:

```bash
cd ../backend
npm run start:dev
```

## Database Schema

The application uses a single `podcasts` table with the following structure:

- **id**: UUID primary key
- **track_id**: iTunes track ID (unique)
- **track_name**: Podcast/media title
- **artist_name**: Creator/artist name
- **description**: Content description
- **primary_genre_name**: Genre category
- **artwork_url_100/600**: Thumbnail URLs
- **track_view_url**: iTunes link
- **release_date**: Publication date
- **search_term**: Original search query
- **created_at/updated_at**: Timestamps

## Indexes
- Search term (for search history)
- Artist name (for filtering)
- Genre (for categorization)
- Track ID (for uniqueness)
