#!/bin/bash

# 🆓 Convert Thamanea to Vercel Free Full-Stack
# This script converts your NestJS backend to Next.js API routes

set -e

echo "🆓 Converting Thamanea to Vercel Free Full-Stack..."
echo "================================================"

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

# Create API routes directory
create_api_routes() {
    print_status "Creating Next.js API routes..."
    
    mkdir -p frontend/app/api/search
    mkdir -p frontend/app/api/health
    
    # Create search API route
    cat > frontend/app/api/search/route.ts << 'EOF'
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term');
  const limit = searchParams.get('limit') || '50';
  const media = searchParams.get('media') || 'podcast';

  if (!term) {
    return NextResponse.json(
      { error: 'Search term is required' },
      { status: 400 }
    );
  }

  try {
    // iTunes API call
    const response = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(
        term
      )}&media=${media}&limit=${limit}&country=US&lang=en_us`,
      {
        headers: {
          'User-Agent': 'Thamanea-Search/1.0',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`iTunes API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform data to match your existing format
    const transformedResults = data.results?.map((item: any) => ({
      id: item.trackId || item.collectionId,
      track_id: item.trackId || item.collectionId,
      track_name: item.trackName || item.collectionName,
      artist_name: item.artistName,
      description: item.description || item.longDescription || '',
      primary_genre_name: item.primaryGenreName,
      artwork_url_100: item.artworkUrl100,
      artwork_url_600: item.artworkUrl600,
      track_view_url: item.trackViewUrl,
      release_date: item.releaseDate,
      country: item.country,
      kind: item.kind,
      track_count: item.trackCount,
    })) || [];
    
    return NextResponse.json({
      results: transformedResults,
      resultCount: data.resultCount || 0,
      searchTerm: term,
    });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Search failed. Please try again.' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { searchTerm, limit = 50 } = body;

    if (!searchTerm) {
      return NextResponse.json(
        { error: 'Search term is required' },
        { status: 400 }
      );
    }

    // Call the GET handler
    const url = new URL(request.url);
    url.searchParams.set('term', searchTerm);
    url.searchParams.set('limit', limit.toString());
    
    const searchRequest = new NextRequest(url);
    return GET(searchRequest);
  } catch (error) {
    console.error('POST search error:', error);
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
EOF

    # Create health check API route
    cat > frontend/app/api/health/route.ts << 'EOF'
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Thamanea Search API'
  });
}
EOF

    print_success "API routes created"
}

# Update API service
update_api_service() {
    print_status "Updating API service..."
    
    cat > frontend/lib/api.ts << 'EOF'
// API Service for Vercel deployment
export interface PodcastResult {
  id: string;
  track_id: number;
  track_name: string;
  artist_name: string;
  description: string;
  primary_genre_name: string;
  artwork_url_100: string;
  artwork_url_600: string;
  track_view_url: string;
  release_date: string;
  country: string;
  kind: string;
  track_count: number;
}

export interface SearchResponse {
  results: PodcastResult[];
  resultCount: number;
  searchTerm: string;
}

class ApiService {
  private baseURL: string;

  constructor() {
    // Use relative URLs for Vercel deployment
    this.baseURL = process.env.NODE_ENV === 'production' 
      ? '' // Same domain in production
      : 'http://localhost:3000'; // Local development
  }

  async searchPodcasts(searchTerm: string, limit: number = 50): Promise<SearchResponse> {
    try {
      const response = await fetch(
        `${this.baseURL}/api/search?term=${encodeURIComponent(searchTerm)}&limit=${limit}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Search failed:', error);
      throw new Error(error instanceof Error ? error.message : 'Search failed');
    }
  }

  async checkHealth(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

export const apiService = new ApiService();
export default apiService;
EOF

    print_success "API service updated"
}

# Create Vercel configuration
create_vercel_config() {
    print_status "Creating Vercel configuration..."
    
    cat > frontend/vercel.json << 'EOF'
{
  "functions": {
    "app/api/search/route.ts": {
      "maxDuration": 10
    },
    "app/api/health/route.ts": {
      "maxDuration": 5
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ]
}
EOF

    print_success "Vercel configuration created"
}

# Update environment variables
update_env_vars() {
    print_status "Updating environment variables..."
    
    # Create .env.local for frontend
    cat > frontend/.env.local << 'EOF'
# Vercel deployment configuration
NEXT_PUBLIC_API_URL=""

# Database (optional - add your free database URL)
# DATABASE_URL=your-free-database-url

# iTunes API (no key needed)
ITUNES_API_BASE_URL=https://itunes.apple.com
EOF

    # Create .env.example for reference
    cat > frontend/.env.example << 'EOF'
# API Configuration
NEXT_PUBLIC_API_URL=""

# Database Configuration (choose one free option)
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# PlanetScale
DATABASE_URL=mysql://user:pass@aws.connect.psdb.cloud/dbname?sslaccept=strict

# Neon PostgreSQL
POSTGRES_URL=postgresql://user:pass@ep-cool-paper.us-east-1.postgres.vercel-storage.com/neondb
EOF

    print_success "Environment variables updated"
}

# Update package.json scripts
update_scripts() {
    print_status "Updating package.json scripts..."
    
    cd frontend
    
    # Add Vercel-specific scripts
    npm pkg set scripts.vercel="vercel"
    npm pkg set scripts.vercel:prod="vercel --prod"
    npm pkg set scripts.deploy="vercel --prod"
    
    cd ..
    
    print_success "Scripts updated"
}

# Create deployment instructions
create_instructions() {
    print_status "Creating deployment instructions..."
    
    cat > frontend/VERCEL_DEPLOYMENT.md << 'EOF'
# 🆓 Vercel Free Deployment Instructions

## 🚀 Quick Deploy

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Navigate to frontend
cd frontend

# 3. Login to Vercel
vercel login

# 4. Deploy
vercel

# 5. For production
vercel --prod
```

## 🌐 Your Live URLs

After deployment, you'll get:
- **Frontend**: https://your-app.vercel.app
- **API**: https://your-app.vercel.app/api/search
- **Health**: https://your-app.vercel.app/api/health

## 🔧 Environment Variables

In Vercel dashboard, add:
- `NEXT_PUBLIC_API_URL` = (leave empty for same domain)

## 📋 Free Database Options

Choose one:
- **Supabase**: Free PostgreSQL (500MB)
- **PlanetScale**: Free MySQL (10GB)  
- **Neon**: Free PostgreSQL (10GB)
- **MongoDB Atlas**: Free MongoDB (512MB)

## ✅ Testing

```bash
# Test locally
npm run dev

# Test API
curl http://localhost:3000/api/search?term=coffee

# Test health
curl http://localhost:3000/api/health
```

## 🎯 What's Included

✅ Frontend on Vercel CDN
✅ API routes as serverless functions
✅ Automatic HTTPS
✅ Global deployment
✅ Git integration
✅ Custom domain support (1 free)

## ⚠️ Free Tier Limits

- Function timeout: 10 seconds
- Bandwidth: 100GB/month  
- Build time: 6000 minutes/month
- File size: 50MB max
EOF

    print_success "Deployment instructions created"
}

# Main conversion function
main() {
    echo "Starting conversion to Vercel free tier..."
    echo "Time: $(date)"
    echo ""
    
    # Create API routes
    create_api_routes
    echo ""
    
    # Update API service
    update_api_service
    echo ""
    
    # Create Vercel config
    create_vercel_config
    echo ""
    
    # Update environment variables
    update_env_vars
    echo ""
    
    # Update scripts
    update_scripts
    echo ""
    
    # Create instructions
    create_instructions
    echo ""
    
    print_success "🎉 Conversion completed!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. cd frontend"
    echo "2. npm install -g vercel"
    echo "3. vercel login"
    echo "4. vercel --prod"
    echo ""
    echo "🌐 You'll get a free URL like: https://thamanea.vercel.app"
    echo "📖 See frontend/VERCEL_DEPLOYMENT.md for detailed instructions"
}

# Parse arguments
case "${1:-convert}" in
    "convert")
        main
        ;;
    "help")
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  convert   Convert project for Vercel free tier (default)"
        echo "  help      Show this help"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage"
        exit 1
        ;;
esac
