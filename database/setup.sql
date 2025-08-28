-- PostgreSQL Database Setup for iTunes Search Application
-- Run this script to create the database and user

-- Create database
CREATE DATABASE itunes_search;

-- Create user (optional - you can use existing postgres user)
-- CREATE USER itunes_user WITH PASSWORD 'secure_password';

-- Grant privileges
-- GRANT ALL PRIVILEGES ON DATABASE itunes_search TO itunes_user;

-- Connect to the database
\c itunes_search;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- The tables will be auto-created by TypeORM synchronize
-- But here's the manual schema for reference:

/*
CREATE TABLE podcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    track_id BIGINT UNIQUE NOT NULL,
    track_name VARCHAR(500) NOT NULL,
    artist_name VARCHAR(300) NOT NULL,
    description TEXT,
    primary_genre_name VARCHAR(100),
    artwork_url_100 VARCHAR(1000),
    artwork_url_600 VARCHAR(1000),
    track_view_url VARCHAR(1000),
    release_date TIMESTAMP,
    country VARCHAR(100),
    kind VARCHAR(50),
    track_count INTEGER,
    search_term VARCHAR(200) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_podcasts_search_term ON podcasts(search_term);
CREATE INDEX idx_podcasts_artist_name ON podcasts(artist_name);
CREATE INDEX idx_podcasts_genre ON podcasts(primary_genre_name);
CREATE INDEX idx_podcasts_track_id ON podcasts(track_id);
*/
